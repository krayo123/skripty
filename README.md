# KrayoSkriptz

React + Vite website for browsing KrayoSkriptz posts from Supabase PostgreSQL.

## What is included

- Main page with all database posts
- Search bar for YouTube titles and links
- YouTube thumbnails and titles loaded from each `YoutubeLink`
- Post detail page with embedded YouTube preview
- Lootlabs button using the Lootlabs logo
- Admin page at `/admin` for adding new posts without opening SQL Editor
- Supabase SQL schema in `supabase/schema.sql`
- Deployment routing for Vercel, Netlify, and static hosts
- Executors page at `/executors`
- Adsterra-style popunder, iframe, native, and direct-link placements

## Supabase setup

1. Open Supabase SQL Editor.
2. Paste and run `supabase/schema.sql`.
3. In Supabase Auth, create your owner/admin user.
4. Keep public sign-ups disabled unless you add stricter admin-only policies.
5. Deploy the site, open `/admin`, sign in, and add posts with a YouTube link plus a Lootlabs link.

The app intentionally does not store titles or thumbnails. It reads the title from YouTube oEmbed and builds thumbnails from the YouTube video ID.

You can still add rows manually if needed:

```sql
insert into public.posts ("YoutubeLink", "LootlabsLink")
values
  ('https://www.youtube.com/watch?v=YOUR_VIDEO_ID', 'https://lootlabs.com/YOUR_LINK');
```

## Admin page

Open `/admin` after deployment. The page uses Supabase Auth with the public anon key, then inserts into `public.posts` through Row Level Security policies.

The admin form validates:

- YouTube links from `youtube.com`, YouTube Shorts, embeds, or `youtu.be`
- Unlock links that start with `http` or `https`
- YouTube preview metadata before publishing

If sign-in works but adding a post fails, re-run `supabase/schema.sql` so the authenticated insert policy exists.

## Environment

Create `.env` from `.env.example`:

```bash
VITE_SUPABASE_URL=https://vwiwgbvtkjyerqpjbkfc.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
VITE_LOGO_URL=/logo.svg
VITE_DIRECT_AD_LINK=https://your-direct-ad-link.example
```

You pasted `https://vwiwgbvtkjyerqpjbkfc.supabase.co/rest/v1/`; the app accepts that too and normalizes it to the base project URL automatically. Keep secret and service-role keys out of frontend code.

## Ads

The project includes Adsterra-style popunder, iframe, native, and direct-link placements. Replace the existing ad script URLs, iframe keys, and `VITE_DIRECT_AD_LINK` with the codes from your own Adsterra account before treating the monetization as final.

## Executors

The `/executors` page is rendered directly by React. Executor names, links, badges, and preview thumbnails live in `src/main.jsx` in the `executors` array.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
