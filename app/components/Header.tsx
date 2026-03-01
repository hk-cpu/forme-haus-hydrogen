import {useState, useEffect, useRef, Suspense} from 'react';
import {Link, NavLink, Await, useRouteLoaderData} from '@remix-run/react';
import {Menu, Search, ShoppingBag, User, Heart} from 'lucide-react';
import {motion} from 'framer-motion';
import type {RootLoader} from '~/root';
import LanguageSwitch from './LanguageSwitch';
import type {EnhancedMenu} from '~/lib/utils';
import {useTranslation} from '~/hooks/useTranslation';
import {useUI} from '~/context/UIContext';

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
  const ticking = useRef(false);
  const rootData = useRouteLoaderData<RootLoader>('root');
  const {t} = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        setScrolled(currentY > 20);

        // Only hide/show after a meaningful scroll delta (10px threshold)
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

  const {state: uiState} = useUI();

  // Hardcoded navigation per spec
  const navItems = [
    {id: '1', title: 'SHOP ALL', to: '/collections'},
    {id: '2', title: 'Phone Cases', to: '/collections/phone-cases'},
    {id: '3', title: 'Phone Straps', to: '/collections/phone-straps'},
    {id: '4', title: 'Case+Strap Bundles', to: '/collections/case-strap-bundles'},
    {id: '5', title: 'Sunglasses', to: '/collections/sunglasses'},
    {id: '6', title: 'SALE', to: '/collections/sale'},
    {id: '7', title: 'FAQ', to: '/pages/faqs'},
  ];

  const items = navItems;

  return (
    <motion.header
      role="banner"
      initial={{y: 0}}
      animate={{y: isVisible ? 0 : -100}}
      transition={{duration: 0.4, ease: [0.16, 1, 0.3, 1]}}
      className={`fixed z-50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex justify-center left-0 right-0 group
            ${
              scrolled
                ? 'top-0 w-full bg-[#121212]/[0.97] backdrop-blur-2xl py-3 border-b border-[#a87441]/8 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                : 'top-0 w-full bg-[#121212]/[0.85] backdrop-blur-xl py-5'
            }`}
      style={{
        WebkitBackdropFilter: scrolled ? 'blur(40px) saturate(1.2)' : 'blur(20px)',
        backdropFilter: scrolled ? 'blur(40px) saturate(1.2)' : 'blur(20px)',
      }}
    >
      <div className="container mx-auto px-6 lg:px-16 flex items-center justify-between relative z-50">
        {/* Desktop Navigation - Left Side */}
        <nav className="hidden md:flex items-center gap-10">
          {items.map((item: any, index: number) => (
            <motion.div
              key={item.id}
              className="h-full flex items-center relative group/item"
              initial={{opacity: 0, y: -20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: index * 0.06, duration: 0.4}}
            >
              <NavLink
                to={item.to}
                className={({isActive}) =>
                  `relative text-[11px] uppercase tracking-[0.25em] font-light transition-all duration-300 py-2 ${
                    isActive
                      ? 'text-[#a87441]'
                      : 'text-[#F0EAE6]/80 hover:text-[#a87441]'
                  }`
                }
              >
                {({isActive}) => (
                  <>
                    <span className="relative z-10">
                      {item.title}
                    </span>
                    {/* Animated underline */}
                    <motion.span
                      className="absolute bottom-0 left-0 rtl:left-auto rtl:right-0 h-[1px] bg-[#a87441]"
                      initial={{width: 0}}
                      animate={{width: isActive ? '100%' : 0}}
                      whileHover={{width: '100%'}}
                      transition={{duration: 0.3, ease: 'easeOut'}}
                    />
                  </>
                )}
              </NavLink>

              {/* Compact Dropdown - Only if has children */}
              {item?.items?.length > 0 && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-300 -translate-y-2 group-hover/item:translate-y-0 min-w-[220px]">
                  <div className="bg-[#1A1A1A]/98 backdrop-blur-2xl border border-[#a87441]/20 rounded-xl shadow-2xl shadow-black/50 py-2 overflow-hidden">
                    {item.items.map((subItem: any, subIndex: number) => (
                      <motion.div
                        key={subItem.id}
                        initial={{opacity: 0, x: -10}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: subIndex * 0.05}}
                      >
                        <Link
                          to={subItem.to}
                          className="block px-5 py-3 text-[11px] uppercase tracking-[0.12em] text-[#F0EAE6]/70 hover:text-[#a87441] hover:bg-[#a87441]/5 transition-all duration-200 group/link"
                        >
                          <span className="relative">
                            {subItem.title === 'CATALOG' || subItem.title === 'Catalog'
                              ? 'COLLECTIONS'
                              : subItem.title}
                            <span className="absolute -bottom-0.5 left-0 rtl:left-auto rtl:right-0 w-0 h-[1px] bg-[#a87441] group-hover/link:w-full transition-all duration-300" />
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </nav>

        {/* Mobile: Menu Toggle + Language */}
        <div className="md:hidden flex items-center gap-4">
          <motion.button
            onClick={openMenu}
            className="text-[#F0EAE6]/80 hover:text-[#a87441] transition-colors duration-300 p-2 -m-2"
            whileTap={{scale: 0.95}}
          >
            <Menu strokeWidth={1.5} className="w-6 h-6" />
          </motion.button>
          <LanguageSwitch />
        </div>

        {/* Centered Logo */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{opacity: 0, scale: 0.95}}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{duration: 0.5}}
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

        {/* Right Actions — Ounass-style labeled icons */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex">
            <LanguageSwitch />
          </div>

          {/* Search (icon only, no label) */}
          <motion.button
            onClick={openSearch}
            className="text-[#F0EAE6]/70 hover:text-[#a87441] transition-all duration-300 p-2 -m-2 relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a87441] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] rounded-full md:hidden"
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
            aria-label="Search"
          >
            <Search strokeWidth={1.5} className="w-5 h-5" />
          </motion.button>

          {/* Search (desktop with label) */}
          <motion.button
            onClick={openSearch}
            className="hidden md:flex flex-col items-center gap-1 text-[#F0EAE6]/70 hover:text-[#a87441] transition-all duration-300 relative group focus:outline-none"
            whileHover={{scale: 1.03}}
            whileTap={{scale: 0.97}}
            aria-label="Search"
          >
            <Search strokeWidth={1.5} className="w-[18px] h-[18px]" />
            <span className="text-[9px] uppercase tracking-[0.12em] font-light">Search</span>
          </motion.button>

          {/* Account (desktop with label) */}
          <motion.div
            whileHover={{scale: 1.03}}
            whileTap={{scale: 0.97}}
            className="hidden md:block"
          >
            <Link
              to="/account"
              className="flex flex-col items-center gap-1 text-[#F0EAE6]/70 hover:text-[#a87441] transition-all duration-300"
              aria-label="Account"
            >
              <User strokeWidth={1.5} className="w-[18px] h-[18px]" />
              <span className="text-[9px] uppercase tracking-[0.12em] font-light">Account</span>
            </Link>
          </motion.div>

          {/* Wishlist (desktop with label + counter) */}
          <motion.div
            whileHover={{scale: 1.03}}
            whileTap={{scale: 0.97}}
            className="hidden md:block"
          >
            <Link
              to="/wishlist"
              className="flex flex-col items-center gap-1 text-[#F0EAE6]/70 hover:text-[#a87441] transition-all duration-300 relative"
              aria-label="Wishlist"
            >
              <Heart strokeWidth={1.5} className="w-[18px] h-[18px]" />
              <span className="text-[9px] uppercase tracking-[0.12em] font-light">
                Wishlist ({uiState.wishlist?.length || 0})
              </span>
            </Link>
          </motion.div>

          {/* Bag (with label + counter) */}
          <motion.button
            onClick={openCart}
            className="flex flex-col items-center gap-1 text-[#F0EAE6]/70 hover:text-[#a87441] transition-all duration-300 relative group focus:outline-none"
            whileHover={{scale: 1.03}}
            whileTap={{scale: 0.97}}
            aria-label="Bag"
          >
            <div className="relative">
              <ShoppingBag strokeWidth={1.5} className="w-[18px] h-[18px]" />
              <Suspense fallback={null}>
                <Await resolve={rootData?.cart}>
                  {(cart: any) =>
                    cart?.totalQuantity ? (
                      <motion.span
                        initial={{scale: 0}}
                        animate={{scale: 1}}
                        className="absolute -top-1.5 -right-2 text-[8px] bg-[#a87441] text-white rounded-full w-3.5 h-3.5 flex items-center justify-center font-medium shadow-lg"
                      >
                        {cart.totalQuantity}
                      </motion.span>
                    ) : null
                  }
                </Await>
              </Suspense>
            </div>
            <Suspense fallback={<span className="text-[9px] uppercase tracking-[0.12em] font-light">Bag (0)</span>}>
              <Await resolve={rootData?.cart}>
                {(cart: any) => (
                  <span className="text-[9px] uppercase tracking-[0.12em] font-light">
                    Bag ({cart?.totalQuantity || 0})
                  </span>
                )}
              </Await>
            </Suspense>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
