import type { NextApiRequest, NextApiResponse } from 'next'
import { readSessionCookie } from '@/lib/auth/session'
import { createSupabaseServiceClient } from '@/lib/supabase/server'
import { openRouterChat, getModelForTier, FREE_MODEL, ChatMessage } from '@/lib/openrouter/client'

const TOKEN_COST_PER_MESSAGE = 1

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = readSessionCookie(req)
  if (!session) return res.status(401).json({ error: 'Unauthorized' })

  const { messages, model: requestedModel } = req.body as {
    messages: ChatMessage[]
    model?: string
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages required' })
  }

  const service = createSupabaseServiceClient()

  const { data: dna } = await service
    .from('user_agent_dna')
    .select('token_balance, subscription_tier, preferred_model, persona_name, style_context')
    .eq('user_id', session.userId)
    .maybeSingle()

  const tier = dna?.subscription_tier ?? 'free'
  const tokenBalance = dna?.token_balance ?? 0

  if (tokenBalance < TOKEN_COST_PER_MESSAGE) {
    return res.status(402).json({ error: 'Insufficient tokens', tokenBalance })
  }

  const model = requestedModel
    ? getModelForTier(tier, requestedModel)
    : getModelForTier(tier, dna?.preferred_model)

  const systemPrompt = buildSystemPrompt(dna)
  const fullMessages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ]

  const orRes = await openRouterChat({ model, messages: fullMessages, stream: true })

  if (!orRes.ok) {
    const err = await orRes.text()
    return res.status(502).json({ error: 'AI service error', detail: err })
  }

  await service
    .from('user_agent_dna')
    .update({ token_balance: tokenBalance - TOKEN_COST_PER_MESSAGE })
    .eq('user_id', session.userId)

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Model', model)
  res.setHeader('X-Tokens-Remaining', String(tokenBalance - TOKEN_COST_PER_MESSAGE))

  const reader = orRes.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) return res.status(500).end()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      res.write(decoder.decode(value, { stream: true }))
    }
  } finally {
    res.end()
  }
}

function buildSystemPrompt(dna: Record<string, unknown> | null): string {
  const name = (dna?.persona_name as string) ?? 'Sapphire'
  const styleCtx = (dna?.style_context as string) ?? ''

  return `You are ${name}, a personal AI stylist and companion for a woman using the Sapphire app.
You are warm, confident, knowledgeable about fashion, and speak in a way that resonates with Gen Z women.
You give real, specific, actionable style advice — never generic.
${styleCtx ? `\nUser style context: ${styleCtx}` : ''}
Keep responses concise unless the user asks for detail. Use emojis sparingly but naturally.`
}

export const config = { api: { bodyParser: true } }
