import clsx from 'clsx';
import {useRef, useState} from 'react';
import useScroll from 'react-use/esm/useScroll';
import {motion, AnimatePresence} from 'framer-motion';
import {useFetcher, useRouteLoaderData} from '@remix-run/react';
// eslint-disable-next-line import/order
import {
  flattenConnection,
  CartForm,
  Image,
  Money,
  ShopPayButton,
  useOptimisticData,
  OptimisticInput,
  type CartReturn,
} from '@shopify/hydrogen';

// Tap Payments replaces HyperPay — supports Mada, Visa, MC, AMEX, Apple Pay, STC Pay
import type {
  Cart as CartType,
  CartCost,
  CartLine,
  CartLineUpdateInput,
} from '@shopify/hydrogen/storefront-api-types';

import {Button} from '~/components/Button';
import {Text, Heading} from '~/components/Text';
import {Link} from '~/components/Link';
import {IconRemove} from '~/components/Icon';
import {FeaturedProducts} from '~/components/FeaturedProducts';
import {buildLocalePath, getInputStyleClasses} from '~/lib/utils';
import {useTranslation} from '~/hooks/useTranslation';
import type {RootLoader} from '~/root';

// ============================================================================
// PREMIUM CART ICONS
// ============================================================================
const Icons = {
  Bag: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M6 6h12l1 15H5L6 6z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 6V5a3 3 0 0 1 6 0v1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Trash: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Minus: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
    </svg>
  ),
  Plus: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
      <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
    </svg>
  ),
  Tag: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  Truck: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  Gift: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polyline
        points="20 12 20 22 4 22 4 12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path
        d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Check: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline
        points="20 6 9 17 4 12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Lock: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path
        d="M7 11V7a5 5 0 0 1 10 0v4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  ArrowRight: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <line
        x1="5"
        y1="12"
        x2="19"
        y2="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="12 5 19 12 12 19"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Shopping: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path
        d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="3"
        y1="6"
        x2="21"
        y2="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 10a4 4 0 0 1-8 0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

type Layouts = 'page' | 'drawer';

export function Cart({
  layout,
  onClose,
  cart,
}: {
  layout: Layouts;
  onClose?: () => void;
  cart: CartReturn | null;
}) {
  const linesCount = Boolean(cart?.lines?.edges?.length || 0);

  return (
    <>
      <CartEmpty hidden={linesCount} onClose={onClose} layout={layout} />
      <CartDetails cart={cart} layout={layout} onClose={onClose} />
    </>
  );
}

