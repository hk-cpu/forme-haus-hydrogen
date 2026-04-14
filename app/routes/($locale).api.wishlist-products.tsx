import {json} from '@remix-run/server-runtime';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';

export async function loader({
  request,
  context: {storefront},
}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const idsParam = url.searchParams.get('ids') ?? '';
  const ids = idsParam
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (ids.length === 0) {
    return json({products: []});
  }

  const {nodes} = await storefront.query(WISHLIST_PRODUCTS_QUERY, {
    variables: {
      ids,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheNone(),
  });

  const products = (nodes ?? []).filter(
    (node: any) => node?.__typename === 'Product',
  );

  return json({products});
}

const WISHLIST_PRODUCTS_QUERY = `#graphql
  query WishlistProducts(
    $ids: [ID!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    nodes(ids: $ids) {
      ... on Product {
        __typename
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

// Required for Remix route conventions
export default function WishlistProductsApi() {
  return null;
}
