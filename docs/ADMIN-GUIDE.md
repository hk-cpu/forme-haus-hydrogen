# Forme Haus — Store Administrator Guide

**Who this is for:** whoever runs the Forme Haus store day to day from Shopify Admin. No technical knowledge assumed.

**What it covers:** every part of formehaus.me you can change yourself, exactly where to click, what happens if you leave a field blank — and, just as importantly, the parts that look editable but are not.

## The one expectation to set first

This storefront is a custom-built site, not a standard Shopify theme. That means:

- **Some things are yours.** Products, collections, prices, images, the main menu, social links, and a handful of homepage tiles and labels.
- **Some things are written into the site's code.** Most headings, button labels, taglines, the footer link list, trust badges, and the Journal cards. None of these are broken — they were simply never connected to Admin. Any of them *can* be changed; it needs a developer and a site update, so raise it as a request rather than hunting for it in Admin.

When you can't find something in Admin, it is almost always because it lives in the code. This guide tells you which is which.

---

# ⚠️ READ THIS FIRST — THE CACHE DELAY

> ## Your edits are not instant. The homepage can take **up to 1 hour**, and old content can keep showing for **up to 23 hours more**.
>
> This is the number one cause of "I changed it and nothing happened."
>
> **There is no clear-cache button.** Hard-refreshing your browser, adding `?v=2` to the address, and opening an incognito window all do **nothing** — the saved copy sits on Shopify's servers and is shared by every visitor, not stored in your browser.
>
> **Before you re-edit anything, wait it out and reload the page a second time.** Nine times out of ten the change was saved correctly and you were simply looking at the stored copy.

## How long each page waits

| Page | How fast your edit appears | What to expect |
|---|---|---|
| **Homepage** (`/` and `/ar-sa/`) | **Up to ~1 hour, plus one extra page view** | Slowest page on the site. After the hour, the *next* visitor still sees the old version — their visit is what triggers the refresh. The person after them sees the new one. |
| Collection pages (`/collections/...`) | ~10 seconds | Effectively instant. Covers title, description, which products are in it, sort order. |
| Product pages (`/products/...`) | Usually the second page load | Price, title, images, variants. Reload once and you'll see it. |
| Header & footer menu links | Usually the second page load | Site-wide, so it's easy to think nothing happened. Reload any page a second time. |
| Products index, Journal, standard pages, policy pages | Usually the second page load | Same as product pages. |
| Account and order pages | Instant | Never cached — always live customer data. Intentional. |

**One slow exception inside a fast page.** If a collection is *empty* in Admin, the storefront quietly fills the page with products from your full catalogue instead — and that backup list refreshes far more slowly, so a product edit can show old data for **up to 24 hours**. The fix is to put real products into the collection so the page stops using the backup list.

**The only way to force everything fresh immediately** is to redeploy the storefront, which is a developer task.

---

# 1. Homepage — top of the page

The homepage runs: the logo panel (**Hero**) → **Shop by Category** (three tiles) → **The Edit** (four large photo tiles) → **The Journal** → **Why Choose Us** → **Shop with Confidence** badges.

Two Admin locations control everything you can edit here:

- **Settings → Custom data → Shop** — one-off pieces of text that apply store-wide.
- **Content → Metaobjects** (shown as **Custom content** in some Admin versions) — reusable content groups. Two groups matter: **Category Card** and **Bento Item**.

## 1.1 The button under the logo

Currently reads "Explore the Collection". English and Arabic are set separately — changing one does not change the other.

| What it controls | Where to click | If you leave it blank |
|---|---|---|
| Button label, English | Settings → Custom data → Shop → **Hero CTA (English)** (`hero.cta_en`) → Edit value | Falls back to "Explore the Collection". The button is never blank. |
| Button label, Arabic | Settings → Custom data → Shop → **Hero CTA (Arabic)** (`hero.cta_ar`) → Edit value | Falls back to "استكشفي المجموعة". |

