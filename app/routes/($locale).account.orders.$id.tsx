import clsx from 'clsx';
import {json, redirect} from '@remix-run/server-runtime';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {Money, Image, flattenConnection} from '@shopify/hydrogen';

import {statusMessage} from '~/lib/utils';
import {Link} from '~/components/Link';
import {Heading, PageHeader, Text} from '~/components/Text';
import {OrderStepper} from '~/components/OrderStepper';
import {CACHE_NONE} from '~/data/cache';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Order ${(data as any)?.order?.name}`}];
};

export async function loader({request, context, params}: LoaderFunctionArgs) {
  if (!params.id) {
    return redirect(params?.locale ? `/${params.locale}/account` : '/account');
  }

  const {session, storefront} = context;
  const customerAccessToken = await session.get('customerAccessToken');

  if (!customerAccessToken) {
    return redirect('/account/login');
  }

  try {
    const targetOrderId = `gid://shopify/Order/${params.id}`;

    const {customer} = await storefront.query(CUSTOMER_ORDERS_QUERY, {
      variables: {
        customerAccessToken: customerAccessToken.accessToken,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
      cache: storefront.CacheNone(),
    });

    if (!customer) {
      throw redirect('/account/login');
    }

    const orders = flattenConnection(customer.orders) as any[];
    const order = orders.find((o: any) => o.id === targetOrderId);

    if (!order) {
      throw new Response('Order not found', {status: 404});
    }

    const lineItems = flattenConnection(order.lineItems) as any[];

    const discountApplications = flattenConnection(
      order.discountApplications,
    ) as any[];
    const firstDiscount = discountApplications[0]?.value;
    const discountValue =
      firstDiscount?.__typename === 'MoneyV2' && firstDiscount;
    const discountPercentage =
      firstDiscount?.__typename === 'PricingPercentageValue' &&
      firstDiscount?.percentage;

    const fulfillmentStatus =
      (order.fulfillmentStatus as string) || 'UNFULFILLED';

    return json(
      {
        order,
        lineItems,
        discountValue,
        discountPercentage,
        fulfillmentStatus,
      },
      {
        headers: {
          'Cache-Control': CACHE_NONE,
        },
      },
    );
  } catch (error) {
    if (error instanceof Response) throw error;
    throw new Response(error instanceof Error ? error.message : undefined, {
      status: 404,
    });
  }
}

// Storefront API query — fetches orders through customer, no redirect through shopify.com
const CUSTOMER_ORDERS_QUERY = `#graphql
  query CustomerOrdersForDetail(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            name
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            currentTotalPrice {
              amount
              currencyCode
            }
            currentSubtotalPrice {
              amount
              currencyCode
            }
            currentTotalTax {
              amount
              currencyCode
            }
            totalShippingPrice {
              amount
              currencyCode
            }
            shippingAddress {
              name
              formatted
            }
            discountApplications(first: 10) {
              edges {
                node {
                  value {
                    __typename
                    ... on MoneyV2 {
                      amount
                      currencyCode
                    }
                    ... on PricingPercentageValue {
                      percentage
                    }
                  }
                }
              }
            }
            lineItems(first: 100) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    title
                    image {
                      url
                      altText
                      width
                      height
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                  originalTotalPrice {
                    amount
                    currencyCode
                  }
                  discountedTotalPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
` as const;

