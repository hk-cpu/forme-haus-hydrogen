import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {redirect} from '@remix-run/server-runtime';
import type {CartBuyerIdentityInput} from '@shopify/hydrogen/storefront-api-types';

// In-person pop-up (29 Oct 2026): walk-in customers scan a product QR and
// should only have to tap "Pay now". Carts from these links arrive at checkout
// with every required field prefilled with the store's own details: a
// "Pop-up Customer" name, the store email, and free delivery to the store
// address (billing copies it). Staff hand the item over and fulfil the order
// by hand. Local pickup is not used because Shopify then asks for a billing
// address that cannot be prefilled. Buyers can still overwrite any field,
// e.g. to get an email receipt. Expires on its own; after that the links
// behave as ordinary cart links.
const POPUP_UNTIL = Date.parse('2026-10-30T06:00:00Z');

function popupCheckoutIdentity(): CartBuyerIdentityInput | undefined {
  if (Date.now() >= POPUP_UNTIL) return undefined;
  return {
    countryCode: 'SA',
    email: 'info@formehaus.me',
    deliveryAddressPreferences: [
      {
        deliveryAddress: {
          firstName: 'Pop-up',
          lastName: 'Customer',
          address1: 'Olaya, Al Olaya',
          city: 'Riyadh',
          zip: '11321',
          country: 'SA',
          phone: '+966533954066',
        },
      },
    ],
    preferences: {delivery: {deliveryMethod: ['SHIPPING']}},
  };
}

/**
 * Automatically creates a new cart based on the URL and redirects straight to checkout.
 * Expected URL structure:
 * ```ts
 * /cart/<variant_id>:<quantity>
 *
 * ```
 * More than one `<variant_id>:<quantity>` separated by a comma, can be supplied in the URL, for
 * carts with more than one product variant.
 *
 * @param `?discount` an optional discount code to apply to the cart
 * @example
 * Example path creating a cart with two product variants, different quantities, and a discount code:
 * ```ts
 * /cart/41007289663544:1,41007289696312:2?discount=HYDROBOARD
 *
 * ```
 * @preserve
 */
export async function loader({request, context, params}: LoaderFunctionArgs) {
  const {cart} = context;
  const {lines} = params;
  const linesMap = lines?.split(',').map((line) => {
    const lineDetails = line.split(':');
    const variantId = lineDetails[0];
    const quantity = parseInt(lineDetails[1], 10);

    return {
      merchandiseId: `gid://shopify/ProductVariant/${variantId}`,
      quantity,
    };
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const discount = searchParams.get('discount');
  const discountArray = discount ? [discount] : [];

  //! create a cart
  const input = {lines: linesMap, discountCodes: discountArray};
  const buyerIdentity = popupCheckoutIdentity();
  let result = await cart.create(
    buyerIdentity ? {...input, buyerIdentity} : input,
  );

  // The prefill is a convenience; never let it break the link.
  if (buyerIdentity && (result.errors?.length || !result.cart)) {
    result = await cart.create(input);
  }

  const cartResult = result.cart;

  if (result.errors?.length || !cartResult) {
    throw new Response('Link may be expired. Try checking the URL.', {
      status: 410,
    });
  }

  // Update cart id in cookie
  const headers = cart.setCartId(cartResult.id);

  // Hand off to Shopify's checkout for this cart — the same checkoutUrl the
  // bag's "Proceed to checkout" button uses.
  //
  // This used to redirect to /checkout, the site's own Tap checkout page. That
  // page creates the Shopify order only after payment and only when
  // SHOPIFY_ADMIN_API_TOKEN is configured; without it a customer could pay
  // through Tap and no order would exist — no stock deduction, no VAT record.
  // Shopify's checkout records the order itself, so these links are safe to
  // print as QR codes (e.g. for an in-person pop-up).
  return redirect(cartResult.checkoutUrl, {headers});
}

export default function Component() {
  return null;
}
