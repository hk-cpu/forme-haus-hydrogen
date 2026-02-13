import { Await, useRouteLoaderData } from '@remix-run/react';
import { Suspense, useEffect, useState } from 'react';
import { CartForm } from '@shopify/hydrogen';
import { motion } from 'framer-motion';

import { type LayoutQuery } from 'storefrontapi.generated';
import { Text } from '~/components/Text';
import { Link } from '~/components/Link';
import { Cart } from '~/components/Cart';
import { CartLoading } from '~/components/CartLoading';
import { Drawer, useDrawer } from '~/components/Drawer';

import {
  type EnhancedMenu,
  type ChildEnhancedMenuItem,
  useIsHomePath,
} from '~/lib/utils';
import { useCartFetchers } from '~/hooks/useCartFetchers';
import type { RootLoader } from '~/root';
import { Header as FormeHeader } from '~/components/Header';
import Silk from '~/components/Silk';
import Atmosphere from '~/components/Atmosphere';
import { PredictiveSearch } from '~/components/PredictiveSearch';
import { NavigationMenu } from '~/components/NavigationMenu';
import { Newsletter } from '~/components/Newsletter';

import { SearchOverlay } from '~/components/SearchOverlay';
import { AccountOverlay } from '~/components/AccountOverlay';
import { FilterPanel } from '~/components/FilterPanel';
import { useUI } from '~/context/UIContext';

import SocialButtons from '~/components/SocialButtons';
import PaymentBadges from '~/components/PaymentBadges';
import { useTranslation } from '~/hooks/useTranslation';

type LayoutProps = {
  children: React.ReactNode;
  layout?: LayoutQuery & {
    headerMenu?: EnhancedMenu | null;
    footerMenu?: EnhancedMenu | null;
  };
};

