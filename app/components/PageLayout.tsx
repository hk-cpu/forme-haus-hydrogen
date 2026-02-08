import { Await, useRouteLoaderData, useNavigation } from '@remix-run/react';
import { Disclosure } from '@headlessui/react';
import { Suspense, useEffect, useState } from 'react';
import { CartForm } from '@shopify/hydrogen';

import { type LayoutQuery } from 'storefrontapi.generated';
import { Text, Heading, Section } from '~/components/Text';
import { Link } from '~/components/Link';
import { Cart } from '~/components/Cart';
import { CartLoading } from '~/components/CartLoading';
import { Drawer, useDrawer } from '~/components/Drawer';
import { IconCaret } from '~/components/Icon';
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
import { PromoBanner } from '~/components/PromoBanner';
import { NavigationMenu } from '~/components/NavigationMenu';
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
  const navigation = useNavigation();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen relative bg-[#121212]">
        {/* Background Layer (Z-0) */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <Silk color="#AD9686" />
          <Atmosphere count={150} color="#AD9686" size={0.012} opacity={0.4} />
          {/* Dark Glass Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
        </div>

        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>

        <div className="relative z-10 flex flex-col items-center lg:py-8 transition-all duration-700">
          <div className="w-full max-w-[1800px] flex flex-col relative mx-auto my-0 px-4 md:px-8">
            <PromoBanner />

            <Header
              title={layout?.shop.name || 'Formé Haus'}
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
    <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8">
      {/* Top level menu items */}
      {(menu?.items || []).map((item) => (
        <span key={item.id} className="block">
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
            }
          >
            <Text as="span" size="copy">
              {item.title}
            </Text>
          </Link>
        </span>
      ))}

      {/* Account Link for Mobile */}
      <span className="block mt-4 pt-4 border-t border-primary/10">
        <Link to="/account" onClick={onClose} className="pb-1">
          <Text as="span" size="copy">
            Account / Sign In
          </Text>
        </Link>
      </span>
    </nav>
  );
}

