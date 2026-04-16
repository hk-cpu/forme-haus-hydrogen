# Agents Guide

Scope: entire repository.

Purpose: Align all coding/design agents on how to build and style this Hydrogen storefront consistently.

## Build & Run

- Framework: Shopify Hydrogen (Remix + Vite)
- Dev: `npm run dev`
- Build: `npm run build`
- Env: update `.env` with storefront domain and token.

## Design Source of Truth

- Read `DESIGN.md` for visual language, tokens, and component guidelines.
- Tokens live in `app/styles/app.css` (Tailwind v4 `@theme`). Avoid raw hex in components.
- Reference sizing and UX notes in `CLAUDE.md`.

## Components

- Prefer shared UI primitives in `app/components/ui/` (e.g., `Button.tsx`).
- Use tokenized utilities: `bg-bronze`, `text-foreground`, `border-taupe`, etc.
- Maintain focus styles (`focus-visible:ring-bronze`). Respect reduced motion.

## i18n & Layout

- Locale prefix route `($locale)` for Arabic/English. Use `useTranslation`.
- For Arabic, use `font-arabic` and ensure layout mirroring where needed.

## Do / Don’t

- Do: Keep animations subtle and token-driven.
- Do: Centralize reusable patterns in `app/components/ui/`.
- Don’t: Introduce design changes without updating `DESIGN.md`.
- Don’t: Depend on Customer Account API login flows; use session-based auth.
