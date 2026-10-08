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
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('Starting product import...\n');

const isLabelVariant = (product) => /_v\d+_/.test(product.image) || /\bv[2-9]\b/i.test(product.strength);

// All unique products from the zip file (v2/v3/v4 label variants are skipped)
const allProducts = [
  { name: "5-AMINO-1MQ", strength: "5MG", image: "5-AMINO-1MQ_5MG_matte-silver-reflection.png" },
  { name: "AICAR", strength: "50MG", image: "AICAR_50MG_matte-silver-reflection.png" },
  { name: "BPC-157", strength: "10MG", image: "BPC-157_10MG_matte-silver-reflection.png" },
  { name: "BPC-157", strength: "10MG v2", image: "BPC-157_10MG_v2_matte-silver-reflection.png" },
  { name: "BPC-157", strength: "10MG v3", image: "BPC-157_10MG_v3_matte-silver-reflection.png" },
  { name: "CJC-1295", strength: "10MG", image: "CJC-1295_10MG_matte-silver-reflection.png" },
  { name: "CJC-1295 WITH DAC", strength: "5MG", image: "CJC-1295_WITH_DAC_5MG_matte-silver-reflection.png" },
  { name: "CJC-1295 WITH DAC", strength: "5MG v2", image: "CJC-1295_WITH_DAC_5MG_v2_matte-silver-reflection.png" },
  { name: "CJC WITHOUT DAC IPAMORELIN", strength: "10MG", image: "CJC_WITHOUT_DAC_IPAMORELIN_10MG_matte-silver-reflection.png" },
  { name: "CJC WITHOUT DAC IPAMORELIN", strength: "10MG v2", image: "CJC_WITHOUT_DAC_IPAMORELIN_10MG_v2_matte-silver-reflection.png" },
  { name: "EPITALON", strength: "50MG", image: "EPITALON_50MG_matte-silver-reflection.png" },
  { name: "GHK-Cu", strength: "100MG", image: "GHK-CU_100MG_matte-silver-reflection.png" },
  { name: "GHK-Cu", strength: "100MG v2", image: "GHK-CU_100MG_v2_matte-silver-reflection.png" },
  { name: "GHK-Cu", strength: "100MG v3", image: "GHK-Cu_100MG_v3_matte-silver-reflection.png" },
  { name: "GHK-Cu", strength: "100MG v4", image: "GHK-Cu_100MG_v4_matte-silver-reflection.png" },
  { name: "GLOW BLEND BPC GHK TB", strength: "70MG", image: "GLOW_BLEND_BPC_GHK_TB_70MG_matte-silver-reflection.png" },
  { name: "GLUTATHIONE", strength: "1500", image: "GLUTATHIONE_1500_matte-silver-reflection.png" },
  { name: "HCG", strength: "10000IU", image: "HCG_10000IU_matte-silver-reflection.png" },
  { name: "HEALING BLEND BPC-157 TB-500", strength: "20MG", image: "HEALING_BLEND_BPC-157_TB-500_20MG_matte-silver-reflection.png" },
  { name: "HEXARELIN ACETATE", strength: "5MG", image: "HEXARELIN_ACETATE_5MG_matte-silver-reflection.png" },
  { name: "IGF-1LR3", strength: "1MG", image: "IGF-1LR3_1MG_matte-silver-reflection.png" },
  { name: "IPAMORELIN", strength: "10MG", image: "IPAMORELIN_10MG_matte-silver-reflection.png" },
  { name: "KISSPEPTIN", strength: "10MG", image: "KISSPEPTIN_10MG_matte-silver-reflection.png" },
  { name: "KLOW BLEND BPC TB GHK KPV", strength: "80MG", image: "KLOW_BLEND_BPC_TB_GHK_KPV_80MG_matte-silver-reflection.png" },
  { name: "KLOW BLEND BPC TB GHK KPV", strength: "80MG v2", image: "KLOW_BLEND_BPC_TB_GHK_KPV_80MG_v2_matte-silver-reflection.png" },
  { name: "KPV", strength: "10MG", image: "KPV_10MG_matte-silver-reflection.png" },
  { name: "MELANOTAN-2", strength: "10MG", image: "MELANOTAN-2_10MG_matte-silver-reflection.png" },
  { name: "MGF", strength: "2MG", image: "MGF_2MG_matte-silver-reflection.png" },
  { name: "MOTS-C", strength: "40MG", image: "MOTS-C_40MG_matte-silver-reflection.png" },
  { name: "PEG-MGF", strength: "2MG", image: "PEG-MGF_2MG_matte-silver-reflection.png" },
  { name: "PINEALON", strength: "20MG", image: "PINEALON_20MG_matte-silver-reflection.png" },
  { name: "PT-141", strength: "10MG", image: "PT-141_10MG_matte-silver-reflection.png" },
  { name: "RETATRUTIDE", strength: "20MG", image: "RETATRUTIDE_20MG_matte-silver-reflection.png" },
  { name: "RETATRUTIDE", strength: "20MG v2", image: "RETATRUTIDE_20MG_v2_matte-silver-reflection.png" },
  { name: "RETATRUTIDE", strength: "20MG v3", image: "RETATRUTIDE_20MG_v3_matte-silver-reflection.png" },
  { name: "RETATRUTIDE", strength: "20MG v4", image: "RETATRUTIDE_20MG_v4_matte-silver-reflection.png" },
  { name: "SELANK", strength: "11MG", image: "SELANK_11MG_matte-silver-reflection.png" },
  { name: "SEMAX", strength: "11MG", image: "SEMAX_11MG_matte-silver-reflection.png" },
  { name: "SERMORELIN", strength: "5MG", image: "SERMORELIN_5MG_matte-silver-reflection.png" },
  { name: "SLU-PP-322", strength: "Research Only", image: "SLU-PP-322_research-only_matte-silver-reflection.png" },
  { name: "SS-31", strength: "50MG", image: "SS-31_50MG_matte-silver-reflection.png" },
  { name: "TB-500", strength: "10MG", image: "TB-500_10MG_matte-silver-reflection.png" },
  { name: "TB-500", strength: "10MG v2", image: "TB-500_10MG_v2_matte-silver-reflection.png" },
  { name: "TB-500", strength: "10MG v3", image: "TB-500_10MG_v3_matte-silver-reflection.png" },
  { name: "TESAMORELIN", strength: "10MG", image: "TESAMORELIN_10MG_matte-silver-reflection.png" },
  { name: "THYMOSIN ALPHA-1", strength: "10MG", image: "THYMOSIN_ALPHA-1_10MG_matte-silver-reflection.png" }
];

