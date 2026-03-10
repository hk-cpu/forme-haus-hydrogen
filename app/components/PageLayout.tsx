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
import {NavigationMenu} from '~/components/NavigationMenu';
import {SearchOverlay} from '~/components/SearchOverlay';
import {AccountOverlay} from '~/components/AccountOverlay';
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
  const location = useLocation();
  const {state} = useUI();
  const [isDesktop, setIsDesktop] = useState(false);

  // Check for desktop breakpoint (md: 768px)
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen relative">
        {/* Background Layer (Z-0) */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {isDesktop && (
          <div
            className="absolute inset-0"
            style={{transition: 'opacity 0.8s ease'}}
          >
            <Silk color="#AD9686" speed={useIsHomePath() ? 5 : 3} />
          </div>)}
          {isDesktop && <Atmosphere count={60} color="#AD9686" size={0.008} opacity={0.2} />}
        </div>

        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>

        <div
          className={`relative z-10 flex flex-col items-center transition-all duration-700 ${
            state.isCartOpen || state.isSearchOpen
              ? 'blur-[2px] scale-[0.995] pointer-events-none'
              : ''
          }`}
        >
          <div className="w-full max-w-[1800px] flex flex-col relative mx-auto my-0">
            <Header
              title={layout?.shop.name || 'Formé Haus'}
              menu={headerMenu || undefined}
            />
            <main
              role="main"
              id="mainContent"
              className="flex-grow"
              style={{paddingTop: 'var(--navbar-height)'}}
            >
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

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      <NavigationMenu />
      <SearchOverlay />
      <AccountOverlay />
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
  const {t, isRTL} = useTranslation();
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
            {t('nav.account', 'Account / Sign In')}
          </span>
        </Link>
      </motion.div>
    </nav>
  );
}

function Footer({menu}: {menu?: EnhancedMenu}) {
  const {t} = useTranslation();

  const linkClass =
    'text-[12px] text-[#AA9B8F] hover:text-[#a87441] transition-colors duration-300 inline-block py-1.5 focus:outline-none focus-visible:text-[#a87441]';

  return (
    <footer
      role="contentinfo"
      className="relative w-full overflow-hidden rounded-b-[2rem]"
    >
      {/* Semi-Glass Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/80 via-[#151515]/90 to-[#121212]/95 backdrop-blur-xl" />

      {/* Bronze Accent Line at Top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#a87441]/50 to-transparent" />

      <div
        className="relative z-10 py-16"
        style={{padding: '4rem var(--page-gutter)'}}
      >
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 w-full max-w-[1440px] mx-auto mb-12 pb-12 border-b border-[#a87441]/10">
          {/* Brand & Slogan */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-4">
              <img
                src="/brand/logo-icon-only.png"
                alt="Formé Haus"
                className="h-16 w-auto object-contain opacity-90"
              />
              <div className="flex flex-col">
                <h3 className="font-serif text-xl text-[#F0EAE6] leading-tight">Formé Haus</h3>
                <p className="font-serif text-[12px] italic text-[#AA9B8F] tracking-wide mt-1">
                  {t('footer.description', 'Where Essence Meets Elegance')}
                </p>
              </div>
            </div>
          </div>

          {/* Direct Navigation Links */}
          <nav className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center">
            <Link to="/contact" className={linkClass}>
              Contact us
            </Link>
            <Link to="/policies/shipping-policy" className={linkClass}>
              Shipping & Delivery Policy
            </Link>
            <Link to="/policies/terms-of-service" className={linkClass}>
              Return and Exchange Policy
            </Link>
            <Link to="/policies/privacy-policy" className={linkClass}>
              Privacy Policy
            </Link>
          </nav>
        </div>

        {/* Social Links */}
        <div className="max-w-[1440px] mx-auto mb-8">
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://instagram.com/formehaus"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#AA9B8F] hover:text-[#a87441] transition-colors"
              aria-label="Instagram"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="5"
                  ry="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="17.5"
                  y1="6.5"
                  x2="17.51"
                  y2="6.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="https://twitter.com/formehaus"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#AA9B8F] hover:text-[#a87441] transition-colors"
              aria-label="Twitter"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://tiktok.com/@formehaus"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#AA9B8F] hover:text-[#a87441] transition-colors"
              aria-label="TikTok"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-[1440px] mx-auto my-12 h-[1px] bg-gradient-to-r from-transparent via-[#a87441]/20 to-transparent" />

        {/* Footer Bottom Line */}
        <div className="max-w-[1440px] mx-auto text-center text-[11px] font-sans tracking-[0.08em] text-[#8B8076]">
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-4 lg:gap-6">
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
