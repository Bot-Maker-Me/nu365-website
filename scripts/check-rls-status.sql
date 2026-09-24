-- Check the current RLS status and policies on the products table
-- Run this in your Supabase SQL Editor

-- Check if RLS is enabled on the products table
SELECT 
  tablename,
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'products';

-- Check all existing policies on the products table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'products';