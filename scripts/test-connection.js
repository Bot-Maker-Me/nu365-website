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

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Service Role Key (first 20 chars):', serviceRoleKey?.substring(0, 20) + '...');

try {
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  
  // Test connection by trying to query the products table
  const { data, error } = await supabase.from('products').select('count').single();
  
  if (error) {
    console.error('Connection test failed:', error.message);
    console.error('Error details:', error);
  } else {
    console.log('✅ Connection successful!');
    console.log('Current product count:', data);
  }
} catch (err) {
  console.error('Connection test error:', err.message);
}