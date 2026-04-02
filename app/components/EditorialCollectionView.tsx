import {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Money} from '@shopify/hydrogen';

import {Link} from '~/components/Link';
import {useTranslation} from '~/hooks/useTranslation';

// ─── Types ───────────────────────────────────────────────────

interface ProductNode {
  id: string;
  handle: string;
  title: string;
  vendor?: string;
  availableForSale?: boolean;
  priceRange: {
    minVariantPrice: {amount: string; currencyCode: string};
  };
  compareAtPriceRange?: {
    minVariantPrice: {amount: string; currencyCode: string};
  };
  images: {
    nodes: Array<{
      id?: string;
      url: string;
      altText?: string | null;
      width?: number;
      height?: number;
    }>;
  };
  variants: {
    nodes: Array<{
      id: string;
      availableForSale: boolean;
    }>;
  };
}

interface EditorialSectionConfig {
  type:
    | 'hero'
    | 'asymmetric'
    | 'scattered'
    | 'row'
    | 'quote'
    | 'hero-side'
    | 'wide';
  productIndices?: number[];
  content?: {quote: string; author: string};
}

interface EditorialLayoutConfig {
  sections: EditorialSectionConfig[];
}

interface ProductDisplayConfig {
  size: 'hero' | 'large' | 'medium' | 'small' | 'wide';
  style: 'framed' | 'minimal' | 'elevated' | 'accent-border';
  badge?: string;
  numberBadge?: number;
}

// ─── Layout Defaults ─────────────────────────────────────────

const EDITORIAL_CONFIGS: Record<string, EditorialLayoutConfig> = {
  'modern-essentials': {
    sections: [
      {type: 'hero', productIndices: [0, 1]},
      {type: 'asymmetric', productIndices: [2, 3, 4]},
      {
        type: 'quote',
        content: {
          quote: 'The best fashion is the kind that lets you be yourself.',
          author: 'Our Design Philosophy',
        },
      },
      {type: 'row', productIndices: [5, 6, 7, 8]},
    ],
  },
  'carry-it-your-way': {
    sections: [
      {type: 'scattered', productIndices: [0, 1, 2, 3]},
      {type: 'row', productIndices: [4, 5, 6, 7]},
    ],
  },
  'sun-ready': {
    sections: [
      {type: 'hero-side', productIndices: [0, 1, 2]},
      {type: 'wide', productIndices: [3]},
      {type: 'row', productIndices: [4, 5, 6, 7]},
    ],
  },
  'new-arrivals': {
    sections: [
      {type: 'asymmetric', productIndices: [0, 1, 2]},
      {
        type: 'quote',
        content: {
          quote:
            "Sustainability isn't a trend — it's our responsibility to tomorrow.",
          author: 'Our Commitment',
        },
      },
      {type: 'row', productIndices: [3, 4, 5, 6]},
    ],
  },
};

export function getEditorialLayoutConfig(
  handle: string,
): EditorialLayoutConfig | null {
  return EDITORIAL_CONFIGS[handle] || null;
}

/** Handles that should render the editorial layout */
export const EDITORIAL_HANDLES = new Set(Object.keys(EDITORIAL_CONFIGS));

// ─── Main Component ──────────────────────────────────────────

export function EditorialCollectionView({
  collection,
  layoutConfig,
}: {
  collection: {
    id: string;
    handle: string;
    title: string;
    description?: string | null;
  };
  layoutConfig: EditorialLayoutConfig;
  products: ProductNode[];
}) {
  // We accept products separately so the parent can pass the nodes array
  // but we also read it from the collection prop for convenience
  return <EditorialContent collection={collection} layoutConfig={layoutConfig} />;
}

