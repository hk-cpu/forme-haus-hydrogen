/**
 * Payment method icons for footer
 * Clean horizontal single-line layout: Mada, Visa, Mastercard, Apple Pay, STC Pay
 */

/*
 * Payment marks for the footer.
 *
 * The footer sits on a dark gradient (via-[#151515]/90). The previous marks
 * were hand-drawn approximations and two of them were dark-on-dark: mada was
 * #00589B and STC Pay #4F008C, both close to unreadable against that
 * background. They are drawn light here so they can be read.
 *
 * Visa and Mastercard are the real brand SVGs, bundled under
 * /brand/payment/. mada, Apple Pay and STC Pay are still approximations —
 * accurate marks for those have to come from the schemes themselves (Tap
 * supplies a marks pack), and redrawing them from memory is what made this
 * row look wrong in the first place.
 */

const MARK_HEIGHT = 'h-5 w-auto';

function VisaIcon() {
  return (
    <img
      src="/brand/payment/visa.svg"
      alt="Visa"
      className={MARK_HEIGHT}
      width={31}
      height={20}
      loading="lazy"
      decoding="async"
    />
  );
}

function MastercardIcon() {
  return (
    <img
      src="/brand/payment/mastercard.svg"
      alt="Mastercard"
      className={MARK_HEIGHT}
      width={31}
      height={20}
      loading="lazy"
      decoding="async"
    />
  );
}

function MadaIcon() {
  return (
    <svg viewBox="0 0 62 20" className={MARK_HEIGHT} aria-label="mada">
      <rect width="62" height="20" rx="3" fill="#FFFFFF" />
      <path d="M10 6.5h6.5l-3.2 7H6.8l3.2-7z" fill="#059A4D" />
      <path d="M15.4 6.5h6.5l-3.2 7h-6.5l3.2-7z" fill="#1A4E8A" />
      <text
        x="42"
        y="13.6"
        fontSize="8.5"
        fontWeight="700"
        fill="#1A4E8A"
        fontFamily="Arial, Helvetica, sans-serif"
        textAnchor="middle"
      >
        mada
      </text>
    </svg>
  );
}

function ApplePayIcon() {
  return (
    <svg viewBox="0 0 62 20" className={MARK_HEIGHT} aria-label="Apple Pay">
      <rect width="62" height="20" rx="3" fill="#FFFFFF" />
      <path
        d="M22.1 8.05c-.35.42-.92.75-1.48.7-.07-.56.2-1.16.53-1.53.35-.43.97-.73 1.47-.76.06.58-.17 1.16-.52 1.59zm.51.81c-.81-.05-1.5.46-1.89.46-.39 0-.98-.44-1.62-.42-.83.01-1.6.48-2.03 1.23-.87 1.5-.23 3.72.61 4.94.41.6.9 1.27 1.55 1.25.61-.02.85-.4 1.6-.4.74 0 .96.4 1.61.39.67-.01 1.09-.61 1.5-1.21.47-.69.67-1.36.68-1.4-.01-.01-1.31-.51-1.32-2.01-.01-1.25 1.02-1.85 1.07-1.88-.58-.86-1.49-.95-1.81-.97z"
        fill="#111111"
      />
      <text
        x="40"
        y="13.8"
        fontSize="9"
        fontWeight="600"
        fill="#111111"
        fontFamily="Helvetica, Arial, sans-serif"
      >
        Pay
      </text>
    </svg>
  );
}

function STCPayIcon() {
  return (
    <svg viewBox="0 0 62 20" className={MARK_HEIGHT} aria-label="STC Pay">
      <rect width="62" height="20" rx="3" fill="#FFFFFF" />
      <text
        x="31"
        y="13.6"
        fontSize="8.5"
        fontWeight="700"
        fill="#4F008C"
        fontFamily="Arial, Helvetica, sans-serif"
        textAnchor="middle"
      >
        stc pay
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
    <button
      onClick={onClick}
      className="w-full py-3 px-4 bg-[#1B5E20] hover:bg-[#2E7D32] text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
      type="button"
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
    </button>
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
    </div>
  );
}
