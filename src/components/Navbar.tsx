import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/Logo';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
];

const linkClass = (active: boolean) =>
  `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
    active ? 'bg-secondary/50 text-foreground' : 'text-muted-foreground hover:text-foreground'
  }`;

const ctaClass =
  'rounded-lg bg-white px-6 py-2 text-center text-sm font-semibold text-black transition-colors hover:bg-white/90';

export function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Frosted background once the page is scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu after navigating.
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || menuOpen ? 'glass border-b border-[#1F1F2E]/50' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {links.map(({ label, to }) => (
            <Link key={to} to={to} className={linkClass(pathname === to)}>
              {label}
            </Link>
          ))}
        </div>

        <Link to="/enquiry" className={`hidden md:block ${ctaClass}`}>
          Send Enquiry
        </Link>

        <button
          className="p-2 text-foreground md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-2 border-t border-[#1F1F2E]/50 px-6 py-4 md:hidden">
          {links.map(({ label, to }) => (
            <Link key={to} to={to} className={linkClass(pathname === to)}>
              {label}
            </Link>
          ))}
          <Link to="/enquiry" className={`mt-2 ${ctaClass}`}>
            Send Enquiry
          </Link>
        </div>
      )}
    </nav>
  );
}
