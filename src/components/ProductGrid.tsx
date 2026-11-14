import type { Product } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { BlurFade } from '@/components/ui/blur-fade';

type Props = {
  products: Product[] | null;
  loading: boolean;
  error: boolean;
  emptyText: string;
  /** Tailwind grid-column classes for large screens. */
  columns?: string;
};

/** Product cards with loading, error and empty states. Shared by the home and shop pages. */
export function ProductGrid({ products, loading, error, emptyText, columns = 'lg:grid-cols-3' }: Props) {
  if (error) {
    return <p className="py-20 text-center text-red-400">Failed to load products. Please refresh the page.</p>;
  }

  if (!loading && !products?.length) {
    return <p className="py-20 text-center text-muted-foreground">{emptyText}</p>;
  }

  return (
    <div className={`grid grid-cols-1 gap-8 sm:grid-cols-2 ${columns}`}>
      {loading
        ? Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-secondary/20" />
          ))
        : products!.map((product, i) => (
            <BlurFade key={product.id} inView delay={(i % 4) * 0.08}>
              <ProductCard product={product} />
            </BlurFade>
          ))}
    </div>
  );
}
