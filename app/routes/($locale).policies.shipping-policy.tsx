import {motion} from 'framer-motion';
import {type MetaFunction} from '@shopify/remix-oxygen';

import {routeHeaders} from '~/data/cache';
import {useTranslation} from '~/hooks/useTranslation';

export const headers = routeHeaders;

export const meta: MetaFunction = () => {
  return [{title: 'Shipping & Delivery Policy | Formé Haus'}];
};

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ShippingPolicyPage() {
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
            {isArabic ? 'سياسة الشحن والتوصيل' : 'Shipping & Delivery Policy'}
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
              <p>يتم تجهيز الطلبات خلال 1–3 أيام عمل بعد تأكيد الطلب.</p>
              
              <div>
                <strong className="font-medium text-brand-text block mb-2">مدة التوصيل التقديرية:</strong>
                <ul className="list-none space-y-2">
                  <li>• داخل المملكة العربية السعودية: 2–5 أيام عمل</li>
                  <li>• دول مجلس التعاون الخليجي: 3–7 أيام عمل</li>
                </ul>
              </div>

              <p>يتم احتساب رسوم الشحن عند إتمام الطلب بناءً على عنوان التوصيل.</p>
              <p>
                بالنسبة للطلبات التي يتم شحنها خارج المملكة العربية السعودية،{' '}
                <strong className="font-medium text-brand-text">يتحمل العميل كامل الرسوم الجمركية وأي ضرائب أو رسوم إضافية متعلقة بالاستيراد.</strong>
              </p>
            </>
          ) : (
            <>
              <p>Orders are processed within 1–3 business days after confirmation.</p>
              
              <div>
                <strong className="font-medium text-brand-text block mb-2">Estimated delivery times:</strong>
                <ul className="list-none space-y-2">
                  <li>• Saudi Arabia: 2–5 business days</li>
                  <li>• GCC Countries: 3–7 business days</li>
                </ul>
              </div>

              <p>Shipping fees are calculated at checkout based on the delivery location.</p>
              <p>
                For orders shipped outside Saudi Arabia,{' '}
                <strong className="font-medium text-brand-text">all applicable customs duties, import taxes, and additional charges are the responsibility of the customer.</strong>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
