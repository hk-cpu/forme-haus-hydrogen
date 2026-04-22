# Agents Guide

Scope: entire repository. Any AI coding agent (Claude Code, Codex, Cursor, Cline, Aider, etc.) should read this first.

Purpose: Align all agents on project conventions so work can continue across sessions/tools without re-discovering context.

## Project Summary

Shopify Hydrogen v2024.10 storefront for **formehaus.me** — luxury lifestyle brand (phone cases, phone straps, sunglasses). Saudi Arabia market, SAR currency, Arabic + English.

## Build & Run

- Framework: Shopify Hydrogen (Remix v2 + Vite), Tailwind v4, Framer Motion
- Dev: `npm run dev`
- Build: `npm run build`
- Type check: `npm run typecheck`
- Lint: `npm run lint`
- Format: `npx prettier --write <paths>`
- Env: `.env` needs storefront domain + Storefront API token

## Design Source of Truth

- `DESIGN.md` — visual language, tokens, component guidelines
- `CLAUDE.md` — sizing/UX notes, architectural quirks
- Tokens in `app/styles/app.css` (Tailwind v4 `@theme`). **Do not use raw hex in components** — use `bg-bronze`, `text-foreground`, `border-taupe`, `text-brand-text`, etc.
- Brand gold: `#a87441` / `#D4AF87` · Dark: `#121212`/`#1A1A1A` · Light: `#F9F5F0`/`#F0EAE6`

## Branch & PR Workflow

- Work on `claude/<feature-slug>` branches (or `agent/<slug>` for non-Claude agents). Never push directly to `main`.
- Flow: commit → `git push -u origin <branch>` → open **draft PR** → mark ready → squash-merge.
- Commit messages: concise summary line, include Claude Code session URL footer when using Claude Code.
- Use GitHub MCP tools (`mcp__github__*`) when available; fall back to `gh` CLI otherwise.

## Project Landmarks

### Routes (`app/routes/`)

- Locale-prefixed: `($locale).*.tsx` — alias files at non-prefixed paths re-export
- Collections: `($locale).collections.$collectionHandle.tsx`
- Products: `($locale).products.$productHandle.tsx`
- Tap Payments: `api.tap.initiate.ts`, `api.tap.callback.ts`, `api.tap.webhook.ts`
- Account (session-based auth, not Customer Account API)

### Key Components (`app/components/`)

- `Header.tsx` — fixed nav with scroll-hide
- `Hero.tsx` — `h-[70vh]` logo section
- `CategoryBento.tsx` — homepage 3-card grid: New In, Phone Accessories, Sunglasses (Phone Cases/Straps were merged into one Phone Accessories card)
- `CategoryHeader.tsx` — collection page sticky tab bar. Primary tabs: Shop All / Phone Accessories / Sunglasses. Phone Accessories is a **parent**; sub-tabs (Phone Cases / Phone Straps) render when `collectionHandle ∈ {phone-accessories, phone-cases, phone-straps}`.
- `EditorialCollectionView.tsx` — editorial grid layout engine (section types: `hero`, `asymmetric`, `scattered`, `row`, `quote`, `hero-side`, `wide`, `bundle-pricing`)
- `BundlePricing.tsx` — bundle tier cards (Case Only / Case+Strap / Complete Set); pass `variant="cards"` for editorial placement
- `SearchOverlay.tsx` — slide-down panel (z-[300]), NOT full-screen
- `Cart.tsx` — side drawer; exposes both Tap and Shopify checkout buttons
- `ProductGallery.tsx` — 3D rotating carousel

### State & i18n

- `app/context/UIContext.tsx` — global UI state (search/cart/menu/login/filter toggles)
- `app/hooks/useTranslation.ts` + `app/lib/translations.ts` — EN/AR key-value map. Add keys in **both** locales.
- For Arabic: `font-arabic`, `dir="rtl"`, mirror directional icons/animations.

## Content Conventions

- **Bundle products**: product `title` contains a `+` character. Collection loader for `carry-it-your-way` and the `EditorialProductCard` bundle badge both key off this.
- **Editorial collection handles** with configured layouts: `modern-essentials`, `carry-it-your-way` (has `bundle-pricing` section), `sun-ready`, `new-arrivals`. Unconfigured handles fall back to the standard product grid — do **not** reintroduce a `generateDynamicEditorialConfig` fallback (was reverted in commit `eea0263`).
- **Phone handles**: `phone-accessories`, `phone-cases`, `phone-straps` (grouped in `PHONE_HANDLES` set in `CategoryHeader.tsx`).

## Auth Quirks

- Use **Storefront API `customerAccessToken`** (session-based), NOT Customer Account API. `customerAccount.isLoggedIn()` causes 500s.
- `AppSession.get()` is **synchronous** — don't `.then()` it.
- Three.js components (Silk, Atmosphere, GhostCursor) are **client-only** via lazy import.

## Known Pre-existing CI Failures (ignore unless your change touched them)

- **Prettier** — ~17 files unformatted on `main`
- **ESLint** — `EditorialCollectionView.tsx` has pre-existing warnings
- **Typescript** — Money `currencyCode`, HyperPay, products `tags` type issues
- **Playwright** — flaky e2e tests; browser install sometimes fails in CI
- **Oxygen PRODUCTION deploy** — fails until the `OXYGEN_DEPLOYMENT_TOKEN_1000082807` repo secret is set in GitHub → Settings → Secrets and variables → Actions. Oxygen **PREVIEW** deploys succeed per PR; that's the signal that matters until prod credentials are wired.

Before attributing a CI failure to your change, diff against `main` to confirm it's new.

## Sizing Conventions (normalized Mar 2026)

- Hero: `h-[70vh] md:h-[75vh]`
- Section padding: `py-10 md:py-14`
- Editorial min-h: `lg:min-h-[380px]`
- Product title: `text-3xl md:text-4xl lg:text-5xl`
- Collection hero: `h-[30vh] md:h-[38vh]`
- Nav text: `text-[11px] uppercase tracking-[0.25em]`

## Image Strategy

- **Product images**: `object-contain` with padding (p-3 → p-6) — show full product
- **Editorial/brand images**: `object-cover` — intentional fills behind text overlays
- Brand images live in `/public/brand/` as `.webp` + `-blur.webp/.png` variants

## Do / Don't

- Do: Keep animations subtle and token-driven.
- Do: Centralize reusable patterns in `app/components/ui/`.
- Do: Add EN **and** AR translation keys together.
- Do: Test locale-prefixed route (`/ar/collections/…`) when touching collection/product pages.
- Don't: Introduce design changes without updating `DESIGN.md`.
- Don't: Depend on Customer Account API login flows.
- Don't: Re-add the dynamic editorial fallback for unconfigured collections.
- Don't: Push directly to `main` — always via PR.
