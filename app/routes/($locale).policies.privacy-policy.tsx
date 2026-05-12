import {motion} from 'framer-motion';
import {type MetaFunction} from '@shopify/remix-oxygen';

import {routeHeaders} from '~/data/cache';
import {useTranslation} from '~/hooks/useTranslation';

export const headers = routeHeaders;

export const meta: MetaFunction = () => {
  return [{title: 'Privacy Policy | Formé Haus'}];
};

const EASE = [0.16, 1, 0.3, 1] as const;

export default function PrivacyPolicyPage() {
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
            {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
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
                في Formé Haus نحترم خصوصيتكم ونلتزم بحماية بياناتكم الشخصية
                وفقًا للأنظمة المعمول بها في المملكة العربية السعودية، بما في
                ذلك{' '}
                <strong className="font-medium text-brand-text">
                  نظام حماية البيانات الشخصية
                </strong>
                .
              </p>

              <div>
                <strong className="font-medium text-brand-text block mb-2">
                  البيانات التي نقوم بجمعها
                </strong>
                <p className="mb-2">
                  عند زيارة موقعنا أو إجراء عملية شراء، قد نقوم بجمع البيانات
                  التالية:
                </p>
                <ul className="list-none space-y-2">
                  <li>• الاسم الكامل</li>
                  <li>• البريد الإلكتروني ورقم الهاتف</li>
                  <li>• عنوان الشحن والفوترة</li>
                  <li>
                    • بيانات الدفع (تتم معالجتها بشكل آمن عبر مزودي خدمات الدفع
                    المعتمدين)
                  </li>
                  <li>• سجل الطلبات</li>
                  <li>• معلومات الجهاز والتصفح مثل عنوان IP</li>
                </ul>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">
                  كيفية استخدام البيانات
                </strong>
                <p className="mb-2">يتم استخدام بياناتكم الشخصية فقط من أجل:</p>
                <ul className="list-none space-y-2">
                  <li>• تنفيذ الطلبات وتوصيلها</li>
                  <li>• إدارة عمليات الدفع</li>
                  <li>• تقديم خدمة العملاء</li>
                  <li>• إرسال تحديثات الطلب</li>
                  <li>• تحسين الموقع والخدمات</li>
                </ul>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">
                  حماية البيانات
                </strong>
                <p>
                  تطبق Formé Haus إجراءات فنية وتنظيمية مناسبة لحماية البيانات
                  الشخصية. تتم معالجة بيانات الدفع عبر مزودي خدمات دفع معتمدين
                  ولا يتم تخزينها على خوادمنا.
                  <br />
                  على الرغم من تطبيق إجراءات أمنية مناسبة، لا يمكن ضمان أمان نقل
                  البيانات عبر الإنترنت بشكل كامل.
                </p>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">
                  مشاركة البيانات
                </strong>
                <p>
                  قد تتم مشاركة البيانات فقط مع جهات موثوقة لازمة لتشغيل
                  خدماتنا، مثل مزودي خدمات الدفع وشركات الشحن والخدمات اللوجستية
                  ومزودي خدمات تقنية المعلومات.
                </p>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">
                  حقوقكم
                </strong>
                <p>
                  وفقًا للأنظمة المعمول بها، يحق لكم طلب الوصول إلى بياناتكم
                  الشخصية أو تصحيحها أو حذفها في الحالات التي يسمح بها النظام.
                </p>
              </div>

              <div>
                <p>
                  للاستفسارات المتعلقة بالخصوصية يرجى التواصل معنا:
                  <br />
                  البريد الإلكتروني: support@formehaus.me
                </p>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">
                  تحديثات السياسة
                </strong>
                <p>
                  قد تقوم Formé Haus بتحديث سياسة الخصوصية من وقت لآخر، وسيتم
                  نشر أي تعديل على هذه الصفحة.
                </p>
              </div>
            </>
          ) : (
            <>
              <p>
                At Formé Haus, we respect your privacy and are committed to
                protecting your personal data in accordance with the laws of the
                Kingdom of Saudi Arabia, including the{' '}
                <strong className="font-medium text-brand-text">
                  Saudi Personal Data Protection Law
                </strong>
                .
              </p>

              <div>
                <strong className="font-medium text-brand-text block mb-2">
                  Information We Collect
                </strong>
                <p className="mb-2">
                  When you visit our website or place an order, we may collect:
                </p>
                <ul className="list-none space-y-2">
                  <li>• Full name</li>
                  <li>• Email address and phone number</li>
                  <li>• Shipping and billing address</li>
                  <li>• Payment details (processed securely)</li>
                  <li>• Order history</li>
                  <li>• Device information such as IP address</li>
                </ul>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">
                  How We Use Your Information
                </strong>
                <p className="mb-2">Your information is used only to:</p>
                <ul className="list-none space-y-2">
                  <li>• Process and deliver orders</li>
                  <li>• Manage payments</li>
                  <li>• Provide customer support</li>
                  <li>• Send order updates</li>
                  <li>• Improve our website and services</li>
                </ul>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">
                  Data Protection
                </strong>
                <p>
                  We apply appropriate technical and organizational measures to
                  protect personal data. Payment information is processed
                  securely through authorized providers and is not stored on our
                  servers.
                  <br />
                  While Formé Haus implements appropriate security measures, no
                  method of transmission over the internet can be guaranteed to
                  be completely secure.
                </p>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">
                  Sharing of Information
                </strong>
                <p>
                  Your information may be shared only with trusted service
                  providers necessary to operate our services, including payment
                  processors, shipping partners, and IT providers.
                </p>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">
                  Your Rights
                </strong>
                <p>
                  Under applicable laws, you may request access, correction, or
                  deletion of your personal data where legally permitted.
                </p>
              </div>

              <div>
                <p>
                  For privacy inquiries:
                  <br />
                  Email: support@formehaus.me
                </p>
              </div>

              <div>
                <strong className="font-medium text-brand-text block mb-2">
                  Policy Updates
                </strong>
                <p>
                  Formé Haus may update this policy from time to time. Any
                  changes will be published on this page.
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
