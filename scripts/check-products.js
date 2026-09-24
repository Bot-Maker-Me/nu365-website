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

console.log('Checking current products in database...\n');

const { data: currentProducts, error } = await supabase
  .from('products')
  .select('id, name, slug, image_url')
  .order('created_at', { ascending: false });

if (error) {
  console.error('Error fetching products:', error.message);
  process.exit(1);
}

console.log(`Found ${currentProducts.length} products in database:\n`);
currentProducts.forEach((product, index) => {
  console.log(`${index + 1}. ${product.name} (${product.slug})`);
  console.log(`   Image: ${product.image_url}`);
  console.log('');
});

// Load expected products from our data file
const expectedProducts = JSON.parse(fs.readFileSync(path.join(__dirname, '../products-data.json'), 'utf8'));

console.log(`\nExpected ${expectedProducts.length} products from vial labels:\n`);
expectedProducts.slice(0, 10).forEach((product, index) => {
  console.log(`${index + 1}. ${product.name} ${product.strength} (${product.slug})`);
});

if (expectedProducts.length > 10) {
  console.log(`... and ${expectedProducts.length - 10} more`);
}

// Find missing products
const currentSlugs = new Set(currentProducts.map(p => p.slug));
const missingProducts = expectedProducts.filter(p => !currentSlugs.has(p.slug));

console.log(`\n\n=== SUMMARY ===`);
console.log(`Current products in database: ${currentProducts.length}`);
console.log(`Expected products from images: ${expectedProducts.length}`);
console.log(`Missing products: ${missingProducts.length}`);

if (missingProducts.length > 0) {
  console.log(`\nMissing products:`);
  missingProducts.forEach(p => {
    console.log(`- ${p.name} ${p.strength} (${p.slug})`);
  });
}