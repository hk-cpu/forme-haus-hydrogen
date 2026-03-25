import {type MetaFunction} from '@shopify/remix-oxygen';
import {routeHeaders} from '~/data/cache';
import {useTranslation} from '~/hooks/useTranslation';

export const headers = routeHeaders;

export const meta: MetaFunction = () => {
  return [{title: 'Shipping Policy | Formé Haus'}];
};

export default function ShippingPolicyPage() {
  const {lang} = useTranslation();
  const isArabic = lang === 'AR';

  return (
    <div className="min-h-screen bg-[#F9F5F0]">
      <div className="pt-28 pb-24 container mx-auto px-6 md:px-12 max-w-3xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="block text-[10px] uppercase tracking-[0.35em] text-[#a87441] mb-4">
            {isArabic ? 'السياسات' : 'Policies'}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-[#4A3C31] tracking-wider">
            {isArabic ? 'سياسة الشحن والتوصيل' : 'Shipping & Delivery Policy'}
          </h1>
          <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-[#a87441]/50 to-transparent" />
        </div>

        {isArabic ? (
          /* Arabic */
          <div
            className="prose max-w-prose mx-auto prose-headings:text-[#4A3C31] prose-headings:font-serif prose-p:text-[#4A3C31]/80 prose-li:text-[#4A3C31]/80 font-light leading-relaxed"
            dir="rtl"
          >
            <p>
              يتم تجهيز الطلبات خلال <strong>1–3 أيام عمل</strong> بعد تأكيد الطلب.
            </p>

            <h3>مدة التوصيل التقديرية</h3>
            <ul>
              <li>
                <strong>داخل المملكة العربية السعودية:</strong> 2–5 أيام عمل
              </li>
              <li>
                <strong>دول مجلس التعاون الخليجي:</strong> 3–7 أيام عمل
              </li>
            </ul>

            <p>
              يتم احتساب رسوم الشحن عند إتمام الطلب بناءً على عنوان التوصيل.
            </p>

            <p>
              بالنسبة للطلبات التي يتم شحنها خارج المملكة العربية السعودية،
              يتحمل العميل أي رسوم جمركية أو ضرائب استيراد إن وجدت.
            </p>
          </div>
        ) : (
          /* English */
          <div className="prose max-w-prose mx-auto prose-headings:text-[#4A3C31] prose-headings:font-serif prose-p:text-[#4A3C31]/80 prose-li:text-[#4A3C31]/80 font-light leading-relaxed">
            <p>
              Orders are processed within <strong>1–3 business days</strong> after confirmation.
            </p>

            <h3>Estimated Delivery Times</h3>
            <ul>
              <li>
                <strong>Saudi Arabia:</strong> 2–5 business days
              </li>
              <li>
                <strong>GCC Countries:</strong> 3–7 business days
              </li>
            </ul>

            <p>
              Shipping fees are calculated at checkout based on the delivery location.
            </p>

            <p>
              For orders shipped outside Saudi Arabia, any applicable customs duties
              or import taxes are the responsibility of the customer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
