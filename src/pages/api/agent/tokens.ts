import type { NextApiRequest, NextApiResponse } from 'next'
import { readSessionCookie } from '@/lib/auth/session'
import { createSupabaseServiceClient } from '@/lib/supabase/server'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = readSessionCookie(req)
  if (!session) return res.status(401).json({ error: 'Unauthorized' })

  const service = createSupabaseServiceClient()
  const { data } = await service
    .from('user_agent_dna')
    .select('token_balance')
    .eq('user_id', session.userId)
    .maybeSingle()

  return res.json({ balance: data?.token_balance ?? 100 })
}
