DROP TABLE IF EXISTS social_shares CASCADE;
DROP TABLE IF EXISTS media_assets CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS rss_sources CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS waiting_list CASCADE;
DROP TABLE IF EXISTS automation_logs CASCADE;

-- Table 1: categories
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- NEW Table: rss_sources
CREATE TABLE IF NOT EXISTS rss_sources (
  id BIGSERIAL PRIMARY KEY,
  url TEXT NOT NULL UNIQUE,
  target_pillar VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_fetched_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE rss_sources ENABLE ROW LEVEL SECURITY;

-- Table 2: posts
CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  raw_markdown TEXT,
  polished_content TEXT,
  hash VARCHAR(64) UNIQUE NOT NULL,
  meta_desc VARCHAR(255),
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  target_product_key VARCHAR(255),
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS posts_category_id_idx ON posts(category_id);
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- NEW Table: media_assets
CREATE TABLE IF NOT EXISTS media_assets (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
  prompt_string TEXT NOT NULL,
  pollinations_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- NEW Table: social_shares
CREATE TABLE IF NOT EXISTS social_shares (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  platform VARCHAR(50),
  syndicated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE social_shares ENABLE ROW LEVEL SECURITY;

-- Table 3: waiting_list
CREATE TABLE IF NOT EXISTS waiting_list (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  business_name VARCHAR(255),
  targeted_service VARCHAR(255) DEFAULT 'General',
  coupon_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE waiting_list ENABLE ROW LEVEL SECURITY;

-- Table 4: automation_logs
CREATE TABLE IF NOT EXISTS automation_logs (
  id BIGSERIAL PRIMARY KEY,
  items_fetched INTEGER DEFAULT 0,
  status VARCHAR(100) NOT NULL,
  execution_duration_ms BIGINT DEFAULT 0,
  error_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;

-- Insert Default Categories
INSERT INTO categories (name, slug) VALUES 
  ('Connectivity', 'connectivity'),
  ('Reputation', 'reputation'),
  ('Operations', 'operations')
ON CONFLICT (slug) DO NOTHING;

-- RLS Policies
DROP POLICY IF EXISTS "Allow public read access on posts" ON public.posts;
CREATE POLICY "Allow public read access on posts" ON public.posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on categories" ON public.categories;
CREATE POLICY "Allow public read access on categories" ON public.categories FOR SELECT USING (true);

-- Deny all public access to sensitive tables
DROP POLICY IF EXISTS "Deny public access on waiting_list" ON public.waiting_list;
CREATE POLICY "Deny public access on waiting_list" ON public.waiting_list FOR ALL USING (false);

DROP POLICY IF EXISTS "Deny public access on automation_logs" ON public.automation_logs;
CREATE POLICY "Deny public access on automation_logs" ON public.automation_logs FOR ALL USING (false);

DROP POLICY IF EXISTS "Deny public access on rss_sources" ON public.rss_sources;
CREATE POLICY "Deny public access on rss_sources" ON public.rss_sources FOR ALL USING (false);

DROP POLICY IF EXISTS "Deny public access on media_assets" ON public.media_assets;
CREATE POLICY "Deny public access on media_assets" ON public.media_assets FOR ALL USING (false);

DROP POLICY IF EXISTS "Deny public access on social_shares" ON public.social_shares;
CREATE POLICY "Deny public access on social_shares" ON public.social_shares FOR ALL USING (false);
