# Coding Conventions

**Analysis Date:** 2026-02-11

## Naming Patterns

**Files:**
- React Components: PascalCase (`ProductCard.tsx`, `Hero.tsx`)
- Routes: Lowercase with params (`($locale).products.$handle.tsx`)
- Utilities: camelCase (`utils.ts`, `seo.server.ts`)
- Client components: `.client.tsx` suffix (`Silk.client.tsx`)
- Server-only: `.server.ts` suffix (`session.server.ts`)

**Functions:**
- React components: PascalCase (`function Header()`)
- Hooks: camelCase starting with `use` (`useTranslation`, `useCartFetchers`)
- Utilities: camelCase (`parseMenu`, `formatText`)
- Loaders: Named `loader`
- Actions: Named `action`

**Variables:**
- camelCase for regular variables
- PascalCase for types/interfaces
- UPPER_SNAKE for constants (`DEFAULT_LOCALE`)

**Types:**
- TypeScript types: PascalCase with descriptive names
- Generated types: From Storefront API (e.g., `MoneyV2`, `MenuFragment`)

## Code Style

**Formatting:**
- Tool: Prettier with `@shopify/prettier-config`
- Run: `npm run format`
- Check: `npm run format:check`

**Linting:**
- Tool: ESLint with `@shopify/eslint-plugin` and `eslint-plugin-hydrogen`
- Run: `npm run lint`

**Key Style Patterns:**
- Single quotes for strings
- Semicolons required
- 2-space indentation
- Trailing commas

## Import Organization

**Order (observed in code):**
1. React/Remix core imports
2. Third-party libraries (Hydrogen, Framer Motion)
3. Generated types (`storefrontapi.generated`)
4. Internal components (`~/components/*`)
5. Internal hooks (`~/hooks/*`)
6. Internal lib/utils (`~/lib/*`)
7. Internal context (`~/context/*`)
8. Internal data (`~/data/*`)

**Path Aliases:**
- `~/*` maps to `app/*` (configured in tsconfig.json and vite.config.ts)

## Error Handling

**Patterns:**
- Try/catch in loaders with fallback data
- `invariant()` from `tiny-invariant` for assertions
- Error boundaries for route-level errors
- Custom error components: `GenericError`, `NotFound`

**Example from root.tsx:**
```typescript
const layout = await getLayoutData(context).catch((error) => {
  console.error('Layout query failed:', error);
  return { /* fallback data */ };
});
```

## Logging

**Framework:** console (no dedicated logging library)

**Patterns:**
- Error logging in catch blocks
- `console.error()` for errors
- `console.warn()` for warnings (e.g., invalid menu items)

## Comments

**When to Comment:**
- GraphQL queries: Link to Shopify API docs
- Complex logic: Explain "why" not "what"
- Workarounds: Explain the issue being worked around

**JSDoc/TSDoc:**
- Used for exported functions
- Describes purpose and parameters

## Function Design

**Size:** No strict limit, but components tend to be 50-200 lines

**Parameters:**
- Destructuring preferred for props
- Type annotations on all params

**Return Values:**
- Explicit return types on exported functions
- Use TypeScript inference for inline functions

## Module Design

**Exports:**
- Named exports preferred
- Default exports for page components (Remix convention)

**Barrel Files:**
- Not used - import directly from source files

## Component Patterns

**Structure:**
```typescript
// 1. Imports
import { useLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';

// 2. Types (if needed)
interface Props {
  title: string;
}

// 3. Component
export function MyComponent({ title }: Props) {
  // Logic
  return (
    // JSX
  );
}
```

**Styling:**
- Tailwind utility classes
- Custom CSS for complex animations (in `.css` files)
- Color palette: Dark theme (#121212 bg, #F0EAE6 text, #a87441 bronze accent)

**Animation:**
- Framer Motion for component animations
- `motion.div` with `initial`, `animate`, `whileInView`
- Reduced motion support via `useReducedMotion` pattern

## Route Conventions

**Structure:**
```typescript
// 1. Imports
// 2. Headers export (optional)
export const headers = routeHeaders;

// 3. Loader
export async function loader(args: LoaderFunctionArgs) {
  // Data fetching
  return defer({ /* data */ });
}

// 4. Meta
export const meta = ({ data }: MetaArgs) => {
  return getSeoMeta(data.seo);
};

// 5. Component
export default function RouteName() {
  const data = useLoaderData<typeof loader>();
  return (
    // JSX
  );
}
```

## GraphQL Conventions

**Query Definition:**
- Use `#graphql` tag for syntax highlighting
- Name queries descriptively
- Use fragments for reusability

**Example:**
```typescript
const MY_QUERY = `#graphql
  query MyQuery($id: ID!) {
    node(id: $id) {
      ...MyFragment
    }
  }
  ${MY_FRAGMENT}
` as const;
```

---

*Convention analysis: 2026-02-11*
