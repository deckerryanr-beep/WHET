-- ================================================================
-- WHET — What's Hot, Expertly Tailored
-- Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ================================================================

-- ── Items Table ──────────────────────────────────────────────────
-- Stores all user-logged experiences across categories

create table if not exists items (
  id           uuid          default gen_random_uuid() primary key,
  user_id      uuid          references auth.users(id) on delete cascade not null,
  category     text          not null check (
                               category in ('wine', 'whiskey', 'athletic_wear', 'going_out_wear')
                             ),
  name         text          not null,
  brand        text,
  rating       integer       not null check (rating >= 1 and rating <= 10),
  notes        text,
  attributes   jsonb         not null default '{}',
  image_url    text,
  price        numeric(10,2),
  created_at   timestamptz   not null default now()
);

-- ── Recommendations Table ────────────────────────────────────────
-- Stores AI-generated recommendations for each user

create table if not exists recommendations (
  id            uuid          default gen_random_uuid() primary key,
  user_id       uuid          references auth.users(id) on delete cascade not null,
  category      text          not null check (
                                category in ('wine', 'whiskey', 'athletic_wear', 'going_out_wear')
                              ),
  name          text          not null,
  brand         text,
  description   text,
  reason        text,
  image_url     text,
  price_range   text,
  where_to_buy  jsonb         not null default '[]',
  dismissed     boolean       not null default false,
  saved         boolean       not null default false,
  created_at    timestamptz   not null default now()
);

-- ── Taste Profiles Table ─────────────────────────────────────────
-- Cached taste profile summaries per user (optional, for display)

create table if not exists taste_profiles (
  id                      uuid        default gen_random_uuid() primary key,
  user_id                 uuid        references auth.users(id) on delete cascade not null unique,
  wine_profile            jsonb       default '{}',
  whiskey_profile         jsonb       default '{}',
  athletic_wear_profile   jsonb       default '{}',
  going_out_wear_profile  jsonb       default '{}',
  updated_at              timestamptz not null default now()
);

-- ── Indexes ──────────────────────────────────────────────────────

create index if not exists items_user_id_idx
  on items(user_id);

create index if not exists items_user_category_idx
  on items(user_id, category);

create index if not exists items_created_at_idx
  on items(created_at desc);

create index if not exists recommendations_user_id_idx
  on recommendations(user_id);

create index if not exists recommendations_user_category_idx
  on recommendations(user_id, category);

create index if not exists recommendations_dismissed_idx
  on recommendations(user_id, dismissed);

-- ── Row Level Security ───────────────────────────────────────────

alter table items enable row level security;
alter table recommendations enable row level security;
alter table taste_profiles enable row level security;

-- Items policies
create policy "Users can view own items"
  on items for select
  using (auth.uid() = user_id);

create policy "Users can insert own items"
  on items for insert
  with check (auth.uid() = user_id);

create policy "Users can update own items"
  on items for update
  using (auth.uid() = user_id);

create policy "Users can delete own items"
  on items for delete
  using (auth.uid() = user_id);

-- Recommendations policies
create policy "Users can view own recommendations"
  on recommendations for select
  using (auth.uid() = user_id);

create policy "Users can insert own recommendations"
  on recommendations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own recommendations"
  on recommendations for update
  using (auth.uid() = user_id);

create policy "Users can delete own recommendations"
  on recommendations for delete
  using (auth.uid() = user_id);

-- Taste profiles policies
create policy "Users can view own taste profiles"
  on taste_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own taste profiles"
  on taste_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own taste profiles"
  on taste_profiles for update
  using (auth.uid() = user_id);

create policy "Users can delete own taste profiles"
  on taste_profiles for delete
  using (auth.uid() = user_id);

-- ── Helper Functions ─────────────────────────────────────────────

-- Function to get item count by category for a user
create or replace function get_item_counts(p_user_id uuid)
returns table (category text, count bigint)
language sql
security definer
as $$
  select category, count(*) as count
  from items
  where user_id = p_user_id
  group by category;
$$;

-- ── Storage Bucket (run separately if needed) ────────────────────
-- INSERT INTO storage.buckets (id, name, public) VALUES ('item-images', 'item-images', true);
