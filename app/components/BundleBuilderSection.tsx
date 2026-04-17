import {useState} from 'react';
import {motion} from 'framer-motion';
import {Link} from '~/components/Link';
import {useTranslation} from '~/hooks/useTranslation';

interface BundleOption {
  id: string;
  title: string;
  titleKey: string;
  subtitle?: string;
  subtitleKey?: string;
  badge?: string;
  badgeKey?: string;
  price: string;
  comparePrice?: string;
  savings?: string;
  popular?: boolean;
  image: string;
  url: string;
}

const BUNDLE_OPTIONS: BundleOption[] = [
  {
    id: 'case-only',
    title: 'Case Only',
    titleKey: 'bundle.caseOnly',
    price: '149',
    image: '/brand/modern-essentials-hero-v3.png',
    url: '/collections/phone-cases'
  },
  {
    id: 'case-strap',
    title: 'Case + Strap',
    titleKey: 'bundle.caseAndStrap',
    subtitle: 'Save 15%',
    subtitleKey: 'bundle.save15',
    badge: 'Popular',
    badgeKey: 'bundle.bestSeller',
    price: '229',
    comparePrice: '268',
    popular: true,
    image: '/brand/edit-carry.webp',
    url: '/collections/case-strap-bundles'
  },
  {
    id: 'complete-set',
    title: 'Complete Set',
    titleKey: 'bundle.fullBundle',
    subtitle: 'Save 20%',
    subtitleKey: 'bundle.save20',
    badge: 'Best Value',
    badgeKey: 'bundle.bestValue',
    price: '319',
    comparePrice: '398',
    image: '/brand/new-in-hero-v3.png',
    url: '/collections/all'
  },
];

export function BundleBuilderSection({reduceMotion = false}: {reduceMotion?: boolean}) {
  const {t, isRTL, currencyCode} = useTranslation();
  const [hoveredBundle, setHoveredBundle] = useState<string | null>(null);

  const easeOutExpo = [0.16, 1, 0.3, 1];

  return (
    <div className="w-full pb-16" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Intro text */}
      <motion.div
        initial={reduceMotion ? false : {opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true}}
        transition={{duration: 0.8, ease: easeOutExpo}}
        className="text-center max-w-2xl mx-auto mb-10 md:mb-14 px-4"
      >
        <span className="block text-[10px] uppercase tracking-[0.35em] text-[#a87441] font-light mb-3">
          Customise
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-[#2C2419] mb-4">
          Choose Your Bundle
        </h2>
        <p className="text-[#8B8076] text-sm md:text-base font-light tracking-wide italic">
          Curate your collection and unlock exclusive bundle pricing.
        </p>
      </motion.div>

      {/* Bundle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-[1200px] mx-auto">
        {BUNDLE_OPTIONS.map((bundle, index) => (
          <motion.div
            key={bundle.id}
            initial={reduceMotion ? false : {opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.8, delay: index * 0.15, ease: easeOutExpo}}
            onMouseEnter={() => setHoveredBundle(bundle.id)}
            onMouseLeave={() => setHoveredBundle(null)}
            className={`group relative flex flex-col rounded-xl overflow-hidden transition-all duration-500 ${bundle.popular ? 'bg-white shadow-[0_8px_30px_rgba(168,116,65,0.12)] border border-[#a87441]/20 transform md:-translate-y-2' : 'bg-[#FDFBF9] shadow-sm border border-[#E8E0D8]/40 hover:shadow-lg hover:border-[#a87441]/20'}`}
          >
            {/* Badges */}
            {bundle.badge && (
              <div className="absolute top-4 left-4 z-20">
                <span className={`px-3 py-1.5 text-[9px] uppercase tracking-widest rounded-full shadow-md ${bundle.popular ? 'bg-[#a87441] text-white' : 'bg-[#2C2419] text-white'}`}>
                  {t(bundle.badgeKey!, bundle.badge)}
                </span>
              </div>
            )}

            {/* Image */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F1ED]">
              <motion.img
                src={bundle.image}
                alt={bundle.title}
                className="w-full h-full object-cover"
                animate={reduceMotion ? {} : {scale: hoveredBundle === bundle.id ? 1.05 : 1}}
                transition={{duration: 1.2, ease: easeOutExpo}}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-6 md:p-8">
              <div className="mb-4">
                <h3 className={`font-serif text-2xl mb-1 ${bundle.popular ? 'text-[#a87441]' : 'text-[#2C2419]'}`}>
                  {t(bundle.titleKey, bundle.title)}
                </h3>
                {bundle.subtitle && (
                  <p className="text-sm font-medium text-emerald-600">
                    {t(bundle.subtitleKey!, bundle.subtitle)}
                  </p>
                )}
              </div>

              <div className="flex items-baseline gap-2 mb-6 mt-auto">
                <span className="text-2xl text-[#2C2419] font-medium tracking-wide">
                  {bundle.price} {currencyCode || 'SAR'}
                </span>
                {bundle.comparePrice && (
                  <span className="text-sm text-[#8B8076] line-through">
                    {bundle.comparePrice} {currencyCode || 'SAR'}
                  </span>
                )}
              </div>

              {/* Action Button */}
              <Link 
                to={bundle.url}
                className={`flex items-center justify-center w-full py-4 px-6 text-[11px] uppercase tracking-[0.2em] transition-all duration-300 rounded-lg ${bundle.popular ? 'bg-[#a87441] text-white hover:bg-[#8B5E3C] shadow-md hover:shadow-lg' : 'bg-[#2C2419] text-white hover:bg-[#1a1510]'}`}
              >
                {t('bundle.shopBundle', 'Shop Bundle')}
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Perks Footer */}
      <motion.div 
        initial={reduceMotion ? false : {opacity: 0}}
        whileInView={{opacity: 1}}
        viewport={{once: true}}
        transition={{duration: 0.8, delay: 0.4}}
        className="flex flex-wrap justify-center gap-6 mt-12 md:mt-16 text-[#8B8076]"
      >
        {[
          {icon: '🚚', text: t('bundle.freeShipping', 'Free Shipping over 400 SAR')},
          {icon: '🎁', text: t('bundle.giftWrap', 'Complimentary Gift Wrap')},
          {icon: '↩️', text: t('bundle.easyReturns', '14-Day Easy Returns')},
        ].map((perk, i) => (
          <span key={i} className="flex items-center gap-2 text-xs uppercase tracking-wider">
            <span className="text-sm">{perk.icon}</span> {perk.text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
