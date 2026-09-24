import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read all PNG files from the products directory
const productsDir = path.join(__dirname, '../public/products');
const files = fs.readdirSync(productsDir).filter(file => file.endsWith('.png'));

// Parse product data from filenames
const products = files.map(filename => {
  // Remove the extension and the matte-silver-reflection suffix
  let baseName = filename.replace('.png', '').replace('_matte-silver-reflection', '');
  
  // Remove version suffixes (v2, v3, v4, etc.)
  baseName = baseName.replace(/_v\d+$/, '');
  
  // Split by underscore to separate name and strength
  const parts = baseName.split('_');
  
  // The last part is usually the strength (e.g., "10MG", "5MG", "10000IU")
  const strength = parts[parts.length - 1];
  
  // Everything before the strength is the product name
  const name = parts.slice(0, -1).join(' ');
  
  // Create a slug from the name and strength
  const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${strength.toLowerCase()}`;
  
  // Image URL
  const image_url = `/products/${filename}`;
  
  return {
    name,
    strength,
    slug,
    image_url,
    description: `High-quality ${name} ${strength} for research purposes only.`,
    price: 0, // Default price, will need to be updated
    quantity: 10, // Default quantity
    in_stock: true,
    category: 'Research Compounds'
  };
});

// Remove duplicates (keeping first occurrence)
const uniqueProducts = [];
const seen = new Set();

products.forEach(product => {
  const key = `${product.name}_${product.strength}`;
  if (!seen.has(key)) {
    seen.add(key);
    uniqueProducts.push(product);
  }
});

console.log(`Found ${uniqueProducts.length} unique products from ${files.length} files`);

// Save to JSON file
fs.writeFileSync(
  path.join(__dirname, '../products-data.json'),
  JSON.stringify(uniqueProducts, null, 2)
);

console.log('Product data saved to products-data.json');
console.log('\nSample products:');
uniqueProducts.slice(0, 5).forEach(p => {
  console.log(`- ${p.name} ${p.strength} (${p.slug})`);
});