# Forme Haus — Customising the Storefront

**A hands-on handover for whoever runs the store.** No technical knowledge needed.

This is the "how do I actually do it" document. Its companion, `ADMIN-GUIDE.md`, is the full reference — what exists, what doesn't, and why. Start here; go there when you want detail.

---

## Before you touch anything — five minutes

### Your site is not a normal Shopify theme

There is **no Customize button** and no drag-and-drop editor. The design is built in code. What you control is the **content inside it**: words, photos, links, products, prices.

That is a deliberate trade. You get a site that looks like nothing else; you give up moving blocks around yourself.

### Everything you can edit lives in one of four places

| Place                             | What lives there                                          |
| --------------------------------- | --------------------------------------------------------- |
| **Products / Collections**        | Everything about what you sell                            |
| **Content → Metaobjects**         | The homepage sections (tiles, cards, promises)            |
| **Content → Menus**               | The header and footer link lists                          |
| **Settings → Custom data → Shop** | Site-wide bits: hero button, social links, CR/VAT numbers |

If you cannot find something in those four places, it is in the code. Ask a developer.

### The one rule that will save you an afternoon

> **Homepage edits take up to an hour to appear.** Everything else is quick.
>
> There is no "clear cache" button. Refreshing harder, opening incognito, adding `?v=2` — none of it works. The saved copy sits on Shopify's servers, not in your browser.
>
> **Change it once. Walk away. Come back later.** Nine times out of ten your edit saved fine and you were looking at a stored copy.

Re-editing because "it didn't work" is the single most common mistake. Resist it.

---

## Your first edit — a safe practice run

Do this once to build confidence. It is trivially reversible.

1. **Settings → Custom data → Shop**
2. Find **Hero CTA (English)**
3. Click **Edit value**, change it to `Explore the Collection` (or anything)
4. Save
5. Open your homepage. **You will probably see no change yet — that is expected.** Wait, then reload.

If it changed, you understand the whole system. Everything else is the same motion in a different place.

---

# How do I…

## …change the button under the logo?

**Settings → Custom data → Shop**

| Field                  | Controls                   |
| ---------------------- | -------------------------- |
| **Hero CTA (English)** | The button text in English |
| **Hero CTA (Arabic)**  | The button text in Arabic  |

The two are separate. Changing one does **not** change the other.

Leave either blank and it falls back to built-in wording, so the button is never empty. Where the button scrolls to is fixed in code.

## …change the three category tiles?

**Content → Metaobjects → Category Card** — three entries: New to Haus, Phone Accessories, Sunglasses.

| Field               | Notes                                                   |
| ------------------- | ------------------------------------------------------- |
| **Title (English)** | Required                                                |
| **Title (Arabic)**  | Blank → Arabic shoppers see the English title           |
| **Image**           | Required. Tall portrait shape works best                |
| **Link URL**        | Required. Must start with `/` — see the link rule below |
| **Sort Order**      | 1, 2, 3 — left to right                                 |

**Add a fourth tile?** Create a new entry. The row grows.
**Remove one?** Delete the entry. Delete all three and built-in tiles reappear.

## …change the four large photo tiles ("The Edit")?

**Content → Metaobjects → Bento Item** — four entries.

Same idea, plus **Subtitle (English/Arabic)** for the small line, and **Image Alt Text** for accessibility and Google.

The section shows **exactly four**. A fifth entry will not appear anywhere.

## …change the Journal cards?

**Content → Metaobjects → Journal Card** — three entries.

| Field                        | Notes                                                         |
| ---------------------------- | ------------------------------------------------------------- |
| **Title (English/Arabic)**   | English required                                              |
| **Excerpt (English/Arabic)** | The small line. Blank is fine — the card just shows the title |
| **Image**                    | Required. A card with no photo is not shown                   |
| **Link URL**                 | Must start with `/`, e.g. `/journal/everyday-elegance`        |
| **Sort Order**               | 1, 2, 3                                                       |

These link to your Journal articles but do **not** update automatically when you publish a new article. Publishing an article and adding a card here are two separate jobs.

## …change the "Why Choose Us" items?

**Content → Metaobjects → Brand Promise** — four entries.

| Field                            | Notes                                           |
| -------------------------------- | ----------------------------------------------- |
| **Title (English/Arabic)**       | English required                                |
| **Description (English/Arabic)** | Keep to one short line                          |
| **Icon**                         | Choose one: `shield`, `sparkle`, `globe`, `gem` |
| **Sort Order**                   | 1–4                                             |

