import { useParams, Form, Await, useRouteLoaderData } from '@remix-run/react';
import useWindowScroll from 'react-use/esm/useWindowScroll';
import { Disclosure } from '@headlessui/react';
import { Suspense, useEffect, useMemo } from 'react';
import { CartForm, type CartReturn } from '@shopify/hydrogen';

import { type LayoutQuery } from 'storefrontapi.generated';
import { Text, Heading, Section } from '~/components/Text';
import { Link } from '~/components/Link';
import { Cart } from '~/components/Cart';
import { CartLoading } from '~/components/CartLoading';
import { Input } from '~/components/Input';
import { Drawer, useDrawer } from '~/components/Drawer';
import { CountrySelector } from '~/components/CountrySelector';
import {
  IconMenu,
  IconCaret,
  IconLogin,
  IconAccount,
  IconBag,
  IconSearch,
} from '~/components/Icon';
import {
  type EnhancedMenu,
  type ChildEnhancedMenuItem,
  useIsHomePath,
} from '~/lib/utils';
import { useIsHydrated } from '~/hooks/useIsHydrated';
import { useCartFetchers } from '~/hooks/useCartFetchers';
import type { RootLoader } from '~/root';
import { Header as FormeHeader } from '~/components/Header';
import { StatusBanner } from '~/components/StatusBanner';
import Silk from '~/components/Silk';
import Atmosphere from '~/components/Atmosphere';
import { PredictiveSearch } from '~/components/PredictiveSearch';

type LayoutProps = {
  children: React.ReactNode;
  layout?: LayoutQuery & {
    headerMenu?: EnhancedMenu | null;
    footerMenu?: EnhancedMenu | null;
  };
};

