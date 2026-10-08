import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = envContent.split('\n').reduce((acc, line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return acc;
  const eq = trimmed.indexOf('=');
  if (eq === -1) return acc;
  const key = trimmed.slice(0, eq).trim();
  const value = trimmed.slice(eq + 1).trim();
  if (key && value) acc[key] = value;
  return acc;
}, {});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !(serviceRoleKey || anonKey)) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey || anonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const productsDir = path.join(__dirname, '../public/products');
const files = fs.readdirSync(productsDir).filter((file) => {
  if (!file.toLowerCase().endsWith('.png')) return false;
  if (file.startsWith('._')) return false;
  if (/_v\d+_/.test(file)) return false;
  if (/^RESEARCH_ONLY_/i.test(file)) return false;
  return true;
});

const setDefaultPrice = (strength) => {
  const numMatch = strength.match(/(\d+)/);
  if (!numMatch) return 75;

  const num = parseInt(numMatch[1], 10);

  if (num <= 2) return 80;
  if (num <= 5) return 60;
  if (num <= 10) return 50;
  if (num <= 20) return 70;
  if (num <= 50) return 90;
  if (num <= 100) return 120;
  if (num >= 1000) return 150;

  return 50;
};

const uniqueProducts = files.map((filename) => {
  const baseName = filename.replace(/\.png$/i, '').replace(/_matte-silver-reflection$/i, '');
  const parts = baseName.split('_');
  const strengthRaw = parts[parts.length - 1];
  const name = parts.slice(0, -1).join(' ');
  const strength = strengthRaw.replace(/-/g, ' ');
  const slug = `${name} ${strength}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return {
    name: `${name} ${strength}`,
    compoundName: name,
    strength,
    slug,
    description: `High-quality ${name} ${strength} for research purposes only.`,
    price: setDefaultPrice(strength),
    quantity: 10,
    in_stock: true,
    image_url: `/products/${filename}`,
    category: 'Research Compounds'
  };
});

fs.writeFileSync(
  path.join(__dirname, '../products-data.json'),
  JSON.stringify(
    uniqueProducts.map((p) => ({
      name: p.compoundName,
      strength: p.strength,
      slug: p.slug,
      image_url: p.image_url,
      description: p.description,
      price: 0,
      quantity: p.quantity,
      in_stock: p.in_stock,
      category: p.category
    })),
    null,
    2
  )
);

console.log(`Unique products from labels (no v2/v3/v4): ${uniqueProducts.length}\n`);
uniqueProducts.forEach((p, i) => {
  console.log(`${i + 1}. ${p.name} (${p.slug})`);
});

const { data: existingProducts, error: fetchError } = await supabase
  .from('products')
  .select('id, name, slug, image_url');

if (fetchError) {
  console.error('\nError fetching existing products:', fetchError.message);
  process.exit(1);
}

const existing = existingProducts || [];
console.log(`\nFound ${existing.length} products currently in the database.`);

const isVariant = (product) =>
  /\bv[2-9]\b/i.test(product.slug) ||
  /\bv[2-9]\b/i.test(product.name) ||
  /_v\d+_/i.test(product.image_url || '');

const variants = existing.filter(isVariant);
if (variants.length > 0) {
  console.log(`\nRemoving ${variants.length} duplicate variant products...`);
  for (const product of variants) {
    const { error } = await supabase.from('products').delete().eq('id', product.id);
    if (error) {
      console.error(`Failed to delete ${product.name}:`, error.message);
    } else {
      console.log(`Deleted variant: ${product.name}`);
    }
  }
}

const { data: remainingProducts, error: remainingError } = await supabase
  .from('products')
  .select('id, name, slug');

if (remainingError) {
  console.error('\nError re-fetching products:', remainingError.message);
  process.exit(1);
}

const remaining = remainingProducts || [];
const existingSlugs = new Set(remaining.map((p) => p.slug));
const existingNames = new Set(remaining.map((p) => p.name.toLowerCase()));

const toInsert = uniqueProducts
  .filter((p) => !existingSlugs.has(p.slug) && !existingNames.has(p.name.toLowerCase()))
  .map(({ compoundName, strength, ...row }) => row);

console.log(`\nNew products to insert: ${toInsert.length}`);

let successCount = 0;
let errorCount = 0;

for (const product of toInsert) {
  const { error } = await supabase.from('products').insert(product);
  if (error) {
    console.error(`Failed to insert ${product.name}:`, error.message);
    errorCount += 1;
  } else {
    console.log(`Added: ${product.name} - $${product.price}`);
    successCount += 1;
  }
}

const { data: finalProducts, error: finalError } = await supabase
  .from('products')
  .select('name, slug')
  .order('name');

if (finalError) {
  console.error('\nError counting final products:', finalError.message);
  process.exit(1);
}

console.log('\n=== SYNC COMPLETE ===');
console.log(`Inserted: ${successCount}`);
console.log(`Failed: ${errorCount}`);
console.log(`Catalog size: ${finalProducts.length}`);
console.log('\nLive catalog:');
finalProducts.forEach((p, i) => {
  console.log(`${i + 1}. ${p.name} (${p.slug})`);
});
