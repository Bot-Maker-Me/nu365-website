/*
# Create products table for research compounds catalog

## Overview
Creates the products table to store research compound listings for an e-commerce catalog.
Public visitors can browse products (SELECT), while authenticated admins can manage them (INSERT, UPDATE, DELETE).

## New Tables
- `products`
  - `id` (uuid, primary key, auto-generated)
  - `name` (text, not null) — compound name
  - `slug` (text, unique, not null) — URL-friendly identifier
  - `description` (text) — detailed compound description
  - `price` (numeric, not null) — price in USD
  - `quantity` (int, not null, default 0) — available inventory
  - `in_stock` (boolean, not null, default true) — stock status
  - `image_url` (text) — product image URL
  - `category` (text) — compound category
  - `created_at` (timestamptz, default now()) — creation timestamp

## Security
- RLS enabled on `products`.
- Public SELECT: anyone (anon + authenticated) can view products.
- Authenticated INSERT/UPDATE/DELETE: only signed-in admins can manage products.

## Seed Data
- 6 sample research compounds with placeholder images from picsum.photos.
*/

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

-- Public SELECT: anyone can browse products
DROP POLICY IF EXISTS "public_select_products" ON products;
CREATE POLICY "public_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

-- Authenticated INSERT: admins can add products
DROP POLICY IF EXISTS "auth_insert_products" ON products;
CREATE POLICY "auth_insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (true);

-- Authenticated UPDATE: admins can edit products
DROP POLICY IF EXISTS "auth_update_products" ON products;
CREATE POLICY "auth_update_products" ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Authenticated DELETE: admins can remove products
DROP POLICY IF EXISTS "auth_delete_products" ON products;
CREATE POLICY "auth_delete_products" ON products FOR DELETE
  TO authenticated USING (true);

-- Seed 6 sample products
INSERT INTO products (name, slug, description, price, quantity, in_stock, image_url, category) VALUES
  ('Compound A-583', 'compound-a-583', 'A novel small-molecule inhibitor targeting cellular proliferation pathways in oncology research models.', 189.00, 45, true, 'https://picsum.photos/seed/compound-a583/600/600', 'Oncology'),
  ('Peptide B-221', 'peptide-b-221', 'Synthetic peptide designed for receptor binding studies in neurodegenerative disease research.', 342.00, 28, true, 'https://picsum.photos/seed/peptide-b221/600/600', 'Neuroscience'),
  ('Isomer C-907', 'isomer-c-907', 'Chiral isomer with high selectivity for enzymatic assays in metabolic pathway analysis.', 127.50, 60, true, 'https://picsum.photos/seed/isomer-c907/600/600', 'Metabolism'),
  ('Reagent D-415', 'reagent-d-415', 'High-purity reagent for protein crystallization and structural biology applications.', 95.00, 100, true, 'https://picsum.photos/seed/reagent-d415/600/600', 'Structural Biology'),
  ('Compound E-772', 'compound-e-772', 'Potent modulator of ion channel activity for electrophysiology and cardiac research models.', 256.00, 12, true, 'https://picsum.photos/seed/compound-e772/600/600', 'Cardiology'),
  ('Peptide F-309', 'peptide-f-309', 'Engineered peptide for immune checkpoint studies and immunotherapy development platforms.', 410.00, 0, false, 'https://picsum.photos/seed/peptide-f309/600/600', 'Immunology')
ON CONFLICT (slug) DO NOTHING;
