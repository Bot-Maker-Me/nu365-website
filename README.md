# THE NU365 website

Product catalog and enquiry site. React + Vite + TypeScript + Tailwind, with Supabase for the product list and Resend for enquiry emails.

## How it works

| Part | What it does |
| --- | --- |
| `src/pages` | Home, Shop, Product detail, Enquiry form, Privacy, Terms |
| `src/config/site.ts` | Brand name, hero text, contact email, address — edit text here |
| `src/lib/products.ts` | Loads products from Supabase and caches them in the browser |
| `api/enquiry.js` | Serverless function that emails enquiries (Resend) |
| `public/products/` | Product images (WebP, named `<slug>.webp`) |
| `supabase/` | Database schema and the product seed |

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev
```

The enquiry API (`/api/enquiry`) only runs on Vercel or with `vercel dev`.

## Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | build | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | build | Supabase public (anon / publishable) key |
| `RESEND_API_KEY` | server | Sends enquiry emails |
| `RECIPIENT_EMAIL` | server | Inbox that receives enquiries |
| `FROM_EMAIL` | server, optional | Sender on a domain verified in Resend |

Set them in Vercel → Project → Settings → Environment Variables, then redeploy.

## Managing products

There is no admin panel. Use the Supabase dashboard → **Table Editor → products**:

- **Add**: insert a row. `slug` must be unique and URL-safe (`bpc-157-10mg`). Put the image in `public/products/<slug>.webp`, set `image_url` to `/products/<slug>.webp`, and redeploy.
- **Edit / delete**: change or delete the row. Visitors see changes within a page load.
- Convert new images to WebP, about 900 px tall, before adding them (large images are what make sites slow).

## Moving to a new Supabase project

1. Create a project at supabase.com.
2. SQL Editor → run `supabase/migrations/20260101000000_create_products.sql`, then `supabase/seed.sql`.
3. Settings → API: copy the **Project URL** and the **anon / publishable key**.
4. Put them in Vercel as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then redeploy.

## Performance notes

- Images are WebP (about 3 MB for the whole catalog; it was 180 MB of PNG).
- Products are cached in `localStorage` and refreshed in the background, so repeat visits show instantly.
- Pages load on demand; hashed JS/CSS and product images are sent with long cache headers (`vercel.json`).
