import type { AgentSession, AgentMessage } from './types'
import { hydrateAgentDNA, updateAgentDNA } from './dna'
import { createSupabaseServiceClient } from '@/lib/supabase/server'

function generateSessionToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  let token = ''
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

export async function createAgentSession(userId: string): Promise<AgentSession> {
  const supabase = createSupabaseServiceClient()
  const dna = await hydrateAgentDNA(userId)

  const now = new Date().toISOString()
  const sessionId = crypto.randomUUID()
  const sessionToken = generateSessionToken()

  const session: AgentSession = {
    id: sessionId,
    userId,
    sessionToken,
    startedAt: now,
    lastActivityAt: now,
    endedAt: null,
    messageCount: 0,
    tokensUsedInSession: 0,
    contextSnapshot: dna,
    createdAt: now
  }

  await supabase.from('agent_sessions').insert({
    id: session.id,
    user_id: userId,
    session_token: session.sessionToken,
    started_at: session.startedAt,
    last_activity_at: session.lastActivityAt,
    ended_at: session.endedAt,
    message_count: session.messageCount,
    tokens_used_in_session: session.tokensUsedInSession,
    context_snapshot: session.contextSnapshot,
    created_at: session.createdAt
  })

  return session
}

export async function getAgentSession(userId: string, sessionId?: string): Promise<AgentSession | null> {
  const supabase = createSupabaseServiceClient()

  const result = sessionId
    ? await supabase
      .from('agent_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .maybeSingle()
    : await supabase
      .from('agent_sessions')
      .select('*')
      .eq('user_id', userId)
      .is('ended_at', null)
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle()

  const session = result.data
  if (!session) return null

  return {
    id: session.id,
    userId: session.user_id,
    sessionToken: session.session_token,
    startedAt: session.started_at,
    lastActivityAt: session.last_activity_at,
    endedAt: session.ended_at,
    messageCount: session.message_count,
    tokensUsedInSession: session.tokens_used_in_session,
    contextSnapshot: session.context_snapshot,
    createdAt: session.created_at
  }
}

export async function resumeAgentSession(userId: string, sessionId: string): Promise<AgentSession> {
  const supabase = createSupabaseServiceClient()

  const result = await supabase
    .from('agent_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .maybeSingle()

  if (!result.data) {
    throw new Error('Session not found')
  }

  const session = result.data
  return {
    id: session.id,
    userId: session.user_id,
    sessionToken: session.session_token,
    startedAt: session.started_at,
    lastActivityAt: session.last_activity_at,
    endedAt: session.ended_at,
    messageCount: session.message_count,
    tokensUsedInSession: session.tokens_used_in_session,
    contextSnapshot: session.context_snapshot,
    createdAt: session.created_at
  }
}

export async function addSessionMessage(
  userId: string,
  sessionId: string,
  role: 'user' | 'assistant',
  content: string,
  tokensConsumed?: number
): Promise<AgentMessage> {
  const supabase = createSupabaseServiceClient()

  const now = new Date().toISOString()
  const messageId = crypto.randomUUID()

  const message: AgentMessage = {
    id: messageId,
    userId,
    sessionId,
    role,
    content,
    tokensConsumed: tokensConsumed ?? null,
    metadata: {},
    createdAt: now
  }

  await supabase.from('agent_messages').insert({
    id: message.id,
    user_id: userId,
    session_id: sessionId,
    role,
    content,
    tokens_consumed: tokensConsumed ?? null,
    metadata: message.metadata,
    created_at: now
  })

  const sessionUpdate = await supabase
    .from('agent_sessions')
    .select('message_count, tokens_used_in_session')
    .eq('id', sessionId)
    .maybeSingle()

  const currentCount = sessionUpdate.data?.message_count ?? 0
  const currentTokens = sessionUpdate.data?.tokens_used_in_session ?? 0

  await supabase
    .from('agent_sessions')
    .update({
      message_count: currentCount + 1,
      tokens_used_in_session: (tokensConsumed ?? 0) + currentTokens,
      last_activity_at: now
    })
    .eq('id', sessionId)

  return message
}

export async function getSessionMessages(
  userId: string,
  sessionId: string,
  limit: number = 50,
  offset: number = 0
): Promise<{ messages: AgentMessage[]; hasMore: boolean }> {
  const supabase = createSupabaseServiceClient()

  const countResult = await supabase
    .from('agent_messages')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .eq('session_id', sessionId)

  const total = countResult.count ?? 0

  const result = await supabase
    .from('agent_messages')
    .select('*')
    .eq('user_id', userId)
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1)

  const messages: AgentMessage[] = (result.data ?? []).map(msg => ({
    id: msg.id,
    userId: msg.user_id,
    sessionId: msg.session_id,
    role: msg.role,
    content: msg.content,
    tokensConsumed: msg.tokens_consumed,
    metadata: msg.metadata ?? {},
    createdAt: msg.created_at
  }))

  return {
    messages,
    hasMore: offset + limit < total
  }
}

export async function endAgentSession(userId: string, sessionId: string): Promise<void> {
  const supabase = createSupabaseServiceClient()

  const now = new Date().toISOString()

  const sessionResult = await supabase
    .from('agent_sessions')
    .select('message_count, tokens_used_in_session')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .maybeSingle()

  if (sessionResult.data) {
    const dna = await hydrateAgentDNA(userId)
    const updatedMessages = dna.totalMessagesExchanged + (sessionResult.data.message_count ?? 0)

    await updateAgentDNA(userId, {
      totalMessagesExchanged: updatedMessages,
      lastActiveAt: now
    })
  }

  await supabase
    .from('agent_sessions')
    .update({ ended_at: now })
    .eq('id', sessionId)
    .eq('user_id', userId)
}

export async function getRecentSessions(userId: string, limit: number = 10): Promise<AgentSession[]> {
  const supabase = createSupabaseServiceClient()

  const result = await supabase
    .from('agent_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(limit)

  return (result.data ?? []).map(session => ({
    id: session.id,
    userId: session.user_id,
    sessionToken: session.session_token,
    startedAt: session.started_at,
    lastActivityAt: session.last_activity_at,
    endedAt: session.ended_at,
    messageCount: session.message_count,
    tokensUsedInSession: session.tokens_used_in_session,
    contextSnapshot: session.context_snapshot,
    createdAt: session.created_at
  }))
}
