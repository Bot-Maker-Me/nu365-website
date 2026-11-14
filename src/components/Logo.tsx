import { Link } from 'react-router-dom';
import { site } from '@/config/site';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`}>
      {/* Glowing accent dot */}
      <span className="relative h-2.5 w-2.5">
        <span className="absolute inset-0 rounded-full bg-[#3B82F6] shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
        <span className="absolute inset-0 animate-ping rounded-full bg-[#3B82F6] opacity-40" />
      </span>
      <img src="/logo.png" alt={site.name} className="h-8 w-auto" />
    </Link>
  );
}
