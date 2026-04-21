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
    case CartForm.ACTIONS.NoteUpdate:
      result = await cart.updateNote(inputs.note);
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
    <main className="bg-background">
      <section className="mx-auto max-w-[1280px] px-4 pb-16 pt-10 md:px-6 md:pt-14">
        <div className="mb-8 border-b border-bronze/15 pb-6 md:mb-10">
          <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-taupe">
            {t('cart.bagLabel', 'Shopping Bag')}
          </p>
          <h1 className="font-serif text-4xl italic text-brand-text md:text-5xl">
            {t('cart.title', 'Your Bag')}
          </h1>
        </div>
        <Cart layout="page" cart={cart} />
        <Analytics.CartView />
      </section>
    </main>
  );
}
