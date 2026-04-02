import {motion} from 'framer-motion';
import {useTranslation} from '~/hooks/useTranslation';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'The attention to detail is unmatched. My phone case feels like a piece of jewelry.',
    author: 'Nora A.',
    role: 'Riyadh',
  },
  {
    quote:
      'Finally, a local brand that understands luxury and Saudi taste. The sunglasses are stunning.',
    author: 'Layan M.',
    role: 'Jeddah',
  },
  {
    quote:
      'Fast delivery, beautiful packaging, and exceptional quality. Formé Haus exceeded every expectation.',
    author: 'Reem S.',
    role: 'Dammam',
  },
];

const TESTIMONIALS_AR: Testimonial[] = [
  {
    quote: 'الاهتمام بالتفاصيل لا مثيل له. كفر جوالي يشعرني وكأنه قطعة مجوهرات.',
    author: 'نورة ع.',
    role: 'الرياض',
  },
  {
    quote:
      'أخيراً علامة محلية تفهم الفخامة والذوق السعودي. النظارات الشمسية رائعة.',
    author: 'ليان م.',
    role: 'جدة',
  },
  {
    quote:
      'توصيل سريع، تغليف جميل، وجودة استثنائية. Formé Haus فاقت كل توقعاتي.',
    author: 'ريم س.',
    role: 'الدمام',
  },
];

export default function TestimonialsSection() {
  const {isRTL, lang, t} = useTranslation();
  const items = lang === 'AR' ? TESTIMONIALS_AR : TESTIMONIALS;

  return (
    <section
      aria-label="Testimonials"
      className="py-6 md:py-8"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        className="mx-auto max-w-[var(--container-max)] lg:max-w-5xl xl:max-w-6xl"
        style={{padding: '0 var(--page-gutter)'}}
      >
        <motion.div
          initial={{opacity: 0, y: 16}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.5, ease: [0.25, 0.1, 0.25, 1]}}
          className="text-center mb-8"
        >
          <h2 className="font-serif text-2xl md:text-3xl italic text-[#4A3C31]">
            {t('testimonials.title')}
          </h2>
          <p className="text-sm text-[#8B8076] mt-2">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {items.map((item, index) => (
            <motion.div
              key={item.author}
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, margin: '-50px'}}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#8B8076]/10 shadow-sm"
            >
              <p className="text-[15px] leading-relaxed text-[#4A3C31] mb-6">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a87441] to-[#8B5E3C] flex items-center justify-center text-white text-sm font-medium">
                  {item.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#4A3C31]">
                    {item.author}
                  </p>
                  <p className="text-xs text-[#8B8076]">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
