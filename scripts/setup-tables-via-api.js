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
const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

// Create client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey);

console.log('Checking if products table exists...\n');

// Try to query the products table
const { data, error } = await supabase.from('products').select('count').limit(1);

if (error) {
  console.error('Products table does not exist or is not accessible.');
  console.error('Error:', error.message);
  console.log('\nTo create the table, please:');
  console.log('1. Go to https://supabase.com/dashboard/project/hrahcesdeomfjjyevqyr/sql');
  console.log('2. Copy and paste the SQL from create-tables.sql');
  console.log('3. Click "Run"');
  console.log('\nThen run this script again.');
  process.exit(1);
}

console.log('✅ Products table exists and is accessible!');
console.log('\nNow running the product import script...');
