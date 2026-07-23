import type { NextApiRequest, NextApiResponse } from 'next'
import { createSupabaseServiceClient } from '@/lib/supabase/server'
import { readSessionCookie } from '@/lib/auth/session'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const session = readSessionCookie(req)
  if (!session) return res.status(401).json({ error: 'Not authenticated' })

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
      user: user.data ?? null,
      profile: profile.data ?? null,
      privacy: privacy.data ?? null,
      answers: answers.data ?? [],
      wardrobe: wardrobe.data ?? [],
      recommendationRuns: recommendations.data ?? [],
      auditEvents: auditEvents.data ?? [],
      nextRoute: profile.data?.status === 'complete' ? '/dashboard' : '/quiz'
    })
  } catch (error) {
    return res.status(500).json({ error: 'Server error' })
  }
}

