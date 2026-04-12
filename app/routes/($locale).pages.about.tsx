import {type MetaFunction} from '@shopify/remix-oxygen';
import {motion, useInView} from 'framer-motion';
import {useRef} from 'react';

import {routeHeaders} from '~/data/cache';
import {useTranslation} from '~/hooks/useTranslation';

export const headers = routeHeaders;

export const meta: MetaFunction = () => {
  return [{title: 'Our Story | Formé Haus'}];
};

function FadeIn({
  children,
  className = '',
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {once: true, margin: '-50px'});
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{opacity: 0, y}}
      animate={isInView ? {opacity: 1, y: 0} : {opacity: 0, y}}
      transition={{duration: 0.75, delay, ease: [0.16, 1, 0.3, 1]}}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  const {isRTL} = useTranslation();

  return (
    <div className="min-h-screen bg-[#F9F5F0]" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{paddingTop: 'var(--navbar-height)'}}>
        <img
          src="/brand/about-hero.webp"
          alt="Formé Haus — Our Story"
          className="w-full h-[55vh] md:h-[68vh] object-cover object-center"
          loading="eager"
          fetchPriority="high"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/55" />

        {/* Centred hero content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <motion.img
            src="/brand/logo-full-opt.webp"
            alt="Formé Haus"
            className="h-14 md:h-20 w-auto object-contain mb-6 drop-shadow-lg"
            loading="eager"
            initial={{opacity: 0, y: -12}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1]}}
          />
          <motion.h1
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-white tracking-wide drop-shadow-md"
            initial={{opacity: 0, y: 16}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1]}}
          >
            {isRTL ? 'قصتنا' : 'Our Story'}
          </motion.h1>
          <motion.div
            className="mt-5 h-px w-14 bg-gradient-to-r from-transparent via-[#D4AF87] to-transparent"
            initial={{scaleX: 0, opacity: 0}}
            animate={{scaleX: 1, opacity: 1}}
            transition={{delay: 0.7, duration: 0.7}}
          />
        </div>
      </div>

      {/* ── 2. Brand Opening — logo mark + founding statement ───────────────── */}
      <section className="py-16 md:py-24 bg-[#F9F5F0]">
        <div
          className="max-w-[1100px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12 md:gap-20"
        >
          {/* Logo mark */}
          <FadeIn className="shrink-0 flex flex-col items-center gap-4" delay={0.1}>
            <img
              src="/brand/logo-icon-only-opt.webp"
              alt="Formé Haus"
              className="w-24 h-24 md:w-32 md:h-32 object-contain opacity-80"
            />
            <div className="h-px w-10 bg-[#a87441]/30" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#a87441]">
              Riyadh
            </span>
          </FadeIn>

          {/* Opening text */}
          <FadeIn delay={0.2}>
            <span className="block text-[10px] uppercase tracking-[0.35em] text-[#a87441] mb-5">
              {isRTL ? 'التأسيس' : 'Founded'}
            </span>
            <p className="font-serif text-2xl md:text-3xl text-brand-text leading-relaxed">
              {isRTL
                ? 'انطلقت Formé Haus في الرياض من رغبة في تقديم منظور أكثر وعياً للرفاهية العصرية — حيث يكون الاختيار مقصوداً، وتكون الأناقة تعبيراً هادئاً لا يزول.'
                : 'Formé Haus was founded in Riyadh with a desire to offer a more considered approach to modern luxury, where selection is intentional, and elegance is enduring.'}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── 3. Story — image + narrative ────────────────────────────────────── */}
      <section className="bg-[#EDE8E3] py-16 md:py-24">
        <div
          className={`max-w-[1100px] mx-auto px-6 md:px-12 flex flex-col ${
            isRTL ? 'md:flex-row-reverse' : 'md:flex-row'
          } gap-10 md:gap-16 items-start`}
        >
          {/* Story image */}
          <FadeIn className="w-full md:w-[42%] shrink-0" delay={0.05}>
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="/brand/about-story.webp"
                alt="Formé Haus story"
                className="w-full aspect-[3/4] object-cover object-center"
                loading="lazy"
              />
              {/* Subtle logo watermark over image */}
              <div className="absolute bottom-5 right-5 rtl:right-auto rtl:left-5">
                <img
                  src="/brand/logo-icon-only-opt.webp"
                  alt=""
                  aria-hidden="true"
                  className="w-10 h-10 object-contain opacity-30 invert"
                />
              </div>
            </div>
          </FadeIn>

          {/* Narrative */}
          <div className="flex-1 space-y-7 text-[15px] md:text-base text-brand-text/80 leading-[1.9] font-light">
            <FadeIn>
              <p>
                {isRTL
                  ? 'تنطلق هويتنا من إحساس سعودي أصيل، تتشكّل ملامحه من درجات لونية مستوحاة من محيطنا — ألوان دافئة، وإضاءة ناعمة، وتدرجات تحاكي الحجر والرمال والملامس الطبيعية. ليست كمرجع مباشر، بل كأساس هادئ يعكس الانتماء.'
                  : 'Rooted in a distinctly Saudi sensibility, our identity is shaped by a palette drawn from our landscape — warm neutrals, softened light, and tones that echo stone, sand, and natural textures. Not as a reference, but as a quiet foundation.'}
              </p>
            </FadeIn>
            <FadeIn delay={0.05}>
              <p>
                {isRTL
                  ? 'تأسست Formé Haus كمنصة تقودها امرأة بفخر، حاملةً رؤية أنثوية مميزة تتشكل من الحدس، والرقي، والأصالة.'
                  : 'As a proudly woman-led business, Formé Haus reflects a feminine perspective guided by intuition, refinement, and authenticity.'}
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p>
                {isRTL
                  ? 'ننسّق ونختار مصممين عالميين تجسد أعمالهم النزاهة، والحرفية، والتصميم الذي يدوم. تُنتقى كل قطعة لما تحمله من حضور — لطريقة حركتها، وملمسها، وكيف تصبح امتداداً طبيعياً لتعبير المرأة اليومي.'
                  : 'We curate international designers whose work embodies integrity, craftsmanship, and lasting design. Each piece is selected for its presence — for the way it moves, feels, and integrates seamlessly into a woman\'s everyday expression.'}
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p>
                {isRTL
                  ? 'تُقدَّم اختياراتنا ضمن إصدارات محدودة، حفاظاً على التفرّد والتوازن. وننجذب إلى توازن الخطوط، وغنى الملامس، وحرفية تعبّر عن ثقة هادئة لا تحتاج إلى لفت الانتباه.'
                  : 'Our edits are released in limited quantities, preserving distinction and balance. We are drawn to balanced silhouettes, refined textures, and craftsmanship defined by quiet confidence.'}
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="font-serif text-lg md:text-xl text-brand-text italic pt-2">
                {isRTL ? (
                  <>
                    Formé Haus ليست مجرد وجهة رقمية.<br />
                    إنها رؤية منسّقة — حيث يلتقي الجوهر بالأناقة.
                  </>
                ) : (
                  <>
                    Formé Haus is more than an online destination.<br />
                    It is a curated perspective — where essence meets elegance.
                  </>
                )}
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── 4. Editorial Pull Quote ──────────────────────────────────────────── */}
      <FadeIn className="py-16 md:py-20 bg-[#F9F5F0]">
        <div
          className="max-w-[860px] mx-auto px-6 md:px-12 text-center border-y border-[#a87441]/15 py-12 md:py-16"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#a87441] block mb-6">
            {isRTL ? 'مختارات بعناية' : 'Curated with intention'}
          </span>
          <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-brand-text italic leading-relaxed">
            {isRTL
              ? 'حيث يُراعى كل تفصيل ولا يُترك شيء للصدفة.'
              : 'Where every detail is considered\nand nothing is left to chance.'}
          </p>
        </div>
      </FadeIn>

      {/* ── 5. Philosophy — three images + text ─────────────────────────────── */}
      <section className="py-16 md:py-24 bg-[#F9F5F0]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12">

          {/* Section header */}
          <FadeIn className="mb-12">
            <span className="block text-[10px] uppercase tracking-[0.35em] text-[#a87441] mb-4">
              {isRTL ? 'قيمنا' : 'Our values'}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-text">
              {isRTL ? 'فلسفتنا' : 'Our Philosophy'}
            </h2>
            <div
              className={`mt-4 h-px w-12 bg-gradient-to-r ${
                isRTL
                  ? 'from-transparent to-[#a87441]/50'
                  : 'from-[#a87441]/50 to-transparent'
              }`}
            />
          </FadeIn>

          {/* Three philosophy images */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-14">
            {[
              {src: '/brand/about-philosophy-1.webp', delay: 0},
              {src: '/brand/about-philosophy-2.webp', delay: 0.1},
              {src: '/brand/about-philosophy-3.webp', delay: 0.2},
            ].map(({src, delay}, i) => (
              <FadeIn key={i} delay={delay} y={16}>
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={src}
                    alt=""
                    aria-hidden="true"
                    className="w-full aspect-[4/5] object-cover object-center hover:scale-[1.03] transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Philosophy text */}
          <div
            className={`max-w-[720px] ${isRTL ? 'mr-0' : 'ml-0'} space-y-6 text-[15px] md:text-base text-brand-text/80 leading-[1.9] font-light`}
          >
            <FadeIn>
              <p>
                {isRTL
                  ? 'الأناقة، في رؤيتنا، ليست استعراضاً… بل حضور يُحَسّ ولا يُعلن.'
                  : 'We believe elegance is a presence, not a performance.'}
              </p>
            </FadeIn>
            <FadeIn delay={0.05}>
              <p>
                {isRTL
                  ? 'تتجلّى في ثقة هادئة، في حركة محسوبة، وفي يقين داخلي لا يحتاج إلى إثبات.'
                  : 'It reveals itself in quiet confidence, in measured movement, in the assurance of knowing who you are.'}
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p>
                {isRTL
                  ? 'تنطلق رؤيتنا من إحساس بالمكان، من دفء الألوان، وهدوء التوازن، وانسجام الطبيعة، حيث تلتقي النعومة مع البناء في توازن مدروس.'
                  : 'Guided by a sense of place, our perspective is grounded in warmth, restraint, and natural harmony — where softness and structure exist in balance.'}
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p>
                {isRTL
                  ? 'ننجذب إلى قطع تبدو وكأنها وُجدت لتكون — تنتمي بطبيعتها، منسابة، متزنة، ومنسجمة مع إيقاع المرأة وطبيعتها.'
                  : "The pieces we are drawn to feel instinctive rather than imposed — effortless, composed, and aligned with a woman's natural rhythm."}
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="font-serif text-lg md:text-xl text-brand-text pt-2 italic">
                {isRTL ? (
                  <>
                    أما الرفاهية، فليست في الكثرة، بل في الاختيار.<br />
                    واعية. شخصية. وتدوم.
                  </>
                ) : (
                  <>
                    Luxury, to us, is thoughtful.<br />
                    Personal. Enduring.
                  </>
                )}
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── 6. Closing image with brand logo + quote ────────────────────────── */}
      <FadeIn y={0}>
        <div className="relative w-full overflow-hidden">
          <img
            src="/brand/about-closing.webp"
            alt=""
            aria-hidden="true"
            className="w-full h-[50vh] md:h-[60vh] object-cover object-center"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 md:pb-16 px-6 text-center">
            <img
              src="/brand/logo-icon-only-opt.webp"
              alt="Formé Haus"
              className="w-10 h-10 object-contain opacity-60 invert mb-5"
            />
            <p className="font-serif text-xl md:text-2xl text-white/90 italic max-w-md leading-relaxed drop-shadow">
              {isRTL
                ? 'في جوهرها، تستند Formé Haus إلى رؤية ترى أن الأناقة الحقيقية تنكشف من خلال الاختيار الواعي.'
                : 'True elegance is revealed through thoughtful selection — and in choosing only what endures.'}
            </p>
            <div className="mt-5 h-px w-12 bg-gradient-to-r from-transparent via-[#D4AF87]/70 to-transparent" />
          </div>
        </div>
      </FadeIn>

    </div>
  );
}
