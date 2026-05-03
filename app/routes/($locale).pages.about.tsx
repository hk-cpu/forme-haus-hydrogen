import {type MetaFunction} from '@shopify/remix-oxygen';
import {motion, useInView} from 'framer-motion';
import {useRef} from 'react';

import {routeHeaders} from '~/data/cache';
import {useTranslation} from '~/hooks/useTranslation';

export const headers = routeHeaders;

export const meta: MetaFunction = () => {
  return [{title: 'Our Story | Formé Haus'}];
};

const EASE = [0.16, 1, 0.3, 1] as const;

function FadeInSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {once: true, margin: '-60px'});
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{opacity: 0, y: 30}}
      animate={isInView ? {opacity: 1, y: 0} : {opacity: 0, y: 30}}
      transition={{duration: 0.7, delay, ease: EASE}}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  const {isRTL} = useTranslation();

  const pillars = isRTL
    ? [
        {num: '01', title: 'مقصود', body: 'كل قطعة تُنتقى بعناية. لا شيء عشوائياً، ولا شيء زائداً عن الحاجة.'},
        {num: '02', title: 'راقٍ', body: 'الرقي في الملمس، والخط، والتفصيل — لا في الضجيج أو الصخب.'},
        {num: '03', title: 'دائم', body: 'قطع تتجاوز الموسم، مصنوعة لترافقك لسنوات قادمة.'},
      ]
    : [
        {num: '01', title: 'Intentional', body: 'Every piece is chosen with care. Nothing arbitrary, nothing superfluous.'},
        {num: '02', title: 'Refined', body: 'Refinement lives in texture, silhouette, and detail — not volume or noise.'},
        {num: '03', title: 'Enduring', body: 'Pieces that transcend seasons, made to be carried for years to come.'},
      ];

  return (
    <div className="min-h-screen bg-[#F9F5F0]" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── Hero ── */}
      <div className="pt-20 md:pt-28 pb-12 md:pb-16 bg-[#F9F5F0]">
        <div className="max-w-[860px] mx-auto px-6 md:px-12 text-center">
          <motion.span
            className="block text-[10px] uppercase tracking-[0.35em] text-[#a87441] mb-4"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5}}
          >
            {isRTL ? 'من نحن' : 'About Us'}
          </motion.span>
          <motion.h1
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-text tracking-wider"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.2, duration: 0.7, ease: EASE}}
          >
            {isRTL ? 'قصتنا' : 'Our Story'}
          </motion.h1>
          <motion.div
            className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-[#a87441] to-transparent"
            initial={{scaleX: 0, opacity: 0}}
            animate={{scaleX: 1, opacity: 1}}
            transition={{delay: 0.5, duration: 0.6}}
          />
        </div>
      </div>

      <div className="max-w-[860px] mx-auto px-6 md:px-12 pb-16 md:pb-24">

        {/* ── Opening ── */}
        <FadeInSection>
          <p className="font-serif text-xl md:text-2xl text-brand-text leading-relaxed mb-4">
            {isRTL
              ? 'انطلقت Formé Haus في الرياض من رغبة في تقديم منظور أكثر وعياً للرفاهية العصرية — حيث يكون الاختيار مقصوداً، وتكون الأناقة تعبيراً هادئاً لا يزول.'
              : 'Formé Haus was founded in Riyadh with a desire to offer a more considered approach to modern luxury, where selection is intentional, and elegance is enduring.'}
          </p>
        </FadeInSection>

        <FadeInSection delay={0.1}>
          <div className={`mt-8 mb-14 h-px w-20 bg-gradient-to-r ${isRTL ? 'from-transparent to-[#a87441]/40' : 'from-[#a87441]/40 to-transparent'}`} />
        </FadeInSection>

        {/* ── Body ── */}
        <div className="space-y-8 text-[15px] md:text-base text-brand-text/80 leading-[1.85] font-light">
          <FadeInSection>
            <p>
              {isRTL
                ? 'تنطلق هويتنا من إحساس سعودي أصيل، تتشكّل ملامحه من درجات لونية مستوحاة من محيطنا — ألوان دافئة، وإضاءة ناعمة، وتدرجات تحاكي الحجر والرمال والملامس الطبيعية.'
                : 'Rooted in a distinctly Saudi sensibility, our identity is shaped by a palette drawn from our landscape — warm neutrals, softened light, and tones that echo stone, sand, and natural textures. Not as a reference, but as a quiet foundation.'}
            </p>
          </FadeInSection>
          <FadeInSection>
            <p>
              {isRTL
                ? 'تأسست Formé Haus كمنصة تقودها امرأة بفخر، حاملةً رؤية أنثوية مميزة تتشكل من الحدس، والرقي، والأصالة.'
                : 'As a proudly woman-led business, Formé Haus reflects a feminine perspective guided by intuition, refinement, and authenticity.'}
            </p>
          </FadeInSection>
          <FadeInSection>
            <p>
              {isRTL
                ? 'ننسّق ونختار مصممين عالميين تجسد أعمالهم النزاهة، والحرفية، والتصميم الذي يدوم.'
                : "We curate international designers whose work embodies integrity, craftsmanship, and lasting design. Each piece is selected for its presence, for the way it moves, feels, and integrates seamlessly into a woman's everyday expression."}
            </p>
          </FadeInSection>
          <FadeInSection>
            <p>
              {isRTL
                ? 'تُقدَّم اختياراتنا ضمن إصدارات محدودة، حفاظاً على التفرّد والتوازن.'
                : 'Our edits are released in limited quantities, preserving distinction and balance. We are drawn to balanced silhouettes, refined textures, and craftsmanship defined by quiet confidence.'}
            </p>
          </FadeInSection>
        </div>

        {/* ── 3 Pillars ── */}
        <FadeInSection className="my-16 md:my-20">
          <div className="mb-8 text-center">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#a87441]">
              {isRTL ? 'ما يقودنا' : 'What Guides Us'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pillars.map((p) => (
              <div
                key={p.num}
                className="relative p-6 bg-white rounded-xl border border-[#EDE8E3] shadow-sm overflow-hidden"
              >
                <span
                  className="absolute top-4 right-4 font-serif text-4xl text-[#a87441]/8 leading-none select-none"
                  aria-hidden="true"
                >
                  {p.num}
                </span>
                <div className="w-8 h-px bg-[#a87441]/50 mb-4" />
                <h3 className="font-serif text-xl text-brand-text mb-2">{p.title}</h3>
                <p className="text-[13px] text-brand-text/65 font-light leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </FadeInSection>

        {/* ── Image + Text Split ── */}
        <FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 md:mb-20 items-center">
            <div className="order-2 md:order-1">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#a87441] block mb-4">
                {isRTL ? 'فلسفتنا' : 'Our Philosophy'}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-brand-text tracking-wider mb-5">
                {isRTL ? 'حيث يُراعى كل تفصيل' : 'Where every detail is considered'}
              </h2>
              <div className={`mb-5 h-px w-16 bg-gradient-to-r ${isRTL ? 'from-transparent to-[#a87441]/40' : 'from-[#a87441]/40 to-transparent'}`} />
              <div className="space-y-4 text-[14px] text-brand-text/70 font-light leading-relaxed">
                <p>
                  {isRTL
                    ? 'الأناقة، في رؤيتنا، ليست استعراضاً… بل حضور يُحَسّ ولا يُعلن.'
                    : 'We believe elegance is a presence, not a performance.'}
                </p>
                <p>
                  {isRTL
                    ? 'تتجلّى في ثقة هادئة، في حركة محسوبة، وفي يقين داخلي لا يحتاج إلى إثبات.'
                    : 'It reveals itself in quiet confidence, in measured movement, in the assurance of knowing who you are.'}
                </p>
                <p className="font-serif text-base text-brand-text italic">
                  {isRTL ? 'الرفاهية، في رأينا، واعية. شخصية. وتدوم.' : 'Luxury, to us, is thoughtful. Personal. Enduring.'}
                </p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="aspect-[4/5] rounded-xl overflow-hidden">
                <img
                  src="/brand/about-philosophy-1.webp"
                  alt="Formé Haus atelier"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* ── Second image split ── */}
        <FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 md:mb-20 items-center">
            <div>
              <div className="aspect-[4/5] rounded-xl overflow-hidden">
                <img
                  src="/brand/about-philosophy-2.webp"
                  alt="Curated selection"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#a87441] block mb-4">
                {isRTL ? 'مختارات بعناية' : 'Curated with Intention'}
              </span>
              <p className="font-serif text-2xl md:text-3xl text-brand-text italic leading-relaxed mb-5">
                {isRTL
                  ? 'حيث يُراعى كل تفصيل ولا يُترك شيء للصدفة.'
                  : 'Where every detail is considered and nothing is left to chance.'}
              </p>
              <p className="text-[14px] text-brand-text/70 font-light leading-relaxed">
                {isRTL
                  ? 'في جوهرها، تستند Formé Haus إلى رؤية ترى أن الأناقة الحقيقية تنكشف من خلال الاختيار الواعي، ومن خلال انتقاء ما يدوم فقط.'
                  : "At its core, Formé Haus is guided by the belief that true elegance is revealed through thoughtful selection — and in choosing only what endures."}
              </p>
            </div>
          </div>
        </FadeInSection>

        {/* ── Closing quote ── */}
        <FadeInSection>
          <div className="py-10 md:py-14 border-y border-[#a87441]/15 text-center">
            <p className="font-serif text-2xl md:text-3xl text-brand-text italic leading-relaxed">
              {isRTL
                ? 'Formé Haus ليست مجرد وجهة رقمية. إنها رؤية منسّقة — حيث يلتقي الجوهر بالأناقة.'
                : 'Formé Haus is more than an online destination. It is a curated perspective — where essence meets elegance.'}
            </p>
          </div>
        </FadeInSection>

        {/* ── Closing line ── */}
        <FadeInSection className="mt-16 mb-8">
          <div className="h-px w-24 bg-gradient-to-r from-[#a87441]/30 to-transparent" />
        </FadeInSection>
      </div>
    </div>
  );
}
