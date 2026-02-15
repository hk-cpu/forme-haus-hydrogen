import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@remix-run/react';
import { useUI } from '~/context/UIContext';
import { useTranslation } from '~/hooks/useTranslation';

// ============================================================================
// LUXURY MENU DATA – Gucci / LV Inspired
// ============================================================================

interface CategoryItem {
  label: string;
  href: string;
  featured?: boolean;
}

interface CategoryData {
  editorial: string;   // editorial image URL
  tagline: string;     // e.g. "Spring/Summer 2026"
  categories: CategoryItem[];
}

const menuCategories: Record<string, CategoryData> = {
  Women: {
    editorial: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85&auto=format',
    tagline: 'Spring/Summer 2026',
    categories: [
      { label: 'New Arrivals', href: '/collections/women-new', featured: true },
      { label: 'Ready-to-Wear', href: '/collections/women' },
      { label: 'Dresses', href: '/collections/women-dresses' },
      { label: 'Tops & Blouses', href: '/collections/women-tops' },
      { label: 'Pants & Skirts', href: '/collections/women-bottoms' },
      { label: 'Outerwear', href: '/collections/women-outerwear' },
      { label: 'Knitwear', href: '/collections/women-knitwear' },
      { label: 'Accessories', href: '/collections/women-accessories' },
    ],
  },
  Men: {
    editorial: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=85&auto=format',
    tagline: 'Spring/Summer 2026',
    categories: [
      { label: 'New Arrivals', href: '/collections/men-new', featured: true },
      { label: 'Ready-to-Wear', href: '/collections/men' },
      { label: 'Shirts', href: '/collections/men-shirts' },
      { label: 'Pants', href: '/collections/men-pants' },
      { label: 'Outerwear', href: '/collections/men-outerwear' },
      { label: 'Knitwear', href: '/collections/men-knitwear' },
      { label: 'Accessories', href: '/collections/men-accessories' },
    ],
  },
  Clothing: {
    editorial: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=900&q=85&auto=format',
    tagline: 'The Collection',
    categories: [
      { label: 'Dresses', href: '/collections/dresses' },
      { label: 'Tops', href: '/collections/tops' },
      { label: 'Blazers', href: '/collections/blazers' },
      { label: 'Pants', href: '/collections/pants' },
      { label: 'Skirts', href: '/collections/skirts' },
      { label: 'Knitwear', href: '/collections/knitwear' },
      { label: 'Outerwear', href: '/collections/outerwear' },
    ],
  },
  Accessories: {
    editorial: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&q=85&auto=format',
    tagline: 'Maison Accessories',
    categories: [
      { label: 'Bags', href: '/collections/bags', featured: true },
      { label: 'Jewelry', href: '/collections/jewelry' },
      { label: 'Scarves', href: '/collections/scarves' },
      { label: 'Belts', href: '/collections/belts' },
      { label: 'Sunglasses', href: '/collections/sunglasses' },
      { label: 'Watches', href: '/collections/watches' },
    ],
  },
  Shoes: {
    editorial: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900&q=85&auto=format',
    tagline: 'Step Into Elegance',
    categories: [
      { label: 'Pumps', href: '/collections/pumps' },
      { label: 'Boots', href: '/collections/boots' },
      { label: 'Flats', href: '/collections/flats' },
      { label: 'Sneakers', href: '/collections/sneakers' },
      { label: 'Sandals', href: '/collections/sandals' },
    ],
  },
  Beauty: {
    editorial: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&q=85&auto=format',
    tagline: 'Beauty & Fragrance',
    categories: [
      { label: 'Fragrances', href: '/collections/fragrances', featured: true },
      { label: 'Skincare', href: '/collections/skincare' },
      { label: 'Makeup', href: '/collections/makeup' },
      { label: 'Beauty Tools', href: '/collections/beauty-tools' },
    ],
  },
};

// Top-level categories shown in the left panel
const topLevelItems = [
  { label: 'New In', href: '/collections/new-in', hasSubmenu: false },
  { label: 'Women', href: '/collections/women', hasSubmenu: true },
  { label: 'Men', href: '/collections/men', hasSubmenu: true },
  { label: 'Clothing', href: '/collections/clothing', hasSubmenu: true },
  { label: 'Accessories', href: '/collections/accessories', hasSubmenu: true },
  { label: 'Shoes', href: '/collections/shoes', hasSubmenu: true },
  { label: 'Beauty', href: '/collections/beauty', hasSubmenu: true },
  { label: 'The Edit', href: '/collections/the-edit', hasSubmenu: false },
  { label: 'Sale', href: '/collections/sale', hasSubmenu: false },
];

