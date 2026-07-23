import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { createSupabaseAnonClient, createSupabaseServiceClient } from '@/lib/supabase/server'
import { formatZodError, loginSchema } from '@/lib/validation/auth'
import { setSessionCookie } from '@/lib/auth/session'
import { rateLimit, getClientIp } from '@/lib/security/rateLimit'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const ip = getClientIp(req)
  const { allowed, retryAfter } = rateLimit(`login:${ip}`, { windowMs: 60_000, max: 10 })
  if (!allowed) {
    res.setHeader('Retry-After', retryAfter)
    return res.status(429).json({ error: 'Too many login attempts. Try again later.' })
  }

  try {
    const { email, password } = loginSchema.parse(req.body)
    const supabase = createSupabaseAnonClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) return res.status(400).json({ error: 'Email or password is incorrect.' })
    if (!data.user || !data.session) return res.status(400).json({ error: 'Email or password is incorrect.' })

    const service = createSupabaseServiceClient()
    const now = new Date().toISOString()

    const { data: existingUser } = await service
      .from('users')
      .select('id')
      .eq('id', data.user.id)
      .maybeSingle()

    if (!existingUser) {
      await service
        .from('users')
        .insert({
          id: data.user.id,
          auth_user_id: data.user.id,
          email: data.user.email ?? email,
          full_name: data.user.user_metadata?.full_name ?? null,
          onboarding_status: 'draft',
          updated_at: now
        })
    }

    await service
      .from('style_profiles')
      .upsert({
        user_id: data.user.id,
        status: 'draft',
        updated_at: now
      }, { onConflict: 'user_id', ignoreDuplicates: true })

    const { data: profile } = await service
      .from('style_profiles')
      .select('status')
      .eq('user_id', data.user.id)
      .single()

    const next = profile?.status === 'complete' ? '/dashboard' : '/quiz'

    await service
      .from('audit_events')
      .insert({
        user_id: data.user.id,
        event_type: 'account_login',
        metadata: { source: 'login' }
      })

    setSessionCookie(res, {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      userId: data.user.id,
      email: data.user.email ?? email
    })

    return res.status(200).json({ session: data.session, next })
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
