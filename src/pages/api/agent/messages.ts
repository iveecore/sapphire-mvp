import type { NextApiRequest, NextApiResponse } from 'next'
import { readSessionCookie } from '@/lib/auth/session'
import { detectReadAnomaly, logSecurityEvent } from '@/lib/security/dataGuard'
import { createSupabaseServiceClient } from '@/lib/supabase/server'
import { getSessionMessages } from '@/lib/agent/session'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const session = readSessionCookie(req)
  if (!session) return res.status(401).json({ error: 'Not authenticated' })

  if (detectReadAnomaly(session.userId)) {
    const supabase = createSupabaseServiceClient()
    await logSecurityEvent(supabase, session.userId, 'messages_rate_exceeded', { route: '/api/agent/messages' })
    return res.status(429).json({ error: 'Too many requests' })
  }

  try {
    const userId = session.userId
    const { sessionId, limit, offset } = req.query

    if (typeof sessionId !== 'string') {
      return res.status(400).json({ error: 'sessionId is required' })
    }

    const limitNum = Math.min(parseInt(limit as string) || 50, 100)
    const offsetNum = Math.max(parseInt(offset as string) || 0, 0)

    const { messages, hasMore } = await getSessionMessages(userId, sessionId, limitNum, offsetNum)

    return res.status(200).json({
      messages: messages.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        tokensConsumed: m.tokensConsumed,
        metadata: m.metadata,
        createdAt: m.createdAt
      })),
      hasMore,
      count: messages.length
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Server error'
    return res.status(500).json({ error: errorMessage })
  }
}