// ============================================================================
// ICONS
// ============================================================================

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <line x1="4" y1="4" x2="20" y2="20" />
    <line x1="20" y1="4" x2="4" y2="20" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M7 17L17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const StoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// ============================================================================
// NAVIGATION MENU COMPONENT
// ============================================================================

/**
 * NavigationMenu – Full-screen luxury overlay (Gucci / LV reference)
 *
 * Layout:
 * ┌──────────────────────────────────────────────────────────────┐
 * │  [Close]                                          [Logo?]   │
 * ├──────────────────┬───────────────────────────────────────────┤
 * │  WOMEN      →    │                                          │
 * │  MEN             │     ┌─────────────────────────────┐      │
 * │  CLOTHING        │     │                             │      │
 * │  ACCESSORIES     │     │    EDITORIAL IMAGE          │      │
 * │  SHOES           │     │    (changes on hover)       │      │
 * │  BEAUTY          │     │                             │      │
 * │  THE EDIT        │     └─────────────────────────────┘      │
 * │  SALE            │     Subcategory links below image        │
 * │                  │                                          │
 * ├──────────────────┴───────────────────────────────────────────┤
 * │  📞 +966 ...     📍 Find a Store     🌐 Saudi Arabia / EN  │
 * └──────────────────────────────────────────────────────────────┘
 */
