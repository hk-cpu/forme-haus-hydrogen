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
import {stripLocalePathPrefix} from '~/lib/utils';
import {useTranslation} from '~/hooks/useTranslation';

import LanguageSwitch from './LanguageSwitch';

function DropdownNavItem({
  item,
  isRTL,
  t,
}: {
  item: any;
  isRTL: boolean;
  t: any;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative group h-full flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        className={`nav-link relative py-2 flex items-center gap-1.5 transition-colors duration-200 ${
          isRTL
            ? 'text-[12px] font-normal'
            : 'text-[10px] font-light uppercase tracking-[0.25em] lg:text-[11px]'
        } text-warm/80 hover:text-bronze`}
      >
        {item.title}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={`transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-bronze' : ''
          }`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        className={`absolute top-[calc(100%-10px)] pt-[10px] ${
          isRTL ? 'right-0' : 'left-0'
        } transition-all duration-300 ${
          isOpen
            ? 'opacity-100 translate-y-0 visible'
            : 'opacity-0 translate-y-2 invisible'
        }`}
      >
        <div className="bg-surface/95 backdrop-blur-xl border border-bronze/20 rounded-sm py-3 w-56 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
          {item.items.map((sub: any) => (
            <NavLink
              key={sub.id}
              to={sub.to || sub.url}
              onClick={() => setIsOpen(false)}
              className={({isActive}) =>
                `block px-5 py-3 transition-colors duration-200 ${
                  isRTL
                    ? 'text-[12px] font-normal'
                    : 'text-[10px] font-light uppercase tracking-[0.2em]'
                } ${
                  isActive
                    ? 'text-bronze bg-bronze/5'
                    : 'text-warm/80 hover:text-bronze hover:bg-bronze/5'
                }`
              }
            >
              {sub.title}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

const Icons = {
  Menu: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
      <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
      <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
    </svg>
  ),
  Search: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle
        cx="11"
        cy="11"
        r="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m21 21-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Bag: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M6 6h12l1 15H5L6 6z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 6V5a3 3 0 0 1 6 0v1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  User: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="7"
        r="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
    {id: '4', title: t('nav.collections', 'Collections'), to: '/collections'},
    {id: '5', title: t('nav.journal', 'Journal'), to: '/journal'},
    {id: '6', title: t('nav.ourStory', 'Our Story'), to: '/pages/about'},
    {id: '7', title: t('nav.contact', 'Contact Us'), to: '/contact'},
  ];

  const baseItems = menu?.items?.length ? menu.items : defaultLinks;
  const normalizeMenuPath = (value?: string) => {
    if (!value) return '';
    try {
      const pathname = value.startsWith('http')
        ? new URL(value).pathname
        : value;
      return stripLocalePathPrefix(pathname).replace(/\/$/, '') || '/';
    } catch {
      return stripLocalePathPrefix(value).replace(/\/$/, '') || '/';
    }
  };

  const mapMenuItem = (item: any) => {
    const normalizedTo = normalizeMenuPath(item.to ?? item.url);

    const isCollectionsNode =
      item.title === 'CATALOG' ||
      item.title === 'Catalog' ||
      item.title === 'Collections' ||
      item.title === t('nav.collections', 'Collections') ||
      normalizedTo === '/collections/all' ||
      normalizedTo === '/collections';

    if (isCollectionsNode) {
      return {
        ...item,
        to: '#', // Remove individual redirect
        title: t('nav.collections', 'Collections'),
        items: item.items?.length
          ? item.items
          : [
              {
                id: 'sub-new',
                title: t('nav.newIn', 'New to Haus'),
                to: '/collections/new-in',
              },
              {
                id: 'sub-sun',
                title: t('nav.sunglasses', 'Sunglasses'),
                to: '/collections/sunglasses',
              },
              {
                id: 'sub-phone',
                title: t('nav.phoneCases', 'Phone Accessories'),
                to: '/collections/phone-cases',
              },
              {
                id: 'sub-all',
                title: t('nav.viewAll', 'View All Collections'),
                to: '/collections',
              },
            ],
      };
    }



    if (item.title?.toLowerCase() === 'home') {
      return {
        ...item,
        to: '/',
        title: item.title,
      };
    }

    if (
      item.title === 'ABOUT US' ||
      item.title === 'About Us' ||
      item.title === 'Our Story' ||
      item.title === 'OUR STORY' ||
      normalizedTo === '/pages/about' ||
      normalizedTo === '/pages/our-story'
    ) {
      return {
        ...item,
        to: '/pages/about',
        title: t('nav.ourStory', 'Our Story'),
      };
    }

    if (
      normalizedTo === '/contact' ||
      normalizedTo === '/pages/contact' ||
      item.title?.toLowerCase() === 'contact us' ||
      item.title?.toLowerCase() === 'contact'
    ) {
      return {...item, to: '/contact', title: t('nav.contact', 'Contact Us')};
    }

    return {...item, to: item.to ?? item.url};
  };

  const hasContact = baseItems.some((item: any) => {
    const normalizedTo = normalizeMenuPath(item.to ?? item.url);
    return (
      normalizedTo === '/contact' ||
      item.title?.toLowerCase().includes('contact')
    );
  });
  const items = hasContact
    ? baseItems.map(mapMenuItem)
    : [
        ...baseItems.map(mapMenuItem),
        {id: 'contact', title: t('nav.contact', 'Contact Us'), to: '/contact'},
      ];

  const headerClass = !scrolled
    ? 'bg-[#121212]/[0.85] py-4'
    : isCollectionPage
    ? 'bg-[#2a1d13]/[0.97] py-3 border-b border-[#a87441]/20 shadow-[0_2px_12px_rgba(0,0,0,0.15)]'
    : 'bg-[#121212]/[0.97] py-3 border-b border-[#a87441]/8 shadow-[0_2px_8px_rgba(0,0,0,0.06)]';

  return (
    <header
      role="banner"
      className={`fixed inset-x-0 top-0 z-50 w-full flex justify-center transition-all duration-300 ${headerClass} ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
      style={{
        WebkitBackdropFilter: scrolled
          ? 'blur(40px) saturate(1.2)'
          : 'blur(20px)',
        backdropFilter: scrolled ? 'blur(40px) saturate(1.2)' : 'blur(20px)',
      }}
    >
      <div
        className="relative z-50 flex w-full items-center"
        style={{padding: '0 var(--page-gutter)'}}
      >
        {/* Left Side: Navigation & Mobile Menu */}
        <div className="flex flex-1 items-center justify-start">
          <nav className="hidden items-center gap-4 md:flex lg:gap-8">
            {items.map((item: any) => {
              if (item.items?.length) {
                return (
                  <DropdownNavItem
                    key={item.id}
                    item={item}
                    isRTL={isRTL}
                    t={t}
                  />
                );
              }
              return (
                <NavLink
                  key={item.id}
                  to={item.to}
                  className={({isActive}) =>
                    `nav-link relative py-2 transition-colors duration-200 ${
                      isRTL
                        ? 'text-[12px] font-normal'
                        : 'text-[10px] font-light uppercase tracking-[0.25em] lg:text-[11px]'
                    } ${
                      isActive
                        ? 'text-[#a87441]'
                        : 'text-warm/80 hover:text-bronze'
                    }`
                  }
                >
                  {item.title}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={openMenu}
              className="flex flex-col items-center p-2 text-warm/80 transition-colors duration-200 hover:text-bronze"
              aria-label={t('nav.menu', 'Menu')}
              type="button"
            >
              <Icons.Menu />
              <span className="mt-1 text-[10px] uppercase tracking-wider text-warm/60">
                {t('nav.menu', 'Menu')}
              </span>
            </button>
            <LanguageSwitch />
          </div>
        </div>

        {/* Center: Logo */}
        <div className="flex shrink-0 items-center justify-center pointer-events-auto">
          <Link to="/" className="block">
            <img
              src="/brand/logo-icon-only-opt.webp"
              alt="Forme Haus"
              className="h-8 w-8 object-contain opacity-90 transition-opacity duration-200 hover:opacity-100 md:h-10 md:w-10"
              fetchpriority="high"
              loading="eager"
              width={128}
              height={127}
              decoding="async"
            />
          </Link>
        </div>

        {/* Right Side: Account, Cart, Search, Language */}
        <div className="flex flex-1 items-center justify-end gap-3 md:gap-4">
          <div className="mr-1 hidden md:flex">
            <LanguageSwitch />
          </div>

          <IconButton onClick={openSearch} label={t('nav.search', 'Search')}>
            <Icons.Search />
          </IconButton>

          <CartBagButton
            openCart={openCart}
            rootData={rootData}
            t={t}
            isRTL={isRTL}
          />

          <div className="hidden md:block">
            <Link
              to="/account"
              className="flex flex-col items-center p-2 text-warm/70 transition-colors duration-200 hover:text-bronze"
              aria-label={t('nav.account', 'Account')}
              title={t('nav.account', 'Account')}
            >
              <Icons.User />
              <span className="mt-1 hidden text-[10px] uppercase tracking-wider text-warm/60 lg:block">
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
      className="flex flex-col items-center p-2 text-warm/70 transition-colors duration-200 hover:text-bronze"
      aria-label={label}
      title={label}
      type="button"
    >
      {children}
      <span className="mt-1 hidden text-[10px] uppercase tracking-wider text-warm/60 lg:block">
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
  const prevQtyRef = useRef<number>(0);
  const [bounce, setBounce] = useState(false);

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
    <Suspense
      fallback={
        <IconButton onClick={openCart} label={t('nav.cart', 'Bag')}>
          <Icons.Bag />
        </IconButton>
      }
    >
      <Await resolve={rootData?.cart}>
        {(cart: any) => (
          <CartBagInner
            cart={cart}
            t={t}
            isRTL={isRTL}
            openCart={openCart}
            handleEmptyClick={handleEmptyClick}
            bounce={bounce}
            setBounce={setBounce}
            prevQtyRef={prevQtyRef}
            showEmptyHint={showEmptyHint}
          />
        )}
      </Await>
    </Suspense>
  );
}

function CartBagInner({
  cart,
  t,
  isRTL,
  openCart,
  handleEmptyClick,
  bounce,
  setBounce,
  prevQtyRef,
  showEmptyHint,
}: {
  cart: any;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
  openCart: () => void;
  handleEmptyClick: () => void;
  bounce: boolean;
  setBounce: (b: boolean) => void;
  prevQtyRef: React.MutableRefObject<number>;
  showEmptyHint: boolean;
}) {
  const isEmpty = !cart?.totalQuantity;
  useEffect(() => {
    const qty = cart?.totalQuantity || 0;
    if (qty > prevQtyRef.current) {
      setBounce(true);
      const id = setTimeout(() => setBounce(false), 400);
      return () => clearTimeout(id);
    }
    prevQtyRef.current = qty;
  }, [cart?.totalQuantity, prevQtyRef, setBounce]);

  return (
    <button
      onClick={isEmpty ? handleEmptyClick : openCart}
      className="relative flex flex-col items-center p-2 text-warm/70 transition-colors duration-200 hover:text-bronze"
      aria-label={t('nav.cart', 'Bag')}
      title={t('nav.cart', 'Bag')}
      type="button"
    >
      <span className={bounce ? 'cart-bounce' : ''}>
        <Icons.Bag />
      </span>
      <span className="mt-1 hidden text-[10px] uppercase tracking-wider text-warm/60 lg:block">
        {t('nav.cart', 'Bag')}
      </span>

      {cart?.totalQuantity ? (
        <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-[#a87441] to-[#8B5E3C] text-[10px] font-medium text-white shadow-lg lg:right-2">
          {cart.totalQuantity > 9 ? '9+' : cart.totalQuantity}
        </span>
      ) : null}

      {showEmptyHint ? (
        <span
          className={`pointer-events-none absolute top-full z-[400] mt-3 w-56 rounded-xl border border-bronze/25 bg-surface p-4 text-left shadow-2xl shadow-black/60 ${
            isRTL ? 'left-0' : 'right-0'
          }`}
        >
          <span className="block text-[13px] font-medium leading-snug text-warm">
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
}
