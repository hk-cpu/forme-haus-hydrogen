import type {ProductCardFragment} from 'storefrontapi.generated';
import {ProductCard} from '~/components/ProductCard';

type ProductSwimlaneProps = {
  title?: string;
  products?: {nodes: ProductCardFragment[]};
  count?: number;
};

export function ProductSwimlane({
  title = 'Featured Products',
  products,
  count = 12,
  ...props
}: ProductSwimlaneProps) {
  if (!products?.nodes?.length) return null;

  return (
    <section className="py-12 md:py-16" {...props}>
      <div className="text-center mb-8 md:mb-10">
        <h2 className="font-serif italic text-2xl md:text-3xl text-current tracking-wide">
          {title}
        </h2>
        <div className="w-16 h-px bg-[#a87441]/50 mx-auto mt-4" />
      </div>
      <div className="swimlane hiddenScroll md:pb-8 md:scroll-px-8 lg:scroll-px-12 md:px-8 lg:px-12 flex gap-4 px-4">
        {products.nodes.slice(0, count).map((product) => (
          <div key={product.id} className="snap-start w-72 md:w-80 flex-shrink-0">
            <ProductCard product={product as any} />
          </div>
        ))}
      </div>
    </section>
  );
}
