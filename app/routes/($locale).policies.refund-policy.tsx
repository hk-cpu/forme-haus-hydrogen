import {motion} from 'framer-motion';
import {type MetaFunction} from '@shopify/remix-oxygen';

import {routeHeaders} from '~/data/cache';
import {useTranslation} from '~/hooks/useTranslation';

export const headers = routeHeaders;

export const meta: MetaFunction = () => {
  return [{title: 'Returns & Exchanges | Formé Haus'}];
};

const EASE = [0.16, 1, 0.3, 1] as const;

function SectionBlock({
  icon,
  title,
  children,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{opacity: 0, y: 24}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-40px'}}
      transition={{duration: 0.6, delay, ease: EASE}}
      className="flex gap-5 p-6 md:p-8 bg-white rounded-xl border border-[#EDE8E3] shadow-sm"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#F5F0EA] flex items-center justify-center text-[#a87441]">
        {icon}
      </div>
      <div>
        <h3 className="font-serif text-lg text-brand-text mb-2">{title}</h3>
        <div className="text-[14px] text-brand-text/70 leading-relaxed font-light space-y-2">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

function HighlightCard({
  icon,
  label,
  sub,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.5, delay, ease: EASE}}
      className="flex flex-col items-center text-center p-5 bg-white rounded-xl border border-[#EDE8E3] shadow-sm gap-2"
    >
      <div className="w-10 h-10 rounded-full bg-[#F5F0EA] flex items-center justify-center text-[#a87441] mb-1">
        {icon}
      </div>
      <span className="font-serif text-base text-brand-text leading-tight">{label}</span>
      <span className="text-[11px] uppercase tracking-[0.12em] text-[#a87441]">{sub}</span>
    </motion.div>
  );
}

