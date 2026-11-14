-- Products table: the only database table the website needs.
--
-- Security model:
--   * Visitors (anon key) can READ products.
--   * Nobody can write through the API. Add or edit products in the Supabase dashboard
--     (Table Editor) or SQL editor — those use the service role, which bypasses RLS.

create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,           -- used in the URL: /product/<slug>
  description text,
  price       numeric(10, 2) not null default 0,
  quantity    integer not null default 0,
  in_stock    boolean not null default true,
  image_url   text,                           -- e.g. /products/bpc-157-10mg.webp
  category    text,
  created_at  timestamptz not null default now()
);

alter table public.products enable row level security;

-- Table privilege first, then the row policy below. Without this grant the API
-- answers 401 "permission denied" even though the policy allows the read.
grant select on public.products to anon, authenticated;

drop policy if exists "Anyone can read products" on public.products;
create policy "Anyone can read products"
  on public.products for select
  to anon, authenticated
  using (true);
