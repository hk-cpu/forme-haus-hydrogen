# The Edit - Grid Redesign Reference

## Problem with Current Layout
The 4th image (close-up with ring) is being **cropped and distorted** in the current masonry-style grid. This happens when using `object-fit: cover` or fixed heights without respecting the image's natural aspect ratio.

## Solution
Use **`object-fit: contain`** instead of `object-fit: cover`. This ensures:
- ✅ Images maintain their **true aspect ratio**
- ✅ Images are **never cropped** or stretched
- ✅ Images are **centered** within their containers
- ✅ The entire image is always visible

---

## 3 Grid Layout Options

### Option 1: Bento Grid (RECOMMENDED)
```
┌──────────────────┬──────────┬──────────┐
│                  │          │  IMG 3   │
│    IMG 1         │  IMG 2   │  (Car)   │
│   (Pool)         │ (Walking)├──────────┤
│                  │          │  IMG 4   │
│                  │          │ (Ring)   │
└──────────────────┴──────────┴──────────┘
```

**Pros:**
- Visual hierarchy with larger featured image
- Balanced asymmetry
- Modern, editorial feel
- Responsive to all screen sizes

**CSS Class:** `.edit-grid-bento`

---

### Option 2: Equal 2x2 Grid
```
┌──────────────────┬──────────────────┐
│     IMG 1        │     IMG 2        │
│    (Pool)        │   (Walking)      │
├──────────────────┼──────────────────┤
│     IMG 3        │     IMG 4        │
│    (Car)         │    (Ring)        │
└──────────────────┴──────────────────┘
```

**Pros:**
- All images equal importance
- Clean, symmetrical layout
- Predictable sizing

**CSS Class:** `.edit-grid-2x2`

---

### Option 3: Featured Left
```
┌──────────────────┬──────────┬──────────┐
│                  │          │  IMG 3   │
│    IMG 1         │  IMG 2   │  (Car)   │
│   (Pool)         │ (Walking)├──────────┤
│                  │          │  IMG 4   │
│                  │          │ (Ring)   │
└──────────────────┴──────────┴──────────┘
     (2x height)      (2x height)  (1x each)
```

**Pros:**
- Emphasizes first two images
- Good for storytelling flow
- Unique layout

**CSS Class:** `.edit-grid-featured`

---

## Key CSS Properties

```css
.edit-item {
    /* Container must have defined dimensions */
    width: 100%;
    height: 100%;
    
    /* Center the image */
    display: flex;
    align-items: center;
    justify-content: center;
}

.edit-item img {
    /* Critical: Use 'contain' not 'cover' */
    object-fit: contain;  /* ← This preserves aspect ratio */
    
    /* Alternative options (DON'T USE for this requirement): */
    /* object-fit: cover;   ← Crops image to fill */
    /* object-fit: fill;    ← Stretches image */
}
```

---

## Image Aspect Ratios

Based on the images provided:

| Image | Orientation | Aspect Ratio | Best Fit |
|-------|-------------|--------------|----------|
| 1 - Pool | Landscape/Square | ~1:1 | Large cell |
| 2 - Walking | Portrait | ~3:4 | Tall cell |
| 3 - Car | Portrait | ~3:4 | Standard cell |
| 4 - Ring | Portrait | ~3:4 | Standard cell |

---

## HTML Structure

```html
<section class="the-edit">
    <div class="section-header">
        <h2 class="section-title">The Edit</h2>
        <a href="#" class="view-all">View All</a>
    </div>
    
    <!-- Choose your grid class: -->
    <!-- .edit-grid-bento | .edit-grid-2x2 | .edit-grid-featured -->
    <div class="edit-grid-bento">
        <div class="edit-item">
            <img src="image1.jpg" alt="Description">
        </div>
        <div class="edit-item">
            <img src="image2.jpg" alt="Description">
        </div>
        <div class="edit-item">
            <img src="image3.jpg" alt="Description">
        </div>
        <div class="edit-item">
            <img src="image4.jpg" alt="Description">
        </div>
    </div>
</section>
```

---

## Files Created

1. **`the-edit-redesign.html`** - Full working HTML page with layout toggle
2. **`the-edit-styles.css`** - Standalone CSS file with all 3 grid options
3. **`GRID_REFERENCE.md`** - This documentation file

---

## Quick Start

1. Open `the-edit-redesign.html` in browser to preview all layouts
2. Copy the CSS from `the-edit-styles.css` into your project
3. Use the HTML structure above with your preferred grid class
4. Replace image paths with your actual image URLs
