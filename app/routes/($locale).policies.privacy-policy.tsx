import {motion} from 'framer-motion';
import {type MetaFunction} from '@shopify/remix-oxygen';

import {routeHeaders} from '~/data/cache';
import {useTranslation} from '~/hooks/useTranslation';

export const headers = routeHeaders;

export const meta: MetaFunction = () => {
  return [{title: 'Privacy Policy | Formé Haus'}];
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

export default function PrivacyPolicyPage() {
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
            {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
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
              ? 'آخر تحديث: مايو 2025'
              : 'Last updated: May 2025'}
          </motion.p>
        </div>

        {/* ── Highlight Cards ── */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-12">
          <HighlightCard
            delay={0.15}
            label={isArabic ? 'بيانات محمية' : 'Data Protected'}
            sub={isArabic ? 'تشفير كامل' : 'Fully Encrypted'}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            }
          />
          <HighlightCard
            delay={0.2}
            label={isArabic ? 'حقوقك محفوظة' : 'Your Rights'}
            sub={isArabic ? 'وصول وتصحيح وحذف' : 'Access · Edit · Delete'}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            }
          />
          <HighlightCard
            delay={0.25}
            label={isArabic ? 'متوافق مع نظام PDPL' : 'PDPL Compliant'}
            sub={isArabic ? 'المملكة العربية السعودية' : 'Saudi Arabia'}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253" />
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
            ? 'في Formé Haus نحترم خصوصيتكم ونلتزم بحماية بياناتكم الشخصية وفقًا لأنظمة المملكة العربية السعودية، بما في ذلك نظام حماية البيانات الشخصية (PDPL).'
            : 'At Formé Haus, we respect your privacy and are committed to protecting your personal data in accordance with the laws of the Kingdom of Saudi Arabia, including the Saudi Personal Data Protection Law (PDPL).'}
        </motion.p>

        {/* ── Sections ── */}
        <div className="space-y-4">
          <SectionBlock
            delay={0}
            title={isArabic ? 'البيانات التي نجمعها' : 'Information We Collect'}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
              </svg>
            }
          >
            {isArabic ? (
              <ul className="space-y-1 list-none">
                {['الاسم الكامل', 'البريد الإلكتروني ورقم الهاتف', 'عنوان الشحن والفوترة', 'تفاصيل الدفع (تُعالج بشكل آمن)', 'سجل الطلبات', 'معلومات الجهاز مثل عنوان IP'].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-[#a87441] mt-1 flex-shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-1 list-none">
                {['Full name', 'Email address and phone number', 'Shipping and billing address', 'Payment details (processed securely)', 'Order history', 'Device information such as IP address'].map((item) => (
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
            title={isArabic ? 'كيفية استخدام البيانات' : 'How We Use Your Information'}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          >
            {isArabic ? (
              <ul className="space-y-1 list-none">
                {['معالجة الطلبات وتوصيلها', 'إدارة المدفوعات', 'تقديم خدمة العملاء', 'إرسال تحديثات الطلبات', 'تحسين الموقع والخدمات'].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-[#a87441] mt-1 flex-shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-1 list-none">
                {['Process and deliver orders', 'Manage payments securely', 'Provide customer support', 'Send order status updates', 'Improve our website and services'].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-[#a87441] mt-1 flex-shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </SectionBlock>

          <SectionBlock
            delay={0.1}
            title={isArabic ? 'حماية البيانات' : 'Data Protection'}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            }
          >
            <p>
              {isArabic
                ? 'نطبق تدابير تقنية وتنظيمية مناسبة لحماية بياناتكم الشخصية من الوصول غير المصرح به أو الإفصاح أو التعديل أو الإتلاف.'
                : 'We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, disclosure, alteration, or destruction. All payment data is processed through PCI-DSS compliant gateways.'}
            </p>
          </SectionBlock>

          <SectionBlock
            delay={0.15}
            title={isArabic ? 'حقوقكم' : 'Your Rights'}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
              </svg>
            }
          >
            {isArabic ? (
              <p>وفقًا للأنظمة المعمول بها، يحق لكم طلب الوصول إلى بياناتكم الشخصية أو تصحيحها أو حذفها في الحالات التي يسمح بها النظام.</p>
            ) : (
              <p>Under applicable regulations, you have the right to <strong className="text-brand-text font-medium">access</strong>, <strong className="text-brand-text font-medium">correct</strong>, or <strong className="text-brand-text font-medium">delete</strong> your personal data where permitted by law. To exercise these rights, contact us at the address below.</p>
            )}
          </SectionBlock>

          <SectionBlock
            delay={0.2}
            title={isArabic ? 'تحديثات السياسة' : 'Policy Updates'}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            }
          >
            <p>
              {isArabic
                ? 'قد تقوم Formé Haus بتحديث سياسة الخصوصية من وقت لآخر، وسيتم نشر أي تعديل على هذه الصفحة مع تحديث تاريخ "آخر تحديث".'
                : 'Formé Haus may update this Privacy Policy from time to time. Any changes will be published on this page with an updated "Last updated" date. Continued use of the site after changes constitutes acceptance.'}
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
            {isArabic ? 'تواصل معنا' : 'Privacy Inquiries'}
          </span>
          <p className="text-white/80 text-sm font-light mb-5">
            {isArabic
              ? 'لأي استفسارات تتعلق بسياسة الخصوصية أو بياناتكم الشخصية، يرجى التواصل معنا.'
              : 'For any questions about this Privacy Policy or your personal data, we\'re here to help.'}
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