function Footer({ menu }: { menu?: EnhancedMenu }) {
  const isHome = useIsHomePath();
  const { t } = useTranslation();

  return (
    <Section
      divider={isHome ? 'none' : 'top'}
      as="footer"
      role="contentinfo"
      className={`grid w-full py-20 px-6 md:px-12 lg:px-24 bg-[#F9F5F0] text-[#4A3C31] overflow-hidden rounded-b-[2rem] shadow-[0_20px_60px_-15px_rgba(255,255,255,0.3)]`}
    >
      {/* Centered Logo Icon at Top */}
      <div className="flex justify-center mb-16">
        <img
          src="/brand/logo-icon-only.png"
          alt="Formé Haus"
          className="h-12 md:h-16 w-auto object-contain opacity-70 hover:opacity-90 transition-opacity duration-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 w-full max-w-[1920px] mx-auto">
        {/* COL 1: Newsletter & Socials (Luxury Priority) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* Newsletter removed to avoid duplication with Homepage Luxury Form */}

          <div className="space-y-6">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#8B8076] font-light">
              {t('footer.followUs')}
            </h3>
            <SocialButtons />
          </div>
        </div>

        {/* COL 2: Navigation Links (Grid System) */}
        <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
          <FooterMenu menu={menu} />
        </div>

        {/* COL 3: App / Trust (Minimal) */}
        <div className="lg:col-span-2 flex flex-col gap-8 items-start lg:items-end text-right">
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-sm border border-[#8B8076]/10 text-center shadow-sm">
              <span className="block text-[10px] uppercase tracking-widest text-[#a87441] mb-2">
                {t('footer.mobileApp')}
              </span>
              <span className="text-xl font-serif italic text-[#8B8076] select-none">
                {t('footer.comingSoon')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom: Compliance & Legal */}
      <div className="mt-24 pt-10 border-t border-[#8B8076]/30 flex flex-col lg:flex-row justify-between items-center gap-8 text-[11px] font-sans tracking-[0.08em] uppercase text-[#3D352E]">
        {/* Left: CR & Legal */}
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <span className="font-semibold text-[#2C2419]">&copy; 2026 Formé Haus</span>
          <span className="hidden lg:block h-3 w-px bg-[#4A3C31]/30" />
          <div className="flex items-center gap-2">
            <span className="text-[#5A5046]">{t('footer.crNo')}</span>
            <a
              href="/compliance/cr-certificate.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono font-semibold text-[#2C2419] hover:text-[#a87441] transition-colors"
              title="View Commercial Registration Certificate"
            >
              7051891369
            </a>
          </div>
          <span className="hidden lg:block h-3 w-px bg-[#4A3C31]/30" />
          <div className="flex items-center gap-2">
            <span className="text-[#5A5046]">{t('footer.vatNo')}</span>
            <span className="font-mono font-semibold text-[#2C2419]">314271812300003</span>
          </div>
        </div>

        {/* Center: Trust Badges */}
        <div className="flex items-center gap-4">
          <a
            href="/compliance/vat-certificate.pdf"
            className="text-[#5A5046] hover:text-[#2C2419] transition-colors font-medium"
          >
            {t('footer.vatCertificate')}
          </a>
          <a
            href="/compliance/cr-certificate.pdf"
            className="text-[#5A5046] hover:text-[#2C2419] transition-colors font-medium"
          >
            {t('footer.crCertificate')}
          </a>
        </div>

        {/* Right: Payment Badges - Horizontal with labels */}
        <div className="flex flex-col items-center lg:items-end gap-3">
          <span className="text-[10px] text-[#5A5046] tracking-wider">{t('footer.paymentMethods', 'Secure Payment Methods')}</span>
          <PaymentBadges />
        </div>

        {/* Far Right: Arabic */}
        <div
          className="text-right flex flex-col lg:flex-row items-center gap-4"
          dir="rtl"
        >
          <span className="font-sans font-semibold text-[#2C2419]">
            س.ت: <span className="font-mono">٧٠٥١٨٩١٣٦٩</span>
          </span>
          <span className="hidden lg:block h-3 w-px bg-[#4A3C31]/30" />
          <span className="text-[#3D352E]">الرياض، المملكة العربية السعودية</span>
        </div>
      </div>
    </Section>
  );
}

function FooterLink({ item }: { item: ChildEnhancedMenuItem }) {
  if (item.to.startsWith('http')) {
    return (
      <a href={item.to} target={item.target} rel="noopener noreferrer">
        {item.title}
      </a>
    );
  }

  return (
    <Link to={item.to} target={item.target} prefetch="intent">
      {item.title}
    </Link>
  );
}

function FooterMenu({ menu }: { menu?: EnhancedMenu }) {
  const styles = {
    section: 'grid gap-4',
    nav: 'grid gap-2 pb-6',
  };

  // Filter out unwanted menu items like "Search"
  const filteredItems = (menu?.items || []).filter(
    (item) => item.title.toLowerCase() !== 'search'
  );

  return (
    <>
      {filteredItems.map((item) => (
        <section key={item.id} className={styles.section}>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="text-left md:cursor-default">
                  <Heading className="flex justify-between" size="lead" as="h3">
                    {item.title}
                    {item?.items?.length > 0 && (
                      <span className="md:hidden">
                        <IconCaret direction={open ? 'up' : 'down'} />
                      </span>
                    )}
                  </Heading>
                </Disclosure.Button>
                {item?.items?.length > 0 ? (
                  <div
                    className={`${open ? `max-h-48 h-fit` : `max-h-0 md:max-h-fit`
                      } overflow-hidden transition-all duration-300`}
                  >
                    <Suspense data-comment="This suspense fixes a hydration bug in Disclosure.Panel with static prop">
                      <Disclosure.Panel static>
                        <nav className={styles.nav}>
                          {item.items
                            .filter((subItem) => subItem.title.toLowerCase() !== 'search')
                            .map((subItem: ChildEnhancedMenuItem) => (
                              <FooterLink key={subItem.id} item={subItem} />
                            ))}
                        </nav>
                      </Disclosure.Panel>
                    </Suspense>
                  </div>
                ) : null}
              </>
            )}
          </Disclosure>
        </section>
      ))}
    </>
  );
}
