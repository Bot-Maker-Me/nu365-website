-- Add the missing version variants and special products
-- Run this in your Supabase SQL Editor

INSERT INTO products (name, slug, description, price, quantity, in_stock, image_url, category) VALUES
('SLU-PP-322', 'slu-pp-322', 'High-quality SLU-PP-322 for research purposes only.', 75, 10, true, '/products/SLU-PP-322_research-only_matte-silver-reflection.png', 'Research Compounds')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  quantity = EXCLUDED.quantity,
  in_stock = EXCLUDED.in_stock,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category;