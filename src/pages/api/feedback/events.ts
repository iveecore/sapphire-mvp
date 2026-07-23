import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { readSessionCookie } from '@/lib/auth/session'
import { createSupabaseServiceClient } from '@/lib/supabase/server'
import { feedbackSchema } from '@/lib/validation/platform'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = readSessionCookie(req)
  if (!session) return res.status(401).json({ error: 'Not authenticated' })

  try {
    const payload = feedbackSchema.parse(req.body)
    const supabase = createSupabaseServiceClient()

    const { data } = await supabase
      .from('feedback_events')
      .insert({
        user_id: session.userId,
        recommendation_id: payload.recommendationId,
        outcome: payload.outcome,
        note: payload.note ?? null
      })
      .select('*')
      .single()

    await supabase.from('audit_events').insert({
      user_id: session.userId,
      event_type: 'recommendation.feedback_submitted',
      metadata: { recommendation_id: payload.recommendationId, outcome: payload.outcome }
    })

    await supabase.from('memory_events').insert({
      user_id: session.userId,
      memory_type: 'recommendation.feedback',
      payload
    })

    return res.status(201).json({ feedback: data })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0]?.message ?? 'Invalid feedback.' })
    }
    return res.status(500).json({ error: 'Server error' })
  }
}

