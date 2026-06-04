-- =============================================
-- Roblox Scripts Site - Supabase Schema
-- Wklej to w SQL Editor w Supabase
-- =============================================

CREATE TABLE IF NOT EXISTS scripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  youtube_link TEXT NOT NULL,
  lootlabs_link TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Włącz Row Level Security
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

-- Pozwól wszystkim czytać (publiczna strona)
CREATE POLICY "Public read access"
  ON scripts FOR SELECT
  USING (true);

-- Tylko authenticated users mogą dodawać/edytować
CREATE POLICY "Authenticated insert"
  ON scripts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update"
  ON scripts FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete"
  ON scripts FOR DELETE
  USING (auth.role() = 'authenticated');

-- Przykładowe dane (opcjonalne, usuń jeśli nie chcesz)
-- INSERT INTO scripts (youtube_link, lootlabs_link) VALUES
--   ('https://www.youtube.com/watch?v=EXAMPLE1', 'https://lootlabs.gg/EXAMPLE1'),
--   ('https://www.youtube.com/watch?v=EXAMPLE2', 'https://lootlabs.gg/EXAMPLE2');
