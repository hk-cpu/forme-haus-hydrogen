import {type MetaFunction} from '@shopify/remix-oxygen';
import {motion, useInView} from 'framer-motion';
import {useRef} from 'react';

import {routeHeaders} from '~/data/cache';
import {useTranslation} from '~/hooks/useTranslation';

export const headers = routeHeaders;

export const meta: MetaFunction = () => {
  return [{title: 'Our Story | Formé Haus'}];
};

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
      transition={{duration: 0.7, delay, ease: [0.16, 1, 0.3, 1]}}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  const {isRTL} = useTranslation();

  return (
    <div className="min-h-screen bg-[#F9F5F0]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section — Text-only with elegant spacing */}
      <div className="pt-20 md:pt-28 pb-12 md:pb-16 bg-[#F9F5F0]">
        <div className="max-w-[860px] mx-auto px-6 md:px-12 text-center">

          <motion.h1
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-text tracking-wider"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1]}}
          >
            {isRTL ? 'قصتنا' : 'Our Story'}
          </motion.h1>
          <motion.div
            className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-[#a87441] to-transparent"
            initial={{width: 0, opacity: 0}}
            animate={{width: 64, opacity: 1}}
            transition={{delay: 0.6, duration: 0.6}}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[860px] mx-auto px-6 md:px-12 pb-16 md:pb-24">
        {/* Opening */}
        <FadeInSection>
          <p className="font-serif text-xl md:text-2xl text-brand-text leading-relaxed mb-4">
            {isRTL ? (
              'انطلقت Formé Haus في الرياض من رغبة في تقديم منظور أكثر وعياً للرفاهية العصرية — حيث يكون الاختيار مقصوداً، وتكون الأناقة تعبيراً هادئاً لا يزول.'
            ) : (
              'Formé Haus was founded in Riyadh with a desire to offer a more considered approach to modern luxury, where selection is intentional, and elegance is enduring.'
            )}
          </p>
        </FadeInSection>

        <FadeInSection delay={0.1}>
          <div className={`mt-8 mb-14 h-px w-20 bg-gradient-to-r ${isRTL ? 'from-transparent to-[#a87441]/40' : 'from-[#a87441]/40 to-transparent'}`} />
        </FadeInSection>

        {/* Body */}
        <div className="space-y-8 text-[15px] md:text-base text-brand-text/80 leading-[1.85] font-light">
          <FadeInSection>
            <p>
              {isRTL
                ? 'تنطلق هويتنا من إحساس سعودي أصيل، تتشكّل ملامحه من درجات لونية مستوحاة من محيطنا — ألوان دافئة، وإضاءة ناعمة، وتدرجات تحاكي الحجر والرمال والملامس الطبيعية. ليست كمرجع مباشر، بل كأساس هادئ يعكس الانتماء.'
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
                ? 'ننسّق ونختار مصممين عالميين تجسد أعمالهم النزاهة، والحرفية، والتصميم الذي يدوم. تُنتقى كل قطعة لما تحمله من حضور — لطريقة حركتها، وملمسها، وكيف تصبح امتداداً طبيعياً لتعبير المرأة اليومي.'
                : 'We curate international designers whose work embodies integrity, craftsmanship, and lasting design. Each piece is selected for its presence, for the way it moves, feels, and integrates seamlessly into a woman\'s everyday expression.'}
            </p>
          </FadeInSection>

          <FadeInSection>
            <p>
              {isRTL
                ? 'تُقدَّم اختياراتنا ضمن إصدارات محدودة، حفاظاً على التفرّد والتوازن. وننجذب إلى توازن الخطوط، وغنى الملامس، وحرفية تعبّر عن ثقة هادئة لا تحتاج إلى لفت الانتباه.'
                : 'Our edits are released in limited quantities, preserving distinction and balance. We are drawn to balanced silhouettes, refined textures, and craftsmanship defined by quiet confidence.'}
            </p>
          </FadeInSection>

          <FadeInSection>
            <p>
              {isRTL
                ? 'في جوهرها، تستند Formé Haus إلى رؤية ترى أن الأناقة الحقيقية تنكشف من خلال الاختيار الواعي، ومن خلال انتقاء ما يدوم فقط.'
                : 'At its core, Formé Haus is guided by the belief that true elegance is revealed through thoughtful selection and in choosing only what endures.'}
            </p>
          </FadeInSection>

          <FadeInSection>
            <p className="font-serif text-lg md:text-xl text-brand-text italic py-4">
              {isRTL ? (
                <>
                  Formé Haus ليست مجرد وجهة رقمية.
                  <br />
                  إنها رؤية منسّقة — حيث يلتقي الجوهر بالأناقة.
                </>
              ) : (
                <>
                  Formé Haus is more than an online destination.
                  <br />
                  It is a curated perspective — where essence meets elegance.
                </>
              )}
            </p>
          </FadeInSection>
        </div>

        {/* Editorial divider */}
        <FadeInSection className="my-16 md:my-20">
          <div className="py-10 md:py-14 border-y border-[#a87441]/15">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#a87441] block mb-4">
              {isRTL ? 'مختارات بعناية' : 'Curated with intention'}
            </span>
            <p className="font-serif text-2xl md:text-3xl text-brand-text italic leading-relaxed max-w-lg">
              {isRTL
                ? 'حيث يُراعى كل تفصيل ولا يُترك شيء للصدفة.'
                : 'Where every detail is considered and nothing is left to chance.'}
            </p>
          </div>
        </FadeInSection>

        {/* Philosophy */}
        <FadeInSection>
          <div className="mb-10">

            <h2 className="font-serif text-3xl md:text-4xl text-brand-text tracking-wider">
              {isRTL ? 'فلسفتنا' : 'Our Philosophy'}
            </h2>
            <div className={`mt-5 h-px w-16 bg-gradient-to-r ${isRTL ? 'from-transparent to-[#a87441]/40' : 'from-[#a87441]/40 to-transparent'}`} />
          </div>
        </FadeInSection>

        <div className="space-y-8 text-[15px] md:text-base text-brand-text/80 leading-[1.85] font-light">
          <FadeInSection>
            <p>
              {isRTL
                ? 'الأناقة، في رؤيتنا، ليست استعراضاً… بل حضور يُحَسّ ولا يُعلن.'
                : 'We believe elegance is a presence, not a performance.'}
            </p>
          </FadeInSection>

          <FadeInSection>
            <p>
              {isRTL
                ? 'تتجلّى في ثقة هادئة، في حركة محسوبة، وفي يقين داخلي لا يحتاج إلى إثبات.'
                : 'It reveals itself in quiet confidence, in measured movement, in the assurance of knowing who you are.'}
            </p>
          </FadeInSection>

          <FadeInSection>
            <p>
              {isRTL
                ? 'تنطلق رؤيتنا من إحساس بالمكان، من دفء الألوان، وهدوء التوازن، وانسجام الطبيعة، حيث تلتقي النعومة مع البناء في توازن مدروس.'
                : 'Guided by a sense of place, our perspective is grounded in warmth, restraint, and natural harmony, where softness and structure exist in balance.'}
            </p>
          </FadeInSection>

          <FadeInSection>
            <p>
              {isRTL
                ? 'ننجذب إلى قطع تبدو وكأنها وُجدت لتكون — تنتمي بطبيعتها، منسابة، متزنة، ومنسجمة مع إيقاع المرأة وطبيعتها.'
                : 'The pieces we are drawn to feel instinctive rather than imposed — effortless, composed, and aligned with a woman\'s natural rhythm.'}
            </p>
          </FadeInSection>

          <FadeInSection>
            <p className="font-serif text-lg md:text-xl text-brand-text pt-4">
              {isRTL ? (
                <>
                  أما الرفاهية، فليست في الكثرة، بل في الاختيار.<br />
                  واعية.<br />
                  شخصية.<br />
                  وتدوم.
                </>
              ) : (
                <>
                  Luxury, to us, is thoughtful.<br />
                  Personal.<br />
                  Enduring.
                </>
              )}
            </p>
          </FadeInSection>
        </div>

        {/* Closing divider */}
        <FadeInSection className="mt-16 mb-8">
          <div className="h-px w-24 bg-gradient-to-r from-[#a87441]/30 to-transparent" />
        </FadeInSection>
      </div>
    </div>
  );
}
