import {json} from '@remix-run/server-runtime';
import {type MetaArgs, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {getSeoMeta} from '@shopify/hydrogen';

import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';
import {useTranslation} from '~/hooks/useTranslation';

export const headers = routeHeaders;

export async function loader({request, params, context}: LoaderFunctionArgs) {
  invariant(params.policyHandle, 'Missing policy handle');

  const policyName = params.policyHandle.replace(
    /-([a-z])/g,
    (_: unknown, m1: string) => m1.toUpperCase(),
  ) as 'privacyPolicy' | 'shippingPolicy' | 'termsOfService' | 'refundPolicy';

  const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
    variables: {
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: false,
      refundPolicy: false,
      [policyName]: true,
      language: context.storefront.i18n.language,
    },
  });

  invariant(data, 'No data returned from Shopify API');
  const policy = data.shop?.[policyName];

  if (!policy) {
    throw new Response(null, {status: 404});
  }

  const seo = seoPayload.policy({policy, url: request.url});

  return json({policy, seo});
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  // @ts-ignore
  const seoData = matches
    .map((match) => (match.data as any)?.seo)
    .filter(Boolean);
  return getSeoMeta(...seoData);
};

export default function Policies() {
  const {policy} = useLoaderData<typeof loader>();
  const {isRTL} = useTranslation();

  return (
    <div
      className="relative min-h-screen bg-[#0C0B09] overflow-hidden"
      style={{direction: isRTL ? 'rtl' : 'ltr'}}
    >
      {/* ── Brand logo watermark ── */}
      <div
        className="pointer-events-none select-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <img
          src="/brand/logo-full-opt.webp"
          alt=""
          className="w-[70vw] max-w-[640px] opacity-[0.035]"
          style={{filter: 'grayscale(1) brightness(2)'}}
        />
      </div>

      {/* ── Top gold rule ── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#a87441]/50 to-transparent" />

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-16 md:py-24">
        {/* ── Back link ── */}
        <Link
          to="/policies"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#a87441]/70 hover:text-[#a87441] transition-colors duration-200 mb-12"
        >
          {isRTL ? (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              جميع السياسات
            </>
          ) : (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M19 12H5M12 19l-7-7 7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              All Policies
            </>
          )}
        </Link>

        {/* ── Policy title ── */}
        <h1 className="font-serif text-[#F0EAE6] text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
          {policy.title}
        </h1>

        {/* ── Decorative divider ── */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-gradient-to-r from-[#a87441]/40 to-transparent" />
          <span className="text-[#a87441]/60 text-[9px] uppercase tracking-[0.3em] font-light">
            Formé Haus
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-[#a87441]/40 to-transparent" />
        </div>

        {/* ── Policy body ── */}
        <div
          dangerouslySetInnerHTML={{__html: policy.body}}
          className="policy-prose"
        />

        {/* ── Bottom ornament ── */}
        <div className="mt-16 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#a87441]/10" />
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a87441"
            strokeWidth="1"
            opacity="0.4"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          </svg>
          <div className="h-px flex-1 bg-[#a87441]/10" />
        </div>
      </div>

      {/* ── Bottom gold rule ── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#a87441]/30 to-transparent" />

      {/* ── Prose styles injected via style tag ── */}
      <style>{`
        .policy-prose {
          color: #C4B8AE;
          font-size: 0.9375rem;
          line-height: 1.85;
          font-weight: 300;
        }
        .policy-prose h1,
        .policy-prose h2,
        .policy-prose h3,
        .policy-prose h4 {
          font-family: var(--font-serif, Georgia, serif);
          color: #F0EAE6;
          font-weight: 400;
          margin-top: 2.5rem;
          margin-bottom: 0.875rem;
          letter-spacing: 0.01em;
        }
        .policy-prose h2 { font-size: 1.25rem; }
        .policy-prose h3 { font-size: 1.05rem; }
        .policy-prose p { margin-bottom: 1.25rem; }
        .policy-prose a {
          color: #a87441;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: rgba(168,116,65,0.4);
          transition: color 0.2s;
        }
        .policy-prose a:hover { color: #D4AF87; }
        .policy-prose ul,
        .policy-prose ol {
          padding-inline-start: 1.5rem;
          margin-bottom: 1.25rem;
        }
        .policy-prose li { margin-bottom: 0.4rem; }
        .policy-prose strong {
          color: #E0D5CA;
          font-weight: 500;
        }
        .policy-prose hr {
          border: none;
          border-top: 1px solid rgba(168,116,65,0.15);
          margin: 2rem 0;
        }
      `}</style>
    </div>
  );
}

const POLICY_CONTENT_QUERY = `#graphql
  fragment PolicyHandle on ShopPolicy {
    body
    handle
    id
    title
    url
  }

  query PoliciesHandle(
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
    $refundPolicy: Boolean!
  ) @inContext(language: $language) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...PolicyHandle
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...PolicyHandle
      }
      termsOfService @include(if: $termsOfService) {
        ...PolicyHandle
      }
      refundPolicy @include(if: $refundPolicy) {
        ...PolicyHandle
      }
    }
  }
`;
