import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';

import pageTemplate from '~/lib/popup-basket.html?raw';

/**
 * /popup — staff basket for in-person pop-ups. Staff tap the items a customer
 * is buying and show one QR; the customer scans it and pays for everything in
 * a single Shopify checkout (via the /cart/<variant>:<qty> route).
 *
 * Served as a standalone HTML document rather than a Remix page so it stays
 * light on staff phones. Products, prices and stock are read live from the
 * Storefront API on every request.
 */
export async function loader({context}: LoaderFunctionArgs) {
  const {products} = await context.storefront.query(POPUP_PRODUCTS_QUERY, {
    cache: context.storefront.CacheNone(),
  });

  const items: PopupItem[] = [];
  for (const product of products.nodes) {
    for (const variant of product.variants.nodes) {
      if (!variant.availableForSale) continue;
      const image = variant.image?.url ?? product.featuredImage?.url;
      items.push({
        id: variant.id.split('/').pop() ?? '',
        t: product.title.replace('(Bundle)', '').replace(/\s+/g, ' ').trim(),
        v: variant.title === 'Default Title' ? '' : variant.title,
        s: sectionOf(product.title, product.productType),
        p: Number(variant.price.amount),
        q: variant.quantityAvailable ?? 1,
        img: image ? withWidth(image, 160) : '',
      });
    }
  }
  items.sort((a, b) =>
    a.s === b.s
      ? a.t.localeCompare(b.t)
      : SECTIONS.indexOf(a.s) - SECTIONS.indexOf(b.s),
  );

  // Embedded in an inline <script>; escape "<" so product text can't close it.
  const json = JSON.stringify(items).replace(/</g, '\\u003c');

  return new Response(
    pageTemplate.replace(/\/\*__ITEMS__\*\/\s*\[\]/, () => json),
    {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store',
        'x-robots-tag': 'noindex, nofollow',
      },
    },
  );
}

type PopupItem = {
  id: string;
  t: string;
  v: string;
  s: Section;
  p: number;
  q: number;
  img: string;
};

const SECTIONS = [
  'Sunglasses',
  'Phone Cases',
  'Bundles',
  'Straps, Chains & Wristlets',
  'Heritage Caps',
  'Other',
] as const;
type Section = (typeof SECTIONS)[number];

function sectionOf(title: string, type: string): Section {
  if (title.includes('+')) return 'Bundles';
  if (/Sun|Aviator|Cat-Eye|Rectang/.test(type)) return 'Sunglasses';
  if (type === 'Phone Case') return 'Phone Cases';
  if (['Strap', 'Chain', 'Wristlet'].includes(type)) {
    return 'Straps, Chains & Wristlets';
  }
  if (type === 'Cap') return 'Heritage Caps';
  return 'Other';
}

function withWidth(url: string, width: number) {
  return `${url}${url.includes('?') ? '&' : '?'}width=${width}`;
}

const POPUP_PRODUCTS_QUERY = `#graphql
  query PopupProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 100) {
      nodes {
        title
        productType
        featuredImage {
          url
        }
        variants(first: 20) {
          nodes {
            id
            title
            availableForSale
            quantityAvailable
            price {
              amount
            }
            image {
              url
            }
          }
        }
      }
    }
  }
` as const;
