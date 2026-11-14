import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { MedicineAnimation } from '@/components/MedicineAnimation';
import { site } from '@/config/site';

// The particle canvas is purely decorative, so load it after the first paint.
const Particles = lazy(() =>
  import('@/components/ui/floating-3d-particles').then((m) => ({ default: m.Floating3DParticles }))
);

const ease = [0.22, 1, 0.36, 1] as const;

// Children fade up one after another.
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const buttonClass =
  'inline-flex items-center gap-2 rounded-lg px-8 py-4 font-semibold transition-colors';

export function Hero() {
  return (
    <section className="relative flex h-screen min-h-[700px] items-center overflow-hidden bg-[#050505] pt-16 md:pt-0">
      <MedicineAnimation />

      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <Particles color="#8B5CF6" quantity={100} />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Darken for text contrast, plus a fade from the bottom */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 to-transparent to-50%" />

      <div className="relative mx-auto w-full max-w-[800px] px-6 lg:mx-0 lg:ml-[5%] lg:px-8">
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/80 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              {site.tagline}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-8 font-heading text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {site.headline}
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
            {site.subheadline}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
            <Link to="/shop" className={`${buttonClass} bg-white text-black hover:bg-white/90`}>
              VIEW ALL PRODUCTS <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/enquiry" className={`${buttonClass} border border-white/20 text-white hover:bg-white/10`}>
              <FileText className="h-4 w-4" /> SEND ENQUIRY
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
