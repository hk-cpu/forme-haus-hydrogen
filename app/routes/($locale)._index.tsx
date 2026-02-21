import {type MetaArgs, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {defer} from '@remix-run/server-runtime';
import {Suspense} from 'react';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {getSeoMeta, Image} from '@shopify/hydrogen';
import {motion} from 'framer-motion';

import Hero from '~/components/Hero';
import CategoryBento from '~/components/CategoryBento';
import EditorialSection from '~/components/EditorialSection';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {useTranslation} from '~/hooks/useTranslation';

export const headers = routeHeaders;

export async function loader(args: LoaderFunctionArgs) {
  const {params, context} = args;
  const {language, country} = context.storefront.i18n;

  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    throw new Response(null, {status: 404});
  }

  const criticalData = await loadCriticalData(args);
  const deferredData = loadDeferredData(args);

  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const {shop} = await context.storefront.query(HOMEPAGE_SEO_QUERY);

  return {
    shop,
    seo: seoPayload.home({url: request.url}),
  };
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  const {language, country} = context.storefront.i18n;

  const featuredCollections = context.storefront
    .query(FEATURED_COLLECTIONS_QUERY, {
      variables: {
        country,
        language,
      },
    })
    .catch((error: unknown) => {
      console.error(error);
      return null;
    });

  return {
    featuredCollections,
  };
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  // @ts-ignore
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Homepage() {
  const {featuredCollections} = useLoaderData<typeof loader>();
  const {t} = useTranslation();

  return (
    <div className="min-h-screen bg-transparent text-[#F0EAE6]">
      {/* 1. Hero (Fixed Background Visible) */}
      <Hero />

      {/* Light "Glowing" Theme Content Sheet */}
      <div className="relative z-20 bg-[#F9F5F0] text-[#8B8076] rounded-t-[2rem] shadow-[0_-10px_40px_-10px_rgba(255,255,255,0.15)] mt-[-5vh]">
        {/* 2. Category Slider */}
        <div className="pt-16 md:pt-24">
          <CategoryBento />
        </div>

        {/* 3. The Edit (Editorial Section) */}
        <div className="py-8 md:py-12">
          <EditorialSection />
        </div>

        {/* 4. Brand Introduction */}
        <motion.section
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, margin: '-80px'}}
          transition={{duration: 0.7, ease: [0.25, 0.1, 0.25, 1]}}
          className="py-16 md:py-24 text-center max-w-2xl mx-auto space-y-8 border-t border-[#8B8076]/10"
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#a87441]/40 to-transparent mx-auto" />
          <p className="font-serif text-lg md:text-xl leading-[1.8] text-[#4A3C31] font-light italic tracking-wide px-6">
            &ldquo;{t('home.brandIntro')}&rdquo;
          </p>
        </motion.section>

        {/* 5. Featured Collections */}
        <section className="py-16 md:py-24 border-t border-[#8B8076]/10">
          <div className="max-w-[1200px] mx-auto" style={{padding: '0 var(--page-gutter)'}}>
            <Suspense
              fallback={
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[0,1,2].map(i => (
                    <div key={i} className="aspect-[3/4] rounded-lg luxury-skeleton" />
                  ))}
                </div>
              }
            >
              <Await resolve={featuredCollections}>
                {(response) => {
                  const collections = (response?.collections?.nodes || []).slice(0, 3);
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {collections.map((c: any, i: number) => {
                        const placeholders = [
                          '/brand/atelier-mood.png',
                          '/brand/placeholder-drape.png',
                          '/brand/silk-texture.png',
                        ];
                        const displayTitle = c.title === 'Home page' ? 'Where Elegance Begins' : c.title;
                        return (
                          <motion.div
                            key={c.id}
                            initial={{opacity: 0, y: 20}}
                            whileInView={{opacity: 1, y: 0}}
                            viewport={{once: true}}
                            transition={{delay: i * 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1]}}
                          >
                            <Link
                              to={`/collections/${c.handle}`}
                              className="group relative aspect-[3/4] bg-[#EDE8E3] overflow-hidden block rounded-lg"
                            >
                              {c.image ? (
                                <div className="absolute inset-0 overflow-hidden">
                                  <motion.div
                                    className="w-full h-full"
                                    whileHover={{scale: 1.03}}
                                    transition={{duration: 1.2, ease: [0.25, 0.1, 0.25, 1]}}
                                  >
                                    <Image
                                      data={c.image}
                                      sizes="(min-width: 45em) 33vw, 100vw"
                                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                                    />
                                  </motion.div>
                                </div>
                              ) : (
                                <div className="absolute inset-0">
                                  <img
                                    src={placeholders[i % placeholders.length]}
                                    alt="Collection Preview"
                                    className="w-full h-full object-cover opacity-90 group-hover:scale-103 transition-transform duration-1000"
                                  />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                              <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 gap-4 z-10">
                                <h3 className="font-serif text-2xl italic text-white drop-shadow-md text-center px-6">
                                  {displayTitle}
                                </h3>
                                <span className="text-[10px] uppercase tracking-[0.2em] text-white/90 border border-white/40 px-5 py-2.5 backdrop-blur-sm group-hover:bg-white group-hover:text-[#4A3C31] transition-all duration-500">
                                  View Collection
                                </span>
                              </div>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  );
                }}
              </Await>
            </Suspense>
          </div>
        </section>

        {/* 6. Journal Teaser */}
        <section className="py-16 md:py-24 border-t border-[#8B8076]/10">
          <div className="max-w-[1200px] mx-auto" style={{padding: '0 var(--page-gutter)'}}>
            <div className="flex justify-between items-end mb-12 md:mb-16">
              <h2 className="font-serif text-3xl md:text-4xl italic text-[#4A3C31] font-light tracking-wide">
                {t('home.journal')}
              </h2>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#8B8076] font-light hidden md:block">
                {t('home.editorial.label')}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {[
                {
                  title: t('journal.modernWardrobe'),
                  img: '/brand/journal-identity.png',
                  to: '/journal',
                },
                {
                  title: t('journal.everydayElegance'),
                  img: '/brand/journal-motion.png',
                  to: '/journal',
                },
                {
                  title: t('journal.behindCraft'),
                  img: '/brand/journal-hero.png',
                  to: '/journal',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{opacity: 0, y: 20}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{once: true}}
                  transition={{delay: i * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1]}}
                >
                  <Link
                    to={item.to}
                    className="space-y-4 cursor-pointer group block"
                  >
                    <div className="aspect-[16/10] relative overflow-hidden bg-[#EDE8E3] rounded-lg">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03] opacity-90 group-hover:opacity-100"
                      />
                    </div>
                    <h3 className="font-serif text-lg md:text-xl text-[#4A3C31] font-light tracking-wide group-hover:text-[#a87441] transition-colors duration-500">
                      {item.title}
                    </h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const HOMEPAGE_SEO_QUERY = `#graphql
  query seoCollectionContent($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    shop {
      name
      description
    }
  }
` as const;

// @see: https://shopify.dev/api/storefront/current/queries/collections
export const FEATURED_COLLECTIONS_QUERY = `#graphql
  query homepageFeaturedCollections($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(
      first: 3
    ) {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
  }
` as const;
