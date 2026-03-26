/**
 * TrustBadges Component
 *
 * Saudi e-commerce trust indicators for pre-launch compliance:
 * - Maroof (Saudi Commercial Registration verification)
 * - Muwathooq (Consumer protection trust mark)
 * - Secure payment badges
 * - Trial order ready indicators
 */

import {motion, useReducedMotion} from 'framer-motion';

import {useTranslation} from '~/hooks/useTranslation';

interface TrustBadgesProps {
  variant?: 'compact' | 'full' | 'footer';
  showMaroof?: boolean;
  showMuwathooq?: boolean;
  showSecurePayment?: boolean;
  showTrialOrder?: boolean;
  className?: string;
}

// Animation variants
const containerVariants = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {opacity: 0, y: 10, scale: 0.95},
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// Maroof Logo SVG (Saudi Commercial Registration)
function MaroofIcon({className = ''}: {className?: string}) {
  return (
    <svg
      viewBox="0 0 80 32"
      className={`h-8 w-auto ${className}`}
      aria-label="Maroof Verified"
    >
      {/* Shield shape */}
      <path
        d="M16 2L28 8v10c0 7-5.5 12-12 12S4 25 4 18V8l12-6z"
        fill="#1B5E20"
        stroke="#2E7D32"
        strokeWidth="1"
      />
      {/* Checkmark */}
      <path
        d="M10 16l4 4 8-8"
        fill="none"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arabic text representation */}
      <text
        x="40"
        y="14"
        fontSize="10"
        fontWeight="700"
        fill="#1B5E20"
        fontFamily="Arial, sans-serif"
      >
        معروف
      </text>
      <text
        x="40"
        y="26"
        fontSize="7"
        fill="#666"
        fontFamily="Arial, sans-serif"
      >
        MAROOF
      </text>
    </svg>
  );
}

// Muwathooq Logo SVG (Consumer Protection Trust Mark)
function MuwathooqIcon({className = ''}: {className?: string}) {
  return (
    <svg
      viewBox="0 0 80 32"
      className={`h-8 w-auto ${className}`}
      aria-label="Muwathooq Trusted"
    >
      {/* Circular badge */}
      <circle cx="16" cy="16" r="14" fill="#C62828" />
      <circle
        cx="16"
        cy="16"
        r="11"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
      />
      {/* Star */}
      <path
        d="M16 8l2 5h5l-4 3 1.5 5-4.5-3-4.5 3 1.5-5-4-3h5z"
        fill="#FFD700"
      />
      {/* Arabic text */}
      <text
        x="38"
        y="14"
        fontSize="9"
        fontWeight="700"
        fill="#C62828"
        fontFamily="Arial, sans-serif"
      >
        موثوق
      </text>
      <text
        x="38"
        y="26"
        fontSize="7"
        fill="#666"
        fontFamily="Arial, sans-serif"
      >
        TRUSTED
      </text>
    </svg>
  );
}

// Secure Payment Icon
function SecurePaymentIcon({className = ''}: {className?: string}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}

