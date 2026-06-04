# KrayoSkriptz

React + Vite website for browsing script posts from Supabase.

## Setup

1. Paste `supabase/schema.sql` into the Supabase SQL editor and run it.
2. Add your Supabase project URL and anon key to `.env`.
3. Install dependencies and run the site:

```bash
npm install
npm run dev
```

## Environment

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=wezzsupabase
```

The service role key should stay server-side and should not be placed in frontend code.
