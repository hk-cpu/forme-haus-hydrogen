/**
 * Payment method icons for footer
 * Clean horizontal single-line layout: Mada, Visa, Mastercard, Apple Pay, STC Pay, Tamara, Tabby
 */

import {motion} from 'framer-motion';

function MadaIcon() {
  return (
    <svg viewBox="0 0 60 20" className="h-5 w-auto" aria-label="Mada">
      <path d="M8 6h6l-3 7h-6l3-7z" fill="#009B3A" />
      <path d="M13 6h6l-3 7h-6l3-7z" fill="#00589B" />
      <text
        x="32"
        y="13"
        fontSize="8"
        fontWeight="700"
        fill="#00589B"
        fontFamily="Arial, sans-serif"
      >
        mada
      </text>
    </svg>
  );
}

function VisaIcon() {
  return (
    <svg viewBox="0 0 60 20" className="h-5 w-auto" aria-label="Visa">
      <text
        x="30"
        y="14"
        fontSize="10"
        fontWeight="800"
        fill="#1A1F71"
        fontFamily="Arial, sans-serif"
        textAnchor="middle"
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardIcon() {
  return (
    <svg viewBox="0 0 40 20" className="h-5 w-auto" aria-label="Mastercard">
      <circle cx="14" cy="10" r="7" fill="#EB001B" />
      <circle cx="26" cy="10" r="7" fill="#F79E1B" />
      <path d="M20 3a7 7 0 010 14 7 7 0 000-14z" fill="#FF5F00" />
    </svg>
  );
}

function ApplePayIcon() {
  return (
    <svg viewBox="0 0 60 20" className="h-5 w-auto" aria-label="Apple Pay">
      <path
        d="M15 5c.6-.7 1-1.6.9-2.5-.8 0-1.9.5-2.5 1.3-.5.6-.9 1.5-.8 2.4.9.1 1.8-.4 2.4-1.2z"
        fill="#fff"
      />
      <path
        d="M15.9 6.2c-1.2-.1-2.3.7-2.9.7-1 0-1.8-.6-2.9-.6-1.3 0-2.5.7-3.1 1.8-1.3 2.3-.4 5.7.9 7.6.6.9 1.4 1.9 2.4 1.8 1 0 1.3-.6 2.5-.6 1.2 0 1.5.6 2.5.6 1 0 1.7-.9 2.4-1.9.7-1 1-1.9 1-2 .1-.1-1.9-.7-1.9-2.9 0-1.7 1.5-2.6 1.6-2.7-.9-1.2-2.1-1.4-2.5-1.8z"
        fill="#fff"
        transform="scale(0.5) translate(12,2)"
      />
      <text
        x="38"
        y="14"
        fontSize="9"
        fontWeight="600"
        fill="#fff"
        fontFamily="Arial, sans-serif"
      >
        Pay
      </text>
    </svg>
  );
}

function STCPayIcon() {
  return (
    <svg viewBox="0 0 40 20" className="h-5 w-auto" aria-label="STC Pay">
      <text
        x="20"
        y="9"
        fontSize="6"
        fontWeight="800"
        fill="#4F008C"
        fontFamily="Arial, sans-serif"
        textAnchor="middle"
      >
        STC
      </text>
      <text
        x="20"
        y="16"
        fontSize="5"
        fontWeight="600"
        fill="#4F008C"
        fontFamily="Arial, sans-serif"
        textAnchor="middle"
      >
        pay
      </text>
    </svg>
  );
}

function TamaraIcon() {
  return (
    <svg viewBox="0 0 60 20" className="h-5 w-auto" aria-label="Tamara">
      <text
        x="28"
        y="13"
        fontSize="8"
        fontWeight="700"
        fill="#F0EAE6"
        fontFamily="Arial, sans-serif"
        textAnchor="middle"
      >
        tamara
      </text>
      <circle cx="50" cy="10" r="2.5" fill="#F5A623" />
    </svg>
  );
}

function TabbyIcon() {
  return (
    <svg viewBox="0 0 50 20" className="h-5 w-auto" aria-label="Tabby">
      <text
        x="25"
        y="13"
        fontSize="8"
        fontWeight="700"
        fill="#D4FB54"
        fontFamily="Arial, sans-serif"
        textAnchor="middle"
      >
        tabby
      </text>
    </svg>
  );
}

/**
 * PaymentLinkButton - Quick payment link for trial orders
 * Placeholder for payment link integration (Moyasar, HyperPay, etc.)
 */
export function PaymentLinkButton({
  amount,
  currency = 'SAR',
  onClick,
}: {
  amount: string;
  currency?: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      whileHover={{scale: 1.02}}
      whileTap={{scale: 0.98}}
      onClick={onClick}
      className="w-full py-3 px-4 bg-[#1B5E20] hover:bg-[#2E7D32] text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
      Pay {amount} {currency} via Payment Link
      <span className="text-[10px] opacity-70">(Trial)</span>
    </motion.button>
  );
}

/**
 * TrustPaymentSection - Combined payment methods and trust indicators
 */
export function TrustPaymentSection() {
  return (
    <div className="space-y-3">
      <PaymentBadges />
      <p className="text-[10px] text-[#6B6058] text-center">
        All transactions are secured with 256-bit SSL encryption
      </p>
    </div>
  );
}

export default function PaymentBadges() {
  return (
    <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
      <MadaIcon />
      <VisaIcon />
      <MastercardIcon />
      <ApplePayIcon />
      <STCPayIcon />
      <TamaraIcon />
      <TabbyIcon />
    </div>
  );
}
