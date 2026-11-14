import { useRef, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

type Props = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before fading in. */
  delay?: number;
  /** Wait until the element scrolls into view instead of fading in on mount. */
  inView?: boolean;
};

const hidden = { y: -6, opacity: 0, filter: 'blur(6px)' };
const visible = { y: 0, opacity: 1, filter: 'blur(0px)' };

/** Fades content in from a blur. */
export function BlurFade({ children, className, delay = 0, inView = false }: Props) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={hidden}
      animate={!inView || seen ? visible : hidden}
      transition={{ delay: 0.04 + delay, duration: 0.4, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
