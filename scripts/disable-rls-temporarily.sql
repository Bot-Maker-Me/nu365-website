-- Temporarily disable RLS on the products table
-- Run this in your Supabase SQL Editor
-- Then run the replace-products.sql script
-- Then run the enable-rls.sql script to re-enable security

ALTER TABLE products DISABLE ROW LEVEL SECURITY;