Where the button scrolls to is fixed in code. You can change the words, not the destination.

## 1.2 Shop by Category — the three tiles

**Content → Metaobjects → Category Card**

Three entries exist — **New to Haus**, **Phone Accessories** and **Sunglasses** — and editing them changes the live homepage. This section is yours.

| What it controls | Field to edit | If you leave it blank |
|---|---|---|
| Tile title, English | **Title (English)** | Required — Admin will not let you save it empty. |
| Tile title, Arabic | **Title (Arabic)** | Arabic shoppers see the **English** title instead. |
| The photo | **Image** | Required. |
| Where the tile goes when clicked | **Link URL** | Required. Use a path starting with a slash, e.g. `/collections/sunglasses`. **Never paste a full `https://` address** — it sends Arabic shoppers to the English page. |
| Left-to-right position | **Sort Order** | An unnumbered tile is pushed to the end. |

> **The section shows exactly the entries that exist here.** Delete one and the homepage drops to two tiles. Delete all three and it silently falls back to three built-in tiles from the code.

These tiles have **no separate alt-text field** — the title is reused as the image description.

## 1.3 The Edit — the four photo tiles

**Content → Metaobjects → Bento Item**, then open the entry you want to change.

> ### ⚠️ Pending release
> The **Arabic** title and subtitle fields on these tiles, and the improved editing behaviour described below, **do not work on the live site yet**. They only start working once the current pending code release is deployed. Until that deployment happens, treat this section as "coming soon" and check with your developer before relying on Arabic tile text.

| What it controls | Field to edit | If you leave it blank |
|---|---|---|
| Tile headline, English | **Title (English)** | Only the four original tiles (Modern Essentials, Carry It Your Way, Sun Ready, New Arrivals) have built-in backup wording. On a tile **you** created, a blank title shows **nothing at all**. Always fill this in. |
| Tile headline, Arabic | **Title (Arabic)** | Original tiles fall back to built-in Arabic. On a tile you created, Arabic shoppers see the English headline — or nothing, if that is blank too. |
| Small line under the headline, English | **Subtitle (English)** | Original tiles use their built-in caption; on a tile you created the line is simply left off. The tile still looks correct with just a headline. |
| Small line under the headline, Arabic | **Subtitle (Arabic)** | Arabic shoppers see the English sub-line, or nothing. |
| The photo | **Image** (file picker) | **The whole tile disappears.** If every tile loses its image, the homepage silently reverts to the four built-in tiles. Never save a tile without a photo. |
| Image description for screen readers and Google | **Image Alt Text** | Uses the description saved on the file itself in Content → Files, then the English headline, then nothing. Worth filling in for search visibility. |
| Where the tile goes when clicked | **Link URL** | The tile becomes unclickable. Use a path starting with a slash, e.g. `/collections/sun-ready`. **Never paste a full `https://` address** — it sends Arabic shoppers to the English page and slows the link down. |

**Two hard limits:**

1. **The Edit shows exactly four tiles.** A fifth entry will not appear anywhere.
2. **It is all-or-nothing.** As soon as one tile with a photo exists, it replaces the entire built-in set.

---

# 2. Header and footer (every page)

Covers the top navigation bar, the newsletter strip, the footer, and the green WhatsApp button in the corner.

## 2.1 The main navigation menu

**Content → Menus → Main menu.** Add, remove, or reorder links, including drop-down sub-links. If the menu is ever emptied or deleted, the site quietly falls back to four built-in links (Collections, Journal, Our Story, Contact Us) — the header never goes blank.

Two things to know before you edit it:

- **Renaming Collections, About Us / Our Story, or Contact will not change what shoppers see.** Those three names and destinations are fixed in the code. Adding *new* links works normally; renaming those three does not.
- If the Collections link has no sub-links of its own, the drop-down shows a built-in list: New to Haus, Sunglasses, Phone Accessories, View All Collections.

## 2.2 Footer and WhatsApp details

