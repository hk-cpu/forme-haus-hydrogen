# Forme Haus — CLAUDE.md

## Project Summary
Shopify Hydrogen v2024.10 e-commerce storefront for formehaus.me — a luxury lifestyle brand selling phone cases, phone straps, sunglasses, and accessories (Saudi Arabia market, SAR currency).

## Tech Stack
- **Framework**: Shopify Hydrogen v2024.10 + Remix v2 + Vite
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion (motion, AnimatePresence, useInView)
- **Auth**: OLD Storefront API `customerAccessToken` approach (NOT Customer Account API)
- **Session**: Cookie-based via `AppSession` — `session.get()` is **synchronous**
- **i18n**: `($locale)` optional route prefix; Arabic/English with `useTranslation` hook

## Route Architecture
- Locale prefix: `($locale)` optional — alias files re-export from locale files
- Auth: session-based (`storefront.mutate(LOGIN_MUTATION)`), NOT `customerAccount.query()`
- Three.js components (Silk, Atmosphere, GhostCursor) are client-only via lazy import

## Key Files
- `app/components/Header.tsx` — fixed nav, scroll-hide behavior, search/cart triggers
- `app/components/Hero.tsx` — h-[70vh] logo section with motion line SVG
- `app/components/SearchOverlay.tsx` — minimalist slide-down search panel (NOT full-screen)
- `app/components/BlurRevealImage.tsx` — camera autofocus blur/reveal with hunt→lock sequence
- `app/components/CategoryBento.tsx` — 3-card bento grid (New In, Phone Cases, Sunglasses)
- `app/components/EditorialSection.tsx` — The Edit editorial grid
- `app/components/ProductGallery.tsx` — 3D rotating carousel with thumbnails
- `app/components/Cart.tsx` — side drawer cart
- `app/context/UIContext.tsx` — global state: isSearchOpen, isCartOpen, isMenuOpen, isLoginOpen
- `app/styles/app.css` — global styles, CSS variables, mobile snap

## Design Tokens
- Brand gold: `#a87441` / `#D4AF87`
- Dark bg: `#121212` / `#1A1A1A`
- Light bg: `#F9F5F0` / `#F0EAE6`
- Text muted: `#AA9B8F` / `#8B8076`
- Font: serif (editorial) + sans (body)
- Nav font size: `text-[11px] uppercase tracking-[0.25em]`

## Image Strategy
- **Product images**: `object-contain` with padding (p-3 to p-6) — show full product
- **Editorial/brand images**: `object-cover` — intentional fills behind text overlays
- All brand images in `/public/brand/` as `.webp` + blur variants as `-blur.webp/.png`

## Sizing Conventions (normalized Mar 2026)
- Hero: `h-[70vh] md:h-[75vh]` (was 85/90)
- Section padding: `py-10 md:py-14` (was py-16/py-24)
- Category section top: `pt-10 md:pt-14`
- Editorial min-h: `lg:min-h-[380px]` (was 540)
- Product title: `text-3xl md:text-4xl lg:text-5xl` (was 7xl)
- Collection title: `text-3xl md:text-4xl lg:text-5xl` (was 6xl)
- Collection hero: `h-[30vh] md:h-[38vh]` (was 40/50vh)

## Search Architecture
- `UIContext`: `TOGGLE_SEARCH` / `CLOSE_SEARCH` actions
- `SearchOverlay`: slide-down panel from top, z-[300], NOT full-screen overlay
- Backdrop at z-[299] with `bg-black/40 backdrop-blur-sm`
- Escape key, Cancel button, and backdrop click all dismiss
- Predictive search: `/api/predictive-search?q=...&limit=6` with 300ms debounce

## Known Issues / Watch Points
- `customerAccount.isLoggedIn()` causes 500s — use session-based auth only
- Hydrogen `check routes` warns about 14 missing routes (alias files not detected)
- `session.get()` is synchronous — don't chain `.then()`

## Active Branches
- `main` — production branch

## See Also
- `docs/progress.md` — session history and completed work log
