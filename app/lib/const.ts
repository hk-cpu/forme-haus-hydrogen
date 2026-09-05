/**
 * Host used for Shopify's checkout when PUBLIC_CHECKOUT_DOMAIN is unset.
 *
 * Both the CSP (entry.server) and the Customer Privacy consent config (root)
 * need this, and they previously disagreed: root fell back to
 * "shop.formehaus.me" while entry.server had no fallback at all. That host has
 * no DNS record, so the fallback pointed at somewhere that cannot be reached.
 *
 * checkout.formehaus.me is a real host already pointed at Shopify
 * (CNAME -> shops.myshopify.com), and is the subdomain Shopify's Hydrogen
 * migration guide has you assign to checkout.
 *
 * This is only a fallback. PUBLIC_CHECKOUT_DOMAIN, when set, wins — so
 * correcting the value in the Oxygen environment is what changes production.
 */
export const CHECKOUT_DOMAIN_FALLBACK = 'checkout.formehaus.me';

export const PAGINATION_SIZE = 8;
export const DEFAULT_GRID_IMG_LOAD_EAGER_COUNT = 4;
export const ATTR_LOADING_EAGER = 'eager';

export function getImageLoadingPriority(
  index: number,
  maxEagerLoadCount = DEFAULT_GRID_IMG_LOAD_EAGER_COUNT,
) {
  return index < maxEagerLoadCount ? ATTR_LOADING_EAGER : undefined;
}
