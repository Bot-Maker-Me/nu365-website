import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

const FALLBACK_SUPABASE_URL = 'https://placeholder.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'public-anon-key-not-configured';

function isValidHttpUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

const isSupabaseConfigured = isValidHttpUrl(supabaseUrl) && Boolean(supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    '[supabase] Missing or invalid VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. ' +
      'Running without a database connection and falling back to the bundled product catalog. ' +
      'Set both variables in your .env file to enable live data.'
  );
}

// Always export a usable client so importing this module never crashes the app.
// When Supabase is not configured, requests fail and pages fall back to the
// bundled catalog; when it is configured, the real credentials are used.
export const supabase = createClient(
  isValidHttpUrl(supabaseUrl) ? supabaseUrl : FALLBACK_SUPABASE_URL,
  supabaseAnonKey || FALLBACK_SUPABASE_ANON_KEY
);

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  quantity: number;
  in_stock: boolean;
  image_url: string | null;
  category: string | null;
  created_at: string;
};

export type ProductInput = Omit<Product, 'id' | 'created_at'>;

export type SiteSettings = {
  id: number;
  site_name: string | null;
  hero_image_url: string | null;
  hero_headline: string | null;
  hero_subheadline: string | null;
  bio: string | null;
  email: string | null;
  address: string | null;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
};

export type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  total: number;
  items: OrderItem[];
  created_at: string;
};
