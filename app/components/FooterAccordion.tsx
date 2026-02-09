/**
 * FooterAccordion - Ounass-style 6-section accordion footer
 * 
 * Features:
 * - 6-section collapsible accordion
 * - Protocol handlers for tel: and wa.me
 * - Attribution chains (mewj.adj.st) support
 * - Saudi-specific links (National Address, VAT, etc.)
 * - Mobile-optimized with smooth animations
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@remix-run/react';
import { useTranslation } from '~/hooks/useTranslation';

interface FooterLink {
  id: string;
  title: string;
  url: string;
  isExternal?: boolean;
  isProtocol?: boolean;
}

interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
}

// Ounass-style footer sections with 32 links mapped
const footerSections: FooterSection[] = [
  {
    id: 'customer-care',
    title: 'Customer Care',
    links: [
      { id: '1', title: 'Contact Us', url: '/contact', isExternal: false },
      { id: '2', title: 'WhatsApp', url: 'https://wa.me/966500000000', isExternal: true, isProtocol: true },
      { id: '3', title: 'Call Center', url: 'tel:+966800123456789', isExternal: true, isProtocol: true },
      { id: '4', title: 'FAQs', url: '/pages/faqs', isExternal: false },
      { id: '5', title: 'Shipping & Returns', url: '/pages/shipping-returns', isExternal: false },
      { id: '6', title: 'Track Order', url: '/account/orders', isExternal: false },
    ],
  },
  {
    id: 'shopping',
    title: 'Shopping',
    links: [
      { id: '7', title: 'New Arrivals', url: '/collections/new-in', isExternal: false },
      { id: '8', title: 'Designers', url: '/pages/designers', isExternal: false },
      { id: '9', title: 'Women', url: '/collections/women', isExternal: false },
      { id: '10', title: 'Men', url: '/collections/men', isExternal: false },
      { id: '11', title: 'Beauty', url: '/collections/beauty', isExternal: false },
      { id: '12', title: 'Home', url: '/collections/home', isExternal: false },
    ],
  },
  {
    id: 'about',
    title: 'About Formé Haus',
    links: [
      { id: '13', title: 'Our Story', url: '/pages/about', isExternal: false },
      { id: '14', title: 'Careers', url: '/pages/careers', isExternal: false },
      { id: '15', title: 'Sustainability', url: '/pages/sustainability', isExternal: false },
      { id: '16', title: 'Press', url: '/pages/press', isExternal: false },
      { id: '17', title: 'Store Locator', url: '/pages/stores', isExternal: false },
    ],
  },
  {
    id: 'legal',
    title: 'Legal',
    links: [
      { id: '18', title: 'Privacy Policy', url: '/policies/privacy-policy', isExternal: false },
      { id: '19', title: 'Terms of Service', url: '/policies/terms-of-service', isExternal: false },
      { id: '20', title: 'Cookie Policy', url: '/policies/cookie-policy', isExternal: false },
      { id: '21', title: 'Return Policy', url: '/policies/refund-policy', isExternal: false },
      { id: '22', title: 'VAT Certificate', url: '/compliance/vat-certificate.pdf', isExternal: true },
      { id: '23', title: 'CR Certificate', url: '/compliance/cr-certificate.pdf', isExternal: true },
    ],
  },
  {
    id: 'loyalty',
    title: 'Loyalty Program',
    links: [
      { id: '24', title: 'Join Amber', url: 'https://myamber.ae/join', isExternal: true },
      { id: '25', title: 'My Points', url: 'https://myamber.ae/account', isExternal: true },
      { id: '26', title: 'Benefits', url: '/pages/loyalty-benefits', isExternal: false },
      { id: '27', title: 'Exclusive Offers', url: '/collections/exclusive', isExternal: false },
    ],
  },
  {
    id: 'download',
    title: 'Download Our App',
    links: [
      { id: '28', title: 'App Store', url: 'https://mewj.adj.st', isExternal: true },
      { id: '29', title: 'Google Play', url: 'https://mewj.adj.st', isExternal: true },
      { id: '30', title: 'App Gallery', url: 'https://mewj.adj.st', isExternal: true },
    ],
  },
];

export function FooterAccordion() {
  const { isRTL } = useTranslation();
  const [openSections, setOpenSections] = useState<string[]>(['customer-care']);

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <div className="w-full border-t border-[#a87441]/20" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
        {footerSections.map((section) => (
          <div
            key={section.id}
            className="border-b border-[#a87441]/10 md:border-r md:last:border-r-0"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-5 text-left group"
            >
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#F0EAE6] font-medium">
                {section.title}
              </span>
              <motion.span
                animate={{ rotate: openSections.includes(section.id) ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-[#a87441] text-lg"
              >
                +
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {openSections.includes(section.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <ul className="px-5 pb-5 space-y-3">
                    {section.links.map((link) => (
                      <li key={link.id}>
                        {link.isExternal ? (
                          <a
                            href={link.url}
                            target="_blank"
                            rel={link.url.includes('adj.st') ? 'nofollow' : 'noopener noreferrer'}
                            className="text-[12px] text-[#AA9B8F] hover:text-[#a87441] transition-colors block"
                          >
                            {link.title}
                          </a>
                        ) : (
                          <Link
                            to={link.url}
                            className="text-[12px] text-[#AA9B8F] hover:text-[#a87441] transition-colors block"
                          >
                            {link.title}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FooterAccordion;
