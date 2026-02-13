# Technology Stack

**Analysis Date:** 2026-02-11

## Project

**Name:** Formé Haus  
**Type:** Luxury Fashion E-commerce (Saudi Arabia)  
**Version:** 2.1.6

## Languages

**Primary:**
- TypeScript 5.2+ - All source code (`app/**/*.ts`, `app/**/*.tsx`)
- GraphQL - Storefront API queries

**Secondary:**
- CSS/Tailwind - Styling (`app/styles/*.css`)
- PostCSS - CSS processing

## Runtime

**Environment:**
- Node.js >=20.0.0 (ES2022 modules)
- Oxygen (Shopify's edge runtime for workers)

**Package Manager:**
- npm (package-lock.json present)

## Frameworks

**Core:**
- **Shopify Hydrogen** 2024.10.2 - React framework for headless commerce
- **Remix** 2.17.4 - Full-stack React framework (routing, loaders, actions)
- **React** 18.2.0 - UI library
- **React Router** - Navigation (bundled with Remix)

**Styling:**
- **Tailwind CSS** 4.1.18 - Utility-first CSS
- **Framer Motion** 12.25.0 - Animations and transitions
- **@headlessui/react** 1.7.2 - Accessible UI primitives

**3D/Visual:**
- **Three.js** 0.182.0 - 3D rendering
- **@react-three/fiber** 8.16.0 - React renderer for Three.js
- **lenis** 1.3.17 - Smooth scrolling

**Build/Dev:**
- **Vite** 5.1.0 - Build tool and dev server
- **@shopify/mini-oxygen** 3.1.1 - Local Oxygen simulation
- **TypeScript** 5.2.2 - Type checking

**Testing:**
- **Playwright** 1.48.2 - E2E testing

## Key Dependencies

**Critical Commerce:**
- `@shopify/hydrogen` - Core commerce components (Cart, Analytics, Image)
- `@shopify/remix-oxygen` - Oxygen runtime adapter for Remix
- `@shopify/cli` - Shopify CLI for deployment

**UI/UX:**
- `lucide-react` - Icon library
- `clsx` - Conditional class merging
- `react-intersection-observer` - Scroll-triggered animations
- `react-use` - Utility hooks

**Forms/Data:**
- `tiny-invariant` - Runtime assertions
- `graphql-tag` - GraphQL query parsing

**SEO:**
- `schema-dts` - Schema.org TypeScript types

## Configuration

**Build:**
- `vite.config.ts` - Vite + Remix + Hydrogen + Oxygen plugins
- `tsconfig.json` - TypeScript with `~/*` path alias to `app/*`
- `postcss.config.cjs` - Tailwind CSS processing

**Code Quality:**
- `.eslintrc.cjs` - ESLint with Shopify and Hydrogen rules
- `@shopify/prettier-config` - Prettier configuration

**Environment:**
- `.env` - Storefront API tokens, domain settings
- Required vars: `PUBLIC_STORE_DOMAIN`, `PUBLIC_STOREFRONT_API_TOKEN`, `SHOP_ID`

## Platform Requirements

**Development:**
```bash
npm run dev      # Start dev server with codegen
npm run build    # Production build
npm run preview  # Preview production build
```

**Production:**
- Deployed to Shopify Oxygen (edge workers)
- Uses Storefront API for all commerce data
- Customer Account API for authentication

## GraphQL Codegen

**Config:** `.graphqlrc.yml`
- Generates TypeScript types from Storefront API schema
- Output: `storefrontapi.generated.d.ts`, `customer-accountapi.generated.d.ts`

---

*Stack analysis: 2026-02-11*
