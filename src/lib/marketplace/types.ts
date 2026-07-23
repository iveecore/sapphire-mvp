export type ProviderCategory =
  | 'stylist'
  | 'tailor'
  | 'thrift'
  | 'photographer'
  | 'brand'

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface ServiceProvider {
  id: string
  user_id: string | null
  name: string
  category: ProviderCategory
  bio: string | null
  location: string | null
  avatar_url: string | null
  portfolio_urls: string[]
  hourly_rate_cents: number | null
  currency: string
  rating_avg: number
  review_count: number
  verified: boolean
  active: boolean
  created_at: string
}

export interface MarketplaceListing {
  id: string
  provider_id: string
  title: string
  description: string | null
  price_cents: number
  currency: string
  duration_minutes: number | null
  category: ProviderCategory
  tags: string[]
  available: boolean
  created_at: string
}

export interface Booking {
  id: string
  user_id: string
  provider_id: string
  listing_id: string
  status: BookingStatus
  scheduled_at: string | null
  notes: string | null
  price_cents: number
  currency: string
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  user_id: string
  provider_id: string
  booking_id: string | null
  rating: number
  body: string | null
  created_at: string
}
