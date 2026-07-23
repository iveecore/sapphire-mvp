import { createClient } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { userId, styleAnswers } = req.body

  try {
    const recommendations = [
      { id: '1', name: 'Summer Casual', score: 95 },
      { id: '2', name: 'Office Ready', score: 88 },
      { id: '3', name: 'Weekend Vibe', score: 92 },
      { id: '4', name: 'Night Out', score: 85 },
      { id: '5', name: 'Gym Fit', score: 79 },
      { id: '6', name: 'Travel Chic', score: 91 }
    ]

    return res.status(200).json({ recommendations })
  } catch (e) {
    return res.status(500).json({ error: 'Server error' })
  }
}
