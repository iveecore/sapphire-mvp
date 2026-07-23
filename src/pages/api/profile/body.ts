import type { NextApiRequest, NextApiResponse } from 'next'
import { readSessionCookie } from '@/lib/auth/session'
import { createSupabaseServiceClient } from '@/lib/supabase/server'
import { bodyProfileSchema } from '@/lib/validation/profile'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = readSessionCookie(req)
  if (!session) return res.status(401).json({ error: 'Not authenticated' })

  const supabase = createSupabaseServiceClient()
  const userId = session.userId

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('body_profiles').select('*').eq('user_id', userId).maybeSingle()
    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json({ bodyProfile: data ?? null })
  }

  if (req.method === 'POST') {
    const payload = bodyProfileSchema.parse(req.body)
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from('body_profiles')
      .upsert(
        {
          user_id: userId,
          ...payload,
          updated_at: now
        },
        { onConflict: 'user_id' }
      )
      .select('*')
      .single()

    if (error) return res.status(400).json({ error: error.message })

    await supabase.from('audit_events').insert({
      user_id: userId,
      event_type: 'profile.updated',
      metadata: { source: 'body-profile' }
    })

    return res.status(200).json({ bodyProfile: data })
  }

  return res.status(405).end()
}

