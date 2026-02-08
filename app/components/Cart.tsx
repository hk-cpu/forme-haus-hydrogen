import clsx from 'clsx';
import {useRef} from 'react';
import useScroll from 'react-use/esm/useScroll';
import {motion, AnimatePresence} from 'framer-motion';
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

import {useRouteLoaderData} from '@remix-run/react';
import {Button} from '~/components/Button';
import {Text, Heading} from '~/components/Text';
import {Link} from '~/components/Link';
import {IconRemove} from '~/components/Icon';
import {FeaturedProducts} from '~/components/FeaturedProducts';
import {getInputStyleClasses} from '~/lib/utils';
import {useTranslation} from '~/hooks/useTranslation';
import type {RootLoader} from '~/root';

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
      ?.map(({code}) => code) || [];
  const {t} = useTranslation();

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
              <IconRemove
                aria-hidden="true"
                className="w-4 h-4 text-[#F0EAE6]/50"
              />
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
  const {y} = useScroll(scrollRef);

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

function CartCheckoutActions({
  checkoutUrl,
  cart,
}: {
  checkoutUrl: string;
  cart: CartType;
}) {
  if (!checkoutUrl) return null;
  const {t} = useTranslation();
  const rootData = useRouteLoaderData<RootLoader>('root');
  const storeDomain =
    (rootData?.layout as any)?.shop?.primaryDomain?.url ??
    'https://formehaus.me';

  // Get variant IDs from cart lines for ShopPay
  const variantIds =
    cart.lines?.edges?.map((edge) => edge.node.merchandise.id) || [];

  return (
    <div className="flex flex-col gap-3">
      {/* Checkout Button */}
      <a href={checkoutUrl} target="_self">
        <Button 
          as="span" 
          width="full"
          className="bg-[#a87441] hover:bg-[#8B5E3C] text-white font-medium py-4 rounded-lg transition-colors"
        >
          {t('cart.checkout', 'Proceed to Checkout')}
        </Button>
      </a>

      {/* Shop Pay */}
      {variantIds.length > 0 && (
        <div className="[&>div]:w-full">
          <ShopPayButton
            width="100%"
            variantIdsAndQuantities={
              cart.lines?.edges?.map((edge) => ({
                id: edge.node.merchandise.id,
                quantity: edge.node.quantity,
              })) || []
            }
            storeDomain={storeDomain}
          />
        </div>
      )}

      {/* Free Shipping Progress */}
      <FreeShippingProgress cart={cart} />

      {/* Terms */}
      <p className="text-[10px] text-center text-[#AA9B8F]/60 mt-2">
        {t('cart.terms', 'By proceeding, you agree to our')}{' '}
        <a href="/policies/terms-of-service" className="text-[#a87441] hover:underline">
          {t('cart.termsLink', 'Terms')}
        </a>{' '}
        {t('cart.and', 'and')}{' '}
        <a href="/policies/refund-policy" className="text-[#a87441] hover:underline">
          {t('cart.refundsLink', 'Refund Policy')}
        </a>
      </p>
    </div>
  );
}