export function CartDetails({
  layout,
  cart,
  onClose,
}: {
  layout: Layouts;
  cart: CartType | null;
  onClose?: () => void;
}) {
  const cartHasItems = !!cart && cart.totalQuantity > 0;
  const container = {
    drawer: 'flex flex-col h-full w-full',
    page: 'w-full pb-12 grid md:grid-cols-2 md:items-start gap-8 md:gap-8 lg:gap-12',
  };

  return (
    <div className={container[layout]}>
      <CartLines lines={cart?.lines} layout={layout} />
      {cartHasItems && (
        <CartSummary cost={cart.cost} layout={layout}>
          <CartDiscounts discountCodes={cart.discountCodes} />
          {layout === 'page' && <CartNote note={cart.note} />}
          <CartCheckoutActions
            checkoutUrl={cart.checkoutUrl}
            cart={cart}
            layout={layout}
            onClose={onClose}
          />
        </CartSummary>
      )}
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes: CartType['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];
  const {t} = useTranslation();

  return (
    <div className="space-y-3">
      {/* Display applied discount codes */}
      {codes && codes.length > 0 && (
        <motion.div
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-bronze/10 to-transparent rounded-lg border border-bronze/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-bronze/20 flex items-center justify-center">
              <Icons.Tag className="text-bronze" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-taupe block">
                {t('cart.discount')}
              </span>
              <span className="text-sm font-medium text-warm">
                {codes.join(', ')}
              </span>
            </div>
          </div>
          <UpdateDiscountForm>
            <motion.button
              type="submit"
              className="p-2 hover:bg-warm/10 rounded-full transition-colors"
              aria-label="Remove discount"
              whileHover={{scale: 1.1}}
              whileTap={{scale: 0.95}}
            >
              <IconRemove aria-hidden="true" className="w-4 h-4 text-taupe" />
            </motion.button>
          </UpdateDiscountForm>
        </motion.div>
      )}

      {/* Input to apply a discount code */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Icons.Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe" />
            <input
              className="w-full pl-10 pr-4 py-3 text-base bg-surface border border-taupe/20 rounded-lg text-warm placeholder:text-taupe/50 focus:outline-none focus:border-bronze/50 transition-colors"
              type="text"
              name="discountCode"
              placeholder={t('cart.enterDiscountCode', 'Enter discount code')}
            />
          </div>
          <motion.button
            type="submit"
            className="px-5 py-3 text-xs uppercase tracking-wider font-medium text-warm bg-surface border border-taupe/20 rounded-lg hover:bg-bronze hover:border-bronze transition-all flex items-center gap-2"
            whileHover={{scale: 1.02}}
            whileTap={{scale: 0.98}}
          >
            {t('cart.apply', 'Apply')}
          </motion.button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartNote({note}: {note?: string | null}) {
  const {t} = useTranslation();

  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.NoteUpdate}
      inputs={{
        note: note || '',
      }}
    >
      {(fetcher) => (
        <div className="space-y-2">
          <label
            htmlFor="cart-note"
            className="text-[10px] uppercase tracking-wider text-taupe block"
          >
            {t('cart.deliveryNote', 'Delivery note')}
          </label>
          <div className="relative">
            <textarea
              id="cart-note"
              name="note"
              rows={2}
              defaultValue={note || ''}
              placeholder={t(
                'cart.deliveryNotePlaceholder',
                'Add a note about your order (optional)',
              )}
              className="w-full px-4 py-3 text-sm bg-surface border border-taupe/20 rounded-lg text-warm placeholder:text-taupe/50 focus:outline-none focus:border-bronze/50 transition-colors resize-none"
            />
            <motion.button
              type="submit"
              className="absolute bottom-2 right-2 px-3 py-1 text-[10px] uppercase tracking-wider font-medium text-warm bg-background border border-taupe/20 rounded-md hover:bg-bronze hover:border-bronze hover:text-white transition-all"
              whileHover={{scale: 1.02}}
              whileTap={{scale: 0.98}}
              disabled={fetcher.state !== 'idle'}
            >
              {fetcher.state !== 'idle'
                ? t('cart.saving', 'Saving...')
                : t('cart.saveNote', 'Save')}
            </motion.button>
          </div>
        </div>
      )}
    </CartForm>
  );
}

function CartLines({
  layout = 'drawer',
  lines: cartLines,
}: {
  layout: Layouts;
  lines: CartType['lines'] | undefined;
}) {
  const currentLines = cartLines ? flattenConnection(cartLines) : [];
  const scrollRef = useRef(null);
  const {y} = useScroll(scrollRef);

  const className = clsx([
    y > 0 ? 'border-t border-bronze/10' : '',
    layout === 'page'
      ? 'flex-grow md:translate-y-4'
      : 'flex-none px-6 pb-6 pt-2 sm:pt-0 transition md:px-12', // flex-none to prevent squishing, letting parent overflow-y-auto work
  ]);

  return (
    <section
      ref={scrollRef}
      aria-labelledby="cart-contents"
      className={clsx(className, 'flex-1 overflow-y-auto')}
    >
      <ul className="grid gap-6 md:gap-8">
        <AnimatePresence initial={false} mode="popLayout">
          {currentLines.map((line, index) => (
            <CartLineItem key={line.id} line={line as CartLine} index={index} />
          ))}
        </AnimatePresence>
      </ul>
    </section>
  );
}

function TapPayCheckoutButton({cart}: {cart: CartType}) {
  const fetcher = useFetcher<{
    chargeId?: string;
    redirectUrl?: string;
    error?: string;
  }>();
  const rootData = useRouteLoaderData<RootLoader>('root');

  const total = cart.cost?.totalAmount?.amount ?? '0';
  const currency = cart.cost?.totalAmount?.currencyCode ?? 'SAR';
  const merchantTxId = `FH-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
  const tapInitiatePath = buildLocalePath(
    '/tap/initiate',
    rootData?.selectedLocale?.pathPrefix,
  );

  function initiatePayment() {
    fetcher.submit(
      {amount: total, currency, merchantTxId, cartId: cart.id || ''},
      {method: 'post', action: tapInitiatePath},
    );
  }

  // Redirect to Tap's hosted payment page when we get the URL
  if (fetcher.state === 'idle' && fetcher.data?.redirectUrl) {
    if (typeof window !== 'undefined') {
      // Clean up cart drawer scroll lock before leaving so history back works cleanly
      document.body.style.overflow = '';
      window.location.href = fetcher.data.redirectUrl;
    }
  }

  return (
    <div>
      {fetcher.state !== 'idle' ? (
        <div className="flex items-center justify-center gap-2 py-4 text-taupe text-sm">
          <div className="w-4 h-4 rounded-full border-2 border-bronze/30 border-t-bronze animate-spin" />
          Preparing secure payment…
        </div>
      ) : fetcher.data?.error ? (
        <div className="p-3 bg-red-400/10 border border-red-400/20 rounded-lg text-red-400 text-xs text-center">
          {fetcher.data.error}
          <button
            onClick={() => initiatePayment()}
            className="block w-full mt-2 text-taupe hover:text-warm underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <motion.button
          type="button"
          onClick={initiatePayment}
          className="w-full py-3.5 rounded-xl bg-[#1B5E20] hover:bg-[#2E7D32] text-white text-[11px] uppercase tracking-wider font-medium flex items-center justify-center gap-2 transition-colors"
          whileHover={{scale: 1.01}}
          whileTap={{scale: 0.99}}
        >
          <Icons.Lock className="w-3.5 h-3.5" />
          Pay with mada / Card / Apple Pay
        </motion.button>
      )}
    </div>
  );
}

function CartCheckoutActions({
  checkoutUrl,
  cart,
  layout,
  onClose,
}: {
  checkoutUrl: string;
  cart: CartType;
  layout: Layouts;
  onClose?: () => void;
}) {
  const {t} = useTranslation();
  const rootData = useRouteLoaderData<RootLoader>('root');

  if (!checkoutUrl) return null;

  const checkoutPath = buildLocalePath(
    '/checkout',
    rootData?.selectedLocale?.pathPrefix,
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Primary CTA: Proceed to secure checkout via branded Shopify checkout */}
      <Link
        to={checkoutPath}
        onClick={onClose}
        className="w-full py-4 rounded-xl bg-bronze hover:bg-bronze-dark text-white text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2 transition-colors"
      >
        <Icons.Lock className="w-3.5 h-3.5" />
        {t('cart.proceedToCheckout', 'Proceed to secure checkout')}
      </Link>

      {/* Alternative: Tap Payments — mada + Visa/MC + Apple Pay + STC Pay */}
      <TapPayCheckoutButton cart={cart} />

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-4 py-2">
        <div className="flex items-center gap-1.5 text-taupe text-[10px]">
          <Icons.Lock className="w-3 h-3" />
          <span>{t('cart.secureCheckout', 'Secure Checkout')}</span>
        </div>
        <div className="w-px h-3 bg-taupe/30" />
        <div className="flex items-center gap-1.5 text-taupe text-[10px]">
          <Icons.Truck className="w-3 h-3" />
          <span>{t('cart.freeShipping', 'Free Shipping')}</span>
        </div>
      </div>

      {/* Terms */}
      <p className="text-[10px] text-center text-taupe/60">
        {t('cart.terms', 'By proceeding, you agree to our')}{' '}
        <Link
          to="/policies/terms-of-service"
          className="text-bronze hover:underline"
        >
          {t('cart.termsLink', 'Terms')}
        </Link>{' '}
        {t('cart.and', 'and')}{' '}
        <Link
          to="/policies/refund-policy"
          className="text-bronze hover:underline"
        >
          {t('cart.refundsLink', 'Refund Policy')}
        </Link>
      </p>
    </div>
  );
}

// Free shipping threshold in SAR — update to match your Shopify shipping rules
const FREE_SHIPPING_THRESHOLD = 250;

function FreeShippingBar({subtotal}: {subtotal: string | undefined}) {
  const amount = parseFloat(subtotal || '0');
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - amount);
  const progress = Math.min(100, (amount / FREE_SHIPPING_THRESHOLD) * 100);
  const isFree = remaining === 0;

  return (
    <div className="px-1 py-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Icons.Truck className="w-3.5 h-3.5 text-bronze" />
          {isFree ? (
            <span className="text-[11px] text-bronze font-medium">
              🎉 You&apos;ve unlocked free shipping!
            </span>
          ) : (
            <span className="text-[11px] text-taupe">
              Add{' '}
              <span className="text-warm font-semibold">
                {remaining.toFixed(0)} SAR
              </span>{' '}
              for free shipping
            </span>
          )}
        </div>
        <span className="text-[10px] text-taupe">
          {FREE_SHIPPING_THRESHOLD} SAR
        </span>
      </div>
      <div className="h-1 bg-taupe/15 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-bronze to-bronze-light"
          initial={{width: 0}}
          animate={{width: `${progress}%`}}
          transition={{duration: 0.6, ease: [0.16, 1, 0.3, 1]}}
        />
      </div>
    </div>
  );
}

function GCCPaymentBadges() {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap py-1">
      {/* mada */}
      <div className="px-2 py-1 bg-surface rounded border border-taupe/10 flex items-center">
        <span className="text-[9px] font-bold text-[#1B5E20] tracking-wide">
          mada
        </span>
      </div>
      {/* STC Pay */}
      <div className="px-2 py-1 bg-surface rounded border border-taupe/10 flex items-center">
        <span className="text-[9px] font-bold text-purple-400 tracking-wide">
          STC Pay
        </span>
      </div>
      {/* Apple Pay */}
      <div className="px-2 py-1 bg-surface rounded border border-taupe/10 flex items-center">
        <svg
          className="w-7 h-3.5"
          viewBox="0 0 80 34"
          fill="white"
          aria-label="Apple Pay"
        >
          <path d="M15.1 6.5c-.8.9-2 1.6-3.2 1.5-.2-1.2.5-2.5 1.2-3.3C13.9 3.7 15.2 3 16.3 3c.1 1.3-.4 2.6-1.2 3.5zm1.2 1.8c-1.8-.1-3.3 1-4.1 1s-2.1-1-3.6-.9c-1.8 0-3.5 1-4.4 2.6-1.9 3.3-.5 8.1 1.3 10.8.9 1.3 2 2.7 3.4 2.6 1.4-.1 1.9-.9 3.5-.9 1.6 0 2.1.9 3.5.9 1.4-.1 2.3-1.3 3.2-2.6.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.4-.9-2.5-3.7 0-2.3 1.9-3.4 2-3.5-.1-1.3-2.1-2.5-3.6-2.6z" />
          <text
            x="28"
            y="22"
            fontSize="14"
            fontWeight="600"
            fill="white"
            fontFamily="-apple-system, sans-serif"
          >
            Pay
          </text>
        </svg>
      </div>
      {/* Tabby */}
      <div className="px-2 py-1 bg-surface rounded border border-taupe/10 flex items-center">
        <span className="text-[9px] font-bold text-[#3BB273] tracking-wide">
          tabby
        </span>
      </div>
      {/* Tamara */}
      <div className="px-2 py-1 bg-surface rounded border border-taupe/10 flex items-center">
        <span className="text-[9px] font-bold text-[#F6A623] tracking-wide">
          tamara
        </span>
      </div>
    </div>
  );
}

function CartSummary({
  cost,
  layout,
  children = null,
}: {
  children?: React.ReactNode;
  cost: CartCost;
  layout: Layouts;
}) {
  const {t} = useTranslation();

  const summary = {
    drawer:
      'grid gap-4 p-6 border-t border-bronze/20 bg-gradient-to-t from-background to-background',
    page: 'sticky top-nav grid gap-6 p-4 md:px-6 md:translate-y-4 bg-primary/5 rounded-xl w-full',
  };

  return (
    <section aria-labelledby="summary-heading" className={summary[layout]}>
      <h2 id="summary-heading" className="sr-only">
        Order summary
      </h2>

      {/* Free Shipping Progress Bar — drawer only for cleanliness */}
      {layout === 'drawer' && (
        <FreeShippingBar subtotal={cost?.subtotalAmount?.amount} />
      )}

      {/* Subtotal */}
      <div className="flex items-center justify-between py-4 border-b border-bronze/10">
        <div className="flex items-center gap-2">
          <Icons.Bag className="w-4 h-4 text-taupe" />
          <Text as="span" className="text-taupe">
            <CartSubtotalLabel />
          </Text>
        </div>
        <Text
          as="span"
          className="text-warm font-semibold text-xl"
          data-test="subtotal"
        >
          {cost?.subtotalAmount?.amount ? (
            <Money data={cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </Text>
      </div>

      {/* Additional Content (Discounts, etc.) */}
      {children}

      {/* GCC Payment Method Badges */}
      {layout === 'drawer' && (
        <div className="pt-1">
          <p className="text-[9px] text-center text-taupe/50 uppercase tracking-wider mb-2">
            Accepted payments
          </p>
          <GCCPaymentBadges />
        </div>
      )}
    </section>
  );
}

type OptimisticData = {
  action?: string;
  quantity?: number;
};

function CartLineItem({line, index}: {line: CartLine; index?: number}) {
  const optimisticData = useOptimisticData<OptimisticData>(line?.id);

  if (!line?.id) return null;

  const {id, quantity, merchandise} = line;

  if (typeof quantity === 'undefined' || !merchandise?.product) return null;

  return (
    <motion.li
      layout
      initial={{opacity: 0, y: 20, scale: 0.95}}
      animate={{opacity: 1, y: 0, scale: 1}}
      exit={{opacity: 0, x: -50, height: 0, marginBottom: 0}}
      transition={{
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
        delay: (index || 0) * 0.05,
      }}
      key={id}
      className="flex gap-4 pb-6 border-b border-bronze/10 last:border-0 last:pb-0"
      style={{
        display: optimisticData?.action === 'remove' ? 'none' : 'flex',
      }}
    >
      {/* Product Image */}
      <motion.div className="flex-shrink-0" whileHover={{scale: 1.02}}>
        {merchandise.image ? (
          <Link to={`/products/${merchandise.product.handle}`}>
            <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-surface to-background rounded-xl overflow-hidden border border-taupe/10 hover:border-bronze/30 transition-colors">
              <Image
                width={112}
                height={112}
                data={merchandise.image}
                className="w-full h-full object-contain p-2 hover:scale-105 transition-transform transition-opacity duration-500"
                alt={merchandise.product?.title || ''}
              />
            </div>
          </Link>
        ) : (
          <div className="w-24 h-24 md:w-28 md:h-28 bg-surface rounded-xl overflow-hidden flex items-center justify-center border border-taupe/10">
            <Icons.Bag className="w-8 h-8 text-taupe/30" />
          </div>
        )}
      </motion.div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Product Title */}
          <Heading
            as="h3"
            size="copy"
            className="font-serif text-warm text-[15px] leading-tight mb-1"
          >
            {merchandise?.product?.handle ? (
              <Link
                to={`/products/${merchandise.product.handle}`}
                className="hover:text-bronze transition-colors"
              >
                {merchandise.product.title}
              </Link>
            ) : (
              <Text>{merchandise.product?.title || 'Product'}</Text>
            )}
          </Heading>

          {/* Selected Options */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
            {(merchandise?.selectedOptions || []).map((option) => (
              <Text
                color="subtle"
                key={option.name}
                className="text-taupe text-xs"
              >
                {option.name}: <span className="text-warm">{option.value}</span>
              </Text>
            ))}
          </div>

          {/* Unit Price */}
          <Text className="text-bronze text-sm font-medium">
            <CartLinePrice line={line} as="span" priceType="regular" />
          </Text>
        </div>

        {/* Quantity and Remove */}
        <div className="flex items-center justify-between mt-3">
          <CartLineQuantityAdjust line={line} />
          <ItemRemoveButton lineId={id} />
        </div>
      </div>
    </motion.li>
  );
}

function ItemRemoveButton({lineId}: {lineId: CartLine['id']}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{
        lineIds: [lineId],
      }}
    >
      {(fetcher) => (
        <>
          <motion.button
            className={clsx(
              'flex items-center gap-2 text-taupe hover:text-red-400 transition-colors text-xs uppercase tracking-wider group',
              fetcher.state !== 'idle' && 'opacity-50 cursor-not-allowed',
            )}
            type="submit"
            disabled={fetcher.state !== 'idle'}
            whileHover={{x: 2}}
            whileTap={{scale: 0.95}}
          >
            <Icons.Trash className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Remove</span>
          </motion.button>
          <OptimisticInput id={lineId} data={{action: 'remove'}} />
        </>
      )}
    </CartForm>
  );
}

function CartLineQuantityAdjust({line}: {line: CartLine}) {
  const optimisticId = line?.id;
  const optimisticData = useOptimisticData<OptimisticData>(optimisticId);

  if (!line || typeof line?.quantity === 'undefined') return null;

  const optimisticQuantity = optimisticData?.quantity || line.quantity;

  const {id: lineId} = line;
  const prevQuantity = Number(Math.max(0, optimisticQuantity - 1).toFixed(0));
  const nextQuantity = Number((optimisticQuantity + 1).toFixed(0));

  return (
    <div className="flex items-center">
      <label htmlFor={`quantity-${lineId}`} className="sr-only">
        Quantity, {optimisticQuantity}
      </label>
      <div className="flex items-center bg-surface rounded-xl border border-taupe/20 overflow-hidden">
        <UpdateCartButton lines={[{id: lineId, quantity: prevQuantity}]}>
          {(fetcher) => (
            <motion.button
              name="decrease-quantity"
              aria-label="Decrease quantity"
              className={clsx(
                'w-11 h-11 flex items-center justify-center text-taupe hover:text-warm hover:bg-taupe/10 disabled:text-taupe/30 transition-colors',
                fetcher.state !== 'idle' && 'opacity-50 cursor-not-allowed',
              )}
              value={prevQuantity}
              disabled={optimisticQuantity <= 1 || fetcher.state !== 'idle'}
              whileTap={{scale: 0.9}}
            >
              <Icons.Minus />
              <OptimisticInput
                id={optimisticId}
                data={{quantity: prevQuantity}}
              />
            </motion.button>
          )}
        </UpdateCartButton>

        <div
          className="w-10 text-center text-warm text-sm font-semibold"
          data-test="item-quantity"
        >
          {optimisticQuantity}
        </div>

        <UpdateCartButton lines={[{id: lineId, quantity: nextQuantity}]}>
          {(fetcher) => (
            <motion.button
              className={clsx(
                'w-11 h-11 flex items-center justify-center text-taupe hover:text-warm hover:bg-taupe/10 transition-colors',
                fetcher.state !== 'idle' && 'opacity-50 cursor-not-allowed',
              )}
              name="increase-quantity"
              value={nextQuantity}
              aria-label="Increase quantity"
              disabled={fetcher.state !== 'idle'}
              whileTap={{scale: 0.9}}
            >
              <Icons.Plus />
              <OptimisticInput
                id={optimisticId}
                data={{quantity: nextQuantity}}
              />
            </motion.button>
          )}
        </UpdateCartButton>
      </div>
    </div>
  );
}

function UpdateCartButton({
  children,
  lines,
}: {
  children:
    | React.ReactNode
    | ((fetcher: ReturnType<typeof useFetcher>) => React.ReactNode);
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{
        lines,
      }}
    >
      {children}
    </CartForm>
  );
}

function CartLinePrice({
  line,
  priceType = 'regular',
  ...passthroughProps
}: {
  line: CartLine;
  priceType?: 'regular' | 'compareAt';
  [key: string]: any;
}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) return null;

  return <Money withoutTrailingZeros {...passthroughProps} data={moneyV2} />;
}

function CartEmpty({
  hidden = false,
  layout = 'drawer',
  onClose,
}: {
  hidden: boolean;
  layout?: Layouts;
  onClose?: () => void;
}) {
  const scrollRef = useRef(null);
  const {y} = useScroll(scrollRef);
  const {t} = useTranslation();

  const container = {
    drawer: clsx([
      'flex flex-col items-center justify-center h-full px-6 pb-8 transition',
      y > 0 ? 'border-t' : '',
    ]),
    page: clsx([
      hidden ? '' : 'grid',
      `pb-12 w-full md:items-start gap-4 md:gap-8 lg:gap-12`,
    ]),
  };

  return (
    <div ref={scrollRef} className={container[layout]} hidden={hidden}>
      {layout === 'drawer' ? (
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.5}}
        >
          {/* Animated Empty Bag Icon */}
          <motion.div
            initial={{scale: 0.8, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            transition={{duration: 0.5, delay: 0.1}}
            className="relative"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-bronze/10 to-transparent flex items-center justify-center mb-6">
              <Icons.Shopping className="w-16 h-16 text-bronze/40" />
            </div>
            {/* Floating animation */}
            <motion.div
              className="absolute inset-0 rounded-full bg-bronze/5"
              animate={{scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5]}}
              transition={{duration: 3, repeat: Infinity}}
            />
          </motion.div>

          <h3 className="font-serif text-2xl text-warm mb-3">
            {t('cart.empty', 'Your bag is empty')}
          </h3>
          <p className="text-taupe text-sm mb-8 max-w-[260px] leading-relaxed">
            {t(
              'cart.emptySubtitle',
              'Discover our exclusive collections and find something you love.',
            )}
          </p>

          <motion.button
            onClick={onClose}
            className="bg-gradient-to-r from-bronze to-bronze-dark hover:from-bronze-dark hover:to-bronze text-white font-medium px-8 py-4 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-bronze/20"
            whileHover={{scale: 1.02}}
            whileTap={{scale: 0.98}}
          >
            <Icons.Bag className="w-5 h-5" />
            {t('cart.continueShopping', 'Continue Shopping')}
          </motion.button>
        </motion.div>
      ) : (
        <>
          <section className="grid gap-6">
            <Text format>{t('cart.emptyStats')}</Text>
            <div>
              <Button onClick={onClose}>{t('cart.continueShopping')}</Button>
            </div>
          </section>
          <section className="grid gap-8 pt-16">
            <FeaturedProducts
              count={4}
              heading={t('cart.shopBestSellers')}
              layout={layout}
              onClose={onClose}
              sortKey="BEST_SELLING"
            />
          </section>
        </>
      )}
    </div>
  );
}

function CartSubtotalLabel() {
  const {t} = useTranslation();
  return <>{t('cart.subtotal')}</>;
}
