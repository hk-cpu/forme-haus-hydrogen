/**
 * Payment method badges for Saudi e-commerce footer
 * Mada, Visa, Mastercard, Apple Pay, STC Pay
 */

function MadaBadge() {
  return (
    <div className="w-10 h-6 bg-white rounded-[3px] flex items-center justify-center p-0.5" title="Mada">
      <svg viewBox="0 0 60 24" className="w-full h-full">
        <rect width="60" height="24" rx="2" fill="white"/>
        <path d="M10 8h6l-3 8h-6l3-8z" fill="#009B3A"/>
        <path d="M14 8h6l-3 8h-6l3-8z" fill="#00589B"/>
        <text x="30" y="15" fontSize="7" fontWeight="700" fill="#00589B" fontFamily="Arial, sans-serif">mada</text>
      </svg>
    </div>
  );
}

function VisaBadge() {
  return (
    <div className="w-10 h-6 bg-white rounded-[3px] flex items-center justify-center p-0.5" title="Visa">
      <svg viewBox="0 0 60 24" className="w-full h-full">
        <rect width="60" height="24" rx="2" fill="white"/>
        <text x="30" y="16" fontSize="12" fontWeight="700" fill="#1A1F71" fontFamily="Arial, sans-serif" textAnchor="middle">VISA</text>
      </svg>
    </div>
  );
}

function MastercardBadge() {
  return (
    <div className="w-10 h-6 bg-white rounded-[3px] flex items-center justify-center p-0.5" title="Mastercard">
      <svg viewBox="0 0 60 24" className="w-full h-full">
        <rect width="60" height="24" rx="2" fill="white"/>
        <circle cx="24" cy="12" r="8" fill="#EB001B"/>
        <circle cx="36" cy="12" r="8" fill="#F79E1B"/>
        <path d="M30 5.4a8 8 0 010 13.2 8 8 0 000-13.2z" fill="#FF5F00"/>
      </svg>
    </div>
  );
}

function ApplePayBadge() {
  return (
    <div className="w-10 h-6 bg-white rounded-[3px] flex items-center justify-center p-0.5" title="Apple Pay">
      <svg viewBox="0 0 60 24" className="w-full h-full">
        <rect width="60" height="24" rx="2" fill="white"/>
        {/* Apple icon */}
        <path d="M16 6.5c.6-.8 1-1.8.9-2.8-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.7-.9 2.7.9.1 1.9-.5 2.6-1.3z" fill="#000"/>
        <path d="M16.9 8c-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.7-1.5 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.5 2.2 2.7 2.1 1.1 0 1.5-.7 2.7-.7 1.3 0 1.6.7 2.8.7 1.1 0 1.9-1 2.6-2.1.8-1.2 1.2-2.3 1.2-2.4-.1 0-2.2-.9-2.2-3.3 0-2 1.6-3 1.7-3.1-1-1.4-2.4-1.6-3-1.6z" fill="#000" transform="scale(0.5) translate(16,4)"/>
        <text x="35" y="16" fontSize="9" fontWeight="600" fill="#000" fontFamily="Arial, sans-serif" textAnchor="middle">Pay</text>
      </svg>
    </div>
  );
}

function STCPayBadge() {
  return (
    <div className="w-10 h-6 bg-white rounded-[3px] flex items-center justify-center p-0.5" title="STC Pay">
      <svg viewBox="0 0 60 24" className="w-full h-full">
        <rect width="60" height="24" rx="2" fill="white"/>
        <text x="30" y="11" fontSize="6" fontWeight="800" fill="#4F008C" fontFamily="Arial, sans-serif" textAnchor="middle">STC</text>
        <text x="30" y="19" fontSize="6" fontWeight="600" fill="#4F008C" fontFamily="Arial, sans-serif" textAnchor="middle">pay</text>
      </svg>
    </div>
  );
}

function TamaraBadge() {
  return (
    <div className="w-10 h-6 bg-white rounded-[3px] flex items-center justify-center p-0.5" title="Tamara - Buy Now Pay Later">
      <svg viewBox="0 0 60 24" className="w-full h-full">
        <rect width="60" height="24" rx="2" fill="white"/>
        <text x="30" y="15" fontSize="8" fontWeight="700" fill="#2B2D42" fontFamily="Arial, sans-serif" textAnchor="middle">tamara</text>
        <circle cx="51" cy="11" r="2" fill="#F5A623"/>
      </svg>
    </div>
  );
}

export default function PaymentBadges() {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <MadaBadge />
      <VisaBadge />
      <MastercardBadge />
      <ApplePayBadge />
      <STCPayBadge />
      <TamaraBadge />
    </div>
  );
}
