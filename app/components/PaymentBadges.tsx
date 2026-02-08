/**
 * Enhanced Payment method badges for Saudi e-commerce footer
 * Mada, Visa, Mastercard, Apple Pay, STC Pay
 * Larger, more authoritative sizing for luxury feel
 */

function MadaBadge() {
  return (
    <div className="h-10 px-4 bg-white rounded-md flex items-center justify-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow" title="Mada">
      <svg viewBox="0 0 80 28" className="h-5 w-auto">
        <rect width="80" height="28" rx="3" fill="white"/>
        <path d="M12 9h8l-4 10h-8l4-10z" fill="#009B3A"/>
        <path d="M18 9h8l-4 10h-8l4-10z" fill="#00589B"/>
        <text x="42" y="17" fontSize="9" fontWeight="700" fill="#00589B" fontFamily="Arial, sans-serif">mada</text>
      </svg>
    </div>
  );
}

function VisaBadge() {
  return (
    <div className="h-10 px-4 bg-white rounded-md flex items-center justify-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow" title="Visa">
      <svg viewBox="0 0 80 28" className="h-5 w-auto">
        <rect width="80" height="28" rx="3" fill="white"/>
        <text x="40" y="19" fontSize="14" fontWeight="700" fill="#1A1F71" fontFamily="Arial, sans-serif" textAnchor="middle">VISA</text>
      </svg>
    </div>
  );
}

function MastercardBadge() {
  return (
    <div className="h-10 px-4 bg-white rounded-md flex items-center justify-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow" title="Mastercard">
      <svg viewBox="0 0 80 28" className="h-5 w-auto">
        <rect width="80" height="28" rx="3" fill="white"/>
        <circle cx="32" cy="14" r="9" fill="#EB001B"/>
        <circle cx="48" cy="14" r="9" fill="#F79E1B"/>
        <path d="M40 6a9 9 0 010 16 9 9 0 000-16z" fill="#FF5F00"/>
      </svg>
    </div>
  );
}

function ApplePayBadge() {
  return (
    <div className="h-10 px-4 bg-white rounded-md flex items-center justify-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow" title="Apple Pay">
      <svg viewBox="0 0 80 28" className="h-5 w-auto">
        <rect width="80" height="28" rx="3" fill="white"/>
        <path d="M20 7.5c.8-1 1.3-2.3 1.2-3.5-1.1 0-2.5.7-3.3 1.7-.7.9-1.3 2.1-1.1 3.3 1.2.1 2.4-.6 3.2-1.5z" fill="#000"/>
        <path d="M21.2 9c-1.7-.1-3.1 1-3.9 1-1.3 0-2.4-.8-4-.7-1.8 0-3.4 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.5 3.3 2.4 1.3 0 1.8-.8 3.4-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.2-2.5 1-1.4 1.4-2.7 1.4-2.8 0-.1-2.7-1-2.7-4.1 0-2.5 2-3.7 2.1-3.8-1.2-1.7-2.9-1.9-3.7-2z" fill="#000" transform="scale(0.6) translate(16,4)"/>
        <text x="48" y="19" fontSize="11" fontWeight="600" fill="#000" fontFamily="Arial, sans-serif" textAnchor="middle">Pay</text>
      </svg>
    </div>
  );
}

function STCPayBadge() {
  return (
    <div className="h-10 px-4 bg-white rounded-md flex items-center justify-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow" title="STC Pay">
      <svg viewBox="0 0 80 28" className="h-5 w-auto">
        <rect width="80" height="28" rx="3" fill="white"/>
        <text x="40" y="12" fontSize="7" fontWeight="800" fill="#4F008C" fontFamily="Arial, sans-serif" textAnchor="middle">STC</text>
        <text x="40" y="22" fontSize="7" fontWeight="600" fill="#4F008C" fontFamily="Arial, sans-serif" textAnchor="middle">pay</text>
      </svg>
    </div>
  );
}

function TamaraBadge() {
  return (
    <div className="h-10 px-4 bg-white rounded-md flex items-center justify-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow" title="Tamara - Buy Now Pay Later">
      <svg viewBox="0 0 80 28" className="h-5 w-auto">
        <rect width="80" height="28" rx="3" fill="white"/>
        <text x="38" y="18" fontSize="10" fontWeight="700" fill="#2B2D42" fontFamily="Arial, sans-serif" textAnchor="middle">tamara</text>
        <circle cx="68" cy="13" r="3" fill="#F5A623"/>
      </svg>
    </div>
  );
}

function TabbyBadge() {
  return (
    <div className="h-10 px-4 bg-[#D4FB54] rounded-md flex items-center justify-center shadow-sm hover:shadow-md transition-shadow" title="Tabby - Buy Now Pay Later">
      <svg viewBox="0 0 80 28" className="h-5 w-auto">
        <rect width="80" height="28" rx="3" fill="#D4FB54"/>
        <text x="40" y="18" fontSize="10" fontWeight="700" fill="#000000" fontFamily="Arial, sans-serif" textAnchor="middle">tabby</text>
      </svg>
    </div>
  );
}

export default function PaymentBadges() {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <MadaBadge />
      <VisaBadge />
      <MastercardBadge />
      <ApplePayBadge />
      <STCPayBadge />
      <TamaraBadge />
      <TabbyBadge />
    </div>
  );
}
