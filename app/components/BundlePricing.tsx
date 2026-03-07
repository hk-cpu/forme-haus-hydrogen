/**
 * BundlePricing Component
 * 
 * Displays bundle deals and quantity discounts for pre-launch:
 * - Buy X, Get Y deals
 * - Volume pricing tiers
 * - Combo product suggestions
 * - Special launch promotions
 */

import {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Money} from '@shopify/hydrogen';
import {useTranslation} from '~/hooks/useTranslation';

interface BundleTier {
  id: string;
  quantity: number;
  label: string;
  labelAr: string;
  discountPercent: number;
  price: string;
  comparePrice?: string;
}

interface BundleOption {
  id: string;
  title: string;
  titleAr: string;
  subtitle?: string;
  subtitleAr?: string;
  badge?: string;
  badgeAr?: string;
  price: string;
  comparePrice?: string;
  savings?: string;
  popular?: boolean;
}

interface BundlePricingProps {
  variant?: 'tiers' | 'cards' | 'compact';
  productPrice?: string;
  currencyCode?: string;
  onSelect?: (bundleId: string) => void;
  className?: string;
}

// Default bundle tiers for phone cases
const DEFAULT_TIERS: BundleTier[] = [
  {
    id: 'single',
    quantity: 1,
    label: 'Single',
    labelAr: 'قطعة واحدة',
    discountPercent: 0,
    price: '149',
  },
  {
    id: 'double',
    quantity: 2,
    label: 'Double',
    labelAr: 'قطعتان',
    discountPercent: 10,
    price: '268',
    comparePrice: '298',
  },
  {
    id: 'triple',
    quantity: 3,
    label: 'Triple',
    labelAr: 'ثلاث قطع',
    discountPercent: 15,
    price: '380',
    comparePrice: '447',
  },
];

// Default bundle options for combos
const DEFAULT_BUNDLES: BundleOption[] = [
  {
    id: 'case-only',
    title: 'Case Only',
    titleAr: 'الكفر فقط',
    price: '149',
  },
  {
    id: 'case-strap',
    title: 'Case + Strap',
    titleAr: 'كفر + حزام',
    subtitle: 'Save 15%',
    subtitleAr: 'وفر 15%',
    badge: 'Popular',
    badgeAr: 'الأكثر مبيعاً',
    price: '229',
    comparePrice: '268',
    savings: '39',
    popular: true,
  },
  {
    id: 'complete-set',
    title: 'Complete Set',
    titleAr: 'المجموعة الكاملة',
    subtitle: 'Save 20%',
    subtitleAr: 'وفر 20%',
    badge: 'Best Value',
    badgeAr: 'أفضل قيمة',
    price: '319',
    comparePrice: '398',
    savings: '79',
  },
];

