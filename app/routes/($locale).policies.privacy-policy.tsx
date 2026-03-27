import {type MetaFunction} from '@shopify/remix-oxygen';

import {routeHeaders} from '~/data/cache';
import {useTranslation} from '~/hooks/useTranslation';

export const headers = routeHeaders;

export const meta: MetaFunction = () => {
  return [{title: 'Privacy Policy | Formé Haus'}];
};

export default function PrivacyPolicyPage() {
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
            {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
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
              تحترم فورمي هاوس خصوصيتكم وتلتزم بحماية بياناتكم الشخصية وفقًا
              للأنظمة المعمول بها في المملكة العربية السعودية، بما في ذلك نظام
              حماية البيانات الشخصية.
            </p>

            <h3>البيانات التي نقوم بجمعها</h3>
            <p>
              قد نقوم بجمع البيانات التالية عند استخدام الموقع أو إجراء عملية
              شراء:
            </p>
            <ul>
              <li>الاسم الكامل</li>
              <li>البريد الإلكتروني ورقم الهاتف</li>
              <li>عنوان الشحن والفوترة</li>
              <li>بيانات الدفع (تتم معالجتها بشكل آمن)</li>
              <li>سجل الطلبات والمعاملات</li>
              <li>معلومات الجهاز والتصفح (مثل عنوان IP)</li>
            </ul>

            <h3>كيفية استخدام البيانات</h3>
            <p>يتم استخدام البيانات فقط من أجل:</p>
            <ul>
              <li>تنفيذ الطلبات وتوصيلها</li>
              <li>إدارة عمليات الدفع</li>
              <li>تقديم خدمة العملاء</li>
              <li>إرسال تحديثات الطلب والإشعارات المهمة</li>
              <li>تحسين الموقع والخدمات</li>
            </ul>
            <p>
              لن يتم استخدام البيانات لغير هذه الأغراض إلا إذا تطلب النظام ذلك.
            </p>

            <h3>حماية البيانات</h3>
            <p>
              تطبق فورمي هاوس إجراءات فنية وتنظيمية مناسبة لحماية البيانات
              الشخصية. يتم معالجة بيانات الدفع عبر مزودي خدمات دفع معتمدين ولا
              يتم تخزينها على خوادمنا.
            </p>

            <h3>مشاركة البيانات</h3>
            <p>
              قد تتم مشاركة البيانات مع جهات موثوقة لأغراض تشغيلية فقط، مثل:
            </p>
            <ul>
              <li>مزودي خدمات الدفع</li>
              <li>شركات الشحن والخدمات اللوجستية</li>
              <li>مزودي خدمات تقنية المعلومات</li>
            </ul>
            <p>وتلتزم هذه الجهات بسرية وأمان البيانات.</p>

            <h3>حقوقكم</h3>
            <p>يحق لكم وفقًا للنظام:</p>
            <ul>
              <li>الوصول إلى بياناتكم الشخصية</li>
              <li>طلب تصحيح البيانات غير الدقيقة</li>
              <li>طلب حذف البيانات وفقًا لما يسمح به النظام</li>
            </ul>
            <p>للتواصل معنا:</p>
            <ul>
              <li>البريد الإلكتروني: support@formehaus.me</li>
            </ul>

            <h3>تحديثات السياسة</h3>
            <p>
              قد يتم تحديث هذه السياسة عند الحاجة، وسيتم نشر أي تعديل على هذه
              الصفحة.
            </p>
          </div>
        ) : (
          /* English */
          <div className="prose max-w-prose mx-auto prose-headings:text-[#4A3C31] prose-headings:font-serif prose-p:text-[#4A3C31]/80 prose-li:text-[#4A3C31]/80 font-light leading-relaxed">
            <p>
              Formé Haus respects your privacy and is committed to protecting
              your personal data in accordance with the laws of the Kingdom of
              Saudi Arabia, including the Saudi Personal Data Protection Law
              (PDPL).
            </p>

            <h3>Information We Collect</h3>
            <p>
              We may collect the following information when you visit our
              website or place an order:
            </p>
            <ul>
              <li>Full name</li>
              <li>Email address and phone number</li>
              <li>Shipping and billing address</li>
              <li>Payment details (processed securely)</li>
              <li>Order and transaction history</li>
              <li>Device and browsing information (e.g., IP address)</li>
            </ul>

            <h3>How We Use Your Information</h3>
            <p>Your data is used only to:</p>
            <ul>
              <li>Process and deliver orders</li>
              <li>Manage payments</li>
              <li>Provide customer support</li>
              <li>Send order updates and service notifications</li>
              <li>Improve our website and services</li>
            </ul>
            <p>
              We do not use your personal data for purposes other than those
              stated, unless required or permitted by law.
            </p>

            <h3>Data Protection</h3>
            <p>
              We apply appropriate technical and organizational measures to
              protect your personal data. Payment information is processed
              securely through authorized third-party providers and is not
              stored on our servers.
            </p>

            <h3>Sharing of Information</h3>
            <p>
              Your information may be shared only with trusted service providers
              for operational purposes, including:
            </p>
            <ul>
              <li>Payment processors</li>
              <li>Shipping and logistics partners</li>
              <li>IT service providers</li>
            </ul>
            <p>
              All third parties are required to maintain confidentiality and
              data security.
            </p>

            <h3>Your Rights</h3>
            <p>In accordance with applicable laws, you have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion where legally permissible</li>
            </ul>
            <p>To exercise your rights, contact us at:</p>
            <ul>
              <li>Email: support@formehaus.me</li>
            </ul>

            <h3>Policy Updates</h3>
            <p>
              Formé Haus may update this Privacy Policy when necessary. Any
              changes will be published on this page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
