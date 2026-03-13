import {type MetaFunction} from '@shopify/remix-oxygen';
import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

export const meta: MetaFunction = () => {
  return [{title: 'Shipping Policy | Formé Haus'}];
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F9F5F0]">
      <div className="pt-28 pb-24 container mx-auto px-6 md:px-12 max-w-3xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="block text-[10px] uppercase tracking-[0.35em] text-[#a87441] mb-4">
            Policies
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-[#4A3C31] tracking-wider">
            Shipping Policy
          </h1>
          <p className="font-serif text-xl md:text-2xl text-[#4A3C31]/60 mt-1" dir="rtl">
            سياسة الشحن
          </p>
          <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-[#a87441]/50 to-transparent" />
        </div>

        {/* English */}
        <div className="prose max-w-prose mx-auto prose-headings:text-[#4A3C31] prose-headings:font-serif prose-p:text-[#4A3C31]/80 prose-li:text-[#4A3C31]/80 font-light leading-relaxed">
          <p>
            Orders are processed within <strong>1–3 business days</strong>.
          </p>

          <h3>Estimated Delivery Times</h3>
          <ul>
            <li>Saudi Arabia: 2–5 business days</li>
            <li>GCC: 3–7 business days</li>
          </ul>

          <p>Shipping fees are calculated at checkout.</p>

          <p>Customs duties for orders outside Saudi Arabia are the customer's responsibility.</p>
        </div>

        {/* Divider */}
        <div className="my-14 h-px w-full bg-gradient-to-r from-transparent via-[#a87441]/20 to-transparent" />

        {/* Arabic */}
        <div className="prose max-w-prose mx-auto prose-headings:text-[#4A3C31] prose-headings:font-serif prose-p:text-[#4A3C31]/80 prose-li:text-[#4A3C31]/80 font-light leading-relaxed" dir="rtl">
          <p>
            يتم تجهيز الطلبات خلال <strong>1–3 أيام عمل</strong>.
          </p>

          <h3>مدة التوصيل التقديرية</h3>
          <ul>
            <li>داخل المملكة: 2–5 أيام عمل</li>
            <li>دول الخليج: 3–7 أيام عمل</li>
          </ul>

          <p>تُحتسب رسوم الشحن عند إتمام الطلب.</p>

          <p>أي رسوم جمركية خارج المملكة يتحملها العميل.</p>
        </div>
      </div>
    </div>
  );
}
