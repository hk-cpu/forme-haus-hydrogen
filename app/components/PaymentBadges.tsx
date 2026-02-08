/**
 * Enhanced Payment method badges for Saudi e-commerce footer
 * Mada, Visa, Mastercard, Apple Pay, STC Pay, Tamara, Tabby
 * Horizontal layout with tooltips and labels
 */

interface PaymentBadgeProps {
  name: string;
  description?: string;
}

function MadaBadge({ name, description }: PaymentBadgeProps) {
  return (
    <div 
      className="group relative flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-[#E5E0D8] hover:shadow-md hover:border-[#a87441]/30 transition-all cursor-help"
      title={description || name}
    >
      <svg viewBox="0 0 60 20" className="h-4 w-auto">
        <path d="M8 6h6l-3 7h-6l3-7z" fill="#009B3A"/>
        <path d="M13 6h6l-3 7h-6l3-7z" fill="#00589B"/>
        <text x="32" y="13" fontSize="8" fontWeight="700" fill="#00589B" fontFamily="Arial, sans-serif">mada</text>
      </svg>
      <span className="text-[10px] font-semibold text-[#2C2419] uppercase tracking-wide hidden sm:inline">{name}</span>
    </div>
  );
}

function VisaBadge({ name, description }: PaymentBadgeProps) {
  return (
    <div 
      className="group relative flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-[#E5E0D8] hover:shadow-md hover:border-[#a87441]/30 transition-all cursor-help"
      title={description || name}
    >
      <svg viewBox="0 0 60 20" className="h-4 w-auto">
        <text x="30" y="14" fontSize="10" fontWeight="800" fill="#1A1F71" fontFamily="Arial, sans-serif" textAnchor="middle">VISA</text>
      </svg>
      <span className="text-[10px] font-semibold text-[#2C2419] uppercase tracking-wide hidden sm:inline">{name}</span>
    </div>
  );
}

function MastercardBadge({ name, description }: PaymentBadgeProps) {
  return (
    <div 
      className="group relative flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-[#E5E0D8] hover:shadow-md hover:border-[#a87441]/30 transition-all cursor-help"
      title={description || name}
    >
      <svg viewBox="0 0 60 20" className="h-5 w-auto">
        <circle cx="22" cy="10" r="7" fill="#EB001B"/>
        <circle cx="34" cy="10" r="7" fill="#F79E1B"/>
        <path d="M28 3a7 7 0 010 14 7 7 0 000-14z" fill="#FF5F00"/>
      </svg>
      <span className="text-[10px] font-semibold text-[#2C2419] uppercase tracking-wide hidden sm:inline">{name}</span>
    </div>
  );
}

function ApplePayBadge({ name, description }: PaymentBadgeProps) {
  return (
    <div 
      className="group relative flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-[#E5E0D8] hover:shadow-md hover:border-[#a87441]/30 transition-all cursor-help"
      title={description || name}
    >
      <svg viewBox="0 0 60 20" className="h-4 w-auto">
        <path d="M15 5c.6-.7 1-1.6.9-2.5-.8 0-1.9.5-2.5 1.3-.5.6-.9 1.5-.8 2.4.9.1 1.8-.4 2.4-1.2z" fill="#000"/>
        <path d="M15.9 6.2c-1.2-.1-2.3.7-2.9.7-1 0-1.8-.6-2.9-.6-1.3 0-2.5.7-3.1 1.8-1.3 2.3-.4 5.7.9 7.6.6.9 1.4 1.9 2.4 1.8 1 0 1.3-.6 2.5-.6 1.2 0 1.5.6 2.5.6 1 0 1.7-.9 2.4-1.9.7-1 1-1.9 1-2 .1-.1-1.9-.7-1.9-2.9 0-1.7 1.5-2.6 1.6-2.7-.9-1.2-2.1-1.4-2.5-1.8z" fill="#000" transform="scale(0.5) translate(12,2)"/>
        <text x="38" y="14" fontSize="9" fontWeight="600" fill="#000" fontFamily="Arial, sans-serif">Pay</text>
      </svg>
      <span className="text-[10px] font-semibold text-[#2C2419] uppercase tracking-wide hidden sm:inline">{name}</span>
    </div>
  );
}

function STCPayBadge({ name, description }: PaymentBadgeProps) {
  return (
    <div 
      className="group relative flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-[#E5E0D8] hover:shadow-md hover:border-[#a87441]/30 transition-all cursor-help"
      title={description || name}
    >
      <svg viewBox="0 0 60 20" className="h-5 w-auto">
        <text x="30" y="9" fontSize="6" fontWeight="800" fill="#4F008C" fontFamily="Arial, sans-serif" textAnchor="middle">STC</text>
        <text x="30" y="16" fontSize="5" fontWeight="600" fill="#4F008C" fontFamily="Arial, sans-serif" textAnchor="middle">pay</text>
      </svg>
      <span className="text-[10px] font-semibold text-[#2C2419] uppercase tracking-wide hidden sm:inline">{name}</span>
    </div>
  );
}

function TamaraBadge({ name, description }: PaymentBadgeProps) {
  return (
    <div 
      className="group relative flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-[#E5E0D8] hover:shadow-md hover:border-[#a87441]/30 transition-all cursor-help"
      title={description || name}
    >
      <svg viewBox="0 0 60 20" className="h-4 w-auto">
        <text x="28" y="13" fontSize="8" fontWeight="700" fill="#2B2D42" fontFamily="Arial, sans-serif" textAnchor="middle">tamara</text>
        <circle cx="50" cy="10" r="2.5" fill="#F5A623"/>
      </svg>
      <span className="text-[10px] font-semibold text-[#2C2419] uppercase tracking-wide hidden sm:inline">{name}</span>
    </div>
  );
}

function TabbyBadge({ name, description }: PaymentBadgeProps) {
  return (
    <div 
      className="group relative flex items-center gap-2 px-3 py-2 bg-[#D4FB54] rounded-lg shadow-sm hover:shadow-md transition-all cursor-help"
      title={description || name}
    >
      <svg viewBox="0 0 60 20" className="h-4 w-auto">
        <text x="30" y="13" fontSize="8" fontWeight="700" fill="#000000" fontFamily="Arial, sans-serif" textAnchor="middle">tabby</text>
      </svg>
      <span className="text-[10px] font-semibold text-[#000] uppercase tracking-wide hidden sm:inline">{name}</span>
    </div>
  );
}

export default function PaymentBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <MadaBadge name="Mada" description="Saudi Arabia's national payment network" />
      <VisaBadge name="Visa" description="Visa Credit & Debit Cards" />
      <MastercardBadge name="Mastercard" description="Mastercard Credit & Debit Cards" />
      <ApplePayBadge name="Apple Pay" description="Pay with Apple Pay" />
      <STCPayBadge name="STC Pay" description="STC Pay Digital Wallet" />
      <TamaraBadge name="Tamara" description="Buy Now, Pay Later with Tamara" />
      <TabbyBadge name="Tabby" description="Buy Now, Pay Later with Tabby" />
    </div>
  );
}
