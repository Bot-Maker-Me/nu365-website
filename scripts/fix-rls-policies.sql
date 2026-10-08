-- Fix RLS policies to allow public read access
-- Run this in your Supabase SQL editor: https://supabase.com/dashboard/project/hrahcesdeomfjjyevqyr/sql

-- Drop existing policies
DROP POLICY IF EXISTS "public_select_products" ON products;
DROP POLICY IF EXISTS "auth_insert_products" ON products;
DROP POLICY IF EXISTS "auth_update_products" ON products;
DROP POLICY IF EXISTS "auth_delete_products" ON products;

-- Create policy that allows anyone (including anon) to SELECT products
CREATE POLICY "public_select_products" ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policy that allows authenticated users to INSERT
CREATE POLICY "auth_insert_products" ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy that allows authenticated users to UPDATE
CREATE POLICY "auth_update_products" ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policy that allows authenticated users to DELETE
CREATE POLICY "auth_delete_products" ON products
  FOR DELETE
  TO authenticated
  USING (true);

-- Verify RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
