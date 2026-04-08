import {type MetaFunction} from '@shopify/remix-oxygen';

import {routeHeaders} from '~/data/cache';
import {useTranslation} from '~/hooks/useTranslation';

export const headers = routeHeaders;

export const meta: MetaFunction = () => {
  return [{title: 'Terms & Conditions | Formé Haus'}];
};

export default function TermsOfServicePage() {
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
            {isArabic ? 'الشروط والأحكام' : 'Terms & Conditions'}
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
              مرحبًا بكم في <strong>Formé Haus</strong>. باستخدامكم لهذا الموقع
              فإنكم توافقون على الالتزام بالشروط والأحكام التالية.
            </p>

            <h3>استخدام الموقع</h3>
            <p>
              يجب استخدام الموقع لأغراض مشروعة فقط وبما لا يؤثر على تشغيل الموقع
              أو ينتهك حقوق الآخرين.
            </p>

            <h3>معلومات المنتجات</h3>
            <p>
              نسعى إلى عرض معلومات دقيقة عن المنتجات بما في ذلك الوصف والصور
              والأسعار، ومع ذلك قد تحدث بعض الاختلافات البسيطة. تحتفظ{' '}
              <strong>Formé Haus</strong> بالحق في تصحيح الأخطاء أو تحديث
              المعلومات دون إشعار مسبق.
            </p>

            <h3>الطلبات</h3>
            <p>
              تخضع جميع الطلبات لتوفر المنتجات وموافقة{' '}
              <strong>Formé Haus</strong>. ونحتفظ بالحق في رفض أو إلغاء أي طلب
              في حال حدوث خطأ في التسعير، أو عدم توفر المنتج، أو الاشتباه في
              وجود نشاط احتيالي.
            </p>

            <h3>الملكية الفكرية</h3>
            <p>
              جميع المحتويات المعروضة على هذا الموقع، بما في ذلك النصوص والصور
              والشعارات والتصاميم، هي ملك لـ <strong>Formé Haus</strong> أو
              للجهات المالكة لها، ولا يجوز نسخها أو إعادة إنتاجها أو استخدامها
              دون إذن خطي مسبق.
            </p>

            <h3>تحديد المسؤولية</h3>
            <p>
              لا تتحمل <strong>Formé Haus</strong> المسؤولية عن أي أضرار غير
              مباشرة أو تبعية قد تنتج عن استخدام الموقع، وذلك في الحدود التي
              يسمح بها النظام.
            </p>

            <h3>القانون المعمول به</h3>
            <p>
              تخضع هذه الشروط والأحكام لأنظمة وقوانين المملكة العربية السعودية.
            </p>
          </div>
        ) : (
          /* English */
          <div className="prose max-w-prose mx-auto prose-headings:text-[#4A3C31] prose-headings:font-serif prose-p:text-[#4A3C31]/80 prose-li:text-[#4A3C31]/80 font-light leading-relaxed">
            <p>
              Welcome to <strong>Formé Haus</strong>. By accessing or using our
              website, you agree to the following Terms &amp; Conditions.
            </p>

            <h3>Use of the Website</h3>
            <p>
              You agree to use this website only for lawful purposes and in a
              manner that does not interfere with its operation or violate the
              rights of others.
            </p>

            <h3>Product Information</h3>
            <p>
              We strive to ensure that product descriptions, images, and pricing
              are accurate. However, minor variations may occur. Formé Haus
              reserves the right to correct errors or update product information
              without prior notice.
            </p>

            <h3>Orders</h3>
            <p>
              All orders are subject to product availability and acceptance by
              Formé Haus. We reserve the right to refuse or cancel any order if
              a pricing error occurs, if a product becomes unavailable, or if
              fraudulent activity is suspected.
            </p>

            <h3>Intellectual Property</h3>
            <p>
              All content on this website, including text, images, graphics,
              logos, and design elements, is the property of Formé Haus or its
              respective partners and may not be copied, reproduced, or used
              without prior written permission.
            </p>

            <h3>Limitation of Liability</h3>
            <p>
              Formé Haus shall not be liable for any indirect or consequential
              damages arising from the use of this website to the extent
              permitted by applicable law.
            </p>

            <h3>Governing Law</h3>
            <p>
              These Terms &amp; Conditions are governed by the laws and
              regulations of the Kingdom of Saudi Arabia.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
