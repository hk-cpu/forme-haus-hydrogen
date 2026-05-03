import {motion} from 'framer-motion';
import {type MetaFunction} from '@shopify/remix-oxygen';

import {routeHeaders} from '~/data/cache';
import {useTranslation} from '~/hooks/useTranslation';

export const headers = routeHeaders;

export const meta: MetaFunction = () => {
  return [{title: 'Our Story | Formé Haus'}];
};

const EASE = [0.16, 1, 0.3, 1] as const;

export default function AboutPage() {
  const {lang} = useTranslation();
  const isArabic = lang === 'AR';

  return (
    <div className="min-h-screen bg-[#F9F5F0]" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="pt-32 pb-24 container mx-auto px-6 md:px-12 max-w-3xl">
        {/* ── Header ── */}
        <div className="mb-16 text-center">
          <motion.span
            className="block text-[10px] uppercase tracking-[0.35em] text-[#a87441] mb-4 font-light"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.6}}
          >
            {isArabic ? 'من نحن' : 'About Us'}
          </motion.span>
          <motion.h1
            className="font-serif text-3xl md:text-4xl lg:text-5xl text-brand-text tracking-wide"
            initial={{opacity: 0, y: 16}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.7, delay: 0.1, ease: EASE}}
          >
            {isArabic ? 'قصتنا' : 'Our Story'}
          </motion.h1>
          <motion.div
            className="mx-auto mt-8 h-px w-16 bg-gradient-to-r from-transparent via-[#a87441]/40 to-transparent"
            initial={{scaleX: 0}}
            animate={{scaleX: 1}}
            transition={{duration: 0.8, delay: 0.3}}
          />
        </div>

        {/* ── Content ── */}
        <motion.div
          className="text-[15px] text-brand-text/80 leading-[2] font-light space-y-6"
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.7, delay: 0.2, ease: EASE}}
        >
          {isArabic ? (
            <>
              <p>انطلقت Formé Haus في الرياض من رغبة في تقديم منظور أكثر وعياً للرفاهية العصرية — حيث يكون الاختيار مقصوداً، وتكون الأناقة تعبيراً هادئاً لا يزول.</p>
              
              <p>تنطلق هويتنا من إحساس سعودي أصيل، تتشكّل ملامحه من درجات لونية مستوحاة من محيطنا — ألوان دافئة، وإضاءة ناعمة، وتدرجات تحاكي الحجر والرمال والملامس الطبيعية. ليست كمرجع مباشر، بل كأساس هادئ يعكس الانتماء.</p>
              
              <p>تأسست Formé Haus كمنصة تقودها امرأة بفخر، حاملةً رؤية أنثوية مميزة تتشكل من الحدس، والرقي، والأصالة.</p>
              
              <p>ننسّق ونختار مصممين عالميين تجسد أعمالهم النزاهة، والحرفية، والتصميم الذي يدوم. تُنتقى كل قطعة لما تحمله من حضور — لطريقة حركتها، وملمسها، وكيف تصبح امتداداً طبيعياً لتعبير المرأة اليومي.</p>
              
              <p>تُقدَّم اختياراتنا ضمن إصدارات محدودة، حفاظاً على التفرّد والتوازن. وننجذب إلى توازن الخطوط، وغنى الملامس، وحرفية تعبّر عن ثقة هادئة لا تحتاج إلى لفت الانتباه.</p>
              
              <p>في جوهرها، تستند Formé Haus إلى رؤية ترى أن الأناقة الحقيقية تنكشف من خلال الاختيار الواعي، ومن خلال انتقاء ما يدوم فقط.</p>
              
              <p>Formé Haus ليست مجرد وجهة رقمية.<br />إنها رؤية منسّقة — حيث يلتقي الجوهر بالأناقة.</p>
              
              <div className="pt-8 pb-4">
                <div className="h-px w-24 bg-gradient-to-r from-[#a87441]/20 to-transparent mx-auto" />
              </div>

              <div className="text-center">
                <h2 className="font-serif text-2xl text-brand-text mb-6">فلسفتنا</h2>
              </div>

              <p>الأناقة، في رؤيتنا، ليست استعراضاً… بل حضور يُحَسّ ولا يُعلن.</p>
              
              <p>تتجلّى في ثقة هادئة، في حركة محسوبة، وفي يقين داخلي لا يحتاج إلى إثبات.</p>
              
              <p>تنطلق رؤيتنا من إحساس بالمكان، من دفء الألوان، وهدوء التوازن، وانسجام الطبيعة، حيث تلتقي النعومة مع البناء في توازن مدروس.</p>
              
              <p>ننجذب إلى قطع تبدو وكأنها وُجدت لتكون — تنتمي بطبيعتها، منسابة، متزنة، ومنسجمة مع إيقاع المرأة وطبيعتها.</p>
              
              <p>أما الرفاهية، فليست في الكثرة، بل في الاختيار.<br />واعية.<br />شخصية.<br />وتدوم.</p>
            </>
          ) : (
            <>
              <p>Formé Haus was founded in Riyadh with a desire to offer a more considered approach to modern luxury, where selection is intentional, and elegance is enduring.</p>
              
              <p>Rooted in a distinctly Saudi sensibility, our identity is shaped by a palette drawn from our landscape — warm neutrals, softened light, and tones that echo stone, sand, and natural textures. Not as a reference, but as a quiet foundation.</p>
              
              <p>As a proudly woman-led business, Formé Haus reflects a feminine perspective guided by intuition, refinement, and authenticity.</p>
              
              <p>We curate international designers whose work embodies integrity, craftsmanship, and lasting design. Each piece is selected for its presence, for the way it moves, feels, and integrates seamlessly into a woman’s everyday expression.</p>
              
              <p>Our edits are released in limited quantities, preserving distinction and balance. We are drawn to balanced silhouettes, refined textures, and craftsmanship defined by quiet confidence.</p>
              
              <p>At its core, Formé Haus is guided by the belief that true elegance is revealed through thoughtful selection and in choosing only what endures.</p>
              
              <p>Formé Haus is more than an online destination.<br />It is a curated perspective — where essence meets elegance.</p>
              
              <div className="pt-8 pb-4">
                <div className="h-px w-24 bg-gradient-to-r from-[#a87441]/20 to-transparent mx-auto" />
              </div>

              <div className="text-center">
                <h2 className="font-serif text-2xl text-brand-text mb-6">Our Philosophy</h2>
              </div>

              <p>We believe elegance is a presence, not a performance.</p>
              
              <p>It reveals itself in quiet confidence, in measured movement, in the assurance of knowing who you are.</p>
              
              <p>Guided by a sense of place, our perspective is grounded in warmth, restraint, and natural harmony, where softness and structure exist in balance.</p>
              
              <p>The pieces we are drawn to feel instinctive rather than imposed — effortless, composed, and aligned with a woman’s natural rhythm.</p>
              
              <p>Luxury, to us, is thoughtful.<br />Personal.<br />Enduring.</p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
