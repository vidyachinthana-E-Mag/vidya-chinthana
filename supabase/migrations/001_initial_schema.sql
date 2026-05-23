-- Vidya Chinthana — core schema (JSONB documents mirror data_db/*.json)
-- Run in Supabase SQL Editor or: supabase db push

-- App users (username/password auth; not Supabase Auth — fastest migration from JSON)
CREATE TABLE IF NOT EXISTS app_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'editor', 'author', 'reader')),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  status TEXT GENERATED ALWAYS AS (data->>'status') STORED,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_status ON articles (status);

CREATE TABLE IF NOT EXISTS issues (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS glossary_terms (
  term TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security (anon client reads; writes via service role API only)
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Public read: published articles only
CREATE POLICY "articles_public_read" ON articles
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

-- Public read: magazine content
CREATE POLICY "issues_public_read" ON issues FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "glossary_public_read" ON glossary_terms FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "site_config_public_read" ON site_config FOR SELECT TO anon, authenticated USING (true);

-- No direct anon writes (API uses service_role which bypasses RLS)
-- Service role: full access (server/Netlify Functions only — never expose in browser)
