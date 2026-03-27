import {type MetaFunction} from '@shopify/remix-oxygen';

import {routeHeaders} from '~/data/cache';
import {useTranslation} from '~/hooks/useTranslation';

export const headers = routeHeaders;

export const meta: MetaFunction = () => {
  return [{title: 'Returns & Exchanges | Formé Haus'}];
};

export default function RefundPolicyPage() {
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
            {isArabic ? 'سياسة الاسترجاع والاستبدال' : 'Returns & Exchanges'}
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
              في <strong>Formé Haus</strong> نسعى لضمان رضاكم عن مشترياتكم.
            </p>
            <p>
              وفقًا لنظام التجارة الإلكترونية في المملكة العربية السعودية، يحق
              للعميل طلب <strong>الاسترجاع أو الاستبدال خلال 7 أيام</strong> من
              تاريخ الاستلام.
            </p>

            <h3>يشترط لقبول الطلب</h3>
            <ul>
              <li>
                أن يكون المنتج <strong>غير مستخدم وفي حالته الأصلية</strong>
              </li>
              <li>
                إرجاعه مع{' '}
                <strong>جميع التغليفات والبطاقات والمرفقات الأصلية</strong>
              </li>
              <li>
                تقديم <strong>إثبات الشراء</strong>
              </li>
            </ul>

            <h3>المنتجات غير القابلة للاسترجاع</h3>
            <p>
              لأسباب تتعلق بالنظافة وسلامة المنتج، لا يمكن استرجاع{' '}
              <strong>
                النظارات الشمسية أو أغطية الجوال أو الأشرطة أو الإكسسوارات
              </strong>{' '}
              بعد فتحها أو استخدامها.
            </p>

            <h3>المنتجات التالفة أو الخاطئة</h3>
            <p>
              في حال استلام منتج تالف أو مختلف عن الطلب، يرجى التواصل خلال{' '}
              <strong>48 ساعة من الاستلام</strong> وسيتم ترتيب الاسترجاع دون
              رسوم إضافية.
            </p>

            <h3>الشحن والاسترداد</h3>
            <ul>
              <li>
                رسوم الشحن الأصلية <strong>غير قابلة للاسترداد</strong> في حال
                تغيير الرأي
              </li>
              <li>
                تخضع المنتجات المرتجعة <strong>للفحص عند الاستلام</strong>
              </li>
              <li>
                يتم رد المبلغ إلى{' '}
                <strong>وسيلة الدفع الأصلية خلال 14 يومًا</strong> بعد فحص
                المنتج
              </li>
            </ul>

            <h3>كيفية طلب الاسترجاع</h3>
            <p>
              يرجى التواصل معنا خلال المدة المحددة مع تزويدنا{' '}
              <strong>برقم الطلب</strong>.
            </p>
            <p>
              <strong>البريد الإلكتروني:</strong>{' '}
              <a href="mailto:support@formehaus.me">support@formehaus.me</a>
            </p>
          </div>
        ) : (
          /* English */
          <div className="prose max-w-prose mx-auto prose-headings:text-[#4A3C31] prose-headings:font-serif prose-p:text-[#4A3C31]/80 prose-li:text-[#4A3C31]/80 font-light leading-relaxed">
            <p>
              At <strong>Formé Haus</strong>, we strive to ensure you are
              satisfied with your purchase.
            </p>
            <p>
              Customers may request a{' '}
              <strong>return or exchange within 7 days</strong> of receiving
              their order in accordance with Saudi E-Commerce Law.
            </p>

            <h3>To Be Eligible for a Return</h3>
            <ul>
              <li>
                The item must be{' '}
                <strong>unused, unworn, and in its original condition</strong>
              </li>
              <li>
                All <strong>original packaging, tags, and accessories</strong>{' '}
                must be included
              </li>
              <li>
                <strong>Proof of purchase</strong> must be provided
              </li>
            </ul>

            <h3>Non-Returnable Items</h3>
            <p>
              For hygiene and product integrity reasons, returns are not
              accepted for{' '}
              <strong>sunglasses, phone cases, straps, or accessories</strong>{' '}
              once opened or used.
            </p>

            <h3>Damaged or Incorrect Items</h3>
            <p>
              If you receive a damaged, defective, or incorrect item, please
              contact us within <strong>48 hours of delivery</strong>. Return
              shipping will be arranged <strong>at no cost</strong> in such
              cases.
            </p>

            <h3>Shipping &amp; Refunds</h3>
            <ul>
              <li>
                Original shipping fees are{' '}
                <strong>non-refundable for change-of-mind returns</strong>
              </li>
              <li>
                Returned items are <strong>subject to inspection</strong>
              </li>
              <li>
                Approved refunds are issued to the{' '}
                <strong>original payment method within 14 days</strong> after
                inspection
              </li>
            </ul>

            <h3>How to Request a Return</h3>
            <p>
              Please contact us within the eligible period and provide your{' '}
              <strong>order number</strong>.
            </p>
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:support@formehaus.me">support@formehaus.me</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
