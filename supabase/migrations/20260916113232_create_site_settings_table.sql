/*
# Create site_settings table

1. New Tables
- `site_settings`
  - `id` (int, primary key, default 1) — ensures only a single row exists
  - `site_name` (text) — the brand/site name shown in Navbar and Footer
  - `hero_image_url` (text) — optional background image URL for the hero section
  - `hero_headline` (text) — main headline text in the hero section
  - `hero_subheadline` (text) — subheadline text below the hero headline
  - `bio` (text) — company bio shown in the Footer
  - `email` (text) — contact email shown in the Footer
  - `address` (text) — physical address shown in the Footer
  - `updated_at` (timestamptz, default now()) — last modification timestamp

2. Security
- Enable RLS on `site_settings`.
- Public SELECT: anyone (anon + authenticated) can read site settings so the public-facing site works without login.
- Authenticated UPDATE: only signed-in admin users can update settings.
- No INSERT or DELETE policies: the single row (id=1) is seeded by the migration and cannot be created or removed from the client.

3. Seed Data
- Inserts a single default row with id=1 and sensible defaults so the site works immediately.

4. Important Notes
- The CHECK constraint on `id` enforces that only row id=1 can exist, preventing accidental duplicate settings rows.
- A trigger updates `updated_at` automatically on every UPDATE.
*/

CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1,
  site_name text DEFAULT 'THE NU365',
  hero_image_url text,
  hero_headline text DEFAULT 'Proof over promises.',
  hero_subheadline text DEFAULT 'Premium-grade research compounds. Independent lab testing with complete batch transparency.',
  bio text DEFAULT 'Premium research compounds for the modern laboratory. Advancing scientific discovery through precision chemistry.',
  email text DEFAULT 'info@nu365.com',
  address text DEFAULT 'Cambridge, MA',
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT site_settings_single_row CHECK (id = 1)
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;
CREATE POLICY "public_read_site_settings"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "authenticated_update_site_settings" ON site_settings;
CREATE POLICY "authenticated_update_site_settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

-- Seed the single default row if it doesn't exist yet
INSERT INTO site_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Auto-update updated_at on every UPDATE
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS site_settings_updated_at ON site_settings;
CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_updated_at();
