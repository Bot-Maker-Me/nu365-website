import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import { FormField, Honeypot } from '@/components/FormField';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { sendEnquiry } from '@/lib/enquiry';
import { useProducts, type Product } from '@/lib/products';

const gradientButton = 'gradient-bg border-transparent text-white';

/** "Inquire" button + dialog that emails the team about one product. */
function InquiryDialog({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const { email, message, website } = Object.fromEntries(new FormData(form)) as Record<string, string>;

    setSending(true);
    try {
      await sendEnquiry({ email, message, website, product: product.name });
      toast.success("Inquiry sent! We'll get back to you soon.");
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className={`${gradientButton} glow-hover`}>
          <Mail className="mr-2 h-4 w-4" /> Inquire
        </Button>
      </DialogTrigger>
      <DialogContent className="glass border-[#1F1F2E] bg-[#12121A]">
        <DialogHeader>
          <DialogTitle className="font-heading">Inquire: {product.name}</DialogTitle>
          <DialogDescription>
            Send us an inquiry and our team will get back to you within 24 hours with pricing and availability.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="mt-4 space-y-4">
          <FormField label="Your Email" name="email" type="email" required placeholder="your.email@example.com" />
          <FormField label="Message (optional)" name="message" rows={3} placeholder="Any questions about this product?" />
          <Honeypot />
          <Button type="submit" size="lg" disabled={sending} className={`${gradientButton} w-full`}>
            <Send className="mr-2 h-4 w-4" /> {sending ? 'Sending...' : 'Send Inquiry'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { products, loading } = useProducts();
  const product = products?.find((p) => p.slug === slug);

  if (loading) {
    return (
      <div className="mx-auto grid max-w-7xl gap-12 px-6 pt-32 lg:grid-cols-2 lg:px-8">
        <div className="aspect-square animate-pulse rounded-2xl bg-secondary/20" />
        <div className="space-y-6">
          <div className="h-8 w-3/4 animate-pulse rounded bg-secondary/20" />
          <div className="h-24 animate-pulse rounded bg-secondary/20" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 pt-32 text-center lg:px-8">
        <h1 className="mb-6 font-heading text-2xl font-bold">Product not found</h1>
        <Button asChild variant="outline">
          <Link to="/shop">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <section className="relative pb-12 pt-28">
      <div className="grid-pattern absolute inset-0 opacity-20" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <Link
          to="/shop"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <div className="glass-card group relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/5">
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                width={720}
                height={900}
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
              />
            )}
          </div>

          <div>
            {product.category && (
              <span className="gradient-text text-xs font-semibold uppercase tracking-[0.2em]">
                {product.category}
              </span>
            )}
            <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight md:text-4xl">{product.name}</h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">{product.description}</p>
            <div className="mt-8">
              <InquiryDialog product={product} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
