import {json} from '@remix-run/server-runtime';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import { type NormalizedPredictiveSearchResults } from '~/components/PredictiveSearch';
import { NO_PREDICTIVE_SEARCH_RESULTS } from '~/components/PredictiveSearch';

export async function loader({ request, context }: LoaderFunctionArgs) {
    const searchParams = new URL(request.url).searchParams;
    const searchTerm = searchParams.get('q');
    const limit = Number(searchParams.get('limit') || 10);

    if (!searchTerm) {
        return json({ searchResults: { results: null, totalResults: 0 } });
    }

    const { storefront } = context;

    const data = await storefront.query(PREDICTIVE_SEARCH_QUERY, {
        variables: {
            searchTerm,
            limit,
            country: storefront.i18n.country,
            language: storefront.i18n.language,
        },
    });

    if (!data) {
        throw new Error('No data returned from Shopify API');
    }

    const searchResults = normalizePredictiveSearchResults(
        data.predictiveSearch,
        context.storefront.i18n.locale,
    );

    return json({ searchResults });
}

const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $searchTerm: String!
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope! = EACH
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $limit
      limitScope: $limitScope
      query: $searchTerm
    ) {
      articles {
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
      collections {
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
      pages {
        id
        title
        handle
      }
      products {
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
      queries {
        text
        styledText
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
