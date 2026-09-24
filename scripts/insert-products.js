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
const supabaseAnonKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  ...product,
  price: setDefaultPrice(product.strength),
  name: `${product.name} ${product.strength}`, // Include strength in name
  slug: product.slug
}));

console.log('Inserting products into Supabase...');

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

console.log(`\nInsertion complete:`);
console.log(`✅ Successfully inserted: ${successCount} products`);
console.log(`❌ Failed to insert: ${errorCount} products`);