export function PageLayout({ children, layout }: LayoutProps) {
  const { headerMenu, footerMenu } = layout || {};
  return (
    <>
      <div className="flex flex-col min-h-screen relative bg-[#121212]">
        {/* Background Layer (Z-0) */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <Silk color="#C4A484" />
          <Atmosphere count={150} color="#C4A484" size={0.012} opacity={0.4} />
          {/* Dark Glass Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
        </div>

        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>

        <div className="relative z-10 flex flex-col">
          <StatusBanner />
          {headerMenu && layout?.shop.name && (
            <Header title={layout.shop.name} menu={headerMenu} />
          )}
          <main role="main" id="mainContent" className="flex-grow">
            {children}
          </main>
          <Footer menu={footerMenu || undefined} />
        </div>
      </div>
    </>
  );
}

function Header({ title, menu }: { title: string; menu?: EnhancedMenu }) {
  const isHome = useIsHomePath();

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

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      <SearchDrawer isOpen={isSearchOpen} onClose={closeSearch} />
      {menu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
      )}
      <FormeHeader title={title} menu={menu} openCart={openCart} openSearch={openSearch} />
    </>
  );
}

function SearchDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
    </nav>
  );
}

function MobileHeader({
  title,
  isHome,
  openCart,
  openMenu,
}: {
  title: string;
  isHome: boolean;
  openCart: () => void;
  openMenu: () => void;
}) {
  // useHeaderStyleFix(containerStyle, setContainerStyle, isHome);

  const params = useParams();

  return (
    <header
      role="banner"
      className={`${isHome
        ? 'bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader'
        : 'bg-contrast/80 text-primary'
        } flex lg:hidden items-center h-nav sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 px-4 md:px-8`}
    >
      <div className="flex items-center justify-start w-full gap-4">
        <button
          onClick={openMenu}
          className="relative flex items-center justify-center w-8 h-8"
        >
          <IconMenu />
        </button>
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="items-center gap-2 sm:flex"
        >
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8"
          >
            <IconSearch />
          </button>
          <Input
            className={
              isHome
                ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                : 'focus:border-primary/20'
            }
            type="search"
            variant="minisearch"
            placeholder="Search"
            name="q"
          />
        </Form>
      </div>

      <Link
        className="flex items-center self-stretch leading-[3rem] md:leading-[4rem] justify-center flex-grow w-full h-full"
        to="/"
      >
        <Heading
          className="font-bold text-center leading-none"
          as={isHome ? 'h1' : 'h2'}
        >
          {title}
        </Heading>
      </Link>

      <div className="flex items-center justify-end w-full gap-4">
        <AccountLink className="relative flex items-center justify-center w-8 h-8" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}

function DesktopHeader({
  isHome,
  menu,
  openCart,
  title,
}: {
  isHome: boolean;
  openCart: () => void;
  menu?: EnhancedMenu;
  title: string;
}) {
  const params = useParams();
  const { y } = useWindowScroll();
  return (
    <header
      role="banner"
      className={`${isHome
        ? 'bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader'
        : 'bg-contrast/80 text-primary'
        } ${!isHome && y > 50 && ' shadow-lightHeader'
        } hidden h-nav lg:flex items-center sticky transition duration-300 backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-8 px-12 py-8`}
    >
      <div className="flex gap-12">
        <Link className="font-bold" to="/" prefetch="intent">
          {title}
        </Link>
        <nav className="flex gap-8">
          {/* Top level menu items */}
          {(menu?.items || []).map((item) => (
            <Link
              key={item.id}
              to={item.to}
              target={item.target}
              prefetch="intent"
              className={({ isActive }) =>
                isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
              }
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-1">
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="flex items-center gap-2"
        >
          <Input
            className={
              isHome
                ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                : 'focus:border-primary/20'
            }
            type="search"
            variant="minisearch"
            placeholder="Search"
            name="q"
          />
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
          >
            <IconSearch />
          </button>
        </Form>
        <AccountLink className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}

function AccountLink({ className }: { className?: string }) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const isLoggedIn = rootData?.isLoggedIn;

  return (
    <Link to="/account" className={className}>
      <Suspense fallback={<IconLogin />}>
        <Await resolve={isLoggedIn} errorElement={<IconLogin />}>
          {(isLoggedIn) => (isLoggedIn ? <IconAccount /> : <IconLogin />)}
        </Await>
      </Suspense>
    </Link>
  );
}

function CartCount({
  isHome,
  openCart,
}: {
  isHome: boolean;
  openCart: () => void;
}) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  if (!rootData) return null;

  return (
    <Suspense fallback={<Badge count={0} dark={isHome} openCart={openCart} />}>
      <Await resolve={rootData?.cart}>
        {(cart: CartReturn | null) => (
          <Badge
            dark={isHome}
            openCart={openCart}
            count={cart?.totalQuantity || 0}
          />
        )}
      </Await>
    </Suspense>
  );
}

function Badge({
  openCart,
  dark,
  count,
}: {
  count: number;
  dark: boolean;
  openCart: () => void;
}) {
  const isHydrated = useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        <IconBag />
        <div
          className={`${dark
            ? 'text-primary bg-contrast dark:text-contrast dark:bg-primary'
            : 'text-contrast bg-primary'
            } absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
        >
          <span>{count || 0}</span>
        </div>
      </>
    ),
    [count, dark],
  );

  return isHydrated ? (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to="/cart"
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </Link>
  );
}

function Footer({ menu }: { menu?: EnhancedMenu }) {
  const isHome = useIsHomePath();
  const itemsCount = menu
    ? menu?.items?.length + 1 > 4
      ? 4
      : menu?.items?.length + 1
    : 1;

  return (
    <Section
      divider={isHome ? 'none' : 'top'}
      as="footer"
      role="contentinfo"
      className={`grid min-h-[25rem] items-start grid-flow-row w-full gap-6 py-8 px-6 md:px-8 lg:px-12 md:gap-8 lg:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-${itemsCount}
        bg-primary dark:bg-contrast dark:text-primary text-contrast overflow-hidden`}
    >
      <FooterMenu menu={menu} />
      <CountrySelector />
      <div className={`col-span-1 md:col-span-2 lg:col-span-${itemsCount} border-t border-primary/10 dark:border-contrast/10 pt-8 mt-4`}>
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-6 text-sm opacity-80">

          {/* English Details */}
          <div className="text-center lg:text-left space-y-1">
            <p>&copy; 2026 Formé Haus</p>
            <p>Commercial Registration No. <span className="font-mono">1010XXXXXX</span></p>
            <p>Riyadh, Saudi Arabia</p>
          </div>

          {/* Verification & Payments */}
          <div className="flex flex-col items-center gap-4">
            {/* Payment Methods */}
            <div className="flex gap-3 opacity-90 grayscale hover:grayscale-0 transition-all duration-300">
              {/* Mada */}
              <div className="h-8 w-12 bg-white rounded flex items-center justify-center p-1" aria-label="Mada">
                <svg viewBox="0 0 38 12" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.4 4.8C12.4 4.3 12.6 4 13.2 4H15.6C16.1 4 16.4 4.2 16.4 4.8V8.3C16.4 8.8 16.1 9 15.6 9H13.2C12.7 9 12.4 8.7 12.4 8.3V4.8Z" fill="#004E74" />
                  <path d="M20.2 4.8C20.2 4.3 20.4 4 21 4H23.4C23.9 4 24.2 4.2 24.2 4.8V8.3C24.2 8.8 23.9 9 23.4 9H21C20.5 9 20.2 8.7 20.2 8.3V4.8Z" fill="#004E74" />
                  <path d="M3.8 0H1.2C0.5 0 0 0.5 0 1.2V7.1C0 7.8 0.5 8.3 1.2 8.3H3.8C4.5 8.3 5 7.8 5 7.1V1.2C5 0.5 4.5 0 3.8 0Z" fill="#004E74" />
                  <path d="M34.2 0H36.8C37.5 0 38 0.5 38 1.2V7.1C38 7.8 37.5 8.3 36.8 8.3H34.2C33.5 8.3 33 7.8 33 7.1V1.2C33 0.5 33.5 0 34.2 0Z" fill="#004E74" />
                  <path d="M7 4H9V9H7V4Z" fill="#004E74" />
                  <path d="M28 4H30V9H28V4Z" fill="#004E74" />
                </svg>
              </div>

              {/* Apple Pay */}
              <div className="h-8 w-12 bg-white rounded flex items-center justify-center p-1" aria-label="Apple Pay">
                <svg viewBox="0 0 38 16" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.4 12.9V6.4H18.2C19.7 6.4 20.6 7.4 20.6 8.7V8.8C20.6 9 20.6 9.3 20.5 9.4L22.2 12.9H20.3L18.8 9.9H17.8V12.9H16.4ZM17.8 7.5V8.9H18.2C18.6 8.9 19.1 8.8 19.1 8.2V8.2C19.1 7.6 18.6 7.5 18.2 7.5H17.8ZM23.4 12.9V6.4H24.8V12.9H23.4ZM23.3 4.9C23.3 4.5 23.6 4.3 24.1 4.3C24.5 4.3 24.8 4.5 24.8 4.9C24.8 5.4 24.5 5.6 24.1 5.6C23.6 5.6 23.3 5.4 23.3 4.9ZM29.4 13.9C28.2 13.9 27.6 13.3 27.6 12.3V8.8H26.5V7.7H27.6V6.7L29 6.2V7.7H30.4V8.8H29V12.2C29 12.6 29.2 12.8 29.8 12.8C29.9 12.8 30.1 12.8 30.3 12.7V13.8C30.1 13.9 29.8 13.9 29.4 13.9ZM34.9 8.9V9L34.2 7.7H35.6V12.9C35.6 14.7 34.6 15.6 33.1 15.6C32.4 15.6 31.8 15.5 31.4 15.2L31.7 14.2C32.1 14.4 32.5 14.5 32.9 14.5C33.6 14.5 34.1 14.2 34.1 13.3V13L32.2 7.7H33.7L34.9 8.9Z" fill="black" />
                  <path d="M11.6 4.9C11.5 5.7 11 6.3 10.4 6.7C9.8 7.1 9.1 7.2 8.3 7.1C8.4 6.3 8.8 5.6 9.4 5.2C10 4.8 10.8 4.6 11.5 4.8C11.5 4.8 11.5 4.8 11.6 4.9ZM11.1 7C10.5 7 9.9 7.2 9.4 7.5C9.4 7.2 9.5 7.1 9.5 7C10.1 6.9 10.7 6.6 11.1 6.1C11.4 5.6 11.6 5 11.4 4.3C10.6 4.4 9.9 4.7 9.4 5.3C8.8 5.8 8.5 6.4 8.6 7.1C8.6 8.2 9.4 9 10.6 9C12.3 9 13.1 7.4 13.1 7.4C12.5 7.8 11.8 8 11.1 7Z" fill="black" />
                  <path d="M5.5 7.4C5.5 7.7 5.7 7.9 6.2 8C6.9 8.2 7.6 8.3 7.6 8.9C7.6 9.4 7.1 9.7 6.4 9.7C5.6 9.7 5 9.4 4.5 9L4.1 10C4.7 10.5 5.5 10.8 6.4 10.8C8 10.8 9.1 10.1 9.1 8.7C9.1 7.5 8.2 7.1 7.2 6.8C6.5 6.6 6.1 6.6 6.1 6.2C6.1 5.9 6.4 5.6 7.1 5.6C7.7 5.6 8.3 5.9 8.7 6.2L9.1 5.2C8.5 4.8 7.8 4.6 7 4.6C5.5 4.6 4.6 5.4 4.6 6.6C4.6 7 4.7 7.2 5.5 7.4ZM1.8 10.7L0.5 4.7H1.9L2.5 8L3.2 4.7H4.6L2.6 12.9H1.2L1.8 10.7Z" fill="black" />
                </svg>
              </div>

              {/* Visa */}
              <div className="h-8 w-12 bg-white rounded flex items-center justify-center p-1" aria-label="Visa">
                <svg viewBox="0 0 38 12" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.6 11H12.3L13.8 1.5H16.1L14.6 11ZM25.3 10.8C24.9 11 24.3 11 23.7 11C21.3 11 19.6 9.8 19.6 7.4C19.6 5.4 21.4 3.2 23.9 3.2C24.7 3.2 25.1 3.3 25.4 3.5L25 4.5C24.8 4.4 24.4 4.3 23.8 4.3C22.3 4.3 21.3 5.3 21.3 6.9C21.3 8.3 22.1 9.1 23.2 9.1C23.8 9.1 24.3 8.9 24.7 8.7L25.3 10.8ZM33.3 11H31.1L30.9 9.8C30.4 10.7 29.6 11 28.6 11C27 11 25.8 9.8 25.8 8.4C25.8 6.5 27.5 3.2 31.8 3.1L31.9 3C31.9 2.1 31.3 1.3 29.9 1.3C29.2 1.3 28.5 1.5 27.9 1.8L27.4 0.8C28.2 0.4 29.3 0.2 30.5 0.2C33.2 0.2 33.6 2 33.6 4.6V11H33.3ZM31.6 4.2C29.3 4.3 27.6 5.7 27.6 7.4C27.6 8.1 28 8.9 28.8 8.9C29.5 8.9 30.1 8.5 30.4 7.8L31.6 4.2ZM12 11H9.8L8.7 5.1C8.6 4.6 8.5 4.4 8.3 3.9C7.8 2.7 6.1 1.8 5.1 1.6L5.2 1.1H9.1C9.8 1.1 10.4 1.5 10.5 2.5L12 11ZM4 11H0L2.8 1.5H6.8L4 11Z" fill="#1A1F71" />
                </svg>
              </div>

              {/* STC Pay */}
              <div className="h-8 w-12 bg-[#4F008C] rounded flex items-center justify-center p-1" aria-label="STC Pay">
                <svg viewBox="0 0 38 12" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.5 6.1C9.5 4.3 10.8 3.2 12.6 3.2C13.8 3.2 14.5 3.6 14.9 4.1L14.1 5.2C13.8 4.8 13.3 4.5 12.6 4.5C11.6 4.5 11 5.1 11 6.1C11 7 11.6 7.6 12.6 7.6C13.3 7.6 13.8 7.4 14.1 7.1L14.9 8.2C14.5 8.6 13.8 9 12.6 9C10.8 9 9.5 7.8 9.5 6.1ZM15.8 6.1C15.8 4.3 17.1 3.2 18.9 3.2C20.1 3.2 20.8 3.6 21.2 4.1L20.4 5.2C20.1 4.8 19.6 4.5 18.9 4.5C17.9 4.5 17.3 5.1 17.3 6.1C17.3 7 17.9 7.6 18.9 7.6C19.6 7.6 20.1 7.4 20.4 7.1L21.2 8.2C20.8 8.6 20.1 9 18.9 9C17.1 9 15.8 7.8 15.8 6.1ZM7.7 8.8H6.3L5.4 4.5L3.8 8.8H2.4L0 2.2H1.5L2.9 7.2L4.6 2.2H6.1L7.7 2.2L7.7 8.8ZM25.3 8.8H23.9V3.4H22.1V2.2H27.1V3.4H25.3V8.8Z" fill="white" />
                </svg>
              </div>
            </div>

            {/* Maroof / Business Platform Placeholder */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-24 bg-white/10 border border-white/20 rounded flex items-center justify-center text-xs">
                Maroof
              </div>
            </div>
          </div>

          {/* Arabic Details */}
          <div className="text-center lg:text-right space-y-1" dir="rtl">
            <p>&copy; ٢٠٢٦ فورمي هاوس</p>
            <p>رقم السجل التجاري: <span className="font-mono">١٠١٠XXXXXX</span></p>
            <p>الرياض، المملكة العربية السعودية</p>
          </div>

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

  return (
    <>
      {(menu?.items || []).map((item) => (
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
                          {item.items.map((subItem: ChildEnhancedMenuItem) => (
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
