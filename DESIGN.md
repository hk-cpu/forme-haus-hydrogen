# Forme Haus DESIGN.md

Authoritative design system for the Hydrogen storefront. Captures brand identity, tokens, components, and interaction rules to keep UI consistent. Place this in project root so coding/design agents can align on visuals.

## Brand Essence
- Luxury, editorial minimalism with warm bronze and cream on deep charcoal.
- Confident typography (serif for headlines, crisp sans for body). Generous negative space, subtle motion.

## Color Tokens
Source of truth lives in `app/styles/app.css` via Tailwind v4 `@theme`. Use tokenized utilities (e.g., `text-bronze`, `bg-cream`, `border-taupe-dark`).

- Background: `#121212` (`bg-background`)
- Foreground: `#F5F2F0` (`text-foreground`)
- Bronze (brand): `#A87441` (`text-bronze`, `bg-bronze`)
- Bronze Light: `#D4AF87` (`text-bronze-light`)
- Bronze Dark: `#8B5E3C` (`text-bronze-dark`)
- Taupe: `#AA9B8F` (`text-taupe`, `border-taupe`)
- Taupe Dark: `#2E2C2B` (`text-taupe-dark`)
- Cream: `#F9F5F0` (`bg-cream`, `text-cream`)
- Silk: `#AD9686` (`text-silk`)

Guidelines:
- Brand actions use bronze; subtle elements use taupe; surfaces are charcoal/cream.
- Maintain WCAG AA contrast for text on backgrounds.

## Typography
- Headings (editorial): `font-serif` (IBM Plex Serif/Iowan Old Style), tight leading on large display.
- Body/UI: `font-sans` (Aptos/Segoe UI), comfortable leading.
- Arabic: `font-arabic` (`Noto Naskh Arabic` first), ensure mirroring and ligatures.

Utilities:
- Headline: `font-serif tracking-[0.02em]`
- Nav: `text-[11px] uppercase tracking-[0.25em]` (from `CLAUDE.md`)
- Body: `font-sans text-[15px] leading-7 text-foreground/90`

## Layout & Spacing
- Container max: `1440px` (`max-w-[var(--container-max)]`)
- Page gutter: `var(--page-gutter)` (`px-[var(--page-gutter)]`)
- Spacing scale (8px base): `--space-1..8` → prefer `gap-6 md:gap-8` etc.
- Navbar heights: `--navbar-height` (72px), scrolled 60px.

Patterns:
- Sections: `py-10 md:py-14` (normalized Mar 2026)
- Collection hero: `h-[30vh] md:h-[38vh]`

## Motion
Easing/durations from `app/styles/app.css`:
- Ease: `--ease-luxe` (natural), `--ease-smooth`, `--ease-bounce`
- Durations: `--dur-micro` 200ms, `--dur-base` 300ms, `--dur-reveal` 500ms, `--dur-slow` 700ms

Usage:
- Hover/press: 150–250ms, `transition-all` with `ease-[var(--ease-luxe)]`
- Reveals/entrances: 400–700ms, staggered by 60–120ms

## Components

Buttons
- Primary: bronze on dark; rounded medium; subtle shadow on hover.
  Example: `inline-flex items-center justify-center rounded-md px-5 py-3 bg-bronze text-white hover:bg-bronze-dark shadow-[var(--shadow-card)] transition-all duration-200 ease-[var(--ease-luxe)] focus:outline-none focus:ring-2 focus:ring-bronze`
- Secondary: taupe outline; text on dark.
  Example: `inline-flex items-center justify-center rounded-md px-5 py-3 border border-taupe text-foreground/90 hover:bg-foreground/5 transition-all duration-200`

Badges
- Tone with bronze-light background, bronze-dark text: `inline-flex items-center rounded-full px-3 py-1 text-xs bg-bronze-light/15 text-bronze-dark border border-bronze-light/30`

Cards
- Subtle elevation, cream text on dark surface.
  Example: `rounded-lg bg-[var(--color-forme-surface)]/95 border border-foreground/10 shadow-[var(--shadow-card)]`

Inputs
- Minimal chrome; ring uses brand.
  Example: `rounded-md bg-foreground/5 border border-foreground/10 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-bronze`

Navbar
- Fixed, translucent dark: `backdrop-blur supports-[backdrop-filter]:bg-black/50` with height tokens.

Product Card
- Image: `object-contain p-4` on neutral surface.
- Title: `font-serif text-xl md:text-2xl`
- Price: `font-sans text-sm text-foreground/80`

## Imagery
- Product: `object-contain` with generous padding to showcase form.
- Editorial: `object-cover` behind typographic overlays.
- Prefer `.webp` with blur placeholders.

## Accessibility
- Maintain focus visibility on all interactive elements (brand ring).
- Avoid bronze-on-taupe text; use bronze on charcoal or white-on-bronze.

## Do/Don’t
- Do: Use tokenized utilities (no raw hex in components).
- Do: Keep animations subtle; respect reduced motion.
- Don’t: Mix multiple accent colors on a single view.
- Don’t: Use full-black; stick to tokenized dark surfaces.

## References
- Tokens and utilities: `app/styles/app.css`
- Project overview and sizing conventions: `CLAUDE.md`
- Hydrogen/Remix stack: `README.md`

