import {test, expect, type Page} from '@playwright/test';

/**
 * Mobile layout tests.
 *
 * These exist because of a real bug: on a 390px phone the product page laid
 * itself out 552px wide and then clipped, so the title rendered as
 * "WHERE IT STARTED — Diriya" with the last letter cut off. Nothing scrolled
 * sideways, so the page looked merely "off" rather than obviously broken, and
 * no existing test noticed.
 *
 * The cause was a grid item that could not shrink. Grid and flex items default
 * to min-width:auto, so a child that refuses to shrink — here a thumbnail strip
 * of flex-shrink-0 images — sets the width of the whole track. Any component
 * can reintroduce that, which is why this is a test rather than a one-off fix.
 *
 * Running these against a deployed site needs no Shopify credentials:
 *
 *   URL=https://formehaus.me npx playwright test tests/mobile-layout.spec.ts
 *
 * Without URL, Playwright boots a local preview server, which does need
 * credentials in .env.
 */

const PHONES = [
  {name: 'iPhone SE', width: 375, height: 667},
  {name: 'iPhone 14', width: 390, height: 844},
  {name: 'Pixel 7', width: 412, height: 915},
];

type Offender = {over: number; tag: string; cls: string; text: string};

type Measurement = {
  title: string;
  bodyTextLength: number;
  documentOverflow: number;
  offenders: Offender[];
};

/**
 * Measures how far past the right edge of the viewport anything reaches.
 *
 * Three things are deliberately not counted. Descendants of a horizontal
 * scroller are meant to overflow — that is what a carousel is. Fixed-position
 * elements are placed against the viewport rather than the document flow, so
 * an off-screen drawer is not a layout fault. And boxes with no text are
 * skipped, because decorative layers legitimately overhang: this page has an
 * `absolute inset-[-20%]` glow inside an overflow-hidden wrapper that reaches
 * 105px past the edge by design and is never visible.
 *
 * Note what is NOT excluded: elements inside an overflow-hidden ancestor.
 * Excluding those would be the obvious way to silence that decorative glow,
 * and it would also have silenced the bug this file exists for — the product
 * title was clipped by exactly such an ancestor, which is why the page never
 * scrolled sideways and the breakage looked like a styling quirk. Text is the
 * discriminator, not clipping.
 */
async function measure(
  page: Page,
  viewportWidth: number,
): Promise<Measurement> {
  return page.evaluate((vw) => {
    const isInsideScroller = (el: Element): boolean => {
      let parent = el.parentElement;
      while (parent) {
        const overflowX = getComputedStyle(parent).overflowX;
        if (overflowX === 'auto' || overflowX === 'scroll') return true;
        parent = parent.parentElement;
      }
      return false;
    };

    const offenders: Offender[] = [];
    for (const el of Array.from(document.querySelectorAll('body *'))) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      if (getComputedStyle(el).position === 'fixed') continue;
      if (isInsideScroller(el)) continue;
      if (!(el.textContent || '').trim()) continue;

      const over = Math.round(rect.right - vw);
      if (over > 1) {
        offenders.push({
          over,
          tag: el.tagName.toLowerCase(),
          cls:
            typeof el.className === 'string' ? el.className.slice(0, 90) : '',
          text: (el.textContent || '').trim().slice(0, 40),
        });
      }
    }
    offenders.sort((a, b) => b.over - a.over);

    const de = document.documentElement;
    return {
      title: document.title,
      bodyTextLength: (document.body.innerText || '').trim().length,
      documentOverflow: de.scrollWidth - de.clientWidth,
      offenders: offenders.slice(0, 5),
    };
  }, viewportWidth);
}

function describeOffenders(m: Measurement): string {
  return m.offenders
    .map((o) => `  +${o.over}px  <${o.tag} class="${o.cls}">  ${o.text}`)
    .join('\n');
}

/** Finds a real product URL rather than hardcoding a handle that may be renamed. */
async function firstProductPath(page: Page): Promise<string | null> {
  await page.goto('/collections/all', {waitUntil: 'domcontentloaded'});
  await page.waitForTimeout(1500);
  return page
    .locator('a[href*="/products/"]')
    .first()
    .getAttribute('href')
    .catch(() => null);
}

