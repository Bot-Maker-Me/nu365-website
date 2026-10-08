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

// Use service role key to bypass RLS
const supabase = createClient(supabaseUrl, serviceRoleKey || anonKey);

console.log('Counting total products in database...\n');

try {
  const { data, error, count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error('Error counting products:', error.message);
  } else {
    console.log(`Total products in database: ${count}`);
    
    // Also get the list of products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('name, slug')
      .order('name');
    
    if (productsError) {
      console.error('Error fetching products:', productsError.message);
    } else {
      console.log('\nCurrent products:');
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} (${product.slug})`);
      });
    }
  }
} catch (err) {
  console.error('Error:', err.message);
}
