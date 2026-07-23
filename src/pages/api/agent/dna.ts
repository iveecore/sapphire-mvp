import type { NextApiRequest, NextApiResponse } from 'next'
import { readSessionCookie } from '@/lib/auth/session'
import { detectReadAnomaly, logSecurityEvent } from '@/lib/security/dataGuard'
import { createSupabaseServiceClient } from '@/lib/supabase/server'
import { hydrateAgentDNA, setAgentName } from '@/lib/agent/dna'
import { getUserTokenBalance } from '@/lib/agent/tokens'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'PUT') return res.status(405).end()

  const session = readSessionCookie(req)
  if (!session) return res.status(401).json({ error: 'Not authenticated' })

  if (detectReadAnomaly(session.userId)) {
    const supabase = createSupabaseServiceClient()
    await logSecurityEvent(supabase, session.userId, 'dna_read_rate_exceeded', { route: '/api/agent/dna' })
    return res.status(429).json({ error: 'Too many requests' })
  }

  try {
    const userId = session.userId

    if (req.method === 'GET') {
      const dna = await hydrateAgentDNA(userId)
      const tokenBalance = await getUserTokenBalance(userId)

      return res.status(200).json({
        agentName: dna.agentName,
        personaName: dna.personaName,
        stylePersonality: dna.stylePersonality,
        bodyProfile: dna.bodyProfileSummary,
        moodPatterns: dna.moodPatterns,
        conversationStyle: dna.conversationStyle,
        totalMessages: dna.totalMessagesExchanged,
        tokenBalance,
        createdAt: dna.createdAt,
        updatedAt: dna.updatedAt
      })
    }

    if (req.method === 'PUT') {
      const { agentName } = req.body

      if (typeof agentName !== 'string') {
        return res.status(400).json({ error: 'agentName must be a string' })
      }

      await setAgentName(userId, agentName)
      const updated = await hydrateAgentDNA(userId)

      return res.status(200).json({
        agentName: updated.agentName,
        personaName: updated.personaName,
        message: 'Agent name updated'
      })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Server error'
    return res.status(500).json({ error: errorMessage })
  }
}
