-- Fix RLS policy to allow public access to read products
-- Run this in your Supabase SQL Editor

-- First, drop any existing policies on the products table
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON products;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON products;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON products;

-- Create a policy that allows anyone (including anon/public) to read products
CREATE POLICY "Enable read access for all users" 
ON products FOR SELECT 
USING (true);

-- Create policies for authenticated users to modify products
CREATE POLICY "Enable insert for authenticated users" 
ON products FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" 
ON products FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Enable delete for authenticated users" 
ON products FOR DELETE 
TO authenticated 
USING (true);