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
          <h1 className="font-serif text-3xl md:text-4xl text-brand-text tracking-wider">
            {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </h1>
          <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-[#a87441]/50 to-transparent" />
        </div>

        {isArabic ? (
          /* Arabic */
          <div
            className={`prose max-w-prose mx-auto prose-headings:text-brand-text prose-headings:font-serif prose-p:text-brand-text/80 prose-li:text-brand-text/80 font-light leading-relaxed ${
              isArabic ? 'text-right' : 'text-left'
            }`}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            <p>
              في <strong>Formé Haus</strong> نحترم خصوصيتكم ونلتزم بحماية
              بياناتكم الشخصية وفقًا لأنظمة المملكة العربية السعودية، بما في ذلك
              نظام حماية البيانات الشخصية.
            </p>

            <h3>البيانات التي نجمعها</h3>
            <p>عند زيارتكم للموقع أو إتمام طلب، قد نجمع:</p>
            <ul>
              <li>الاسم الكامل</li>
              <li>البريد الإلكتروني ورقم الهاتف</li>
              <li>عنوان الشحن والفوترة</li>
              <li>تفاصيل الدفع (تُعالج بشكل آمن)</li>
              <li>سجل الطلبات</li>
              <li>معلومات الجهاز مثل عنوان IP</li>
            </ul>

            <h3>كيفية استخدام البيانات</h3>
            <p>تُستخدم بياناتكم فقط من أجل:</p>
            <ul>
              <li>معالجة الطلبات وتوصيلها</li>
              <li>إدارة المدفوعات</li>
              <li>تقديم خدمة العملاء</li>
              <li>إرسال تحديثات الطلبات</li>
              <li>تحسين الموقع والخدمات</li>
            </ul>

            <h3>حماية البيانات</h3>
            <p>
              نطبق تدابير تقنية وتنظيمية مناسبة لحماية بياناتكم الشخصية من
              الوصول غير المصرح به أو الإفصاح أو التعديل أو الإتلاف.
            </p>

            <h3>حقوقكم</h3>
            <p>
              وفقًا للأنظمة المعمول بها، يحق لكم طلب الوصول إلى بياناتكم الشخصية
              أو تصحيحها أو حذفها في الحالات التي يسمح بها النظام.
            </p>
            <p>للاستفسارات المتعلقة بالخصوصية يرجى التواصل معنا:</p>
            <p>
              <strong>البريد الإلكتروني:</strong>{' '}
              <a href="mailto:support@formehaus.me">support@formehaus.me</a>
            </p>

            <h3>تحديثات السياسة</h3>
            <p>
              قد تقوم Formé Haus بتحديث سياسة الخصوصية من وقت لآخر، وسيتم نشر أي
              تعديل على هذه الصفحة.
            </p>
          </div>
        ) : (
          /* English */
          <div className="prose max-w-prose mx-auto prose-headings:text-brand-text prose-headings:font-serif prose-p:text-brand-text/80 prose-li:text-brand-text/80 font-light leading-relaxed text-left">
            <p>
              At <strong>Formé Haus</strong>, we respect your privacy and are
              committed to protecting your personal data in accordance with the
              laws of the Kingdom of Saudi Arabia, including the Saudi Personal
              Data Protection Law.
            </p>

            <h3>Information We Collect</h3>
            <p>When you visit our website or place an order, we may collect:</p>
            <ul>
              <li>Full name</li>
              <li>Email address and phone number</li>
              <li>Shipping and billing address</li>
              <li>Payment details (processed securely)</li>
              <li>Order history</li>
              <li>Device information such as IP address</li>
            </ul>

            <h3>How We Use Your Information</h3>
            <p>Your information is used only to:</p>
            <ul>
              <li>Process and deliver orders</li>
              <li>Manage payments</li>
              <li>Provide customer support</li>
              <li>Send order updates</li>
              <li>Improve our website and services</li>
            </ul>

            <h3>Data Protection</h3>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal data against unauthorized access,
              disclosure, alteration, or destruction.
            </p>

            <h3>Your Rights</h3>
            <p>
              In accordance with applicable regulations, you have the right to
              request access to, correction of, or deletion of your personal
              data where permitted by law.
            </p>
            <p>For privacy inquiries, please contact us:</p>
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:support@formehaus.me">support@formehaus.me</a>
            </p>

            <h3>Policy Updates</h3>
            <p>
              Formé Haus may update this Privacy Policy from time to time. Any
              changes will be published on this page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
