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

// Slugs of the duplicate products to delete
const duplicateProductSlugs = [
  'bpc-157-10mg-v2',
  'bpc-157-10mg-v3',
  'cjc-1295-with-dac-5mg-v2',
  'cjc-without-dac-ipamorelin-10mg-v2',
  'ghk-cu-100mg-v2',
  'ghk-cu-100mg-v3',
  'ghk-cu-100mg-v4',
  'klow-blend-bpc-tb-ghk-kpv-80mg-v2',
  'retatrutide-20mg-v2',
  'retatrutide-20mg-v3',
  'retatrutide-20mg-v4',
  'tb-500-10mg-v2',
  'tb-500-10mg-v3'
];

console.log(`Deleting ${duplicateProductSlugs.length} duplicate products...\n`);

let successCount = 0;
let errorCount = 0;

for (const slug of duplicateProductSlugs) {
  try {
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('slug', slug)
      .select();
    
    if (error) {
      console.error(`Error deleting ${slug}:`, error.message);
      errorCount++;
    } else {
      console.log(`✅ Deleted: ${slug}`);
      successCount++;
    }
  } catch (err) {
    console.error(`Error deleting ${slug}:`, err.message);
    errorCount++;
  }
}

console.log(`\n=== SUMMARY ===`);
console.log(`✅ Successfully deleted: ${successCount} products`);
console.log(`❌ Failed to delete: ${errorCount} products`);
