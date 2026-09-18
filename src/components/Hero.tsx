import { motion } from 'framer-motion';
import { ArrowRight, FileText, ShieldCheck, MapPin, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { MedicineAnimation } from '@/components/MedicineAnimation';
import { Floating3DParticles } from '@/components/ui/floating-3d-particles';

const trustIndicators = [
  { icon: ShieldCheck, label: 'Janoshik Verified' },
  { icon: MapPin, label: 'Ships from Canada' },
  { icon: Package, label: 'No Customs Delays' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const lineReveal = {
  hidden: { y: '100%' },
  show: { y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Hero() {
  const { settings } = useSiteSettings();

  const headline = settings.hero_headline ?? 'Proof over promises.';
  const subheadline = settings.hero_subheadline ?? 'Premium-grade research compounds. Independent lab testing with complete batch transparency.';
  const heroImageUrl = settings.hero_image_url;

  const headlineLines = headline.split('\n').filter((line) => line.trim().length > 0);
  if (headlineLines.length === 0) headlineLines.push(headline);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden bg-[#050505] flex items-center">
      {/* Medicine animation background */}
      <MedicineAnimation />

      {/* Floating 3D particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <Floating3DParticles color="#8B5CF6" quantity={400} />
      </div>

      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Subtle gradient from bottom for depth */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(5,5,5,0.9) 0%, transparent 50%)' }}
      />

      {/* Content */}
      <div className="relative max-w-[800px] mx-auto px-6 lg:px-8 w-full lg:mx-0 lg:ml-[5%]">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={{ willChange: 'transform' }}
        >
          {/* Top badge */}
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-xs font-semibold uppercase tracking-[0.15em] text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Canada-Wide Research Peptides
            </span>
          </motion.div>

          {/* Headline with masked text reveal */}
          <div className="mt-8 space-y-0">
            {headlineLines.map((line, i) => (
              <div key={i} className="overflow-hidden">
                <motion.h1
                  variants={lineReveal}
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-heading tracking-tight leading-[1.02] text-white"
                >
                  {line}
                </motion.h1>
              </div>
            ))}
          </div>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-white/60 leading-relaxed max-w-xl"
          >
            {subheadline}
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col sm:flex-row items-start gap-4"
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-white text-black font-semibold hover:bg-white/90 transition-colors"
            >
              SHOP ALL PRODUCTS
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              <FileText className="w-4 h-4" />
              VIEW LAB REPORTS
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={fadeUp}
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3"
          >
            {trustIndicators.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <item.icon className="w-4 h-4 text-white/40" />
                <span className="text-sm font-medium text-white/50">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
