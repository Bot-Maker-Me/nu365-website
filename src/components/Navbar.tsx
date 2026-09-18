import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { PremiumButton } from './PremiumButton';
import { Logo } from './Logo';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useCart } from '@/context/CartContext';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
];

export function Navbar() {
  const { settings } = useSiteSettings();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? 'glass border-b border-[#1F1F2E]/50' : 'bg-transparent'
      }`}
      style={{ willChange: 'transform' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Logo siteName={settings.site_name ?? undefined} />

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <motion.div
                key={link.to}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  to={link.to}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === link.to
                      ? 'text-foreground bg-secondary/50'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/cart"
                className="relative p-2 text-foreground hover:text-primary transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>
            </motion.div>
            <PremiumButton to="/shop" variant="primary" size="sm">
              Browse Catalog
            </PremiumButton>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/cart"
                className="relative p-2 text-foreground"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>
            </motion.div>
            <motion.button
              className="p-2 text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden glass border-t border-[#1F1F2E]/50"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {links.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Link
                    to={link.to}
                    className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      location.pathname === link.to
                        ? 'text-foreground bg-secondary/50'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <PremiumButton to="/shop" variant="primary" size="sm" className="mt-2 w-full">
                Browse Catalog
              </PremiumButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
