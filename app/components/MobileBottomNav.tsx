import {Await, useRouteLoaderData, useLocation} from '@remix-run/react';
import {Suspense} from 'react';

import {Link} from '~/components/Link';
import {useUI} from '~/context/UIContext';
import {useTranslation} from '~/hooks/useTranslation';
import type {RootLoader} from '~/root';

/**
 * Fixed bottom navigation bar — visible only on mobile (hidden md+).
 * Critical for Saudi/GCC market where 85%+ traffic is mobile.
 *
 * Tabs: Home · Search · Categories · Wishlist · Cart · Account
 */
export function MobileBottomNav() {
  const {state, toggleSearch, toggleCart, toggleLogin} = useUI();
  const {t, isRTL} = useTranslation();
  const rootData = useRouteLoaderData<RootLoader>('root');
  const location = useLocation();

  const isActive = (path: string) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);

  // Don't render on overlay-heavy pages where the bottom bar is disruptive
  const hideOnPaths = ['/checkout'];
  if (hideOnPaths.some((p) => location.pathname.startsWith(p))) return null;

  return (
    <nav
      aria-label={t('a11y.mainNavigation', 'Main navigation')}
      className="mobile-bottom-nav-enter fixed bottom-0 inset-x-0 z-[350] md:hidden"
    >
      {/* Frosted glass bar */}
      <div className="bg-[#F9F5F0]/90 backdrop-blur-xl border-t border-[#8B8076]/10 shadow-[0_-8px_32px_rgba(74,60,49,0.08)]">
        <div
          className="grid grid-cols-5 items-end pb-safe"
          style={{paddingBottom: 'env(safe-area-inset-bottom, 8px)'}}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Home */}
          <NavTab to="/" label={t('nav.home', 'Home')} isActive={isActive('/')}>
            <HomeIcon />
          </NavTab>

          {/* Search */}
          <button
            className={`flex flex-col items-center gap-1 py-2 px-3 min-h-[56px] justify-center w-full transition-colors ${
              state.isSearchOpen ? 'text-[#a87441]' : 'text-[#6B6058]'
            }`}
            onClick={toggleSearch}
            aria-label={t('nav.search', 'Search')}
          >
            <SearchIcon />
            <span className="text-[10px] uppercase tracking-wider font-medium">
              {t('nav.search', 'Search')}
            </span>
          </button>

          {/* Collections — center focal tab */}
          <NavTab
            to="/collections"
            label={t('nav.shopLabel', 'Shop')}
            isActive={isActive('/collections')}
            isFocal
          >
            <ShopIcon />
          </NavTab>

          {/* Wishlist */}
          <NavTab
            to="/account/wishlist"
            label={t('nav.saved', 'Saved')}
            isActive={isActive('/account/wishlist')}
          >
            <WishlistIcon count={state.wishlist.length} />
          </NavTab>

          {/* Cart */}
          <button
            className={`flex flex-col items-center gap-1 py-2 px-3 min-h-[56px] justify-center w-full transition-colors relative ${
              state.isCartOpen ? 'text-[#a87441]' : 'text-[#6B6058]'
            }`}
            onClick={toggleCart}
            aria-label={t('nav.cart', 'Bag')}
          >
            <span className="relative">
              <CartIcon />
              <Suspense fallback={null}>
                <Await resolve={rootData?.cart}>
                  {(cart: any) =>
                    cart?.totalQuantity ? (
                      <span className="cart-badge-enter absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-[#a87441] to-[#8B5E3C] text-[10px] font-medium text-white shadow">
                        {cart.totalQuantity > 9 ? '9+' : cart.totalQuantity}
                      </span>
                    ) : null
                  }
                </Await>
              </Suspense>
            </span>
            <span className="text-[10px] uppercase tracking-wider font-medium">
              {t('nav.cart', 'Bag')}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavTab({
  to,
  label,
  isActive,
  isFocal,
  children,
}: {
  to: string;
  label: string;
  isActive: boolean;
  isFocal?: boolean;
  children: React.ReactNode;
}) {
  if (isFocal) {
    return (
      <div className="flex flex-col items-center justify-end pb-1">
        <Link
          to={to}
          aria-label={label}
          className="relative -mt-5 w-12 h-12 rounded-full bg-gradient-to-br from-[#a87441] to-[#8B5E3C] flex items-center justify-center shadow-lg shadow-[#a87441]/30 text-white active:scale-95 transition-transform"
        >
          {children}
        </Link>
        <span
          className={`text-[10px] uppercase tracking-wider font-medium mt-1 ${
            isActive ? 'text-[#a87441]' : 'text-[#6B6058]'
          }`}
        >
          {label}
        </span>
      </div>
    );
  }

  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-1 py-2 px-3 min-h-[56px] justify-center transition-colors ${
        isActive ? 'text-[#a87441]' : 'text-[#6B6058]'
      }`}
    >
      {children}
      <span className="text-[10px] uppercase tracking-wider font-medium">
        {label}
      </span>
    </Link>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function HomeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ShopIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function WishlistIcon({count}: {count: number}) {
  return (
    <span className="relative">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gradient-to-br from-[#a87441] to-[#8B5E3C] text-white text-[10px] font-medium flex items-center justify-center shadow">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </span>
  );
}

function CartIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.97-1.67L23 6H6" />
    </svg>
  );
}
