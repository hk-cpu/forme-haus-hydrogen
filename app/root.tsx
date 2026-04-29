import {defer, redirect} from '@remix-run/server-runtime';
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
  useLocation,
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
import {useEffect, useState, lazy, Suspense} from 'react';

import {PageLayout} from '~/components/PageLayout';
import {GenericError} from '~/components/GenericError';
import {NotFound} from '~/components/NotFound';
import {seoPayload} from '~/lib/seo.server';
import styles from '~/styles/app.css?url';
import futuristicStyles from '~/styles/futuristic-polish.css?url';
import {UIProvider} from '~/context/UIContext';

import {
  DEFAULT_LOCALE,
  getPathLocalePrefix,
  parseMenu,
  stripLocalePathPrefix,
} from './lib/utils';
const SmoothScroll = lazy(() => import('~/components/SmoothScroll'));
const LoadingScreen = lazy(() => import('~/components/LoadingScreen'));
// Brand favicon served from /public/favicon.png
const favicon = '/favicon.png';

export type RootLoader = typeof loader;

/** Emits hreflang alternate links for English (default) and Arabic */
function HreflangLinks() {
  const {pathname} = useLocation();
  const basePath = stripLocalePathPrefix(pathname);
  const origin = 'https://formehaus.me';

  return (
    <>
      <link rel="alternate" hrefLang="en" href={`${origin}${basePath}`} />
      <link rel="alternate" hrefLang="ar" href={`${origin}/ar-sa${basePath}`} />
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${origin}${basePath}`}
      />
    </>
  );
}

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

  if (
    getPathLocalePrefix(currentUrl.pathname) !==
    getPathLocalePrefix(nextUrl.pathname)
  ) {
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
    // Preload LCP hero logo — type hint lets browser skip content-sniffing
    {
      rel: 'preload',
      href: '/brand/logo-full-opt.webp',
      as: 'image',
      type: 'image/webp',
    },
    // Preload first category card image — eagerly loaded, visible just below hero
    {
      rel: 'preload',
      href: '/brand/new-in-opt.webp',
      as: 'image',
      type: 'image/webp',
    },
    // Preconnect — establishes early TCP+TLS for critical origins
    {rel: 'preconnect', href: 'https://cdn.shopify.com'},
    // dns-prefetch — fallback for browsers that skip preconnect; zero cost, saves 20–200ms on slow networks
    {rel: 'dns-prefetch', href: 'https://cdn.shopify.com'},
    {rel: 'icon', type: 'image/png', href: favicon},
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  // Redirect /pages/contact to /contact
  const url = new URL(args.request.url);
  if (url.pathname.includes('/pages/contact')) {
    return redirect(url.pathname.replace('/pages/contact', '/contact'), 301);
  }

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
async function loadCriticalData({request, context}: LoaderFunctionArgs) {
  const {storefront, env} = context;

  const layout = await getLayoutData(context).catch(() => {
    return {
      shop: {
        name: 'Formé Haus',
        description: 'Luxury Fashion',
        primaryDomain: {url: 'https://formehaus.me'},
        brand: {logo: {image: {url: '/logo.png'}}},
        id: `gid://shopify/Shop/${env.SHOP_ID || '1'}`,
      },
      headerMenu: undefined,
      footerMenu: undefined,
    };
  });

  const seo = seoPayload.root({shop: layout.shop, url: request.url});

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
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    selectedLocale: storefront.i18n,
    googleClientId: env.PUBLIC_GOOGLE_CLIENT_ID || '', // TS updated in env.d.ts
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const {cart, session} = context;

  return {
    isLoggedIn: Promise.resolve(!!session.get('customerAccessToken')),
    // Swallow cart errors so a failing cart never causes a root 500
    cart: cart.get().catch(() => null),
  };
}

export const meta = ({data}: MetaArgs<typeof loader>) => {
  return getSeoMeta((data as any)?.seo as SeoConfig);
};

function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();
  const data = useRouteLoaderData<typeof loader>('root');
  const locale = data?.selectedLocale ?? DEFAULT_LOCALE;
  const isRTL = locale.language === 'AR';
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const id = window.setTimeout(() => setShowLoader(false), 1500);
    return () => clearTimeout(id);
  }, []);

  return (
    <html
      lang={isRTL ? 'ar' : locale.language.toLowerCase()}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0,viewport-fit=cover"
        />
        <meta name="msvalidate.01" content="A352E6A0AF9A652267361BBB572B8468" />
        <HreflangLinks />
        <link rel="stylesheet" href={styles}></link>
        {/* Non-critical CSS loaded async to avoid render-blocking */}
        <link
          rel="preload"
          href={futuristicStyles}
          as="style"
          // @ts-ignore – onLoad triggers stylesheet swap after load
          onLoad="this.onload=null;this.rel='stylesheet'"
        />
        <noscript>
          <link rel="stylesheet" href={futuristicStyles} />
        </noscript>
        {isRTL ? (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin="anonymous"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600&family=Noto+Sans+Arabic:wght@300;400;500&display=swap"
              rel="stylesheet"
            />
          </>
        ) : null}
        {/* Deferred Google Fonts — loaded async to avoid render-blocking */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          html, body { background-color: var(--background); }
        `,
          }}
        />
        <Meta />
        <Links />
      </head>
      <body>
        <Suspense fallback={null}>
          <LoadingScreen show={showLoader} />
        </Suspense>
        {data ? (
          <UIProvider>
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
          </UIProvider>
        ) : (
          children
        )}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <DesktopSmoothScroll />
      </body>
    </html>
  );
}

function DesktopSmoothScroll() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let idleId: number | null = null;
    const desktop = window.matchMedia('(min-width: 768px)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (!desktop || !finePointer || reducedMotion) {
      return;
    }

    if (typeof requestIdleCallback !== 'undefined') {
      idleId = requestIdleCallback(() => setEnabled(true), {timeout: 2000});
    } else {
      idleId = window.setTimeout(() => setEnabled(true), 600);
    }

    return () => {
      if (idleId !== null) {
        if (typeof cancelIdleCallback !== 'undefined') {
          cancelIdleCallback(idleId);
        } else {
          clearTimeout(idleId);
        }
      }
    };
  }, []);

  return enabled ? (
    <Suspense fallback={null}>
      <SmoothScroll />
    </Suspense>
  ) : null;
}

export default function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export function ErrorBoundary({error}: {error: Error}) {
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
              error={{message: `${routeError.status} ${routeError.data}`}}
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

async function getLayoutData({storefront, env}: AppLoadContext) {
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
  const customPrefixes = {BLOG: '', CATALOG: 'products'};

  const headerMenu = data?.headerMenu
    ? parseMenu(data.headerMenu, 'https://formehaus.me', env, customPrefixes)
    : undefined;

  const footerMenu = data?.footerMenu
    ? parseMenu(data.footerMenu, 'https://formehaus.me', env, customPrefixes)
    : undefined;

  return {shop: data.shop, headerMenu, footerMenu};
}
