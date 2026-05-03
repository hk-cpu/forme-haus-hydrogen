import {motion} from 'framer-motion';
import {type MetaFunction} from '@shopify/remix-oxygen';

import {routeHeaders} from '~/data/cache';
import {useTranslation} from '~/hooks/useTranslation';

export const headers = routeHeaders;

export const meta: MetaFunction = () => {
  return [{title: 'Shipping Policy | Formé Haus'}];
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

export default function ShippingPolicyPage() {
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
            {isArabic ? 'سياسة الشحن والتوصيل' : 'Shipping & Delivery'}
          </motion.h1>
          <motion.div
            className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-[#a87441]/50 to-transparent"
            initial={{scaleX: 0}}
            animate={{scaleX: 1}}
            transition={{duration: 0.8, delay: 0.3}}
          />
        </div>

        {/* ── Highlight Cards ── */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-12">
          {[
            {
              delay: 0.15,
              label: isArabic ? '١–٣ أيام عمل' : '1–3 Day Processing',
              sub: isArabic ? 'تجهيز الطلب' : 'Order processing',
              icon: (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
            {
              delay: 0.2,
              label: isArabic ? '٢–٥ أيام' : '2–5 Days',
              sub: isArabic ? 'داخل المملكة' : 'Inside KSA',
              icon: (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              ),
            },
            {
              delay: 0.25,
              label: isArabic ? '٣–٧ أيام' : '3–7 Days',
              sub: isArabic ? 'دول مجلس التعاون' : 'GCC Countries',
              icon: (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253" />
                </svg>
              ),
            },
          ].map(({delay, label, sub, icon}) => (
            <motion.div
              key={label}
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
          ))}
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
            ? 'يتم تجهيز الطلبات خلال 1–3 أيام عمل بعد تأكيد الطلب. يتم احتساب رسوم الشحن عند إتمام الطلب بناءً على عنوان التوصيل.'
            : 'Orders are processed within 1–3 business days after confirmation. Shipping fees are calculated at checkout based on the delivery location.'}
        </motion.p>

        {/* ── Delivery Timeline Table ── */}
        <motion.div
          initial={{opacity: 0, y: 24}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6, ease: EASE}}
          className="mb-6 bg-white rounded-xl border border-[#EDE8E3] shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 bg-[#F5F0EA] border-b border-[#EDE8E3]">
            <h3 className="font-serif text-base text-brand-text">
              {isArabic ? 'مدد التوصيل التقديرية' : 'Estimated Delivery Times'}
            </h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#EDE8E3]">
                <th className="text-start px-6 py-3 text-[11px] uppercase tracking-[0.12em] text-[#a87441] font-medium">
                  {isArabic ? 'المنطقة' : 'Region'}
                </th>
                <th className="text-start px-6 py-3 text-[11px] uppercase tracking-[0.12em] text-[#a87441] font-medium">
                  {isArabic ? 'مدة التوصيل' : 'Delivery Time'}
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {region: isArabic ? 'المملكة العربية السعودية' : 'Saudi Arabia', time: isArabic ? '٢–٥ أيام عمل' : '2–5 business days'},
                {region: isArabic ? 'دول مجلس التعاون الخليجي' : 'GCC Countries', time: isArabic ? '٣–٧ أيام عمل' : '3–7 business days'},
              ].map((row, i) => (
                <tr key={row.region} className={i < 1 ? 'border-b border-[#EDE8E3]' : ''}>
                  <td className="px-6 py-4 text-brand-text font-light text-[14px]">{row.region}</td>
                  <td className="px-6 py-4 text-brand-text/70 font-light text-[14px]">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* ── Additional sections ── */}
        <div className="space-y-4">
          <SectionBlock
            delay={0.05}
            title={isArabic ? 'رسوم الشحن' : 'Shipping Fees'}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
            }
          >
            <p>
              {isArabic
                ? 'يتم احتساب رسوم الشحن تلقائيًا عند إتمام الطلب بناءً على عنوان التوصيل والوزن الإجمالي للطلب.'
                : 'Shipping fees are automatically calculated at checkout based on the delivery address and total order weight.'}
            </p>
          </SectionBlock>

          <SectionBlock
            delay={0.1}
            title={isArabic ? 'الطلبات الدولية والرسوم الجمركية' : 'International Orders & Customs'}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582" />
              </svg>
            }
          >
            <p>
              {isArabic
                ? 'بالنسبة للطلبات التي يتم شحنها خارج المملكة العربية السعودية، يتحمل العميل كامل الرسوم الجمركية وأي ضرائب أو رسوم إضافية متعلقة بالاستيراد.'
                : 'For orders shipped outside Saudi Arabia, all applicable customs duties, import taxes, and additional charges are the responsibility of the customer.'}
            </p>
          </SectionBlock>
        </div>

        {/* ── Contact CTA ── */}
        <motion.div
          initial={{opacity: 0, y: 24}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6, delay: 0.1, ease: EASE}}
          className="mt-8 p-6 md:p-8 bg-[#4A3C31] rounded-xl text-center"
        >
          <span className="block text-[10px] uppercase tracking-[0.3em] text-[#D4AF87] mb-3">
            {isArabic ? 'تتبع طلبك' : 'Track Your Order'}
          </span>
          <p className="text-white/80 text-sm font-light mb-5">
            {isArabic
              ? 'للاستفسار عن حالة طلبك أو أي سؤال يتعلق بالشحن، تواصل معنا.'
              : 'For order status inquiries or any shipping-related questions, get in touch.'}
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
