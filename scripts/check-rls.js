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

console.log('Testing with ANON key (what the website uses)...');

const supabase = createClient(supabaseUrl, anonKey);

const { data: anonProducts, error: anonError } = await supabase
  .from('products')
  .select('id, name, slug')
  .order('created_at', { ascending: false });

if (anonError) {
  console.error('Error with anon key:', anonError.message);
} else {
  console.log(`Found ${anonProducts.length} products with anon key (website view):`);
  anonProducts.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name} (${p.slug})`);
  });
}

console.log('\n' + '='.repeat(50) + '\n');

// Try with service role key to see what's actually in the database
const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY;
if (serviceRoleKey) {
  console.log('Testing with SERVICE ROLE key (admin view)...');
  
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
  
  const { data: adminProducts, error: adminError } = await supabaseAdmin
    .from('products')
    .select('id, name, slug')
    .order('created_at', { ascending: false });
  
  if (adminError) {
    console.error('Error with service role key:', adminError.message);
  } else {
    console.log(`Found ${adminProducts.length} products with service role key (admin view):`);
    adminProducts.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} (${p.slug})`);
    });
  }
}