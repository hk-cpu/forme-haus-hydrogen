import {Await, useRouteLoaderData, useLocation} from '@remix-run/react';
import {Suspense, useEffect, useMemo, useCallback, useState, lazy} from 'react';
import {CartForm} from '@shopify/hydrogen';

import {type LayoutQuery} from 'storefrontapi.generated';
import {Text} from '~/components/Text';
import {Link} from '~/components/Link';
import {CartLoading} from '~/components/CartLoading';
import {Drawer, useDrawer} from '~/components/Drawer';
import {type EnhancedMenu, useIsHomePath} from '~/lib/utils';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import type {RootLoader} from '~/root';
import {Header as FormeHeader} from '~/components/Header';
import Silk from '~/components/Silk';
import Atmosphere from '~/components/Atmosphere';
import {useUI} from '~/context/UIContext';
import {useTranslation} from '~/hooks/useTranslation';
import {Newsletter} from '~/components/Newsletter';
import PaymentBadges from '~/components/PaymentBadges';

// Lazy-load overlays — invisible on initial render, defers their FM + component JS
const NavigationMenu = lazy(() =>
  import('~/components/NavigationMenu').then((m) => ({
    default: m.NavigationMenu,
  })),
);
const SearchOverlay = lazy(() =>
  import('~/components/SearchOverlay').then((m) => ({
    default: m.SearchOverlay,
  })),
);
const AccountOverlay = lazy(() =>
  import('~/components/AccountOverlay').then((m) => ({
    default: m.AccountOverlay,
  })),
);
const Cart = lazy(() =>
  import('~/components/Cart').then((m) => ({default: m.Cart})),
);
const MobileBottomNav = lazy(() =>
  import('~/components/MobileBottomNav').then((m) => ({
    default: m.MobileBottomNav,
  })),
);

type LayoutProps = {
  children: React.ReactNode;
  layout?: LayoutQuery & {
    headerMenu?: EnhancedMenu | null;
    footerMenu?: EnhancedMenu | null;
  };
};

// Set WHATSAPP_NUMBER to your actual business number (country code, no +) to enable this button
const WHATSAPP_NUMBER = '966533954066';