for (const phone of PHONES) {
  test.describe(`${phone.name} (${phone.width}px)`, () => {
    test.use({viewport: {width: phone.width, height: phone.height}});

    const pages = [
      {name: 'Homepage', path: '/'},
      {name: 'All products', path: '/collections/all'},
      {name: 'Contact', path: '/contact'},
      {name: 'Cart', path: '/cart'},
    ];

    for (const target of pages) {
      test(`${target.name} fits the screen`, async ({page}) => {
        await page.goto(target.path, {waitUntil: 'domcontentloaded'});
        await page.waitForTimeout(2000);

        const m = await measure(page, phone.width);

        // Control. Every assertion below passes trivially on a blank or error
        // page, so prove the page actually rendered before trusting them.
        expect(
          m.bodyTextLength,
          `${target.path} rendered no text — the checks below would pass on an error page`,
        ).toBeGreaterThan(50);

        expect(
          m.documentOverflow,
          `${target.path} scrolls sideways by ${m.documentOverflow}px`,
        ).toBeLessThanOrEqual(1);

        expect(
          m.offenders,
          `${target.path} has content past the right edge at ${
            phone.width
          }px:\n${describeOffenders(m)}`,
        ).toEqual([]);
      });
    }

    test('Product page fits the screen', async ({page}) => {
      const path = await firstProductPath(page);
      test.skip(!path, 'No product link found on /collections/all');

      await page.goto(path as string, {waitUntil: 'domcontentloaded'});
      await page.waitForTimeout(2000);

      const m = await measure(page, phone.width);
      expect(m.bodyTextLength, 'Product page rendered no text').toBeGreaterThan(
        50,
      );
      expect(m.documentOverflow).toBeLessThanOrEqual(1);
      expect(
        m.offenders,
        `Product page has content past the right edge at ${
          phone.width
        }px:\n${describeOffenders(m)}`,
      ).toEqual([]);
    });

    test('Product title is not cut off', async ({page}) => {
      const path = await firstProductPath(page);
      test.skip(!path, 'No product link found on /collections/all');

      await page.goto(path as string, {waitUntil: 'domcontentloaded'});
      await page.waitForTimeout(2000);

      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();

      const box = await h1.boundingBox();
      expect(box, 'Product title has no box').not.toBeNull();

      // The exact regression: the title box ran to 528px on a 390px screen.
      expect(
        Math.round(
          (box as {x: number; width: number}).x +
            (box as {x: number; width: number}).width,
        ),
        `Product title extends past the ${phone.width}px viewport`,
      ).toBeLessThanOrEqual(phone.width + 1);
    });

    test('Fixed bottom bar does not cover page content', async ({page}) => {
      await page.goto('/', {waitUntil: 'domcontentloaded'});
      await page.waitForTimeout(2000);

      const result = await page.evaluate(() => {
        let barHeight = 0;
        for (const el of Array.from(document.querySelectorAll('body *'))) {
          const cs = getComputedStyle(el);
          if (cs.position !== 'fixed') continue;
          const r = el.getBoundingClientRect();
          if (r.height === 0 || r.width === 0) continue;
          // anchored to the bottom edge and living in the lower half
          if (
            r.bottom >= window.innerHeight - 4 &&
            r.top > window.innerHeight / 2
          ) {
            barHeight = Math.max(barHeight, Math.round(r.height));
          }
        }
        const main = document.querySelector('main');
        const pad = main ? parseFloat(getComputedStyle(main).paddingBottom) : 0;
        return {barHeight, mainPaddingBottom: Math.round(pad || 0)};
      });

      test.skip(
        result.barHeight === 0,
        'No fixed bottom bar rendered at this size',
      );

      expect(
        result.mainPaddingBottom,
        `A ${result.barHeight}px fixed bottom bar overlaps page content: ` +
          `main reserves only ${result.mainPaddingBottom}px for it`,
      ).toBeGreaterThanOrEqual(result.barHeight);
    });
  });
}
