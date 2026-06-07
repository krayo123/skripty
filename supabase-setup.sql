-- KrayoSkriptz Supabase setup
-- Run this in Supabase SQL Editor, then add your real admin email below.

create extension if not exists pgcrypto;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  "YoutubeLink" text not null,
  "LootlabsLink" text not null,
  title text,
  thumbnail text,
  created_at timestamptz not null default now()
);

alter table public.posts add column if not exists id uuid default gen_random_uuid();
alter table public.posts add column if not exists "YoutubeLink" text;
alter table public.posts add column if not exists "LootlabsLink" text;
alter table public.posts add column if not exists title text;
alter table public.posts add column if not exists thumbnail text;
alter table public.posts add column if not exists created_at timestamptz;

update public.posts set id = gen_random_uuid() where id is null;
update public.posts set created_at = now() where created_at is null;

alter table public.posts alter column id set default gen_random_uuid();
alter table public.posts alter column created_at set default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.posts'::regclass
      and contype = 'p'
  ) then
    alter table public.posts add constraint posts_pkey primary key (id);
  end if;
end $$;

create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

create index if not exists posts_created_at_idx
  on public.posts (created_at desc);

alter table public.posts enable row level security;
alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "Public can read posts" on public.posts;
drop policy if exists "Admins can insert posts" on public.posts;
drop policy if exists "Admins can update posts" on public.posts;
drop policy if exists "Admins can delete posts" on public.posts;

create policy "Public can read posts"
on public.posts
for select
using (true);

create policy "Admins can insert posts"
on public.posts
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update posts"
on public.posts
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete posts"
on public.posts
for delete
to authenticated
using (public.is_admin());

-- Replace this email with the Supabase Auth email you will use for /admin/.
-- Run this line after creating that user in Supabase Authentication.
-- insert into public.admin_users (email) values ('your-email@example.com') on conflict (email) do nothing;
