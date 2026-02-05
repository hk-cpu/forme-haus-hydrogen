import clsx from 'clsx';
import { useRef } from 'react';
import useScroll from 'react-use/esm/useScroll';
import { motion, AnimatePresence } from 'framer-motion';
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
import type {
  Cart as CartType,
  CartCost,
  CartLine,
  CartLineUpdateInput,
} from '@shopify/hydrogen/storefront-api-types';

import { Button } from '~/components/Button';
import { Text, Heading } from '~/components/Text';
import { Link } from '~/components/Link';
import { IconRemove } from '~/components/Icon';
import { FeaturedProducts } from '~/components/FeaturedProducts';
import { getInputStyleClasses } from '~/lib/utils';
import { useTranslation } from '~/hooks/useTranslation';

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
      <CartDetails cart={cart} layout={layout} />
    </>
  );
}

export function CartDetails({
  layout,
  cart,
}: {
  layout: Layouts;
  cart: CartType | null;
}) {
  // @todo: get optimistic cart cost
  const cartHasItems = !!cart && cart.totalQuantity > 0;
  const container = {
    drawer: 'grid grid-cols-1 h-screen-no-nav grid-rows-[1fr_auto]',
    page: 'w-full pb-12 grid md:grid-cols-2 md:items-start gap-8 md:gap-8 lg:gap-12',
  };

  return (
    <div className={container[layout]}>
      <CartLines lines={cart?.lines} layout={layout} />
      {cartHasItems && (
        <CartSummary cost={cart.cost} layout={layout}>
          <CartDiscounts discountCodes={cart.discountCodes} />
          <CartCheckoutActions checkoutUrl={cart.checkoutUrl} cart={cart} />
        </CartSummary>
      )}
    </div>
  );
}

/**
 * Discount code UI for cart
 * @param discountCodes the current discount codes applied to the cart
 */