function EditorialContent({
  collection,
  layoutConfig,
}: {
  collection: {
    id: string;
    handle: string;
    title: string;
    description?: string | null;
    products?: {nodes: ProductNode[]};
  };
  layoutConfig: EditorialLayoutConfig;
}) {
  const products = collection.products?.nodes || [];
  const [quickViewProduct, setQuickViewProduct] = useState<ProductNode | null>(
    null,
  );
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  return (
    <>
      {/* Editorial Sub-Navigation */}
      <EditorialNav currentHandle={collection.handle} />

      {/* Hero Heading */}
      <CollectionHero
        title={collection.title}
        description={collection.description}
      />

      {/* Dynamic Content Sections */}
      <div className="max-w-[1440px] mx-auto" style={{padding: '0 var(--page-gutter)'}}>
        {layoutConfig.sections.map((section, sectionIndex) => (
          <ContentSection
            key={sectionIndex}
            section={section}
            products={products}
            sectionIndex={sectionIndex}
            onQuickView={setQuickViewProduct}
            hoveredProduct={hoveredProduct}
            onHover={setHoveredProduct}
          />
        ))}
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Editorial Navigation ────────────────────────────────────

const NAV_ITEMS = [
  {handle: 'modern-essentials', label: 'Modern Essentials'},
  {handle: 'carry-it-your-way', label: 'Carry Your Own Way'},
  {handle: 'sun-ready', label: 'Sun Ready'},
  {handle: 'new-arrivals', label: 'New Arrivals'},
];

function EditorialNav({currentHandle}: {currentHandle: string}) {
  return (
    <motion.nav
      initial={{y: -20, opacity: 0}}
      animate={{y: 0, opacity: 1}}
      transition={{duration: 0.6, ease: [0.16, 1, 0.3, 1]}}
      className="sticky top-0 z-40 bg-[#F9F5F0]/95 backdrop-blur-lg border-b border-[#E8E0D8]"
      style={{top: 'var(--navbar-height, 0px)'}}
    >
      <div
        className="max-w-[1440px] mx-auto flex items-center gap-8 py-4 overflow-x-auto"
        style={{padding: '1rem var(--page-gutter)'}}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = currentHandle === item.handle;
          return (
            <Link
              key={item.handle}
              to={`/collections/${item.handle}`}
              prefetch="intent"
              className={`relative py-2 text-[11px] tracking-[0.15em] uppercase transition-colors duration-300 whitespace-nowrap ${
                isActive
                  ? 'text-[#4A3C31]'
                  : 'text-[#8B8076] hover:text-[#4A3C31]'
              }`}
            >
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="editorialActiveNav"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#a87441]"
                  transition={{type: 'spring', stiffness: 380, damping: 30}}
                />
              )}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}

// ─── Collection Hero ─────────────────────────────────────────

function CollectionHero({
  title,
  description,
}: {
  title: string;
  description?: string | null;
}) {
  const words = title.split(' ');

  return (
    <motion.div
      initial={{opacity: 0, y: 40}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.8, ease: [0.16, 1, 0.3, 1]}}
      className="max-w-[1440px] mx-auto pt-10 pb-6 md:pt-14 md:pb-8"
      style={{padding: '2.5rem var(--page-gutter) 1.5rem'}}
    >
      <span className="block text-[10px] uppercase tracking-[0.35em] text-[#a87441] font-light mb-4">
        The Edit
      </span>
      <h1
        className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#4A3C31] leading-[0.95]"
        style={{letterSpacing: '-0.01em'}}
      >
        {words.map((word, i) =>
          i === words.length - 1 ? (
            <em key={i} className="font-serif italic">
              {word}
            </em>
          ) : (
            <span key={i}>{word} </span>
          ),
        )}
      </h1>
      {description && (
        <p className="mt-4 text-[#8B8076] text-sm font-light tracking-wide leading-relaxed max-w-md">
          {description}
        </p>
      )}
    </motion.div>
  );
}

// ─── Content Section Renderer ────────────────────────────────

function ContentSection({
  section,
  products,
  sectionIndex,
  onQuickView,
  hoveredProduct,
  onHover,
}: {
  section: EditorialSectionConfig;
  products: ProductNode[];
  sectionIndex: number;
  onQuickView: (product: ProductNode) => void;
  hoveredProduct: string | null;
  onHover: (id: string | null) => void;
}) {
  if (section.type === 'quote' && section.content) {
    return <EditorialQuote {...section.content} />;
  }

  const sectionProducts = (section.productIndices || [])
    .map((i) => products[i])
    .filter(Boolean);

  if (sectionProducts.length === 0) return null;

  const gridClass = getGridClass(section.type);

  return (
    <motion.div
      initial={{opacity: 0, y: 50}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-80px'}}
      transition={{
        duration: 0.8,
        delay: 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={gridClass}
    >
      {sectionProducts.map((product, index) => (
        <EditorialProductCard
          key={product.id}
          product={product}
          index={index}
          sectionType={section.type}
          onQuickView={onQuickView}
          isHovered={hoveredProduct === product.id}
          onHover={onHover}
        />
      ))}
    </motion.div>
  );
}

function getGridClass(type: string): string {
  switch (type) {
    case 'hero':
      return 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8';
    case 'asymmetric':
      return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8';
    case 'scattered':
      return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8';
    case 'row':
      return 'grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8';
    case 'hero-side':
      return 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8';
    case 'wide':
      return 'mb-6 md:mb-8';
    default:
      return '';
  }
}

// ─── Editorial Product Card ──────────────────────────────────

function EditorialProductCard({
  product,
  index,
  sectionType,
  onQuickView,
  isHovered,
  onHover,
}: {
  product: ProductNode;
  index: number;
  sectionType: string;
  onQuickView: (product: ProductNode) => void;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}) {
  const config = getDisplayConfig(sectionType, index);
  const image = product.images.nodes[0];
  const price = product.priceRange.minVariantPrice;

  return (
    <motion.article
      initial={{opacity: 0, y: 30}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={[
        'group relative rounded-lg overflow-hidden cursor-pointer transition-shadow duration-500',
        getSizeClass(config.size),
        getStyleClass(config.style),
      ]
        .filter(Boolean)
        .join(' ')}
      onMouseEnter={() => onHover(product.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Badges */}
      {config.badge && (
        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-[#4A3C31] text-[#F9F5F0] text-[9px] tracking-[0.1em] uppercase rounded">
          {config.badge}
        </span>
      )}
      {config.numberBadge != null && (
        <span className="absolute top-3 right-3 z-10 w-7 h-7 bg-[#a87441] text-white rounded-full flex items-center justify-center text-xs font-semibold">
          {String(config.numberBadge).padStart(2, '0')}
        </span>
      )}

      {/* Clickable wrapper — links to product page */}
      <Link
        to={`/products/${product.handle}`}
        prefetch="intent"
        className="block w-full h-full"
      >
        {/* Image */}
        <div className="relative w-full h-full overflow-hidden">
          {image ? (
            <motion.img
              src={image.url}
              alt={image.altText || product.title}
              width={image.width || undefined}
              height={image.height || undefined}
              className="w-full h-full object-cover"
              loading="lazy"
              animate={{scale: isHovered ? 1.05 : 1}}
              transition={{duration: 0.6, ease: [0.16, 1, 0.3, 1]}}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#EDE8E3] to-[#DDD5CC]" />
          )}

          {/* Hover Overlay */}
          <motion.div
            initial={false}
            animate={{opacity: isHovered ? 1 : 0}}
            transition={{duration: 0.3}}
            className="absolute inset-0 bg-gradient-to-t from-[#0f0d0a]/70 via-[#0f0d0a]/20 to-transparent pointer-events-none"
          >
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <motion.h3
                initial={false}
                animate={
                  isHovered ? {opacity: 1, y: 0} : {opacity: 0, y: 10}
                }
                transition={{duration: 0.3, delay: 0.1}}
                className="text-white text-base md:text-lg font-medium"
              >
                {product.title}
              </motion.h3>
              <motion.div
                initial={false}
                animate={
                  isHovered ? {opacity: 1, y: 0} : {opacity: 0, y: 10}
                }
                transition={{duration: 0.3, delay: 0.15}}
                className="text-white/80 text-sm mt-1"
              >
                <Money data={price} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Link>

      {/* Quick View Button — floats on hover */}
      <motion.button
        initial={false}
        animate={
          isHovered
            ? {opacity: 1, y: 0}
            : {opacity: 0, y: 8, pointerEvents: 'none' as const}
        }
        transition={{duration: 0.3, delay: 0.2}}
        className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-10 px-4 py-2.5 bg-[#a87441] text-white text-[10px] tracking-[0.05em] uppercase rounded hover:bg-[#8B5E34] transition-colors"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onQuickView(product);
        }}
      >
        Quick View
      </motion.button>
    </motion.article>
  );
}

// ─── Editorial Quote ─────────────────────────────────────────

function EditorialQuote({quote, author}: {quote: string; author: string}) {
  return (
    <motion.blockquote
      initial={{opacity: 0, y: 30}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true}}
      transition={{duration: 0.8, delay: 0.2}}
      className="my-8 md:my-12 p-6 md:p-10 bg-[#F0EAE6] rounded-lg"
    >
      <p className="font-serif text-xl md:text-2xl italic leading-relaxed text-[#4A3C31]">
        &ldquo;{quote}&rdquo;
      </p>
      <cite className="block mt-3 not-italic text-[10px] tracking-[0.15em] uppercase text-[#8B8076]">
        &mdash; {author}
      </cite>
    </motion.blockquote>
  );
}

// ─── Quick View Modal ────────────────────────────────────────

function QuickViewModal({
  product,
  onClose,
}: {
  product: ProductNode;
  onClose: () => void;
}) {
  const image = product.images.nodes[0];
  const price = product.priceRange.minVariantPrice;
  const comparePrice = product.compareAtPriceRange?.minVariantPrice;
  const isOnSale =
    comparePrice && parseFloat(comparePrice.amount) > parseFloat(price.amount);

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        className="absolute inset-0 bg-[#0f0d0a]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div
        initial={{opacity: 0, scale: 0.95, y: 20}}
        animate={{opacity: 1, scale: 1, y: 0}}
        exit={{opacity: 0, scale: 0.95, y: 20}}
        transition={{type: 'spring', stiffness: 300, damping: 30}}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden bg-white rounded-xl shadow-2xl flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 bg-[#4A3C31] text-white rounded-full flex items-center justify-center hover:bg-[#3a2c21] transition-colors"
          aria-label="Close quick view"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Image Side */}
        <div className="w-full md:w-1/2 aspect-[3/4] md:aspect-auto bg-[#F0EAE6] flex-shrink-0">
          {image && (
            <img
              src={image.url}
              alt={image.altText || product.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Details Side */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
          {product.vendor && (
            <span className="text-[10px] tracking-[0.15em] uppercase text-[#8B8076]">
              {product.vendor}
            </span>
          )}
          <h2 className="mt-2 font-serif text-xl md:text-2xl text-[#4A3C31]">
            {product.title}
          </h2>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-xl text-[#a87441]">
              <Money data={price} />
            </span>
            {isOnSale && comparePrice && (
              <span className="text-sm text-[#8B8076] line-through">
                <Money data={comparePrice} />
              </span>
            )}
          </div>

          <div className="flex-1" />

          {/* View Full Details */}
          <Link
            to={`/products/${product.handle}`}
            prefetch="intent"
            className="mt-6 w-full inline-flex items-center justify-center py-3.5 bg-[#a87441] text-white text-[11px] uppercase tracking-[0.15em] rounded hover:bg-[#8B5E34] transition-colors"
            onClick={onClose}
          >
            View Full Details
          </Link>

          {!product.availableForSale && (
            <p className="mt-3 text-center text-xs text-[#8B8076] italic">
              Currently unavailable
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Display Config Helpers ──────────────────────────────────

function getDisplayConfig(
  sectionType: string,
  index: number,
): ProductDisplayConfig {
  const configs: Record<string, ProductDisplayConfig[]> = {
    hero: [
      {size: 'hero', style: 'framed', badge: 'Signature'},
      {size: 'hero', style: 'elevated', numberBadge: 1},
    ],
    asymmetric: [
      {size: 'large', style: 'minimal'},
      {size: 'medium', style: 'framed'},
      {size: 'medium', style: 'elevated'},
    ],
    scattered: [
      {size: 'hero', style: 'accent-border', badge: 'Best Seller'},
      {size: 'medium', style: 'framed', numberBadge: 2},
      {size: 'small', style: 'elevated'},
      {size: 'medium', style: 'minimal'},
    ],
    row: [
      {size: 'small', style: 'framed'},
      {size: 'small', style: 'elevated'},
      {size: 'small', style: 'minimal'},
      {size: 'small', style: 'framed'},
    ],
    'hero-side': [
      {size: 'hero', style: 'elevated', badge: 'New'},
      {size: 'medium', style: 'framed'},
      {size: 'medium', style: 'framed'},
    ],
    wide: [{size: 'wide', style: 'elevated'}],
  };

  return (
    configs[sectionType]?.[index] || {size: 'medium', style: 'framed'}
  );
}

function getSizeClass(size: string): string {
  const sizes: Record<string, string> = {
    hero: 'aspect-[3/4]',
    large: 'aspect-[4/5]',
    medium: 'aspect-square',
    small: 'aspect-[3/4]',
    wide: 'aspect-[16/9]',
  };
  return sizes[size] || sizes.medium;
}

function getStyleClass(style: string): string {
  const styles: Record<string, string> = {
    framed: 'border border-[#E8E0D8]',
    minimal: '',
    elevated: 'shadow-md shadow-[#4A3C31]/5',
    'accent-border': 'border-2 border-[#a87441]',
  };
  return styles[style] || '';
}
