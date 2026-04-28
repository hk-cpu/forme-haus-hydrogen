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

import {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Link} from '@remix-run/react';

import {useTranslation} from '~/hooks/useTranslation';

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
      {id: '1', title: 'Contact Us', url: '/contact', isExternal: false},
      {id: '2', title: 'FAQs', url: '/pages/faqs', isExternal: false},
      {
        id: '3',
        title: 'Shipping & Delivery Policy',
        url: '/policies/shipping-policy',
        isExternal: false,
      },
      {
        id: '4',
        title: 'Return & Exchange Policy',
        url: '/policies/refund-policy',
        isExternal: false,
      },
      {
        id: '5',
        title: 'Track Order',
        url: '/account/orders',
        isExternal: false,
      },
    ],
  },
  {
    id: 'about',
    title: 'Our Story',
    links: [
      {id: '6', title: 'Our Story', url: '/pages/about', isExternal: false},
      {
        id: '7',
        title: 'Privacy Policy',
        url: '/policies/privacy-policy',
        isExternal: false,
      },
      {
        id: '8',
        title: 'Terms & Conditions',
        url: '/policies/terms-of-service',
        isExternal: false,
      },
    ],
  },
  {
    id: 'legal',
    title: 'Legal',
    links: [
      {
        id: '9',
        title: 'Privacy Policy',
        url: '/policies/privacy-policy',
        isExternal: false,
      },
      {
        id: '10',
        title: 'Terms & Conditions',
        url: '/policies/terms-of-service',
        isExternal: false,
      },
      {
        id: '11',
        title: 'Return & Exchange Policy',
        url: '/policies/refund-policy',
        isExternal: false,
      },
    ],
  },
];

export function FooterAccordion() {
  const {isRTL} = useTranslation();
  const [openSections, setOpenSections] = useState<string[]>(['customer-care']);

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  return (
    <div
      className="w-full border-t border-[#a87441]/20"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Brand Story */}
      <div className="px-5 py-8 md:py-10 border-b border-[#a87441]/10 max-w-[720px] mx-auto text-center">
        <h3 className="text-[11px] uppercase tracking-[0.3em] text-[#a87441] font-medium mb-4">
          FORME HAUS
        </h3>
        <p className="text-[12px] leading-relaxed text-[#AA9B8F] font-light">
          FORME HAUS Collection is an Australian Tech Accessory brand owned, run
          and led by women. We create purposeful pieces for our everyday
          wardrobe — phone cases, phone straps, key chains, suction plates and
          screen protectors, helping you to always stay connected.
        </p>
        <p className="text-[11px] text-[#8B8076] mt-3">
          48 hour dispatch · International shipping · Free shipping on domestic
          orders over 250 SAR
        </p>
      </div>

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
              <span className="text-[11px] uppercase tracking-[0.25em] text-warm font-medium">
                {section.title}
              </span>
              <motion.span
                animate={{rotate: openSections.includes(section.id) ? 45 : 0}}
                transition={{duration: 0.2}}
                className="text-[#a87441] text-lg"
              >
                +
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {openSections.includes(section.id) && (
                <motion.div
                  initial={{height: 0, opacity: 0}}
                  animate={{height: 'auto', opacity: 1}}
                  exit={{height: 0, opacity: 0}}
                  transition={{duration: 0.3, ease: 'easeInOut'}}
                  className="overflow-hidden"
                >
                  <ul className="px-5 pb-5 space-y-3">
                    {section.links.map((link) => (
                      <li key={link.id}>
                        {link.isExternal ? (
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
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

      {/* Brand Attribution - Legal Protection */}
      <div className="border-t border-[#a87441]/10 py-6 px-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#a87441] font-semibold">
              LOUVE Collection
            </span>
            <span className="text-[10px] text-[#8B8076]">
              Premium Phone Accessories
            </span>
          </div>
          <p className="text-[10px] text-[#8B8076]/60 text-center md:text-right">
            © {new Date().getFullYear()} LOUVE Collection. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FooterAccordion;
