import {type MetaArgs, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {defer} from '@remix-run/server-runtime';
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
  const seoData = matches
    .map((match) => (match.data as any)?.seo)
    .filter(Boolean);
  return getSeoMeta(...seoData);
};

export default function Homepage() {
  const {t} = useTranslation();

  return (
    <div className="min-h-screen bg-transparent text-[#F0EAE6] snap-y-mandatory">
      {/* 1. Hero (Fixed Background Visible) */}
      <Hero />

      {/* Light "Glowing" Theme Content Sheet */}
      <div className="relative z-20 bg-[#F9F5F0]/85 backdrop-blur-md text-[#4A3C31] rounded-t-[2rem] shadow-[0_-10px_40px_-10px_rgba(255,255,255,0.15)] mt-[-5vh]">
        {/* 2. Category Slider */}
        <div className="pt-10 md:pt-14 mobile-snap-section">
          <CategoryBento />
        </div>

        {/* 3. The Edit (Editorial Section) */}
        <div className="py-8 md:py-12 mobile-snap-section">
          <EditorialSection />
        </div>



        {/* 5. Why Choose Us */}
        <div className="mobile-snap-section">
          <WhyChooseUs />
        </div>

        {/* 6. JOIN THE HAUS */}
        <section className="py-10 md:py-14 border-t border-[#8B8076]/10 mobile-snap-section text-center">
          <div
            className="max-w-[1200px] mx-auto space-y-8"
            style={{padding: '0 var(--page-gutter)'}}
          >
            <div className="space-y-4">
              <h2 className="font-serif text-3xl md:text-4xl text-[#4A3C31] tracking-wider uppercase">
                JOIN THE HAUS
              </h2>
              <h3 className="font-serif text-lg md:text-xl italic text-[#8B8076] font-light tracking-wide">
                Forme Haus: Where Essence Meets Elegance
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {[1, 2, 3].map((item, i) => (
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
                  <div className="aspect-[4/3] relative overflow-hidden bg-[#EDE8E3] rounded-lg flex items-center justify-center border border-[#8B8076]/10">
                    <span className="text-[#8B8076]/50 uppercase tracking-widest text-[10px]">
                      Placeholder Image
                    </span>
                  </div>
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
