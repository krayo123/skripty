create extension if not exists pgcrypto;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  "YoutubeLink" text not null,
  "LootlabsLink" text not null,
  created_at timestamptz not null default now(),
  constraint posts_youtube_link_valid check ("YoutubeLink" ~* '^https?://(www\.)?(youtube\.com|youtu\.be)/'),
  constraint posts_lootlabs_link_valid check ("LootlabsLink" ~* '^https?://')
);

alter table public.posts enable row level security;

drop policy if exists "Anyone can read posts" on public.posts;
create policy "Anyone can read posts"
  on public.posts
  for select
  using (true);

create index if not exists posts_created_at_idx
  on public.posts (created_at desc);

-- Add posts like this:
-- insert into public.posts ("YoutubeLink", "LootlabsLink")
-- values
--   ('https://www.youtube.com/watch?v=YOUR_VIDEO_ID', 'https://loot-link.example/your-script');
