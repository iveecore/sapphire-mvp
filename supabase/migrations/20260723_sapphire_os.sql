-- Sapphire OS tables: dashboard, agent DNA, studio, sheets, marketplace, business

-- Per-user AI agent DNA & token balance
CREATE TABLE IF NOT EXISTS public.user_agent_dna (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token_balance   integer NOT NULL DEFAULT 100,
  style_summary   text,
  companion_name  text NOT NULL DEFAULT 'Zara',
  preferred_model text NOT NULL DEFAULT 'claude-haiku-4-5-20251001',
  personality     text NOT NULL DEFAULT 'warm',
  conversation_history jsonb NOT NULL DEFAULT '[]',
  metadata        jsonb NOT NULL DEFAULT '{}',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_agent_dna_user_id_key UNIQUE (user_id)
);

-- Agent sessions (one per conversation thread)
CREATE TABLE IF NOT EXISTS public.agent_sessions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title       text,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Agent messages within sessions
CREATE TABLE IF NOT EXISTS public.agent_messages (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   uuid NOT NULL REFERENCES public.agent_sessions(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role         text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content      text NOT NULL,
  tokens_used  integer NOT NULL DEFAULT 0,
  metadata     jsonb NOT NULL DEFAULT '{}',
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Token transactions ledger
CREATE TABLE IF NOT EXISTS public.token_transactions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  delta        integer NOT NULL,
  reason       text NOT NULL,
  session_id   uuid REFERENCES public.agent_sessions(id),
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Dashboard widget layout configs
CREATE TABLE IF NOT EXISTS public.dashboard_configs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  config      jsonb NOT NULL DEFAULT '{}',
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT dashboard_configs_user_id_key UNIQUE (user_id)
);

-- Studio notes (Notion-like blocks stored as JSONB)
CREATE TABLE IF NOT EXISTS public.user_notes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title       text NOT NULL DEFAULT 'Untitled',
  content     jsonb NOT NULL DEFAULT '[]',
  note_type   text NOT NULL DEFAULT 'note' CHECK (note_type IN ('note', 'mood-board', 'wishlist', 'journal')),
  pinned      boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Sheets (spreadsheet data per user)
CREATE TABLE IF NOT EXISTS public.user_sheets (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title       text NOT NULL DEFAULT 'Untitled Sheet',
  sheet_type  text NOT NULL DEFAULT 'shopping-list' CHECK (sheet_type IN ('shopping-list', 'budget', 'collab-log', 'custom')),
  columns     jsonb NOT NULL DEFAULT '[]',
  rows        jsonb NOT NULL DEFAULT '[]',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Marketplace: service providers
CREATE TABLE IF NOT EXISTS public.service_providers (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES public.users(id) ON DELETE SET NULL,
  name         text NOT NULL,
  type         text NOT NULL CHECK (type IN ('stylist', 'tailor', 'photographer', 'reseller', 'brand')),
  bio          text,
  location     text,
  price_from   integer,
  rating       numeric(3,2),
  review_count integer NOT NULL DEFAULT 0,
  tags         text[] NOT NULL DEFAULT '{}',
  is_verified  boolean NOT NULL DEFAULT false,
  is_active    boolean NOT NULL DEFAULT true,
  metadata     jsonb NOT NULL DEFAULT '{}',
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Marketplace: bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  provider_id     uuid NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
  status          text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  session_date    timestamptz,
  notes           text,
  price_cents     integer,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Marketplace: reviews
CREATE TABLE IF NOT EXISTS public.provider_reviews (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
  rating      integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body        text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT provider_reviews_user_provider_key UNIQUE (user_id, provider_id)
);

-- Business mode: client roster
CREATE TABLE IF NOT EXISTS public.business_clients (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  email       text,
  notes       text,
  session_count integer NOT NULL DEFAULT 0,
  status      text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Business mode: brand collabs
CREATE TABLE IF NOT EXISTS public.business_collabs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  brand_name  text NOT NULL,
  collab_type text NOT NULL CHECK (collab_type IN ('affiliate', 'gifting', 'campaign', 'ambassador')),
  status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  earnings_cents integer NOT NULL DEFAULT 0,
  started_at  date,
  ended_at    date,
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_user_agent_dna_user_id ON public.user_agent_dna(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_sessions_user_id ON public.agent_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_messages_session_id ON public.agent_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_agent_messages_user_id ON public.agent_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_token_transactions_user_id ON public.token_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON public.user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sheets_user_id ON public.user_sheets(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON public.bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_business_clients_user_id ON public.business_clients(user_id);
CREATE INDEX IF NOT EXISTS idx_business_collabs_user_id ON public.business_collabs(user_id);
CREATE INDEX IF NOT EXISTS idx_service_providers_type ON public.service_providers(type);

-- Row-Level Security
ALTER TABLE public.user_agent_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_collabs ENABLE ROW LEVEL SECURITY;

-- RLS policies: users only access their own data
DO $$ BEGIN
  CREATE POLICY "own_data" ON public.user_agent_dna USING (user_id = auth.uid());
  CREATE POLICY "own_data" ON public.agent_sessions USING (user_id = auth.uid());
  CREATE POLICY "own_data" ON public.agent_messages USING (user_id = auth.uid());
  CREATE POLICY "own_data" ON public.token_transactions USING (user_id = auth.uid());
  CREATE POLICY "own_data" ON public.dashboard_configs USING (user_id = auth.uid());
  CREATE POLICY "own_data" ON public.user_notes USING (user_id = auth.uid());
  CREATE POLICY "own_data" ON public.user_sheets USING (user_id = auth.uid());
  CREATE POLICY "own_data" ON public.bookings USING (user_id = auth.uid());
  CREATE POLICY "own_data" ON public.provider_reviews USING (user_id = auth.uid());
  CREATE POLICY "own_data" ON public.business_clients USING (user_id = auth.uid());
  CREATE POLICY "own_data" ON public.business_collabs USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
