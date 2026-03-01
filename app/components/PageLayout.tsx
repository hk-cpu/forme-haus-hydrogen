import {Await, useRouteLoaderData, useLocation} from '@remix-run/react';
import {Suspense, useEffect, useState} from 'react';
import {CartForm} from '@shopify/hydrogen';
import {motion, AnimatePresence} from 'framer-motion';

import {type LayoutQuery} from 'storefrontapi.generated';
import {Text} from '~/components/Text';
import {Link} from '~/components/Link';
import {Cart} from '~/components/Cart';
import {CartLoading} from '~/components/CartLoading';
import {Drawer, useDrawer} from '~/components/Drawer';
import {type EnhancedMenu, useIsHomePath} from '~/lib/utils';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import type {RootLoader} from '~/root';
import {Header as FormeHeader} from '~/components/Header';
import Silk from '~/components/Silk';
import Atmosphere from '~/components/Atmosphere';
import {PredictiveSearch} from '~/components/PredictiveSearch';
import {NavigationMenu} from '~/components/NavigationMenu';
import {SearchOverlay} from '~/components/SearchOverlay';
import {AccountOverlay} from '~/components/AccountOverlay';
import {FilterPanel} from '~/components/FilterPanel';
import {useUI} from '~/context/UIContext';
import {useTranslation} from '~/hooks/useTranslation';
import {Newsletter} from '~/components/Newsletter';
import PaymentBadges from '~/components/PaymentBadges';

type LayoutProps = {
  children: React.ReactNode;
  layout?: LayoutQuery & {
    headerMenu?: EnhancedMenu | null;
    footerMenu?: EnhancedMenu | null;
  };
};

export function PageLayout({children, layout}: LayoutProps) {
  const {headerMenu, footerMenu} = layout || {};
  const [scrollY, setScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen relative">
        {/* Background Layer (Z-0) */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0" style={{transition: 'opacity 0.8s ease'}}>
            <Silk color="#AD9686" speed={useIsHomePath() ? 5 : 3} />
          </div>
          <Atmosphere count={60} color="#AD9686" size={0.008} opacity={0.2} />
        </div>

        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>

        <div className="relative z-10 flex flex-col items-center transition-all duration-700">
          <div className="w-full max-w-[1800px] flex flex-col relative mx-auto my-0">
            <Header
              title={layout?.shop.name || 'Formé Haus'}
              menu={headerMenu || undefined}
            />
            <main role="main" id="mainContent" className="flex-grow" style={{paddingTop: 'var(--navbar-height)'}}>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={location.pathname}
                  initial={{opacity: 0, y: 8}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: -8}}
                  transition={{duration: 0.4, ease: [0.25, 0.1, 0.25, 1]}}
                >
                  {useIsHomePath() ? (
                    children
                  ) : (
                    <div className="bg-[#F9F5F0]/85 backdrop-blur-md text-[#4A3C31] shadow-[0_0_80px_rgba(255,255,255,0.15)] lg:rounded-t-[2rem] min-h-[50vh]">
                      {children}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </main>
            <Footer menu={footerMenu || undefined} />
          </div>
        </div>
      </div>
    </>
  );
}

function Header({title, menu}: {title: string; menu?: EnhancedMenu}) {
  const isHome = useIsHomePath();
  const {state, toggleCart, toggleSearch, toggleMenu} = useUI();

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  /* Search Drawer State */
  const {
    isOpen: isSearchOpen,
    openDrawer: openSearch,
    closeDrawer: closeSearch,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  // Sync UIContext cart state with drawer
  useEffect(() => {
    if (state.isCartOpen && !isCartOpen) {
      openCart();
    } else if (!state.isCartOpen && isCartOpen) {
      closeCart();
    }
  }, [state.isCartOpen, isCartOpen, openCart, closeCart]);

  // Sync UIContext search state with drawer
  useEffect(() => {
    if (state.isSearchOpen && !isSearchOpen) {
      openSearch();
    } else if (!state.isSearchOpen && isSearchOpen) {
      closeSearch();
    }
  }, [state.isSearchOpen, isSearchOpen, openSearch, closeSearch]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      <SearchDrawer isOpen={isSearchOpen} onClose={closeSearch} />
      <NavigationMenu />
      <SearchOverlay />
      <AccountOverlay />
      <FilterPanel />
      <FormeHeader
        title={title}
        menu={menu}
        openCart={openCart}
        openSearch={toggleSearch}
        openMenu={toggleMenu}
      />
    </>
  );
}

function SearchDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer open={isOpen} onClose={onClose} heading="Search" openFrom="right">
      <div className="grid h-full">
        <PredictiveSearch isOpen={isOpen} onClose={onClose} />
      </div>
    </Drawer>
  );
}

function CartDrawer({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  if (!rootData) return null;

  return (
    <Drawer open={isOpen} onClose={onClose} heading="Cart" openFrom="right">
      <div className="grid">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={rootData?.cart}>
            {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}

export function MenuDrawer({
  isOpen,
  onClose,
  menu,
}: {
  isOpen: boolean;
  onClose: () => void;
  menu: EnhancedMenu;
}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="Menu">
      <div className="grid">
        <MenuMobileNav menu={menu} onClose={onClose} />
      </div>
    </Drawer>
  );
}

function MenuMobileNav({
  menu,
  onClose,
}: {
  menu: EnhancedMenu;
  onClose: () => void;
}) {
  const {isRTL} = useTranslation();
  return (
    <nav className="grid gap-6 p-6 sm:gap-8 sm:px-12 sm:py-8">
      {/* Top level menu items */}
      {(menu?.items || []).map((item, index) => (
        <motion.span
          key={item.id}
          className="block"
          initial={{opacity: 0, x: isRTL ? 20 : -20}}
          animate={{opacity: 1, x: 0}}
          transition={{delay: index * 0.1, duration: 0.5}}
        >
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({isActive}) =>
              `block font-serif text-3xl md:text-4xl transition-colors duration-300 ${
                isActive
                  ? 'text-[#a87441]'
                  : 'text-[#F0EAE6] hover:text-[#a87441]'
              }`
            }
          >
            {item.title === 'CATALOG' || item.title === 'Catalog'
              ? 'COLLECTIONS'
              : item.title}
          </Link>
        </motion.span>
      ))}

      {/* Account Link for Mobile */}
      <motion.div
        className="mt-8 pt-8 border-t border-[#a87441]/20"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 0.5, duration: 0.5}}
      >
        <Link
          to="/account"
          onClick={onClose}
          className="flex items-center gap-3 text-[#AA9B8F] hover:text-[#F0EAE6] transition-colors"
        >
          <span className="uppercase tracking-widest text-sm">
            Account / Sign In
          </span>
        </Link>
      </motion.div>
    </nav>
  );
}

