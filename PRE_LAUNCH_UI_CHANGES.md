# Pre-Launch UI Changes Summary

This document summarizes all the UI changes made based on client feedback for the upcoming storefront launch.

---

## ✅ Changes Completed

### 1. Image Sizing & Layout

#### **Removed Blur Reveal Effect**

- **File**: `app/routes/($locale)._index.tsx`
- **Change**: Replaced `BlurRevealImage` component with regular `<img>` tags in the Journal section
- **Result**: Journal teaser images now load normally without the camera autofocus blur effect

#### **New Component: `ProductImageLayout.tsx`**

- **Location**: `app/components/ProductImageLayout.tsx`
- **Features**:
  - **Photo 1**: Wide landscape-oriented container (`aspect-[21/9]` or `aspect-[16/9]`)
    - Configurable position: `'top'` or `'bottom'` via `landscapePosition` prop
  - **Photo 2 & 3 (Model)**: `object-fit: contain` to show full model without cropping
    - Uses `aspect-[4/5]` or `aspect-[3/4]` container
    - Zoom on click functionality
  - **Standard images**: Smaller containers with `object-contain` padding

**Usage Example**:

```tsx
import {ProductImageLayout} from '~/components/ProductImageLayout';

<ProductImageLayout
  images={productImages}
  landscapePosition="top" // 'top' or 'bottom'
  landscapeImageIndex={0} // Which image to use as landscape
  modelImageIndices={[1, 2]} // Which images are model shots
/>;
```

---

### 2. Content & UI Cleanup

#### **Removed FAQ Section**

- **File**: `app/routes/($locale)._index.tsx`
- **Change**: Completely removed `<FAQSection />` component and its import
- **Result**: Homepage no longer displays FAQ accordion (directs to policy pages instead)

#### **Removed Crossed-Out Variant Boxes**

- **File**: `app/routes/($locale).products.$productHandle.tsx`
- **Change**: Instead of showing unavailable variants with strikethrough styling (`opacity-40 line-through`), they are now completely hidden
- **Code Change**:

  ```tsx
  // Before:
  className={clsx('...', available ? 'opacity-100' : 'opacity-40 line-through')}

  // After:
  {!available ? null : (<Link>...</Link>)}
  ```

---

### 3. Pre-Launch Preparations

#### **New Component: `TrustBadges.tsx`**

- **Location**: `app/components/TrustBadges.tsx`
- **Features**:
  - **Maroof Badge**: Saudi Commercial Registration verification
  - **Muwathooq Badge**: Consumer protection trust mark
  - **Trial Order Indicator**: Shows "Trial Ready" badge for launch testing
  - **Payment Methods**: Shows supported payment options

**Variants**:

- `variant="full"` - Complete badge section for product pages
- `variant="compact"` - Minimal version for product cards
- `variant="footer"` - Footer-friendly horizontal layout

**Usage Example**:

```tsx
import {TrustBadges} from '~/components/TrustBadges';

// On product page
<TrustBadges variant="full" showMaroof showMuwathooq showTrialOrder />

// On product card
<TrustBadges variant="compact" />
```

#### **New Component: `BundlePricing.tsx`**

- **Location**: `app/components/BundlePricing.tsx`
- **Features**:
  - **Tiered Pricing**: Quantity discounts (1 item, 2 items with 10% off, 3 items with 15% off)
  - **Bundle Cards**: Pre-configured bundles (Case Only, Case + Strap, Complete Set)
  - **Savings Calculator**: Shows amount saved when selecting bundles

**Variants**:

- `variant="tiers"` - Radio button style quantity selector with discounts
- `variant="cards"` - Visual bundle cards with "Popular"/"Best Value" badges
- `variant="compact"` - Small inline indicator for product cards

**Usage Example**:

```tsx
import {BundlePricing} from '~/components/BundlePricing';

// Full bundle selector
<BundlePricing variant="cards" onSelect={(id) => console.log(id)} />

// Compact indicator
<BundlePricing variant="compact" />
```

#### **Updated `PaymentBadges.tsx`**

- **Location**: `app/components/PaymentBadges.tsx`
- **New Features**:
  - `PaymentLinkButton` component for trial order payment links
  - `TrustPaymentSection` combined component
  - Support for: Mada, Visa, Mastercard, Apple Pay, STC Pay, Tamara, Tabby

**Usage Example**:

```tsx
import {
  PaymentLinkButton,
  TrustPaymentSection,
} from '~/components/PaymentBadges';

// For trial orders
<PaymentLinkButton amount="149" currency="SAR" onClick={handlePayment} />;
```

---

### 4. Product Page Integration

#### **Updated Product Page**

- **File**: `app/routes/($locale).products.$productHandle.tsx`
- **Changes**:
  1. Added imports for `TrustBadges` and `BundlePricing`
  2. Inserted `<BundlePricing variant="cards" />` below ProductForm
  3. Inserted `<TrustBadges variant="full" />` below BundlePricing

#### **Updated Product Card**

- **File**: `app/components/ProductCard.tsx`
- **Changes**:
  1. Added `BundlePricing` import
  2. Added compact bundle indicator below iPhone model tags

---

## 📁 New Files Created

1. **`app/components/TrustBadges.tsx`** - Saudi trust verification badges (Maroof/Muwathooq)
2. **`app/components/BundlePricing.tsx`** - Bundle pricing UI with quantity discounts
3. **`app/components/ProductImageLayout.tsx`** - Custom image layouts (landscape/contain)

## 📝 Modified Files

1. **`app/routes/($locale)._index.tsx`**

   - Removed FAQSection
   - Replaced BlurRevealImage with regular img tags

2. **`app/routes/($locale).products.$productHandle.tsx`**

   - Added TrustBadges and BundlePricing components
   - Removed crossed-out unavailable variant boxes

3. **`app/components/ProductCard.tsx`**

   - Added compact BundlePricing indicator

4. **`app/components/PaymentBadges.tsx`**
   - Added PaymentLinkButton for trial orders
   - Added TrustPaymentSection component

---

## 🎨 Design Tokens Used

All new components follow the existing design system:

- **Brand Gold**: `#a87441` / `#D4AF87`
- **Dark Text**: `#4A3C31`
- **Muted Text**: `#8B8076`
- **Light Background**: `#F9F5F0`
- **Card Background**: `#F5F2ED`
- **Maroof Green**: `#1B5E20`
- **Muwathooq Red**: `#C62828`

---

## 🔧 Configuration Notes

### For Image Layout Testing:

To use the new ProductImageLayout on a product page, temporarily replace `ProductGallery` with:

```tsx
import {SimpleProductGallery} from '~/components/ProductImageLayout';

// In your component
<SimpleProductGallery
  images={media.nodes.map((m) => ({
    url: m.image?.url,
    altText: m.alt,
    width: m.image?.width,
    height: m.image?.height,
  }))}
  layout="mixed"
/>;
```

### For Payment Links Integration:

The `PaymentLinkButton` is a placeholder. To integrate with a real payment provider (Moyasar, HyperPay, etc.):

1. Replace the `onClick` handler with API call
2. Store payment link URL in component state
3. Redirect user or open modal with payment form

---

## ✅ Pre-Launch Checklist

- [x] FAQ section removed from homepage
- [x] Blur reveal effect removed
- [x] Crossed-out variant boxes removed
- [x] Maroof badge added to product pages
- [x] Muwathooq badge added to product pages
- [x] Bundle pricing UI added
- [x] Payment link placeholder ready
- [x] Trial order indicators added
- [x] Product card shows bundle savings hint
- [x] All components support RTL (Arabic)

---

_Changes implemented for Forme Haus pre-launch, March 2026_
