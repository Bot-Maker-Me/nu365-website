import { useEffect, useState } from 'react';
import { supabase, type SiteSettings } from '@/lib/supabaseClient';

const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  site_name: 'THE NU365',
  hero_image_url: null,
  hero_headline: 'Proof over promises.',
  hero_subheadline: 'Premium-grade research compounds. Independent lab testing with complete batch transparency.',
  bio: 'Premium research compounds for the modern laboratory. Advancing scientific discovery through precision chemistry.',
  email: 'hnayel@yahoo.com',
  address: 'Cambridge, MA',
  updated_at: '',
};

let cachedSettings: SiteSettings | null = null;
let fetchPromise: Promise<SiteSettings> | null = null;

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(cachedSettings ?? DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(!cachedSettings);

  useEffect(() => {
    if (cachedSettings) {
      setSettings(cachedSettings);
      setLoading(false);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = (async () => {
        try {
          const { data } = await supabase
            .from('site_settings')
            .select('*')
            .eq('id', 1)
            .maybeSingle();
          if (data) {
            cachedSettings = data as SiteSettings;
          } else {
            cachedSettings = DEFAULT_SETTINGS;
          }
        } catch {
          cachedSettings = DEFAULT_SETTINGS;
        }
        return cachedSettings;
      })();
    }

    fetchPromise!.then((result) => {
      setSettings(result);
      setLoading(false);
    });
  }, []);

  return { settings, loading };
}

export function invalidateSiteSettingsCache() {
  cachedSettings = null;
  fetchPromise = null;
}
