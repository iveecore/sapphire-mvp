import type { NextApiRequest, NextApiResponse } from 'next'
import { readSessionCookie } from '@/lib/auth/session'
import { createSupabaseServiceClient } from '@/lib/supabase/server'
import { z } from 'zod'

const BookSchema = z.object({
  listing_id: z.string().uuid(),
  provider_id: z.string().uuid(),
  scheduled_at: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = readSessionCookie(req)
  if (!session) return res.status(401).json({ error: 'Unauthorized' })

  const parsed = BookSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const { listing_id, provider_id, scheduled_at, notes } = parsed.data
  const service = createSupabaseServiceClient()

  const { data: listing, error: listingErr } = await service
    .from('marketplace_listings')
    .select('id, price_cents, currency, available')
    .eq('id', listing_id)
    .eq('provider_id', provider_id)
    .maybeSingle()

  if (listingErr || !listing) return res.status(404).json({ error: 'Listing not found' })
  if (!listing.available) return res.status(409).json({ error: 'Listing not available' })

  const { data: booking, error } = await service
    .from('bookings')
    .insert({
      user_id: session.userId,
      provider_id,
      listing_id,
      status: 'pending',
      scheduled_at: scheduled_at ?? null,
      notes: notes ?? null,
      price_cents: listing.price_cents,
      currency: listing.currency,
    })
    .select()
    .single()

  if (error) return res.status(500).json({ error: 'Failed to create booking' })

  await service.from('audit_events').insert({
    user_id: session.userId,
    event_type: 'marketplace_booking_created',
    metadata: { booking_id: booking.id, listing_id, provider_id },
  })

  return res.status(201).json({ booking })
}
