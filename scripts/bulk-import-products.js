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

// SERVICE ROLE KEY - This bypasses RLS policies
// You need to get this from your Supabase dashboard
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('Missing VITE_SUPABASE_URL in .env file');
  process.exit(1);
}

if (!serviceRoleKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  console.error('Please add it to your .env file or pass it as an environment variable');
  console.error('You can get it from: Supabase Dashboard -> Project Settings -> API -> service_role (secret)');
  process.exit(1);
}

// Create client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey);

console.log('Starting bulk product import with service role key...\n');

// Load product data
const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../products-data.json'), 'utf8'));

console.log(`Loaded ${productsData.length} products from products-data.json`);

// Set reasonable default prices based on strength ranges
const setDefaultPrice = (strength) => {
  const numMatch = strength.match(/(\d+)/);
  if (!numMatch) return 50; // Default price
  
  const num = parseInt(numMatch[1]);
  
  // Simple pricing logic based on strength
  if (num <= 2) return 80;
  if (num <= 5) return 60;
  if (num <= 10) return 50;
  if (num <= 20) return 70;
  if (num <= 50) return 90;
  if (num <= 100) return 120;
  if (num >= 1000) return 150;
  
  return 50; // Default
};

// Add reasonable prices to products
const productsWithPrices = productsData.map(product => ({
  name: `${product.name} ${product.strength}`, // Include strength in name
  slug: product.slug,
  description: product.description,
  price: setDefaultPrice(product.strength),
  quantity: product.quantity,
  in_stock: product.in_stock,
  image_url: product.image_url,
  category: product.category
}));

console.log('Step 1: Deleting all existing products...');
const { error: deleteError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

if (deleteError) {
  console.error('Error deleting existing products:', deleteError.message);
  process.exit(1);
}

console.log('✅ Deleted all existing products');

console.log('\nStep 2: Inserting new products...');

let successCount = 0;
let errorCount = 0;

for (const product of productsWithPrices) {
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

console.log(`\n=== IMPORT COMPLETE ===`);
console.log(`✅ Successfully inserted: ${successCount} products`);
console.log(`❌ Failed to insert: ${errorCount} products`);

if (successCount === productsWithPrices.length) {
  console.log(`\n🎉 All products imported successfully!`);
  console.log(`Refresh your website to see the new products.`);
} else {
  console.log(`\n⚠️ Some products failed to import. Please check the errors above.`);
}