Only those four symbols exist. A new symbol needs a developer. You can add a fifth promise — the row grows.

## …change the header menu?

**Content → Menus → Main menu.** Add, remove, reorder, including drop-downs.

Empty it entirely and the header falls back to four built-in links, so it never goes blank.

## …change the footer links?

**Content → Menus → Footer menu.**

> **Right now this menu is empty**, so the footer is showing five built-in links (Contact us, Shipping & Delivery Policy, Return & Exchange Policy, Privacy Policy, Terms & Conditions).
>
> The moment you add **one** item to this menu, it replaces **all five**. So add the full set you want, not just one.

## …change the social links, WhatsApp number, or CR/VAT?

**Settings → Custom data → Shop**

| Field                                 | Notes                                      |
| ------------------------------------- | ------------------------------------------ |
| **Instagram / Snapchat / TikTok URL** | Full `https://` addresses are correct here |
| **WhatsApp Number**                   | Country code, no `+`. e.g. `966533954066`  |
| **Commercial Registration No.**       | Shown in the footer                        |
| **VAT Registration No.**              | Shown in the footer                        |

Only these three platforms exist. A fourth needs a developer.

## …change a collection page?

**Products → Collections → [pick one]**

| What                   | Where                             |
| ---------------------- | --------------------------------- |
| Heading                | The collection **Title**          |
| Line under the heading | The collection **Description**    |
| Which products appear  | The collection's products / rules |
| Banner image           | **Custom data → Hero Image**      |
| Hide the heading       | **Custom data → Hide Title**      |

Ten collections have a built-in line under the heading. **Whatever you type in Description now wins over it.** Clear the Description and the built-in line comes back.

## …change a product?

Entirely standard Shopify. Title, description, photos, price, variants, inventory — all normal.

Two extras worth knowing:

- **Specification rows** (Frame Shape, UV Protection…) come from the product's **Custom data**. You control the values; the labels are fixed English.
- **iPhone compatibility badges** appear if you tag a product `iphone-17-pro`, `iphone-16-plus` and so on. First two show, then "+N more".

---

## The three rules that will bite you

### 1. Links must start with a slash

In any **Link URL** field, write `/collections/sunglasses` — **not** `https://formehaus.me/collections/sunglasses`.

A full address sends Arabic shoppers to the English page and makes the link slower. This applies to Category Card, Bento Item and Journal Card.

Social links in Settings are the exception — those are external and need the full `https://`.

### 2. Nothing validates your links

Type a path that doesn't exist and you get a dead link with no warning. After changing one, **click it on the live site**.

### 3. Blank is usually safe, but not always

Most blank fields fall back to built-in wording. Two exceptions:

- **A tile or card with no image is not shown at all.**
- **Delete every entry in a group and the built-in version reappears** — which can look like your changes vanished.

---

## When to call a developer

Ask for anything in these categories — none of it is in Admin:

- Layout, spacing, colours, animations, section order
- Any heading or button label not listed above (roughly 500 fixed phrases across both languages)
- New icon symbols, a fourth social platform, a fifth Edit tile
- The trust badges and the homepage statistics
- The sign-in and sign-up screens, which are English-only

**Make the request easy to action.** Include:

1. A screenshot with the thing circled
2. What it says now, and what it should say — in **both** languages if it's text
3. The page URL

`ADMIN-GUIDE.md` §5 has the full list of what is fixed in code, plus a set of known issues worth raising.

---

## Quick reference

| I want to change…            | Go to                                 |
| ---------------------------- | ------------------------------------- |
| Hero button text             | Settings → Custom data → Shop         |
| Category tiles               | Content → Metaobjects → Category Card |
| The Edit tiles               | Content → Metaobjects → Bento Item    |
| Journal cards                | Content → Metaobjects → Journal Card  |
| Why Choose Us                | Content → Metaobjects → Brand Promise |
| Header menu                  | Content → Menus → Main menu           |
| Footer links                 | Content → Menus → Footer menu         |
| Social / WhatsApp / CR / VAT | Settings → Custom data → Shop         |
| Collection banner or heading | Collection → Custom data              |
| Products, prices, stock      | Products                              |

**And remember:** homepage changes take up to an hour. Everything else is quick.
