import {useState, useEffect, useRef} from 'react';
import {
  Link,
  NavLink,
  Await,
  useRouteLoaderData,
  useLocation,
} from '@remix-run/react';
import {motion, AnimatePresence} from 'framer-motion';
import type {RootLoader} from '~/root';
import LanguageSwitch from './LanguageSwitch';
import TopBar from './TopBar';
import type {EnhancedMenu} from '~/lib/utils';
import {useTranslation} from '~/hooks/useTranslation';

// ============================================================================
// PREMIUM HEADER ICONS
// ============================================================================
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
  ChevronDown: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polyline
        points="6 9 12 15 18 9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Home: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="9 22 9 12 15 12 15 22"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Heart: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const rootData = useRouteLoaderData<RootLoader>('root');
  const {t} = useTranslation();
  const location = useLocation();

  const isHome = location.pathname === '/' || location.pathname === '/ar';
  const isCollectionPage = location.pathname.includes('/collections');

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        setScrolled(currentY > 20);

        // Only Hide/Show after meaningful scroll delta
        const delta = currentY - lastScrollY.current;
        if (delta > 10 && currentY > 100) {
          setIsVisible(false);
        } else if (delta < -10) {
          setIsVisible(true);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Default Nav Links
  const defaultLinks = [
    {
      id: '1',
      title: t('nav.newIn', 'New In'),
      to: '/collections/new-in',
      icon: Icons.Heart,
    },
    {
      id: '2',
      title: t('nav.phoneCases', 'Phone Cases'),
      to: '/collections/phone-cases',
    },
    {
      id: '3',
      title: t('nav.sunglasses', 'Sunglasses'),
      to: '/collections/sunglasses',
    },
  ];

  const items = menu?.items?.length ? menu.items : defaultLinks;

  // Header background logic
  const getHeaderBackgroundClass = () => {
    if (!scrolled) return 'bg-[#121212]/[0.85] backdrop-blur-xl py-5';
    if (isCollectionPage) {
      return 'bg-[#2a1d13]/[0.97] backdrop-blur-2xl py-3 border-b border-[#a87441]/20 shadow-[0_2px_12px_rgba(0,0,0,0.15)]';
    }
    return 'bg-[#121212]/[0.97] backdrop-blur-2xl py-3 border-b border-[#a87441]/8 shadow-[0_2px_8px_rgba(0,0,0,0.06)]';
  };

  return (
    <>
      <TopBar />
      <motion.header
        role="banner"
        initial={{y: -100, opacity: 0}}
        animate={{y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0}}
        transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
        className={`fixed z-50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex justify-center left-0 right-0 group w-full md:top-10 ${getHeaderBackgroundClass()}`}
        style={{
          top: 0,
          WebkitBackdropFilter: scrolled
            ? 'blur(40px) saturate(1.2)'
            : 'blur(20px)',
          backdropFilter: scrolled ? 'blur(40px) saturate(1.2)' : 'blur(20px)',
        }}
      >
        <div className="container mx-auto px-6 lg:px-16 flex items-center justify-between relative z-50">
          {/* Desktop Navigation - Left Side */}
          <nav className="hidden md:flex items-center gap-8">
            {items.map((item: any, index: number) => (
              <motion.div
                key={item.id}
                className="h-full flex items-center relative group/item"
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: index * 0.08, duration: 0.4}}
                onMouseEnter={() =>
                  item?.items?.length > 0 && setActiveDropdown(item.id)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <NavLink
                  to={item.to}
                  className={({isActive}) =>
                    `relative text-[11px] uppercase tracking-[0.25em] font-light transition-all duration-300 py-2 flex items-center gap-2 ${
                      isActive
                        ? 'text-[#a87441]'
                        : 'text-[#F0EAE6]/80 hover:text-[#a87441]'
                    }`
                  }
                >
                  {({isActive}) => (
                    <>
                      <span className="relative z-10">
                        {item.title === 'CATALOG' || item.title === 'Catalog'
                          ? 'COLLECTIONS'
                          : item.title}
                      </span>

                      {/* Active indicator dot */}
                      <motion.span
                        className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#a87441]"
                        initial={{scale: 0, opacity: 0}}
                        animate={{
                          scale: isActive ? 1 : 0,
                          opacity: isActive ? 1 : 0,
                        }}
                        transition={{duration: 0.2}}
                      />

                      {/* Animated underline */}
                      <motion.span
                        className="absolute bottom-0 left-0 rtl:left-auto rtl:right-0 h-[1px] bg-gradient-to-r from-[#a87441] to-[#d4af87]"
                        initial={{width: 0}}
                        animate={{width: isActive ? '100%' : 0}}
                        whileHover={{width: '100%'}}
                        transition={{duration: 0.3, ease: 'easeOut'}}
                      />
                    </>
                  )}
                </NavLink>

                {/* Enhanced Dropdown */}
                <AnimatePresence>
                  {item?.items?.length > 0 && activeDropdown === item.id && (
                    <motion.div
                      initial={{opacity: 0, y: 10, scale: 0.95}}
                      animate={{opacity: 1, y: 0, scale: 1}}
                      exit={{opacity: 0, y: 10, scale: 0.95}}
                      transition={{duration: 0.2, ease: 'easeOut'}}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-3 min-w-[240px]"
                    >
                      <div className="bg-[#1A1A1A]/98 backdrop-blur-2xl border border-[#a87441]/20 rounded-2xl shadow-2xl shadow-black/50 py-3 overflow-hidden">
                        {/* Dropdown header */}
                        <div className="px-5 py-2 border-b border-[#a87441]/10 mb-2">
                          <span className="text-[10px] uppercase tracking-widest text-[#a87441]">
                            {item.title}
                          </span>
                        </div>

                        {item.items.map((subItem: any, subIndex: number) => (
                          <motion.div
                            key={subItem.id}
                            initial={{opacity: 0, x: -10}}
                            animate={{opacity: 1, x: 0}}
                            transition={{delay: subIndex * 0.05}}
                          >
                            <Link
                              to={subItem.to}
                              className="flex items-center gap-3 px-5 py-3 text-[11px] uppercase tracking-[0.12em] text-[#F0EAE6]/70 hover:text-[#a87441] hover:bg-[#a87441]/5 transition-all duration-200 group/link"
                            >
                              <span className="w-1 h-1 rounded-full bg-[#a87441]/30 group-hover/link:bg-[#a87441] transition-colors" />
                              <span className="relative">
                                {subItem.title === 'CATALOG' ||
                                subItem.title === 'Catalog'
                                  ? 'COLLECTIONS'
                                  : subItem.title}
                              </span>
                              <Icons.ChevronDown className="w-3 h-3 ml-auto opacity-0 group-hover/link:opacity-100 -rotate-90 transition-all" />
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </nav>

          {/* Mobile: Menu Toggle + Language */}
          <div className="md:hidden flex items-center gap-4">
            <motion.button
              initial={{opacity: 0, scale: 0.8}}
              animate={{opacity: 1, scale: 1}}
              onClick={openMenu}
              className="text-[#F0EAE6]/80 hover:text-[#a87441] transition-colors duration-300 p-2 -m-2 flex flex-col items-center group"
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
              aria-label={t('nav.menu', 'Menu')}
            >
              <Icons.Menu />
              <span className="mt-1 text-[9px] uppercase tracking-wider text-[#F0EAE6]/60 group-hover:text-[#a87441] transition-colors duration-300">
                {t('nav.menu', 'Menu')}
              </span>
            </motion.button>
            <LanguageSwitch />
          </div>

          {/* Centered Logo */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.6, delay: 0.2}}
          >
            <Link to="/" className="block relative group/logo">
              <motion.div
                className="relative flex items-center justify-center"
                whileHover={{scale: 1.05}}
                transition={{duration: 0.3}}
              >
                <img
                  src="/brand/logo-icon-only.png"
                  alt="FORMÉ HAUS"
                  className="transition-all duration-500 object-contain h-10 w-10 opacity-90 group-hover/logo:opacity-100"
                />
                {/* Elegant glow effect on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    filter: 'blur(20px)',
                    background:
                      'radial-gradient(ellipse at center, rgba(168, 116, 65, 0.5) 0%, transparent 70%)',
                  }}
                />
              </motion.div>
            </Link>
          </motion.div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden md:flex mr-1">
              <LanguageSwitch />
            </div>

            {/* Search */}
            <motion.button
              onClick={openSearch}
              className="relative text-[#F0EAE6]/70 hover:text-[#a87441] transition-all duration-300 p-2 -m-2 flex flex-col items-center group"
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
              aria-label={t('nav.search', 'Search')}
              title={t('nav.search', 'Search')}
            >
              <Icons.Search />
              <span className="mt-1 text-[9px] uppercase tracking-wider text-[#F0EAE6]/60 group-hover:text-[#a87441] transition-colors duration-300 hidden lg:block">
                {t('nav.search', 'Search')}
              </span>
              <span className="absolute inset-0 bg-[#a87441]/0 hover:bg-[#a87441]/10 rounded-full transition-colors duration-300 -z-10" />
            </motion.button>

            {/* Cart / Shopping Bag */}
            <motion.button
              onClick={openCart}
              className="relative text-[#F0EAE6]/70 hover:text-[#a87441] transition-all duration-300 p-2 -m-2 flex flex-col items-center group"
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
              aria-label={t('nav.cart', 'Cart')}
              title={t('nav.cart', 'Cart')}
            >
              <Icons.Bag />
              <span className="mt-1 text-[9px] uppercase tracking-wider text-[#F0EAE6]/60 group-hover:text-[#a87441] transition-colors duration-300 hidden lg:block">
                {t('nav.cart', 'Cart')}
              </span>
              <AnimatePresence>
                <Await resolve={rootData?.cart}>
                  {(cart: any) =>
                    cart?.totalQuantity ? (
                      <motion.span
                        initial={{scale: 0}}
                        animate={{scale: 1}}
                        exit={{scale: 0}}
                        className="absolute -top-0.5 right-0 lg:right-2 text-[9px] bg-gradient-to-r from-[#a87441] to-[#8B5E3C] text-white rounded-full w-4 h-4 flex items-center justify-center font-medium shadow-lg"
                      >
                        {cart.totalQuantity > 9 ? '9+' : cart.totalQuantity}
                      </motion.span>
                    ) : null
                  }
                </Await>
              </AnimatePresence>
              <span className="absolute inset-0 bg-[#a87441]/0 hover:bg-[#a87441]/10 rounded-full transition-colors duration-300 -z-10" />
            </motion.button>

            {/* Account (Desktop) */}
            <motion.div
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
              className="hidden md:block"
            >
              <Link
                to="/account"
                className="flex flex-col items-center text-[#F0EAE6]/70 hover:text-[#a87441] transition-all duration-300 p-2 -m-2 relative group"
                aria-label={t('nav.account', 'Account')}
                title={t('nav.account', 'Account')}
              >
                <Icons.User />
                <span className="mt-1 text-[9px] uppercase tracking-wider text-[#F0EAE6]/60 group-hover:text-[#a87441] transition-colors duration-300 hidden lg:block">
                  {t('nav.account', 'Account')}
                </span>
                <span className="absolute inset-0 bg-[#a87441]/0 hover:bg-[#a87441]/10 rounded-full transition-colors duration-300 -z-10" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#a87441] to-[#d4af87]"
          style={{
            width: scrolled ? '100%' : '0%',
            transition: 'width 0.3s ease',
          }}
        />
      </motion.header>
    </>
  );
}
