import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {redirect} from '@remix-run/server-runtime';

/**
 * Branded checkout handoff route.
 *
 * Reads the active cart from the Hydrogen session, validates it has items,
 * then redirects to the cart's checkoutUrl with the host normalized to the
 * configured branded checkout domain (PUBLIC_CHECKOUT_DOMAIN).
 *
 * If the cart is empty or missing, redirects back to /cart.
 */
export async function loader({context}: LoaderFunctionArgs) {
  const {cart, env} = context;

  // Fetch the current cart from the Hydrogen cart handler
  const cartResult = await cart.get();

  // Validate cart exists and has line items
  const hasItems =
    cartResult &&
    (cartResult.totalQuantity ?? 0) > 0;

  if (!hasItems) {
    return redirect('/cart');
  }

  const checkoutUrl = cartResult.checkoutUrl;

  if (!checkoutUrl) {
    return redirect('/cart');
  }

  // Normalize the checkout URL host to the branded checkout domain
  const brandedCheckoutUrl = normalizeCheckoutUrl(
    checkoutUrl,
    env.PUBLIC_CHECKOUT_DOMAIN,
  );

  return redirect(brandedCheckoutUrl);
}

/**
 * Replaces the Shopify myshopify.com host with the branded checkout domain
 * while preserving the full path, query params, and protocol.
 */
function normalizeCheckoutUrl(
  checkoutUrl: string,
  checkoutDomain: string | undefined,
): string {
  if (!checkoutDomain) {
    return checkoutUrl;
  }

  try {
    const url = new URL(checkoutUrl);
    url.hostname = checkoutDomain;
    // Ensure HTTPS for the branded domain
    url.protocol = 'https:';
    return url.toString();
  } catch {
    // If URL parsing fails, fall back to the original
    return checkoutUrl;
  }
}

export default function CheckoutRoute() {
  // This component never renders because the loader always redirects
  return null;
}
