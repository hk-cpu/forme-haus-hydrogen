# Architecture

**Analysis Date:** 2026-02-11

## Pattern Overview

**Overall:** Remix + Hydrogen - Full-stack React with Shopify commerce

**Key Characteristics:**
- Server-side rendering (SSR) with edge deployment
- Data fetching via GraphQL to Shopify Storefront API
- Route-based architecture with loaders and actions
- Component-driven UI with Tailwind styling
- Client-side interactivity via React hooks and context

## Layers

**Routes (Pages):**
- Purpose: URL handling, data loading, form actions
- Location: `app/routes/`
- Contains: Route components, loader functions, action functions
- Depends on: Components, lib, hooks, graphql
- Used by: Remix router

**Components:**
- Purpose: Reusable UI elements
- Location: `app/components/`
- Contains: React components (tsx), styles (css)
- Depends on: lib, hooks, context
- Used by: Routes, other components

**Context:**
- Purpose: Global state management
- Location: `app/context/`
- Contains: UIContext (overlays, wishlist, menu state)
- Depends on: React
- Used by: Components, hooks

**Hooks:**
- Purpose: Reusable logic
- Location: `app/hooks/`
- Contains: Custom React hooks
- Depends on: React, Remix
- Used by: Components

**Library (lib):**
- Purpose: Utility functions, constants, types
- Location: `app/lib/`
- Contains: utils.ts, seo.server.ts, session.server.ts, type.ts
- Depends on: None
- Used by: Routes, components, hooks

**Data:**
- Purpose: Static data and configurations
- Location: `app/data/`
- Contains: countries.ts, cache.ts, fragments.ts
- Depends on: None
- Used by: Routes, lib

**GraphQL:**
- Purpose: API queries and mutations
- Location: `app/graphql/`
- Contains: customer-account/ mutations and queries
- Depends on: None
- Used by: Routes

## Data Flow

**Page Load:**
1. Request hits Remix route handler
2. `loader()` function executes (server-side)
3. GraphQL query sent to Shopify Storefront API
4. Data returned to component via `useLoaderData()`
5. Component renders with data
6. Deferred data streams in after initial render

**Cart Operations:**
1. User clicks "Add to Cart"
2. `CartForm` submits to cart action route
3. Shopify Cart API updated
4. Cart data revalidated across app
5. UI updates via `useCartFetchers` hook

**Authentication:**
1. User logs in via Customer Account API
2. OAuth flow to Shopify
3. Session cookie set
4. Protected routes check `customerAccount.isLoggedIn()`

**State Management:**
- Server state: Remix loaders + Hydrogen's cart/customer
- Client UI state: UIContext (useReducer pattern)
- Persistent state: localStorage (wishlist)

## Key Abstractions

**EnhancedMenu:**
- Purpose: Parsed Shopify menu with routing metadata
- Location: `app/lib/utils.ts`
- Pattern: Parser function adds `to`, `target`, `isExternal` to menu items

**UIContext:**
- Purpose: Global overlay and navigation state
- Location: `app/context/UIContext.tsx`
- Pattern: useReducer + React Context with convenience methods

**Route Loaders:**
- Purpose: Server-side data fetching
- Pattern: `loader()` → GraphQL → `defer()` for streaming

## Entry Points

**Server Entry:**
- Location: `app/entry.server.tsx`
- Purpose: Handle SSR requests, CSP headers, bot detection

**Client Entry:**
- Location: `app/entry.client.tsx`
- Purpose: Hydrate React app on client

**Root Route:**
- Location: `app/root.tsx`
- Purpose: App shell, layout data, SEO, analytics

## Error Handling

**Strategy:** Remix error boundaries + custom components

**Patterns:**
- Route-level: `ErrorBoundary` export in routes
- App-level: `ErrorBoundary` in `app/root.tsx`
- Components: `GenericError`, `NotFound` components
- API: Try/catch in loaders with fallback data

## Cross-Cutting Concerns

**Analytics:**
- Approach: `@shopify/hydrogen/Analytics` provider in root
- Tracks: Page views, cart events, Shopify pixels

**SEO:**
- Approach: `seoPayload` functions in `app/lib/seo.server.ts`
- Meta tags via `getSeoMeta()` in route meta exports

**i18n:**
- Approach: `useTranslation` hook (custom implementation)
- Languages: English, Arabic (RTL support)
- Locale detection from URL path prefix

**Security:**
- CSP headers in `entry.server.tsx`
- Input validation via TypeScript
- Shopfiy handles payment/auth security

---

*Architecture analysis: 2026-02-11*
