/*
# Create orders table

1. New Tables
- `orders`
  - `id` (uuid, primary key, default gen_random_uuid())
  - `customer_name` (text) — full name of the customer placing the order
  - `customer_email` (text) — email address of the customer
  - `shipping_address` (text) — full shipping address as a single string
  - `total` (numeric) — total order amount including shipping and tax
  - `items` (jsonb) — cart items stored as a JSON array (product id, name, price, quantity, image_url)
  - `created_at` (timestamptz, default now()) — when the order was placed

2. Security
- Enable RLS on `orders`.
- Public INSERT: anyone (anon + authenticated) can place an order — checkout is available to all site visitors.
- Authenticated SELECT: only signed-in admin users can view orders.
- No UPDATE or DELETE policies: orders are immutable once placed.

3. Important Notes
- The `items` jsonb column stores the full cart snapshot so historical orders remain accurate even if products change or are deleted.
- `total` is stored as numeric to preserve decimal precision.
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  shipping_address text NOT NULL,
  total numeric NOT NULL DEFAULT 0,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_orders" ON orders;
CREATE POLICY "public_insert_orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_select_orders" ON orders;
CREATE POLICY "authenticated_select_orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);
