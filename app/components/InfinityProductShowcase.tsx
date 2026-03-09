import {useRef, useEffect, useState, useMemo} from 'react';
import {motion, useScroll, useTransform, useSpring} from 'framer-motion';
import {Link} from '@remix-run/react';
import {useTranslation} from '~/hooks/useTranslation';

interface Product {
  id: string;
  handle: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  image: string;
}

// All products from the LUV collection
const ALL_PRODUCTS: Product[] = [
  // LUV2431792 - THE ROCKY
  {id: '1', handle: 'the-rocky', title: 'The Rocky', price: {amount: '599.00', currencyCode: 'SAR'}, image: '/products/LUV2431792_1.webp'},
  {id: '2', handle: 'the-rocky-gold', title: 'The Rocky - Gold', price: {amount: '649.00', currencyCode: 'SAR'}, image: '/products/LUV2431792_2.webp'},
  // LUV2531822 - THE PALOMA
  {id: '3', handle: 'the-paloma', title: 'The Paloma', price: {amount: '549.00', currencyCode: 'SAR'}, image: '/products/LUV2531822_1.webp'},
  {id: '4', handle: 'the-paloma-tortoise', title: 'The Paloma - Tortoise', price: {amount: '599.00', currencyCode: 'SAR'}, image: '/products/LUV2531822_2.webp'},
  // LUV2531823 - THE PALOMA (variant)
  {id: '5', handle: 'the-paloma-black', title: 'The Paloma - Black', price: {amount: '549.00', currencyCode: 'SAR'}, image: '/products/LUV2531823_1.webp'},
  // LUV2531826 - THE BOSTON
  {id: '6', handle: 'the-boston', title: 'The Boston', price: {amount: '579.00', currencyCode: 'SAR'}, image: '/products/LUV2531826_1.webp'},
  // LUV2531827 - THE BLAIR
  {id: '7', handle: 'the-blair', title: 'The Blair', price: {amount: '529.00', currencyCode: 'SAR'}, image: '/products/LUV2531827_1.webp'},
  // LUV2531828 - THE BLAIR (variant)
  {id: '8', handle: 'the-blair-cream', title: 'The Blair - Cream', price: {amount: '529.00', currencyCode: 'SAR'}, image: '/products/LUV2531828_1.webp'},
  // LUV2531830 - THE BLAIR (variant)
  {id: '9', handle: 'the-blair-white', title: 'The Blair - White', price: {amount: '529.00', currencyCode: 'SAR'}, image: '/products/LUV2531830_1.webp'},
  // LUV2543900 - THE OLIVE
  {id: '10', handle: 'the-olive', title: 'The Olive', price: {amount: '499.00', currencyCode: 'SAR'}, image: '/products/LUV2543900_1.webp'},
  // LUV2543901 - THE OLIVE (variant)
  {id: '11', handle: 'the-olive-mocha', title: 'The Olive - Mocha', price: {amount: '499.00', currencyCode: 'SAR'}, image: '/products/LUV2543901_1.webp'},
  // LUV2643911 - THE BELLA
  {id: '12', handle: 'the-bella', title: 'The Bella', price: {amount: '579.00', currencyCode: 'SAR'}, image: '/products/LUV2643911_1.webp'},
  // LUV2643912 - THE BELLA (variant)
  {id: '13', handle: 'the-bella-black', title: 'The Bella - Black', price: {amount: '579.00', currencyCode: 'SAR'}, image: '/products/LUV2643912_1.webp'},
  // LUV2643914 - THE BROOKLYN
  {id: '14', handle: 'the-brooklyn', title: 'The Brooklyn', price: {amount: '549.00', currencyCode: 'SAR'}, image: '/products/LUV2643914_1.webp'},
  // LUV2643915 - THE BROOKLYN (variant)
  {id: '15', handle: 'the-brooklyn-gold', title: 'The Brooklyn - Gold', price: {amount: '599.00', currencyCode: 'SAR'}, image: '/products/LUV2643915_1.webp'},
  // LUV2643919 - THE BANKS
  {id: '16', handle: 'the-banks', title: 'The Banks', price: {amount: '629.00', currencyCode: 'SAR'}, image: '/products/LUV2643919_1.webp'},
  // LUV2643945 - THE BANKS (variant)
  {id: '17', handle: 'the-banks-silver', title: 'The Banks - Silver', price: {amount: '629.00', currencyCode: 'SAR'}, image: '/products/LUV2643945_1.webp'},
];

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface ProductCardProps {
  product: Product;
  index: number;
}

