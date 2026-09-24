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

console.log('=== SUPABASE CONNECTION VERIFICATION ===');
console.log('URL:', supabaseUrl);
console.log('Anon Key (first 20 chars):', anonKey?.substring(0, 20) + '...');
console.log('');

const supabase = createClient(supabaseUrl, anonKey);

// Test connection and get all products
console.log('Fetching all products with anon key...');
const { data: products, error } = await supabase
  .from('products')
  .select('*')
  .order('created_at', { ascending: false });

if (error) {
  console.error('Error:', error.message);
  console.error('Error details:', error);
} else {
  console.log(`✅ Successfully connected to Supabase`);
  console.log(`📦 Found ${products.length} products`);
  console.log('');
  
  console.log('Product list:');
  products.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name} (${p.slug})`);
    console.log(`   Image: ${p.image_url}`);
    console.log(`   Category: ${p.category}`);
    console.log('');
  });
  
  // Check if we have the expected vial label products
  const hasVialProducts = products.some(p => p.image_url?.includes('/products/'));
  console.log(`Has vial label products: ${hasVialProducts ? '✅ YES' : '❌ NO'}`);
}