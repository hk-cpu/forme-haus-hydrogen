# External Integrations

**Analysis Date:** 2026-02-11

## APIs & External Services

**Shopify Storefront API:**
- Purpose: Product data, collections, cart, checkout
- SDK: `@shopify/hydrogen` (built-in)
- Auth: `PUBLIC_STOREFRONT_API_TOKEN` (env var)
- Endpoint: `PUBLIC_STORE_DOMAIN`

**Shopify Customer Account API:**
- Purpose: Authentication, account management, orders
- SDK: `@shopify/hydrogen` (Customer Account API client)
- Auth: OAuth via Shopify
- Files: `app/graphql/customer-account/*`

## Data Storage

**Databases:**
- Shopify (external) - Product catalog, orders, customers
- No local database

**File Storage:**
- Shopify CDN - Product images
- Local assets - Brand images in `public/brand/`

**Caching:**
- Oxygen edge caching (deployment platform)
- Route-level cache headers in `app/data/cache.ts`

## Authentication & Identity

**Auth Provider:** Shopify Customer Account API
- Implementation: OAuth 2.0 flow
- Routes: `app/routes/($locale).account_.*.tsx`
- Session: Cookie-based via `session.server.ts`

**Protected Routes:**
- `/account/*` - Requires login
- Uses `customerAccount.isLoggedIn()` check

## Monitoring & Observability

**Error Tracking:** None detected (recommend Sentry)

**Logs:**
- Server-side: `console.error()` for errors
- Client-side: `console.error()` for errors
- No centralized logging service

**Analytics:**
- Shopify Analytics (via Hydrogen `<Analytics.Provider>`)
- Page views, cart events, customer events

## CI/CD & Deployment

**Hosting:** Shopify Oxygen (edge workers)

**Build Command:**
```bash
shopify hydrogen build
```

**CI Pipeline:** None detected (recommend GitHub Actions)

**Local Development:**
```bash
shopify hydrogen dev --codegen
```

## Environment Configuration

**Required env vars:**
- `PUBLIC_STORE_DOMAIN` - Shopify store domain
- `PUBLIC_STOREFRONT_API_TOKEN` - Storefront API access token
- `SHOP_ID` - Shopify shop ID
- `PUBLIC_CHECKOUT_DOMAIN` - Checkout domain

**Secrets location:** `.env` file (not committed)

## Webhooks & Callbacks

**Incoming:** None (headless storefront)

**Outgoing:** None (relies on Shopify webhooks to external services)

## Third-Party Libraries

**UI/UX:**
- `@headlessui/react` - Accessible UI primitives
- `lucide-react` - Icons
- `framer-motion` - Animations

**3D/Graphics:**
- `three` + `@react-three/fiber` - 3D product viewer

**Utilities:**
- `clsx` - Class name utilities
- `lenis` - Smooth scrolling
- `react-intersection-observer` - Scroll detection
- `react-use` - Utility hooks

**Internationalization:**
- Custom implementation in `app/lib/translations.ts`
- Languages: English (EN), Arabic (AR)

---

*Integration audit: 2026-02-11*
