import type { NextApiRequest, NextApiResponse } from 'next'
import { createSupabaseAnonClient, createSupabaseServiceClient } from '@/lib/supabase/server'
import { setSessionCookie } from '@/lib/auth/session'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code as string | undefined

  if (!code) {
    return res.redirect('/login?error=oauth_cancelled')
  }

  try {
    const anonClient = createSupabaseAnonClient()
    const { data, error } = await anonClient.auth.exchangeCodeForSession(code)

    if (error || !data.session || !data.user) {
      return res.redirect('/login?error=oauth_failed')
    }

    const service = createSupabaseServiceClient()
    const now = new Date().toISOString()
    const userId = data.user.id
    const email = data.user.email ?? ''
    const fullName = data.user.user_metadata?.full_name
      ?? data.user.user_metadata?.name
      ?? null

    await service.from('users').upsert({
      id: userId,
      auth_user_id: userId,
      email,
      full_name: fullName,
      onboarding_status: 'draft',
      updated_at: now
    }, { onConflict: 'id' })

    await service.from('style_profiles').upsert({
      user_id: userId,
      status: 'draft',
      updated_at: now
    }, { onConflict: 'user_id', ignoreDuplicates: true })

    await service.from('privacy_settings').upsert({
      user_id: userId,
      allow_personalization: true,
      allow_community_visibility: false,
      allow_marketing_emails: false,
      updated_at: now
    }, { onConflict: 'user_id', ignoreDuplicates: true })

    const { data: profile } = await service
      .from('style_profiles')
      .select('status')
      .eq('user_id', userId)
      .maybeSingle()

    await service.from('audit_events').insert({
      user_id: userId,
      event_type: 'account_login',
      metadata: { source: 'google_oauth' }
    })

    setSessionCookie(res, {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      userId,
      email
    })

    const next = profile?.status === 'complete' ? '/dashboard' : '/quiz'
    return res.redirect(next)
  } catch {
    return res.redirect('/login?error=oauth_failed')
  }
}
