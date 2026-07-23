import type { NextApiRequest, NextApiResponse } from 'next'
import { readSessionCookie } from '@/lib/auth/session'
import { detectReadAnomaly, logSecurityEvent } from '@/lib/security/dataGuard'
import { createSupabaseServiceClient } from '@/lib/supabase/server'
import { hydrateAgentDNA } from '@/lib/agent/dna'
import { createAgentSession, getAgentSession, addSessionMessage, getSessionMessages } from '@/lib/agent/session'
import { getUserTokenBalance, validateTokenAvailability, deductTokens, estimateTokenCost } from '@/lib/agent/tokens'
import { streamAgentResponse, buildSystemPromptForDNA } from '@/lib/agent/anthropic'

interface ChatRequest {
  message: string
  sessionId?: string
}

async function sendStreamEvent(res: NextApiResponse, type: string, data: any) {
  res.write(`event: ${type}\n`)
  res.write(`data: ${JSON.stringify(data)}\n\n`)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = readSessionCookie(req)
  if (!session) return res.status(401).json({ error: 'Not authenticated' })

  if (detectReadAnomaly(session.userId)) {
    const supabase = createSupabaseServiceClient()
    await logSecurityEvent(supabase, session.userId, 'chat_rate_exceeded', { route: '/api/agent/chat' })
    return res.status(429).json({ error: 'Too many requests' })
  }

  const body = req.body as ChatRequest
  if (!body.message || typeof body.message !== 'string') {
    return res.status(400).json({ error: 'Message is required' })
  }

  const userMessage = body.message.trim()
  if (userMessage.length === 0 || userMessage.length > 2000) {
    return res.status(400).json({ error: 'Message must be 1-2000 characters' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const supabase = createSupabaseServiceClient()
    const userId = session.userId

    let agentSession = await getAgentSession(userId, body.sessionId)
    if (!agentSession) {
      agentSession = await createAgentSession(userId)
    }

    const tokenBalance = await getUserTokenBalance(userId)
    const estimatedCost = estimateTokenCost(userMessage.length)

    if (!await validateTokenAvailability(userId, estimatedCost)) {
      await sendStreamEvent(res, 'error', {
        error: 'Insufficient tokens. Please purchase more tokens to continue.',
        balance: tokenBalance,
        required: estimatedCost
      })
      res.end()
      return
    }

    const dna = await hydrateAgentDNA(userId)
    const systemPrompt = buildSystemPromptForDNA(dna)

    const { messages: sessionMessages } = await getSessionMessages(userId, agentSession.id, 100, 0)

    await addSessionMessage(userId, agentSession.id, 'user', userMessage)

    let fullResponse = ''
    let actualTokensUsed = 0

    for await (const event of streamAgentResponse(userMessage, systemPrompt, sessionMessages)) {
      if (event.token) {
        await sendStreamEvent(res, 'token', { token: event.token })
        fullResponse += event.token
      }

      if (event.usage) {
        actualTokensUsed = event.usage.outputTokens
      }
    }

    await addSessionMessage(userId, agentSession.id, 'assistant', fullResponse, actualTokensUsed)

    if (actualTokensUsed > 0) {
      await deductTokens(userId, actualTokensUsed, 'message_consumption', agentSession.id)
    }

    const newBalance = await getUserTokenBalance(userId)

    await sendStreamEvent(res, 'done', {
      tokensUsed: actualTokensUsed,
      newBalance,
      sessionId: agentSession.id
    })

    res.end()
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Server error'

    await sendStreamEvent(res, 'error', { error: errorMessage })
    res.end()
  }
}
