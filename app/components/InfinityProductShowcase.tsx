import {useRef, useEffect, useState} from 'react';
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

// Sample products - in production, these would come from Shopify API
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    handle: 'the-olive-mocha-tort',
    title: 'The Olive - Mocha Tort',
    price: {amount: '299.00', currencyCode: 'SAR'},
    image: '/products/case-olive.webp',
  },
  {
    id: '2',
    handle: 'louve-classic-black',
    title: 'Louve Classic - Black',
    price: {amount: '349.00', currencyCode: 'SAR'},
    image: '/products/case-black.webp',
  },
  {
    id: '3',
    handle: 'sunset-gradient-case',
    title: 'Sunset Gradient',
    price: {amount: '279.00', currencyCode: 'SAR'},
    image: '/products/case-sunset.webp',
  },
  {
    id: '4',
    handle: 'phone-strap-gold',
    title: 'Phone Strap - Gold Chain',
    price: {amount: '199.00', currencyCode: 'SAR'},
    image: '/products/strap-gold.webp',
  },
  {
    id: '5',
    handle: 'sunglasses-avana',
    title: 'Sunglasses - Avana',
    price: {amount: '599.00', currencyCode: 'SAR'},
    image: '/products/sunglasses-avana.webp',
  },
  {
    id: '6',
    handle: 'phone-strap-pearl',
    title: 'Phone Strap - Pearl',
    price: {amount: '249.00', currencyCode: 'SAR'},
    image: '/products/strap-pearl.webp',
  },
  {
    id: '7',
    handle: 'the-camel-classic',
    title: 'The Camel - Classic',
    price: {amount: '329.00', currencyCode: 'SAR'},
    image: '/products/case-camel.webp',
  },
  {
    id: '8',
    handle: 'sunglasses-noir',
    title: 'Sunglasses - Noir',
    price: {amount: '649.00', currencyCode: 'SAR'},
    image: '/products/sunglasses-noir.webp',
  },
];

// Double the products for seamless loop
const LOOP_PRODUCTS = [...SAMPLE_PRODUCTS, ...SAMPLE_PRODUCTS];

interface ProductCardProps {
  product: Product;
  index: number;
}

function ProductCard({product, index}: ProductCardProps) {
  return (
    <motion.div
      className="flex-shrink-0 w-[280px] md:w-[320px] lg:w-[380px] px-3"
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true}}
      transition={{delay: index * 0.05, duration: 0.5}}
    >
      <Link to={`/products/${product.handle}`} className="group block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#F5F2ED] mb-4">
          {/* Product Image */}
          <motion.div
            className="absolute inset-0"
            whileHover={{scale: 1.08}}
            transition={{duration: 0.7, ease: [0.16, 1, 0.3, 1]}}
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

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Hover Badge */}
          <motion.div
            className="absolute top-4 left-4"
            initial={{opacity: 0, y: -10}}
            whileHover={{opacity: 1, y: 0}}
          >
            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-[10px] uppercase tracking-widest text-[#4A3C31] rounded-full">
              View
            </span>
          </motion.div>

          {/* Price Tag - Bottom Right */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
            <span className="px-4 py-2 bg-[#a87441] text-white text-sm font-medium rounded-full">
              {new Intl.NumberFormat('en-SA', {
                style: 'currency',
                currency: product.price.currencyCode,
              }).format(parseFloat(product.price.amount))}
            </span>
          </div>

          {/* Border on hover */}
          <div className="absolute inset-0 rounded-2xl border-2 border-[#a87441]/0 group-hover:border-[#a87441]/30 transition-colors duration-500" />
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <h3 className="font-serif text-lg text-[#4A3C31] group-hover:text-[#a87441] transition-colors duration-300 line-clamp-1">
            {product.title}
          </h3>
          <p className="text-sm text-[#8B8076]">
            {new Intl.NumberFormat('en-SA', {
              style: 'currency',
              currency: product.price.currencyCode,
            }).format(parseFloat(product.price.amount))}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export function InfinityProductShowcase() {
  const {isRTL, t} = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Scroll velocity for parallax effect
  const {scrollYProgress} = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const smoothX = useSpring(x, {damping: 50, stiffness: 100});

  // Auto-scroll animation
  useEffect(() => {
    if (!containerRef.current || isHovered) return;

    const container = containerRef.current;
    let animationId: number;
    let scrollPos = 0;
    const speed = isRTL ? -0.5 : 0.5; // pixels per frame

    const animate = () => {
      if (!isHovered && isInView) {
        scrollPos += speed;
        const maxScroll = container.scrollWidth / 2;

        if (Math.abs(scrollPos) >= maxScroll) {
          scrollPos = 0;
        }

        container.scrollLeft = isRTL ? maxScroll - scrollPos : scrollPos;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isHovered, isRTL, isInView]);

  return (
    <motion.section
      ref={containerRef}
      className="py-16 md:py-24 overflow-hidden bg-gradient-to-b from-[#F9F5F0] via-[#F5F2ED] to-[#F9F5F0]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onViewportEnter={() => setIsInView(true)}
      onViewportLeave={() => setIsInView(false)}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Section Header */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 mb-10 md:mb-14">
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6}}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#4A3C31] mb-3">
              {isRTL ? 'المجموعة المختارة' : 'The Collection'}
            </h2>
            <p className="text-[#8B8076] text-sm md:text-base max-w-md">
              {isRTL
                ? 'اكتشفي قطعنا المميزة المصممة بعناية'
                : 'Discover our carefully curated selection of luxury accessories'}
            </p>
          </div>

          <Link
            to="/collections/all"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#a87441] hover:text-[#8B5E3C] transition-colors group"
          >
            <span>{isRTL ? 'عرض الكل' : 'View All'}</span>
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className={isRTL ? 'rotate-180' : ''}
              whileHover={{x: isRTL ? -4 : 4}}
            >
              <path
                d="M5 12h14M12 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </Link>
        </motion.div>
      </div>

      {/* Infinity Scroll Container */}
      <div className="relative">
        {/* Gradient Masks - Left & Right */}
        <div
          className="absolute left-0 top-0 bottom-0 w-20 md:w-40 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, #F9F5F0 0%, transparent 100%)',
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-20 md:w-40 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(to left, #F9F5F0 0%, transparent 100%)',
          }}
        />

        {/* Scrolling Track */}
        <motion.div className="flex py-4" style={{x: smoothX}}>
          {LOOP_PRODUCTS.map((product, index) => (
            <ProductCard
              key={`${product.id}-${index}`}
              product={product}
              index={index}
            />
          ))}
        </motion.div>

        {/* Pause Indicator */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#AA9B8F]"
          initial={{opacity: 0}}
          animate={{opacity: isHovered ? 1 : 0}}
          transition={{duration: 0.3}}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#a87441] animate-pulse" />
          {isRTL ? 'متوقف' : 'Paused'}
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 mt-10 md:mt-14">
        <div className="flex items-center justify-center gap-4">
          <div className="h-px flex-1 max-w-[200px] bg-gradient-to-r from-transparent to-[#a87441]/20" />
          <span className="font-serif text-sm text-[#AA9B8F] italic">
            {isRTL ? 'اسحب للاستكشاف' : 'Drag to explore'}
          </span>
          <div className="h-px flex-1 max-w-[200px] bg-gradient-to-l from-transparent to-[#a87441]/20" />
        </div>
      </div>
    </motion.section>
  );
}

export default InfinityProductShowcase;
