-- SECURE RLS POLICIES FOR PRODUCTION
-- Run this in your Supabase SQL editor: https://supabase.com/dashboard/project/hrahcesdeomfjjyevqyr/sql

-- Drop all existing policies
DROP POLICY IF EXISTS "public_select_products" ON products;
DROP POLICY IF EXISTS "auth_insert_products" ON products;
DROP POLICY IF EXISTS "auth_update_products" ON products;
DROP POLICY IF EXISTS "auth_delete_products" ON products;

-- Enable RLS (REQUIRED for security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- POLICY 1: Allow public READ-ONLY access to products
-- Anyone (anon + authenticated) can VIEW products, but cannot modify them
CREATE POLICY "public_select_products" ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- POLICY 2: Only authenticated users can INSERT products
CREATE POLICY "auth_insert_products" ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- POLICY 3: Only authenticated users can UPDATE products
CREATE POLICY "auth_update_products" ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- POLICY 4: Only authenticated users can DELETE products
CREATE POLICY "auth_delete_products" ON products
  FOR DELETE
  TO authenticated
  USING (true);

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'products';
