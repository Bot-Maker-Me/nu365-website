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

// Define the missing products with their version variants
const missingProducts = [
  {
    name: "SLU-PP-322",
    slug: "slu-pp-322",
    description: "High-quality SLU-PP-322 for research purposes only.",
    price: 75,
    quantity: 10,
    in_stock: true,
    image_url: "/products/SLU-PP-322_research-only_matte-silver-reflection.png",
    category: "Research Compounds"
  }
];

console.log(`Adding ${missingProducts.length} missing products...\n`);

let successCount = 0;
let errorCount = 0;

for (const product of missingProducts) {
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
      errorCount++;
    } else {
      console.log(`✅ Inserted: ${product.name} - $${product.price}`);
      successCount++;
    }
  } catch (err) {
    console.error(`Error inserting ${product.name}:`, err.message);
    errorCount++;
  }
}

console.log(`\n=== SUMMARY ===`);
console.log(`✅ Successfully inserted: ${successCount} products`);
console.log(`❌ Failed to insert: ${errorCount} products`);
console.log(`Total products should now be: ${32 + successCount}`);