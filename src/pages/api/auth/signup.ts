import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { createSupabaseAnonClient, createSupabaseServiceClient } from '@/lib/supabase/server'
import { formatZodError, signupSchema } from '@/lib/validation/auth'
import { setSessionCookie } from '@/lib/auth/session'
import { rateLimit, getClientIp } from '@/lib/security/rateLimit'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const ip = getClientIp(req)
  const { allowed, retryAfter } = rateLimit(`signup:${ip}`, { windowMs: 3_600_000, max: 5 })
  if (!allowed) {
    res.setHeader('Retry-After', retryAfter)
    return res.status(429).json({ error: 'Too many signup attempts. Try again later.' })
  }

  try {
    const { email, password, fullName } = signupSchema.parse(req.body)
    const supabase = createSupabaseServiceClient()

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        full_name: fullName
      },
      email_confirm: true
    })

    if (error) return res.status(400).json({ error: error.message })
    if (!data.user) return res.status(500).json({ error: 'Account could not be created.' })

    const userId = data.user.id
    const now = new Date().toISOString()

    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        auth_user_id: userId,
        email,
        full_name: fullName ?? null,
        onboarding_status: 'draft',
        updated_at: now
      })

    if (userError) {
      await supabase.auth.admin.deleteUser(userId)
      return res.status(400).json({ error: userError.message })
    }

    const { error: profileError } = await supabase
      .from('style_profiles')
      .upsert({
        user_id: userId,
        status: 'draft',
        updated_at: now
      }, { onConflict: 'user_id' })

    if (profileError) {
      await supabase.auth.admin.deleteUser(userId)
      return res.status(400).json({ error: profileError.message })
    }

    await supabase
      .from('privacy_settings')
      .upsert({
        user_id: userId,
        allow_personalization: true,
        allow_community_visibility: false,
        allow_marketing_emails: false,
        updated_at: now
      }, { onConflict: 'user_id' })

    await supabase
      .from('audit_events')
      .insert({
        user_id: userId,
        event_type: 'account_created',
        metadata: { source: 'signup' }
      })

    const loginClient = createSupabaseAnonClient()
    const login = await loginClient.auth.signInWithPassword({ email, password })

    if (login.data.session) {
      setSessionCookie(res, {
        accessToken: login.data.session.access_token,
        refreshToken: login.data.session.refresh_token,
        userId,
        email
      })
    }

    return res.status(201).json({ user: data.user, next: '/quiz' })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: formatZodError(e) })
    }

    if (e instanceof Error && e.message.startsWith('Missing required environment variable')) {
      return res.status(500).json({ error: e.message })
    }

    return res.status(500).json({ error: 'Server error' })
  }
}
