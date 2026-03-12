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
        {/* 1.5. Brand Story / Top Informational Mention */}
        <section className="pt-14 md:pt-16 pb-4 px-6 max-w-[800px] mx-auto text-center mobile-snap-section">
          <h2 className="font-serif text-xl md:text-2xl text-[#4A3C31] tracking-wider uppercase mb-5">
            FORME HAUS
          </h2>
          <div className="space-y-4 text-sm md:text-base text-[#4A3C31]/80 leading-relaxed font-light">
            <p>
              FORME HAUS Collection is an Australian Tech Accessory brand owned, run and led by women. We create purposeful pieces for our everyday wardrobe. A collection of fashion and tech accessories, including phone cases, phone straps, key chains, suction plates and screen protectors, helping you to always stay connected.
            </p>
            <p>
              We offer 48 hour dispatch, international shipping, and free shipping on domestic orders over $70.
            </p>
            <p className="font-medium italic text-[#a87441]">
              Meet Louve: the hands free solution for your iPhone!
            </p>
          </div>
        </section>
        {/* 2. Category Slider */}
        <div className="pt-10 md:pt-14 mobile-snap-section">
          <CategoryBento />
        </div>

        {/* 3. The Edit (Editorial Section) */}
        <div className="py-8 md:py-12 mobile-snap-section">
          <EditorialSection />
        </div>




        {/* 6. JOIN THE HAUS */}
        <section className="py-10 md:py-16 border-t border-[#8B8076]/10 mobile-snap-section">
          <div className="max-w-[1200px] mx-auto" style={{padding: '0 var(--page-gutter)'}}>
            <div className="space-y-2 text-center mb-10 md:mb-14">
              <h2 className="font-serif text-3xl md:text-4xl text-[#4A3C31] tracking-wider uppercase">
                JOIN THE HAUS
              </h2>
              <div className="flex flex-col items-center gap-1 mt-4">
                <span className="font-serif text-2xl text-[#4A3C31]">
                  Forme Haus
                </span>
                <span className="font-serif text-lg md:text-xl italic text-[#8B8076] font-light tracking-wide">
                  Where Essence Meets Elegance
                </span>
              </div>
            </div>
            
            {/* Editorial Grid Base Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 w-full h-auto">
              {/* Left Column - Wider */}
              <div className="md:col-span-7 flex flex-col gap-3 md:gap-4">
                {/* Top-left: dominant large tile */}
                <div className="w-full aspect-[4/5] bg-[#E8E4E0] overflow-hidden rounded-sm">
                  <motion.div initial={{opacity:0, scale: 1.05}} whileInView={{opacity:1, scale:1}} transition={{duration: 0.8}} viewport={{once: true}} className="w-full h-full">
                    <img src="/brand/edit-modern-essentials.webp" alt="Forme Haus Editorial 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" />
                  </motion.div>
                </div>
                {/* Bottom-left: smaller square or near-square tile */}
                <div className="w-[65%] md:w-[55%] aspect-square bg-[#E8E4E0] overflow-hidden rounded-sm">
                  <motion.div initial={{opacity:0, scale: 1.05}} whileInView={{opacity:1, scale:1}} transition={{duration: 0.8, delay: 0.1}} viewport={{once: true}} className="w-full h-full">
                    <img src="/brand/phone-accessories.webp" alt="Forme Haus Editorial 3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" />
                  </motion.div>
                </div>
              </div>

              {/* Right Column - Narrower */}
              <div className="md:col-span-5 flex flex-col gap-3 md:gap-4">
                {/* Top-right: tall vertical tile */}
                <div className="w-[85%] md:w-full ml-auto md:ml-0 aspect-[2/3] md:aspect-[3/5] bg-[#E8E4E0] overflow-hidden rounded-sm">
                  <motion.div initial={{opacity:0, scale: 1.05}} whileInView={{opacity:1, scale:1}} transition={{duration: 0.8, delay: 0.2}} viewport={{once: true}} className="w-full h-full">
                    <img src="/brand/sunglasses.webp" alt="Forme Haus Editorial 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" />
                  </motion.div>
                </div>
                {/* Bottom-right: medium horizontal tile */}
                <div className="w-[90%] md:w-full aspect-[4/3] bg-[#E8E4E0] overflow-hidden rounded-sm mt-auto z-10 transition-transform hover:scale-[1.02] duration-700 ease-out ml-auto md:ml-0 md:-ml-6">
                  <motion.div initial={{opacity:0, scale: 1.05}} whileInView={{opacity:1, scale:1}} transition={{duration: 0.8, delay: 0.3}} viewport={{once: true}} className="w-full h-full">
                    <img src="/brand/new-in.webp" alt="Forme Haus Editorial 4" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out origin-center" loading="lazy" />
                  </motion.div>
                </div>
              </div>
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
