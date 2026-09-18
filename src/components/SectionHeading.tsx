import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  center?: boolean;
};

export function SectionHeading({ eyebrow, title, description, center }: Props) {
  return (
    <div className={center ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'}>
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-3"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] gradient-text">
            {eyebrow}
          </span>
        </motion.div>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="text-3xl md:text-4xl font-bold font-heading tracking-tight"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 text-muted-foreground text-base leading-relaxed"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