// Pricing function
const setDefaultPrice = (strength) => {
  const numMatch = strength.match(/(\d+)/);
  if (!numMatch) return 50;
  
  const num = parseInt(numMatch[1]);
  
  if (num <= 2) return 80;
  if (num <= 5) return 60;
  if (num <= 10) return 50;
  if (num <= 20) return 70;
  if (num <= 50) return 90;
  if (num <= 100) return 120;
  if (num >= 1000) return 150;
  
  return 50;
};

// Get existing products
console.log('Fetching existing products...');
const { data: existingProducts, error: fetchError } = await supabase
  .from('products')
  .select('name, slug');

if (fetchError) {
  console.error('Error fetching existing products:', fetchError.message);
  console.log('\nWill attempt to insert all products anyway...');
}

const existingSlugs = existingProducts ? new Set(existingProducts.map(p => p.slug)) : new Set();
console.log(`Found ${existingSlugs.size} existing products in database\n`);

// Find products to add
const productsToAdd = [];

for (const product of allProducts.filter((p) => !isLabelVariant(p))) {
  const fullName = `${product.name} ${product.strength}`;
  const slug = fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  if (!existingSlugs.has(slug)) {
    productsToAdd.push({
      name: fullName,
      slug: slug,
      description: `High-quality ${fullName} for research purposes only.`,
      price: setDefaultPrice(product.strength),
      quantity: 10,
      in_stock: true,
      image_url: `/products/${product.image}`,
      category: "Research Compounds"
    });
  }
}

console.log(`Found ${productsToAdd.length} new products to add\n`);

if (productsToAdd.length === 0) {
  console.log('No new products to add. All products already exist in the database.');
  process.exit(0);
}

// Insert new products in batches
let successCount = 0;
let errorCount = 0;
const batchSize = 10;

for (let i = 0; i < productsToAdd.length; i += batchSize) {
  const batch = productsToAdd.slice(i, i + batchSize);
  console.log(`Inserting batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(productsToAdd.length / batchSize)}...`);
  
  const { data, error } = await supabase
    .from('products')
    .insert(batch)
    .select();
  
  if (error) {
    console.error(`Error inserting batch:`, error.message);
    errorCount += batch.length;
    
    // Try inserting one by one
    for (const product of batch) {
      try {
        const { error: singleError } = await supabase
          .from('products')
          .insert(product);
        
        if (singleError) {
          console.error(`Error inserting ${product.name}:`, singleError.message);
          errorCount++;
        } else {
          console.log(`✅ Added: ${product.name} - $${product.price}`);
          successCount++;
        }
      } catch (err) {
        console.error(`Error inserting ${product.name}:`, err.message);
        errorCount++;
      }
    }
  } else {
    batch.forEach(product => {
      console.log(`✅ Added: ${product.name} - $${product.price}`);
    });
    successCount += batch.length;
  }
}

console.log(`\n=== IMPORT COMPLETE ===`);
console.log(`✅ Successfully added: ${successCount} products`);
console.log(`❌ Failed to add: ${errorCount} products`);

if (successCount === productsToAdd.length) {
  console.log(`\n🎉 All new products added successfully!`);
  console.log(`Refresh your website to see the new products.`);
} else {
  console.log(`\n⚠️ Some products failed to add. Please check the errors above.`);
}
