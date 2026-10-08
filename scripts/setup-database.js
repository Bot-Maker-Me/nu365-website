import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = envContent.split('\n').reduce((acc, line) => {
  const [key, value] = line.split('=');
  if (key && value) {
    acc[key.trim()] = value.trim();
  }
  return acc;
}, {});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

// Create client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey);

console.log('Setting up database tables...\n');

// SQL to create tables
const createTablesSQL = `
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price numeric NOT NULL,
  quantity int NOT NULL DEFAULT 0,
  in_stock boolean NOT NULL DEFAULT true,
  image_url text,
  category text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_products" ON products;
CREATE POLICY "public_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_products" ON products;
CREATE POLICY "auth_insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_products" ON products;
CREATE POLICY "auth_update_products" ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_products" ON products;
CREATE POLICY "auth_delete_products" ON products FOR DELETE
  TO authenticated USING (true);

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

INSERT INTO site_settings (id, site_name, hero_headline, hero_subheadline)
VALUES (1, 'THE NU365', 'Proof over promises.', 'Premium-grade research compounds. Independent lab testing with complete batch transparency.')
ON CONFLICT (id) DO NOTHING;
`;

console.log('Executing SQL to create tables...');

const { data, error } = await supabase.rpc('exec_sql', { sql: createTablesSQL });

if (error) {
  console.error('Error creating tables:', error.message);
  console.log('\nNote: If the above error is about "exec_sql" not existing, please run the SQL manually in your Supabase dashboard:');
  console.log('1. Go to https://supabase.com/dashboard/project/hrahcesdeomfjjyevqyr/sql');
  console.log('2. Copy and paste the contents of create-tables.sql');
  console.log('3. Click "Run"');
  process.exit(1);
}

console.log('✅ Tables created successfully!');
