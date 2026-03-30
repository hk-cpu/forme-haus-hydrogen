import {type ReactNode, useEffect, useRef, useState, Suspense} from 'react';
import {
  Link,
  NavLink,
  Await,
  useRouteLoaderData,
  useLocation,
} from '@remix-run/react';

import type {RootLoader} from '~/root';
import type {EnhancedMenu} from '~/lib/utils';
import {useTranslation} from '~/hooks/useTranslation';

import LanguageSwitch from './LanguageSwitch';

const Icons = {
  Menu: ({className = ''}: {className?: string}) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
      <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
      <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
    </svg>
  ),
  Search: ({className = ''}: {className?: string}) => (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m21 21-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Bag: ({className = ''}: {className?: string}) => (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 6h12l1 15H5L6 6z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 6V5a3 3 0 0 1 6 0v1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  User: ({className = ''}: {className?: string}) => (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export function Header({
  title: _title,
  menu,
  openCart,
  openSearch,
  openMenu,
}: {
  title: string;
  menu?: EnhancedMenu;
  openCart: () => void;
  openSearch: () => void;
  openMenu: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const rootData = useRouteLoaderData<RootLoader>('root');
  const {t, isRTL} = useTranslation();
  const location = useLocation();

  const isCollectionPage = location.pathname.includes('/collections');

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 20);

      const delta = currentY - lastScrollY.current;
      if (delta > 10 && currentY > 100) {
        setIsVisible(false);
      } else if (delta < -10 || currentY < 40) {
        setIsVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultLinks = [
    {id: '1', title: t('nav.newIn', 'New to Haus'), to: '/collections/new-in'},
    {id: '2', title: t('nav.phoneCases', 'Phone Cases'), to: '/collections/phone-cases'},
    {id: '3', title: t('nav.sunglasses', 'Sunglasses'), to: '/collections/sunglasses'},
    {id: '4', title: t('nav.collections', 'Collections'), to: '/collections'},
    {id: '5', title: t('nav.journal', 'Journal'), to: '/journal'},
    {id: '6', title: t('nav.ourStory', 'Our Story'), to: '/pages/about'},
    {id: '7', title: t('nav.contact', 'Contact Us'), to: '/contact'},
  ];

  const baseItems = menu?.items?.length ? menu.items : defaultLinks;
  const hasContact = baseItems.some(
    (item: any) =>
      item.to === '/contact' ||
      item.url?.endsWith('/contact') ||
      item.title?.toLowerCase().includes('contact'),
  );
  const items = hasContact
    ? baseItems
    : [...baseItems, {id: 'contact', title: t('nav.contact', 'Contact Us'), to: '/contact'}];

  const headerClass = !scrolled
    ? 'bg-[#121212]/[0.85] py-4'
    : isCollectionPage
    ? 'bg-[#2a1d13]/[0.97] py-3 border-b border-[#a87441]/20 shadow-[0_2px_12px_rgba(0,0,0,0.15)]'
    : 'bg-[#121212]/[0.97] py-3 border-b border-[#a87441]/8 shadow-[0_2px_8px_rgba(0,0,0,0.06)]';

  return (
    <header
      role="banner"
      className={`fixed left-0 right-0 top-0 z-50 flex justify-center transition-all duration-300 ${headerClass} ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
      style={{
        WebkitBackdropFilter: scrolled ? 'blur(40px) saturate(1.2)' : 'blur(20px)',
        backdropFilter: scrolled ? 'blur(40px) saturate(1.2)' : 'blur(20px)',
      }}
    >
      <div className="relative z-50 mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <nav className="hidden items-center gap-4 md:flex lg:gap-8">
          {items.map((item: any) => {
            const to =
              item.title === 'CATALOG' || item.title === 'Catalog'
                ? '/collections'
                : item.title === 'ABOUT US' || item.title === 'About Us'
                ? '/pages/about'
                : item.to;
            const label =
              item.title === 'CATALOG' || item.title === 'Catalog'
                ? 'COLLECTIONS'
                : item.title === 'ABOUT US' || item.title === 'About Us'
                ? 'OUR STORY'
                : item.title;

            return (
              <NavLink
                key={item.id}
                to={to}
                className={({isActive}) =>
                  `relative py-2 text-[10px] font-light uppercase tracking-[0.25em] transition-colors duration-200 lg:text-[11px] ${
                    isActive ? 'text-[#a87441]' : 'text-[#F0EAE6]/80 hover:text-[#a87441]'
                  }`
                }
              >
                {label}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={openMenu}
            className="flex flex-col items-center p-2 text-[#F0EAE6]/80 transition-colors duration-200 hover:text-[#a87441]"
            aria-label={t('nav.menu', 'Menu')}
            type="button"
          >
            <Icons.Menu />
            <span className="mt-1 text-[10px] uppercase tracking-wider text-[#F0EAE6]/60">
              {t('nav.menu', 'Menu')}
            </span>
          </button>
          <LanguageSwitch />
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link to="/" className="block">
            <img
              src="/brand/logo-icon-only-opt.webp"
              alt="Forme Haus"
              className="h-8 w-8 object-contain opacity-90 transition-opacity duration-200 hover:opacity-100 md:h-10 md:w-10"
              fetchPriority="high"
              loading="eager"
              width={128}
              height={127}
              decoding="async"
            />
          </Link>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="mr-1 hidden md:flex">
            <LanguageSwitch />
          </div>

          <IconButton onClick={openSearch} label={t('nav.search', 'Search')}>
            <Icons.Search />
          </IconButton>

          <CartBagButton openCart={openCart} rootData={rootData} t={t} isRTL={isRTL} />

          <div className="hidden md:block">
            <Link
              to="/account"
              className="flex flex-col items-center p-2 text-[#F0EAE6]/70 transition-colors duration-200 hover:text-[#a87441]"
              aria-label={t('nav.account', 'Account')}
              title={t('nav.account', 'Account')}
            >
              <Icons.User />
              <span className="mt-1 hidden text-[10px] uppercase tracking-wider text-[#F0EAE6]/60 lg:block">
                {t('nav.account', 'Account')}
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div
        className={`absolute bottom-0 h-[2px] w-full bg-gradient-to-r from-[#a87441] to-[#d4af87] transition-transform duration-300 ${
          isRTL ? 'origin-right' : 'origin-left'
        } ${scrolled ? 'scale-x-100' : 'scale-x-0'}`}
      />
    </header>
  );
}

function IconButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center p-2 text-[#F0EAE6]/70 transition-colors duration-200 hover:text-[#a87441]"
      aria-label={label}
      title={label}
      type="button"
    >
      {children}
      <span className="mt-1 hidden text-[10px] uppercase tracking-wider text-[#F0EAE6]/60 lg:block">
        {label}
      </span>
    </button>
  );
}

function CartBagButton({
  openCart,
  rootData,
  t,
  isRTL,
}: {
  openCart: () => void;
  rootData: ReturnType<typeof useRouteLoaderData<RootLoader>>;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
}) {
  const [showEmptyHint, setShowEmptyHint] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleEmptyClick() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowEmptyHint(true);
    timerRef.current = setTimeout(() => setShowEmptyHint(false), 1800);
  }

  return (
    <Suspense fallback={<IconButton onClick={openCart} label={t('nav.cart', 'Bag')}><Icons.Bag /></IconButton>}>
      <Await resolve={rootData?.cart}>
        {(cart: any) => {
          const isEmpty = !cart?.totalQuantity;
          return (
            <button
              onClick={isEmpty ? handleEmptyClick : openCart}
              className="relative flex flex-col items-center p-2 text-[#F0EAE6]/70 transition-colors duration-200 hover:text-[#a87441]"
              aria-label={t('nav.cart', 'Bag')}
              title={t('nav.cart', 'Bag')}
              type="button"
            >
              <Icons.Bag />
              <span className="mt-1 hidden text-[10px] uppercase tracking-wider text-[#F0EAE6]/60 lg:block">
                {t('nav.cart', 'Bag')}
              </span>

              {cart?.totalQuantity ? (
                <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-[#a87441] to-[#8B5E3C] text-[10px] font-medium text-white shadow-lg lg:right-2">
                  {cart.totalQuantity > 9 ? '9+' : cart.totalQuantity}
                </span>
              ) : null}

              {showEmptyHint ? (
                <span
                  className={`pointer-events-none absolute top-full z-[400] mt-3 w-56 rounded-xl border border-[#a87441]/25 bg-[#1A1A1A] p-4 text-left shadow-2xl shadow-black/60 ${
                    isRTL ? 'left-0' : 'right-0'
                  }`}
                >
                  <span className="block text-[13px] font-medium leading-snug text-[#F0EAE6]">
                    {t('cart.empty', 'Your bag is empty')}
                  </span>
                  <span className="mt-1 block text-[11px] leading-relaxed text-[#6B6058]">
                    {t(
                      'cart.emptyStats',
                      "Looks like you haven't added anything yet, let's get you started!",
                    )}
                  </span>
                </span>
              ) : null}
            </button>
          );
        }}
      </Await>
    </Suspense>
  );
}
