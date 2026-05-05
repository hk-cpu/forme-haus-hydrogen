import {motion} from 'framer-motion';
import {type MetaFunction} from '@shopify/remix-oxygen';

import {routeHeaders} from '~/data/cache';
import {useTranslation} from '~/hooks/useTranslation';

export const headers = routeHeaders;

export const meta: MetaFunction = () => {
  return [{title: 'Return & Exchange Policy | Formé Haus'}];
};

const EASE = [0.16, 1, 0.3, 1] as const;

export default function RefundPolicyPage() {
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
            {isArabic ? 'سياسة الاسترجاع والاستبدال' : 'Returns & Exchanges'}
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
              <p>
                في Formé Haus نسعى لضمان رضاكم عن مشترياتكم.<br />
                وفقًا لنظام التجارة الإلكترونية في المملكة العربية السعودية، يحق للعميل طلب <strong className="font-medium text-brand-text">الاسترجاع أو الاستبدال خلال 7 أيام</strong> من تاريخ الاستلام.
              </p>

              <div>
                <strong className="font-medium text-brand-text block mb-2">يشترط لقبول الطلب:</strong>
                <ul className="list-none space-y-2">
                  <li>• أن يكون المنتج <strong className="font-medium text-brand-text">غير مستخدم وفي حالته الأصلية</strong></li>
                  <li>• إرجاعه مع <strong className="font-medium text-brand-text">جميع التغليفات والبطاقات والمرفقات الأصلية</strong></li>
                  <li>• تقديم <strong className="font-medium text-brand-text">إثبات الشراء</strong></li>
                </ul>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">المنتجات غير القابلة للاسترجاع</strong>
                <p>لأسباب تتعلق بالنظافة وسلامة المنتج، لا يمكن استرجاع <strong className="font-medium text-brand-text">النظارات الشمسية أو أغطية الجوال أو الأشرطة أو الإكسسوارات بعد فتحها أو استخدامها.</strong></p>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">المنتجات التالفة أو الخاطئة</strong>
                <p>في حال استلام منتج تالف أو مختلف عن الطلب، يرجى التواصل خلال <strong className="font-medium text-brand-text">48 ساعة من الاستلام</strong> وسيتم ترتيب الاسترجاع <strong className="font-medium text-brand-text">دون رسوم إضافية</strong>.</p>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">الشحن والاسترداد</strong>
                <ul className="list-none space-y-2">
                  <li>• رسوم الشحن الأصلية <strong className="font-medium text-brand-text">غير قابلة للاسترداد في حال تغيير الرأي</strong></li>
                  <li>• تخضع المنتجات المرتجعة <strong className="font-medium text-brand-text">للفحص عند الاستلام</strong></li>
                  <li>• يتم رد المبلغ إلى <strong className="font-medium text-brand-text">وسيلة الدفع الأصلية خلال 14 يومًا</strong> بعد فحص المنتج</li>
                </ul>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">كيفية طلب الاسترجاع</strong>
                <p>يرجى التواصل معنا خلال المدة المحددة مع تزويدنا <strong className="font-medium text-brand-text">برقم الطلب</strong>.<br />البريد الإلكتروني: support@formehaus.me</p>
              </div>
            </>
          ) : (
            <>
              <p>
                At Formé Haus, we strive to ensure you are satisfied with your purchase.<br />
                Customers may request a <strong className="font-medium text-brand-text">return or exchange within 7 days</strong> of receiving their order in accordance with Saudi E-Commerce Law.
              </p>

              <div>
                <strong className="font-medium text-brand-text block mb-2">To be eligible for a return:</strong>
                <ul className="list-none space-y-2">
                  <li>• The item must be <strong className="font-medium text-brand-text">unused, unworn, and in its original condition</strong></li>
                  <li>• All <strong className="font-medium text-brand-text">original packaging, tags, and accessories</strong> must be included</li>
                  <li>• <strong className="font-medium text-brand-text">Proof of purchase</strong> must be provided</li>
                </ul>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">Non-returnable items</strong>
                <p>For hygiene and product integrity reasons, returns are not accepted for <strong className="font-medium text-brand-text">sunglasses, phone cases, straps, or accessories once opened or used.</strong></p>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">Damaged or incorrect items</strong>
                <p>If you receive a damaged, defective, or incorrect item, please contact us within <strong className="font-medium text-brand-text">48 hours of delivery</strong>. Return shipping will be arranged <strong className="font-medium text-brand-text">at no cost</strong> in such cases.</p>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">Shipping & refunds</strong>
                <ul className="list-none space-y-2">
                  <li>• Original shipping fees are <strong className="font-medium text-brand-text">non-refundable for change-of-mind returns</strong></li>
                  <li>• Returned items are <strong className="font-medium text-brand-text">subject to inspection</strong></li>
                  <li>• Approved refunds are issued to the <strong className="font-medium text-brand-text">original payment method within 14 days</strong> after inspection</li>
                </ul>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">How to Request a Return</strong>
                <p>Please contact us within the eligible period and provide your <strong className="font-medium text-brand-text">order number</strong>.<br />Email: support@formehaus.me</p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
