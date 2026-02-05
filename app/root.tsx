import { defer } from '@remix-run/server-runtime';
import {
  type LinksFunction,
  type LoaderFunctionArgs,
  type AppLoadContext,
  type MetaArgs,
} from '@shopify/remix-oxygen';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
  useRouteError,
  type ShouldRevalidateFunction,
} from '@remix-run/react';
import {
  useNonce,
  Analytics,
  getShopAnalytics,
  getSeoMeta,
  type SeoConfig,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';

import { PageLayout } from '~/components/PageLayout';
import { GenericError } from '~/components/GenericError';
import { NotFound } from '~/components/NotFound';
import Silk from '~/components/Silk';
import SmoothScroll from '~/components/SmoothScroll';
import favicon from '~/assets/favicon.svg';
import { seoPayload } from '~/lib/seo.server';
import styles from '~/styles/app.css?url';

import { DEFAULT_LOCALE, parseMenu } from './lib/utils';

export type RootLoader = typeof loader;

// This is important to avoid re-fetching root queries on sub-navigations
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') {
    return true;
  }

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }

  return false;
};

/**
 * The link to the main stylesheet is purposely not in this list. Instead, it is added
 * in the Layout function.
 *
 * This is to avoid a development bug where after an edit/save, navigating to another
 * link will cause page rendering error "failed to execute 'insertBefore' on 'Node'".
 *
 * This is a workaround until this is fixed in the foundational library.
 */
export const links: LinksFunction = () => {
  return [
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    { rel: 'icon', type: 'image/svg+xml', href: favicon },
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous' as const,
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&display=swap',
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({
    ...deferredData,
    ...criticalData,
  });
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ request, context }: LoaderFunctionArgs) {
  const { storefront, env } = context;

  /*
  const [layout] = await Promise.all([
    getLayoutData(context).catch((error) => {
      console.error("Layout query failed", error);
      return {
        shop: {
          name: "Formé Haus",
          description: "",
          primaryDomain: { url: "https://forme-haus.com" },
          brand: { logo: { image: { url: "/logo.png" } } },
          id: "gid://shopify/Shop/1234567890"
        },
        headerMenu: undefined,
        footerMenu: undefined
      };
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);
  */

  /*
  const layout = {
    shop: {
      name: "Formé Haus",
      description: "Luxury Fashion",
      primaryDomain: { url: "https://forme-haus.com" },
      brand: { logo: { image: { url: "/logo.png" } } },
      id: "gid://shopify/Shop/1234567890"
    },
    headerMenu: {
      id: "menu-1",
      items: [
        { id: "1", title: "SHOP", to: "/collections/all", target: "_self", isExternal: false, tags: [], type: "CATALOG", resourceId: null },
        { id: "2", title: "COLLECTIONS", to: "/collections", target: "_self", isExternal: false, tags: [], type: "COLLECTIONS", resourceId: null },
        { id: "3", title: "JOURNAL", to: "/journal", target: "_self", isExternal: false, tags: [], type: "BLOG", resourceId: null },
        { id: "4", title: "ABOUT", to: "/pages/about", target: "_self", isExternal: false, tags: [], type: "PAGE", resourceId: null }
      ]
    },
    footerMenu: undefined
  };
  */

  // Use minimal layout to force fallback to translated links in components
  const layout = {
    shop: {
      name: "Formé Haus",
      description: "Luxury Fashion",
      primaryDomain: { url: "https://forme-haus.com" },
      brand: { logo: { image: { url: "/logo.png" } } },
      id: "gid://shopify/Shop/1234567890"
    },
    headerMenu: undefined,
    footerMenu: undefined
  };

  const seo = seoPayload.root({ shop: layout.shop, url: request.url });

  return {
    layout,
    seo,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: true,
    },
    selectedLocale: storefront.i18n,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: LoaderFunctionArgs) {
  const { cart, customerAccount } = context;

  return {
    isLoggedIn: Promise.resolve(false),
    cart: Promise.resolve(null),
  };
}

export const meta = ({ data }: MetaArgs<typeof loader>) => {
  return getSeoMeta((data as any)?.seo as SeoConfig);
};

function Layout({ children }: { children?: React.ReactNode }) {
  const nonce = useNonce();
  const data = useRouteLoaderData<typeof loader>('root');
  const locale = data?.selectedLocale ?? DEFAULT_LOCALE;
  const isRTL = locale.language === 'AR';

  return (
    <html lang={isRTL ? 'ar' : locale.language.toLowerCase()} dir={isRTL ? 'rtl' : 'ltr'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="msvalidate.01" content="A352E6A0AF9A652267361BBB572B8468" />
        <link rel="stylesheet" href={styles}></link>
        <style dangerouslySetInnerHTML={{
          __html: `
          html, body { background-color: #121212; }
        `}} />
        <Meta />
        <Links />
      </head>
      <body>
        {data ? (
          <Analytics.Provider
            cart={data.cart}
            shop={data.shop}
            consent={data.consent}
          >
            <PageLayout
              key={`${locale.language}-${locale.country}`}
              layout={data.layout}
            >
              {children}
            </PageLayout>
          </Analytics.Provider>
        ) : (
          children
        )}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <SmoothScroll />
      </body>
    </html >
  );
}

export default function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  const routeError = useRouteError();
  const isRouteError = isRouteErrorResponse(routeError);

  let title = 'Error';
  let pageType = 'page';

  if (isRouteError) {
    title = 'Not found';
    if (routeError.status === 404) pageType = routeError.data || pageType;
  }

  return (
    <Layout>
      {isRouteError ? (
        <>
          {routeError.status === 404 ? (
            <NotFound type={pageType} />
          ) : (
            <GenericError
              error={{ message: `${routeError.status} ${routeError.data}` }}
            />
          )}
        </>
      ) : (
        <GenericError error={error instanceof Error ? error : undefined} />
      )}
    </Layout>
  );
}

const LAYOUT_QUERY = `#graphql
  query layout(
    $language: LanguageCode
    $headerMenuHandle: String!
    $footerMenuHandle: String!
  ) @inContext(language: $language) {
    shop {
      ...Shop
    }
    headerMenu: menu(handle: $headerMenuHandle) {
      ...Menu
    }
    footerMenu: menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
` as const;

async function getLayoutData({ storefront, env }: AppLoadContext) {
  const data = await storefront.query(LAYOUT_QUERY, {
    variables: {
      headerMenuHandle: 'main-menu',
      footerMenuHandle: 'footer',
      language: storefront.i18n.language,
    },
  });

  invariant(data, 'No data returned from Shopify API');

  /*
    Modify specific links/routes (optional)
    @see: https://shopify.dev/api/storefront/unstable/enums/MenuItemType
    e.g here we map:
      - /blogs/news -> /news
      - /blog/news/blog-post -> /news/blog-post
      - /collections/all -> /products
  */
  const customPrefixes = { BLOG: '', CATALOG: 'products' };

  const headerMenu = data?.headerMenu
    ? parseMenu(
      data.headerMenu,
      data.shop.primaryDomain.url,
      env,
      customPrefixes,
    )
    : undefined;

  const footerMenu = data?.footerMenu
    ? parseMenu(
      data.footerMenu,
      data.shop.primaryDomain.url,
      env,
      customPrefixes,
    )
    : undefined;

  return { shop: data.shop, headerMenu, footerMenu };
}