All in one place: **Settings → Custom data → Shop.** Open it, find the field, edit the value, save.

| What it controls | Field to edit | If you leave it blank |
|---|---|---|
| Instagram icon in the footer | Instagram URL (`footer.instagram_url`) | Falls back to `instagram.com/formehaus` |
| Snapchat icon in the footer | Snapchat URL (`footer.snapchat_url`) | Falls back to `snapchat.com/add/formehaus` |
| TikTok icon in the footer | TikTok URL (`footer.tiktok_url`) | Falls back to `tiktok.com/@formehaus` |
| Number the floating WhatsApp button dials | WhatsApp number (`footer.whatsapp_number`) — digits only, country code first, no `+` (e.g. `966533954066`) | Falls back to `966533954066` |
| Commercial Registration number on the bottom footer line | CR number (`footer.cr_no`) | Falls back to `7051891369` |
| VAT number on the bottom footer line | VAT number (`footer.vat_no`) | Falls back to `314271812300003` |

**Two cautions:**

- **Clearing a field does not hide anything.** A blank Instagram field still shows the icon, pointing at the default profile. Emptying the WhatsApp number does not remove the button — it restores the original number. To genuinely remove a social icon or the WhatsApp button, ask a developer.
- **CR and VAT are legally displayed information.** Clearing them brings the old numbers back rather than showing nothing, so make sure the values on file are the correct current ones.

If any of these fields are missing from Settings → Custom data → Shop, they were never set up on this store. Ask a developer to create them — do not add them yourself.

> **⚠️ The "Footer" menu is a decoy.** There *is* a Footer menu under Content → Menus. Editing it has **no effect on the site at all**. The footer link list (Contact us, Shipping & Delivery Policy, Return & Exchange Policy, Privacy Policy, Terms & Conditions) is fixed in the code. Don't rely on that menu.

---

# 3. Collection pages and product pages

Covers a category page (e.g. `/collections/sunglasses`) and an individual product page (e.g. `/products/onyx-case`).

## 3.1 Collection pages — what you can edit

| What it controls | Where to click | If you leave it blank |
|---|---|---|
| **Collection name** (page heading) | Products › Collections › [collection] › **Title** | Nothing renders. See the empty-collection trap below. |
| **Sub-line under the heading** | Products › Collections › [collection] › **Description** | Nothing renders. On many categories a built-in line is used instead and always wins — see §6. |
| **Banner image** | [collection] › scroll to **Extra fields** › **Hero image** › Select file | Falls back in order to: a built-in banner for that category → the collection's own Image → a plain dark block. Must be picked with the file picker; pasting an address into a text field will not work. |
| **Backup banner + social/search preview image** | [collection] › **Image** section › Add image | Used as the banner only if no Hero image is set and the category has no built-in banner. Always used for search-engine and social previews. |
| **Hide the name overlaid on the banner** (when the artwork already has text) | Extra fields › **Hide title** › enter `true` | Name and sub-line show over the banner. On the 12 categories with a built-in banner, setting `false` will *not* bring the text back — ask a developer. |
| **Banner shape** — full-width strip vs fixed-height crop | Extra fields › **Hero fit** › enter `full-width` | Uses the fixed-height crop. Only the exact word `full-width` does anything, and only when Hide title is also on. `cover`, `contain`, `auto` all look identical. |
| **Which part of a cropped banner stays visible** | Extra fields › **Hero position** › e.g. `center center`, `right center`, `top` | Centres the image. No effect on full-width banners. |
| **Colour of the strip behind a full-width banner** | Extra fields › **Bg color** | Uses a warm off-white. ⚠️ Not a free colour picker — only colours already built into the site work. Safe values: `bg-[#B8956E]`, `bg-[#C8B496]`, `bg-[#C8B8A0]`, `bg-[#E7D6C3]`, `bg-[#E8DED4]`, `bg-[#F0EAE6]`, `bg-[#F5F1ED]`. Anything else renders as nothing. Ask a developer for a new colour. |
| **Which products appear, and in what order** | [collection] › **Products** (manual picks or automatic conditions) + the Sort drop-down | 16 products per page. If a category is empty, some pages quietly show the 16 newest products store-wide instead of an empty message. |
| **Filter chips** (price, availability, colour…) | Online Store › Navigation › **Filters** (Search & Discovery app) | No filters show. Filters also do not appear on pages that fell back to showing newest products. |
| **Google / search listing text** | [collection] › **Search engine listing** › Edit | Uses the collection name and description. |
| **Editorial page layout** (section order, pull-quotes) | Extra fields › **Layout config** (namespace `editorial`) | Uses the built-in layout. ⚠️ Expects structured code, not plain text — do not edit without a developer. Has no effect at all on Phone Accessories, Phone Cases, Phone Straps, Sunglasses, New In, New, Sale, All or Catalog. |

