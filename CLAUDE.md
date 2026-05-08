# Forme Haus — Claude Context

This file gives Claude (and any AI agent) full context about this codebase so no
token is wasted re-discovering architecture. Update it whenever a significant
change is made.

---

## Project Overview

**Forme Haus** is a luxury fashion e-commerce storefront (Saudi Arabia) built
with Shopify Hydrogen (Remix + React). The site is bilingual (English / Arabic),
RTL-aware, and targets the GCC market with SAR pricing.

- **Live domain:** formehaus.me
- **Checkout domain:** shop.formehaus.me (Shopify hosted checkout)
- **Shopify store:** configured via `PUBLIC_STORE_DOMAIN`
- **Hosting:** Shopify Oxygen (deployed via GitHub Actions in `forme-haus-static-` repo)

---

## Repos

| Repo | Purpose |
|------|---------|
| `hk-cpu/forme-haus-hydrogen` | Main storefront code (this repo) |
| `hk-cpu/forme-haus-static-` | Oxygen deployment workflow config |

---

## Tech Stack

- Remix 2.17.4 + React 18
- Shopify Hydrogen 2024.10.2
- TypeScript 5.2
- Tailwind CSS 4
- Framer Motion (animations)
- Lenis (smooth scroll, desktop only)
- Google SSO (`@react-oauth/google`)
- Resend (transactional email)

---

## Checkout Approach — CURRENT: Shopify Native

The **active checkout flow** is Shopify's hosted checkout:

1. Customer clicks "Proceed to Checkout" in the cart drawer/page
2. Browser navigates to `cart.checkoutUrl` (Shopify-hosted, branded via `PUBLIC_CHECKOUT_DOMAIN`)
3. Customer pays on Shopify's checkout page
4. Order created automatically by Shopify

**Do NOT re-introduce custom Tap Payments checkout unless explicitly requested.**
The code for it still exists in these files (kept for reference, not active):
- `app/routes/($locale).checkout.tsx` — 3-step custom form
- `app/routes/($locale).checkout_.success.tsx` — Tap callback handler
- `app/routes/($locale).tap.initiate.tsx`
- `app/routes/($locale).tap.webhook.tsx`
- `app/lib/checkout.server.ts` — Session helpers
- `app/lib/email.server.ts` — Resend order confirmation

The `app/routes/($locale).hyperpay.*` routes are legacy dead code.

---

## Key Files

### Routes (all under `app/routes/`)

| File | What it does |
|------|--------------|
| `($locale)._index.tsx` | Homepage |
| `($locale).cart.tsx` | Cart page (GET + POST actions for add/remove/update/discount/note) |
| `($locale).cart.$lines.tsx` | Quick-add via URL `/cart/<variantId>:<qty>` → redirects to `checkoutUrl` |
| `($locale).products.$productHandle.tsx` | Product detail page |
| `($locale).collections.$collectionHandle.tsx` | Collection/category page |
| `($locale).account*.tsx` | Account, login, register, orders, address, wishlist |
| `($locale).search.tsx` | Search results |
| `($locale).contact.tsx` | Contact form |
| `($locale).policies.*.tsx` | Policy pages |
| `($locale).journal*.tsx` | Editorial/blog |
| `api.address-search.tsx` | Server proxy for Nominatim address autocomplete |
| `api.newsletter.tsx` | Newsletter signup |

### Components (all under `app/components/`)

| File | What it does |
|------|--------------|
| `Cart.tsx` | Cart drawer and cart page UI — discount codes, notes, checkout button |
| `Header.tsx` | Sticky navbar — hides on scroll down, shows on scroll up; language toggle; cart badge |
| `AccountOverlay.tsx` | Login/register slide-over |
| `FeaturedProducts.tsx` | Product carousel for empty cart and homepage |

### Library (all under `app/lib/`)

| File | What it does |
|------|--------------|
| `translations.ts` | EN/AR string map (28 KB) |
| `translationOverrides.ts` | Project-specific override strings |
| `utils.ts` | Locale helpers (`buildLocalePath`, `getPathLocalePrefix`), menu parsing |
| `checkout.server.ts` | Session persistence for checkout data (used by Tap, dormant with native checkout) |
| `email.server.ts` | Resend order confirmation email template |
| `seo.server.ts` | SEO meta helpers |

### Hooks / Context

- `hooks/useTranslation.ts` — `t(key, fallback)` + `isRTL` flag
- `context/UIProvider.tsx` — Cart drawer open/close state, search overlay, account overlay

---

## Environment Variables

Set these in **Shopify admin → Hydrogen → [your storefront] → Environments and variables**.

