import { createContext, useContext, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

const HoverContext = createContext(false);

/** Tilts towards the cursor. `CardItem`s inside lift off the card while it is hovered. */
export function CardContainer({
  children,
  className,
  containerClassName,
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const tilt = (e: MouseEvent) => {
    const el = ref.current!;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 30;
    const y = (e.clientY - top - height / 2) / 30;
    el.style.transition = '';
    el.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  };

  const reset = () => {
    setHovered(false);
    ref.current!.style.transition = 'transform 0.3s ease-out';
    ref.current!.style.transform = '';
  };

  return (
    <HoverContext.Provider value={hovered}>
      <div className={cn('flex items-center justify-center', containerClassName)} style={{ perspective: '1000px' }}>
        <div
          ref={ref}
          onMouseEnter={() => setHovered(true)}
          onMouseMove={tilt}
          onMouseLeave={reset}
          className={cn('relative flex items-center justify-center will-change-transform [transform-style:preserve-3d]', className)}
        >
          {children}
        </div>
      </div>
    </HoverContext.Provider>
  );
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('[transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]', className)}>{children}</div>;
}

/** Content that moves `translateZ` px towards the viewer while the card is hovered. */
export function CardItem({
  children,
  className,
  translateZ = 0,
}: {
  children: ReactNode;
  className?: string;
  translateZ?: number;
}) {
  const hovered = useContext(HoverContext);
  return (
    <div
      className={cn('w-fit transition-transform duration-300 will-change-transform', className)}
      style={{ transform: hovered ? `translateZ(${translateZ}px)` : undefined }}
    >
      {children}
    </div>
  );
}
