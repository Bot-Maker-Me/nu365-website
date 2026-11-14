import { Link } from 'react-router-dom';
import { Mail, MapPin, Shield } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { site } from '@/config/site';

const linkClass = 'text-sm text-muted-foreground transition-colors hover:text-foreground';

const columns = [
  {
    title: 'Navigation',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Shop', to: '/shop' },
      { label: 'Enquiry', to: '/enquiry' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms of Service', to: '/terms-of-service' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-32 border-t border-[#1F1F2E] bg-[#05050A]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{site.bio}</p>
            <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" /> ISO 9001 Certified
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {site.address}
              </span>
            </div>
          </div>

          {columns.map(({ title, links }) => (
            <div key={title}>
              <h4 className="mb-4 font-heading text-sm font-semibold">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, to }) => (
                  <li key={to}>
                    <Link to={to} className={linkClass}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact (kept out of the columns array because it is a mailto link) */}
          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold">Contact</h4>
            <a href={`mailto:${site.email}`} className={`flex items-center gap-2 ${linkClass}`}>
              <Mail className="h-4 w-4" /> {site.email}
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#1F1F2E] pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {site.name}. For research use only. Not for human consumption.
          </p>
          <p className="text-xs text-muted-foreground">
            All products are tested and verified in certified laboratories.
          </p>
        </div>
      </div>
    </footer>
  );
}