> ### ⚠️ The biggest trap on the whole site
> If one of the main categories is **empty or missing** in Shopify, the page rebuilds itself from scratch and **throws away every Extra field** — banner, hide-title, colour, all of it. It may also replace your name with a built-in one (Phone Cases displays as "Phone Accessories"), and the built-in title/description it uses cannot be edited in Admin.
>
> **If your banner edits seem to do nothing, this is almost always why.** Make sure the collection exists and has products in it.

## 3.2 Product pages — what you can edit

| What it controls | Where to click | If you leave it blank |
|---|---|---|
| **Product name** | Products › [product] › **Title** | Required. On category grids anything after a " - " becomes a small colour label underneath: `Onyx Case - Sand` shows as "Onyx Case" with "Sand" below. |
| **Brand line above the name** | [product] › Product organization › **Vendor** | The line is hidden entirely. |
| **Product description** ("Details" drop-down) | [product] › **Description** | The Details drop-down disappears. |
| **Photos, video, 3D** | [product] › **Media** — upload, drag to reorder, delete | Only the **first 7** items are shown. An 8th photo will never appear. Order matches Admin exactly. |
| **Price and sale price** | [product] › Pricing › **Price** / **Compare-at price** (per variant under Variants) | A price of 0 turns the button into "Unavailable" instead of Add to Cart. A compare-at price shows as a struck-through original. |
| **Options and their values** (colour, iPhone model…) | [product] › **Variants** › Add options / edit values | An option literally named "Title" is hidden. More than 7 values switches automatically from buttons to a drop-down. Sold-out values are hidden, not greyed out. |
| **Colour swatch dots** | [product] › Variants › option value › **swatch colour or image** (or Settings › Metaobjects › Colour) | The value's text name shows instead of a dot. |
| **Stock and Sold Out state** | [product] › **Inventory** › quantity, or untick "Track quantity" | Out of stock shows a disabled "Sold Out" button and hides the sticky mobile buy bar. 1–5 in stock adds a low-stock badge on category grids. |
| **Sunglasses specification rows** (14 fields: Frame shape, Gender, Frame material, Lens description, Lens material, UV protection, Frame width, Frame height, Lens width, Nose bridge, Temple length, Product code, Warranty, Polarised) | [product] › **Extra fields** › the matching field | Empty rows are hidden. If all 14 are empty and there is no measurement image, the whole Specifications drop-down disappears. |
| **Size-guide / measurement diagram** | [product] › Extra fields › **Measurement image** › Select file | The block is hidden. Must be chosen with the file picker, not typed as an address. |
| **Arabic product name on category grids** | [product] › Extra fields › **Title AR** | Falls back to the English name. ⚠️ Affects grid cards only — the large heading on the product page itself stays English. |
| **Google / search listing text** | [product] › **Search engine listing** › Edit | Uses the product name and description. |
| **Web address (slug)** | [product] › Search engine listing › Edit › **URL handle** | Changing it changes the live link. Shopify adds a redirect automatically, so old links keep working. |
| **Shipping & Returns drop-downs** | Settings › **Policies** › Shipping policy / Refund policy | Each drop-down is hidden if that policy is empty. Only a short excerpt shows, with a "Learn more" link. |
| **"Related Products" row** | Apps › **Search & Discovery** › Product recommendations (or leave it to Shopify's automatic picks) | Shopify's picks are topped up with your 12 best sellers, duplicates removed. |

> ### ⚠️ Two product-page warnings
> **Bundle pricing block shows fixed SAR amounts and discount percentages that are NOT connected to your Shopify prices.** If you change prices in Admin, this block will not follow — it can display a price that doesn't match checkout. Flag it to a developer before running any price change.
>
> **Known bug:** iPhone-compatibility badges and the bundle block currently never appear, because the product tags they rely on aren't being read. Adding `iphone-*` tags in Admin has no effect right now. A developer needs to fix this.

---

# 4. Homepage — lower sections

**The Journal**, **Why Choose Us**, and the **Shop with Confidence** trust badges.

**None of these three sections are editable from Admin.** Every photo, heading, summary, statistic, badge and link in them is written into the code. That is not a bug list — it's simply how the site was built — but several items in it are worth fixing, so raise them with your developer:

| Item | Why it's worth raising |
|---|---|
| **The Journal cards** | All three cards (photos, headings, summaries, links) are fixed in code, even though the articles they point to already live in your Shopify blog. The sensible fix is to have the section pull the three newest Journal articles automatically, so publishing an article updates the homepage. Until then, the Arabic wording is matched to the English headings behind the scenes — renaming or adding a card will silently break its Arabic text. |
| **The Maroof seal link** | Currently points at an invalid web address. Needs pointing at your real Maroof listing. |
| **Maroof / Muwathooq seal labels** | Drawn in code rather than uploaded images, and their English labels are incomplete (showing " Verified" and "Consumer "). They also don't pick up the Arabic wording. |
| **"Free Shipping Across KSA" and "7-Day Easy Returns" pills** | Show in **English even on the Arabic site**. |
| **The homepage statistics** — "50,000+ Happy Customers", "100+ Premium Products", "15+ Cities Served", "99% Satisfaction Rate" | Public marketing claims with no Admin control. Make sure you're comfortable with them. |
| **The payment line** — "Secure payments via Tap: Mada, Visa, Mastercard, Apple Pay, STC Pay, Tabby, Tamara" | If you add or drop a payment method, this sentence must be edited by hand in both languages. |
| **The free-shipping threshold text** — "over 300 SAR" | Changing your actual shipping settings in Admin will **not** update this sentence. |

Also fixed here: the four Why Choose Us promise cards (Curated Selection, Limited Collections, Global Designers, Elevated Experience) and their code-drawn icons; the "Why Choose Us" and "Shop with Confidence" headings; which trust seals appear (all always on, cannot be switched off).

---

# 5. What you cannot change without a developer

A single scannable list of everything hardcoded, grouped by area. **None of it is broken.** Each item is a small developer job plus a site update.

## Homepage — top

- The Forme Haus logo image and its description text; the logo's floating animation and bronze glow.
- The hidden page headline used by Google ("Designer Phone Cases and Sunglasses in Saudi Arabia").
- Where the hero button scrolls to (you control the words, not the destination).
- The heading "Shop by Category", its **View All** button (always goes to `/products`), and the three-column layout.
- The three *backup* category tiles that appear only if every Category Card entry is deleted. (The tiles actually on the site are yours to edit — see §1.2.)
- The heading "The Edit", its letter-by-letter animation, and the "Shop the Edit →" hover label.
- The four backup tiles that appear if The Edit's entries are removed, and the four-tile cap.
- Which sections appear on the homepage and in what order, all spacing, the cream panel, all colours, gradients, photo zoom and tilt effects.

## Header and footer

- **The footer link list** (Contact us, Shipping & Delivery Policy, Return & Exchange Policy, Privacy Policy, Terms & Conditions) — and note the Footer menu in Admin does nothing.
- The **"Contact Us"** link in the top nav — added automatically, cannot be removed.
- The header logo and the footer logo/wordmark. Uploading a new logo in Shopify's brand settings will not change them.
- The store name. Renaming the store in Admin changes nothing in the header or footer.
- The payment badges (Mada, Visa, Mastercard, Apple Pay, STC Pay).
- The set of social platforms — only Instagram, Snapchat, TikTok exist. Their links are yours; a fourth platform is a developer job.
- All wording in both languages: "Join the Haus" and its subtext, the newsletter placeholder and Join button, "Welcome to the Haus", "Where Essence Meets Elegance", the copyright line, the "CR No." / "VAT No." / "Registered in Saudi Arabia" labels (only the numbers are editable), the pre-written WhatsApp greeting, "Secure Payment Methods", "Powered by Tap Payments · 256-bit SSL Encrypted", the Search / Bag / Account / Menu button labels, and the "Bag" heading on the cart drawer.

## Collection pages

- **Built-in banners** on 12 categories (New In, New, Sunglasses, Sale, Phone, Phone Cases, Phone Straps, Case & Strap Bundles, Carry It Your Way, Sun Ready, New Arrivals, Modern Essentials): heights and overlay styling are baked in. You can swap the *image*, not the height or treatment.
- **Built-in sub-lines** on 10 categories (New In, Phone, Phone Cases, Phone Straps, Case & Strap Bundles, Sunglasses, Modern Essentials, Sun Ready, Carry It Your Way, New Arrivals) — these always beat whatever you type in the Description box.
- **Carry It Your Way ignores its product list.** It shows any product with a "+" in its name. Adding a product to that collection does nothing — the product must be renamed.
- **New Arrivals is locked to a "Coming Soon" animation** and will not show products until a developer launches it.
- **Phone Accessories redirects to Phone Cases** and can never show its own page.
- Category tabs (Shop All / Phone Accessories / Sunglasses, plus Phone Cases / Phone Straps sub-tabs) and the editorial sub-nav (Modern Essentials, Carry It Your Way, Sun Ready, New Arrivals) are a fixed list. Creating a new collection does not add a tab.
- Sort options (Featured, Newest, Price, Best selling) are a fixed list.
- 16 products per page, and the error page shown on a broken or renamed category link.

## Product pages

- The bundle pricing block's SAR amounts and discount percentages (see the warning in §3.2).
- Specification row labels ("Frame Shape", "UV Protection", …) — fixed English, do not translate. You control the values, not the labels.
- The 7-media-items-per-product limit.
- Breadcrumbs always read "Home › Shop" regardless of where the shopper came from.
- Fixed on-page wording, English even in Arabic mode: "Collection", "The Edit", "Related Products", "Add to Wishlist" / "Remove from Wishlist", "Also available individually", "Pair it in a bundle", Previous/Next buttons, the Coming Soon copy, and both 404 messages.

## Site-wide wording (~533 fixed phrases across English and Arabic)

- Every button and section label: "Add to Bag", "Buy Now", "Sold Out", "Quick Add", "Your Bag", "Checkout", "Subtotal", "The Edit", "Shop by Category", "Where Elegance Begins", and so on.
- **Cart and checkout wording**, including legally sensitive lines: "(VAT included)", "Shipping and taxes calculated at checkout", "(7-day returns)".
- **Bundle discount percentages** — "Save 15%", "Save 20%", "2+ items: 10% off". These are *wording only*. If you change the real discount in Admin, the on-page text keeps claiming the old figure. **Tell your developer whenever you change a discount.**
- **The sign-in and sign-up screens** — currently **English only**, with no Arabic version anywhere. Arabic visitors see English on those two screens. Worth putting on the list.

Shopify's **Translate & Adapt** app does not reach any of this text.

## Housekeeping to raise with your developer

1. **The homepage's Google search description says "luxury womenswear"** — wrong for what Forme Haus sells. Editing your store name or description in Admin will not fix it; the text is in the code.
2. **The mega-menu contains clothing categories** — Dresses, Tops & Blouses, Shirts, Blazers, Trousers, Skirts, Knitwear, Outerwear, Shoes, Designers. Leftovers from a different store type, fully translated but irrelevant.
3. **A shipping-threshold mismatch.** A second, unused promo line says "299 SAR" in English but "300 ر.س" in Arabic. It doesn't appear to be live, but it should be deleted or corrected before someone switches it on.
4. **An Arabic override file that silently wins.** A small patch file overrides 18 Arabic phrases. If a developer edits an Arabic phrase and nothing changes on the site, that phrase is being overridden here.
5. **Unused piece counts.** The three built-in category tiles carry counts ("24 Pieces", "60 Pieces", "16 Pieces") that are never shown on the site. If anyone has been keeping those current, they can stop.

---

# 6. Troubleshooting

## "I changed something and nothing happened."

Work through these in order:

1. **Was it the homepage?** Wait up to an hour, then load the page **twice** — the first load after the wait is what triggers the refresh; the second shows your change. See the cache section at the top.
2. **Was it a product, menu link, or standard page?** Just reload once. It's almost certainly the second-load behaviour.
3. **Was it a collection banner or Extra field?** Check the collection **exists and has products in it**. An empty collection makes the page rebuild itself and discard every Extra field you set. This is the single most common cause.
4. **Was it a menu rename?** Renaming Collections, About Us / Our Story, or Contact in the Main menu has no effect — those three are fixed. Same for anything under the Footer menu.
5. **Was it Category Card entries?** Nothing there is live yet — see §1.2.
6. **Was it Arabic text on The Edit tiles?** Not live until the pending release is deployed — see §1.3.
7. **Still nothing?** It's probably one of the hardcoded items in §5. Check that list before re-editing.

Do **not** try hard-refresh, `?v=2`, or incognito. None of them clear the cache.

## "I left a field blank and something odd happened."

Blank almost never means "hidden". Three different behaviours:

| Behaviour | Where it applies |
|---|---|
| **Falls back to a built-in value** | Hero button label, social links, WhatsApp number, CR/VAT numbers, built-in category banners and sub-lines. ⚠️ **Clearing does not remove.** A blank Instagram field still shows the icon pointing at the default. Clearing CR or VAT restores the old numbers, not nothing. |
| **Falls back to the English version** | Arabic titles on tiles, Arabic product titles on grids. Arabic shoppers see English. |
| **Disappears completely** | A Bento tile with no image vanishes — and if *all* tiles lose their images, the section silently reverts to the built-in set. Product Vendor, Description, spec rows, measurement image, and empty policies all hide their block. |

The dangerous one is the middle of a set: remove one tile's photo and you lose one tile; remove them all and you've silently reverted the whole section to code defaults without any warning in Admin.

## "My link doesn't work."

**URL fields have no validation.** A typo produces a dead link with no warning anywhere in Admin — nothing turns red, nothing fails to save, and you will only find out by clicking it on the live site.

- After editing **any** Link URL, social URL, or WhatsApp number, **open the live site and click it yourself.**
- WhatsApp number: digits only, country code first, **no `+`** (e.g. `966533954066`). A `+` or a space breaks the button silently.
- Social URLs: paste the full profile address including `https://`.
- Bento tile Link URL: the field demands a full `https://` address even though the tiles point at pages inside your own store. **Ask a developer before changing one** — a full address can break the Arabic/English version of the page it lands on.
- A blank Link URL doesn't error; the tile just becomes unclickable and looks fine.
- If you renamed a product or collection's URL handle, Shopify adds a redirect automatically, so old links keep working. Deleting a page linked from the footer, however, gives visitors a "page not found".

---

*Anything in §5 can be changed — it just needs a developer and a site update. When in doubt, send them the section number from this guide.*