export function PageLayout({children, layout}: LayoutProps) {
  const {headerMenu, footerMenu} = layout || {};
  const location = useLocation();
  const {state} = useUI();
  const isHome = useIsHomePath();
  const {t, isRTL} = useTranslation();
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

  // Filter logic for Silk background - pages where Silk should be hidden
  const shouldShowSilk = useMemo(() => {
    return !location.pathname.includes('/collections/sunglasses');
  }, [location.pathname]);

  // Check if we're on a collection page to adjust padding
  const isCollectionPage = location.pathname.includes('/collections/');

  const isOverlayOpen = state.isCartOpen || state.isSearchOpen;

  return (
    <>
      <div className="flex flex-col min-h-screen relative">
        {/* Background Layer (Z-0) - Filtered by page */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {isDesktop && shouldShowSilk && (
            <div
              className="absolute inset-0"
              style={{transition: 'opacity 0.8s ease'}}
            >
              <Silk color="#AD9686" speed={isHome ? 5 : 3} />
            </div>
          )}
          {isDesktop && shouldShowSilk && (
            <Atmosphere count={60} color="#AD9686" size={0.008} opacity={0.2} />
          )}
        </div>

        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>

        {/* Semi-transparent overlay instead of full-page blur (GPU-friendly) */}
        {isOverlayOpen && (
          <div className="fixed inset-0 z-[9] bg-black/30 pointer-events-none" />
        )}

        <div
          className={`relative z-10 flex flex-col items-center transition-opacity duration-300 ${
            isOverlayOpen ? 'opacity-95 pointer-events-none' : ''
          }`}
        >
          <div className="w-full max-w-[1440px] flex flex-col relative mx-auto my-0">
            <Header
              title={layout?.shop.name || 'Formé Haus'}
              menu={headerMenu || undefined}
            />
            <main
              role="main"
              id="mainContent"
              className={`flex-grow pb-[72px] md:pb-0`}
              style={{
                paddingTop: isCollectionPage ? 0 : 'var(--navbar-height)',
              }}
            >
              {/* CSS page fade-in — replaces AnimatePresence to eliminate FM from critical path */}
              <div key={location.pathname} className="page-fade-in">
                {isHome ? (
                  children
                ) : (
                  <div
                    className={`bg-[#F9F5F0]/85 backdrop-blur-md text-[#4A3C31] shadow-[0_0_80px_rgba(255,255,255,0.15)] min-h-[50vh] ${
                      isCollectionPage ? '' : 'lg:rounded-t-[2rem]'
                    }`}
                  >
                    {children}
                  </div>
                )}
              </div>
            </main>
            {/* Newsletter — Above Footer */}
            <section className="relative w-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/80 via-[#151515]/90 to-[#121212]/95 backdrop-blur-xl" />
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#a87441]/50 to-transparent" />
              <div
                className="relative z-10 py-16"
                style={{padding: '4rem var(--page-gutter)'}}
              >
                <div className="max-w-[420px] mx-auto text-center">
                  <h4 className="font-serif text-lg text-[#F0EAE6] tracking-wider uppercase mb-2">
                    {t('footer.newsletter', 'Join the Haus')}
                  </h4>
                  <p className="text-[12px] text-[#AA9B8F] mb-5 font-light">
                    {t(
                      'footer.newsletterDesc',
                      'New arrivals, exclusive offers, and more.',
                    )}
                  </p>
                  <Newsletter />
                </div>
              </div>
            </section>
            <Footer menu={footerMenu || undefined} />
          </div>
        </div>
        {/* WhatsApp Floating Button — set WHATSAPP_NUMBER above to enable */}
        {WHATSAPP_NUMBER && (
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              t(
                'whatsapp.defaultMessage',
                'Hello, I would like to enquire about a product at Formé Haus',
              ),
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('a11y.whatsappContact', 'Contact us on WhatsApp')}
            className={`whatsapp-fab fixed bottom-[80px] md:bottom-6 z-[400] w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#25D366]/70 hover:bg-[#25D366] shadow-md shadow-[#25D366]/20 hover:shadow-lg hover:shadow-[#25D366]/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 ${
              isRTL ? 'left-4 md:left-6' : 'right-4 md:right-6'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="w-5 h-5 md:w-6 md:h-6"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        )}

        {/* Mobile bottom navigation — critical for GCC/Saudi mobile-first market */}
        <Suspense fallback={null}>
          <MobileBottomNav />
        </Suspense>
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

  // Sync UIContext cart state with drawer (one-directional to avoid loop)
  useEffect(() => {
    if (state.isCartOpen && !isCartOpen) {
      openCart();
    } else if (!state.isCartOpen && isCartOpen) {
      closeCart();
    }
    // Only react to UIContext changes, not drawer state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isCartOpen]);

  return (
    <>
      <Suspense fallback={null}>
        <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
        <NavigationMenu />
        <SearchOverlay />
        <AccountOverlay />
      </Suspense>
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
  const {isRTL} = useTranslation();
  if (!rootData) return null;

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      heading="Bag"
      openFrom={isRTL ? 'left' : 'right'}
    >
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
    <nav className="grid gap-6 p-6 sm:gap-8 sm:px-12 sm:py-8 menu-stagger">
      {/* Top level menu items */}
      {(menu?.items || []).map((item, index) => (
        <span
          key={item.id}
          className="block menu-stagger-item"
          style={{'--stagger-index': index} as React.CSSProperties}
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
        </span>
      ))}

      {/* Account Link for Mobile */}
      <div
        className="mt-8 pt-8 border-t border-[#a87441]/20 menu-stagger-item"
        style={
          {'--stagger-index': (menu?.items || []).length} as React.CSSProperties
        }
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
      </div>
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
                src="/brand/logo-icon-only.webp"
                alt="Formé Haus"
                className="h-16 w-auto object-contain opacity-90"
              />
              <div className="flex flex-col">
                <h3 className="font-serif text-xl text-[#F0EAE6] leading-tight">
                  Formé Haus
                </h3>
                <p className="font-serif text-[12px] italic text-[#AA9B8F] tracking-wide mt-1 whitespace-nowrap">
                  {t('footer.description', 'Where Essence Meets Elegance')}
                </p>
              </div>
            </div>
          </div>

          {/* Direct Navigation Links */}
          <nav className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center">
            <Link to="/contact" className={linkClass}>
              {t('footer.contact', 'Contact us')}
            </Link>
            <Link to="/policies/shipping-policy" className={linkClass}>
              {t('footer.shipping', 'Shipping & Delivery Policy')}
            </Link>
            <Link to="/policies/refund-policy" className={linkClass}>
              {t('footer.returns', 'Return & Exchange Policy')}
            </Link>
            <Link to="/policies/privacy-policy" className={linkClass}>
              {t('footer.privacy', 'Privacy Policy')}
            </Link>
            <Link to="/policies/terms-of-service" className={linkClass}>
              {t('footer.terms', 'Terms & Conditions')}
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

        {/* Payment Methods */}
        <div className="max-w-[1440px] mx-auto mt-8 mb-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#AA9B8F]/60 mb-3">
            {t('footer.securePayments', 'Secure Payment Methods')}
          </p>
          <PaymentBadges />
          <p className="text-[10px] text-[#8B8076]/50 mt-2">
            Powered by Tap Payments · 256-bit SSL Encrypted
          </p>
        </div>

        {/* Divider */}
        <div className="max-w-[1440px] mx-auto my-12 h-[1px] bg-gradient-to-r from-transparent via-[#a87441]/20 to-transparent" />

        {/* Footer Bottom Line */}
        <div className="max-w-[1440px] mx-auto text-center text-[11px] font-sans tracking-[0.08em] text-[#8B8076]">
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-4 lg:gap-6">
            <span className="font-medium text-[#F0EAE6]/80">
              &copy; {new Date().getFullYear()} Formé Haus FH Establishment
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
            <span>{t('footer.registered', 'Registered in Saudi Arabia')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
