import { useEffect, useState } from 'react';

/**
 * Product catalog, read from the Supabase `products` table.
 *
 * Caching (stale-while-revalidate):
 *  1. The last response is kept in localStorage, so repeat visits render instantly.
 *  2. One network request per page load, shared by every page (the promise is memoised).
 *  3. If the request fails, the cached copy stays on screen.
 */

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
};

const API_URL = import.meta.env.VITE_SUPABASE_URL;
const API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const CACHE_KEY = 'nu365:products:v1';
const COLUMNS = 'id,name,slug,description,image_url,category';

function readCache(): Product[] | null {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null');
  } catch {
    return null;
  }
}

let request: Promise<Product[]> | null = null;

/** Fetch the catalog once per page load and refresh the local cache. */
function loadProducts(): Promise<Product[]> {
  request ??= fetch(`${API_URL}/rest/v1/products?select=${COLUMNS}&order=name`, {
    headers: { apikey: API_KEY },
  })
    .then((res) => {
      if (!res.ok) throw new Error(`Products request failed (${res.status})`);
      return res.json() as Promise<Product[]>;
    })
    .then((products) => {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(products));
      } catch {
        /* storage full or blocked — the cache is optional */
      }
      return products;
    })
    .catch((error) => {
      request = null; // allow a retry on the next mount
      throw error;
    });
  return request;
}

/** All products. `products` is null until the first data (cached or fresh) arrives. */
export function useProducts() {
  const [products, setProducts] = useState<Product[] | null>(readCache);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    loadProducts().then(setProducts).catch(() => setFailed(true));
  }, []);

  return { products, loading: !products && !failed, error: !products && failed };
}
