import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
