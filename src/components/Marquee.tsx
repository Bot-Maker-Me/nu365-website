import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  /** Percent of one copy's width travelled per second. */
  speed?: number;
  className?: string;
};

const mod = (n: number, m: number) => ((n % m) + m) % m;

/**
 * Endless horizontal ticker. The content is repeated to fill the row and the row
 * speeds up, and follows the direction, while the page is scrolled.
 */
export function Marquee({ children, speed = 2, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(1);
  const offset = useMotionValue(0);
  const blockWidth = useMotionValue(0);
  const direction = useRef(1);
  const inView = useRef(true);
  const reducedMotion = useReducedMotion();

  // Scroll velocity, smoothed and clamped to [-5, 5].
  const smoothVelocity = useSpring(useVelocity(useScroll().scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(smoothVelocity, (v) => Math.max(-5, Math.min(5, v / 200)));

  // Measure one copy and work out how many are needed to fill the row.
  useEffect(() => {
    const container = containerRef.current!;
    const block = blockRef.current!;
    const measure = () => {
      blockWidth.set(block.scrollWidth);
      setCopies(block.scrollWidth > 0 ? Math.max(3, Math.ceil(container.offsetWidth / block.scrollWidth) + 2) : 1);
    };
    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);
    resizeObserver.observe(block);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting;
    });
    visibilityObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [blockWidth]);

  const x = useTransform([offset, blockWidth], ([o, w]: number[]) => `${-mod(o, w || 1)}px`);

  useAnimationFrame((_, delta) => {
    const width = blockWidth.get();
    if (!inView.current || document.hidden || width <= 0) return;

    const scrollBoost = boost.get();
    if (Math.abs(scrollBoost) > 0.1) direction.current = Math.sign(scrollBoost);
    const speedUp = reducedMotion ? 1 : 1 + Math.abs(scrollBoost);
    offset.set(offset.get() + direction.current * ((width * speed) / 100) * speedUp * (delta / 1000));
  });

  return (
    <div ref={containerRef} className={cn('w-full overflow-hidden whitespace-nowrap', className)}>
      <motion.div className="inline-flex transform-gpu select-none items-center will-change-transform" style={{ x }}>
        {Array.from({ length: copies }, (_, i) => (
          <div key={i} ref={i === 0 ? blockRef : null} aria-hidden={i !== 0} className="inline-flex shrink-0 items-center">
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
