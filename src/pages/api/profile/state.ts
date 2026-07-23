import type { NextApiRequest, NextApiResponse } from 'next'
import { createSupabaseServiceClient } from '@/lib/supabase/server'
import { readSessionCookie } from '@/lib/auth/session'
import { detectReadAnomaly, logSecurityEvent, sanitizeRows } from '@/lib/security/dataGuard'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const session = readSessionCookie(req)
  if (!session) return res.status(401).json({ error: 'Not authenticated' })

  if (detectReadAnomaly(session.userId)) {
    const supabase = createSupabaseServiceClient()
    await logSecurityEvent(supabase, session.userId, 'read_rate_exceeded', { route: '/api/profile/state' })
    return res.status(429).json({ error: 'Too many requests' })
  }

  try {
    const supabase = createSupabaseServiceClient()
    const userId = session.userId

    const [user, profile, privacy, answers, wardrobe, recommendations, auditEvents] = await Promise.all([
      supabase.from('users').select('*').eq('id', userId).maybeSingle(),
      supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('privacy_settings').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('style_answers').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
      supabase.from('wardrobe_items').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20),
      supabase.from('recommendation_runs').select('id, created_at, context, recommendation_items(*)').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
      supabase.from('audit_events').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20)
    ])

    return res.status(200).json({
      user: user.data ? sanitizeRows([user.data])[0] : null,
      profile: profile.data ? sanitizeRows([profile.data])[0] : null,
      privacy: privacy.data ? sanitizeRows([privacy.data])[0] : null,
      answers: sanitizeRows(answers.data ?? []),
      wardrobe: sanitizeRows(wardrobe.data ?? []),
      recommendationRuns: sanitizeRows(recommendations.data ?? []),
      auditEvents: sanitizeRows(auditEvents.data ?? []),
      nextRoute: profile.data?.status === 'complete' ? '/dashboard' : '/quiz'
    })
  } catch (error) {
    return res.status(500).json({ error: 'Server error' })
  }
}

