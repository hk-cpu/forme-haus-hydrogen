/**
 * Payment method marks.
 *
 * Every mark is the genuine artwork from Shopify's open-source payment_icons
 * library — the same files Shopify shows at checkout — copied unmodified into
 * /public/brand/payment/ (MIT, see LICENSE and README.md there).
 *
 * They replace hand-drawn approximations: a coloured-parallelogram "mada", a
 * plain-text "STC Pay", a redrawn Apple glyph, and in the cart plain text
 * chips. Customers read those as fake, and for a checkout that is a trust
 * problem, not a cosmetic one.
 *
 * All six share Shopify's 38x24 card format, so they line up at any height.
 * Do not recolour, crop or redraw them; Apple requires the Apple Pay mark to be
 * used unaltered.
 */

export type PaymentMethod =
  | 'mada'
  | 'visa'
  | 'mastercard'
  | 'applePay'
  | 'stcPay'
  | 'tamara';

const PAYMENT_MARKS: Record<PaymentMethod, {src: string; label: string}> = {
  mada: {src: '/brand/payment/mada.svg', label: 'mada'},
  visa: {src: '/brand/payment/visa.svg', label: 'Visa'},
  mastercard: {src: '/brand/payment/mastercard.svg', label: 'Mastercard'},
  applePay: {src: '/brand/payment/apple-pay.svg', label: 'Apple Pay'},
  stcPay: {src: '/brand/payment/stc-pay.svg', label: 'stc pay'},
  tamara: {src: '/brand/payment/tamara.svg', label: 'tamara'},
};

/** The methods the store takes payment through, in display order. */
export const ACCEPTED_METHODS: PaymentMethod[] = [
  'mada',
  'visa',
  'mastercard',
  'applePay',
  'stcPay',
];

const HEIGHTS = {sm: 20, md: 24} as const;

export function PaymentMarks({
  methods = ACCEPTED_METHODS,
  size = 'md',
  className = '',
}: {
  methods?: PaymentMethod[];
  size?: keyof typeof HEIGHTS;
  className?: string;
}) {
  const h = HEIGHTS[size];
  const w = Math.round((h * 38) / 24);
  return (
    <ul
      className={`flex items-center justify-center gap-2 flex-wrap ${className}`}
      aria-label="Accepted payment methods"
    >
      {methods.map((m) => (
        <li key={m} className="flex">
          <img
            src={PAYMENT_MARKS[m].src}
            alt={PAYMENT_MARKS[m].label}
            width={w}
            height={h}
            style={{width: w, height: h}}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </li>
      ))}
    </ul>
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
  return <PaymentMarks className="sm:gap-3" />;
}
