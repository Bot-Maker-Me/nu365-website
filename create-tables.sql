-- Create the products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  quantity INTEGER NOT NULL DEFAULT 0,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the site_settings table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  site_name TEXT,
  hero_image_url TEXT,
  hero_headline TEXT,
  hero_subheadline TEXT,
  bio TEXT,
  email TEXT,
  address TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default site settings if not exists
INSERT INTO site_settings (id, site_name, hero_headline, hero_subheadline)
VALUES (1, 'THE NU365', 'Proof over promises.', 'Premium-grade research compounds. Independent lab testing with complete batch transparency.')
ON CONFLICT (id) DO NOTHING;