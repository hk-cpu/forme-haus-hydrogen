import {motion} from 'framer-motion';
import {type MetaFunction} from '@shopify/remix-oxygen';

import {routeHeaders} from '~/data/cache';
import {useTranslation} from '~/hooks/useTranslation';

export const headers = routeHeaders;

export const meta: MetaFunction = () => {
  return [{title: 'Terms & Conditions | Formé Haus'}];
};

const EASE = [0.16, 1, 0.3, 1] as const;

export default function TermsOfServicePage() {
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
            {isArabic ? 'السياسات' : 'Policies'}
          </motion.span>
          <motion.h1
            className="font-serif text-3xl md:text-4xl lg:text-5xl text-brand-text tracking-wide"
            initial={{opacity: 0, y: 16}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.7, delay: 0.1, ease: EASE}}
          >
            {isArabic ? 'الشروط والأحكام' : 'Terms & Conditions'}
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
              <p>مرحبًا بكم في Formé Haus. باستخدامكم لهذا الموقع فإنكم توافقون على الالتزام بالشروط والأحكام التالية.</p>

              <div>
                <strong className="font-medium text-brand-text block mb-2">استخدام الموقع</strong>
                <p>يجب استخدام الموقع لأغراض مشروعة فقط وبما لا يؤثر على تشغيل الموقع أو ينتهك حقوق الآخرين.</p>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">معلومات المنتجات</strong>
                <p>نسعى إلى عرض معلومات دقيقة عن المنتجات بما في ذلك الوصف والصور والأسعار، ومع ذلك قد تحدث بعض الاختلافات البسيطة. تحتفظ Formé Haus بالحق في تصحيح الأخطاء أو تحديث المعلومات دون إشعار مسبق.</p>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">الطلبات</strong>
                <p>تخضع جميع الطلبات لتوفر المنتجات وموافقة Formé Haus. ونحتفظ بالحق في رفض أو إلغاء أي طلب في حال حدوث خطأ في التسعير، أو عدم توفر المنتج، أو الاشتباه في وجود نشاط احتيالي.</p>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">الملكية الفكرية</strong>
                <p>جميع المحتويات المعروضة على هذا الموقع، بما في ذلك النصوص والصور والشعارات والتصاميم، هي ملك لـ Formé Haus أو للجهات المالكة لها، ولا يجوز نسخها، أو إعادة إنتاجها، أو استخدامها دون إذن خطي مسبق.</p>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">تحديد المسؤولية</strong>
                <p>لا تتحمل Formé Haus المسؤولية عن أي أضرار غير مباشرة أو تبعية قد تنتج عن استخدام الموقع وذلك في الحدود التي يسمح بها النظام.</p>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">القانون المعمول به</strong>
                <p>تخضع هذه الشروط والأحكام لأنظمة وقوانين المملكة العربية السعودية.</p>
              </div>
            </>
          ) : (
            <>
              <p>Welcome to Formé Haus. By accessing or using our website, you agree to the following Terms & Conditions.</p>

              <div>
                <strong className="font-medium text-brand-text block mb-2">Use of the Website</strong>
                <p>You agree to use this website only for lawful purposes and in a manner that does not interfere with its operation or violate the rights of others.</p>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">Product Information</strong>
                <p>We strive to ensure that product descriptions, images, and pricing are accurate. However, minor variations may occur. Formé Haus reserves the right to correct errors or update product information without prior notice.</p>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">Orders</strong>
                <p>All orders are subject to product availability and acceptance by Formé Haus. We reserve the right to refuse or cancel any order if a pricing error occurs, if a product becomes unavailable, or if fraudulent activity is suspected.</p>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">Intellectual Property</strong>
                <p>All content on this website, including text, images, graphics, logos, and design elements, is the property of Formé Haus or its respective partners and may not be copied, reproduced, or used without prior written permission.</p>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">Limitation of Liability</strong>
                <p>Formé Haus shall not be liable for any indirect or consequential damages arising from the use of this website to the extent permitted by applicable law.</p>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">Governing Law</strong>
                <p>These Terms & Conditions are governed by the laws and regulations of the Kingdom of Saudi Arabia.</p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
