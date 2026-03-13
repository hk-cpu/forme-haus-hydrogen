import {type MetaFunction} from '@shopify/remix-oxygen';
import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

export const meta: MetaFunction = () => {
  return [{title: 'Returns & Exchanges | Formé Haus'}];
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F9F5F0]">
      <div className="pt-28 pb-24 container mx-auto px-6 md:px-12 max-w-3xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="block text-[10px] uppercase tracking-[0.35em] text-[#a87441] mb-4">
            Policies
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-[#4A3C31] tracking-wider">
            Returns &amp; Exchanges
          </h1>
          <p className="font-serif text-xl md:text-2xl text-[#4A3C31]/60 mt-1" dir="rtl">
            سياسة الاسترجاع والاستبدال
          </p>
          <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-[#a87441]/50 to-transparent" />
        </div>

        {/* English */}
        <div className="prose max-w-prose mx-auto prose-headings:text-[#4A3C31] prose-headings:font-serif prose-p:text-[#4A3C31]/80 prose-li:text-[#4A3C31]/80 font-light leading-relaxed">
          <p>
            In accordance with Saudi E-Commerce Law, customers may request a return or exchange within <strong>7 days</strong> of receiving their order.
          </p>

          <h3>Eligibility</h3>
          <p>To be eligible:</p>
          <ul>
            <li>Item must be unused and in original condition</li>
            <li>Returned with all original packaging, tags, and accessories</li>
            <li>Proof of purchase must be provided</li>
          </ul>

          <h3>Non-Returnable Items</h3>
          <p>Returns are not accepted for:</p>
          <ul>
            <li>Used, worn, washed, or altered items</li>
            <li>Opened or used sunglasses, phone cases, straps, or accessories</li>
          </ul>

          <h3>Damaged or Incorrect Items</h3>
          <p>
            If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery. Return shipping will be arranged at no cost in such cases.
          </p>

          <p>Original shipping fees are non-refundable for change-of-mind returns.</p>

          <p>
            Approved refunds are issued to the original payment method within <strong>14 days</strong> after receiving and inspecting the returned item.
          </p>

          <h3>How to Request a Return</h3>
          <p>
            To request a return or exchange, please contact us within the eligible period and provide your order number:
          </p>
          <ul>
            <li>Email: support@formehaus.me</li>
          </ul>
        </div>

        {/* Divider */}
        <div className="my-14 h-px w-full bg-gradient-to-r from-transparent via-[#a87441]/20 to-transparent" />

        {/* Arabic */}
        <div className="prose max-w-prose mx-auto prose-headings:text-[#4A3C31] prose-headings:font-serif prose-p:text-[#4A3C31]/80 prose-li:text-[#4A3C31]/80 font-light leading-relaxed" dir="rtl">
          <p>
            وفقًا لنظام التجارة الإلكترونية في المملكة العربية السعودية، يحق للعميل طلب الاسترجاع أو الاستبدال خلال <strong>7 أيام</strong> من تاريخ الاستلام.
          </p>

          <h3>شروط القبول</h3>
          <p>يشترط لقبول الطلب:</p>
          <ul>
            <li>أن يكون المنتج غير مستخدم وفي حالته الأصلية</li>
            <li>إرجاعه مع جميع التغليفات والبطاقات والمرفقات الأصلية</li>
            <li>تقديم إثبات الشراء</li>
          </ul>

          <h3>المنتجات غير القابلة للاسترجاع</h3>
          <p>لا يقبل الاسترجاع للمنتجات:</p>
          <ul>
            <li>المستخدمة أو المرتدة أو المعدلة</li>
            <li>النظارات الشمسية أو أغطية الجوال أو الأشرطة أو الإكسسوارات بعد فتحها أو استخدامها</li>
          </ul>

          <h3>المنتجات التالفة أو الخاطئة</h3>
          <p>
            في حال استلام منتج تالف أو مختلف عن الطلب، يرجى التواصل خلال <strong>48 ساعة</strong> من الاستلام، وسيتم ترتيب الاسترجاع دون رسوم إضافية.
          </p>

          <p>رسوم الشحن الأصلية غير قابلة للاسترداد في حال تغيير الرأي.</p>

          <p>
            يتم رد المبلغ إلى وسيلة الدفع الأصلية خلال مدة لا تتجاوز <strong>14 يومًا</strong> من استلام المنتج المرتجع وفحصه.
          </p>

          <h3>كيفية تقديم طلب استرجاع</h3>
          <p>
            لطلب الاسترجاع أو الاستبدال، يرجى التواصل معنا خلال المدة المحددة مع تزويدنا برقم الطلب:
          </p>
          <ul>
            <li>البريد الإلكتروني: support@formehaus.me</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
