import { Link } from 'react-router-dom';
import {
  AlertTriangle, ArrowRight, Atom, Beaker, FileCheck, FlaskConical, Microscope, ShieldCheck,
} from 'lucide-react';
import { Hero } from '@/components/Hero';
import { Marquee } from '@/components/Marquee';
import { ProductGrid } from '@/components/ProductGrid';
import { SectionHeading } from '@/components/SectionHeading';
import { BlurFade } from '@/components/ui/blur-fade';
import { useProducts } from '@/lib/products';

const FEATURED_COUNT = 6;

const marquee = [
  '✨ Premium Research Compounds',
  '🔬 Lab-Tested Quality',
  '🚀 Fast Shipping',
  '🛡️ Secure Packaging',
  '📋 Full Documentation',
];

const features = [
  { icon: Microscope, title: 'Precision Synthesized', desc: 'Every compound is synthesized to >99% purity using validated protocols.' },
  { icon: ShieldCheck, title: 'Quality Assured', desc: 'Full chain of custody with batch-level COA documentation.' },
  { icon: Beaker, title: 'Rapid Fulfillment', desc: 'Same-day processing for in-stock items with cold-chain shipping.' },
  { icon: Atom, title: 'Novel Chemistry', desc: 'Exclusive access to proprietary scaffolds and first-in-class modulators.' },
  { icon: FileCheck, title: 'Regulatory Ready', desc: 'Documentation packages designed for IRB and IACUC submissions.' },
  { icon: FlaskConical, title: 'Expert Support', desc: 'Direct access to PhD-level scientists for technical consultation.' },
];

const trustBadges = ['ISO 9001:2015', 'cGMP Compliant', 'DEA Licensed', 'USP Reference', 'Peer Reviewed'];

const disclaimerTags = ['Research Use Only', 'Not for Human Consumption', '18+ Only'];

const container = 'mx-auto max-w-7xl px-6 lg:px-8';

export default function LandingPage() {
  const { products, loading, error } = useProducts();

  return (
    <>
      <Hero />

      {/* Scrolling banner */}
      <BlurFade inView>
        <Marquee className="border-y border-[#1F1F2E]/50 bg-gradient-to-r from-[#0A0A0F] via-[#12121A] to-[#0A0A0F] py-8">
          <div className="flex items-center gap-8 px-8">
            {marquee.map((text) => (
              <span key={text} className="flex items-center gap-8 whitespace-nowrap">
                <span className="font-heading text-2xl font-bold text-white">{text}</span>
                <span className="text-xl text-muted-foreground">•</span>
              </span>
            ))}
          </div>
        </Marquee>
      </BlurFade>

      {/* Features */}
      <section className="py-24">
        <div className={container}>
          <SectionHeading
            center
            eyebrow="Why choose us"
            title="Built for the modern laboratory"
            description="Every aspect of our process is designed to meet the exacting standards of today's leading research institutions."
          />
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <BlurFade key={title} inView delay={(i % 3) * 0.1}>
                <div className="glass-card h-full rounded-2xl p-6 transition-transform hover:scale-[1.02]">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#1F1F2E] bg-secondary/50">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-semibold">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-24">
        <div className={container}>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Featured compounds"
              title="From our latest catalog"
              description="A selection of our most recent and in-demand research compounds."
            />
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProductGrid
            products={products?.slice(0, FEATURED_COUNT) ?? null}
            loading={loading}
            error={error}
            emptyText="No products available yet."
          />
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-16">
        <BlurFade inView className={`${container} flex flex-wrap items-center justify-center gap-x-12 gap-y-6`}>
          {trustBadges.map((badge) => (
            <span key={badge} className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground">
              <ShieldCheck className="h-5 w-5 text-primary/60" /> {badge}
            </span>
          ))}
        </BlurFade>
      </section>

      {/* Legal disclaimer */}
      <section className="border-t border-[#1F1F2E] py-12">
        <div className={container}>
          <BlurFade inView className="glass-card flex items-start gap-4 rounded-2xl border border-yellow-500/20 p-8">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-500/20">
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="mb-2 font-heading text-lg font-semibold text-yellow-400">Important Legal Disclaimer</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                All products sold on this website are strictly for research purposes only. These products are not
                intended for human consumption, diagnostic use, or as therapeutic agents. By purchasing from this
                site, you acknowledge and agree that you are at least 18 years of age and will use these products
                solely for legitimate research purposes in compliance with all applicable local, state, and federal
                laws and regulations. The purchaser assumes all liability for the use or misuse of these products.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {disclaimerTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </BlurFade>
        </div>
      </section>
    </>
  );
}
