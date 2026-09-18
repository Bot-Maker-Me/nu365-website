# NovaBio — Research Compounds Catalog

A modern, animated e-commerce catalog for research compounds built with React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, and Supabase.

## Features

- **Landing Page** — Animated hero with gradient headline, feature grid, product preview, trust badges
- **Shop Page** — Product grid with instant search, category pills, sort dropdown
- **Product Detail** — Large image with zoom hover, quantity selector, inquiry dialog with mailto link
- **Admin Dashboard** — Protected route with sidebar layout, product table, add/edit/delete via dialogs, inline price/quantity editing, stock toggle
- **Auth** — Supabase email/password authentication protecting admin routes

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion (animations)
- Supabase (database + auth)
- Lucide React (icons)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. The Supabase project is pre-provisioned. Environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) are pre-populated in `.env`.

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. To access the admin dashboard, create an admin user through Supabase Auth (email/password), then navigate to `/login` and sign in.

## Database Schema

The `products` table:

| Column       | Type         | Description                    |
|--------------|--------------|--------------------------------|
| id           | uuid (PK)    | Auto-generated                 |
| name         | text         | Compound name                  |
| slug         | text (unique)| URL-friendly identifier         |
| description  | text         | Detailed description            |
| price        | numeric      | Price in USD                   |
| quantity     | int          | Available inventory             |
| in_stock     | boolean      | Stock status                    |
| image_url    | text         | Product image URL               |
| category     | text         | Compound category               |
| created_at   | timestamptz  | Creation timestamp              |

### RLS Policies

- **Public SELECT** — Anyone can browse products
- **Authenticated INSERT/UPDATE/DELETE** — Only signed-in admins can manage products

## Build

```bash
npm run build
```