// Trial Order Ready Icon
function TrialOrderIcon({className = ''}: {className?: string}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10.5M15 16h3l3-6H13v6z" />
      <circle cx="5" cy="6" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TrustBadges({
  variant = 'full',
  showMaroof = true,
  showMuwathooq = true,
  showSecurePayment = true,
  showTrialOrder = true,
  className = '',
}: TrustBadgesProps) {
  const {isRTL, t} = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  // Compact version for product cards/checkout
  if (variant === 'compact') {
    return (
      <motion.div
        className={`flex items-center gap-3 ${className}`}
        dir={isRTL ? 'rtl' : 'ltr'}
        variants={containerVariants}
        initial={shouldReduceMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{once: true}}
      >
        {showMaroof && (
          <motion.div
            variants={itemVariants}
            whileHover={shouldReduceMotion ? {} : {scale: 1.05}}
            className="relative flex items-center gap-1.5 px-2 py-1 bg-[#E8F5E9] rounded-md overflow-hidden group"
            title={t('trust.maroofVerified', 'Maroof Verified Store')}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
            />
            <svg viewBox="0 0 20 20" className="w-4 h-4">
              <path
                d="M10 2l6 3v6c0 4-3 6-6 7-3-1-6-3-6-7V5l6-3z"
                fill="#1B5E20"
              />
              <path
                d="M7 10l2 2 4-4"
                stroke="#fff"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-[10px] font-medium text-[#1B5E20]">
              {t('trust.maroof', 'Maroof')}
            </span>
          </motion.div>
        )}

        {showSecurePayment && (
          <motion.div
            variants={itemVariants}
            whileHover={shouldReduceMotion ? {} : {scale: 1.05}}
            className="flex items-center gap-1 text-[#8B8076]"
          >
            <SecurePaymentIcon className="h-3.5 w-3.5" />
            <span className="text-[9px] uppercase tracking-wider">
              {t('trust.securePayment', 'Secure')}
            </span>
          </motion.div>
        )}
      </motion.div>
    );
  }

  // Footer version - minimal
  if (variant === 'footer') {
    return (
      <motion.div
        className={`flex items-center gap-4 ${className}`}
        dir={isRTL ? 'rtl' : 'ltr'}
        variants={containerVariants}
        initial={shouldReduceMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{once: true}}
      >
        {showMaroof && (
          <motion.a
            variants={itemVariants}
            href="https://maroof.sa"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-70 hover:opacity-100 transition-opacity relative overflow-hidden group"
            whileHover={shouldReduceMotion ? {} : {scale: 1.05}}
          >
            <MaroofIcon className="h-6" />
            {/* Pulse ring on hover */}
            <motion.div
              className="absolute inset-0 rounded-lg bg-[#1B5E20]/0 group-hover:bg-[#1B5E20]/10 -z-10"
              initial={false}
              animate={{scale: [1, 1.2, 1], opacity: [0, 0.5, 0]}}
              transition={{duration: 1.5, repeat: Infinity, repeatDelay: 2}}
            />
          </motion.a>
        )}
        {showMuwathooq && (
          <motion.button
            variants={itemVariants}
            type="button"
            className="opacity-70 hover:opacity-100 transition-opacity"
            whileHover={shouldReduceMotion ? {} : {scale: 1.05}}
          >
            <MuwathooqIcon className="h-6" />
          </motion.button>
        )}
      </motion.div>
    );
  }

  // Full version for product pages/checkout
  return (
    <motion.div
      initial={shouldReduceMotion ? {opacity: 1} : {opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.5, ease: [0.25, 0.1, 0.25, 1]}}
      className={`bg-[#F9F5F0] rounded-xl p-4 border border-[#8B8076]/10 ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header with icon animation */}
      <motion.div 
        className="flex items-center gap-2 mb-3"
        initial={shouldReduceMotion ? {} : {x: -10, opacity: 0}}
        animate={{x: 0, opacity: 1}}
        transition={{delay: 0.2, duration: 0.4}}
      >
        <motion.div
          animate={shouldReduceMotion ? {} : {
            scale: [1, 1.1, 1],
          }}
          transition={{duration: 2, repeat: Infinity, repeatDelay: 3}}
        >
          <SecurePaymentIcon className="h-4 w-4 text-[#a87441]" />
        </motion.div>
        <span className="text-xs font-medium text-[#4A3C31] uppercase tracking-wider">
          {t('trust.shopWithConfidence', 'Shop with Confidence')}
        </span>
      </motion.div>

      {/* Badges Grid with stagger */}
      <motion.div 
        className="flex flex-wrap items-center gap-4"
        variants={containerVariants}
        initial={shouldReduceMotion ? "visible" : "hidden"}
        animate="visible"
      >
        {showMaroof && (
          <motion.a
            variants={itemVariants}
            href="https://maroof.sa"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={shouldReduceMotion ? {} : {scale: 1.02, y: -2}}
            className="relative flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-[#8B8076]/10 overflow-hidden group"
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
            />
            <MaroofIcon className="h-7" />
            {/* Trust pulse */}
            <motion.div
              className="absolute -top-1 -right-1 w-2 h-2 bg-[#1B5E20] rounded-full"
              animate={shouldReduceMotion ? {} : {
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{duration: 2, repeat: Infinity}}
            />
          </motion.a>
        )}

        {showMuwathooq && (
          <motion.div
            variants={itemVariants}
            whileHover={shouldReduceMotion ? {} : {scale: 1.02, y: -2}}
            className="relative flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-[#8B8076]/10 overflow-hidden group"
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
            />
            <MuwathooqIcon className="h-7" />
          </motion.div>
        )}

        {showTrialOrder && (
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-2 text-[#4A3C31]"
          >
            <motion.div 
              className="w-8 h-8 rounded-full bg-[#a87441]/10 flex items-center justify-center"
              whileHover={shouldReduceMotion ? {} : {rotate: 10}}
            >
              <TrialOrderIcon className="h-4 w-4 text-[#a87441]" />
            </motion.div>
            <div className="text-[10px] leading-tight">
              <p className="font-medium">
                {t('trust.trialReady', 'Trial Ready')}
              </p>
              <p className="text-[#736659]">
                {t('trust.fastDelivery', 'Fast Delivery')}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Payment Links with fade in */}
      <motion.div 
        className="mt-3 pt-3 border-t border-[#8B8076]/10"
        initial={shouldReduceMotion ? {} : {opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 0.5, duration: 0.4}}
      >
        <p className="text-[10px] text-[#736659] text-center">
          {t('trust.paymentMethods', 'Secure payments via Tap: Mada, Visa, Mastercard, Apple Pay, STC Pay, Tabby, Tamara')}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default TrustBadges;
