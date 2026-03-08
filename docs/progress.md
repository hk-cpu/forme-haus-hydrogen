# Forme Haus — Progress Log

---

## Session: 2026-02-09

**Focus**: Auth fixes — 500 errors on account pages

### Changes

- `root.tsx` — Fixed deferred data error handling
- `($locale).account.$.tsx` — Session-based auth instead of `customerAccount.handleAuthStatus()`
- `($locale).account_.authorize.ts` — Redirect to login
- `($locale).account.edit.tsx` — Converted to Storefront API mutations
- `($locale).account.address.$id.tsx` — Storefront API mutations
- `($locale).account.orders.$id.tsx` — Storefront API queries
- `PageLayout.tsx` — Removed unused `useNavigation` import

**Root Cause**: Code mixed Customer Account API with old Storefront API. Fixed by converting all account routes to Storefront API (`customerAccessToken` pattern).

---

## Session: 2026-03-03 (Phase 1)

**Focus**: Mobile responsiveness — 20 issues reported

### Changes (12 of 20 actionable)

- `Header.tsx` — Removed `!isHome` guard from hamburger menu (always visible on mobile)
- `Hero.tsx` — CTA button touch target `min-h-[48px]`
- `CategoryBento.tsx` — Responsive grid `grid-cols-1 sm:grid-cols-2 md:grid-cols-3`
- `EditorialSection.tsx` — Mobile aspect ratio `aspect-[16/9]` on side cards
- `PaymentBadges.tsx` — Flex-wrap for payment icons on mobile
- `Newsletter.tsx` — Responsive stacking
- `app.css` — Touch target rules, iOS font-size 16px, mobile snap sections
- `PageLayout.tsx` — Footer responsive stacking, CR info layout

---

## Session: 2026-03-03 (Phase 2)

**Focus**: Product image sizing — all product images cropped

### Changes

- `SearchOverlay.tsx` — Search result images: `object-cover` → `object-contain p-3`
- `SearchOverlay.tsx` — Recommendation images: `object-cover` → `object-contain p-3`
- `Cart.tsx` — Cart line item images: `object-cover` → `object-contain p-1.5`
- `ProductGallery.tsx` — Thumbnails: `object-cover` → `object-contain p-1 bg-[#F5F2ED]`
- `CategorySlider.tsx` — Reverted to `object-cover` (editorial background images, intentional)

**Strategy**: Distinguish product images (`object-contain`) from editorial backgrounds (`object-cover`)

---

## Session: 2026-03-04 (Phase 3)

**Focus**: UI polish — oversized sections, search redesign, blur effect, sizing normalization

### Changes

#### Sizing Normalization

- `Hero.tsx` — `h-[85vh]` → `h-[70vh]`, logo `h-52` → `h-40`, `mb-12` → `mb-8`
- `($locale)._index.tsx` — Section padding `py-24` → `py-14`, gaps tightened
- `CategoryBento.tsx` — `pb-24` → `pb-14`, header margin `mb-12` → `mb-8`
- `EditorialSection.tsx` — `lg:min-h-[540px]` → `lg:min-h-[380px]`
- `($locale).products.$productHandle.tsx` — Title `text-7xl` → `text-5xl`
- `($locale).collections.$collectionHandle.tsx` — Hero `h-[50vh]` → `h-[38vh]`, title `text-6xl` → `text-5xl`

#### Search Bar Redesign

- `SearchOverlay.tsx` — Full rewrite: full-screen dark overlay → minimalist slide-down panel
  - Slide animates from `y: '-100%'` on open
  - Backdrop click, Cancel button, Escape key all dismiss
  - Products in compact square grid (up to 6 columns)
  - Trending pills in default state (no mock product recommendations)
  - Results drop within max-h-[70vh] scrollable area

#### BlurRevealImage Redesign

- `BlurRevealImage.tsx` — Full rewrite: linear breathing → camera autofocus hunt→lock
  - Scroll-in: blur hunts (10px→14px→0px) then relaxes to idle (3px)
  - Idle breathing: opacity [0, 0.3, 1, 0.55, 0.55, 0] cycles with Infinity repeat
  - Hover: spring-like scale overshoot ease [0.34, 1.56, 0.64, 1]
  - Added vignette gradient layer for camera-lens depth

#### Project Setup

- Created `CLAUDE.md` — project memory file for session continuity
- Created `docs/` directory and `docs/progress.md`

### Pending / Next Session

- Agent review findings to be applied (10 agents reviewing all changes)
- Consider adding CategorySlider sunglasses to `object-contain` review
- Consider product page layout review (gallery vs info column proportions)
