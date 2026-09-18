import { Link } from 'react-router-dom';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'accent' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
};

const variants = {
  primary: 'bg-[#3B82F6] hover:bg-[#2563EB]',
  secondary: 'bg-[#8B5CF6] hover:bg-[#7C3AED]',
  accent: 'bg-[#EC4899] hover:bg-[#DB2777]',
  success: 'bg-[#10B981] hover:bg-[#059669]',
};

const sizes = {
  sm: 'px-8 py-2.5 text-sm',
  md: 'px-12 py-3 text-base',
  lg: 'px-16 py-4 text-lg',
};

export function PremiumButton({
  children,
  to,
  href,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className,
  disabled,
}: Props) {
  const baseClass = cn(
    'rounded-full font-bold text-white tracking-widest uppercase',
    'transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]',
    'disabled:opacity-50 disabled:pointer-events-none',
    variants[variant],
    sizes[size],
    className
  );

  const content = children;

  if (to) {
    return (
      <Link to={to} className={baseClass}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={baseClass}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={baseClass}
      disabled={disabled}
    >
      {content}
    </button>
  );
}