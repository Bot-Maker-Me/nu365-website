import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AnimatedButton } from '@/components/AnimatedButton';
import { supabase, type Product } from '@/lib/supabaseClient';
import { findCatalogProduct } from '@/lib/productCatalog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    email: '',
    message: '',
  });

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data, error: fetchError }) => {
        const resolved = findCatalogProduct(slug, data ?? null);
        if (!resolved) {
          setError(fetchError?.message ?? 'Product not found');
          setProduct(null);
        } else {
          setProduct(resolved);
          setError(null);
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-[#0A0A0F]"
      >
        <Navbar />
        <div className="pt-32 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="aspect-square rounded-2xl bg-secondary/20 animate-pulse"
            />
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="h-8 bg-secondary/20 rounded animate-pulse w-3/4"
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="h-4 bg-secondary/20 rounded animate-pulse w-1/2"
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="h-24 bg-secondary/20 rounded animate-pulse"
              />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!product) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="min-h-screen bg-[#0A0A0F]"
      >
        <Navbar />
        <div className="pt-32 max-w-7xl mx-auto px-6 lg:px-8 text-center py-20">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-heading font-bold mb-4"
          >
            Product not found
          </motion.h1>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-sm text-red-400 mb-6"
            >
              {error}
            </motion.p>
          )}
          <AnimatedButton to="/shop" variant="outline">Back to Shop</AnimatedButton>
        </div>
      </motion.div>
    );
  }

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inquiryForm.email) {
      toast.error('Please enter your email address');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/send-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: product.name,
          userEmail: inquiryForm.email,
          userMessage: inquiryForm.message,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Inquiry sent successfully! We\'ll get back to you soon.');
        setDialogOpen(false);
        setInquiryForm({ email: '', message: '' });
      } else {
        toast.error(data.error || 'Failed to send inquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error sending inquiry:', error);
      toast.error('Failed to send inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-[#0A0A0F]"
      >
        <Navbar />

        <section className="relative pt-28 pb-12">
          <div className="absolute inset-0 grid-pattern opacity-20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Shop
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="relative aspect-[4/5] rounded-2xl glass-card overflow-hidden group bg-white/5">
                <img
                  src={product.image_url ?? `https://picsum.photos/seed/${product.slug}/800/800`}
                  alt={product.name}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                  style={{ willChange: 'transform' }}
                />
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {product.category && (
                <span className="text-xs font-semibold uppercase tracking-[0.2em] gradient-text">
                  {product.category}
                </span>
              )}
              <h1 className="mt-3 text-3xl md:text-4xl font-bold font-heading tracking-tight">
                {product.name}
              </h1>

              <p className="mt-6 text-muted-foreground leading-relaxed text-base">
                {product.description}
              </p>

              {/* Inquire button */}
              <div className="mt-8">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <AnimatedButton size="lg" className="gradient-bg text-white border-transparent glow-hover">
                      <Mail className="w-4 h-4" /> Inquire
                    </AnimatedButton>
                  </DialogTrigger>
                  <DialogContent className="glass border-[#1F1F2E] bg-[#12121A]">
                    <DialogHeader>
                      <DialogTitle className="font-heading">Inquire: {product.name}</DialogTitle>
                      <DialogDescription>
                        Send us an inquiry and our team will get back to you within 24 hours with pricing and availability details.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleInquirySubmit} className="mt-4 space-y-4">
                      <div className="glass-card rounded-xl p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Product</span>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Your Email</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={inquiryForm.email}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                          placeholder="your.email@example.com"
                          className="bg-secondary/20 border-[#1F1F2E]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message (Optional)</Label>
                        <Textarea
                          id="message"
                          value={inquiryForm.message}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                          placeholder="Any specific questions about this product?"
                          rows={3}
                          className="bg-secondary/20 border-[#1F1F2E] resize-none"
                        />
                      </div>
                      <AnimatedButton 
                        type="submit" 
                        size="lg" 
                        className="w-full"
                        disabled={submitting}
                      >
                        {submitting ? (
                          'Sending...'
                        ) : (
                          <>
                            <Send className="w-4 h-4" /> Send Inquiry
                          </>
                        )}
                      </AnimatedButton>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="mt-20">
        <Footer />
      </div>
    </motion.div>
  </AnimatePresence>
  );
}
