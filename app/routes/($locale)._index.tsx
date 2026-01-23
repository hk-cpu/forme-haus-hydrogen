import {
  defer,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import { Suspense } from 'react';
import { Await, useLoaderData, Link } from '@remix-run/react';
import { getSeoMeta, Image } from '@shopify/hydrogen';
import { motion, useScroll, useTransform } from 'framer-motion';

import Hero from '~/components/Hero';
import NotifyForm from '~/components/NotifyForm';
import CategorySlider from '~/components/CategorySlider';
import EditorialSection from '~/components/EditorialSection';
import { seoPayload } from '~/lib/seo.server';
import { routeHeaders } from '~/data/cache';

export const headers = routeHeaders;

export async function loader(args: LoaderFunctionArgs) {
  const { params, context } = args;
  const { language, country } = context.storefront.i18n;

  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    throw new Response(null, { status: 404 });
  }

  const criticalData = await loadCriticalData(args);
  const deferredData = loadDeferredData(args);

  return defer({ ...deferredData, ...criticalData });
}

async function loadCriticalData({ context, request }: LoaderFunctionArgs) {
  const { shop } = await context.storefront.query(HOMEPAGE_SEO_QUERY);

  return {
    shop,
    seo: seoPayload.home({ url: request.url }),
  };
}

function loadDeferredData({ context }: LoaderFunctionArgs) {
  const { language, country } = context.storefront.i18n;

  const featuredCollections = context.storefront
    .query(FEATURED_COLLECTIONS_QUERY, {
      variables: {
        country,
        language,
      },
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    featuredCollections,
  };
}

export const meta = ({ matches }: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Homepage() {
  const { featuredCollections } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-transparent text-[#F0EAE6]">
      {/* 1. Hero (Fixed Background Visible) */}
      <Hero />

      {/* Light "Glowing" Theme Content Sheet */}
      <div className="relative z-20 bg-[#F9F5F0] text-[#8B8076] rounded-t-[3rem] shadow-[0_-20px_60px_-15px_rgba(255,255,255,0.3)] mt-[-5vh] pt-12">

        {/* 2. Category Slider (Horizontal Scroll - New In / Categories) */}
        <CategorySlider />

        {/* 3. The Edit (Editorial Section) */}
        <EditorialSection />

        {/* 4. Brand Introduction (Moved down slightly as a transition) */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="py-16 px-6 text-center max-w-2xl mx-auto space-y-8 border-t border-[#8B8076]/10"
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#8B5E3C] to-transparent mx-auto opacity-50" />
          <p className="font-serif text-xl md:text-2xl leading-relaxed text-[#5C5046] font-light italic">
            “Formé Haus is a Saudi-based womenswear label rooted in modern elegance, refined silhouettes, and thoughtful craftsmanship.”
          </p>
        </motion.section>

        {/* 5. Featured Collections (Now "Curated For You") */}
        <section className="container mx-auto px-6 pb-24">
          <h2 className="font-serif text-2xl italic text-[#4A3C31] mb-8 text-center">Curated For You</h2>
          <Suspense fallback={<div className="h-96 w-full animate-pulse bg-neutral-200" />}>
            <Await resolve={featuredCollections}>
              {(response) => {
                const collections = response?.collections?.nodes || [];
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {collections.slice(0, 3).map((c: any, i: number) => {
                      const placeholders = [
                        '/brand/atelier-mood.png',
                        '/brand/placeholder-drape.png',
                        '/brand/silk-texture.png',
                      ];
                      return (
                        <Link
                          key={c.id}
                          to={`/collections/${c.handle}`}
                          className="group relative aspect-[3/4] bg-neutral-100 border border-neutral-200 overflow-hidden block rounded-md"
                        >
                          {/* Stealth Mode: Force Placeholder */}
                          {false && c.image ? (
                            <div className="absolute inset-0 overflow-hidden">
                              <motion.div
                                className="w-full h-full"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                              >
                                <Image
                                  data={c.image}
                                  sizes="(min-width: 45em) 33vw, 100vw"
                                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                                />
                              </motion.div>
                            </div>
                          ) : (
                            <div className="absolute inset-0 bg-transparent">
                              <img
                                src={placeholders[i % placeholders.length]}
                                alt="Collection Preview"
                                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000 grayscale-[20%]"
                              />
                            </div>
                          )}

                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 bg-black/10 group-hover:bg-black/5 transition-colors">
                            <h3 className="font-serif text-2xl italic text-white drop-shadow-md">
                              {c.title}
                            </h3>
                            <span className="text-[10px] uppercase tracking-widest text-[#F9F6F3] border border-white/50 px-4 py-2 backdrop-blur-sm hover:bg-white hover:text-black transition-colors">
                              View Collection
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                );
              }}
            </Await>
          </Suspense>
        </section>

        {/* 6. Journal Teaser */}
        <section className="container mx-auto px-6 pb-32 border-t border-[#8B8076]/20 pt-24">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-serif text-3xl italic text-[#4A3C31]">Journal</h2>
            <span className="text-xs uppercase tracking-widest text-[#8B8076]">
              Editorial
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'A Modern Saudi Wardrobe',
                img: '/brand/journal-identity.png',
              },
              {
                title: 'Designing for Everyday Elegance',
                img: '/brand/journal-motion.png',
              },
              {
                title: 'Behind the Craft',
                img: '/brand/journal-hero.png',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="space-y-4 cursor-pointer hover:opacity-80 transition-opacity group"
              >
                <div className="aspect-video relative overflow-hidden border border-neutral-200 bg-neutral-100 rounded-sm">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-serif text-lg text-[#5C5046]">{item.title}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Newsletter Signup */}
        <section className="pb-32">
          <div className="text-center space-y-6 mb-12">
            <h2 className="font-serif text-3xl italic text-[#4A3C31]">
              Launching soon in Saudi Arabia
            </h2>
            <p className="text-xs uppercase tracking-widest text-[#8B8076]">
              Join the list for exclusive updates
            </p>
          </div>
          <NotifyForm />
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
