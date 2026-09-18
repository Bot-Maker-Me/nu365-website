import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { supabase, type Product } from '@/lib/supabaseClient';

export function Cart() {
  const { items, removeFromCart, updateQuantity, subtotal, addToCart } = useCart();
  const [recommended, setRecommended] = useState<Product[]>([]);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .limit(20)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const shuffled = [...data].sort(() => Math.random() - 0.5);
          setRecommended(shuffled.slice(0, 2));
        }
      });
  }, []);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0F]">
        <Navbar />
        <div className="pt-32 max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-3xl font-heading font-bold tracking-tight mb-8">Your Cart</h1>
          <div className="glass-card rounded-2xl p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-6">Your cart is empty.</p>
            <Button asChild className="gradient-bg text-white border-transparent">
              <Link to="/shop">Browse Products</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <div className="pt-32 max-w-7xl mx-auto px-6 lg:px-8 pb-12">
        <h1 className="text-3xl font-heading font-bold tracking-tight mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="glass-card rounded-2xl p-4 flex items-center gap-4"
              >
                <Link to={`/product/${item.slug}`} className="shrink-0">
                  <img
                    src={item.image_url ?? `https://picsum.photos/seed/${item.slug}/200/200`}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.slug}`}
                    className="font-medium hover:text-primary transition-colors truncate block"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>

                <div className="flex items-center gap-2 glass-card rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-secondary/50 transition-colors rounded-l-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-medium text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-secondary/50 transition-colors rounded-r-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right w-20">
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-muted-foreground hover:text-red-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            ))}

            <button
              onClick={() => items.forEach((item) => removeFromCart(item.id))}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-red-400 transition-colors mt-4"
            >
              <Trash2 className="w-4 h-4" /> Clear cart
            </button>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <h2 className="font-heading font-semibold text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-muted-foreground">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="border-t border-[#1F1F2E] pt-3 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-heading font-bold text-lg">${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <Button asChild className="w-full mt-6 h-12 gradient-bg text-white border-transparent">
                <Link to="/checkout">
                  Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* You might also need */}
        {recommended.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-heading font-semibold mb-6">You might also need</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
              {recommended.map((product) => (
                <div key={product.id} className="glass-card rounded-2xl p-4 flex items-center gap-4">
                  <img
                    src={product.image_url ?? `https://picsum.photos/seed/${product.slug}/200/200`}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                  </div>
                  <Button
                    onClick={() => {
                      addToCart(product, 1);
                      toast.success(`Added ${product.name} to cart`);
                    }}
                    size="sm"
                    className="gradient-bg text-white border-transparent shrink-0"
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
