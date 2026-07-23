import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { readSessionCookie } from '@/lib/auth/session'
import { createSupabaseServiceClient } from '@/lib/supabase/server'
import { onboardingSchema } from '@/lib/validation/platform'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = readSessionCookie(req)
  if (!session) return res.status(401).json({ error: 'Not authenticated' })

  try {
    const { answers, status } = onboardingSchema.parse(req.body)
    const supabase = createSupabaseServiceClient()
    const userId = session.userId
    const now = new Date().toISOString()

    await supabase.from('style_answers').delete().eq('user_id', userId)
    await supabase.from('style_answers').insert(
      answers.map((answer) => ({
        user_id: userId,
        question_id: answer.questionId,
        question: answer.question,
        answer: answer.answer
      }))
    )

    await supabase.from('profiles').upsert(
      {
        user_id: userId,
        status,
        updated_at: now
      },
      { onConflict: 'user_id' }
    )

    await supabase.from('style_profiles').upsert(
      {
        user_id: userId,
        status,
        style_vibe: answers.find((a) => a.questionId === 'style-vibe')?.answer ?? null,
        colors: [answers.find((a) => a.questionId === 'favorite-colors')?.answer ?? 'Unknown'],
        budget: Number((answers.find((a) => a.questionId === 'budget')?.answer ?? '$0-50').replace(/[^0-9]/g, '') || '0'),
        lifestyle: answers.find((a) => a.questionId === 'lifestyle')?.answer ?? null,
        updated_at: now
      },
      { onConflict: 'user_id' }
    )

    await supabase.from('audit_events').insert({
      user_id: userId,
      event_type: 'profile.updated',
      metadata: { source: 'onboarding', question_count: answers.length }
    })

    await supabase.from('memory_events').insert({
      user_id: userId,
      memory_type: 'style.preference',
      payload: { answers }
    })

    await supabase.from('users').update({ onboarding_status: status, updated_at: now }).eq('id', userId)

    return res.status(200).json({ ok: true, next: '/dashboard' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0]?.message ?? 'Invalid onboarding data.' })
    }
    return res.status(500).json({ error: 'Server error' })
  }
}

