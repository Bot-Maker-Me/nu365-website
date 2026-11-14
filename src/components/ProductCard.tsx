import { Link } from 'react-router-dom';
import type { Product } from '@/lib/products';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';

/** Product tile for the grids. Tilts in 3D on hover; image, title and text lift off by different amounts. */
export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="mx-auto w-[60%] md:w-[65%]">
      <CardContainer className="w-full" containerClassName="py-0">
        <CardBody className="h-auto w-full">
          <Link to={`/product/${product.slug}`} className="group block">
            <div className="glass-card h-full overflow-hidden rounded-2xl">
              <CardItem translateZ={20} className="w-full">
                <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      width={720}
                      height={900}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  {product.category && (
                    <span className="glass absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {product.category}
                    </span>
                  )}
                </div>
              </CardItem>

              <div className="p-5">
                <CardItem translateZ={10} className="w-full">
                  <h3 className="mb-1 font-heading text-base font-semibold transition-all group-hover:gradient-text">
                    {product.name}
                  </h3>
                </CardItem>
                <CardItem translateZ={5} className="w-full">
                  <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
                </CardItem>
              </div>
            </div>
          </Link>
        </CardBody>
      </CardContainer>
    </div>
  );
}
