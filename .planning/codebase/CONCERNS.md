# Codebase Concerns

**Analysis Date:** 2026-02-11

## CRITICAL: Build Failure ✅ FIXED

**Issue:** Production build fails with React Router export error

**Files:** Build system  
**Impact:** Cannot deploy to production  
**Error:**
```
"useFetcher" is not exported by "node_modules/react-router/dist/index.js"
```

**Root Cause:**
Version mismatch between:
- `@shopify/hydrogen` 2024.10.2 (expects React Router v6)
- `@remix-run/react` 2.17.4 (bundles react-router v6.30.3)
- `@shopify/remix-oxygen` 3.0.2 (expects react-router v7)

**Fix Applied:**
Aligned all packages to use react-router v6:
```bash
npm install @shopify/hydrogen@2024.10.2 @shopify/remix-oxygen@2.0.12 react-router@6.30.3 --legacy-peer-deps
```

**Current Working Versions:**
- `@shopify/hydrogen`: 2024.10.2
- `@shopify/remix-oxygen`: 2.0.12
- `@remix-run/react`: 2.17.4
- `react-router`: 6.30.3

**Status:** ✅ Build successful (19.68s)

---

## Tech Debt

### 1. Commented Import

**Location:** `app/lib/utils.ts` (line 3)  
**Issue:** `// import {twMerge} from 'tailwind-merge';`  
**Impact:** Minor - unused import  
**Fix:** Remove or implement if needed

### 2. Sourcemap Warnings

**Files:** 
- `app/components/SmoothScroll.tsx`
- `app/components/Silk.client.tsx`
- `app/components/Atmosphere.client.tsx`

**Issue:** Build warnings about sourcemap resolution  
**Impact:** Development/debugging experience  
**Fix:** Check build tooling configuration

### 3. @ts-ignore Usage

**Location:** `app/routes/($locale)._index.tsx` (line 65-66)  
**Issue:** Using `@ts-ignore` for meta function  
**Impact:** Type safety reduced  
**Fix:** Properly type the matches data

---

## Security Considerations

### Content Security Policy

**Location:** `app/entry.server.tsx`  
**Current:** CSP headers configured with Shopify domains  
**Risk:** Low - properly restricted  
**Note:** Verify all external domains are needed (cdn.sanity.io listed but Sanity may not be used)

### Hardcoded IDs

**Location:** `app/routes/($locale).account.orders.$id.tsx` (line 340)  
**Issue:** Commercial Registration number visible in code  
**Risk:** Low - public business info  
**Recommendation:** Move to environment/config if it varies by deployment

---

## Performance Bottlenecks

### Large Dependencies

**Three.js** (0.182.0):
- Used for 3D product viewer
- Bundle size impact: ~500KB+
- Recommendation: Lazy load with `React.lazy()` if not critical

**Framer Motion:**
- Used throughout for animations
- Consider `LazyMotion` for reduced initial bundle

### Image Optimization

**Observation:** Some hardcoded placeholder images use Unsplash  
**Location:** `app/context/UIContext.tsx` (menuData)  
**Impact:** External dependency, no optimization  
**Fix:** Use local assets or Shopify CDN

---

## Fragile Areas

### Menu Parsing

**Location:** `app/lib/utils.ts` - `parseMenu()` function  
**Why fragile:** Complex logic for URL resolution, depends on Shopify menu structure  
**Safe modification:** Add unit tests before changes  
**Test coverage:** None apparent

### Locale Detection

**Location:** `app/lib/utils.ts` - `getLocaleFromRequest()`  
**Why fragile:** URL path parsing for i18n  
**Risk:** Incorrect locale routing if URL structure changes

---

## Dependencies at Risk

### Tailwind CSS v4

**Current:** 4.1.18 (beta/alpha)  
**Risk:** Breaking changes possible, less stable than v3  
**Migration:** Monitor for stable release, test thoroughly

### Hydrogen 2024.10.2

**Risk:** Older version, build issues with latest Remix  
**Recommendation:** Upgrade to latest Hydrogen 2025.x

---

## Missing Critical Features

### Error Monitoring

**Missing:** Sentry or similar error tracking  
**Impact:** No production error visibility  
**Priority:** High for production

### Testing

**Current:** Playwright E2E only  
**Missing:** Unit tests, component tests  
**Coverage:** Minimal

### Rate Limiting

**Missing:** API rate limiting protection  
**Risk:** Storefront API quota exhaustion

---

## Test Coverage Gaps

**Untested areas:**
- Menu parsing logic (`app/lib/utils.ts`)
- Cart operations
- Authentication flows
- GraphQL query responses
- Error boundaries

**Risk:** Regression potential on changes

---

## Recommendations Priority

### P0 (Fix Immediately)
1. Resolve build failure (React Router export issue)

### P1 (High Priority)
2. Upgrade Hydrogen to stable version
3. Add error monitoring (Sentry)
4. Add unit tests for critical utilities

### P2 (Medium Priority)
5. Lazy load Three.js
6. Remove/fix sourcemap warnings
7. Audit and optimize bundle size

### P3 (Low Priority)
8. Clean up commented code
9. Replace @ts-ignore with proper types
10. Move hardcoded business values to config

---

*Concerns audit: 2026-02-11*
