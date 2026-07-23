import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { readSessionCookie } from '@/lib/auth/session'
import { createSupabaseServiceClient } from '@/lib/supabase/server'
import { wardrobeItemSchema } from '@/lib/validation/platform'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = readSessionCookie(req)
  if (!session) return res.status(401).json({ error: 'Not authenticated' })

  const supabase = createSupabaseServiceClient()
  const userId = session.userId

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('wardrobe_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) return res.status(400).json({ error: error.message })
      return res.status(200).json({ items: data ?? [] })
    }

    if (req.method === 'POST') {
      const payload = wardrobeItemSchema.parse(req.body)
      const { data, error } = await supabase
        .from('wardrobe_items')
        .insert({
          user_id: userId,
          name: payload.name,
          category: payload.category,
          color: payload.color ?? null,
          occasion: payload.occasion ?? null,
          confidence_score: payload.confidence_score
        })
        .select('*')
        .single()

      if (error) return res.status(400).json({ error: error.message })

      await supabase.from('audit_events').insert({
        user_id: userId,
        event_type: 'wardrobe.item_added',
        metadata: { wardrobe_item_id: data?.id }
      })

      return res.status(201).json({ item: data })
    }

    return res.status(405).end()
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0]?.message ?? 'Invalid wardrobe item.' })
    }
    return res.status(500).json({ error: 'Server error' })
  }
}