// Free Shipping Progress Component
function FreeShippingProgress({ cart }: { cart: CartType }) {
  const {t} = useTranslation();
  const threshold = 300; // SAR
  const subtotal = parseFloat(cart.cost?.subtotalAmount?.amount || '0');
  const progress = Math.min((subtotal / threshold) * 100, 100);
  const remaining = Math.max(threshold - subtotal, 0);

  return (
    <div className="bg-[#1A1A1A] rounded-lg p-4 mt-2">
      {progress >= 100 ? (
        <p className="text-[#a87441] text-sm text-center font-medium">
          {t('cart.freeShippingUnlocked', '🎉 You\'ve unlocked free shipping!')}
        </p>
      ) : (
        <>
          <p className="text-[#F0EAE6] text-sm text-center mb-2">
            {t('cart.freeShippingProgress', 'Add {{amount}} more for free shipping', {
              amount: `${remaining.toFixed(0)} SAR`,
            })}
          </p>
          <div className="h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#a87441] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </>
      )}
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
    drawer: 'grid gap-4 p-6 border-t border-[#a87441]/20 bg-[#121212]',
    page: 'sticky top-nav grid gap-6 p-4 md:px-6 md:translate-y-4 bg-primary/5 rounded w-full',
  };

  return (
    <section aria-labelledby="summary-heading" className={summary[layout]}>
      <h2 id="summary-heading" className="sr-only">
        Order summary
      </h2>
      
      {/* Subtotal */}
      <div className="flex items-center justify-between py-3 border-b border-[#a87441]/10">
        <Text as="span" className="text-[#AA9B8F]">
          <CartSubtotalLabel />
        </Text>
        <Text as="span" className="text-[#F0EAE6] font-medium text-lg" data-test="subtotal">
          {cost?.subtotalAmount?.amount ? (
            <Money data={cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </Text>
      </div>

      {/* Shipping Note */}
      <p className="text-[#AA9B8F] text-xs text-center">
        {t('cart.shippingNote', 'Shipping and taxes calculated at checkout')}
      </p>

      {/* Additional Content (Discounts, etc.) */}
      {children}
    </section>
  );
}

type OptimisticData = {
  action?: string;
  quantity?: number;
};

function CartLineItem({line}: {line: CartLine}) {
  const optimisticData = useOptimisticData<OptimisticData>(line?.id);

  if (!line?.id) return null;

  const {id, quantity, merchandise} = line;

  if (typeof quantity === 'undefined' || !merchandise?.product) return null;

  return (
    <motion.li
      layout
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, x: -20, height: 0, marginBottom: 0}}
      transition={{duration: 0.3, ease: [0.16, 1, 0.3, 1]}}
      key={id}
      className="flex gap-4 pb-6 border-b border-[#a87441]/10 last:border-0 last:pb-0"
      style={{
        // Hide the line item if the optimistic data action is remove
        // Do not remove the form from the DOM
        display: optimisticData?.action === 'remove' ? 'none' : 'flex',
      }}
    >
      {/* Product Image */}
      <div className="flex-shrink-0">
        {merchandise.image ? (
          <Link to={`/products/${merchandise.product.handle}`}>
            <Image
              width={112}
              height={112}
              data={merchandise.image}
              className="w-24 h-24 md:w-28 md:h-28 bg-[#1A1A1A] rounded-lg overflow-hidden object-cover hover:opacity-90 transition-opacity"
              alt={merchandise.product?.title || ''}
            />
          </Link>
        ) : (
          <div className="w-24 h-24 md:w-28 md:h-28 bg-[#1A1A1A] rounded-lg overflow-hidden flex items-center justify-center">
            <span className="text-[#AA9B8F] text-xs">No image</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Product Title */}
          <Heading as="h3" size="copy" className="font-serif text-[#F0EAE6] text-[15px] leading-tight mb-1">
            {merchandise?.product?.handle ? (
              <Link to={`/products/${merchandise.product.handle}`} className="hover:text-[#a87441] transition-colors">
                {merchandise.product.title}
              </Link>
            ) : (
              <Text>{merchandise.product?.title || 'Product'}</Text>
            )}
          </Heading>

          {/* Selected Options (Size, Color, etc.) */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
            {(merchandise?.selectedOptions || []).map((option) => (
              <Text color="subtle" key={option.name} className="text-[#AA9B8F] text-xs">
                {option.name}: <span className="text-[#F0EAE6]">{option.value}</span>
              </Text>
            ))}
          </div>

          {/* Unit Price */}
          <Text className="text-[#a87441] text-sm font-medium">
            <CartLinePrice line={line} as="span" priceType="regular" />
          </Text>
        </div>

        {/* Quantity and Remove */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center">
            <CartLineQuantityAdjust line={line} />
          </div>
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
      <button
        className="flex items-center gap-1.5 text-[#AA9B8F] hover:text-[#F0EAE6] transition-colors text-xs uppercase tracking-wider"
        type="submit"
      >
        <IconRemove aria-hidden="true" className="w-4 h-4" />
        <span>Remove</span>
      </button>
      <OptimisticInput id={lineId} data={{action: 'remove'}} />
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
      <div className="flex items-center bg-[#1A1A1A] rounded-lg border border-[#a87441]/20">
        <UpdateCartButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            name="decrease-quantity"
            aria-label="Decrease quantity"
            className="w-8 h-8 flex items-center justify-center text-[#AA9B8F] hover:text-[#F0EAE6] disabled:text-[#AA9B8F]/30 transition-colors"
            value={prevQuantity}
            disabled={optimisticQuantity <= 1}
          >
            <span className="text-lg">&#8722;</span>
            <OptimisticInput
              id={optimisticId}
              data={{quantity: prevQuantity}}
            />
          </button>
        </UpdateCartButton>

        <div 
          className="w-10 text-center text-[#F0EAE6] text-sm font-medium" 
          data-test="item-quantity"
        >
          {optimisticQuantity}
        </div>

        <UpdateCartButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            className="w-8 h-8 flex items-center justify-center text-[#AA9B8F] hover:text-[#F0EAE6] transition-colors"
            name="increase-quantity"
            value={nextQuantity}
            aria-label="Increase quantity"
          >
            <span className="text-lg">&#43;</span>
            <OptimisticInput
              id={optimisticId}
              data={{quantity: nextQuantity}}
            />
          </button>
        </UpdateCartButton>
      </div>
    </div>
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

export // Empty Bag Icon Component
function EmptyBagIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="20"
        y="45"
        width="80"
        height="60"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.3"
      />
      <path
        d="M35 45V35C35 26.7157 41.7157 20 50 20H70C78.2843 20 85 26.7157 85 35V45"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.3"
      />
      <circle cx="45" cy="75" r="3" fill="currentColor" fillOpacity="0.2" />
      <circle cx="60" cy="75" r="3" fill="currentColor" fillOpacity="0.2" />
      <circle cx="75" cy="75" r="3" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
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
        <div className="flex flex-col items-center text-center">
          <EmptyBagIcon className="w-24 h-24 text-[#F0EAE6] mb-6" />
          <h3 className="font-serif text-xl text-[#F0EAE6] mb-2">
            {t('cart.emptyTitle', 'Your bag is empty')}
          </h3>
          <p className="text-[#AA9B8F] text-sm mb-8 max-w-[240px]">
            {t('cart.emptySubtitle', 'Discover our exclusive collections and find something you love.')}
          </p>
          <button
            onClick={onClose}
            className="bg-[#a87441] hover:bg-[#8B5E3C] text-white font-medium px-8 py-3.5 rounded-lg transition-colors"
          >
            {t('cart.continueShopping', 'Continue Shopping')}
          </button>
        </div>
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
