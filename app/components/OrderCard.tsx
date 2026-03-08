import {flattenConnection, Image} from '@shopify/hydrogen';

import {Heading, Text} from '~/components/Text';
import {Link} from '~/components/Link';
import {statusMessage} from '~/lib/utils';

// Storefront API order type (from customer.orders query)
type StorefrontOrder = {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  currentTotalPrice: {amount: string; currencyCode: string};
  lineItems: {
    edges: Array<{
      node: {
        title: string;
        variant?: {
          image?: {url: string; altText?: string; width?: number; height?: number};
        };
      };
    }>;
  };
};

export function OrderCard({order}: {order: StorefrontOrder}) {
  if (!order?.id) return null;

  const legacyOrderId = order.id.split('/').pop();
  const lineItems = flattenConnection(order.lineItems);
  const fulfillmentStatus = order.fulfillmentStatus;
  const url = `/account/orders/${legacyOrderId}`;
  const firstImage = lineItems[0]?.variant?.image;

  return (
    <li className="grid text-center border border-[#F0EAE6]/10 rounded-sm bg-[#121212]/30 backdrop-blur-sm transition-all hover:bg-[#121212]/50">
      <Link
        className="grid items-center gap-4 p-4 md:gap-6 md:p-6 md:grid-cols-2"
        to={url}
        prefetch="intent"
      >
        {firstImage && (
          <div className="aspect-square bg-white/5 overflow-hidden">
            <Image
              width={168}
              height={168}
              className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
              alt={firstImage.altText ?? 'Order image'}
              src={firstImage.url}
            />
          </div>
        )}
        <div
          className={`flex-col justify-center text-left ${
            !firstImage && 'md:col-span-2'
          }`}
        >
          <Heading
            as="h3"
            format
            size="copy"
            className="font-serif text-[#F0EAE6] mb-2"
          >
            {lineItems.length > 1
              ? `${lineItems[0].title} +${lineItems.length - 1} more`
              : lineItems[0].title}
          </Heading>
          <dl className="grid gap-1">
            <dt className="sr-only">Order ID</dt>
            <dd>
              <Text
                size="fine"
                className="text-[#F0EAE6]/60 uppercase tracking-widest text-xs"
              >
                Order No. {order.orderNumber}
              </Text>
            </dd>
            <dt className="sr-only">Order Date</dt>
            <dd>
              <Text
                size="fine"
                className="text-[#F0EAE6]/60 uppercase tracking-widest text-xs"
              >
                {new Date(order.processedAt).toDateString()}
              </Text>
            </dd>
            {fulfillmentStatus && (
              <>
                <dt className="sr-only">Fulfillment Status</dt>
                <dd className="mt-2">
                  <span
                    className={`px-3 py-1 text-[10px] uppercase tracking-widest font-medium rounded-full ${
                      fulfillmentStatus === 'FULFILLED'
                        ? 'bg-[#C4A484]/20 text-[#C4A484] border border-[#C4A484]/20'
                        : 'bg-white/5 text-[#F0EAE6]/60 border border-white/10'
                    }`}
                  >
                    <Text size="fine">{statusMessage(fulfillmentStatus as any)}</Text>
                  </span>
                </dd>
              </>
            )}
          </dl>
        </div>
      </Link>
      <div className="self-end border-t border-[#F0EAE6]/10">
        <Link
          className="block w-full p-3 text-center hover:bg-white/5 transition-colors"
          to={url}
          prefetch="intent"
        >
          <Text className="text-[#C4A484] text-xs uppercase tracking-widest">
            View Details
          </Text>
        </Link>
      </div>
    </li>
  );
}

