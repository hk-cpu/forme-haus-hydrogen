import {type MetaArgs, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {defer} from '@remix-run/server-runtime';
import {Link} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {motion} from 'framer-motion';

import Hero from '~/components/Hero';
import CategoryBento from '~/components/CategoryBento';
import EditorialSection from '~/components/EditorialSection';
import {WhyChooseUs} from '~/components/WhyChooseUs';
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

function loadDeferredData(_args: LoaderFunctionArgs) {
  return {};
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  // @ts-ignore
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Homepage() {
  const {t} = useTranslation();

  return (
    <div className="min-h-screen bg-transparent text-[#F0EAE6] snap-y-mandatory">
      {/* 1. Hero (Fixed Background Visible) */}
      <Hero />

      {/* Light "Glowing" Theme Content Sheet */}
      <div className="relative z-20 bg-[#F9F5F0]/85 backdrop-blur-md text-[#8B8076] rounded-t-[2rem] shadow-[0_-10px_40px_-10px_rgba(255,255,255,0.15)] mt-[-5vh]">
        {/* 2. Category Slider */}
        <div className="pt-10 md:pt-14 mobile-snap-section">
          <CategoryBento />
        </div>

        {/* 3. The Edit (Editorial Section) */}
        <div className="py-8 md:py-12 mobile-snap-section">
          <EditorialSection />
        </div>

        {/* 4. Brand Introduction */}
        <motion.section
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, margin: '-80px'}}
          transition={{duration: 0.7, ease: [0.25, 0.1, 0.25, 1]}}
          className="py-10 md:py-14 text-center max-w-2xl mx-auto space-y-6 border-t border-[#8B8076]/10 mobile-snap-section"
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#a87441]/40 to-transparent mx-auto" />
          <p className="font-serif text-lg md:text-xl leading-[1.8] text-[#4A3C31] font-light italic tracking-wide px-6">
            &ldquo;{t('home.brandIntro')}&rdquo;
          </p>
        </motion.section>

        {/* 5. Why Choose Us */}
        <div className="mobile-snap-section">
          <WhyChooseUs />
        </div>

        {/* 6. Journal Teaser */}
        <section className="py-6 md:py-8 border-t border-[#8B8076]/10 mobile-snap-section">
          <div
            className="max-w-[1200px] mx-auto"
            style={{padding: '0 var(--page-gutter)'}}
          >
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-serif text-2xl md:text-3xl italic text-[#4A3C31] font-light tracking-wide">
                {t('home.journal')}
              </h2>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8B8076] font-light hidden md:block">
                {t('home.editorial.label')}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {[
                {
                  title: t('journal.modernWardrobe'),
                  img: '/brand/journal-wardrobe.webp',
                  to: '/journal',
                },
                {
                  title: t('journal.everydayElegance'),
                  img: '/brand/journal-elegance.webp',
                  to: '/journal',
                },
                {
                  title: t('journal.behindCraft'),
                  img: '/brand/journal-selection.png',
                  to: '/journal',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{opacity: 0, y: 20}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{once: true}}
                  transition={{
                    delay: i * 0.08,
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <Link
                    to={item.to}
                    className="space-y-3 cursor-pointer group block"
                  >
                    {/* Image Container - object-contain for full image */}
                    <div className="aspect-[4/3] relative overflow-hidden bg-[#EDE8E3] rounded-lg flex items-center justify-center p-3">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105"
                        loading={i < 2 ? 'eager' : 'lazy'}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <h3 className="font-serif text-base md:text-lg text-[#4A3C31] font-light tracking-wide group-hover:text-[#a87441] transition-colors duration-500">
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
