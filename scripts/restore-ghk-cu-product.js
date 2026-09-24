import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = envContent.split('\n').reduce((acc, line) => {
  const [key, value] = line.split('=');
  if (key && value) {
    acc[key.trim()] = value.trim();
  }
  return acc;
}, {});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const anonKey = envVars.VITE_SUPABASE_ANON_KEY;
const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

// Use service role key to bypass RLS for insertion
const supabase = createClient(supabaseUrl, serviceRoleKey || anonKey);

// GHK-CU 100MG product
const product = {
  name: "GHK-CU 100MG",
  slug: "ghk-cu-100mg",
  description: "High-quality GHK-CU 100MG for research purposes only.",
  price: 120,
  quantity: 10,
  in_stock: true,
  image_url: "/products/GHK-CU_100MG_matte-silver-reflection.png",
  category: "Research Compounds"
};

console.log(`Adding GHK-CU 100MG product...\n`);

try {
  const { data, error } = await supabase
    .from('products')
    .insert({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      in_stock: product.in_stock,
      image_url: product.image_url,
      category: product.category
    })
    .select();
  
  if (error) {
    console.error(`Error inserting ${product.name}:`, error.message);
  } else {
    console.log(`✅ Inserted: ${product.name} - $${product.price}`);
  }
} catch (err) {
  console.error(`Error inserting ${product.name}:`, err.message);
}
