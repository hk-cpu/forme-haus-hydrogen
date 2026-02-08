import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@remix-run/react';
import { useUI, menuData } from '~/context/UIContext';
import { useTranslation } from '~/hooks/useTranslation';

// Icons
const Icons = {
  ChevronRight: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 6l6 6-6 6" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  ),
  Close: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="4" y1="4" x2="20" y2="20" />
      <line x1="20" y1="4" x2="4" y2="20" />
    </svg>
  ),
  Phone: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  MapPin: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Globe: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <ellipse cx="12" cy="12" rx="4" ry="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  ),
  Headphones: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  ),
};

// Level 2 menu data with images
const level2Data: Record<string, { image: string; categories: { label: string; href: string }[] }> = {
  women: {
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
    categories: [
      { label: 'New Arrivals', href: '/collections/women-new' },
      { label: 'Dresses', href: '/collections/women-dresses' },
      { label: 'Tops & Blouses', href: '/collections/women-tops' },
      { label: 'Pants & Skirts', href: '/collections/women-bottoms' },
      { label: 'Outerwear', href: '/collections/women-outerwear' },
      { label: 'Knitwear', href: '/collections/women-knitwear' },
      { label: 'Accessories', href: '/collections/women-accessories' },
    ],
  },
  men: {
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    categories: [
      { label: 'New Arrivals', href: '/collections/men-new' },
      { label: 'Shirts', href: '/collections/men-shirts' },
      { label: 'Pants', href: '/collections/men-pants' },
      { label: 'Outerwear', href: '/collections/men-outerwear' },
      { label: 'Knitwear', href: '/collections/men-knitwear' },
      { label: 'Accessories', href: '/collections/men-accessories' },
    ],
  },
  clothing: {
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80',
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
  accessories: {
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80',
    categories: [
      { label: 'Bags', href: '/collections/bags' },
      { label: 'Jewelry', href: '/collections/jewelry' },
      { label: 'Scarves', href: '/collections/scarves' },
      { label: 'Belts', href: '/collections/belts' },
      { label: 'Sunglasses', href: '/collections/sunglasses' },
      { label: 'Watches', href: '/collections/watches' },
    ],
  },
  shoes: {
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
    categories: [
      { label: 'Pumps', href: '/collections/pumps' },
      { label: 'Boots', href: '/collections/boots' },
      { label: 'Flats', href: '/collections/flats' },
      { label: 'Sneakers', href: '/collections/sneakers' },
      { label: 'Sandals', href: '/collections/sandals' },
    ],
  },
  beauty: {
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
    categories: [
      { label: 'Fragrances', href: '/collections/fragrances' },
      { label: 'Skincare', href: '/collections/skincare' },
      { label: 'Makeup', href: '/collections/makeup' },
      { label: 'Beauty Tools', href: '/collections/beauty-tools' },
    ],
  },
};

// Level 3 menu data
const level3Data: Record<string, { image: string; items: { label: string; href: string }[] }> = {
  'dresses': {
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
    items: [
      { label: 'Evening Dresses', href: '/collections/evening-dresses' },
      { label: 'Cocktail Dresses', href: '/collections/cocktail-dresses' },
      { label: 'Day Dresses', href: '/collections/day-dresses' },
      { label: 'Maxi Dresses', href: '/collections/maxi-dresses' },
      { label: 'Midi Dresses', href: '/collections/midi-dresses' },
    ],
  },
  'tops': {
    image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80',
    items: [
      { label: 'Blouses', href: '/collections/blouses' },
      { label: 'Shirts', href: '/collections/shirts' },
      { label: 'T-Shirts', href: '/collections/t-shirts' },
      { label: 'Tank Tops', href: '/collections/tank-tops' },
    ],
  },
};

/**
 * NavigationMenu - Full-screen navigation overlay with 3-level drill-down
 * 
 * Features:
 * - 3-level drill-down navigation (Level 1 → Level 2 with hero → Level 3 product types)
 * - Back navigation with breadcrumb
 * - Footer: services, phone, store finder, country/language selector
 * - Motion animations (slide from left)
 * - Dark luxury theme (#121212 bg, #F0EAE6 text, #a87441 accents)
 */
export function NavigationMenu() {
  const { state, dispatch } = useUI();
  const { isRTL, t } = useTranslation();
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [currentSubCategory, setCurrentSubCategory] = useState<string>('');

  const slideVariants = {
    initial: { x: isRTL ? '100%' : '-100%' },
    animate: { x: 0 },
    exit: { x: isRTL ? '100%' : '-100%' },
  };

  const contentVariants = {
    initial: { x: isRTL ? -100 : 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: isRTL ? 100 : -100, opacity: 0 },
  };

  const handleNavigate = (categoryId: string, categoryLabel: string) => {
    setCurrentCategory(categoryLabel);
    dispatch({ type: 'NAVIGATE_MENU', category: categoryLabel });
  };

  const handleNavigateLevel3 = (subCategoryLabel: string) => {
    setCurrentSubCategory(subCategoryLabel);
    dispatch({ type: 'NAVIGATE_MENU', category: subCategoryLabel });
  };

  const handleBack = () => {
    dispatch({ type: 'BACK_MENU' });
    if (state.menuLevel === 2) {
      setCurrentSubCategory('');
    } else if (state.menuLevel === 1) {
      setCurrentCategory('');
    }
  };

  const handleClose = () => {
    dispatch({ type: 'CLOSE_MENU' });
    setCurrentCategory('');
    setCurrentSubCategory('');
  };

  // Reset when menu closes
  useEffect(() => {
    if (!state.isMenuOpen) {
      setCurrentCategory('');
      setCurrentSubCategory('');
    }
  }, [state.isMenuOpen]);

  // Get current level data
  const level2Info = currentCategory ? level2Data[currentCategory.toLowerCase()] : null;
  const level3Info = currentSubCategory ? level3Data[currentSubCategory.toLowerCase()] : null;

  return (
    <AnimatePresence>
      {state.isMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-[200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Navigation Panel */}
          <motion.nav
            className="fixed top-0 left-0 h-full w-full max-w-[480px] bg-[#121212] z-[201] flex flex-col overflow-hidden"
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'tween', duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#a87441]/20 min-h-[72px]">
              {state.menuLevel > 0 ? (
                <button
                  className="flex items-center gap-2 text-[#F0EAE6] hover:text-[#a87441] transition-colors"
                  onClick={handleBack}
                >
                  <Icons.ChevronLeft />
                  <span className="font-serif text-lg">
                    {state.menuLevel === 2 ? currentSubCategory : currentCategory}
                  </span>
                </button>
              ) : (
                <div className="text-[11px] uppercase tracking-[0.2em] text-[#AA9B8F]">
                  {t('menu.title', 'Menu')}
                </div>
              )}
              <button
                className="p-2 text-[#F0EAE6] hover:text-[#a87441] transition-colors"
                onClick={handleClose}
                aria-label={t('common.close', 'Close')}
              >
                <Icons.Close />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {/* Level 1 - Main Categories */}
                {state.menuLevel === 0 && (
                  <motion.div
                    key="level1"
                    className="py-4"
                    variants={contentVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <ul className="space-y-1">
                      {menuData.level1.map((item, index) => (
                        <motion.li
                          key={item.id}
                          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.04 }}
                        >
                          {item.hasChildren ? (
                            <button
                              className="w-full flex items-center justify-between px-6 py-4 text-[#F0EAE6] hover:bg-[#a87441]/10 transition-colors group"
                              onClick={() => handleNavigate(item.id, item.label)}
                            >
                              <span className="font-serif text-lg tracking-wide">{item.label}</span>
                              <span className="text-[#AA9B8F] group-hover:text-[#a87441] transition-colors">
                                <Icons.ChevronRight />
                              </span>
                            </button>
                          ) : (
                            <Link
                              to={item.href}
                              className="block px-6 py-4 text-[#F0EAE6] hover:bg-[#a87441]/10 transition-colors font-serif text-lg tracking-wide"
                              onClick={handleClose}
                            >
                              {item.label}
                            </Link>
                          )}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Level 2 - Category with Hero Image */}
                {state.menuLevel === 1 && level2Info && (
                  <motion.div
                    key="level2"
                    variants={contentVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    {/* Hero Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={level2Info.image}
                        alt={currentCategory}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent" />
                      <div className="absolute bottom-4 left-6">
                        <span className="text-[11px] uppercase tracking-[0.2em] text-[#a87441]">
                          {t('menu.collection', 'Collection')}
                        </span>
                        <h2 className="font-serif text-2xl text-[#F0EAE6] mt-1">{currentCategory}</h2>
                      </div>
                    </div>

                    {/* Categories List */}
                    <ul className="py-4">
                      {level2Info.categories.map((cat, index) => (
                        <motion.li
                          key={cat.label}
                          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.04 }}
                        >
                          <button
                            className="w-full flex items-center justify-between px-6 py-3.5 text-[#F0EAE6] hover:bg-[#a87441]/10 transition-colors group"
                            onClick={() => handleNavigateLevel3(cat.label)}
                          >
                            <span className="font-sans text-[15px]">{cat.label}</span>
                            <span className="text-[#AA9B8F] group-hover:text-[#a87441] transition-colors">
                              <Icons.ChevronRight />
                            </span>
                          </button>
                        </motion.li>
                      ))}
                    </ul>

                    {/* View All Link */}
                    <div className="px-6 pb-4">
                      <Link
                        to={`/collections/${currentCategory.toLowerCase().replace(/\s/g, '-')}`}
                        className="inline-flex items-center gap-2 text-[#a87441] text-sm uppercase tracking-[0.1em] hover:text-[#D4AF87] transition-colors"
                        onClick={handleClose}
                      >
                        {t('menu.viewAll', 'View All')}
                        <Icons.ChevronRight />
                      </Link>
                    </div>
                  </motion.div>
                )}

                {/* Level 3 - Product Types */}
                {state.menuLevel === 2 && level3Info && (
                  <motion.div
                    key="level3"
                    variants={contentVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    {/* Hero Image */}
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={level3Info.image}
                        alt={currentSubCategory}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent" />
                      <div className="absolute bottom-4 left-6">
                        <span className="text-[11px] uppercase tracking-[0.2em] text-[#a87441]">
                          {currentCategory}
                        </span>
                        <h2 className="font-serif text-xl text-[#F0EAE6] mt-1">{currentSubCategory}</h2>
                      </div>
                    </div>

                    {/* Product Types */}
                    <ul className="py-4">
                      {level3Info.items.map((item, index) => (
                        <motion.li
                          key={item.label}
                          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.04 }}
                        >
                          <Link
                            to={item.href}
                            className="block px-6 py-3.5 text-[#F0EAE6] hover:bg-[#a87441]/10 transition-colors font-sans text-[15px]"
                            onClick={handleClose}
                          >
                            {item.label}
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Fallback for missing level data */}
                {state.menuLevel === 1 && !level2Info && (
                  <motion.div
                    key="level2-fallback"
                    className="p-6 text-center"
                    variants={contentVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <p className="text-[#AA9B8F] mb-4">{t('menu.comingSoon', 'Coming Soon')}</p>
                    <Link
                      to={`/collections/${currentCategory.toLowerCase().replace(/\s/g, '-')}`}
                      className="inline-flex items-center gap-2 text-[#a87441] text-sm uppercase tracking-[0.1em] hover:text-[#D4AF87] transition-colors"
                      onClick={handleClose}
                    >
                      {t('menu.viewAll', 'View All')} {currentCategory}
                      <Icons.ChevronRight />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="border-t border-[#a87441]/20 px-6 py-5 space-y-4">
              {/* Service Links */}
              <div className="flex flex-wrap gap-4 text-[12px] uppercase tracking-[0.1em]">
                <Link to="/services" className="text-[#AA9B8F] hover:text-[#a87441] transition-colors flex items-center gap-1.5" onClick={handleClose}>
                  <Icons.Headphones />
                  {t('menu.services', 'Services')}
                </Link>
                <a href="tel:+966500000000" className="text-[#AA9B8F] hover:text-[#a87441] transition-colors flex items-center gap-1.5">
                  <Icons.Phone />
                  +966 50 000 0000
                </a>
                <Link to="/stores" className="text-[#AA9B8F] hover:text-[#a87441] transition-colors flex items-center gap-1.5" onClick={handleClose}>
                  <Icons.MapPin />
                  {t('menu.stores', 'Find a Store')}
                </Link>
              </div>

              {/* Locale Selector */}
              <div className="flex items-center gap-3 pt-3 border-t border-[#a87441]/10">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-[#a87441]/10 rounded text-[12px] text-[#F0EAE6] hover:bg-[#a87441]/20 transition-colors">
                  <Icons.Globe />
                  <span>{t('country', 'Saudi Arabia')}</span>
                </button>
                <button className="px-3 py-1.5 bg-[#a87441]/10 rounded text-[12px] text-[#F0EAE6] hover:bg-[#a87441]/20 transition-colors">
                  {isRTL ? 'العربية' : 'English'}
                </button>
              </div>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}

export default NavigationMenu;