```
# Required — Shopify Storefront
SESSION_SECRET
PUBLIC_STOREFRONT_API_TOKEN
PRIVATE_STOREFRONT_API_TOKEN
PUBLIC_STORE_DOMAIN          # e.g. your-shop.myshopify.com
PUBLIC_STOREFRONT_ID
PUBLIC_CHECKOUT_DOMAIN       # e.g. shop.formehaus.me
SHOP_ID

# Required — Customer Accounts
PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID
PUBLIC_CUSTOMER_ACCOUNT_API_URL

# Optional — Google SSO
PUBLIC_GOOGLE_CLIENT_ID

# Optional — Resend (transactional email, used by dormant Tap checkout)
RESEND_API_KEY

# Optional — Shopify Admin API (used by dormant Tap checkout to create orders)
SHOPIFY_ADMIN_API_TOKEN      # Scopes: write_orders, read_customers

# Optional — Tap Payments (dormant, not active checkout)
TAP_SECRET_KEY
TAP_PUBLIC_KEY
TAP_API_URL                  # https://api.tap.company/v2
TAP_WEBHOOK_SECRET
```

**Minimum required for the site to function:** All `PUBLIC_*` Shopify variables +
`SESSION_SECRET` + `PRIVATE_STOREFRONT_API_TOKEN`.

---

## Localization

- Locale prefix in URL: `/ar/...` for Arabic, no prefix for English
- `($locale)` in route file names makes the prefix optional
- `buildLocalePath(path, locale)` — prepends locale prefix correctly
- `getPathLocalePrefix(pathname)` — extracts locale from current URL
- RTL: `isRTL` from `useTranslation()`, set `dir="rtl"` on containers
- Translations: `t('key', 'English fallback')`

---

## Cart Architecture

- Cart state: Shopify's cart API via Hydrogen's `cart` context
- Cart ID stored in a cookie (`cart` cookie, set via `cart.setCartId()`)
- Country hard-coded to Saudi Arabia (`SA`) — set on empty carts in the cart action
- Discount codes, delivery notes, and buyer identity all use `CartForm` actions

---

## Styling

- Tailwind CSS 4 with custom theme tokens in `app/styles/app.css`:
  - `bg-background` / `bg-surface` — dark backgrounds
  - `text-warm` — near-white primary text
  - `text-taupe` — muted secondary text
  - `text-bronze` / `bg-bronze` — primary accent (gold-brown)
- `app/styles/futuristic-polish.css` — additional polish styles
- All components use these tokens; avoid raw hex unless for third-party badge colors

---

## Common Pitfalls

1. **Checkout back-and-forth:** The repo has history of switching between Tap
   Payments and Shopify native checkout multiple times. The current choice is
   **Shopify native**. Before changing, confirm with the user.

2. **`cart.checkoutUrl` vs `/checkout`:** The cart checkout button and
   `cart.$lines.tsx` must use `cart.checkoutUrl` (native), not `Link to="/checkout"`
   (Tap form).

3. **RTL layout:** When editing Header or Cart, test both `dir="ltr"` and
   `dir="rtl"`. Flex direction, text alignment, and padding need conditional classes.

4. **Reverts:** Many branches starting with `claude/` are old feature branches.
   Do not re-merge them without reviewing their contents — many have been
   superseded by later commits on `main`.

5. **Draft Orders:** The Tap checkout creates Draft Orders in Shopify Admin. With
   native checkout active, no draft orders are created — Shopify handles everything.

---

## Development Workflow

```bash
npm install
npm run dev          # starts local dev server (requires .env)
npm run build        # production build
npm run typecheck    # TypeScript check
npm run lint         # ESLint
```

Local `.env` must be populated from `.env.example`. The Shopify Hydrogen CLI
also supports `shopify hydrogen env pull` to pull from Oxygen.

---

## Branch Strategy

- `main` — production branch, deployed to Oxygen automatically
- `claude/fix-website-issues-cYCIU` — current working branch for Claude fixes
- All Claude fix branches should be PRd into `main` and merged before starting
  new work to avoid divergence issues.

---

## Step-by-Step Completion Checklist

Things confirmed fixed or in progress:
- [x] Checkout button → Shopify native `checkoutUrl`
- [x] `cart.$lines` redirect → `checkoutUrl`
- [ ] Verify `PUBLIC_CHECKOUT_DOMAIN` domain rewrite (optional, needed if branded checkout URL is required)
- [ ] Audit and fix any TypeScript errors
- [ ] Test cart flow end-to-end
- [ ] Test Arabic / RTL layout
- [ ] Verify account login / register works
- [ ] Review page speed and images
- [ ] Clean up dead Tap-related routes (optional, low priority)