function ProductCard({product, index}: ProductCardProps) {
  return (
    <motion.div
      className="flex-shrink-0 w-[200px] md:w-[240px] lg:w-[280px] px-2"
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true}}
      transition={{delay: index * 0.03, duration: 0.5}}
    >
      <Link to={`/products/${product.handle}`} className="group block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-[#F5F2ED] mb-3">
          <motion.div
            className="absolute inset-0"
            whileHover={{scale: 1.05}}
            transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
          >
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#E8E4E0] to-[#D4CFC8] flex items-center justify-center">
                <span className="font-serif text-2xl text-[#8B8076]">
                  {product.title.charAt(0)}
                </span>
              </div>
            )}
          </motion.div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Price Tag - Bottom */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-[#4A3C31] text-xs font-medium rounded-full">
              {new Intl.NumberFormat('en-SA', {
                style: 'currency',
                currency: product.price.currencyCode,
              }).format(parseFloat(product.price.amount))}
            </span>
          </div>

          {/* Border on hover */}
          <div className="absolute inset-0 rounded-xl border-2 border-[#a87441]/0 group-hover:border-[#a87441]/30 transition-colors duration-500" />
        </div>

        {/* Product Info */}
        <div className="space-y-1 text-center">
          <h3 className="font-serif text-sm md:text-base text-[#4A3C31] group-hover:text-[#a87441] transition-colors duration-300 line-clamp-1">
            {product.title}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}

export function InfinityProductShowcase() {
  const {isRTL, t} = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Shuffle products randomly
  const shuffledProducts = useMemo(() => shuffleArray(ALL_PRODUCTS), []);
  
  // Create infinite loop by duplicating products multiple times
  const infiniteProducts = useMemo(() => {
    // Duplicate enough times for seamless infinite scroll
    const duplicates = 6;
    let result: Product[] = [];
    for (let i = 0; i < duplicates; i++) {
      result = [...result, ...shuffledProducts];
    }
    return result;
  }, [shuffledProducts]);

  // Auto-scroll animation
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;
    let scrollPos = container.scrollLeft;
    const speed = isRTL ? -0.8 : 0.8;
    const singleSetWidth = (container.scrollWidth / 6);

    const animate = () => {
      if (!isDragging) {
        scrollPos += speed;
        
        // Reset position for infinite loop effect
        if (isRTL) {
          if (scrollPos <= 0) {
            scrollPos = singleSetWidth * 4;
          }
        } else {
          if (scrollPos >= singleSetWidth * 4) {
            scrollPos = singleSetWidth;
          }
        }
        
        container.scrollLeft = scrollPos;
      }
      animationId = requestAnimationFrame(animate);
    };

    // Set initial position
    if (!isRTL) {
      container.scrollLeft = singleSetWidth;
      scrollPos = singleSetWidth;
    } else {
      container.scrollLeft = singleSetWidth * 4;
      scrollPos = singleSetWidth * 4;
    }

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isDragging, isRTL]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-[#F9F5F0] via-[#F5F2ED] to-[#F9F5F0]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Section Header */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 mb-8 md:mb-10">
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6}}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#4A3C31] mb-2">
              {isRTL ? 'المجموعة' : 'The Collection'}
            </h2>
            <p className="text-[#8B8076] text-sm md:text-base max-w-md">
              {isRTL
                ? 'اكتشفي كل منتجاتنا الفريدة'
                : 'Explore our complete collection of curated pieces'}
            </p>
          </div>

          <span className="text-[11px] uppercase tracking-[0.2em] text-[#a87441]">
            {isRTL ? `${ALL_PRODUCTS.length}+ منتج` : `${ALL_PRODUCTS.length}+ Products`}
          </span>
        </motion.div>
      </div>

      {/* Infinity Scroll Container */}
      <div className="relative">
        {/* Gradient Masks - Left & Right */}
        <div
          className="absolute left-0 top-0 bottom-0 w-16 md:w-32 z-10 pointer-events-none"
          style={{background: 'linear-gradient(to right, #F9F5F0 0%, transparent 100%)'}}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-16 md:w-32 z-10 pointer-events-none"
          style={{background: 'linear-gradient(to left, #F9F5F0 0%, transparent 100%)'}}
        />

        {/* Scrolling Track */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing py-4"
          style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {infiniteProducts.map((product, index) => (
            <ProductCard
              key={`${product.id}-${index}`}
              product={product}
              index={index % ALL_PRODUCTS.length}
            />
          ))}
        </div>

        {/* Drag Hint */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#AA9B8F]"
          initial={{opacity: 0}}
          animate={{opacity: isDragging ? 0 : 1}}
          transition={{duration: 0.3}}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{isRTL ? 'اسحب للتصفح' : 'Drag to browse'}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 mt-8 md:mt-10">
        <div className="flex items-center justify-center gap-4">
          <div className="h-px flex-1 max-w-[150px] bg-gradient-to-r from-transparent to-[#a87441]/20" />
          <span className="font-serif text-xs text-[#AA9B8F] italic">
            {isRTL ? 'تمرير لا نهائي' : 'Infinite Scroll'}
          </span>
          <div className="h-px flex-1 max-w-[150px] bg-gradient-to-l from-transparent to-[#a87441]/20" />
        </div>
      </div>
    </section>
  );
}

export default InfinityProductShowcase;
