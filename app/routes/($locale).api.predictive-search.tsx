import {json} from '@remix-run/server-runtime';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {type NormalizedPredictiveSearchResults} from '~/components/PredictiveSearch';
import {NO_PREDICTIVE_SEARCH_RESULTS} from '~/components/PredictiveSearch';

export async function loader({request, context}: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const searchTerm = searchParams.get('q');
  const limit = Number(searchParams.get('limit') || 10);

  if (!searchTerm) {
    return json({searchResults: {results: null, totalResults: 0}});
  }

  const apiSearchTerm = searchTerm
    .split(' ')
    .filter((w) => w.trim().length > 0)
    .map(
      (word) =>
        `(title:*${word}* OR product_type:*${word}* OR tag:*${word}* OR variants.title:*${word}*)`,
    )
    .join(' AND ');

  const {storefront} = context;

  const data = await storefront.query(PREDICTIVE_SEARCH_QUERY, {
    variables: {
      searchTerm: apiSearchTerm,
      limit,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  if (!data) {
    throw new Error('No data returned from Shopify API');
  }

  const formattedPredictiveSearch = {
    products: data.products?.nodes || [],
    collections: data.collections?.nodes || [],
    pages: data.pages?.nodes || [],
    articles: data.articles?.nodes || [],
    queries: [],
  };

  const searchResults = normalizePredictiveSearchResults(
    formattedPredictiveSearch,
    context.storefront.i18n.language,
  );

  return json({searchResults});
}

const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearchFallback(
    $country: CountryCode
    $language: LanguageCode
    $searchTerm: String!
    $limit: Int!
  ) @inContext(country: $country, language: $language) {
    products(first: $limit, query: $searchTerm) {
      nodes {
        id
        title
        handle
        featuredImage {
          url
          altText
          width
          height
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
    collections(first: $limit, query: $searchTerm) {
      nodes {
        id
        title
        handle
        image {
          url
          altText
          width
          height
        }
      }
    }
    pages(first: $limit, query: $searchTerm) {
      nodes {
        id
        title
        handle
      }
    }
    articles(first: $limit, query: $searchTerm) {
      nodes {
        id
        title
        handle
        image {
          url
          altText
          width
          height
        }
        blog {
          handle
        }
      }
    }
  }
` as const;

/**
 * Normalize the search results to be easier to use in the UI
 */
export function normalizePredictiveSearchResults(
  predictiveSearch: any,
  locale: string,
): NormalizedPredictiveSearchResults {
  const totalResults =
    (predictiveSearch?.articles?.length || 0) +
    (predictiveSearch?.collections?.length || 0) +
    (predictiveSearch?.pages?.length || 0) +
    (predictiveSearch?.products?.length || 0) +
    (predictiveSearch?.queries?.length || 0);

  if (totalResults === 0) {
    return NO_PREDICTIVE_SEARCH_RESULTS;
  }

  return {
    results: predictiveSearch,
    totalResults,
  };
}