function CartDiscounts({
  discountCodes,
}: {
  discountCodes: CartType['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({ code }) => code) || [];
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      {/* Display applied discount codes */}
      {codes && codes.length > 0 && (
        <div className="flex items-center justify-between py-2 px-3 bg-[#F0EAE6]/5 rounded border border-[#F0EAE6]/10">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#F0EAE6]/60">
              {t('cart.discount')}
            </span>
            <span className="text-sm font-medium text-[#F0EAE6]">
              {codes.join(', ')}
            </span>
          </div>
          <UpdateDiscountForm>
            <button
              type="submit"
              className="p-1 hover:bg-[#F0EAE6]/10 rounded transition-colors"
              aria-label="Remove discount"
            >
              <IconRemove aria-hidden="true" className="w-4 h-4 text-[#F0EAE6]/50" />
            </button>
          </UpdateDiscountForm>
        </div>
      )}

      {/* Input to apply a discount code */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex items-center gap-2">
          <input
            className="flex-1 px-3 py-2 text-sm bg-transparent border border-[#F0EAE6]/20 rounded text-[#F0EAE6] placeholder:text-[#F0EAE6]/40 focus:outline-none focus:border-[#F0EAE6]/40 transition-colors"
            type="text"
            name="discountCode"
            placeholder={t('cart.discount')}
          />
          <button
            type="submit"
            className="px-4 py-2 text-xs uppercase tracking-wider font-medium text-[#F0EAE6]/80 border border-[#F0EAE6]/20 rounded hover:bg-[#F0EAE6]/5 hover:border-[#F0EAE6]/40 transition-all"
          >
            {t('cart.applyDiscount')}
          </button>
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

function CartLines({
  layout = 'drawer',
  lines: cartLines,
}: {
  layout: Layouts;
  lines: CartType['lines'] | undefined;
}) {
  const currentLines = cartLines ? flattenConnection(cartLines) : [];
  const scrollRef = useRef(null);
  const { y } = useScroll(scrollRef);

  const className = clsx([
    y > 0 ? 'border-t' : '',
    layout === 'page'
      ? 'flex-grow md:translate-y-4'
      : 'px-6 pb-6 sm-max:pt-2 overflow-auto transition md:px-12',
  ]);

  return (
    <section
      ref={scrollRef}
      aria-labelledby="cart-contents"
      className={className}
    >
      <ul className="grid gap-6 md:gap-10">
        <AnimatePresence initial={false}>
          {currentLines.map((line) => (
            <CartLineItem key={line.id} line={line as CartLine} />
          ))}
        </AnimatePresence>
      </ul>
    </section>
  );
}

function CartCheckoutActions({ checkoutUrl, cart }: { checkoutUrl: string; cart: CartType }) {
  if (!checkoutUrl) return null;
  const { t } = useTranslation();

  // Get variant IDs from cart lines for ShopPay
  const variantIds = cart.lines?.edges?.map(
    (edge) => edge.node.merchandise.id
  ) || [];

  return (
    <div className="flex flex-col mt-2 gap-3">
      <a href={checkoutUrl} target="_self">
        <Button as="span" width="full">
          {t('cart.checkout')}
        </Button>
      </a>
      {variantIds.length > 0 && (
        <ShopPayButton
          width="100%"
          variantIdsAndQuantities={cart.lines?.edges?.map((edge) => ({
            id: edge.node.merchandise.id,
            quantity: edge.node.quantity,
          })) || []}
          storeDomain="formehaus.me"
        />
      )}
      <p className="text-xs text-center opacity-60 mt-2">
        {t('cart.saudiAddr')}
      </p>
      <p className="text-[10px] text-center opacity-50 mt-1">
        {t('cart.terms')} <a href="/policies/terms-of-service" className="underline">{t('cart.termsLink')}</a> {t('cart.refunds')} <a href="/policies/refund-policy" className="underline">{t('cart.refundsLink')}</a> {t('cart.refundsNote')}
      </p>
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
  const summary = {
    drawer: 'grid gap-4 p-6 border-t md:px-12',
    page: 'sticky top-nav grid gap-6 p-4 md:px-6 md:translate-y-4 bg-primary/5 rounded w-full',
  };

  return (
    <section aria-labelledby="summary-heading" className={summary[layout]}>
      <h2 id="summary-heading" className="sr-only">
        Order summary
      </h2>
      <dl className="grid">
        <div className="flex items-center justify-between font-medium">
          <Text as="dt"><CartSubtotalLabel /></Text>
          <Text as="dd" data-test="subtotal">
            {cost?.subtotalAmount?.amount ? (
              <Money data={cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </Text>
        </div>
      </dl>
      {children}
    </section>
  );
}

type OptimisticData = {
  action?: string;
  quantity?: number;
};

function CartLineItem({ line }: { line: CartLine }) {
  const optimisticData = useOptimisticData<OptimisticData>(line?.id);

  if (!line?.id) return null;

  const { id, quantity, merchandise } = line;

  if (typeof quantity === 'undefined' || !merchandise?.product) return null;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      key={id}
      className="flex gap-4"
      style={{
        // Hide the line item if the optimistic data action is remove
        // Do not remove the form from the DOM
        display: optimisticData?.action === 'remove' ? 'none' : 'flex',
      }}
    >
      <div className="flex-shrink">
        {merchandise.image ? (
          <Image
            width={112}
            height={112}
            data={merchandise.image}
            className="w-24 h-24 border rounded md:w-28 md:h-28 bg-[#121212] overflow-hidden border-white/10 object-cover"
            alt={merchandise.product?.title || ''}
          />
        ) : (
          <div className="w-24 h-24 border rounded md:w-28 md:h-28 bg-[#121212] overflow-hidden border-white/10 flex items-center justify-center">
            <span className="text-[#F0EAE6]/30 text-xs">No image</span>
          </div>
        )}
      </div>

      <div className="flex justify-between flex-grow">
        <div className="grid gap-2">
          <Heading as="h3" size="copy">
            {merchandise?.product?.handle ? (
              <Link to={`/products/${merchandise.product.handle}`}>
                {merchandise.product.title}
              </Link>
            ) : (
              <Text>{merchandise.product?.title || 'Product'}</Text>
            )}
          </Heading>

          <div className="grid pb-2">
            {(merchandise?.selectedOptions || []).map((option) => (
              <Text color="subtle" key={option.name}>
                {option.name}: {option.value}
              </Text>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex justify-start text-copy">
              <CartLineQuantityAdjust line={line} />
            </div>
            <ItemRemoveButton lineId={id} />
          </div>
        </div>
        <Text>
          <CartLinePrice line={line} as="span" />
        </Text>
      </div>
    </motion.li>
  );
}

function ItemRemoveButton({ lineId }: { lineId: CartLine['id'] }) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{
        lineIds: [lineId],
      }}
    >
      <button
        className="flex items-center justify-center w-10 h-10 border rounded"
        type="submit"
      >
        <span className="sr-only">Remove</span>
        <IconRemove aria-hidden="true" />
      </button>
      <OptimisticInput id={lineId} data={{ action: 'remove' }} />
    </CartForm>
  );
}

function CartLineQuantityAdjust({ line }: { line: CartLine }) {
  const optimisticId = line?.id;
  const optimisticData = useOptimisticData<OptimisticData>(optimisticId);

  if (!line || typeof line?.quantity === 'undefined') return null;

  const optimisticQuantity = optimisticData?.quantity || line.quantity;

  const { id: lineId } = line;
  const prevQuantity = Number(Math.max(0, optimisticQuantity - 1).toFixed(0));
  const nextQuantity = Number((optimisticQuantity + 1).toFixed(0));

  return (
    <>
      <label htmlFor={`quantity-${lineId}`} className="sr-only">
        Quantity, {optimisticQuantity}
      </label>
      <div className="flex items-center border rounded">
        <UpdateCartButton lines={[{ id: lineId, quantity: prevQuantity }]}>
          <button
            name="decrease-quantity"
            aria-label="Decrease quantity"
            className="w-10 h-10 transition text-primary/50 hover:text-primary disabled:text-primary/10"
            value={prevQuantity}
            disabled={optimisticQuantity <= 1}
          >
            <span>&#8722;</span>
            <OptimisticInput
              id={optimisticId}
              data={{ quantity: prevQuantity }}
            />
          </button>
        </UpdateCartButton>

        <div className="px-2 text-center" data-test="item-quantity">
          {optimisticQuantity}
        </div>

        <UpdateCartButton lines={[{ id: lineId, quantity: nextQuantity }]}>
          <button
            className="w-10 h-10 transition text-primary/50 hover:text-primary"
            name="increase-quantity"
            value={nextQuantity}
            aria-label="Increase quantity"
          >
            <span>&#43;</span>
            <OptimisticInput
              id={optimisticId}
              data={{ quantity: nextQuantity }}
            />
          </button>
        </UpdateCartButton>
      </div>
    </>
  );
}

function UpdateCartButton({
  children,
  lines,
}: {
  children: React.ReactNode;
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

  if (moneyV2 == null) {
    return null;
  }

  return <Money withoutTrailingZeros {...passthroughProps} data={moneyV2} />;
}

export function CartEmpty({
  hidden = false,
  layout = 'drawer',
  onClose,
}: {
  hidden: boolean;
  layout?: Layouts;
  onClose?: () => void;
}) {
  const scrollRef = useRef(null);
  const { y } = useScroll(scrollRef);
  const { t } = useTranslation();

  const container = {
    drawer: clsx([
      'content-start gap-4 px-6 pb-8 transition overflow-y-scroll md:gap-12 md:px-12 h-screen-no-nav md:pb-12',
      y > 0 ? 'border-t' : '',
    ]),
    page: clsx([
      hidden ? '' : 'grid',
      `pb-12 w-full md:items-start gap-4 md:gap-8 lg:gap-12`,
    ]),
  };

  return (
    <div ref={scrollRef} className={container[layout]} hidden={hidden}>
      <section className="grid gap-6">
        <Text format>
          {t('cart.emptyStats')}
        </Text>
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
    </div>
  );
}

function CartSubtotalLabel() {
  const { t } = useTranslation();
  return <>{t('cart.subtotal')}</>;
}