export function NavigationMenu() {
  const { state, dispatch } = useUI();
  const { isRTL, t } = useTranslation();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // The currently displayed category (active takes priority, then hovered)
  const displayCategory = activeCategory || hoveredCategory;
  const categoryData = displayCategory ? menuCategories[displayCategory] : null;

  const handleClose = useCallback(() => {
    dispatch({ type: 'CLOSE_MENU' });
    setHoveredCategory(null);
    setActiveCategory(null);
  }, [dispatch]);

  // Reset when menu closes
  useEffect(() => {
    if (!state.isMenuOpen) {
      setHoveredCategory(null);
      setActiveCategory(null);
    }
  }, [state.isMenuOpen]);

  // Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.isMenuOpen) handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [state.isMenuOpen, handleClose]);

  return (
    <AnimatePresence>
      {state.isMenuOpen && (
        <motion.div
          className="fixed inset-0 z-[200]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Full-screen dark overlay */}
          <motion.div
            className="absolute inset-0 bg-[#0a0a0a]/98 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Navigation Container */}
          <motion.nav
            className="relative z-10 h-full flex flex-col"
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {/* ─── Header Bar ─── */}
            <div className="flex items-center justify-between px-8 md:px-16 py-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#AA9B8F] font-light">
                {t('menu.title')}
              </span>
              <button
                className="p-2 text-[#F0EAE6]/70 hover:text-[#F0EAE6] transition-colors duration-300"
                onClick={handleClose}
                aria-label={t('common.close')}
              >
                <CloseIcon />
              </button>
            </div>

            {/* ─── Main Content: Split Panel ─── */}
            <div className="flex-1 flex overflow-hidden">

              {/* LEFT PANEL – Category Names */}
              <div className="w-full md:w-[340px] lg:w-[400px] flex flex-col justify-center px-8 md:px-16 py-8 md:border-r border-[#F0EAE6]/5">
                <ul className="space-y-1">
                  {topLevelItems.map((item, index) => {
                    const isActive = displayCategory === item.label;
                    const isSale = item.label === 'Sale';

                    return (
                      <motion.li
                        key={item.label}
                        initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.15 + index * 0.04,
                          duration: 0.5,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        {item.hasSubmenu ? (
                          <button
                            className="group w-full text-left py-2.5 flex items-center justify-between"
                            onMouseEnter={() => setHoveredCategory(item.label)}
                            onClick={() =>
                              setActiveCategory(
                                activeCategory === item.label ? null : item.label,
                              )
                            }
                          >
                            <span
                              className={`font-serif text-3xl md:text-4xl tracking-tight transition-all duration-500 ${isActive
                                ? 'text-[#F0EAE6]'
                                : displayCategory && !isActive
                                  ? 'text-[#F0EAE6]/25'
                                  : 'text-[#F0EAE6]/80 group-hover:text-[#F0EAE6]'
                                }`}
                            >
                              {item.label}
                            </span>
                            {/* Bronze accent line on active */}
                            <span
                              className={`block h-[1px] transition-all duration-500 ${isActive
                                ? 'w-12 bg-[#a87441]'
                                : 'w-0 bg-[#a87441] group-hover:w-8'
                                }`}
                            />
                          </button>
                        ) : (
                          <Link
                            to={item.href}
                            className="group block py-2.5"
                            onClick={handleClose}
                            onMouseEnter={() => {
                              setHoveredCategory(null);
                              setActiveCategory(null);
                            }}
                          >
                            <span
                              className={`font-serif tracking-tight transition-all duration-500 ${isSale
                                ? 'text-2xl md:text-3xl text-[#a87441] group-hover:text-[#D4AF87]'
                                : displayCategory
                                  ? 'text-3xl md:text-4xl text-[#F0EAE6]/25 group-hover:text-[#F0EAE6]/60'
                                  : 'text-3xl md:text-4xl text-[#F0EAE6]/80 group-hover:text-[#F0EAE6]'
                                }`}
                            >
                              {item.label}
                            </span>
                          </Link>
                        )}
                      </motion.li>
                    );
                  })}
                </ul>

                {/* Journal link at bottom of left panel */}
                <motion.div
                  className="mt-8 pt-8 border-t border-[#F0EAE6]/5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link
                    to="/journal"
                    className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#AA9B8F] hover:text-[#a87441] transition-colors duration-300"
                    onClick={handleClose}
                  >
                    Journal
                    <ArrowIcon />
                  </Link>
                </motion.div>
              </div>

              {/* RIGHT PANEL – Editorial Image + Subcategories */}
              <div className="hidden md:flex flex-1 flex-col justify-center px-12 lg:px-20">
                <AnimatePresence mode="wait">
                  {categoryData ? (
                    <motion.div
                      key={displayCategory}
                      className="flex flex-col lg:flex-row gap-12 items-start"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {/* Editorial Image */}
                      <div className="relative w-full lg:w-[55%] max-w-[550px] aspect-[3/4] overflow-hidden rounded-sm">
                        <motion.img
                          key={categoryData.editorial}
                          src={categoryData.editorial}
                          alt={displayCategory || ''}
                          className="w-full h-full object-cover"
                          initial={{ scale: 1.08, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          onLoad={() => setImageLoaded(true)}
                        />
                        {/* Gradient overlay at bottom */}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0a0a0a]/80 to-transparent" />
                        {/* Tagline badge */}
                        <div className="absolute bottom-6 left-6">
                          <span className="text-[10px] uppercase tracking-[0.25em] text-[#a87441] font-light">
                            {categoryData.tagline}
                          </span>
                        </div>
                      </div>

                      {/* Subcategory Links */}
                      <div className="flex-1 py-4">
                        <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#AA9B8F] mb-6 font-light">
                          {t('menu.explore')} {displayCategory}
                        </h3>
                        <ul className="space-y-0.5">
                          {categoryData.categories.map((cat, i) => (
                            <motion.li
                              key={cat.label}
                              initial={{ opacity: 0, x: 15 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: i * 0.03,
                                duration: 0.35,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                            >
                              <Link
                                to={cat.href}
                                className={`group flex items-center gap-3 py-2.5 transition-all duration-300 ${cat.featured
                                  ? 'text-[#a87441] hover:text-[#D4AF87]'
                                  : 'text-[#F0EAE6]/70 hover:text-[#F0EAE6]'
                                  }`}
                                onClick={handleClose}
                              >
                                <span className="text-[15px] font-light tracking-wide">
                                  {cat.label}
                                </span>
                                {cat.featured && (
                                  <span className="text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 border border-[#a87441]/30 text-[#a87441] rounded-sm">
                                    New
                                  </span>
                                )}
                                {/* Hover arrow */}
                                <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#a87441]">
                                  <ArrowIcon />
                                </span>
                              </Link>
                            </motion.li>
                          ))}
                        </ul>

                        {/* View All CTA */}
                        <motion.div
                          className="mt-8 pt-6 border-t border-[#F0EAE6]/5"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Link
                            to={`/collections/${displayCategory?.toLowerCase().replace(/\s/g, '-')}`}
                            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#a87441] hover:text-[#D4AF87] transition-colors duration-300"
                            onClick={handleClose}
                          >
                            {t('menu.viewAll')} {displayCategory}
                            <ArrowIcon />
                          </Link>
                        </motion.div>
                      </div>
                    </motion.div>
                  ) : (
                    /* Default state – brand message */
                    <motion.div
                      key="default"
                      className="flex flex-col items-center justify-center text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <img
                        src="/brand/logo-icon-only.png"
                        alt="Formé Haus"
                        className="h-16 w-16 object-contain opacity-30 mb-6"
                      />
                      <p className="font-serif text-xl text-[#F0EAE6]/20 italic">
                        Where Essence Meets Elegance
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* MOBILE: Subcategory flyover (replaces right panel on small screens) */}
              <AnimatePresence>
                {activeCategory && categoryData && (
                  <motion.div
                    className="md:hidden fixed inset-0 z-[210] bg-[#0a0a0a] flex flex-col"
                    initial={{ x: isRTL ? '-100%' : '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: isRTL ? '-100%' : '100%' }}
                    transition={{ type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Mobile subcategory header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-[#F0EAE6]/5">
                      <button
                        className="flex items-center gap-2 text-[#F0EAE6] hover:text-[#a87441] transition-colors"
                        onClick={() => setActiveCategory(null)}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M15 6l-6 6 6 6" />
                        </svg>
                        <span className="font-serif text-lg">{activeCategory}</span>
                      </button>
                      <button
                        className="p-2 text-[#F0EAE6]/70 hover:text-[#F0EAE6] transition-colors"
                        onClick={handleClose}
                      >
                        <CloseIcon />
                      </button>
                    </div>

                    {/* Mobile editorial image */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={categoryData.editorial}
                        alt={activeCategory}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
                      <div className="absolute bottom-4 left-6">
                        <span className="text-[10px] uppercase tracking-[0.25em] text-[#a87441]">
                          {categoryData.tagline}
                        </span>
                        <h2 className="font-serif text-2xl text-[#F0EAE6] mt-1">
                          {activeCategory}
                        </h2>
                      </div>
                    </div>

                    {/* Mobile subcategory links */}
                    <div className="flex-1 overflow-y-auto py-4 px-2">
                      {categoryData.categories.map((cat, i) => (
                        <motion.div
                          key={cat.label}
                          initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                        >
                          <Link
                            to={cat.href}
                            className={`flex items-center justify-between px-6 py-4 transition-colors ${cat.featured
                              ? 'text-[#a87441]'
                              : 'text-[#F0EAE6]/80 hover:text-[#F0EAE6]'
                              }`}
                            onClick={handleClose}
                          >
                            <span className="text-[15px] font-light tracking-wide">{cat.label}</span>
                            {cat.featured && (
                              <span className="text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 border border-[#a87441]/30 text-[#a87441] rounded-sm">
                                New
                              </span>
                            )}
                          </Link>
                        </motion.div>
                      ))}

                      {/* View All */}
                      <div className="px-6 py-4 mt-2 border-t border-[#F0EAE6]/5">
                        <Link
                          to={`/collections/${activeCategory.toLowerCase().replace(/\s/g, '-')}`}
                          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#a87441] hover:text-[#D4AF87] transition-colors"
                          onClick={handleClose}
                        >
                          {t('menu.viewAll')} {activeCategory}
                          <ArrowIcon />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ─── Footer Bar ─── */}
            <motion.div
              className="border-t border-[#F0EAE6]/5 px-8 md:px-16 py-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex flex-wrap items-center gap-6 text-[11px] uppercase tracking-[0.12em]">
                <a
                  href="tel:+966800123456"
                  className="text-[#AA9B8F] hover:text-[#a87441] transition-colors duration-300 flex items-center gap-2"
                >
                  <PhoneIcon />
                  800 123 456
                </a>
                <Link
                  to="/stores"
                  className="text-[#AA9B8F] hover:text-[#a87441] transition-colors duration-300 flex items-center gap-2"
                  onClick={handleClose}
                >
                  <StoreIcon />
                  {t('menu.stores')}
                </Link>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Locale buttons */}
                <div className="flex items-center gap-3">
                  <button className="px-3 py-1.5 bg-[#F0EAE6]/5 hover:bg-[#F0EAE6]/10 rounded text-[11px] text-[#F0EAE6]/60 hover:text-[#F0EAE6] transition-all duration-300">
                    {t('country')}
                  </button>
                  <button className="px-3 py-1.5 bg-[#F0EAE6]/5 hover:bg-[#F0EAE6]/10 rounded text-[11px] text-[#F0EAE6]/60 hover:text-[#F0EAE6] transition-all duration-300">
                    {isRTL ? 'العربية' : 'English'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default NavigationMenu;
