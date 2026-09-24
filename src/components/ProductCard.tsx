import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Product } from '@/lib/supabaseClient';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

type Props = {
  product: Product;
  index?: number;
};

export function ProductCard({ product, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: 'transform' }}
    >
      <CardContainer className="w-full" containerClassName="py-0">
        <CardBody className="w-full h-auto [&>*]:[transform-style:preserve-3d]">
          <Link to={`/product/${product.slug}`} className="group block">
            <div className="glass-card rounded-2xl overflow-hidden h-full">
              <CardItem translateZ="20" className="w-full">
                <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
                  <img
                    src={product.image_url ?? `https://picsum.photos/seed/${product.slug}/600/600`}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    style={{ willChange: 'transform' }}
                  />
                  {product.category && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider glass text-muted-foreground">
                        {product.category}
                      </span>
                    </div>
                  )}
                </div>
              </CardItem>

              <div className="p-5">
                <CardItem translateZ="10" className="w-full">
                  <h3 className="font-heading font-semibold text-base mb-1 group-hover:gradient-text transition-all">
                    {product.name}
                  </h3>
                </CardItem>
                <CardItem translateZ="5" className="w-full">
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </CardItem>
              </div>
            </div>
          </Link>
        </CardBody>
      </CardContainer>
    </motion.div>
  );
}