export default function OrderRoute() {
  const {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  } = useLoaderData<typeof loader>();

  return (
    <div>
      <PageHeader heading="Order detail">
        <div className="flex flex-wrap gap-4 justify-between items-center w-full">
          <Link to="/account">
            <Text color="subtle">Return to Account Overview</Text>
          </Link>
          <button
            onClick={() => window.print()}
            className="print:hidden border border-primary/20 hover:border-primary text-primary px-4 py-2 text-xs uppercase tracking-widest transition-colors"
          >
            Print Invoice
          </button>
        </div>
      </PageHeader>
      <div className="w-full p-6 sm:grid-cols-1 md:p-8 lg:p-12 lg:py-6">
        <div>
          <Text as="h3" size="lead">
            Order No. {(order as any).name}
          </Text>
          <Text className="mt-2" as="p">
            Placed on {new Date((order as any).processedAt!).toDateString()}
          </Text>
          <div className="grid items-start gap-12 sm:grid-cols-1 md:grid-cols-4 md:gap-16 sm:divide-y sm:divide-gray-200">
            <table className="min-w-full my-8 divide-y divide-gray-300 md:col-span-3">
              <thead>
                <tr className="align-baseline ">
                  <th
                    scope="col"
                    className="pb-4 pl-0 pr-3 font-semibold text-left"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="hidden px-4 pb-4 font-semibold text-right sm:table-cell md:table-cell"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="hidden px-4 pb-4 font-semibold text-right sm:table-cell md:table-cell"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-4 pb-4 font-semibold text-right"
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(lineItems as any[]).map((lineItem: any, index: number) => (
                  <tr key={lineItem.variant?.id || index}>
                    <td className="w-full py-4 pl-0 pr-3 align-top sm:align-middle max-w-0 sm:w-auto sm:max-w-none">
                      <div className="flex gap-6">
                        {lineItem.variant?.image && (
                          <div className="w-24 card-image aspect-square">
                            <Image
                              data={lineItem.variant.image}
                              width={96}
                              height={96}
                              sizes="96px"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                        )}
                        <div className="flex-col justify-center hidden lg:flex">
                          <Text as="p">{lineItem.title}</Text>
                          <Text size="fine" className="mt-1" as="p">
                            {lineItem.variant?.title}
                          </Text>
                        </div>
                        <dl className="grid">
                          <dt className="sr-only">Product</dt>
                          <dd className="truncate lg:hidden">
                            <Heading size="copy" format as="h3">
                              {lineItem.title}
                            </Heading>
                            <Text size="fine" className="mt-1">
                              {lineItem.variant?.title}
                            </Text>
                          </dd>
                          <dt className="sr-only">Price</dt>
                          <dd className="truncate sm:hidden">
                            <Text size="fine" className="mt-4">
                              {lineItem.variant?.price && (
                                <Money data={lineItem.variant.price} />
                              )}
                            </Text>
                          </dd>
                          <dt className="sr-only">Quantity</dt>
                          <dd className="truncate sm:hidden">
                            <Text className="mt-1" size="fine">
                              Qty: {lineItem.quantity}
                            </Text>
                          </dd>
                        </dl>
                      </div>
                    </td>
                    <td className="hidden px-3 py-4 text-right align-top sm:align-middle sm:table-cell">
                      {lineItem.variant?.price && (
                        <Money data={lineItem.variant.price} />
                      )}
                    </td>
                    <td className="hidden px-3 py-4 text-right align-top sm:align-middle sm:table-cell">
                      {lineItem.quantity}
                    </td>
                    <td className="px-3 py-4 text-right align-top sm:align-middle sm:table-cell">
                      <Text>
                        <Money
                          data={
                            lineItem.discountedTotalPrice ||
                            lineItem.originalTotalPrice
                          }
                        />
                      </Text>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {((discountValue && (discountValue as any).amount) ||
                  discountPercentage) && (
                  <tr>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden pt-6 pl-6 pr-3 font-normal text-right sm:table-cell md:pl-0"
                    >
                      <Text>Discounts</Text>
                    </th>
                    <th
                      scope="row"
                      className="pt-6 pr-3 font-normal text-left sm:hidden"
                    >
                      <Text>Discounts</Text>
                    </th>
                    <td className="pt-6 pl-3 pr-4 font-medium text-right text-green-700 md:pr-3">
                      {discountPercentage ? (
                        <span className="text-sm">
                          -{discountPercentage}% OFF
                        </span>
                      ) : (
                        discountValue && <Money data={discountValue as any} />
                      )}
                    </td>
                  </tr>
                )}
                <tr>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pt-6 pl-6 pr-3 font-normal text-right sm:table-cell md:pl-0"
                  >
                    <Text>Subtotal</Text>
                  </th>
                  <th
                    scope="row"
                    className="pt-6 pr-3 font-normal text-left sm:hidden"
                  >
                    <Text>Subtotal</Text>
                  </th>
                  <td className="pt-6 pl-3 pr-4 text-right md:pr-3">
                    <Money data={(order as any).currentSubtotalPrice} />
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pt-4 pl-6 pr-3 font-normal text-right sm:table-cell md:pl-0"
                  >
                    Shipping
                  </th>
                  <th
                    scope="row"
                    className="pt-4 pr-3 font-normal text-left sm:hidden"
                  >
                    <Text>Shipping</Text>
                  </th>
                  <td className="pt-4 pl-3 pr-4 text-right md:pr-3">
                    {(order as any).totalShippingPrice?.amount !== '0.0' ? (
                      <Money data={(order as any).totalShippingPrice} />
                    ) : (
                      <Text>Free</Text>
                    )}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pt-4 pl-6 pr-3 font-normal text-right sm:table-cell md:pl-0"
                  >
                    Tax (VAT 15%)
                  </th>
                  <th
                    scope="row"
                    className="pt-4 pr-3 font-normal text-left sm:hidden"
                  >
                    <Text>Tax (VAT 15%)</Text>
                  </th>
                  <td className="pt-4 pl-3 pr-4 text-right md:pr-3">
                    <Money data={(order as any).currentTotalTax} />
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pt-4 pl-6 pr-3 font-semibold text-right sm:table-cell md:pl-0"
                  >
                    Total
                  </th>
                  <th
                    scope="row"
                    className="pt-4 pr-3 font-semibold text-left sm:hidden"
                  >
                    <Text>Total</Text>
                  </th>
                  <td className="pt-4 pl-3 pr-4 font-semibold text-right md:pr-3">
                    <Money data={(order as any).currentTotalPrice} />
                  </td>
                </tr>
              </tfoot>
            </table>
            <div className="sticky border-none top-nav md:my-8">
              <Heading size="copy" className="font-semibold" as="h3">
                Shipping Address
              </Heading>
              {(order as any)?.shippingAddress ? (
                <ul className="mt-6">
                  <li>
                    <Text>{(order as any).shippingAddress.name}</Text>
                  </li>
                  {(order as any).shippingAddress.formatted?.map(
                    (line: string) => (
                      <li key={line}>
                        <Text>{line}</Text>
                      </li>
                    ),
                  )}
                </ul>
              ) : (
                <p className="mt-3">No shipping address defined</p>
              )}

              <div className="mt-10">
                <Heading size="copy" className="font-semibold mb-4" as="h3">
                  Tracking
                </Heading>
                <OrderStepper status={fulfillmentStatus as string} />
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <Text size="fine" className="opacity-70">
              All prices include 15% VAT. Standard 2-Year Warranty applies to
              eligible products in accordance with Saudi Commerce Ministry
              regulations.
              <br />
              Commercial Registration: 7051891369
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
