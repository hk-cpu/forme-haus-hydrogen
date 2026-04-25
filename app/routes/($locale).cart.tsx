import {useLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from '@shopify/remix-oxygen';
import {json} from '@remix-run/server-runtime';
import {CartForm, type CartQueryDataReturn, Analytics} from '@shopify/hydrogen';

import {isLocalPath} from '~/lib/utils';
import {Cart} from '~/components/Cart';
import {useTranslation} from '~/hooks/useTranslation';

export async function action({request, context}: ActionFunctionArgs) {
  const {cart} = context;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);
  invariant(action, 'No cartAction defined');

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      // Silently set SA country context after adding lines; ignore errors
      try {
        const existingCountry = result.cart?.buyerIdentity?.countryCode;
        if (!existingCountry) {
          await cart.updateBuyerIdentity({countryCode: 'SA'});
        }
      } catch {
        // non-blocking — checkout still works without buyer identity
      }
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate:
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    case CartForm.ACTIONS.BuyerIdentityUpdate:
      result = await cart.updateBuyerIdentity({
        countryCode: 'SA',
        ...inputs.buyerIdentity,
      });
      break;
    default:
      invariant(false, `${action} cart action is not defined`);
  }

  /**
   * The Cart ID may change after each mutation. We need to update it each time in the session.
   */
  const cartId = result.cart.id;
  const headers = cart.setCartId(result.cart.id);

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string' && isLocalPath(redirectTo)) {
    status = 303;
    headers.set('Location', redirectTo);
  }

  const {cart: cartResult, errors, userErrors} = result;

  return json(
    {
      cart: cartResult,
      userErrors,
      errors,
    },
    {status, headers},
  );
}

export async function loader({context}: LoaderFunctionArgs) {
  const {cart} = context;
  return json(await cart.get());
}

export default function CartRoute() {
  const cart = useLoaderData<typeof loader>();
  const {t} = useTranslation();

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-serif text-[#4A3C31] mb-8">
        {t('cart.title', 'Cart')}
      </h1>
      <Cart layout="page" cart={cart} />
      <Analytics.CartView />
    </div>
  );
}
