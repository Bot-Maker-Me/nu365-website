import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Microscope, ShieldCheck, Beaker, Atom, FlaskConical, FileCheck } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { AnimatedButton } from '@/components/AnimatedButton';
import { SectionHeading } from '@/components/SectionHeading';
import { ProductCard } from '@/components/ProductCard';
import { ScrollVelocityContainer, ScrollVelocityRow } from '@/components/ui/scroll-based-velocity';
import { BlurFade } from '@/components/ui/blur-fade';
import { supabase, type Product } from '@/lib/supabaseClient';

const features = [
  { icon: Microscope, title: 'Precision Synthesized', desc: 'Every compound is synthesized to >99% purity using validated protocols.' },
  { icon: ShieldCheck, title: 'Quality Assured', desc: 'Full chain of custody with batch-level COA documentation.' },
  { icon: Beaker, title: 'Rapid Fulfillment', desc: 'Same-day processing for in-stock items with cold-chain shipping.' },
  { icon: Atom, title: 'Novel Chemistry', desc: 'Exclusive access to proprietary scaffolds and first-in-class modulators.' },
  { icon: FileCheck, title: 'Regulatory Ready', desc: 'Documentation packages designed for IRB and IACUC submissions.' },
  { icon: FlaskConical, title: 'Expert Support', desc: 'Direct access to PhD-level scientists for technical consultation.' },
];

const trustBadges = [
  'ISO 9001:2015',
  'cGMP Compliant',
  'DEA Licensed',
  'USP Reference',
  'Peer Reviewed',
];

export function LandingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (data) setProducts(data);
        setProductsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />

      <Hero />

      {/* Scroll velocity banner */}
      <BlurFade inView>
        <ScrollVelocityContainer>
          <ScrollVelocityRow baseVelocity={2} direction={1} className="py-8 bg-gradient-to-r from-[#0A0A0F] via-[#12121A] to-[#0A0A0F] border-y border-[#1F1F2E]/50">
            <div className="flex items-center gap-8 px-8">
              <span className="text-2xl font-bold font-heading text-white whitespace-nowrap">✨ Premium Research Compounds</span>
              <span className="text-xl text-muted-foreground whitespace-nowrap">•</span>
              <span className="text-2xl font-bold font-heading text-white whitespace-nowrap">🔬 Lab-Tested Quality</span>
              <span className="text-xl text-muted-foreground whitespace-nowrap">•</span>
              <span className="text-2xl font-bold font-heading text-white whitespace-nowrap">🚀 Fast Shipping</span>
              <span className="text-xl text-muted-foreground whitespace-nowrap">•</span>
              <span className="text-2xl font-bold font-heading text-white whitespace-nowrap">🛡️ Secure Packaging</span>
              <span className="text-xl text-muted-foreground whitespace-nowrap">•</span>
              <span className="text-2xl font-bold font-heading text-white whitespace-nowrap">📋 Full Documentation</span>
            </div>
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
      </BlurFade>

      {/* Features */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading
            center
            eyebrow="Why choose us"
            title="Built for the modern laboratory"
            description="Every aspect of our process is designed to meet the exacting standards of today's leading research institutions."
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.1 }}>
                <motion.div
                  className="glass-card rounded-2xl p-6 h-full"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 0 30px rgba(59, 130, 246, 0.15)"
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center mb-5 border border-[#1F1F2E]"
                    whileHover={{
                      rotate: 360,
                      backgroundColor: "rgba(59, 130, 246, 0.2)"
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product preview */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <SectionHeading
              eyebrow="Featured compounds"
              title="From our latest catalog"
              description="A selection of our most recent and in-demand research compounds."
            />
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-secondary/20 animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, i) => (
                <BlurFade key={product.id} inView delay={i * 0.1}>
                  <ProductCard product={product} index={i} />
                </BlurFade>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No products available yet.
            </div>
          )}
        </div>
      </section>

      {/* Trust badges */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6"
          >
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge}
                className="flex items-center gap-2.5"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <ShieldCheck className="w-5 h-5 text-primary/60" />
                </motion.div>
                <span className="text-sm font-medium text-muted-foreground">{badge}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
