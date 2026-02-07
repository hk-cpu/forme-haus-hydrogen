import {
  Await,
  Form,
  Outlet,
  useLoaderData,
  useMatches,
  useOutlet,
} from '@remix-run/react';
import { Suspense } from 'react';
import { defer, redirect } from '@remix-run/server-runtime';
import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { flattenConnection } from '@shopify/hydrogen';

// import type {
//   CustomerDetailsFragment,
//   OrderCardFragment,
// } from 'customer-accountapi.generated';
import { PageHeader, Text } from '~/components/Text';
import { Button } from '~/components/Button';
import { OrderCard } from '~/components/OrderCard';
import { AccountDetails } from '~/components/AccountDetails';
import { AccountAddressBook } from '~/components/AccountAddressBook';
import { Modal } from '~/components/Modal';
import { ProductSwimlane } from '~/components/ProductSwimlane';
import { FeaturedCollections } from '~/components/FeaturedCollections';
import { usePrefixPathWithLocale } from '~/lib/utils';
import { CACHE_NONE, routeHeaders } from '~/data/cache';
// import { CUSTOMER_DETAILS_QUERY } from '~/graphql/customer-account/CustomerDetailsQuery';

// import { doLogout } from './($locale).account_.logout';
import {
  getFeaturedData,
  type FeaturedData,
} from './($locale).featured-products';

export const headers = routeHeaders;

export async function loader({ request, context, params }: LoaderFunctionArgs) {
  const { session, storefront } = context;
  const customerAccessToken = await session.get('customerAccessToken');

  if (!customerAccessToken) {
    return redirect('/account/login');
  }

  const { customer } = await storefront.query(CUSTOMER_QUERY, {
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

  const heading = customer.firstName
    ? `Welcome, ${customer.firstName}.`
    : `Welcome to your account.`;

  return defer(
    {
      customer,
      heading,
      featuredDataPromise: getFeaturedData(context.storefront),
    },
    {
      headers: {
        'Cache-Control': CACHE_NONE,
      },
    },
  );
}

const CUSTOMER_QUERY = `#graphql
  query CustomerDetails(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      defaultAddress {
        id
        formatted
        firstName
        lastName
        company
        address1
        address2
        country
        province
        city
        zip
      }
      addresses(first: 6) {
        edges {
          node {
            id
            formatted
            firstName
            lastName
            company
            address1
            address2
            country
            province
            city
            zip
          }
        }
      }
      orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            currentTotalPrice {
              amount
              currencyCode
            }
            lineItems(first: 2) {
              edges {
                node {
                  variant {
                    image {
                      url
                      altText
                      width
                      height
                    }
                  }
                  title
                }
              }
            }
          }
        }
      }
    }
  }
` as const;

export default function Authenticated() {
  const data = useLoaderData<typeof loader>();
  const outlet = useOutlet();
  const matches = useMatches();

  // routes that export handle { renderInModal: true }
  const renderOutletInModal = matches.some((match) => {
    const handle = match?.handle as { renderInModal?: boolean };
    return handle?.renderInModal;
  });

  if (outlet) {
    if (renderOutletInModal) {
      return (
        <>
          <Modal cancelLink="/account">
            <Outlet context={{ customer: data.customer }} />
          </Modal>
          <Account {...data} />
        </>
      );
    } else {
      return <Outlet context={{ customer: data.customer }} />;
    }
  }

  return <Account {...data} />;
}

interface AccountType {
  customer: any; // Using any for now as we switched to Storefront API and need to regenerate types
  featuredDataPromise: Promise<FeaturedData>;
  heading: string;
}

function Account({ customer, heading, featuredDataPromise }: AccountType) {
  const orders = flattenConnection(customer.orders);
  const addresses = flattenConnection(customer.addresses);

  return (
    <>
      <PageHeader heading={heading} className="text-center mb-10">
        <Form method="post" action={usePrefixPathWithLocale('/account/logout')}>
          <button type="submit" className="text-[#C4A484] hover:text-[#F0EAE6] text-xs uppercase tracking-[0.2em] relative group transition-colors pb-1 border-b border-transparent hover:border-[#F0EAE6]/50">
            Sign out
          </button>
        </Form>
      </PageHeader>
      {orders && <AccountOrderHistory orders={orders} />}
      <AccountDetails customer={customer} />
      <AccountAddressBook addresses={addresses} customer={customer} />
      {!orders.length && (
        <Suspense>
          <Await
            resolve={featuredDataPromise}
            errorElement="There was a problem loading featured products."
          >
            {(data) => (
              <>
                <FeaturedCollections
                  title="Popular Collections"
                  collections={data.featuredCollections}
                />
                <ProductSwimlane products={data.featuredProducts} />
              </>
            )}
          </Await>
        </Suspense>
      )}
    </>
  );
}

type OrderCardsProps = {
  orders: any[]; // Using any for now until types are regenerated
};

function AccountOrderHistory({ orders }: OrderCardsProps) {
  return (
    <div className="mt-6">
      <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12 border-t border-[#F0EAE6]/10">
        <h2 className="font-serif text-[#F0EAE6] text-2xl mb-6">Order History</h2>
        {orders?.length ? <Orders orders={orders} /> : <EmptyOrders />}
      </div>
    </div>
  );
}

function EmptyOrders() {
  return (
    <div>
      <Text className="mb-1" size="fine" width="narrow" as="p">
        You haven&apos;t placed any orders yet.
      </Text>
      <div className="w-48">
        <Button
          className="w-full mt-2 text-sm"
          variant="secondary"
          to={usePrefixPathWithLocale('/')}
        >
          Start Shopping
        </Button>
      </div>
    </div>
  );
}

function Orders({ orders }: OrderCardsProps) {
  return (
    <ul className="grid grid-flow-row grid-cols-1 gap-2 gap-y-6 md:gap-4 lg:gap-6 false sm:grid-cols-3">
      {orders.map((order) => (
        <OrderCard order={order} key={order.id} />
      ))}
    </ul>
  );
}
