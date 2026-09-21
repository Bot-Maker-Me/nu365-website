import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, Check } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabaseClient';

const countries = [
  { value: 'ca', label: 'Canada' },
  { value: 'us', label: 'United States' },
];

const provinces = [
  { value: 'AB', label: 'Alberta' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NL', label: 'Newfoundland and Labrador' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'NT', label: 'Northwest Territories' },
  { value: 'NU', label: 'Nunavut' },
  { value: 'ON', label: 'Ontario' },
  { value: 'PE', label: 'Prince Edward Island' },
  { value: 'QC', label: 'Quebec' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'YT', label: 'Yukon' },
];

const shippingOptions = [
  { value: 'flat-canadapost', label: 'Flat rate CanadaPost', price: 20 },
  { value: 'express', label: 'Express Shipping', price: 35 },
  { value: 'pickup', label: 'Local Pickup', price: 0 },
];

export function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);
  const [shippingKey, setShippingKey] = useState(shippingOptions[0].value);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    country: '',
    street: '',
    apartment: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
    email: '',
  });

  const shippingCost = shippingOptions.find((s) => s.value === shippingKey)?.price ?? 0;
  const tax = 0;
  const total = subtotal + shippingCost + tax;

  if (items.length === 0 && !placing) {
    return (
      <div className="min-h-screen bg-[#0A0A0F]">
        <Navbar />
        <div className="pt-32 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="glass-card rounded-2xl p-12 text-center">
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

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlacing(true);

    const customerName = `${form.firstName} ${form.lastName}`.trim();
    const shippingAddress = [
      form.street,
      form.apartment,
      form.city,
      form.province,
      form.postalCode,
      form.country,
    ].filter(Boolean).join(', ');

    try {
      const { error } = await supabase.from('orders').insert({
        customer_name: customerName,
        customer_email: form.email,
        shipping_address: shippingAddress,
        total,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image_url: item.image_url,
        })),
      });

      if (error) throw error;

      clearCart();
      toast.success('Order placed successfully!');
      navigate('/');
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <div className="pt-32 max-w-7xl mx-auto px-6 lg:px-8 pb-12">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="text-3xl font-heading font-bold tracking-tight mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Billing form */}
            <div className="lg:col-span-2 space-y-8">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-heading font-semibold text-lg mb-4">Billing Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      required
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className="bg-secondary/20 border-[#1F1F2E]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      required
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className="bg-secondary/20 border-[#1F1F2E]"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={form.country} onValueChange={(v) => setForm({ ...form, country: v })}>
                    <SelectTrigger id="country" className="bg-secondary/20 border-[#1F1F2E]">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    required
                    value={form.street}
                    onChange={(e) => setForm({ ...form, street: e.target.value })}
                    className="bg-secondary/20 border-[#1F1F2E]"
                  />
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                  <Input
                    id="apartment"
                    value={form.apartment}
                    onChange={(e) => setForm({ ...form, apartment: e.target.value })}
                    className="bg-secondary/20 border-[#1F1F2E]"
                  />
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="bg-secondary/20 border-[#1F1F2E]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Province</Label>
                    <Select value={form.province} onValueChange={(v) => setForm({ ...form, province: v })}>
                      <SelectTrigger id="province" className="bg-secondary/20 border-[#1F1F2E]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((p) => (
                          <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      required
                      value={form.postalCode}
                      onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                      className="bg-secondary/20 border-[#1F1F2E]"
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="bg-secondary/20 border-[#1F1F2E]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="bg-secondary/20 border-[#1F1F2E]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-2xl p-6 sticky top-24">
                <h2 className="font-heading font-semibold text-lg mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.image_url ?? `https://picsum.photos/seed/${item.slug}/100/100`}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#1F1F2E] pt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Shipping</Label>
                    <Select value={shippingKey} onValueChange={setShippingKey}>
                      <SelectTrigger className="bg-secondary/20 border-[#1F1F2E] h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {shippingOptions.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}: ${s.price.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping cost</span>
                      <span className="font-medium">${shippingCost.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-[#1F1F2E] pt-3 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-heading font-bold text-lg">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={placing}
                  className="w-full mt-6 h-12 gradient-bg text-white border-transparent"
                >
                  {placing ? (
                    'Placing Order...'
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" /> Place Order
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
