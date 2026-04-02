import {useTranslation} from '~/hooks/useTranslation';
import PaymentBadges from '~/components/PaymentBadges';

interface TrustBadgesProps {
  variant?: 'compact' | 'full' | 'footer';
  showMaroof?: boolean;
  showMuwathooq?: boolean;
  showSecurePayment?: boolean;
  showTrialOrder?: boolean;
  className?: string;
}

function MaroofIcon({className = ''}: {className?: string}) {
  return (
    <svg
      viewBox="0 0 80 32"
      className={`h-8 w-auto ${className}`}
      aria-label="Maroof Verified"
    >
      <path
        d="M16 2L28 8v10c0 7-5.5 12-12 12S4 25 4 18V8l12-6z"
        fill="#1B5E20"
        stroke="#2E7D32"
        strokeWidth="1"
      />
      <path
        d="M10 16l4 4 8-8"
        fill="none"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

function MuwathooqIcon({className = ''}: {className?: string}) {
  return (
    <svg
      viewBox="0 0 80 32"
      className={`h-8 w-auto ${className}`}
      aria-label="Muwathooq Trusted"
    >
      <circle cx="16" cy="16" r="14" fill="#C62828" />
      <circle
        cx="16"
        cy="16"
        r="11"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
      />
      <path
        d="M16 8l2 5h5l-4 3 1.5 5-4.5-3-4.5 3 1.5-5-4-3h5z"
        fill="#FFD700"
      />
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

  if (variant === 'compact') {
    return (
      <div
        className={`flex items-center gap-3 ${className}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {showMaroof ? (
          <div
            className="flex items-center gap-1.5 rounded-md bg-[#E8F5E9] px-2 py-1"
            title={t('trust.maroofVerified', 'Maroof Verified Store')}
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4">
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
            <span className="text-xs font-medium text-[#1B5E20]">
              {t('trust.maroof', 'Maroof')}
            </span>
          </div>
        ) : null}

        {showSecurePayment ? (
          <div className="flex items-center gap-1 text-[#6B6058]">
            <SecurePaymentIcon className="h-3.5 w-3.5" />
            <span className="text-xs uppercase tracking-wider">
              {t('trust.securePayment', 'Secure')}
            </span>
          </div>
        ) : null}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div
        className={`flex items-center gap-4 ${className}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {showMaroof ? (
          <a
            href="https://maroof.sa"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-70 transition-opacity hover:opacity-100"
          >
            <MaroofIcon className="h-6" />
          </a>
        ) : null}
        {showMuwathooq ? (
          <div className="opacity-70 transition-opacity hover:opacity-100">
            <MuwathooqIcon className="h-6" />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-[#8B8076]/15 bg-gradient-to-b from-white to-[#F9F5F0] p-5 shadow-sm md:p-6 ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="mb-5 flex items-center justify-center gap-2">
        <SecurePaymentIcon className="h-4 w-4 text-[#a87441]" />
        <span className="text-xs font-medium uppercase tracking-wider text-[#4A3C31]">
          {t('trust.shopWithConfidence', 'Shop with Confidence')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {showMaroof ? (
          <a
            href="https://maroof.sa"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 rounded-xl border border-[#8B8076]/10 bg-white px-3 py-3 text-center shadow-sm"
          >
            <MaroofIcon className="h-8" />
            <span className="text-xs font-medium leading-tight text-[#4A3C31]">
              {t('trust.maroofVerified', 'Maroof Verified')}
            </span>
          </a>
        ) : null}

        {showMuwathooq ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-[#8B8076]/10 bg-white px-3 py-3 text-center shadow-sm">
            <MuwathooqIcon className="h-8" />
            <span className="text-xs font-medium leading-tight text-[#4A3C31]">
              {t('trust.muwathooqTrusted', 'Consumer Trusted')}
            </span>
          </div>
        ) : null}

        {showSecurePayment ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-[#8B8076]/10 bg-white px-3 py-3 text-center shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#a87441]/15">
              <SecurePaymentIcon className="h-5 w-5 text-[#a87441]" />
            </div>
            <span className="text-xs font-medium leading-tight text-[#4A3C31]">
              {t('trust.securePayment', 'Secure Payment')}
            </span>
          </div>
        ) : null}

        {showTrialOrder ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-[#8B8076]/10 bg-white px-3 py-3 text-center shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#a87441]/15">
              <TrialOrderIcon className="h-5 w-5 text-[#a87441]" />
            </div>
            <span className="text-xs font-medium leading-tight text-[#4A3C31]">
              {t('trust.fastDelivery', 'Fast Delivery')}
            </span>
          </div>
        ) : null}
      </div>

      <div className="mt-4 border-t border-[#8B8076]/10 pt-3">
        <p className="text-center text-xs text-[#736659] mb-2">
          {t(
            'trust.paymentMethods',
            'Secure payments via Tap: Mada, Visa, Mastercard, Apple Pay, STC Pay, Tabby, Tamara',
          )}
        </p>
        <div className="flex justify-center">
          <PaymentBadges />
        </div>
      </div>
    </div>
  );
}

export default TrustBadges;
