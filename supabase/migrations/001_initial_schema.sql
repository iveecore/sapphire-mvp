-- Users
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Style Profiles
create table style_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  style_score int default 0,
  body_type text,
  colors text[],
  budget int,
  lifestyle text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Products
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price decimal(10,2),
  image_url text,
  category text,
  created_at timestamp default now()
);

-- Recommendations
create table recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  score decimal(3,2),
  feedback text,
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
alter table style_profiles enable row level security;
alter table recommendations enable row level security;
alter table community_posts enable row level security;
alter table achievements enable row level security;

-- Users can only see their own data
create policy "Users can see own data" on users for all using (auth.uid() = id);
create policy "Users can see own profiles" on style_profiles for all using (auth.uid() = user_id);
create policy "Users can see own recommendations" on recommendations for all using (auth.uid() = user_id);
create policy "Users can see own achievements" on achievements for all using (auth.uid() = user_id);

-- Public can see community posts
create policy "Community posts are public" on community_posts for select using (true);
