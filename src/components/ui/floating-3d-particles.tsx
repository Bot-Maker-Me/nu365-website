import { useEffect, useRef } from 'react';

type Props = {
  /** Any CSS colour. */
  color?: string;
  /** Particle count on desktop; phones get 20% of it. */
  quantity?: number;
};

type Particle = {
  angle: number; // position around the vertical axis
  radius: number; // distance from the axis
  y: number; // height, wraps around when it leaves the canvas
  size: number;
  speed: number; // rotation per frame
  alpha: number;
  // Screen position and perspective scale, recomputed every frame.
  sx: number;
  sy: number;
  scale: number;
};

const SIZE = 5; // average radius in px
const ALPHA = 0.3; // average opacity
const DRIFT = 0.8; // upward speed in px per frame
const FOV = 500; // perspective: field of view, camera distance and depth swing
const DISTANCE = 450;
const DEPTH = 200;

/** Decorative canvas of drifting particles rotating around a central axis in 3D. */
export function Floating3DParticles({ color = '#8B5CF6', quantity = 400 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let onScreen = true;
    let needsStaticFrame = true;

    const randomRadius = () => Math.random() * Math.max(width, height) * 1.2;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = window.innerWidth < 768 ? Math.round(quantity * 0.2) : quantity;
      particles = Array.from({ length: count }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: randomRadius(),
        y: (Math.random() - 0.5) * height * 2,
        size: SIZE * (0.6 + Math.random() * 0.8),
        speed: 0.0015 + Math.random() * 0.001,
        alpha: ALPHA - 0.2 + Math.random() * 0.4,
        sx: 0,
        sy: 0,
        scale: 1,
      }));
      needsStaticFrame = true;
    };

    // `animate` moves the particles first; the static frame (reduced motion) only paints them.
    const paint = (animate: boolean) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;

      for (const p of particles) {
        if (animate) {
          p.angle += p.speed;
          p.y -= DRIFT;
          if (p.y < -height) {
            p.y = height;
            p.radius = randomRadius();
          }
        }
        const swing = animate ? Math.sin(p.angle) * DEPTH : 0;
        p.scale = FOV / Math.max(1, FOV + DISTANCE + swing);
        p.sx = width / 2 + Math.cos(p.angle) * p.radius * p.scale;
        p.sy = height / 2 + p.y * p.scale;
      }

      // Far particles first, so near ones draw on top.
      particles.sort((a, b) => a.scale - b.scale);
      for (const p of particles) {
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, p.size * p.scale, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    let frame = requestAnimationFrame(function tick() {
      frame = requestAnimationFrame(tick);
      if (document.hidden || !onScreen) return;
      if (!reducedMotion.matches) {
        paint(true);
      } else if (needsStaticFrame) {
        paint(false);
        needsStaticFrame = false;
      }
    });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    visibilityObserver.observe(canvas);
    const repaint = () => (needsStaticFrame = true);
    reducedMotion.addEventListener('change', repaint);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      reducedMotion.removeEventListener('change', repaint);
    };
  }, [color, quantity]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
