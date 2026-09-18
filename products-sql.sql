-- Create the products table first
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  quantity INTEGER NOT NULL DEFAULT 0,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the 8 products from the images
INSERT INTO products (name, slug, description, price, quantity, in_stock, image_url, category, created_at) VALUES
('TIRZEPATIDE 10MG', 'tirzepatide-10mg', 'High-purity Tirzepatide peptide for research purposes. 99.51% purity verified by independent lab testing.', 60.00, 100, true, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop', 'Peptides', NOW()),
('TB-500 5MG', 'tb-500-5mg', 'Premium TB-500 peptide with 99.742% purity. Ideal for tissue repair and regeneration research.', 40.00, 150, true, 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&h=600&fit=crop', 'Peptides', NOW()),
('SEMAGLUTIDE 5MG', 'semaglutide-5mg', 'Research-grade Semaglutide with 99.39% purity. Widely used in metabolic studies.', 50.00, 120, true, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&h=600&fit=crop', 'Peptides', NOW()),
('RETATRUTIDE 10MG', 'retatrutide-10mg', 'Advanced Retatrutide peptide with exceptional 99.82% purity. Cutting-edge research compound.', 90.00, 80, true, 'https://images.unsplash.com/photo-1579165466741-7f35a4755657?w=600&h=600&fit=crop', 'Peptides', NOW()),
('HCG 7,000IU', 'hcg-7000iu', 'Human Chorionic Gonadotropin 7,000IU. Pharmaceutical grade for research applications.', 40.00, 200, true, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop', 'Hormones', NOW()),
('BPC-157 5MG', 'bpc-157-5mg', 'Body Protection Compound 157 with 99.88% purity. Enhanced healing and tissue repair research.', 40.00, 180, true, 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&h=600&fit=crop', 'Peptides', NOW()),
('HCG 18,000IU', 'hcg-18000iu', 'High-dose Human Chorionic Gonadotropin 18,000IU. Extended research applications.', 80.00, 100, true, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&h=600&fit=crop', 'Hormones', NOW()),
('BPC-157 10MG', 'bpc-157-10mg', 'High-concentration BPC-157 10MG with 98.51% purity. Advanced tissue regeneration studies.', 70.00, 90, true, 'https://images.unsplash.com/photo-1579165466741-7f35a4755657?w=600&h=600&fit=crop', 'Peptides', NOW());