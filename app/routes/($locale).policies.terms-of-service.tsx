import {motion} from 'framer-motion';
import {type MetaFunction} from '@shopify/remix-oxygen';

import {routeHeaders} from '~/data/cache';
import {useTranslation} from '~/hooks/useTranslation';

export const headers = routeHeaders;

export const meta: MetaFunction = () => {
  return [{title: 'Terms & Conditions | Formé Haus'}];
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

export default function TermsOfServicePage() {
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
            {isArabic ? 'الشروط والأحكام' : 'Terms & Conditions'}
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
            {isArabic ? 'آخر تحديث: مايو 2025' : 'Last updated: May 2025'}
          </motion.p>
        </div>

        {/* ── Highlight Cards ── */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-12">
          {[
            {
              delay: 0.15,
              label: isArabic ? 'استخدام مشروع' : 'Lawful Use',
              sub: isArabic ? 'للأغراض القانونية فقط' : 'Legal purposes only',
              icon: (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
            {
              delay: 0.2,
              label: isArabic ? 'ملكية فكرية محمية' : 'IP Protected',
              sub: isArabic ? 'جميع الحقوق محفوظة' : 'All rights reserved',
              icon: (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
            },
            {
              delay: 0.25,
              label: isArabic ? 'القانون السعودي' : 'KSA Law Governs',
              sub: isArabic ? 'المملكة العربية السعودية' : 'Saudi Arabia',
              icon: (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-13.5 0l-2.62 10.726c-.122.499.106 1.028.589 1.202a5.989 5.989 0 002.031.352 5.989 5.989 0 002.031-.352c.483-.174.711-.703.59-1.202L5.25 4.97z" />
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
            ? 'مرحبًا بكم في Formé Haus. باستخدامكم لهذا الموقع فإنكم توافقون على الالتزام بالشروط والأحكام التالية.'
            : 'Welcome to Formé Haus. By accessing or using our website, you agree to the following Terms & Conditions. Please read them carefully.'}
        </motion.p>

        {/* ── Sections ── */}
        <div className="space-y-4">
          <SectionBlock
            delay={0}
            title={isArabic ? 'استخدام الموقع' : 'Use of the Website'}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
              </svg>
            }
          >
            <p>
              {isArabic
                ? 'يجب استخدام الموقع لأغراض مشروعة فقط وبما لا يؤثر على تشغيل الموقع أو ينتهك حقوق الآخرين.'
                : 'You agree to use this website only for lawful purposes and in a manner that does not interfere with its operation or violate the rights of others. Unauthorized use of any content or data is strictly prohibited.'}
            </p>
          </SectionBlock>

          <SectionBlock
            delay={0.05}
            title={isArabic ? 'معلومات المنتجات' : 'Product Information'}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
            }
          >
            <p>
              {isArabic
                ? 'نسعى إلى عرض معلومات دقيقة عن المنتجات بما في ذلك الوصف والصور والأسعار، ومع ذلك قد تحدث بعض الاختلافات البسيطة. تحتفظ Formé Haus بالحق في تصحيح الأخطاء أو تحديث المعلومات دون إشعار مسبق.'
                : 'We strive to ensure that product descriptions, images, and pricing are accurate. However, minor variations may occur. Formé Haus reserves the right to correct errors or update product information without prior notice.'}
            </p>
          </SectionBlock>

          <SectionBlock
            delay={0.1}
            title={isArabic ? 'الطلبات' : 'Orders'}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            }
          >
            <p>
              {isArabic
                ? 'تخضع جميع الطلبات لتوفر المنتجات وموافقة Formé Haus. ونحتفظ بالحق في رفض أو إلغاء أي طلب في حال حدوث خطأ في التسعير أو عدم توفر المنتج أو الاشتباه في وجود نشاط احتيالي.'
                : 'All orders are subject to product availability and acceptance by Formé Haus. We reserve the right to refuse or cancel any order if a pricing error occurs, if a product becomes unavailable, or if fraudulent activity is suspected.'}
            </p>
          </SectionBlock>

          <SectionBlock
            delay={0.15}
            title={isArabic ? 'الملكية الفكرية' : 'Intellectual Property'}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
            }
          >
            <p>
              {isArabic
                ? 'جميع المحتويات المعروضة على هذا الموقع، بما في ذلك النصوص والصور والشعارات والتصاميم، هي ملك لـ Formé Haus أو للجهات المالكة لها، ولا يجوز نسخها أو إعادة إنتاجها أو استخدامها دون إذن خطي مسبق.'
                : 'All content on this website — including text, images, graphics, logos, and design elements — is the property of Formé Haus or its respective partners and may not be copied, reproduced, or used without prior written permission.'}
            </p>
          </SectionBlock>

          <SectionBlock
            delay={0.2}
            title={isArabic ? 'تحديد المسؤولية' : 'Limitation of Liability'}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            }
          >
            <p>
              {isArabic
                ? 'لا تتحمل Formé Haus المسؤولية عن أي أضرار غير مباشرة أو تبعية قد تنتج عن استخدام الموقع، وذلك في الحدود التي يسمح بها النظام.'
                : 'Formé Haus shall not be liable for any indirect or consequential damages arising from the use of this website to the extent permitted by applicable law.'}
            </p>
          </SectionBlock>

          <SectionBlock
            delay={0.25}
            title={isArabic ? 'القانون المعمول به' : 'Governing Law'}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-13.5 0l-2.62 10.726c-.122.499.106 1.028.589 1.202a5.989 5.989 0 002.031.352 5.989 5.989 0 002.031-.352c.483-.174.711-.703.59-1.202L5.25 4.97z" />
              </svg>
            }
          >
            <p>
              {isArabic
                ? 'تخضع هذه الشروط والأحكام لأنظمة وقوانين المملكة العربية السعودية.'
                : 'These Terms & Conditions are governed by the laws and regulations of the Kingdom of Saudi Arabia. Any disputes shall be subject to the jurisdiction of the competent courts in the Kingdom.'}
            </p>
          </SectionBlock>
        </div>

        {/* ── Contact CTA ── */}
        <motion.div
          initial={{opacity: 0, y: 24}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6, delay: 0.1, ease: EASE}}
          className="mt-10 p-6 md:p-8 bg-[#4A3C31] rounded-xl text-center"
        >
          <span className="block text-[10px] uppercase tracking-[0.3em] text-[#D4AF87] mb-3">
            {isArabic ? 'لديك سؤال؟' : 'Have a Question?'}
          </span>
          <p className="text-white/80 text-sm font-light mb-5">
            {isArabic
              ? 'إذا كان لديك أي استفسار حول شروطنا وأحكامنا، يسعدنا المساعدة.'
              : 'If you have any questions about these Terms & Conditions, we\'re happy to help.'}
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
