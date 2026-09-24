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

// Use service role key to bypass RLS for deletion
const supabase = createClient(supabaseUrl, serviceRoleKey || anonKey);

// Delete GHK-CU 100MG product
const slug = 'ghk-cu-100mg';

console.log(`Deleting GHK-CU 100MG product...\n`);

try {
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('slug', slug)
    .select();
  
  if (error) {
    console.error(`Error deleting ${slug}:`, error.message);
  } else {
    console.log(`✅ Deleted: ${slug}`);
  }
} catch (err) {
  console.error(`Error deleting ${slug}:`, err.message);
}
