import type {ReactNode} from 'react';
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

// ============================================================================
// UI STATE TYPES
// ============================================================================

export interface UIState {
  // Overlay states
  isMenuOpen: boolean;
  isSearchOpen: boolean;
  isLoginOpen: boolean;
  isFilterOpen: boolean;
  isCartOpen: boolean;

  // Menu navigation
  menuLevel: number;
  menuPath: string[];

  // Promotional banner
  promoBannerVisible: boolean;
  promoBannerPaused: boolean;

  // Wishlist (local until synced with Shopify)
  wishlist: string[];

  // UI preferences
  reducedMotion: boolean;
}

type UIAction =
  | {type: 'TOGGLE_MENU'}
  | {type: 'CLOSE_MENU'}
  | {type: 'NAVIGATE_MENU'; category: string}
  | {type: 'BACK_MENU'}
  | {type: 'TOGGLE_SEARCH'}
  | {type: 'CLOSE_SEARCH'}
  | {type: 'TOGGLE_LOGIN'}
  | {type: 'CLOSE_LOGIN'}
  | {type: 'TOGGLE_FILTER'}
  | {type: 'CLOSE_FILTER'}
  | {type: 'TOGGLE_CART'}
  | {type: 'CLOSE_CART'}
  | {type: 'CLOSE_ALL_OVERLAYS'}
  | {type: 'TOGGLE_PROMO_PAUSE'}
  | {type: 'CLOSE_PROMO_BANNER'}
  | {type: 'TOGGLE_WISHLIST'; productId: string}
  | {type: 'SET_WISHLIST'; productIds: string[]}
  | {type: 'SET_REDUCED_MOTION'; enabled: boolean};

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: UIState = {
  isMenuOpen: false,
  isSearchOpen: false,
  isLoginOpen: false,
  isFilterOpen: false,
  isCartOpen: false,
  menuLevel: 0,
  menuPath: [],
  promoBannerVisible: true,
  promoBannerPaused: false,
  wishlist: [],
  reducedMotion: false,
};

// ============================================================================
// REDUCER
// ============================================================================

function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    // Menu
    case 'TOGGLE_MENU':
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen,
        menuLevel: 0,
        menuPath: [],
        // Close other overlays
        isSearchOpen: false,
        isLoginOpen: false,
        isFilterOpen: false,
        isCartOpen: false,
      };
    case 'CLOSE_MENU':
      return {...state, isMenuOpen: false, menuLevel: 0, menuPath: []};
    case 'NAVIGATE_MENU':
      return {
        ...state,
        menuLevel: state.menuLevel + 1,
        menuPath: [...state.menuPath, action.category],
      };
    case 'BACK_MENU':
      return {
        ...state,
        menuLevel: Math.max(0, state.menuLevel - 1),
        menuPath: state.menuPath.slice(0, -1),
      };

    // Search
    case 'TOGGLE_SEARCH':
      return {
        ...state,
        isSearchOpen: !state.isSearchOpen,
        isMenuOpen: false,
        isLoginOpen: false,
        isFilterOpen: false,
        isCartOpen: false,
      };
    case 'CLOSE_SEARCH':
      return {...state, isSearchOpen: false};

    // Login
    case 'TOGGLE_LOGIN':
      return {
        ...state,
        isLoginOpen: !state.isLoginOpen,
        isMenuOpen: false,
        isSearchOpen: false,
        isFilterOpen: false,
        isCartOpen: false,
      };
    case 'CLOSE_LOGIN':
      return {...state, isLoginOpen: false};

    // Filter
    case 'TOGGLE_FILTER':
      return {
        ...state,
        isFilterOpen: !state.isFilterOpen,
        isMenuOpen: false,
        isSearchOpen: false,
        isLoginOpen: false,
        isCartOpen: false,
      };
    case 'CLOSE_FILTER':
      return {...state, isFilterOpen: false};

    // Cart
    case 'TOGGLE_CART':
      return {
        ...state,
        isCartOpen: !state.isCartOpen,
        isMenuOpen: false,
        isSearchOpen: false,
        isLoginOpen: false,
        isFilterOpen: false,
      };
    case 'CLOSE_CART':
      return {...state, isCartOpen: false};

    // Close all
    case 'CLOSE_ALL_OVERLAYS':
      return {
        ...state,
        isMenuOpen: false,
        isSearchOpen: false,
        isLoginOpen: false,
        isFilterOpen: false,
        isCartOpen: false,
        menuLevel: 0,
        menuPath: [],
      };

    // Promo Banner
    case 'TOGGLE_PROMO_PAUSE':
      return {...state, promoBannerPaused: !state.promoBannerPaused};
    case 'CLOSE_PROMO_BANNER':
      return {...state, promoBannerVisible: false};

    // Wishlist
    case 'TOGGLE_WISHLIST':
      const isInWishlist = state.wishlist.includes(action.productId);
      const newWishlist = isInWishlist
        ? state.wishlist.filter((id) => id !== action.productId)
        : [...state.wishlist, action.productId];
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('formehaus_wishlist', JSON.stringify(newWishlist));
      }
      return {...state, wishlist: newWishlist};
    case 'SET_WISHLIST':
      return {...state, wishlist: action.productIds};

    // Accessibility
    case 'SET_REDUCED_MOTION':
      return {...state, reducedMotion: action.enabled};

    default:
      return state;
  }
}

