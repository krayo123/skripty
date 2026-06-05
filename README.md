# KrayoSkriptz

React + Vite website for browsing KrayoSkriptz posts from Supabase PostgreSQL.

## What is included

- Main page with all database posts
- Search bar for YouTube titles and links
- YouTube thumbnails and titles loaded from each `YoutubeLink`
- Post detail page with embedded YouTube preview
- Lootlabs button using the Lootlabs logo
- Supabase SQL schema in `supabase/schema.sql`
- Deployment routing for Vercel, Netlify, and static hosts

## Supabase setup

1. Open Supabase SQL Editor.
2. Paste and run `supabase/schema.sql`.
3. Add rows to `public.posts` with these fields:

```sql
insert into public.posts ("YoutubeLink", "LootlabsLink")
values
  ('https://www.youtube.com/watch?v=YOUR_VIDEO_ID', 'https://lootlabs.com/YOUR_LINK');
```

The app intentionally does not store titles or thumbnails. It reads the title from YouTube oEmbed and builds thumbnails from the YouTube video ID.

## Environment

Create `.env` from `.env.example`:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=wezzsupabase
```

Important: Supabase also needs the project URL. The keys alone are not enough for the browser app to connect. Keep secret and service-role keys out of frontend code.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
