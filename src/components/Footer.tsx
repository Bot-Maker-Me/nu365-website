import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, MapPin, Shield } from 'lucide-react';
import { Logo } from './Logo';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export function Footer() {
  const { settings } = useSiteSettings();
  const siteName = settings.site_name ?? 'THE NU365';
  const email = settings.email ?? 'info@nu365.com';
  const address = settings.address ?? 'Cambridge, MA';
  const bio = settings.bio ?? 'Premium research compounds for the modern laboratory. Advancing scientific discovery through precision chemistry.';

  return (
    <footer className="relative mt-32 border-t border-[#1F1F2E] bg-[#05050A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          <div className="md:col-span-2">
            <Logo className="mb-4" siteName={siteName} />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground text-sm leading-relaxed max-w-sm mt-4"
            >
              {bio}
            </motion.p>
            <div className="flex items-center gap-4 mt-6">
              <motion.div
                className="flex items-center gap-2 text-xs text-muted-foreground"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Shield className="w-4 h-4" />
                </motion.div>
                ISO 9001 Certified
              </motion.div>
              <motion.div
                className="flex items-center gap-2 text-xs text-muted-foreground"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <MapPin className="w-4 h-4" /> {address}
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="font-heading font-semibold text-sm mb-4">Navigation</h4>
            <ul className="space-y-2.5">
              {['Home', 'Enquiry'].map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                >
                  <Link
                    to={item === 'Home' ? '/' : '/enquiry'}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <h4 className="font-heading font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Terms of Service'].map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.45 + index * 0.1 }}
                >
                  <Link
                    to={item === 'Privacy Policy' ? '/privacy-policy' : '/terms-of-service'}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="font-heading font-semibold text-sm mb-4">Contact</h4>
            <motion.div
              className="flex items-center gap-2 text-sm text-muted-foreground"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Mail className="w-4 h-4" />
              <a href={`mailto:${email}`} className="hover:text-foreground transition-colors">{email}</a>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 pt-8 border-t border-[#1F1F2E] flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteName}. For research use only. Not for human consumption.
          </p>
          <p className="text-xs text-muted-foreground">
            All products are tested and verified in certified laboratories.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
