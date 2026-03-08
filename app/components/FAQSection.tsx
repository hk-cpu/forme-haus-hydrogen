import {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Link} from '@remix-run/react';
import {useTranslation} from '~/hooks/useTranslation';

interface FAQ {
  id: string;
  question: string;
  questionAr: string;
  answer: string;
  answerAr: string;
}

const FAQS: FAQ[] = [
  {
    id: '1',
    question: 'Do you offer international shipping?',
    questionAr: 'هل تقدمون الشحن الدولي؟',
    answer:
      'Currently, we ship within Saudi Arabia only. We are working on expanding to GCC countries soon. Stay tuned for updates!',
    answerAr:
      'حالياً، نقوم بالشحن داخل المملكة العربية السعودية فقط. نعمل على التوسع في دول الخليج قريباً. تابعنا للتحديثات!',
  },
  {
    id: '2',
    question: 'What iPhone models do you support?',
    questionAr: 'ما هي موديلات iPhone التي تدعمونها؟',
    answer:
      'We support iPhone 12 through iPhone 16 Pro Max, including Plus and Pro models. Each product page lists compatible models.',
    answerAr:
      'ندعم iPhone 12 حتى iPhone 16 Pro Max، بما في ذلك موديلات Plus و Pro. تدرج كل صفحة منتج الموديلات المتوافقة.',
  },
  {
    id: '3',
    question: 'How long does shipping take?',
    questionAr: 'كم تستغرق عملية الشحن؟',
    answer:
      'Orders within Riyadh are delivered within 1-2 business days. Other cities in Saudi Arabia take 2-5 business days depending on location.',
    answerAr:
      'يتم توصيل الطلبات داخل الرياض خلال 1-2 يوم عمل. المدن الأخرى في السعودية تستغرق 2-5 أيام عمل حسب الموقع.',
  },
  {
    id: '4',
    question: 'What is your return policy?',
    questionAr: 'ما هي سياسة الإرجاع لديكم؟',
    answer:
      'We accept returns within 14 days of delivery for unused items in original packaging. Contact our customer service to initiate a return.',
    answerAr:
      'نقبل الإرجاع خلال 14 يوماً من التوصيل للمنتجات غير المستخدمة في عبوتها الأصلية. تواصل مع خدمة العملاء لبدء عملية الإرجاع.',
  },
  {
    id: '5',
    question: 'Are your phone cases protective?',
    questionAr: 'هل حافظات الهاتف لديكم واقية؟',
    answer:
      'Yes! Our cases feature raised edges to protect the screen and camera, shock-absorbing materials, and precise cutouts for full functionality.',
    answerAr:
      'نعم! تتميز حافظاتنا بحواف مرتفعة لحماية الشاشة والكاميرا، ومواد ماصة للصدمات، وفتحات دقيقة للوظائف الكاملة.',
  },
  {
    id: '6',
    question: 'Do you offer wholesale or bulk orders?',
    questionAr: 'هل تقدمون طلبات الجملة أو الكميات الكبيرة؟',
    answer:
      'Yes, we offer special pricing for bulk orders and corporate gifting. Contact us at wholesale@formehaus.me for more information.',
    answerAr:
      'نعم، نقدم أسعاراً خاصة للطلبات بالجملة والهدايا التسويقية. تواصل معنا على wholesale@formehaus.me للمزيد من المعلومات.',
  },
];

// Chevron icon that rotates
const ChevronIcon = ({isOpen}: {isOpen: boolean}) => (
  <motion.svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    animate={{rotate: isOpen ? 180 : 0}}
    transition={{duration: 0.3, ease: 'easeInOut'}}
  >
    <polyline points="6 9 12 15 18 9" />
  </motion.svg>
);

// Single FAQ item
function FAQItem({
  faq,
  isOpen,
  onToggle,
  isRTL,
}: {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
  isRTL: boolean;
}) {
  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true}}
      transition={{duration: 0.4}}
      className="border-b border-[#8B8076]/10 last:border-b-0"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-sm md:text-base text-[#4A3C31] font-medium pr-4 group-hover:text-[#a87441] transition-colors duration-300">
          {isRTL ? faq.questionAr : faq.question}
        </span>
        <span
          className={`flex-shrink-0 text-[#8B8076] group-hover:text-[#a87441] transition-colors duration-300 ${
            isRTL ? 'ml-0 mr-4' : 'ml-4'
          }`}
        >
          <ChevronIcon isOpen={isOpen} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{height: 0, opacity: 0}}
            animate={{height: 'auto', opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.3, ease: 'easeInOut'}}
            className="overflow-hidden"
          >
            <motion.p
              initial={{y: -10}}
              animate={{y: 0}}
              exit={{y: -10}}
              className="pb-5 text-sm text-[#8B8076] leading-relaxed"
            >
              {isRTL ? faq.answerAr : faq.answer}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQSection() {
  const {isRTL, t} = useTranslation();
  const [openId, setOpenId] = useState<string | null>('1'); // First one open by default

  const handleToggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-12 md:py-16" dir={isRTL ? 'rtl' : 'ltr'}>
      <div
        className="max-w-[1200px] mx-auto"
        style={{padding: '0 var(--page-gutter)'}}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left: Header */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.6}}
            className="lg:col-span-4"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#4A3C31] mb-4">
              {isRTL ? 'الأسئلة الشائعة' : t('faq.title', 'FAQs')}
            </h2>
            <p className="text-sm text-[#8B8076] mb-6 leading-relaxed">
              {isRTL
                ? 'إليك الإجابات على الأسئلة الأكثر شيوعاً. إذا كنت بحاجة إلى مزيد من المساعدة، فلا تتردد في التواصل معنا.'
                : t(
                    'faq.subtitle',
                    'Here are answers to our most common questions. If you need further help, feel free to reach out.',
                  )}
            </p>

            {/* Contact CTA */}
            <div className="hidden lg:block">
              <p className="text-xs text-[#8B8076] uppercase tracking-wider mb-3">
                {isRTL
                  ? 'ما زلت لديك سؤال؟'
                  : t('faq.stillHaveQuestions', 'Still have questions?')}
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-sm text-[#a87441] hover:text-[#8B5E3C] transition-colors group"
              >
                <span>
                  {isRTL ? 'تواصل معنا' : t('faq.contactUs', 'Contact Us')}
                </span>
                <motion.svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`${isRTL ? 'rotate-180' : ''}`}
                  whileHover={{x: isRTL ? -4 : 4}}
                >
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </Link>
            </div>
          </motion.div>

          {/* Right: FAQ List */}
          <div className="lg:col-span-8">
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-2">
              {FAQS.map((faq) => (
                <FAQItem
                  key={faq.id}
                  faq={faq}
                  isOpen={openId === faq.id}
                  onToggle={() => handleToggle(faq.id)}
                  isRTL={isRTL}
                />
              ))}
            </div>

            {/* Mobile Contact CTA */}
            <div className="lg:hidden mt-6 text-center">
              <p className="text-xs text-[#8B8076] uppercase tracking-wider mb-2">
                {isRTL
                  ? 'ما زلت لديك سؤال؟'
                  : t('faq.stillHaveQuestions', 'Still have questions?')}
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-sm text-[#a87441] hover:text-[#8B5E3C] transition-colors"
              >
                <span>
                  {isRTL ? 'تواصل معنا' : t('faq.contactUs', 'Contact Us')}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={isRTL ? 'rotate-180' : ''}
                >
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
