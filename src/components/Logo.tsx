import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  siteName?: string;
};

export function Logo({ className, siteName = 'THE NU365' }: Props) {
  return (
    <Link to="/" className={cn('flex items-center gap-2.5 group', className)}>
      {/* Glowing accent dot */}
      <span className="relative flex items-center justify-center w-2.5 h-2.5">
        <span className="absolute w-2.5 h-2.5 rounded-full bg-[#3B82F6] shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
        <span className="absolute w-2.5 h-2.5 rounded-full bg-[#3B82F6] animate-ping opacity-40" />
      </span>

      <img 
        src="/logo.png" 
        alt={siteName}
        className="h-8 w-auto"
      />
    </Link>
  );
}
