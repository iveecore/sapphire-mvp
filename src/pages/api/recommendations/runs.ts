import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { readSessionCookie } from '@/lib/auth/session'
import { createSupabaseServiceClient } from '@/lib/supabase/server'
import { buildRecommendationItems } from '@/lib/platform/scoring'
import type { StyleAnswer } from '@/lib/platform/types'

const schema = z.object({
  regenerate: z.boolean().optional().default(false)
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = readSessionCookie(req)
  if (!session) return res.status(401).json({ error: 'Not authenticated' })

  try {
    schema.parse(req.body)
    const supabase = createSupabaseServiceClient()
    const userId = session.userId

    const [{ data: answers }, { data: wardrobe }] = await Promise.all([
      supabase.from('style_answers').select('*').eq('user_id', userId),
      supabase.from('wardrobe_items').select('*').eq('user_id', userId).limit(20)
    ])

    const { data: bodyProfile } = await supabase.from('body_profiles').select('*').eq('user_id', userId).maybeSingle()

    const typedAnswers: StyleAnswer[] = (answers ?? []).map((item) => ({
      questionId: item.question_id,
      question: item.question,
      answer: item.answer
    }))

    const run = await supabase
      .from('recommendation_runs')
      .insert({
        user_id: userId,
        context: {
          wardrobeCount: wardrobe?.length ?? 0,
          answerCount: typedAnswers.length,
          bodyType: bodyProfile?.body_type ?? null
        }
      })
      .select('*')
      .single()

    if (run.error || !run.data) return res.status(400).json({ error: run.error?.message ?? 'Could not create recommendation run.' })

    const items = buildRecommendationItems(typedAnswers, wardrobe ?? [], bodyProfile?.body_type ?? null)

    const inserted = await supabase.from('recommendation_items').insert(
      items.map((item) => ({
        recommendation_run_id: run.data.id,
        name: item.name,
        score: item.score,
        reason: item.reason,
        tags: item.tags
      }))
    ).select('*')

    await supabase.from('audit_events').insert({
      user_id: userId,
      event_type: 'recommendation.run_created',
      metadata: { recommendation_run_id: run.data.id, item_count: items.length }
    })

    return res.status(201).json({
      run: run.data,
      recommendations: inserted.data ?? items
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0]?.message ?? 'Invalid request.' })
    }
    return res.status(500).json({ error: 'Server error' })
  }
}
