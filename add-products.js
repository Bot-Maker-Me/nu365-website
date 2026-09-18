import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase credentials
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const products = [
  {
    name: 'TIRZEPATIDE 10MG',
    slug: 'tirzepatide-10mg',
    description: 'High-purity Tirzepatide peptide for research purposes. 99.51% purity verified by independent lab testing.',
    price: 60.00,
    quantity: 100,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop',
    category: 'Peptides',
  },
  {
    name: 'TB-500 5MG',
    slug: 'tb-500-5mg',
    description: 'Premium TB-500 peptide with 99.742% purity. Ideal for tissue repair and regeneration research.',
    price: 40.00,
    quantity: 150,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&h=600&fit=crop',
    category: 'Peptides',
  },
  {
    name: 'SEMAGLUTIDE 5MG',
    slug: 'semaglutide-5mg',
    description: 'Research-grade Semaglutide with 99.39% purity. Widely used in metabolic studies.',
    price: 50.00,
    quantity: 120,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&h=600&fit=crop',
    category: 'Peptides',
  },
  {
    name: 'RETATRUTIDE 10MG',
    slug: 'retatrutide-10mg',
    description: 'Advanced Retatrutide peptide with exceptional 99.82% purity. Cutting-edge research compound.',
    price: 90.00,
    quantity: 80,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1579165466741-7f35a4755657?w=600&h=600&fit=crop',
    category: 'Peptides',
  },
  {
    name: 'HCG 7,000IU',
    slug: 'hcg-7000iu',
    description: 'Human Chorionic Gonadotropin 7,000IU. Pharmaceutical grade for research applications.',
    price: 40.00,
    quantity: 200,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop',
    category: 'Hormones',
  },
  {
    name: 'BPC-157 5MG',
    slug: 'bpc-157-5mg',
    description: 'Body Protection Compound 157 with 99.88% purity. Enhanced healing and tissue repair research.',
    price: 40.00,
    quantity: 180,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&h=600&fit=crop',
    category: 'Peptides',
  },
  {
    name: 'HCG 18,000IU',
    slug: 'hcg-18000iu',
    description: 'High-dose Human Chorionic Gonadotropin 18,000IU. Extended research applications.',
    price: 80.00,
    quantity: 100,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&h=600&fit=crop',
    category: 'Hormones',
  },
  {
    name: 'BPC-157 10MG',
    slug: 'bpc-157-10mg',
    description: 'High-concentration BPC-157 10MG with 98.51% purity. Advanced tissue regeneration studies.',
    price: 70.00,
    quantity: 90,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1579165466741-7f35a4755657?w=600&h=600&fit=crop',
    category: 'Peptides',
  },
];

async function addProducts() {
  console.log('Adding products to database...');
  
  for (const product of products) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();
      
      if (error) {
        console.error(`Error adding ${product.name}:`, error);
      } else {
        console.log(`✓ Added ${product.name} successfully`);
      }
    } catch (err) {
      console.error(`Error processing ${product.name}:`, err);
    }
  }
  
  console.log('Product addition complete!');
}

addProducts();