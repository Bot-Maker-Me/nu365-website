import type { Product } from '@/lib/supabaseClient';
import catalog from '@/data/products.json';

export const localCatalogProducts: Product[] = catalog.map((product) => ({
  id: product.slug,
  name: product.name,
  slug: product.slug,
  description: product.description,
  price: product.price,
  quantity: product.quantity,
  in_stock: product.in_stock,
  image_url: product.image_url,
  category: product.category,
  created_at: '',
}));

export function isLabelVariant(product: Pick<Product, 'name' | 'slug' | 'image_url'>): boolean {
  return (
    /(^|-)v[2-9](-|$)/i.test(product.slug) ||
    /\bv[2-9]\b/i.test(product.name) ||
    /_v\d+_/i.test(product.image_url ?? '')
  );
}

export function mergeProductCatalog(dbProducts: Product[] | null | undefined): Product[] {
  const fromDb = (dbProducts ?? []).filter(
    (product) => !isLabelVariant(product) && !(product.image_url ?? '').includes('picsum.photos')
  );
  const bySlug = new Map(fromDb.map((product) => [product.slug, product]));

  for (const product of localCatalogProducts) {
    if (!bySlug.has(product.slug)) {
      bySlug.set(product.slug, product);
    }
  }

  return Array.from(bySlug.values());
}

export function findCatalogProduct(slug: string, dbProduct: Product | null): Product | null {
  if (dbProduct && !isLabelVariant(dbProduct)) return dbProduct;
  return localCatalogProducts.find((product) => product.slug === slug) ?? null;
}
