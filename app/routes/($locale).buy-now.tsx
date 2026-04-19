import {type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {json} from '@remix-run/server-runtime';

/**
 * Buy Now action — creates a fresh single-item cart and returns the Shopify
 * hosted checkout URL. Does not overwrite the shopper's existing cart cookie.
 *
 * POST body (form-encoded):
 *   variantId  — Shopify ProductVariant GID
 *   quantity   — integer, defaults to 1
 */
export async function action({request, context}: ActionFunctionArgs) {
  const {storefront} = context;
  const formData = await request.formData();

  const variantId = formData.get('variantId') as string | null;
  const quantity = parseInt((formData.get('quantity') as string) || '1', 10);

  if (!variantId) {
    return json({error: 'Missing variantId'}, {status: 400});
  }

  const {cartCreate} = await storefront.mutate(CREATE_CART_MUTATION, {
    variables: {
      input: {
        lines: [{merchandiseId: variantId, quantity}],
        buyerIdentity: {countryCode: 'SA'},
      },
    },
  });

  const userErrors = cartCreate?.userErrors ?? [];
  if (userErrors.length > 0) {
    return json(
      {error: userErrors[0].message ?? 'Unable to create cart.'},
      {status: 422},
    );
  }

  const checkoutUrl = cartCreate?.cart?.checkoutUrl;
  if (!checkoutUrl) {
    return json(
      {error: 'Unable to open checkout. Please try again.'},
      {status: 500},
    );
  }

  return json({checkoutUrl});
}

export default function BuyNowRoute() {
  return null;
}

const CREATE_CART_MUTATION = `#graphql
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
` as const;
