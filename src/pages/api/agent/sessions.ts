import type { NextApiRequest, NextApiResponse } from 'next'
import { readSessionCookie } from '@/lib/auth/session'
import { detectReadAnomaly, logSecurityEvent } from '@/lib/security/dataGuard'
import { createSupabaseServiceClient } from '@/lib/supabase/server'
import { getRecentSessions, endAgentSession } from '@/lib/agent/session'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'DELETE') return res.status(405).end()

  const session = readSessionCookie(req)
  if (!session) return res.status(401).json({ error: 'Not authenticated' })

  if (detectReadAnomaly(session.userId)) {
    const supabase = createSupabaseServiceClient()
    await logSecurityEvent(supabase, session.userId, 'sessions_rate_exceeded', { route: '/api/agent/sessions' })
    return res.status(429).json({ error: 'Too many requests' })
  }

  try {
    const userId = session.userId

    if (req.method === 'GET') {
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 100)
      const sessions = await getRecentSessions(userId, limit)

      return res.status(200).json({
        sessions: sessions.map(s => ({
          id: s.id,
          startedAt: s.startedAt,
          lastActivityAt: s.lastActivityAt,
          endedAt: s.endedAt,
          messageCount: s.messageCount,
          tokensUsedInSession: s.tokensUsedInSession
        }))
      })
    }

    if (req.method === 'DELETE') {
      const { sessionId } = req.query

      if (typeof sessionId !== 'string') {
        return res.status(400).json({ error: 'sessionId is required' })
      }

      await endAgentSession(userId, sessionId)

      return res.status(200).json({ message: 'Session ended' })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Server error'
    return res.status(500).json({ error: errorMessage })
  }
}
