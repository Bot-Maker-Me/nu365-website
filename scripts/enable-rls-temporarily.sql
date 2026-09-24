-- Re-enable RLS on the products table
-- Run this after the replace-products.sql script is complete

ALTER TABLE products ENABLE ROW LEVEL SECURITY;