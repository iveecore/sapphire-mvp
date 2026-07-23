import type { NextApiRequest, NextApiResponse } from 'next'
import { readSessionCookie } from '@/lib/auth/session'
import { createSupabaseServiceClient } from '@/lib/supabase/server'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const session = readSessionCookie(req)
  if (!session) return res.status(401).json({ error: 'Not authenticated' })

  try {
    const supabase = createSupabaseServiceClient()

    const [privacy, permissions, auditEvents, memoryEvents] = await Promise.all([
      supabase.from('privacy_settings').select('*').eq('user_id', session.userId).maybeSingle(),
      supabase.from('permissions').select('*').eq('user_id', session.userId).order('created_at', { ascending: false }).limit(20),
      supabase.from('audit_events').select('*').eq('user_id', session.userId).order('created_at', { ascending: false }).limit(50),
      supabase.from('memory_events').select('*').eq('user_id', session.userId).order('created_at', { ascending: false }).limit(20)
    ])

    return res.status(200).json({
      privacy: privacy.data ?? null,
      permissions: permissions.data ?? [],
      auditEvents: auditEvents.data ?? [],
      memoryEvents: memoryEvents.data ?? []
    })
  } catch (error) {
    return res.status(500).json({ error: 'Server error' })
  }
}