export default function RefundPolicyPage() {
  const {lang} = useTranslation();
  const isArabic = lang === 'AR';

  return (
    <div className="min-h-screen bg-[#F9F5F0]" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="pt-28 pb-24 container mx-auto px-6 md:px-12 max-w-3xl">

        {/* ── Header ── */}
        <div className="mb-12 text-center">
          <motion.span
            className="block text-[10px] uppercase tracking-[0.35em] text-[#a87441] mb-4"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.6}}
          >
            {isArabic ? 'السياسات' : 'Policies'}
          </motion.span>
          <motion.h1
            className="font-serif text-3xl md:text-4xl text-brand-text tracking-wide"
            initial={{opacity: 0, y: 16}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.7, delay: 0.1, ease: EASE}}
          >
            {isArabic ? 'الاسترجاع والاستبدال' : 'Returns & Exchanges'}
          </motion.h1>
          <motion.div
            className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-[#a87441]/50 to-transparent"
            initial={{scaleX: 0}}
            animate={{scaleX: 1}}
            transition={{duration: 0.8, delay: 0.3}}
          />
          <motion.p
            className="mt-5 text-sm text-brand-text/60 font-light"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.6, delay: 0.4}}
          >
            {isArabic
              ? 'رضاكم هو أولويتنا'
              : 'Your satisfaction is our priority'}
          </motion.p>
        </div>

        {/* ── Highlight Cards ── */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-12">
          <HighlightCard
            delay={0.15}
            label={isArabic ? '٧ أيام' : '7-Day Window'}
            sub={isArabic ? 'من تاريخ الاستلام' : 'From delivery'}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            }
          />
          <HighlightCard
            delay={0.2}
            label={isArabic ? 'شحن مجاني' : 'Free Return'}
            sub={isArabic ? 'للمنتجات التالفة' : 'Damaged items only'}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            }
          />
          <HighlightCard
            delay={0.25}
            label={isArabic ? '١٤ يومًا' : '14-Day Refund'}
            sub={isArabic ? 'بعد الفحص والموافقة' : 'After inspection'}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
            }
          />
        </div>

        {/* ── Intro ── */}
        <motion.p
          className="text-[14px] text-brand-text/70 leading-relaxed font-light mb-10 pb-8 border-b border-[#EDE8E3]"
          initial={{opacity: 0, y: 16}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6, ease: EASE}}
        >
          {isArabic
            ? 'في Formé Haus نسعى لضمان رضاكم عن مشترياتكم. وفقًا لنظام التجارة الإلكترونية في المملكة العربية السعودية، يحق للعميل طلب الاسترجاع أو الاستبدال خلال 7 أيام من تاريخ الاستلام.'
            : 'At Formé Haus, we strive to ensure you are fully satisfied with your purchase. Customers may request a return or exchange within 7 days of receiving their order in accordance with Saudi E-Commerce Law.'}
        </motion.p>

        {/* ── Sections ── */}
        <div className="space-y-4">
          <SectionBlock
            delay={0}
            title={isArabic ? 'شروط قبول الطلب' : 'Eligibility Requirements'}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          >
            {isArabic ? (
              <ul className="space-y-1 list-none">
                {[
                  'أن يكون المنتج غير مستخدم وفي حالته الأصلية',
                  'إرجاعه مع جميع التغليفات والبطاقات والمرفقات الأصلية',
                  'تقديم إثبات الشراء',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-[#a87441] mt-1 flex-shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-1 list-none">
                {[
                  'Item must be unused, unworn, and in its original condition',
                  'All original packaging, tags, and accessories must be included',
                  'Proof of purchase must be provided',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-[#a87441] mt-1 flex-shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </SectionBlock>

          <SectionBlock
            delay={0.05}
            title={isArabic ? 'المنتجات غير القابلة للاسترجاع' : 'Non-Returnable Items'}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            }
          >
            <p>
              {isArabic
                ? 'لأسباب تتعلق بالنظافة وسلامة المنتج، لا يمكن استرجاع النظارات الشمسية أو أغطية الجوال أو الأشرطة أو الإكسسوارات بعد فتحها أو استخدامها.'
                : 'For hygiene and product integrity reasons, returns are not accepted for sunglasses, phone cases, straps, or accessories once opened or used.'}
            </p>
          </SectionBlock>

          <SectionBlock
            delay={0.1}
            title={isArabic ? 'المنتجات التالفة أو الخاطئة' : 'Damaged or Incorrect Items'}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            }
          >
            <p>
              {isArabic
                ? 'في حال استلام منتج تالف أو مختلف عن الطلب، يرجى التواصل خلال 48 ساعة من الاستلام وسيتم ترتيب الاسترجاع دون رسوم إضافية.'
                : 'If you receive a damaged, defective, or incorrect item, please contact us within 48 hours of delivery. Return shipping will be arranged at no cost in such cases.'}
            </p>
          </SectionBlock>

          <SectionBlock
            delay={0.15}
            title={isArabic ? 'الشحن والاسترداد' : 'Shipping & Refunds'}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
            }
          >
            {isArabic ? (
              <ul className="space-y-1 list-none">
                {[
                  'رسوم الشحن الأصلية غير قابلة للاسترداد في حال تغيير الرأي',
                  'تخضع المنتجات المرتجعة للفحص عند الاستلام',
                  'يتم رد المبلغ إلى وسيلة الدفع الأصلية خلال 14 يومًا بعد فحص المنتج',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-[#a87441] mt-1 flex-shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-1 list-none">
                {[
                  'Original shipping fees are non-refundable for change-of-mind returns',
                  'Returned items are subject to inspection upon receipt',
                  'Approved refunds are issued to the original payment method within 14 days',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-[#a87441] mt-1 flex-shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </SectionBlock>
        </div>

        {/* ── How to Return — 3-step flow ── */}
        <motion.div
          initial={{opacity: 0, y: 24}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6, delay: 0.1, ease: EASE}}
          className="mt-8 p-6 md:p-8 bg-white rounded-xl border border-[#EDE8E3] shadow-sm"
        >
          <h3 className="font-serif text-lg text-brand-text mb-6 text-center">
            {isArabic ? 'كيفية طلب الاسترجاع' : 'How to Request a Return'}
          </h3>
          <div className="grid grid-cols-3 gap-4 relative">
            {/* Connecting line */}
            <div className="absolute top-5 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-[#a87441]/30 via-[#a87441]/50 to-[#a87441]/30 hidden md:block" />
            {[
              {
                num: '01',
                en: 'Contact Us',
                ar: 'تواصل معنا',
                descEn: 'Email us with your order number within 7 days',
                descAr: 'راسلنا برقم طلبك خلال 7 أيام',
              },
              {
                num: '02',
                en: 'Ship It Back',
                ar: 'أرسل المنتج',
                descEn: 'We\'ll confirm eligibility and share return instructions',
                descAr: 'نؤكد الأهلية ونرسل تعليمات الإرجاع',
              },
              {
                num: '03',
                en: 'Get Refunded',
                ar: 'استرداد المبلغ',
                descEn: 'Refund issued within 14 days of inspection',
                descAr: 'الاسترداد خلال 14 يومًا من الفحص',
              },
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center gap-2 relative">
                <div className="w-10 h-10 rounded-full bg-[#a87441] text-white flex items-center justify-center text-[11px] tracking-[0.05em] font-medium z-10">
                  {step.num}
                </div>
                <span className="font-serif text-sm text-brand-text">{isArabic ? step.ar : step.en}</span>
                <span className="text-[12px] text-brand-text/60 font-light leading-snug">{isArabic ? step.descAr : step.descEn}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Contact CTA ── */}
        <motion.div
          initial={{opacity: 0, y: 24}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6, delay: 0.1, ease: EASE}}
          className="mt-6 p-6 md:p-8 bg-[#4A3C31] rounded-xl text-center"
        >
          <span className="block text-[10px] uppercase tracking-[0.3em] text-[#D4AF87] mb-3">
            {isArabic ? 'ابدأ عملية الإرجاع' : 'Start a Return'}
          </span>
          <p className="text-white/80 text-sm font-light mb-5">
            {isArabic
              ? 'أرسل لنا رقم طلبك وسنرشدك خلال العملية.'
              : 'Send us your order number and we\'ll guide you through the process.'}
          </p>
          <a
            href="mailto:support@formehaus.me"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#a87441] text-white text-[11px] uppercase tracking-[0.15em] rounded-full hover:bg-[#8B5E34] transition-colors duration-300"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            support@formehaus.me
          </a>
        </motion.div>

      </div>
    </div>
  );
}
