import { useState, useEffect, useRef, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from '@remix-run/react';
import { tokens, Icons } from './Theme';

// ============================================================================
// DESIGN TOKENS & THEME
// ============================================================================



// ============================================================================
// GLOBAL STATE CONTEXT
// ============================================================================

interface StoreState {
  isMenuOpen: boolean;
  isSearchOpen: boolean;
  isLoginOpen: boolean;
  isFilterOpen: boolean;
  isCartOpen: boolean;
  menuLevel: number;
  menuPath: string[];
  cartItems: CartItem[];
  wishlist: string[];
  isLoggedIn: boolean;
  promoBannerVisible: boolean;
  promoPaused: boolean;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  quantity: number;
}

const StoreContext = createContext<{
  state: StoreState;
  dispatch: (action: any) => void;
} | null>(null);

function storeReducer(state: StoreState, action: any): StoreState {
  switch (action.type) {
    case 'TOGGLE_MENU':
      return { ...state, isMenuOpen: !state.isMenuOpen, menuLevel: 0, menuPath: [] };
    case 'CLOSE_MENU':
      return { ...state, isMenuOpen: false, menuLevel: 0, menuPath: [] };
    case 'NAVIGATE_MENU':
      return { ...state, menuLevel: state.menuLevel + 1, menuPath: [...state.menuPath, action.category] };
    case 'BACK_MENU':
      return { ...state, menuLevel: Math.max(0, state.menuLevel - 1), menuPath: state.menuPath.slice(0, -1) };
    case 'TOGGLE_SEARCH':
      return { ...state, isSearchOpen: !state.isSearchOpen };
    case 'CLOSE_SEARCH':
      return { ...state, isSearchOpen: false };
    case 'TOGGLE_LOGIN':
      return { ...state, isLoginOpen: !state.isLoginOpen };
    case 'CLOSE_LOGIN':
      return { ...state, isLoginOpen: false };
    case 'TOGGLE_FILTER':
      return { ...state, isFilterOpen: !state.isFilterOpen };
    case 'CLOSE_FILTER':
      return { ...state, isFilterOpen: false };
    case 'TOGGLE_CART':
      return { ...state, isCartOpen: !state.isCartOpen };
    case 'CLOSE_CART':
      return { ...state, isCartOpen: false };
    case 'ADD_TO_CART':
      const existingItem = state.cartItems.find(item => item.id === action.item.id);
      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.id === action.item.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return { ...state, cartItems: [...state.cartItems, { ...action.item, quantity: 1 }] };
    case 'REMOVE_FROM_CART':
      return { ...state, cartItems: state.cartItems.filter(item => item.id !== action.id) };
    case 'TOGGLE_WISHLIST':
      if (state.wishlist.includes(action.id)) {
        return { ...state, wishlist: state.wishlist.filter(id => id !== action.id) };
      }
      return { ...state, wishlist: [...state.wishlist, action.id] };
    case 'LOGIN':
      return { ...state, isLoggedIn: true, isLoginOpen: false };
    case 'LOGOUT':
      return { ...state, isLoggedIn: false };
    case 'CLOSE_PROMO':
      return { ...state, promoBannerVisible: false };
    case 'TOGGLE_PROMO_PAUSE':
      return { ...state, promoPaused: !state.promoPaused };
    default:
      return state;
  }
}

function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useState<StoreState>({
    isMenuOpen: false,
    isSearchOpen: false,
    isLoginOpen: false,
    isFilterOpen: false,
    isCartOpen: false,
    menuLevel: 0,
    menuPath: [],
    cartItems: [],
    wishlist: [],
    isLoggedIn: false,
    promoBannerVisible: true,
    promoPaused: false,
  });

  const dispatchAction = (action: any) => {
    dispatch(prev => storeReducer(prev, action));
  };

  return (
    <StoreContext.Provider value={{ state, dispatch: dispatchAction }}>
      {children}
    </StoreContext.Provider>
  );
}

function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}

// ============================================================================
// ICON COMPONENTS
// ============================================================================



// ============================================================================
// PROMOTIONAL BANNER
// ============================================================================

const promoMessages = [
  { text: 'Complimentary Delivery & Returns', link: '/shipping' },
  { text: 'Discover the New Spring Collection', link: '/collections/spring-2025' },
  { text: 'Exclusive Online Pieces Now Available', link: '/collections/online-exclusive' },
  { text: 'Book a Private Appointment', link: '/appointments' },
];