export function PageLayout({ children, layout }: LayoutProps) {
  const { headerMenu, footerMenu } = layout || {};
  const [scrollY, setScrollY] = useState(0);

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
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen relative bg-[#121212]">
        {/* Background Layer (Z-0) */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <Silk color="#AD9686" opacity={0.15} />
          <Atmosphere count={100} color="#AD9686" size={0.008} opacity={0.2} />
          {/* Subtle gradient for depth - much lighter */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
        </div>

        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>

        <div className="relative z-10 flex flex-col items-center lg:py-8 transition-all duration-700">
          <div className="w-full max-w-[1800px] flex flex-col relative mx-auto my-0 px-4 md:px-8">
            <Header
              title={layout?.shop.name || 'Form├⌐ Haus'}
              menu={headerMenu || undefined}
            />
            <main role="main" id="mainContent" className="flex-grow">
              {useIsHomePath() ? (
                children
              ) : (
                <div className="bg-[#F9F5F0] text-[#4A3C31] shadow-[0_0_100px_rgba(255,255,255,0.3)] lg:rounded-t-[2rem] min-h-[50vh] p-6 md:p-12">
                  {children}
                </div>
              )}
            </main>
            <Footer menu={footerMenu || undefined} />
          </div>
        </div>
      </div>
    </>
  );
}

function Header({ title, menu }: { title: string; menu?: EnhancedMenu }) {
  const isHome = useIsHomePath();
  const { state, toggleCart, toggleSearch, toggleMenu } = useUI();

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

function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
  return (
    <nav className="grid gap-6 p-6 sm:gap-8 sm:px-12 sm:py-8">
      {/* Top level menu items */}
      {(menu?.items || []).map((item, index) => (
        <motion.span
          key={item.id}
          className="block"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({ isActive }) =>
              `block font-serif text-3xl md:text-4xl transition-colors duration-300 ${isActive ? 'text-[#a87441]' : 'text-[#F0EAE6] hover:text-[#a87441]'
              }`
            }
          >
            {item.title}
          </Link>
        </motion.span>
      ))}

      {/* Account Link for Mobile */}
      <motion.div
        className="mt-8 pt-8 border-t border-[#a87441]/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Link
          to="/account"
          onClick={onClose}
          className="flex items-center gap-3 text-[#AA9B8F] hover:text-[#F0EAE6] transition-colors"
        >
          <span className="uppercase tracking-widest text-sm">Account / Sign In</span>
        </Link>
      </motion.div>
    </nav>
  );
}

function Footer({ menu }: { menu?: EnhancedMenu }) {
  const isHome = useIsHomePath();
  const { t } = useTranslation();

  return (
    <footer
      role="contentinfo"
      className="relative w-full overflow-hidden rounded-b-[2rem]"
    >
      {/* Semi-Glass Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/80 via-[#151515]/90 to-[#121212]/95 backdrop-blur-xl" />

      {/* Bronze Accent Line at Top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#a87441]/50 to-transparent" />

      <div className="relative z-10 py-16 px-6 md:px-12 lg:px-24">
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 w-full max-w-[1920px] mx-auto">

          {/* COL 1: Brand & Newsletter */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Brand Logo */}
            <div className="flex items-center gap-4">
              <img
                src="/brand/logo-icon-only.png"
                alt="Form├⌐ Haus"
                className="h-14 w-auto object-contain opacity-90"
              />
              <div>
                <h3 className="font-serif text-xl text-[#F0EAE6]">Form├⌐ Haus</h3>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#a87441]">Riyadh</p>
              </div>
            </div>

            {/* Brief Description */}
            <p className="text-[13px] leading-relaxed text-[#AA9B8F] max-w-xs">
              {t('footer.description', 'Luxury fashion destination in the heart of Saudi Arabia. Curating exceptional pieces for the discerning few.')}
            </p>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#8B8076] font-light">
                {t('footer.followUs')}
              </h3>
              <SocialButtons />
            </div>

            {/* Newsletter */}
            <div className="space-y-4 pt-4">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#8B8076] font-light">
                {t('footer.newsletter', 'Newsletter')}
              </h3>
              <Newsletter />
            </div>
          </div>

          {/* COL 2: Navigation Links */}
          <div className="lg:col-span-5">
            <FooterMenu menu={menu} />
          </div>

          {/* COL 3: App Download & Contact */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* App Coming Soon */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
              <span className="block text-[10px] uppercase tracking-widest text-[#a87441] mb-2">
                {t('footer.mobileApp')}
              </span>
              <span className="text-lg font-serif italic text-[#F0EAE6]/70 select-none">
                {t('footer.comingSoon')}
              </span>
            </div>

            {/* Quick Contact */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#8B8076]">
                {t('footer.contact', 'Contact')}
              </h4>
              <span className="flex items-center gap-3 text-[#AA9B8F]">
                <span className="text-sm">800 123 456</span>
              </span>
              <a
                href="mailto:care@formehaus.com"
                className="block text-sm text-[#AA9B8F] hover:text-[#a87441] transition-colors"
              >
                care@formehaus.com
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-[1920px] mx-auto my-12 h-[1px] bg-gradient-to-r from-transparent via-[#a87441]/20 to-transparent" />

        {/* Footer Bottom: Legal & Compliance */}
        <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-6 text-[11px] font-sans tracking-[0.08em] text-[#8B8076]">
          {/* Left: Copyright & Legal */}
          <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6">
            <span className="font-medium text-[#F0EAE6]/80">&copy; 2026 Form├⌐ Haus</span>
            <span className="hidden lg:block h-3 w-px bg-[#F0EAE6]/20" />
            <div className="flex items-center gap-2">
              <span className="text-[#AA9B8F]">{t('footer.crNo')}</span>
              <span className="font-mono font-medium text-[#F0EAE6]">
                7051891369
              </span>
            </div>
            <span className="hidden lg:block h-3 w-px bg-[#F0EAE6]/20" />
            <div className="flex items-center gap-2">
              <span className="text-[#AA9B8F]">{t('footer.vatNo')}</span>
              <span className="font-mono font-medium text-[#F0EAE6]">314271812300003</span>
            </div>
          </div>

          {/* Center: Legal Links */}
          <div className="flex items-center gap-6">
            <Link to="/policies/privacy-policy" className="hover:text-[#a87441] transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link to="/policies/terms-of-service" className="hover:text-[#a87441] transition-colors">
              {t('footer.terms')}
            </Link>
            <span className="text-[#8B8076]">
              {t('footer.vatCertificate')}
            </span>
          </div>

          {/* Right: Payment Methods */}
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-[#AA9B8F] tracking-wider">{t('footer.paymentMethods', 'Secure Payment')}</span>
            <PaymentBadges />
          </div>
        </div>

        {/* Bottom Brand Logo */}
        <div className="flex justify-center mt-16">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#a87441]/40 to-transparent" />
            <img
              src="/brand/logo-icon-only.png"
              alt="Form├⌐ Haus"
              className="h-8 w-auto object-contain opacity-50 hover:opacity-80 transition-opacity duration-500"
            />
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8B8076]/60">
              Saudi Arabia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ item }: { item: ChildEnhancedMenuItem }) {
  const linkClass = "text-[12px] text-[#AA9B8F] hover:text-[#a87441] transition-all duration-300 hover:translate-x-1 inline-block focus:outline-none focus-visible:text-[#a87441] focus-visible:underline underline-offset-4";

  if (item.to.startsWith('http')) {
    return (
      <a href={item.to} target={item.target} rel="noopener noreferrer" className={linkClass}>
        {item.title}
      </a>
    );
  }

  return (
    <Link to={item.to} target={item.target} prefetch="intent" className={linkClass}>
      {item.title}
    </Link>
  );
}

function FooterMenu({ menu }: { menu?: EnhancedMenu }) {
  // Filter out unwanted menu items like "Search"
  const filteredItems = (menu?.items || []).filter(
    (item) => item.title.toLowerCase() !== 'search'
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
      {filteredItems.map((item) => (
        <div key={item.id} className="space-y-4">
          <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#F0EAE6] font-medium">
            {item.title}
          </h4>
          {item?.items?.length > 0 ? (
            <nav className="grid gap-2.5">
              {item.items
                .filter((subItem) => subItem.title.toLowerCase() !== 'search')
                .map((subItem: ChildEnhancedMenuItem) => (
                  <FooterLink key={subItem.id} item={subItem} />
                ))}
            </nav>
          ) : null}
        </div>
      ))}

      {/* Static Links - Customer Care */}
      <div className="space-y-4">
        <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#F0EAE6] font-medium">
          Customer Care
        </h4>
        <nav className="grid gap-2.5">
          <Link to="/contact" className="text-[12px] text-[#AA9B8F] hover:text-[#a87441] transition-all duration-300 hover:translate-x-1 inline-block focus:outline-none focus-visible:text-[#a87441]">
            Contact Us
          </Link>
          <Link to="/pages/faqs" className="text-[12px] text-[#AA9B8F] hover:text-[#a87441] transition-all duration-300 hover:translate-x-1 inline-block focus:outline-none focus-visible:text-[#a87441]">
            FAQs
          </Link>
          <Link to="/pages/shipping-returns" className="text-[12px] text-[#AA9B8F] hover:text-[#a87441] transition-all duration-300 hover:translate-x-1 inline-block focus:outline-none focus-visible:text-[#a87441]">
            Shipping & Returns
          </Link>
          <Link to="/account/orders" className="text-[12px] text-[#AA9B8F] hover:text-[#a87441] transition-all duration-300 hover:translate-x-1 inline-block focus:outline-none focus-visible:text-[#a87441]">
            Track Order
          </Link>
        </nav>
      </div>

      {/* Static Links - About */}
      <div className="space-y-4">
        <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#F0EAE6] font-medium">
          About
        </h4>
        <nav className="grid gap-2.5">
          <Link to="/pages/about" className="text-[12px] text-[#AA9B8F] hover:text-[#a87441] transition-all duration-300 hover:translate-x-1 inline-block focus:outline-none focus-visible:text-[#a87441]">
            Our Story
          </Link>
          <Link to="/pages/sustainability" className="text-[12px] text-[#AA9B8F] hover:text-[#a87441] transition-all duration-300 hover:translate-x-1 inline-block focus:outline-none focus-visible:text-[#a87441]">
            Sustainability
          </Link>
          <Link to="/pages/stores" className="text-[12px] text-[#AA9B8F] hover:text-[#a87441] transition-all duration-300 hover:translate-x-1 inline-block focus:outline-none focus-visible:text-[#a87441]">
            Store Locator
          </Link>
          <Link to="/pages/careers" className="text-[12px] text-[#AA9B8F] hover:text-[#a87441] transition-all duration-300 hover:translate-x-1 inline-block focus:outline-none focus-visible:text-[#a87441]">
            Careers
          </Link>
        </nav>
      </div>
    </div>
  );
}
