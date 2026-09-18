import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: Variant;
  size?: Size;
  className?: string;
  disabled?: boolean;
};

const variants: Record<Variant, string> = {
  primary: 'gradient-bg text-white border-transparent',
  outline: 'border border-[#1F1F2E] bg-transparent text-foreground hover:border-primary/50',
  ghost: 'bg-transparent text-muted-foreground hover:text-foreground',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-13 px-8 text-base py-3.5',
};

export function AnimatedButton({
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
    'relative inline-flex items-center justify-center rounded-xl font-medium overflow-hidden transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none',
    variants[variant],
    sizes[size],
    className
  );

  const content = (
    <>
      <span className="absolute inset-0 shimmer opacity-0 hover:opacity-100 transition-opacity duration-300" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  );

  const motionProps = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring' as const, stiffness: 400, damping: 17 },
    style: { willChange: 'transform' } as const,
  };

  if (to) {
    return (
      <motion.div {...motionProps}>
        <Link to={to} className={baseClass}>
          {content}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.a href={href} className={baseClass} {...motionProps}>
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} onClick={onClick} className={baseClass} disabled={disabled} {...motionProps}>
      {content}
    </motion.button>
  );
}
