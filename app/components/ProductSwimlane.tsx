import type {ProductCardFragment} from 'storefrontapi.generated';
import {Section} from '~/components/Text';
import {ProductCard} from '~/components/ProductCard';

type ProductSwimlaneProps = {
  title?: string;
  products?: { nodes: ProductCardFragment[] };
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
    <Section heading={title} padding="y" {...props}>
      <div className="swimlane hiddenScroll md:pb-8 md:scroll-px-8 lg:scroll-px-12 md:px-8 lg:px-12 flex gap-4">
        {products.nodes.slice(0, count).map((product) => (
          <div key={product.id} className="snap-start w-80 flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </Section>
  );
}
