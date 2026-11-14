import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ProductGrid } from '@/components/ProductGrid';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProducts } from '@/lib/products';

type Sort = 'asc' | 'desc';

export default function ShopPage() {
  const { products, loading, error } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<Sort>('asc');

  const categories = useMemo(
    () => [...new Set((products ?? []).map((p) => p.category).filter(Boolean))] as string[],
    [products]
  );

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (products ?? [])
      .filter((p) => category === 'all' || p.category === category)
      .filter((p) => !query || `${p.name} ${p.description ?? ''}`.toLowerCase().includes(query))
      .sort((a, b) => a.name.localeCompare(b.name) * (sort === 'asc' ? 1 : -1));
  }, [products, search, category, sort]);

  return (
    <>
      <section className="relative pb-12 pt-32">
        <div className="grid-pattern absolute inset-0 opacity-20" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <span className="gradient-text text-xs font-semibold uppercase tracking-[0.2em]">Catalog</span>
          <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight md:text-5xl">Research Compounds</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Browse our full catalog of premium-grade research chemicals, peptides, and reagents.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 z-10 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search compounds..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="glass-card h-11 border-[#1F1F2E] bg-secondary/20 pl-10"
              />
            </div>
            <Select value={sort} onValueChange={(value) => setSort(value as Sort)}>
              <SelectTrigger className="glass-card h-11 w-full border-[#1F1F2E] bg-secondary/20 md:w-[170px]">
                <SlidersHorizontal className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass border-[#1F1F2E] bg-[#12121A]">
                <SelectItem value="asc">Name: A to Z</SelectItem>
                <SelectItem value="desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category filter only appears once there is more than one category */}
          {categories.length > 1 && (
            <div className="mb-8 flex flex-wrap gap-2">
              {['all', ...categories].map((name) => (
                <button
                  key={name}
                  onClick={() => setCategory(name)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    category === name ? 'gradient-bg text-white' : 'glass-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {name === 'all' ? 'All' : name}
                </button>
              ))}
            </div>
          )}

          <ProductGrid
            products={visible}
            loading={loading}
            error={error}
            emptyText="No compounds found matching your criteria."
            columns="lg:grid-cols-3 xl:grid-cols-4"
          />
        </div>
      </section>
    </>
  );
}