// ============================================================================
// CONTEXT
// ============================================================================

interface UIContextValue {
  state: UIState;
  dispatch: React.Dispatch<UIAction>;
  // Convenience methods
  toggleMenu: () => void;
  toggleSearch: () => void;
  toggleLogin: () => void;
  toggleFilter: () => void;
  toggleCart: () => void;
  closeAllOverlays: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const UIContext = createContext<UIContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

export function UIProvider({children}: {children: ReactNode}) {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('formehaus_wishlist');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            dispatch({type: 'SET_WISHLIST', productIds: parsed as string[]});
          }
        } catch (e) {
          console.error('Failed to parse wishlist from localStorage');
        }
      }

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      dispatch({type: 'SET_REDUCED_MOTION', enabled: prefersReducedMotion});

      // Check if promo banner was closed in this session
      const promoClosed = sessionStorage.getItem('formehaus_promo_closed');
      if (promoClosed === 'true') {
        dispatch({type: 'CLOSE_PROMO_BANNER'});
      }
    }
  }, []);

  // Persist promo banner closed state
  useEffect(() => {
    if (typeof window !== 'undefined' && !state.promoBannerVisible) {
      sessionStorage.setItem('formehaus_promo_closed', 'true');
    }
  }, [state.promoBannerVisible]);

  // Lock body scroll when overlays are open
  useEffect(() => {
    const isAnyOverlayOpen =
      state.isMenuOpen ||
      state.isSearchOpen ||
      state.isLoginOpen ||
      state.isFilterOpen ||
      state.isCartOpen;

    if (typeof document !== 'undefined') {
      document.body.style.overflow = isAnyOverlayOpen ? 'hidden' : '';
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [
    state.isMenuOpen,
    state.isSearchOpen,
    state.isLoginOpen,
    state.isFilterOpen,
    state.isCartOpen,
  ]);

  // Escape key to close overlays
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch({type: 'CLOSE_ALL_OVERLAYS'});
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, []);

  // Stable convenience methods (dispatch is stable from useReducer)
  const toggleMenu = useCallback(
    () => dispatch({type: 'TOGGLE_MENU'}),
    [dispatch],
  );
  const toggleSearch = useCallback(
    () => dispatch({type: 'TOGGLE_SEARCH'}),
    [dispatch],
  );
  const toggleLogin = useCallback(
    () => dispatch({type: 'TOGGLE_LOGIN'}),
    [dispatch],
  );
  const toggleFilter = useCallback(
    () => dispatch({type: 'TOGGLE_FILTER'}),
    [dispatch],
  );
  const toggleCart = useCallback(
    () => dispatch({type: 'TOGGLE_CART'}),
    [dispatch],
  );
  const closeAllOverlays = useCallback(
    () => dispatch({type: 'CLOSE_ALL_OVERLAYS'}),
    [dispatch],
  );
  const toggleWishlist = useCallback(
    (productId: string) => dispatch({type: 'TOGGLE_WISHLIST', productId}),
    [dispatch],
  );
  const isInWishlist = useCallback(
    (productId: string) => state.wishlist.includes(productId),
    [state.wishlist],
  );

  const value: UIContextValue = useMemo(
    () => ({
      state,
      dispatch,
      toggleMenu,
      toggleSearch,
      toggleLogin,
      toggleFilter,
      toggleCart,
      closeAllOverlays,
      toggleWishlist,
      isInWishlist,
    }),
    [
      state,
      dispatch,
      toggleMenu,
      toggleSearch,
      toggleLogin,
      toggleFilter,
      toggleCart,
      closeAllOverlays,
      toggleWishlist,
      isInWishlist,
    ],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

// ============================================================================
// HOOK
// ============================================================================

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}

// ============================================================================
// MENU DATA (for navigation menu)
// ============================================================================

export const menuData = {
  level1: [
    {
      id: 'new',
      label: 'New to Haus',
      hasChildren: false,
      href: '/collections/new-in',
    },
    {
      id: 'phone-accessories',
      label: 'Phone Accessories',
      hasChildren: true,
      href: '/collections/phone-accessories',
    },
    {
      id: 'sunglasses',
      label: 'Sunglasses',
      hasChildren: false,
      href: '/collections/sunglasses',
    },
    {
      id: 'the-edit',
      label: 'The Edit',
      hasChildren: false,
      href: '/collections/the-edit',
    },
    {id: 'sale', label: 'Sale', hasChildren: false, href: '/collections/sale'},
  ],
  'phone-accessories': {
    image:
      'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=800&q=80',
    categories: [
      {label: 'Phone Cases', href: '/collections/phone-cases'},
      {label: 'Phone Straps', href: '/collections/phone-straps'},
    ],
  },
};

// ============================================================================
// PROMO MESSAGES
// ============================================================================

export const promoMessages = [
  {text: 'Free Shipping on Orders over 299 SAR', href: '/collections'},
  {text: 'Discover the New Collection', href: '/collections/new-in'},
  {
    text: 'Explore Our Curated Selection',
    href: '/collections',
  },
  {text: 'Phone Cases, Sunglasses & Accessories', href: '/collections'},
];
