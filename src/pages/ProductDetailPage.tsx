import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, Minus, Plus, Mail, ShoppingCart } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AnimatedButton } from '@/components/AnimatedButton';
import { useCart } from '@/context/CartContext';
import { supabase, type Product } from '@/lib/supabaseClient';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { addToCart } = useCart();

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
        if (fetchError) {
          setError(fetchError.message);
          setProduct(null);
        } else {
          setProduct(data);
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

  const inquirySubject = `Inquiry: ${product.name}`;
  const inquiryBody = `I'm interested in ${product.name} (${product.slug}).\n\nQuantity: ${quantity}\nPrice: $${Number(product.price).toFixed(2)}\n\nPlease provide more information.`;
  const mailtoLink = `mailto:info@nu365.com?subject=${encodeURIComponent(inquirySubject)}&body=${encodeURIComponent(inquiryBody)}`;

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
              <div className="relative aspect-square rounded-2xl glass-card overflow-hidden group">
                <img
                  src={product.image_url ?? `https://picsum.photos/seed/${product.slug}/800/800`}
                  alt={product.name}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ willChange: 'transform' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F]/60 via-transparent to-transparent" />
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

              <div className="mt-4 flex items-center gap-3">
                {product.in_stock ? (
                  <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                    <span className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
                    In Stock
                  </span>
                ) : (
                  <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                    Out of Stock
                  </span>
                )}
                <span className="text-sm text-muted-foreground">
                  {product.quantity > 0 ? `${product.quantity} units available` : 'Currently unavailable'}
                </span>
              </div>

              <p className="mt-6 text-muted-foreground leading-relaxed text-base">
                {product.description}
              </p>

              <div className="mt-8 flex items-baseline gap-2">
                <span className="text-4xl font-bold font-heading">
                  ${Number(product.price).toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">per unit</span>
              </div>

              {/* Quantity selector */}
              <div className="mt-8">
                <label className="text-sm font-medium text-foreground mb-3 block">Quantity</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center glass-card rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-secondary/50 transition-colors"
                      disabled={!product.in_stock}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-16 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                      className="p-3 hover:bg-secondary/50 transition-colors"
                      disabled={!product.in_stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Total: ${(Number(product.price) * quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Add to cart + Inquire buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-start gap-4">
                <AnimatedButton
                  size="lg"
                  className="glow-hover"
                  onClick={() => {
                    if (product) {
                      addToCart(product, quantity);
                      toast.success(`Added ${quantity} × ${product.name} to cart`);
                    }
                  }}
                >
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </AnimatedButton>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <div>
                      <AnimatedButton size="lg" variant="outline" onClick={() => setDialogOpen(true)}>
                        <Mail className="w-4 h-4" /> Inquire
                      </AnimatedButton>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="glass border-[#1F1F2E] bg-[#12121A]">
                    <DialogHeader>
                      <DialogTitle className="font-heading">Inquire: {product.name}</DialogTitle>
                      <DialogDescription>
                        Send us an email and our team will get back to you within 24 hours with pricing and availability details.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 space-y-4">
                      <div className="glass-card rounded-xl p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Product</span>
                          <span className="font-medium">{product.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Quantity</span>
                          <span className="font-medium">{quantity} units</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Estimated Total</span>
                          <span className="font-medium">${(Number(product.price) * quantity).toFixed(2)}</span>
                        </div>
                      </div>
                      <a href={mailtoLink}>
                        <AnimatedButton size="lg" className="w-full">
                          <Mail className="w-4 h-4" /> Send Inquiry Email
                        </AnimatedButton>
                      </a>
                    </div>
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