function PromoBanner() {
  const { state, dispatch } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (state.promoPaused || !state.promoBannerVisible) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % promoMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [state.promoPaused, state.promoBannerVisible]);

  if (!state.promoBannerVisible) return null;

  return (
    <div className="promo-banner">
      <button
        className="promo-control promo-pause"
        onClick={() => dispatch({ type: 'TOGGLE_PROMO_PAUSE' })}
        aria-label={state.promoPaused ? 'Play' : 'Pause'}
      >
        {state.promoPaused ? <Icons.Play /> : <Icons.Pause />}
      </button>

      <div className="promo-content">
        <AnimatePresence mode="wait">
          <motion.a
            key={currentIndex}
            href={promoMessages[currentIndex].link}
            className="promo-link"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {promoMessages[currentIndex].text}
          </motion.a>
        </AnimatePresence>
      </div>

      <button
        className="promo-control promo-close"
        onClick={() => dispatch({ type: 'CLOSE_PROMO' })}
        aria-label="Close banner"
      >
        <Icons.Close />
      </button>

      <style>{`
        .promo-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          background: ${tokens.colors.black};
          color: ${tokens.colors.ivory};
          font-family: ${tokens.fonts.sans};
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .promo-control {
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 4px;
          opacity: 0.7;
          transition: opacity ${tokens.timing.fast} ${tokens.easing.smooth};
        }
        .promo-control:hover {
          opacity: 1;
        }
        .promo-content {
          flex: 1;
          text-align: center;
          overflow: hidden;
          height: 16px;
        }
        .promo-link {
          color: inherit;
          text-decoration: none;
          display: block;
        }
        .promo-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// MAIN HEADER
// ============================================================================

function Header() {
  const { state, dispatch } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const cartCount = state.cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className="main-header"
        initial={false}
        animate={{
          backgroundColor: isScrolled ? 'rgba(253, 251, 247, 0.95)' : tokens.colors.ivory,
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="header-left">
          <button
            className="header-btn"
            onClick={() => dispatch({ type: 'TOGGLE_MENU' })}
            aria-label="Menu"
          >
            <Icons.Menu />
          </button>
          <button
            className="header-btn"
            onClick={() => dispatch({ type: 'TOGGLE_SEARCH' })}
            aria-label="Search"
          >
            <Icons.Search />
          </button>
        </div>

        <Link to="/" className="header-logo">
          <span className="logo-text">FORMÉ HAUS</span>
        </Link>

        <div className="header-right">
          <button
            className="header-btn"
            onClick={() => dispatch({ type: 'TOGGLE_LOGIN' })}
            aria-label="Account"
          >
            <Icons.User />
          </button>
          {state.isLoggedIn && (
            <button className="header-btn" aria-label="Wishlist">
              <Icons.Heart />
              {state.wishlist.length > 0 && (
                <span className="badge">{state.wishlist.length}</span>
              )}
            </button>
          )}
          <button
            className="header-btn"
            onClick={() => dispatch({ type: 'TOGGLE_CART' })}
            aria-label="Shopping bag"
          >
            <Icons.Bag />
            <span className="badge">{cartCount}</span>
          </button>
        </div>
      </motion.header>

      <style>{`
        .main-header {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: ${tokens.colors.ivory};
          border-bottom: 1px solid ${tokens.colors.warmGray};
        }
        .header-left,
        .header-right {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 100px;
        }
        .header-right {
          justify-content: flex-end;
        }
        .header-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: none;
          border: none;
          color: ${tokens.colors.black};
          cursor: pointer;
          transition: opacity ${tokens.timing.fast} ${tokens.easing.smooth};
        }
        .header-btn:hover {
          opacity: 0.6;
        }
        .header-btn .badge {
          position: absolute;
          top: 6px;
          right: 6px;
          min-width: 16px;
          height: 16px;
          padding: 0 4px;
          background: ${tokens.colors.black};
          color: ${tokens.colors.ivory};
          font-family: ${tokens.fonts.sans};
          font-size: 9px;
          font-weight: 500;
          line-height: 16px;
          text-align: center;
          border-radius: 8px;
        }
        .header-logo {
          text-decoration: none;
        }
        .logo-text {
          font-family: ${tokens.fonts.serif};
          font-size: 22px;
          font-weight: 500;
          letter-spacing: 0.12em;
          color: ${tokens.colors.black};
        }
        @media (min-width: 768px) {
          .main-header {
            padding: 20px 40px;
          }
          .logo-text {
            font-size: 26px;
          }
          .header-left,
          .header-right {
            min-width: 160px;
            gap: 4px;
          }
        }
      `}</style>
    </>
  );
}

// ============================================================================
// NAVIGATION MENU (Full-Screen Overlay)
// ============================================================================

const menuData = {
  level1: [
    { id: 'monogram', label: 'Monogram Anniversary', hasChildren: true },
    { id: 'gifts', label: 'Gifts and Personalization', hasChildren: true },
    { id: 'new', label: 'New', hasChildren: true },
    { id: 'bags', label: 'Bags and Small Leather Goods', hasChildren: true },
    { id: 'women', label: 'Women', hasChildren: true },
    { id: 'men', label: 'Men', hasChildren: true },
    { id: 'perfumes', label: 'Perfumes and Beauty', hasChildren: true },
    { id: 'jewelry', label: 'Jewelry', hasChildren: true },
    { id: 'watches', label: 'Watches', hasChildren: true },
    { id: 'travel', label: 'Trunks Travel and Home', hasChildren: true },
    { id: 'services', label: 'Services', hasChildren: true },
    { id: 'maison', label: 'The Maison', hasChildren: false },
  ],
  women: {
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
    categories: ['Travel', 'Accessories', 'Fashion Jewelry', 'Clothing', 'Shoes', 'Perfumes', 'Beauté'],
  },
  clothing: {
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80',
    items: ['Knitwear', 'Tops', 'Denim', 'Dresses', 'Pants', 'Skirts and Shorts', 'Swimwear'],
  },
};

function NavigationMenu() {
  const { state, dispatch } = useStore();

  const slideVariants = {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
  };

  const contentVariants = {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  };

  const currentCategory = state.menuPath[state.menuPath.length - 1];

  return (
    <AnimatePresence>
      {state.isMenuOpen && (
        <>
          <motion.div
            className="menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch({ type: 'CLOSE_MENU' })}
          />
          <motion.nav
            className="navigation-menu"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'tween', duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="menu-header">
              {state.menuLevel > 0 ? (
                <button
                  className="menu-back"
                  onClick={() => dispatch({ type: 'BACK_MENU' })}
                >
                  <Icons.ChevronLeft />
                  <span>{currentCategory}</span>
                </button>
              ) : (
                <div className="menu-title">Menu</div>
              )}
              <button
                className="menu-close"
                onClick={() => dispatch({ type: 'CLOSE_MENU' })}
              >
                <Icons.Close />
              </button>
            </div>

            <div className="menu-content">
              <AnimatePresence mode="wait">
                {state.menuLevel === 0 && (
                  <motion.div
                    key="level1"
                    className="menu-level"
                    variants={contentVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <ul className="menu-list">
                      {menuData.level1.map((item, index) => (
                        <motion.li
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.04 }}
                        >
                          <button
                            className="menu-item"
                            onClick={() => item.hasChildren && dispatch({ type: 'NAVIGATE_MENU', category: item.label })}
                          >
                            <span>{item.label}</span>
                            {item.hasChildren && <Icons.ChevronRight />}
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {state.menuLevel === 1 && currentCategory === 'Women' && (
                  <motion.div
                    key="level2"
                    className="menu-level"
                    variants={contentVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <div className="menu-hero">
                      <img src={menuData.women.image} alt="Women's Collection" />
                    </div>
                    <ul className="menu-list">
                      {menuData.women.categories.map((cat, index) => (
                        <motion.li
                          key={cat}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.04 }}
                        >
                          <button
                            className="menu-item"
                            onClick={() => dispatch({ type: 'NAVIGATE_MENU', category: cat })}
                          >
                            <span>{cat}</span>
                            <Icons.ChevronRight />
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {state.menuLevel === 2 && currentCategory === 'Clothing' && (
                  <motion.div
                    key="level3"
                    className="menu-level"
                    variants={contentVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <div className="menu-hero">
                      <img src={menuData.clothing.image} alt="Clothing" />
                    </div>
                    <ul className="menu-list">
                      {menuData.clothing.items.map((item, index) => (
                        <motion.li
                          key={item}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.04 }}
                        >
                          <Link
                            to={`/collections/${item.toLowerCase().replace(/\s/g, '-')}`}
                            className="menu-item"
                            onClick={() => dispatch({ type: 'CLOSE_MENU' })}
                          >
                            <span>{item}</span>
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="menu-footer">
              <a href="/client-services" className="menu-footer-link">Client Services</a>
              <a href="tel:+971800123456" className="menu-footer-link">+971 800 123 456</a>
              <a href="/sustainability" className="menu-footer-link">Sustainability</a>
              <a href="/stores" className="menu-footer-link">Find a Store</a>
              <div className="menu-footer-row">
                <button className="menu-locale">
                  <span>🇦🇪</span>
                  <span>UAE</span>
                </button>
                <button className="menu-locale">
                  <span>EN</span>
                </button>
              </div>
            </div>
          </motion.nav>

          <style>{`
            .menu-backdrop {
              position: fixed;
              inset: 0;
              background: rgba(0, 0, 0, 0.4);
              z-index: 200;
            }
            .navigation-menu {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              max-width: 420px;
              height: 100%;
              background: ${tokens.colors.ivory};
              z-index: 201;
              display: flex;
              flex-direction: column;
              overflow: hidden;
            }
            .menu-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 20px 24px;
              border-bottom: 1px solid ${tokens.colors.warmGray};
              min-height: 72px;
            }
            .menu-title {
              font-family: ${tokens.fonts.sans};
              font-size: 12px;
              letter-spacing: 0.1em;
              text-transform: uppercase;
              color: ${tokens.colors.midGray};
            }
            .menu-back {
              display: flex;
              align-items: center;
              gap: 8px;
              background: none;
              border: none;
              font-family: ${tokens.fonts.serif};
              font-size: 18px;
              color: ${tokens.colors.black};
              cursor: pointer;
            }
            .menu-close {
              background: none;
              border: none;
              color: ${tokens.colors.black};
              cursor: pointer;
              padding: 8px;
            }
            .menu-content {
              flex: 1;
              overflow-y: auto;
              overflow-x: hidden;
            }
            .menu-level {
              padding: 0;
            }
            .menu-hero {
              width: 100%;
              height: 200px;
              overflow: hidden;
            }
            .menu-hero img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .menu-list {
              list-style: none;
              padding: 16px 0;
              margin: 0;
            }
            .menu-item {
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
              padding: 18px 24px;
              background: none;
              border: none;
              font-family: ${tokens.fonts.serif};
              font-size: 20px;
              color: ${tokens.colors.black};
              text-decoration: none;
              cursor: pointer;
              transition: background ${tokens.timing.fast} ${tokens.easing.smooth};
            }
            .menu-item:hover {
              background: ${tokens.colors.cream};
            }
            .menu-footer {
              padding: 24px;
              border-top: 1px solid ${tokens.colors.warmGray};
              display: flex;
              flex-direction: column;
              gap: 16px;
            }
            .menu-footer-link {
              font-family: ${tokens.fonts.sans};
              font-size: 13px;
              color: ${tokens.colors.charcoal};
              text-decoration: none;
            }
            .menu-footer-link:hover {
              text-decoration: underline;
            }
            .menu-footer-row {
              display: flex;
              gap: 16px;
              margin-top: 8px;
            }
            .menu-locale {
              display: flex;
              align-items: center;
              gap: 6px;
              padding: 8px 12px;
              background: ${tokens.colors.cream};
              border: 1px solid ${tokens.colors.warmGray};
              border-radius: 4px;
              font-family: ${tokens.fonts.sans};
              font-size: 12px;
              cursor: pointer;
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// SEARCH OVERLAY
// ============================================================================

const trendingSearches = ['Capucines', 'Neverfull', 'Perfume', 'Speedy', 'Pochette'];
const searchPlaceholders = ['Search for Capucines', 'Search for New Arrivals', 'Search for Perfumes'];

function SearchOverlay() {
  const { state, dispatch } = useStore();
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.isSearchOpen) {
      inputRef.current?.focus();
    }
  }, [state.isSearchOpen]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % searchPlaceholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const giftProducts = [
    { id: '1', name: 'Capucines Mini', price: 18500, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80' },
    { id: '2', name: 'Twist PM', price: 14200, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80' },
    { id: '3', name: 'Dauphine Mini', price: 12800, image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&q=80' },
    { id: '4', name: 'Petite Malle', price: 22500, image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&q=80' },
  ];

  return (
    <AnimatePresence>
      {state.isSearchOpen && (
        <motion.div
          className="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="search-header">
            <div className="search-input-wrapper">
              <Icons.Search />
              <input
                ref={inputRef}
                type="text"
                className="search-input"
                placeholder={searchPlaceholders[placeholderIndex]}
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              {query && (
                <button className="search-clear" onClick={() => setQuery('')}>
                  <Icons.Close />
                </button>
              )}
            </div>
            <button
              className="search-close"
              onClick={() => dispatch({ type: 'CLOSE_SEARCH' })}
            >
              Cancel
            </button>
          </div>

          <div className="search-content">
            <motion.section
              className="search-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="search-section-title">Trending Searches</h3>
              <div className="trending-chips">
                {trendingSearches.map(term => (
                  <button
                    key={term}
                    className="trending-chip"
                    onClick={() => setQuery(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.section>

            <motion.section
              className="search-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="search-section-title">The Perfect Gift for Her</h3>
              <div className="search-products-grid">
                {giftProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClose={() => dispatch({ type: 'CLOSE_SEARCH' })}
                  />
                ))}
              </div>
            </motion.section>
          </div>

          <style>{`
            .search-overlay {
              position: fixed;
              inset: 0;
              background: ${tokens.colors.ivory};
              z-index: 300;
              display: flex;
              flex-direction: column;
              overflow-y: auto;
            }
            .search-header {
              display: flex;
              align-items: center;
              gap: 16px;
              padding: 16px 20px;
              border-bottom: 1px solid ${tokens.colors.warmGray};
            }
            .search-input-wrapper {
              flex: 1;
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 12px 16px;
              background: ${tokens.colors.cream};
              border-radius: 28px;
              color: ${tokens.colors.midGray};
            }
            .search-input {
              flex: 1;
              border: none;
              background: none;
              font-family: ${tokens.fonts.sans};
              font-size: 15px;
              color: ${tokens.colors.black};
              outline: none;
            }
            .search-input::placeholder {
              color: ${tokens.colors.midGray};
            }
            .search-clear {
              background: none;
              border: none;
              color: ${tokens.colors.midGray};
              cursor: pointer;
              padding: 4px;
            }
            .search-close {
              background: none;
              border: none;
              font-family: ${tokens.fonts.sans};
              font-size: 14px;
              color: ${tokens.colors.black};
              cursor: pointer;
            }
            .search-content {
              flex: 1;
              padding: 24px 20px;
            }
            .search-section {
              margin-bottom: 40px;
            }
            .search-section-title {
              font-family: ${tokens.fonts.sans};
              font-size: 11px;
              font-weight: 500;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              color: ${tokens.colors.midGray};
              margin-bottom: 16px;
            }
            .trending-chips {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
            }
            .trending-chip {
              padding: 10px 18px;
              background: transparent;
              border: 1px solid ${tokens.colors.warmGray};
              border-radius: 20px;
              font-family: ${tokens.fonts.sans};
              font-size: 13px;
              color: ${tokens.colors.charcoal};
              cursor: pointer;
              transition: all ${tokens.timing.fast} ${tokens.easing.smooth};
            }
            .trending-chip:hover {
              background: ${tokens.colors.black};
              color: ${tokens.colors.ivory};
              border-color: ${tokens.colors.black};
            }
            .search-products-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
            }
            @media (min-width: 768px) {
              .search-products-grid {
                grid-template-columns: repeat(4, 1fr);
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// PRODUCT CARD
// ============================================================================

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    isNew?: boolean;
    images?: string[];
  };
  onClose?: () => void;
}

function ProductCard({ product, onClose }: ProductCardProps) {
  const { state, dispatch } = useStore();
  const [currentImage, setCurrentImage] = useState(0);
  const isWishlisted = state.wishlist.includes(product.id);
  const images = product.images || [product.image];

  return (
    <div className="product-card">
      <div className="product-card-image">
        <img src={images[currentImage]} alt={product.name} />

        {product.isNew && <span className="product-badge">New</span>}

        <button
          className="product-wishlist"
          onClick={e => {
            e.preventDefault();
            dispatch({ type: 'TOGGLE_WISHLIST', id: product.id });
          }}
        >
          <Icons.Heart filled={isWishlisted} />
        </button>

        {images.length > 1 && (
          <>
            <button
              className="product-nav product-nav-prev"
              onClick={e => {
                e.preventDefault();
                setCurrentImage(prev => (prev - 1 + images.length) % images.length);
              }}
            >
              <Icons.ChevronLeft />
            </button>
            <button
              className="product-nav product-nav-next"
              onClick={e => {
                e.preventDefault();
                setCurrentImage(prev => (prev + 1) % images.length);
              }}
            >
              <Icons.ChevronRight />
            </button>
            <div className="product-dots">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`product-dot ${idx === currentImage ? 'active' : ''}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Link
        to={`/products/${product.id}`}
        className="product-card-info"
        onClick={onClose}
      >
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">AED {product.price.toLocaleString()}</p>
      </Link>

      <style>{`
        .product-card {
          display: flex;
          flex-direction: column;
        }
        .product-card-image {
          position: relative;
          aspect-ratio: 3/4;
          background: ${tokens.colors.cream};
          overflow: hidden;
        }
        .product-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ${tokens.easing.luxe};
        }
        .product-card:hover .product-card-image img {
          transform: scale(1.04);
        }
        .product-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          font-family: ${tokens.fonts.sans};
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: ${tokens.colors.charcoal};
        }
        .product-wishlist {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${tokens.colors.ivory};
          border: none;
          border-radius: 50%;
          color: ${tokens.colors.black};
          cursor: pointer;
          opacity: 0;
          transition: opacity ${tokens.timing.fast} ${tokens.easing.smooth};
        }
        .product-card:hover .product-wishlist {
          opacity: 1;
        }
        .product-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${tokens.colors.ivory};
          border: none;
          border-radius: 50%;
          color: ${tokens.colors.black};
          cursor: pointer;
          opacity: 0;
          transition: opacity ${tokens.timing.fast} ${tokens.easing.smooth};
        }
        .product-card:hover .product-nav {
          opacity: 1;
        }
        .product-nav-prev {
          left: 8px;
        }
        .product-nav-next {
          right: 8px;
        }
        .product-dots {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
        }
        .product-dot {
          width: 6px;
          height: 6px;
          background: ${tokens.colors.ivory};
          opacity: 0.5;
          border-radius: 50%;
          transition: opacity ${tokens.timing.fast} ${tokens.easing.smooth};
        }
        .product-dot.active {
          opacity: 1;
        }
        .product-card-info {
          padding: 14px 0;
          text-decoration: none;
        }
        .product-name {
          font-family: ${tokens.fonts.serif};
          font-size: 15px;
          font-weight: 400;
          color: ${tokens.colors.black};
          margin-bottom: 4px;
        }
        .product-price {
          font-family: ${tokens.fonts.sans};
          font-size: 13px;
          color: ${tokens.colors.charcoal};
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// FILTER PANEL
// ============================================================================

function FilterPanel() {
  const { state, dispatch } = useStore();
  const [expandedSections, setExpandedSections] = useState<string[]>(['categories']);
  const [priceRange, setPriceRange] = useState([7350, 29900]);
  const [onlineOnly, setOnlineOnly] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const categories = ['Blazers', 'Coats', 'Coats and Jackets', 'Jackets'];
  const collections = ['Permanent Collection', 'Spring-Summer 2025', 'LV Night Collection', 'LV Ski', 'Flight Mode'];
  const colors = ['White', 'Black', 'Grey', 'Naturel', 'Beige', 'Rouge', 'Orange', 'Marron', 'Green', 'Blue', 'Pink'];
  const sizes = ['32', '34', '36', '38', '40', '42', '44', '46', 'XS', 'S', 'M', 'L', 'XL'];

  return (
    <AnimatePresence>
      {state.isFilterOpen && (
        <>
          <motion.div
            className="filter-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch({ type: 'CLOSE_FILTER' })}
          />
          <motion.aside
            className="filter-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="filter-header">
              <h2 className="filter-title">Show filters</h2>
              <button
                className="filter-close"
                onClick={() => dispatch({ type: 'CLOSE_FILTER' })}
              >
                <Icons.Close />
              </button>
            </div>

            <div className="filter-content">
              {/* Online Toggle */}
              <div className="filter-toggle-row">
                <span>Available online</span>
                <button
                  className={`toggle-switch ${onlineOnly ? 'active' : ''}`}
                  onClick={() => setOnlineOnly(!onlineOnly)}
                >
                  <span className="toggle-knob" />
                </button>
              </div>

              {/* Categories */}
              <div className="filter-section">
                <button
                  className="filter-section-header"
                  onClick={() => toggleSection('categories')}
                >
                  <span>Categories</span>
                  {expandedSections.includes('categories') ? <Icons.Minus /> : <Icons.Plus />}
                </button>
                <AnimatePresence>
                  {expandedSections.includes('categories') && (
                    <motion.div
                      className="filter-section-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {categories.map(cat => (
                        <a key={cat} href="#" className="filter-link">{cat}</a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Collections */}
              <div className="filter-section">
                <button
                  className="filter-section-header"
                  onClick={() => toggleSection('collections')}
                >
                  <span>Collections</span>
                  {expandedSections.includes('collections') ? <Icons.Minus /> : <Icons.Plus />}
                </button>
                <AnimatePresence>
                  {expandedSections.includes('collections') && (
                    <motion.div
                      className="filter-section-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      {collections.map(col => (
                        <label key={col} className="filter-checkbox">
                          <input type="checkbox" />
                          <span className="checkbox-custom" />
                          <span>{col}</span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Colors */}
              <div className="filter-section">
                <button
                  className="filter-section-header"
                  onClick={() => toggleSection('colors')}
                >
                  <span>Colors</span>
                  {expandedSections.includes('colors') ? <Icons.Minus /> : <Icons.Plus />}
                </button>
                <AnimatePresence>
                  {expandedSections.includes('colors') && (
                    <motion.div
                      className="filter-section-content filter-colors"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      {colors.map(color => (
                        <a key={color} href="#" className="filter-color-link">{color}</a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sizes */}
              <div className="filter-section">
                <button
                  className="filter-section-header"
                  onClick={() => toggleSection('sizes')}
                >
                  <span>Size</span>
                  {expandedSections.includes('sizes') ? <Icons.Minus /> : <Icons.Plus />}
                </button>
                <AnimatePresence>
                  {expandedSections.includes('sizes') && (
                    <motion.div
                      className="filter-section-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="filter-sizes">
                        {sizes.map(size => (
                          <label key={size} className="filter-size">
                            <input type="checkbox" />
                            <span>{size}</span>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Price Range */}
              <div className="filter-section">
                <button
                  className="filter-section-header"
                  onClick={() => toggleSection('price')}
                >
                  <span>Price Range</span>
                  {expandedSections.includes('price') ? <Icons.Minus /> : <Icons.Plus />}
                </button>
                <AnimatePresence>
                  {expandedSections.includes('price') && (
                    <motion.div
                      className="filter-section-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="price-display">
                        <span>AED {priceRange[0].toLocaleString()}</span>
                        <span>AED {priceRange[1].toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50000"
                        value={priceRange[1]}
                        onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="price-slider"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="filter-footer">
              <button className="filter-apply">Show products</button>
            </div>

            <style>{`
              .filter-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.4);
                z-index: 200;
              }
              .filter-panel {
                position: fixed;
                top: 0;
                right: 0;
                width: 100%;
                max-width: 400px;
                height: 100%;
                background: ${tokens.colors.ivory};
                z-index: 201;
                display: flex;
                flex-direction: column;
              }
              .filter-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 24px;
                border-bottom: 1px solid ${tokens.colors.warmGray};
              }
              .filter-title {
                font-family: ${tokens.fonts.serif};
                font-size: 20px;
                font-weight: 400;
              }
              .filter-close {
                background: none;
                border: none;
                color: ${tokens.colors.black};
                cursor: pointer;
                padding: 8px;
              }
              .filter-content {
                flex: 1;
                overflow-y: auto;
                padding: 8px 0;
              }
              .filter-toggle-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 24px;
                border-bottom: 1px solid ${tokens.colors.warmGray};
                font-family: ${tokens.fonts.sans};
                font-size: 14px;
              }
              .toggle-switch {
                width: 48px;
                height: 28px;
                background: ${tokens.colors.warmGray};
                border: none;
                border-radius: 14px;
                position: relative;
                cursor: pointer;
                transition: background ${tokens.timing.fast} ${tokens.easing.smooth};
              }
              .toggle-switch.active {
                background: ${tokens.colors.black};
              }
              .toggle-knob {
                position: absolute;
                top: 3px;
                left: 3px;
                width: 22px;
                height: 22px;
                background: ${tokens.colors.ivory};
                border-radius: 50%;
                transition: transform ${tokens.timing.fast} ${tokens.easing.smooth};
              }
              .toggle-switch.active .toggle-knob {
                transform: translateX(20px);
              }
              .filter-section {
                border-bottom: 1px solid ${tokens.colors.warmGray};
              }
              .filter-section-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                padding: 20px 24px;
                background: none;
                border: none;
                font-family: ${tokens.fonts.sans};
                font-size: 14px;
                font-weight: 500;
                color: ${tokens.colors.black};
                cursor: pointer;
              }
              .filter-section-content {
                padding: 0 24px 20px;
                overflow: hidden;
              }
              .filter-link {
                display: block;
                padding: 10px 0;
                font-family: ${tokens.fonts.sans};
                font-size: 14px;
                color: ${tokens.colors.charcoal};
                text-decoration: none;
              }
              .filter-link:hover {
                color: ${tokens.colors.black};
              }
              .filter-checkbox {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 0;
                font-family: ${tokens.fonts.sans};
                font-size: 14px;
                color: ${tokens.colors.charcoal};
                cursor: pointer;
              }
              .filter-checkbox input {
                display: none;
              }
              .checkbox-custom {
                width: 18px;
                height: 18px;
                border: 1px solid ${tokens.colors.charcoal};
                border-radius: 2px;
                position: relative;
              }
              .filter-checkbox input:checked + .checkbox-custom::after {
                content: '';
                position: absolute;
                top: 2px;
                left: 5px;
                width: 5px;
                height: 10px;
                border: solid ${tokens.colors.black};
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
              }
              .filter-colors {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
              }
              .filter-color-link {
                padding: 8px 14px;
                font-family: ${tokens.fonts.sans};
                font-size: 13px;
                color: ${tokens.colors.charcoal};
                text-decoration: none;
                border: 1px solid ${tokens.colors.warmGray};
                border-radius: 16px;
                transition: all ${tokens.timing.fast} ${tokens.easing.smooth};
              }
              .filter-color-link:hover {
                border-color: ${tokens.colors.black};
              }
              .filter-sizes {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
              }
              .filter-size {
                display: flex;
                cursor: pointer;
              }
              .filter-size input {
                display: none;
              }
              .filter-size span {
                padding: 10px 16px;
                font-family: ${tokens.fonts.sans};
                font-size: 13px;
                border: 1px solid ${tokens.colors.warmGray};
                transition: all ${tokens.timing.fast} ${tokens.easing.smooth};
              }
              .filter-size input:checked + span {
                background: ${tokens.colors.black};
                color: ${tokens.colors.ivory};
                border-color: ${tokens.colors.black};
              }
              .price-display {
                display: flex;
                justify-content: space-between;
                font-family: ${tokens.fonts.sans};
                font-size: 13px;
                color: ${tokens.colors.charcoal};
                margin-bottom: 16px;
              }
              .price-slider {
                width: 100%;
                height: 2px;
                background: ${tokens.colors.warmGray};
                -webkit-appearance: none;
                appearance: none;
              }
              .price-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 20px;
                height: 20px;
                background: ${tokens.colors.black};
                border-radius: 50%;
                cursor: pointer;
              }
              .filter-footer {
                padding: 20px 24px;
                border-top: 1px solid ${tokens.colors.warmGray};
              }
              .filter-apply {
                width: 100%;
                padding: 16px;
                background: ${tokens.colors.black};
                border: none;
                color: ${tokens.colors.ivory};
                font-family: ${tokens.fonts.sans};
                font-size: 14px;
                font-weight: 500;
                letter-spacing: 0.04em;
                cursor: pointer;
                transition: opacity ${tokens.timing.fast} ${tokens.easing.smooth};
              }
              .filter-apply:hover {
                opacity: 0.85;
              }
            `}</style>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// LOGIN OVERLAY
// ============================================================================

function LoginOverlay() {
  const { state, dispatch } = useStore();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AnimatePresence>
      {state.isLoginOpen && (
        <motion.div
          className="login-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="login-header">
            <h2 className="login-title">Identification</h2>
            <button
              className="login-close"
              onClick={() => dispatch({ type: 'CLOSE_LOGIN' })}
            >
              <Icons.Close />
            </button>
          </div>

          <div className="login-content">
            <motion.section
              className="login-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="login-section-title">I already have an account</h3>

              <form className="login-form" onSubmit={e => { e.preventDefault(); dispatch({ type: 'LOGIN' }); }}>
                <div className="form-group">
                  <label htmlFor="email">Login*</label>
                  <input type="email" id="email" placeholder="Email address" />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password*</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                    </button>
                  </div>
                </div>

                <a href="/forgot-password" className="forgot-link">Forgot your password?</a>

                <div className="login-alt">
                  <span>Or use a one-time login link to Sign In:</span>
                  <a href="#" className="email-link">Email me the link</a>
                </div>

                <button type="submit" className="login-btn primary">Sign in</button>
              </form>
            </motion.section>

            <motion.section
              className="login-section create-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="login-section-title">Create My Account</h3>
              <p className="login-description">
                Create an account to enjoy exclusive benefits and a personalized shopping experience.
              </p>

              <button className="login-btn secondary">Create My Account</button>

              <ul className="benefits-list">
                <li>
                  <Icons.Truck />
                  <span>Follow your online orders and purchase history</span>
                </li>
                <li>
                  <Icons.Globe />
                  <span>Manage your personal information</span>
                </li>
                <li>
                  <Icons.Mail />
                  <span>Receive digital communications</span>
                </li>
                <li>
                  <Icons.Heart filled={false} />
                  <span>Register your wishlist</span>
                </li>
              </ul>
            </motion.section>
          </div>

          <style>{`
            .login-overlay {
              position: fixed;
              inset: 0;
              background: ${tokens.colors.ivory};
              z-index: 300;
              display: flex;
              flex-direction: column;
              overflow-y: auto;
            }
            .login-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 20px 24px;
              border-bottom: 1px solid ${tokens.colors.warmGray};
            }
            .login-title {
              font-family: ${tokens.fonts.serif};
              font-size: 24px;
              font-weight: 400;
            }
            .login-close {
              background: none;
              border: none;
              color: ${tokens.colors.black};
              cursor: pointer;
              padding: 8px;
            }
            .login-content {
              flex: 1;
              padding: 32px 24px;
              max-width: 480px;
              margin: 0 auto;
              width: 100%;
            }
            .login-section {
              margin-bottom: 48px;
            }
            .login-section-title {
              font-family: ${tokens.fonts.serif};
              font-size: 18px;
              font-weight: 400;
              margin-bottom: 24px;
            }
            .login-form {
              display: flex;
              flex-direction: column;
              gap: 20px;
            }
            .form-group {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }
            .form-group label {
              font-family: ${tokens.fonts.sans};
              font-size: 12px;
              font-weight: 500;
              letter-spacing: 0.04em;
              color: ${tokens.colors.charcoal};
            }
            .form-group input {
              padding: 14px 16px;
              border: 1px solid ${tokens.colors.warmGray};
              background: transparent;
              font-family: ${tokens.fonts.sans};
              font-size: 15px;
              color: ${tokens.colors.black};
              outline: none;
              transition: border-color ${tokens.timing.fast} ${tokens.easing.smooth};
            }
            .form-group input:focus {
              border-color: ${tokens.colors.black};
            }
            .password-wrapper {
              position: relative;
            }
            .password-wrapper input {
              width: 100%;
              padding-right: 48px;
            }
            .password-toggle {
              position: absolute;
              right: 12px;
              top: 50%;
              transform: translateY(-50%);
              background: none;
              border: none;
              color: ${tokens.colors.midGray};
              cursor: pointer;
            }
            .forgot-link {
              font-family: ${tokens.fonts.sans};
              font-size: 13px;
              color: ${tokens.colors.charcoal};
              text-decoration: underline;
            }
            .login-alt {
              padding: 20px;
              background: ${tokens.colors.cream};
              font-family: ${tokens.fonts.sans};
              font-size: 13px;
              color: ${tokens.colors.charcoal};
              text-align: center;
            }
            .email-link {
              display: block;
              margin-top: 8px;
              color: ${tokens.colors.black};
              font-weight: 500;
              text-decoration: underline;
            }
            .login-btn {
              width: 100%;
              padding: 16px;
              font-family: ${tokens.fonts.sans};
              font-size: 14px;
              font-weight: 500;
              letter-spacing: 0.04em;
              cursor: pointer;
              transition: all ${tokens.timing.fast} ${tokens.easing.smooth};
            }
            .login-btn.primary {
              background: ${tokens.colors.black};
              border: none;
              color: ${tokens.colors.ivory};
            }
            .login-btn.primary:hover {
              opacity: 0.85;
            }
            .login-btn.secondary {
              background: transparent;
              border: 1px solid ${tokens.colors.black};
              color: ${tokens.colors.black};
            }
            .login-btn.secondary:hover {
              background: ${tokens.colors.black};
              color: ${tokens.colors.ivory};
            }
            .login-description {
              font-family: ${tokens.fonts.sans};
              font-size: 14px;
              color: ${tokens.colors.charcoal};
              line-height: 1.6;
              margin-bottom: 24px;
            }
            .benefits-list {
              list-style: none;
              padding: 0;
              margin-top: 32px;
              display: flex;
              flex-direction: column;
              gap: 20px;
            }
            .benefits-list li {
              display: flex;
              align-items: center;
              gap: 16px;
              font-family: ${tokens.fonts.sans};
              font-size: 13px;
              color: ${tokens.colors.charcoal};
            }
            .benefits-list li svg {
              flex-shrink: 0;
              color: ${tokens.colors.black};
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// SHOPPING CART DRAWER
// ============================================================================

function CartDrawer() {
  const { state, dispatch } = useStore();
  const cartTotal = state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {state.isCartOpen && (
        <>
          <motion.div
            className="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch({ type: 'CLOSE_CART' })}
          />
          <motion.aside
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="cart-header">
              <h2 className="cart-title">Shopping Bag</h2>
              <button
                className="cart-close"
                onClick={() => dispatch({ type: 'CLOSE_CART' })}
              >
                <Icons.Close />
              </button>
            </div>

            {state.cartItems.length === 0 ? (
              <div className="cart-empty">
                <p className="cart-empty-text">Your shopping bag is empty</p>
                <button
                  className="cart-continue"
                  onClick={() => dispatch({ type: 'CLOSE_CART' })}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {state.cartItems.map(item => (
                    <motion.div
                      key={item.id}
                      className="cart-item"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="cart-item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="cart-item-info">
                        <h3 className="cart-item-name">{item.name}</h3>
                        {item.size && <p className="cart-item-size">Size: {item.size}</p>}
                        <p className="cart-item-price">AED {item.price.toLocaleString()}</p>
                        <div className="cart-item-qty">
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <button
                        className="cart-item-remove"
                        onClick={() => dispatch({ type: 'REMOVE_FROM_CART', id: item.id })}
                      >
                        <Icons.Close />
                      </button>
                    </motion.div>
                  ))}
                </div>

                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Subtotal</span>
                    <span>AED {cartTotal.toLocaleString()}</span>
                  </div>
                  <p className="cart-shipping-note">Shipping and taxes calculated at checkout</p>
                  <button className="cart-checkout">Proceed to Checkout</button>
                </div>
              </>
            )}

            <style>{`
              .cart-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.4);
                z-index: 200;
              }
              .cart-drawer {
                position: fixed;
                top: 0;
                right: 0;
                width: 100%;
                max-width: 420px;
                height: 100%;
                background: ${tokens.colors.ivory};
                z-index: 201;
                display: flex;
                flex-direction: column;
              }
              .cart-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 24px;
                border-bottom: 1px solid ${tokens.colors.warmGray};
              }
              .cart-title {
                font-family: ${tokens.fonts.serif};
                font-size: 20px;
                font-weight: 400;
              }
              .cart-close {
                background: none;
                border: none;
                color: ${tokens.colors.black};
                cursor: pointer;
                padding: 8px;
              }
              .cart-empty {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 48px 24px;
              }
              .cart-empty-text {
                font-family: ${tokens.fonts.sans};
                font-size: 15px;
                color: ${tokens.colors.midGray};
                margin-bottom: 24px;
              }
              .cart-continue {
                padding: 14px 32px;
                background: transparent;
                border: 1px solid ${tokens.colors.black};
                font-family: ${tokens.fonts.sans};
                font-size: 13px;
                font-weight: 500;
                letter-spacing: 0.04em;
                cursor: pointer;
                transition: all ${tokens.timing.fast} ${tokens.easing.smooth};
              }
              .cart-continue:hover {
                background: ${tokens.colors.black};
                color: ${tokens.colors.ivory};
              }
              .cart-items {
                flex: 1;
                overflow-y: auto;
                padding: 16px 24px;
              }
              .cart-item {
                display: flex;
                gap: 16px;
                padding: 16px 0;
                border-bottom: 1px solid ${tokens.colors.warmGray};
                position: relative;
              }
              .cart-item-image {
                width: 100px;
                aspect-ratio: 3/4;
                background: ${tokens.colors.cream};
                overflow: hidden;
              }
              .cart-item-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
              .cart-item-info {
                flex: 1;
              }
              .cart-item-name {
                font-family: ${tokens.fonts.serif};
                font-size: 15px;
                font-weight: 400;
                margin-bottom: 4px;
              }
              .cart-item-size {
                font-family: ${tokens.fonts.sans};
                font-size: 12px;
                color: ${tokens.colors.midGray};
                margin-bottom: 8px;
              }
              .cart-item-price {
                font-family: ${tokens.fonts.sans};
                font-size: 13px;
                color: ${tokens.colors.charcoal};
              }
              .cart-item-qty {
                margin-top: 12px;
                font-family: ${tokens.fonts.sans};
                font-size: 12px;
                color: ${tokens.colors.midGray};
              }
              .cart-item-remove {
                position: absolute;
                top: 16px;
                right: 0;
                background: none;
                border: none;
                color: ${tokens.colors.midGray};
                cursor: pointer;
                padding: 4px;
              }
              .cart-footer {
                padding: 24px;
                border-top: 1px solid ${tokens.colors.warmGray};
              }
              .cart-total {
                display: flex;
                justify-content: space-between;
                font-family: ${tokens.fonts.sans};
                font-size: 15px;
                font-weight: 500;
                margin-bottom: 8px;
              }
              .cart-shipping-note {
                font-family: ${tokens.fonts.sans};
                font-size: 12px;
                color: ${tokens.colors.midGray};
                margin-bottom: 20px;
              }
              .cart-checkout {
                width: 100%;
                padding: 16px;
                background: ${tokens.colors.black};
                border: none;
                color: ${tokens.colors.ivory};
                font-family: ${tokens.fonts.sans};
                font-size: 14px;
                font-weight: 500;
                letter-spacing: 0.04em;
                cursor: pointer;
                transition: opacity ${tokens.timing.fast} ${tokens.easing.smooth};
              }
              .cart-checkout:hover {
                opacity: 0.85;
              }
            `}</style>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// CATEGORY PAGE HEADER
// ============================================================================

function CategoryHeader({ category = 'Coats and Jackets' }: { category?: string }) {
  const { dispatch } = useStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const siblingCategories = [
    'The Essentials',
    'All Ready-to-Wear',
    'Coats and Jackets',
    'Knitwear',
    'Tops',
    'Denim',
    'Dresses',
    'Pants',
    'Skirts and Shorts',
    'Swimwear',
  ];

  return (
    <div className="category-header">
      <div className="category-dropdown">
        <button
          className="category-dropdown-btn"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span>{category}</span>
          <motion.span
            animate={{ rotate: dropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Icons.ChevronDown />
          </motion.span>
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              className="category-dropdown-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {siblingCategories.map(cat => (
                <a
                  key={cat}
                  href={`/collections/${cat.toLowerCase().replace(/\s/g, '-')}`}
                  className={`category-dropdown-item ${cat === category ? 'active' : ''}`}
                >
                  {cat}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        className="filter-toggle"
        onClick={() => dispatch({ type: 'TOGGLE_FILTER' })}
      >
        <Icons.Filter />
        <span>Filters</span>
      </button>

      <style>{`
        .category-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid ${tokens.colors.warmGray};
          position: sticky;
          top: 73px;
          background: ${tokens.colors.ivory};
          z-index: 50;
        }
        .category-dropdown {
          position: relative;
        }
        .category-dropdown-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          font-family: ${tokens.fonts.serif};
          font-size: 16px;
          color: ${tokens.colors.black};
          cursor: pointer;
        }
        .category-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 8px;
          background: ${tokens.colors.ivory};
          border: 1px solid ${tokens.colors.warmGray};
          min-width: 220px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          z-index: 10;
        }
        .category-dropdown-item {
          display: block;
          padding: 14px 20px;
          font-family: ${tokens.fonts.sans};
          font-size: 14px;
          color: ${tokens.colors.charcoal};
          text-decoration: none;
          transition: background ${tokens.timing.fast} ${tokens.easing.smooth};
        }
        .category-dropdown-item:hover {
          background: ${tokens.colors.cream};
        }
        .category-dropdown-item.active {
          font-weight: 500;
          color: ${tokens.colors.black};
        }
        .filter-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          font-family: ${tokens.fonts.sans};
          font-size: 13px;
          color: ${tokens.colors.charcoal};
          cursor: pointer;
          transition: color ${tokens.timing.fast} ${tokens.easing.smooth};
        }
        .filter-toggle:hover {
          color: ${tokens.colors.black};
        }
        @media (min-width: 768px) {
          .category-header {
            padding: 20px 40px;
            top: 77px;
          }
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// HOMEPAGE HERO
// ============================================================================

function HomepageHero() {
  return (
    <section className="homepage-hero">
      <div className="hero-image">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80"
          alt="Spring Collection"
        />
      </div>
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <span className="hero-label">Women</span>
        <h1 className="hero-headline">The Art of<br />Timeless Elegance</h1>
        <div className="hero-ctas">
          <a href="/collections/women" className="hero-cta">Discover the Collection</a>
          <a href="/collections/new" className="hero-cta">Shop New Arrivals</a>
        </div>
      </motion.div>

      <style>{`
        .homepage-hero {
          position: relative;
          height: 90vh;
          min-height: 600px;
          overflow: hidden;
        }
        .hero-image {
          position: absolute;
          inset: 0;
        }
        .hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hero-image::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.1) 0%,
            rgba(0, 0, 0, 0.3) 100%
          );
        }
        .hero-content {
          position: absolute;
          bottom: 80px;
          left: 24px;
          right: 24px;
          color: ${tokens.colors.ivory};
        }
        .hero-label {
          display: inline-block;
          font-family: ${tokens.fonts.sans};
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .hero-headline {
          font-family: ${tokens.fonts.serif};
          font-size: clamp(36px, 8vw, 64px);
          font-weight: 400;
          line-height: 1.1;
          margin-bottom: 32px;
        }
        .hero-ctas {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .hero-cta {
          font-family: ${tokens.fonts.sans};
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: ${tokens.colors.ivory};
          text-decoration: none;
          position: relative;
        }
        .hero-cta::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 1px;
          background: ${tokens.colors.ivory};
          transform: scaleX(0);
          transform-origin: left;
          transition: transform ${tokens.timing.medium} ${tokens.easing.smooth};
        }
        .hero-cta:hover::after {
          transform: scaleX(1);
        }
        @media (min-width: 768px) {
          .hero-content {
            left: 60px;
            bottom: 100px;
          }
          .hero-ctas {
            flex-direction: row;
            gap: 40px;
          }
        }
      `}</style>
    </section>
  );
}

// ============================================================================
// FEATURED GRID
// ============================================================================

function FeaturedGrid() {
  const categories = [
    { title: "Women's Handbags", image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80', link: '/collections/womens-handbags' },
    { title: "Women's Small Leather Goods", image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80', link: '/collections/womens-slg' },
    { title: 'Jewelry', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80', link: '/collections/jewelry' },
    { title: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80', link: '/collections/beauty' },
    { title: "Men's Bags", image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', link: '/collections/mens-bags' },
    { title: "Men's Wallets", image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80', link: '/collections/mens-wallets' },
  ];

  return (
    <section className="featured-grid">
      <motion.div
        className="featured-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="featured-title">Explore a Selection of the Maison's Creations</h2>
        <p className="featured-subtitle">Complimentary delivery on all orders</p>
      </motion.div>

      <div className="featured-items">
        {categories.map((cat, index) => (
          <motion.a
            key={cat.title}
            href={cat.link}
            className="featured-item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="featured-item-image">
              <img src={cat.image} alt={cat.title} />
            </div>
            <h3 className="featured-item-title">{cat.title}</h3>
          </motion.a>
        ))}
      </div>

      <style>{`
        .featured-grid {
          padding: 80px 20px;
          background: ${tokens.colors.ivory};
        }
        .featured-header {
          text-align: center;
          margin-bottom: 48px;
        }
        .featured-title {
          font-family: ${tokens.fonts.serif};
          font-size: clamp(24px, 4vw, 32px);
          font-weight: 400;
          margin-bottom: 12px;
          color: ${tokens.colors.black};
        }
        .featured-subtitle {
          font-family: ${tokens.fonts.sans};
          font-size: 13px;
          color: ${tokens.colors.midGray};
        }
        .featured-items {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .featured-item {
          text-decoration: none;
        }
        .featured-item-image {
          aspect-ratio: 3/4;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .featured-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s ${tokens.easing.luxe};
        }
        .featured-item:hover .featured-item-image img {
          transform: scale(1.06);
        }
        .featured-item-title {
          font-family: ${tokens.fonts.serif};
          font-size: 15px;
          font-weight: 400;
          color: ${tokens.colors.black};
          text-align: center;
        }
        @media (min-width: 768px) {
          .featured-grid {
            padding: 100px 40px;
          }
          .featured-items {
            grid-template-columns: repeat(3, 1fr);
            gap: 32px;
          }
          .featured-item-title {
            font-size: 17px;
          }
        }
        @media (min-width: 1024px) {
          .featured-items {
            grid-template-columns: repeat(6, 1fr);
          }
        }
      `}</style>
    </section>
  );
}

// ============================================================================
// PRODUCT LISTING PAGE
// ============================================================================

function ProductListingPage() {
  const products = [
    { id: '1', name: 'Wool Cashmere Coat', price: 18500, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80', isNew: true },
    { id: '2', name: 'Double Breasted Blazer', price: 12200, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80' },
    { id: '3', name: 'Leather Trench Coat', price: 29900, image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80', isNew: true },
    { id: '4', name: 'Belted Wool Jacket', price: 15800, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80' },
    { id: '5', name: 'Cropped Bomber Jacket', price: 9500, image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&q=80' },
    { id: '6', name: 'Tailored Overcoat', price: 22400, image: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600&q=80', isNew: true },
  ];

  return (
    <div className="product-listing">
      <div className="products-grid">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      <div className="pagination">
        <div className="page-numbers">
          <span className="page-number active">1</span>
          <span className="page-number">2</span>
          <span className="page-number">3</span>
          <span className="page-number">4</span>
          <span className="page-number">5</span>
        </div>
        <button className="view-more">View More</button>
        <a href="#top" className="back-to-top">Back to top</a>
      </div>

      <div className="category-description">
        <p>
          Discover the collection of luxury <a href="#">coats</a> and <a href="#">jackets</a> for women.
          From timeless wool overcoats to contemporary leather pieces, explore designs that embody
          refined craftsmanship and modern elegance. Each piece in this collection represents the
          pinnacle of <a href="#">ready-to-wear</a> fashion.
        </p>
      </div>

      <style>{`
        .product-listing {
          padding: 24px 20px;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .pagination {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 48px 0;
          border-top: 1px solid ${tokens.colors.warmGray};
          margin-top: 48px;
        }
        .page-numbers {
          display: flex;
          gap: 8px;
        }
        .page-number {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: ${tokens.fonts.sans};
          font-size: 13px;
          color: ${tokens.colors.charcoal};
          cursor: pointer;
          transition: all ${tokens.timing.fast} ${tokens.easing.smooth};
        }
        .page-number:hover {
          color: ${tokens.colors.black};
        }
        .page-number.active {
          background: ${tokens.colors.black};
          color: ${tokens.colors.ivory};
        }
        .view-more {
          padding: 14px 48px;
          background: transparent;
          border: 1px solid ${tokens.colors.black};
          font-family: ${tokens.fonts.sans};
          font-size: 13px;
          font-weight: 500;
          color: ${tokens.colors.black};
          cursor: pointer;
          transition: all ${tokens.timing.fast} ${tokens.easing.smooth};
        }
        .view-more:hover {
          background: ${tokens.colors.black};
          color: ${tokens.colors.ivory};
        }
        .back-to-top {
          font-family: ${tokens.fonts.sans};
          font-size: 12px;
          color: ${tokens.colors.midGray};
          text-decoration: underline;
        }
        .category-description {
          padding: 48px 0;
          border-top: 1px solid ${tokens.colors.warmGray};
        }
        .category-description p {
          font-family: ${tokens.fonts.sans};
          font-size: 14px;
          line-height: 1.8;
          color: ${tokens.colors.charcoal};
          max-width: 800px;
        }
        .category-description a {
          color: ${tokens.colors.black};
          text-decoration: underline;
        }
        @media (min-width: 768px) {
          .product-listing {
            padding: 32px 40px;
          }
          .products-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 32px;
          }
        }
        @media (min-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// FOOTER
// ============================================================================

function Footer() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const sections = [
    { id: 'help', title: 'Help', links: ['FAQs', 'Track Your Order', 'Shipping', 'Returns', 'Contact Us'] },
    { id: 'services', title: 'Services', links: ['Product Care', 'Personalization', 'Repairs', 'Art of Gifting'] },
    { id: 'about', title: 'About', links: ['The Maison', 'Sustainability', 'Careers', 'Press'] },
    { id: 'connect', title: 'Connect', links: ['Newsletter', 'Find a Store', 'Book an Appointment'] },
  ];

  const socialLinks = [
    { name: 'Instagram', url: 'https://www.instagram.com/formee.haus/' },
    { name: 'Facebook', url: '#' },
    { name: 'Twitter', url: '#' },
    { name: 'YouTube', url: '#' },
    { name: 'Pinterest', url: '#' },
  ];

  return (
    <footer className="site-footer">
      <div className="footer-breadcrumb">
        <span>Women</span>
        <span>-</span>
        <span>Clothing</span>
        <span>&gt;</span>
        <span>Coats and Jackets</span>
      </div>

      <div className="footer-sections">
        {sections.map(section => (
          <div key={section.id} className="footer-section">
            <button
              className="footer-section-header"
              onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
            >
              <span>{section.title}</span>
              <motion.span
                animate={{ rotate: expandedSection === section.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Icons.ChevronDown />
              </motion.span>
            </button>
            <AnimatePresence>
              {expandedSection === section.id && (
                <motion.div
                  className="footer-section-content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {section.links.map(link => (
                    <a key={link} href="#" className="footer-link">{link}</a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        <div className="instagram-section py-8 border-t border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-lg text-ivory italic">On Instagram</h3>
            <a href="https://www.instagram.com/formee.haus/" className="text-xs uppercase tracking-widest text-[#8B8076] hover:text-ivory transition-colors">@formee.haus</a>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[
              'https://images.unsplash.com/photo-1549439602-43ebca2327af?w=400&q=80',
              'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&q=80',
              'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80',
              'https://images.unsplash.com/photo-1550928431-74782071279a?w=400&q=80'
            ].map((img, i) => (
              <a key={i} href="https://www.instagram.com/formee.haus/" className="block aspect-square overflow-hidden group">
                <img src={img} alt="Instagram" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-social">
        <span className="footer-social-label">Follow Us</span>
        <div className="social-links">
          {socialLinks.map(social => (
            <a key={social.name} href={social.url} className="social-link">{social.name}</a>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-legal">
          <a href="#">Sitemap</a>
          <a href="#">Legal & Privacy</a>
          <a href="#">Consumer Rights</a>
        </div>
        <div className="footer-locale">
          <button className="locale-btn">
            <span>🇦🇪</span>
            <span>United Arab Emirates</span>
          </button>
          <button className="locale-btn">
            <span>English</span>
          </button>
        </div>
      </div>

      <style>{`
        .site-footer {
          background: ${tokens.colors.black};
          color: ${tokens.colors.ivory};
          padding: 40px 20px;
        }
        .footer-breadcrumb {
          display: flex;
          gap: 8px;
          font-family: ${tokens.fonts.sans};
          font-size: 11px;
          color: ${tokens.colors.midGray};
          margin-bottom: 40px;
        }
        .footer-sections {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .footer-section {
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .footer-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 20px 0;
          background: none;
          border: none;
          color: ${tokens.colors.ivory};
          font-family: ${tokens.fonts.sans};
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.04em;
          cursor: pointer;
        }
        .footer-section-content {
          overflow: hidden;
          padding-bottom: 20px;
        }
        .footer-link {
          display: block;
          padding: 10px 0;
          font-family: ${tokens.fonts.sans};
          font-size: 13px;
          color: ${tokens.colors.midGray};
          text-decoration: none;
          transition: color ${tokens.timing.fast} ${tokens.easing.smooth};
        }
        .footer-link:hover {
          color: ${tokens.colors.ivory};
        }
        .footer-social {
          padding: 32px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .footer-social-label {
          display: block;
          font-family: ${tokens.fonts.sans};
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${tokens.colors.midGray};
          margin-bottom: 16px;
        }
        .social-links {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
        }
        .social-link {
          font-family: ${tokens.fonts.sans};
          font-size: 13px;
          color: ${tokens.colors.ivory};
          text-decoration: none;
          transition: opacity ${tokens.timing.fast} ${tokens.easing.smooth};
        }
        .social-link:hover {
          opacity: 0.7;
        }
        .footer-bottom {
          padding-top: 32px;
        }
        .footer-legal {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          margin-bottom: 24px;
        }
        .footer-legal a {
          font-family: ${tokens.fonts.sans};
          font-size: 11px;
          color: ${tokens.colors.midGray};
          text-decoration: none;
        }
        .footer-legal a:hover {
          color: ${tokens.colors.ivory};
        }
        .footer-locale {
          display: flex;
          gap: 16px;
        }
        .locale-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: ${tokens.colors.ivory};
          font-family: ${tokens.fonts.sans};
          font-size: 12px;
          cursor: pointer;
          transition: all ${tokens.timing.fast} ${tokens.easing.smooth};
        }
        .locale-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        @media (min-width: 768px) {
          .site-footer {
            padding: 60px 40px;
          }
        }
      `}</style>
    </footer>
  );
}

// ============================================================================
// MAIN STOREFRONT COMPONENT
// ============================================================================

type PageView = 'home' | 'category';

interface LuxuryStorefrontProps {
  page?: PageView;
}

export default function LuxuryStorefront({ page = 'home' }: LuxuryStorefrontProps) {
  return (
    <StoreProvider>
      <div className="luxury-storefront">
        {/* Global Font Import */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap"
          rel="stylesheet"
        />

        <PromoBanner />
        <Header />
        <NavigationMenu />
        <SearchOverlay />
        <LoginOverlay />
        <FilterPanel />
        <CartDrawer />

        <main>
          {page === 'home' ? (
            <>
              <HomepageHero />
              <FeaturedGrid />
            </>
          ) : (
            <>
              <CategoryHeader />
              <ProductListingPage />
            </>
          )}
        </main>

        <Footer />

        <style>{`
          .luxury-storefront {
            min-height: 100vh;
            background: ${tokens.colors.ivory};
            color: ${tokens.colors.black};
            font-family: ${tokens.fonts.sans};
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          .luxury-storefront * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          .luxury-storefront a {
            color: inherit;
          }
          .luxury-storefront button {
            font-family: inherit;
          }
          .luxury-storefront img {
            display: block;
            max-width: 100%;
          }
        `}</style>
      </div>
    </StoreProvider>
  );
}

// Export individual components for use elsewhere
export {
  StoreProvider,
  useStore,
  Header,
  NavigationMenu,
  SearchOverlay,
  LoginOverlay,
  FilterPanel,
  CartDrawer,
  ProductCard,
  CategoryHeader,
  HomepageHero,
  FeaturedGrid,
  ProductListingPage,
  Footer,
  PromoBanner,
  tokens,
  Icons,
};