function Footer({menu}: {menu?: EnhancedMenu}) {
  const {t} = useTranslation();

  const linkClass =
    'text-[12px] text-[#AA9B8F] hover:text-[#a87441] transition-colors duration-300 inline-block focus:outline-none focus-visible:text-[#a87441]';

  return (
    <footer
      role="contentinfo"
      className="relative w-full overflow-hidden rounded-b-[2rem]"
    >
      {/* Semi-Glass Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/80 via-[#151515]/90 to-[#121212]/95 backdrop-blur-xl" />

      {/* Bronze Accent Line at Top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#a87441]/50 to-transparent" />

      <div className="relative z-10 py-16" style={{padding: '4rem var(--page-gutter)'}}>
        {/* Newsletter */}
        <div className="max-w-[1440px] mx-auto mb-12 pb-12 border-b border-[#a87441]/10">
          <div className="max-w-md">
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#F0EAE6] font-medium mb-2">
              {t('footer.newsletter', 'Join the Haus')}
            </h4>
            <p className="text-[12px] text-[#AA9B8F] mb-4">
              {t(
                'footer.newsletterDesc',
                'Be the first to know about new drops, exclusive offers, and Haus updates.',
              )}
            </p>
            <Newsletter />
          </div>
        </div>

        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 w-full max-w-[1440px] mx-auto">
          {/* COL 1: Brand & Slogan */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Brand Logo */}
            <div className="flex items-center gap-4">
              <img
                src="/brand/logo-icon-only.png"
                alt="Formé Haus"
                className="h-16 w-auto object-contain opacity-90"
              />
              <h3 className="font-serif text-xl text-[#F0EAE6]">Formé Haus</h3>
            </div>

            {/* Slogan */}
            <p className="font-serif text-lg italic text-[#AA9B8F]">
              {t('footer.description', 'Where Essence Meets Elegance')}
            </p>
          </div>

          {/* COL 2: Customer Care Links */}
          <div className="lg:col-span-4">
            <div className="space-y-4">
              <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#F0EAE6] font-medium">
                Customer Care
              </h4>
              <nav className="grid gap-2.5">
                <Link to="/contact" className={linkClass}>
                  Contact Us
                </Link>
                <Link to="/policies/shipping-policy" className={linkClass}>
                  Shipping & Delivery Policy
                </Link>
                <Link to="/policies/refund-policy" className={linkClass}>
                  Return and Exchange Policy
                </Link>
                <Link to="/policies/privacy-policy" className={linkClass}>
                  Privacy Policy
                </Link>
              </nav>
            </div>
          </div>

          {/* COL 3: Follow Us & Payments */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Follow Us */}
            <div className="space-y-3">
              <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#F0EAE6] font-medium">
                Follow Us
              </h4>
              <div className="flex items-center gap-4">
                {/* Instagram */}
                <a
                  href="https://instagram.com/formehaus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#AA9B8F] hover:text-[#a87441] transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                {/* TikTok */}
                <a
                  href="https://tiktok.com/@formehaus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#AA9B8F] hover:text-[#a87441] transition-colors duration-300"
                  aria-label="TikTok"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.55a8.18 8.18 0 0 0 4.76 1.52V6.69h-1z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Payments */}
            <div className="space-y-2">
              <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#F0EAE6] font-medium">
                Payments
              </h4>
              <PaymentBadges />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-[1440px] mx-auto my-12 h-[1px] bg-gradient-to-r from-transparent via-[#a87441]/20 to-transparent" />

        {/* Footer Bottom Line */}
        <div className="max-w-[1440px] mx-auto text-center text-[11px] font-sans tracking-[0.08em] text-[#8B8076]">
          <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6">
            <span className="font-medium text-[#F0EAE6]/80">
              &copy; Formé Haus FH Establishment
            </span>
            <span className="hidden lg:block h-3 w-px bg-[#F0EAE6]/20" />
            <span>
              CR No:{' '}
              <span className="font-mono text-[#F0EAE6]">7051891369</span>
            </span>
            <span className="hidden lg:block h-3 w-px bg-[#F0EAE6]/20" />
            <span>
              VAT No:{' '}
              <span className="font-mono text-[#F0EAE6]">314271812300003</span>
            </span>
            <span className="hidden lg:block h-3 w-px bg-[#F0EAE6]/20" />
            <span>Registered in Saudi Arabia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