export function BundlePricing({
  variant = 'cards',
  productPrice = '149',
  currencyCode = 'SAR',
  onSelect,
  className = '',
}: BundlePricingProps) {
  const {isRTL, t} = useTranslation();
  const [selectedId, setSelectedId] = useState<string>(
    variant === 'cards' ? 'case-strap' : 'single'
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onSelect?.(id);
  };

  // Compact version for product cards
  if (variant === 'compact') {
    return (
      <div 
        className={`flex items-center gap-2 ${className}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <motion.div
          whileHover={{scale: 1.02}}
          className="flex items-center gap-1.5 px-2 py-1 bg-[#a87441]/10 rounded-md"
        >
          <svg 
            viewBox="0 0 24 24" 
            className="w-3.5 h-3.5 text-[#a87441]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <span className="text-[10px] font-medium text-[#a87441]">
            {isRTL ? 'خصم على الكمية' : 'Bundle Savings'}
          </span>
        </motion.div>
        <span className="text-[10px] text-[#8B8076]">
          {isRTL ? '2+ قطع: خصم 10%' : '2+ items: 10% off'}
        </span>
      </div>
    );
  }

  // Tiered pricing (quantity selector style)
  if (variant === 'tiers') {
    return (
      <div 
        className={`bg-[#F9F5F0] rounded-xl p-4 ${className}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <p className="text-xs font-medium text-[#4A3C31] mb-3">
          {isRTL ? 'اختر الكمية (توفر خصم)' : 'Select Quantity (Discount Available)'}
        </p>
        
        <div className="space-y-2">
          {DEFAULT_TIERS.map((tier) => (
            <motion.button
              key={tier.id}
              onClick={() => handleSelect(tier.id)}
              whileHover={{scale: 1.01}}
              whileTap={{scale: 0.99}}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                selectedId === tier.id
                  ? 'border-[#a87441] bg-white shadow-sm'
                  : 'border-[#8B8076]/20 hover:border-[#8B8076]/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedId === tier.id
                    ? 'border-[#a87441]'
                    : 'border-[#8B8076]/30'
                }`}>
                  {selectedId === tier.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#a87441]" />
                  )}
                </div>
                <div className="text-left">
                  <span className="text-sm font-medium text-[#4A3C31]">
                    {isRTL ? tier.labelAr : tier.label}
                  </span>
                  {tier.discountPercent > 0 && (
                    <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                      {tier.discountPercent}% {isRTL ? 'خصم' : 'OFF'}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-sm font-semibold text-[#4A3C31]">
                  {tier.price} {currencyCode}
                </span>
                {tier.comparePrice && (
                  <span className="ml-2 text-xs text-[#8B8076] line-through">
                    {tier.comparePrice} {currencyCode}
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Savings highlight */}
        <AnimatePresence mode="wait">
          {selectedId !== 'single' && (
            <motion.div
              initial={{opacity: 0, height: 0}}
              animate={{opacity: 1, height: 'auto'}}
              exit={{opacity: 0, height: 0}}
              className="mt-3 p-2 bg-green-50 rounded-lg border border-green-100"
            >
              <p className="text-xs text-center text-green-700">
                {isRTL 
                  ? `توفير ${DEFAULT_TIERS.find(t => t.id === selectedId)?.comparePrice ? parseInt(DEFAULT_TIERS.find(t => t.id === selectedId)!.comparePrice!) - parseInt(DEFAULT_TIERS.find(t => t.id === selectedId)!.price) : 0} ريال`
                  : `You save ${DEFAULT_TIERS.find(t => t.id === selectedId)?.comparePrice ? parseInt(DEFAULT_TIERS.find(t => t.id === selectedId)!.comparePrice!) - parseInt(DEFAULT_TIERS.find(t => t.id === selectedId)!.price) : 0} SAR`
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Card style (bundle combos)
  return (
    <div 
      className={`${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-[#4A3C31]">
          {isRTL ? 'اختر الباقة' : 'Choose Your Bundle'}
        </p>
        <span className="text-[10px] text-[#8B8076]">
          {isRTL ? 'وفر أكثر مع الباقات' : 'Save more with bundles'}
        </span>
      </div>

      <div className="space-y-2">
        {DEFAULT_BUNDLES.map((bundle) => (
          <motion.button
            key={bundle.id}
            onClick={() => handleSelect(bundle.id)}
            whileHover={{scale: 1.01}}
            whileTap={{scale: 0.99}}
            className={`w-full relative p-3 rounded-lg border transition-all text-left ${
              selectedId === bundle.id
                ? 'border-[#a87441] bg-white shadow-md'
                : 'border-[#8B8076]/20 hover:border-[#8B8076]/40 bg-[#F9F5F0]'
            }`}
          >
            {/* Popular badge */}
            {bundle.popular && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#a87441] text-white text-[9px] uppercase tracking-wider rounded-full">
                {isRTL ? bundle.badgeAr : bundle.badge}
              </span>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedId === bundle.id
                    ? 'border-[#a87441]'
                    : 'border-[#8B8076]/30'
                }`}>
                  {selectedId === bundle.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#a87441]" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#4A3C31]">
                    {isRTL ? bundle.titleAr : bundle.title}
                  </p>
                  {bundle.subtitle && (
                    <p className={`text-[10px] ${bundle.popular ? 'text-[#a87441]' : 'text-green-600'}`}>
                      {isRTL ? bundle.subtitleAr : bundle.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-[#4A3C31]">
                  {bundle.price} {currencyCode}
                </p>
                {bundle.comparePrice && (
                  <p className="text-xs text-[#8B8076] line-through">
                    {bundle.comparePrice} {currencyCode}
                  </p>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Bundle benefits */}
      <div className="mt-3 flex flex-wrap gap-2">
        {[
          { icon: '🚚', text: isRTL ? 'شحن مجاني' : 'Free Shipping' },
          { icon: '🎁', text: isRTL ? 'تغليف هدية' : 'Gift Wrap' },
          { icon: '↩️', text: isRTL ? 'إرجاع سهل' : 'Easy Returns' },
        ].map((benefit, i) => (
          <span 
            key={i}
            className="text-[10px] px-2 py-1 bg-[#8B8076]/10 text-[#8B8076] rounded-full"
          >
            {benefit.icon} {benefit.text}
          </span>
        ))}
      </div>
    </div>
  );
}

export default BundlePricing;
