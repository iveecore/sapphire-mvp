-- ============================================================
-- Sapphire — FULL SCHEMA (safe to re-run)
-- WARNING: this DROPS and recreates all app tables, wiping any
-- existing rows. Safe for a fresh project / test data only.
-- Run this ONCE in the Supabase SQL Editor to sync the live
-- database with the application code.
-- ============================================================

drop table if exists
  achievements, community_posts, feedback_events, recommendation_items,
  recommendations, recommendation_runs, product_sizing, products,
  outfit_items, outfits, wardrobe_items, style_answers, style_profiles,
  object_relationships, objects, contexts, memory_events, audit_events,
  permissions, privacy_settings, brands, body_profiles, profiles,
  identities, users,
  quests, user_quests
cascade;

-- Users
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  avatar_url text,
  auth_user_id uuid unique,
  onboarding_status text default 'draft',
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Core platform identity
create table identities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  identity_type text not null default 'person',
  display_name text,
  status text not null default 'active',
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null unique,
  status text not null default 'draft',
  bio text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table body_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null unique,
  body_type text,
  height_cm int,
  bust_cm int,
  waist_cm int,
  hips_cm int,
  size_top text,
  size_bottom text,
  size_shoes text,
  fit_preferences jsonb default '{}'::jsonb,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  vibe text,
  price_tier text,
  created_at timestamp default now()
);

create table privacy_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null unique,
  allow_personalization boolean default true,
  allow_community_visibility boolean default false,
  allow_marketing_emails boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table permissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  resource_type text not null,
  resource_id text,
  action text not null,
  allowed boolean default true,
  reason text,
  created_at timestamp default now()
);

create table audit_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  event_type text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp default now()
);

create table memory_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  memory_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamp default now()
);

create table contexts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  context_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamp default now()
);

create table objects (
  id uuid primary key default gen_random_uuid(),
  object_type text not null,
  owner_user_id uuid references users(id) on delete cascade,
  name text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table object_relationships (
  id uuid primary key default gen_random_uuid(),
  source_object_id uuid references objects(id) on delete cascade not null,
  target_object_id uuid references objects(id) on delete cascade not null,
  relationship_type text not null,
  created_at timestamp default now()
);

-- Style Profiles
create table style_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  status text default 'draft',
  style_vibe text,
  style_score int default 0,
  body_type text,
  colors text[],
  budget int,
  lifestyle text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table style_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  question_id text not null,
  question text not null,
  answer text not null,
  created_at timestamp default now()
);

create table wardrobe_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  name text not null,
  category text not null,
  color text,
  occasion text,
  confidence_score int default 50,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table outfits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  name text not null,
  source text default 'generated',
  confidence_score int default 50,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table outfit_items (
  id uuid primary key default gen_random_uuid(),
  outfit_id uuid references outfits(id) on delete cascade not null,
  wardrobe_item_id uuid references wardrobe_items(id) on delete cascade not null,
  position int default 0,
  created_at timestamp default now()
);

-- Products
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price decimal(10,2),
  image_url text,
  category text,
  brand_id uuid references brands(id) on delete set null,
  size_chart jsonb default '{}'::jsonb,
  fit_notes text,
  created_at timestamp default now()
);

create table product_sizing (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade not null,
  size_label text not null,
  body_type text,
  fit_score int default 50,
  notes text,
  created_at timestamp default now()
);

-- Recommendations
create table recommendation_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  context jsonb default '{}'::jsonb,
  created_at timestamp default now()
);

create table recommendations (
  id uuid primary key default gen_random_uuid(),
  recommendation_run_id uuid references recommendation_runs(id) on delete cascade,
  user_id uuid references users(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  score decimal(3,2),
  feedback text,
  created_at timestamp default now()
);

create table recommendation_items (
  id uuid primary key default gen_random_uuid(),
  recommendation_run_id uuid references recommendation_runs(id) on delete cascade not null,
  object_id uuid references objects(id) on delete cascade,
  name text not null,
  score int not null,
  reason text not null,
  tags text[] default '{}',
  created_at timestamp default now()
);

create table feedback_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  recommendation_id uuid references recommendation_items(id) on delete cascade,
  outcome text not null,
  note text,
  created_at timestamp default now()
);

-- Community Posts
create table community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  outfit_description text,
  image_url text,
  likes int default 0,
  created_at timestamp default now()
);

-- Achievements
create table achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  badge_name text,
  unlocked_at timestamp default now()
);

-- Row-Level Security
alter table users enable row level security;
alter table identities enable row level security;
alter table profiles enable row level security;
alter table body_profiles enable row level security;
alter table brands enable row level security;
alter table privacy_settings enable row level security;
alter table permissions enable row level security;
alter table audit_events enable row level security;
alter table memory_events enable row level security;
alter table contexts enable row level security;
alter table objects enable row level security;
alter table object_relationships enable row level security;
alter table style_profiles enable row level security;
alter table style_answers enable row level security;
alter table wardrobe_items enable row level security;
alter table outfits enable row level security;
alter table outfit_items enable row level security;
alter table recommendations enable row level security;
alter table recommendation_runs enable row level security;
alter table recommendation_items enable row level security;
alter table feedback_events enable row level security;
alter table community_posts enable row level security;
alter table achievements enable row level security;

-- Users can only see their own data
create policy "Users can see own data" on users for all using (auth.uid() = id);
create policy "Users can see own identities" on identities for all using (auth.uid() = user_id);
create policy "Users can see own profiles" on profiles for all using (auth.uid() = user_id);
create policy "Users can see own body profiles" on body_profiles for all using (auth.uid() = user_id);
create policy "Brands are public" on brands for select using (true);
create policy "Users can see own privacy settings" on privacy_settings for all using (auth.uid() = user_id);
create policy "Users can see own permissions" on permissions for all using (auth.uid() = user_id);
create policy "Users can see own audit events" on audit_events for all using (auth.uid() = user_id);
create policy "Users can see own memory events" on memory_events for all using (auth.uid() = user_id);
create policy "Users can see own contexts" on contexts for all using (auth.uid() = user_id);
create policy "Users can see own objects" on objects for all using (auth.uid() = owner_user_id);
create policy "Users can see own object relationships" on object_relationships for all using (
  exists (
    select 1 from objects o
    where o.id = source_object_id and o.owner_user_id = auth.uid()
  )
);
create policy "Users can see own style profiles" on style_profiles for all using (auth.uid() = user_id);
create policy "Users can see own answers" on style_answers for all using (auth.uid() = user_id);
create policy "Users can see own wardrobe" on wardrobe_items for all using (auth.uid() = user_id);
create policy "Users can see own outfits" on outfits for all using (auth.uid() = user_id);
create policy "Users can see own outfit items" on outfit_items for all using (
  exists (
    select 1 from outfits o
    where o.id = outfit_id and o.user_id = auth.uid()
  )
);
create policy "Users can see own recommendations" on recommendations for all using (auth.uid() = user_id);
create policy "Users can see own recommendation runs" on recommendation_runs for all using (auth.uid() = user_id);
create policy "Users can see own recommendation items" on recommendation_items for all using (
  exists (
    select 1 from recommendation_runs r
    where r.id = recommendation_run_id and r.user_id = auth.uid()
  )
);
create policy "Users can see own feedback events" on feedback_events for all using (auth.uid() = user_id);
create policy "Users can see own achievements" on achievements for all using (auth.uid() = user_id);

-- Public can see community posts
create policy "Community posts are public" on community_posts for select using (true);
