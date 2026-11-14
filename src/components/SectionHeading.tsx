import type { ReactNode } from 'react';
import { BlurFade } from '@/components/ui/blur-fade';

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  center?: boolean;
};

export function SectionHeading({ eyebrow, title, description, center }: Props) {
  return (
    <BlurFade inView className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <span className="gradient-text mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em]">
          {eyebrow}
        </span>
      )}
      <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>}
    </BlurFade>
  );
}
