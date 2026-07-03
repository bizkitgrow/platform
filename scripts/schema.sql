-- Table 1: categories
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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

-- Table 3: waiting_list
CREATE TABLE IF NOT EXISTS waiting_list (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  business_name VARCHAR(255),
  targeted_service VARCHAR(255) DEFAULT 'General',
  coupon_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table 4: automation_logs
CREATE TABLE IF NOT EXISTS automation_logs (
  id BIGSERIAL PRIMARY KEY,
  items_fetched INTEGER DEFAULT 0,
  status VARCHAR(100) NOT NULL,
  execution_duration_ms BIGINT DEFAULT 0,
  error_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert Default Categories
INSERT INTO categories (name, slug) VALUES 
  ('Connectivity', 'connectivity'),
  ('Reputation', 'reputation'),
  ('Operations', 'operations')
ON CONFLICT (slug) DO NOTHING;
