-- Table 1: categories
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Table 2: posts
CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  meta_desc VARCHAR(255),
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  target_product_key VARCHAR(255),
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS posts_category_id_idx ON posts(category_id);
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

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
-- Allow public read access to posts and categories
CREATE POLICY "Allow public read access on posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow public read access on categories" ON public.categories FOR SELECT USING (true);

-- Deny all public access to sensitive tables (accessed via service_role bypassing RLS)
CREATE POLICY "Deny public access on waiting_list" ON public.waiting_list FOR ALL USING (false);
CREATE POLICY "Deny public access on automation_logs" ON public.automation_logs FOR ALL USING (false);
