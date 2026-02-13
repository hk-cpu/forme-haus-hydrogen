# Codebase Structure

**Analysis Date:** 2026-02-11

## Directory Layout

```
app/
├── assets/              # Static assets (favicon, logos)
├── components/          # React UI components
├── context/             # React Context providers
├── data/                # Static data, cache configs
├── graphql/             # GraphQL queries/mutations
│   └── customer-account/# Customer API operations
├── hooks/               # Custom React hooks
├── lib/                 # Utilities, types, server functions
├── routes/              # Remix route files
│   └── ($locale).*/     # Localized routes
├── styles/              # Global CSS, fonts
├── entry.client.tsx     # Client entry point
├── entry.server.tsx     # Server entry point
├── root.tsx             # Root layout component
```

## Directory Purposes

**app/routes/:**
- Purpose: URL routes and API endpoints
- Contains: Route components with loaders/actions
- Key files: `($locale)._index.tsx` (homepage), `($locale).products.$handle.tsx` (PDP)

**app/components/:**
- Purpose: Reusable UI components
- Contains: 50+ components for all UI elements
- Key files: `PageLayout.tsx`, `Header.tsx`, `Cart.tsx`, `ProductCard.tsx`

**app/context/:**
- Purpose: Global state management
- Contains: `UIContext.tsx` - overlay states, wishlist, menu navigation

**app/lib/:**
- Purpose: Shared utilities and server functions
- Contains:
  - `utils.ts` - Helper functions, menu parsing
  - `seo.server.ts` - SEO metadata generation
  - `session.server.ts` - Session management
  - `type.ts` - TypeScript types
  - `translations.ts` - i18n strings

**app/hooks/:**
- Purpose: Custom React hooks
- Contains:
  - `useCartFetchers.tsx` - Cart operation tracking
  - `useIsHydrated.tsx` - Hydration detection
  - `useTranslation.ts` - i18n hook

**app/data/:**
- Purpose: Static configurations
- Contains:
  - `countries.ts` - Locale/country definitions
  - `cache.ts` - Route cache headers
  - `fragments.ts` - GraphQL fragments

**app/graphql/:**
- Purpose: GraphQL operations
- Contains: Customer account mutations and queries

**app/styles/:**
- Purpose: Global styles and fonts
- Contains:
  - `app.css` - Tailwind directives + custom CSS
  - `futuristic-polish.css` - Custom animations
  - `custom-font.css` - Font definitions
  - `fonts/` - WOFF2 font files

## Key File Locations

**Entry Points:**
- `app/entry.server.tsx` - Server-side rendering
- `app/entry.client.tsx` - Client hydration
- `app/root.tsx` - App shell, providers, layout

**Configuration:**
- `vite.config.ts` - Vite + Remix + Hydrogen config
- `tsconfig.json` - TypeScript paths (`~/*` → `app/*`)
- `package.json` - Scripts and dependencies

**Core Commerce:**
- `app/components/Cart.tsx` - Shopping cart UI
- `app/components/AddToCartButton.tsx` - Add to cart functionality
- `app/routes/($locale).cart.tsx` - Cart page route
- `app/routes/($locale).products.$productHandle.tsx` - Product detail page

**Account:**
- `app/routes/($locale).account.tsx` - Account dashboard
- `app/routes/($locale).account_.login.tsx` - Login page
- `app/graphql/customer-account/` - Auth mutations

## Naming Conventions

**Files:**
- Components: PascalCase (`ProductCard.tsx`)
- Routes: Remix convention with `$` for params (`($locale).products.$handle.tsx`)
- Utilities: camelCase (`utils.ts`)
- Server-only: `.server.ts` suffix (`seo.server.ts`)
- Client-only: `.client.tsx` suffix (`Silk.client.tsx`)

**Directories:**
- kebab-case for multi-word (`customer-account/`)

## Where to Add New Code

**New Route/Page:**
- Route file: `app/routes/($locale).{route-name}.tsx`
- For locale-aware routes, use `($locale).` prefix

**New Component:**
- Implementation: `app/components/{ComponentName}.tsx`
- If client-only (uses browser APIs): `{ComponentName}.client.tsx`

**New Utility:**
- Shared helpers: `app/lib/{name}.ts`
- Type definitions: `app/lib/type.ts`

**New GraphQL Query:**
- Define in route file or `app/graphql/{domain}/`
- Add fragments to `app/data/fragments.ts`

**New Style Variants:**
- Global styles: `app/styles/{name}.css`
- Component styles: Co-locate in component file (Tailwind)

## Special Directories

**app/routes/($locale).*/:**
- Purpose: Localized routes (EN/AR support)
- Generated: No - hand-written
- Pattern: Route params for locale detection

**build/:**
- Purpose: Production build output
- Generated: Yes (by `shopify hydrogen build`)
- Committed: No (in .gitignore)

**node_modules/:**
- Purpose: Dependencies
- Generated: Yes
- Committed: No

---

*Structure analysis: 2026-02-11*
