import { useState, useEffect, Suspense } from 'react';
import { Link, NavLink, Await, useRouteLoaderData } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import { Menu, Search, ShoppingBag, User } from 'lucide-react';
import { useWindowScroll } from 'react-use';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsHomePath } from '~/lib/utils';
import type { RootLoader } from '~/root';
import LanguageSwitch from './LanguageSwitch';
import type { EnhancedMenu } from '~/lib/utils';
import { useTranslation } from '~/hooks/useTranslation';

export function Header({
    title,
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
    const isHome = useIsHomePath();
    const { y } = useWindowScroll();
    const [scrolled, setScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const rootData = useRouteLoaderData<RootLoader>('root');
    const { t } = useTranslation();

    useEffect(() => {
        setScrolled(y > 20);

        // Smart hide/show on scroll direction
        if (y > lastScrollY && y > 100) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
        setLastScrollY(y);
    }, [y, lastScrollY]);

    // Default Nav Links if menu is missing
    const defaultLinks = [
        { id: '1', title: t('nav.newIn'), to: '/collections/new' },
        { id: '2', title: t('nav.collections'), to: '/collections' },
        { id: '3', title: t('nav.designers'), to: '/pages/designers' },
        { id: '4', title: t('nav.clothing'), to: '/collections/clothing' },
        { id: '5', title: t('nav.shoes'), to: '/collections/shoes' },
    ];

    const items = menu?.items?.length ? menu.items : defaultLinks;

    return (
        <motion.header
            role="banner"
            initial={{ y: 0 }}
            animate={{ y: isVisible ? 0 : -100 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed z-50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex justify-center left-0 right-0 group
            ${scrolled
                    ? 'top-0 w-full bg-[#121212]/95 backdrop-blur-xl py-3 border-b border-[#a87441]/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
                    : 'top-0 w-full bg-gradient-to-b from-[#121212]/90 to-transparent backdrop-blur-sm py-5'
                }`}
        >
            <div className="container mx-auto px-6 lg:px-16 flex items-center justify-between relative z-50">

                {/* Desktop Navigation - Left Side */}
                <nav className="hidden md:flex items-center gap-10">
                    {items.map((item: any, index: number) => (
                        <motion.div
                            key={item.id}
                            className="h-full flex items-center relative group/item"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.06, duration: 0.4 }}
                        >
                            <NavLink
                                to={item.to}
                                className={({ isActive }) =>
                                    `relative text-[11px] uppercase tracking-[0.25em] font-light transition-all duration-300 py-2 ${isActive
                                        ? 'text-[#a87441]'
                                        : 'text-[#F0EAE6]/80 hover:text-[#a87441]'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className="relative z-10">{item.title}</span>
                                        {/* Animated underline */}
                                        <motion.span
                                            className="absolute bottom-0 left-0 rtl:left-auto rtl:right-0 h-[1px] bg-[#a87441]"
                                            initial={{ width: 0 }}
                                            animate={{ width: isActive ? '100%' : 0 }}
                                            whileHover={{ width: '100%' }}
                                            transition={{ duration: 0.3, ease: 'easeOut' }}
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
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: subIndex * 0.05 }}
                                            >
                                                <Link
                                                    to={subItem.to}
                                                    className="block px-5 py-3 text-[11px] uppercase tracking-[0.12em] text-[#F0EAE6]/70 hover:text-[#a87441] hover:bg-[#a87441]/5 transition-all duration-200 group/link"
                                                >
                                                    <span className="relative">
                                                        {subItem.title}
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
                        whileTap={{ scale: 0.95 }}
                    >
                        <Menu strokeWidth={1.5} className="w-6 h-6" />
                    </motion.button>
                    <LanguageSwitch />
                </div>

                {/* Centered Logo */}
                <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: scrolled ? 1 : 0.7,
                        scale: scrolled ? 1 : 0.9
                    }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to="/" className="block relative group/logo">
                        <motion.div
                            className="relative flex items-center justify-center"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
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
                                    background: 'radial-gradient(ellipse at center, rgba(168, 116, 65, 0.5) 0%, transparent 70%)',
                                }}
                            />
                        </motion.div>
                    </Link>
                </motion.div>

                {/* Right Actions */}
                <div className="flex items-center gap-5 md:gap-6">
                    <div className="hidden md:flex">
                        <LanguageSwitch />
                    </div>

                    <motion.button
                        onClick={openSearch}
                        className="text-[#F0EAE6]/70 hover:text-[#a87441] transition-all duration-300 p-2 -m-2 relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a87441] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] rounded-full"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Search"
                    >
                        <Search strokeWidth={1.5} className="w-5 h-5" />
                        <span className="absolute inset-0 bg-[#a87441]/0 group-hover:bg-[#a87441]/10 rounded-full transition-colors duration-300" />
                    </motion.button>

                    <motion.button
                        onClick={openCart}
                        className="text-[#F0EAE6]/70 hover:text-[#a87441] transition-all duration-300 p-2 -m-2 relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a87441] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] rounded-full"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Cart"
                    >
                        <ShoppingBag strokeWidth={1.5} className="w-5 h-5" />
                        <Suspense fallback={null}>
                            <Await resolve={rootData?.cart}>
                                {(cart: any) =>
                                    cart?.totalQuantity ? (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-0.5 -right-0.5 text-[9px] bg-[#a87441] text-white rounded-full w-4 h-4 flex items-center justify-center font-medium shadow-lg"
                                        >
                                            {cart.totalQuantity}
                                        </motion.span>
                                    ) : null
                                }
                            </Await>
                        </Suspense>
                        <span className="absolute inset-0 bg-[#a87441]/0 group-hover:bg-[#a87441]/10 rounded-full transition-colors duration-300" />
                    </motion.button>

                    {/* Account Icon (Desktop) */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="hidden md:block"
                    >
                        <Link
                            to="/account"
                            className="flex items-center justify-center text-[#F0EAE6]/70 hover:text-[#a87441] transition-all duration-300 p-2 -m-2 relative group"
                            aria-label="Account"
                        >
                            <User strokeWidth={1.5} className="w-5 h-5" />
                            <span className="absolute inset-0 bg-[#a87441]/0 group-hover:bg-[#a87441]/10 rounded-full transition-colors duration-300" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </motion.header>
    );
}
