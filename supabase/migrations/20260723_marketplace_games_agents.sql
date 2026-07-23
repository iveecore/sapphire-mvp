-- ══════════════════════════════════════════
-- Marketplace tables
-- ══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.service_providers (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES public.users(id) ON DELETE SET NULL,
  name          text NOT NULL,
  category      text NOT NULL CHECK (category IN ('stylist','tailor','thrift','photographer','brand')),
  bio           text,
  location      text,
  avatar_url    text,
  portfolio_urls text[] NOT NULL DEFAULT '{}',
  hourly_rate_cents integer,
  currency      text NOT NULL DEFAULT 'USD',
  rating_avg    numeric(3,2) NOT NULL DEFAULT 0,
  review_count  integer NOT NULL DEFAULT 0,
  verified      boolean NOT NULL DEFAULT false,
  active        boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id     uuid NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
  title           text NOT NULL,
  description     text,
  price_cents     integer NOT NULL,
  currency        text NOT NULL DEFAULT 'USD',
  duration_minutes integer,
  category        text NOT NULL,
  tags            text[] NOT NULL DEFAULT '{}',
  available       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  provider_id   uuid NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
  listing_id    uuid NOT NULL REFERENCES public.marketplace_listings(id),
  status        text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
  scheduled_at  timestamptz,
  notes         text,
  price_cents   integer NOT NULL,
  currency      text NOT NULL DEFAULT 'USD',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
  booking_id  uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  rating      smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body        text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, booking_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_service_providers_category ON public.service_providers(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_provider ON public.marketplace_listings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON public.bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_reviews_provider ON public.reviews(provider_id);

-- ══════════════════════════════════════════
-- Per-user Agent DNA table
-- ══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.user_agent_dna (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  persona_name        text NOT NULL DEFAULT 'Sapphire',
  preferred_model     text,
  subscription_tier   text NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free','pro','muse')),
  token_balance       integer NOT NULL DEFAULT 50,
  tokens_used_total   integer NOT NULL DEFAULT 0,
  style_context       text,
  personality_traits  jsonb NOT NULL DEFAULT '{}',
  conversation_summary text,
  badge_ids           text[] NOT NULL DEFAULT '{}',
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_agent_dna_user ON public.user_agent_dna(user_id);

-- ══════════════════════════════════════════
-- Game rewards / token transactions
-- ══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.token_transactions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  delta       integer NOT NULL,
  reason      text NOT NULL,
  metadata    jsonb NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_token_transactions_user ON public.token_transactions(user_id);

-- ══════════════════════════════════════════
-- Row Level Security
-- ══════════════════════════════════════════

ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_agent_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_transactions ENABLE ROW LEVEL SECURITY;

-- Public can read providers and listings
CREATE POLICY "providers_read_all" ON public.service_providers FOR SELECT USING (active = true);
CREATE POLICY "listings_read_all" ON public.marketplace_listings FOR SELECT USING (available = true);

-- Users own their bookings and DNA
CREATE POLICY "bookings_own" ON public.bookings USING (user_id = auth.uid());
CREATE POLICY "reviews_own" ON public.reviews USING (user_id = auth.uid());
CREATE POLICY "dna_own" ON public.user_agent_dna USING (user_id = auth.uid());
CREATE POLICY "tokens_own" ON public.token_transactions FOR SELECT USING (user_id = auth.uid());
