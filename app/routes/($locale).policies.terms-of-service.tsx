import {type MetaFunction} from '@shopify/remix-oxygen';
import {routeHeaders} from '~/data/cache';
import {useTranslation} from '~/hooks/useTranslation';

export const headers = routeHeaders;

export const meta: MetaFunction = () => {
  return [{title: 'Terms of Service | Formé Haus'}];
};

export default function TermsOfServicePage() {
  const {language} = useTranslation();
  const isArabic = language === 'AR';

  return (
    <div className="min-h-screen bg-[#F9F5F0]">
      <div className="pt-28 pb-24 container mx-auto px-6 md:px-12 max-w-3xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="block text-[10px] uppercase tracking-[0.35em] text-[#a87441] mb-4">
            {isArabic ? 'السياسات' : 'Policies'}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-[#4A3C31] tracking-wider">
            {isArabic ? 'شروط الخدمة' : 'Terms of Service'}
          </h1>
          <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-[#a87441]/50 to-transparent" />
        </div>

        {isArabic ? (
          /* Arabic */
          <div className="prose max-w-prose mx-auto prose-headings:text-[#4A3C31] prose-headings:font-serif prose-p:text-[#4A3C31]/80 prose-li:text-[#4A3C31]/80 font-light leading-relaxed" dir="rtl">
            <h3>قبول الشروط</h3>
            <p>باستخدام موقع فورمي هاوس، فإنك توافق على الالتزام بهذه الشروط. إذا كنت لا توافق، يرجى الامتناع عن استخدام الموقع.</p>

            <h3>التسعير وتوفر المنتجات</h3>
            <p>جميع الأسعار بالريال السعودي ما لم يُذكر خلاف ذلك. نحتفظ بحق تعديل الأسعار وإيقاف المنتجات دون إشعار. نبذل قصارى جهدنا لعرض الألوان بدقة، ولكن لا يمكننا ضمان دقة عرض جهازك.</p>

            <h3>الملكية الفكرية</h3>
            <p>جميع المحتويات على هذا الموقع، بما في ذلك الصور والتصاميم والشعارات والنصوص، هي ملكية فورمي هاوس ومحمية بموجب قوانين حقوق النشر الدولية. يحظر Strictly إعادة الإنتاج أو الاستخدام غير المصرح به.</p>
          </div>
        ) : (
          /* English */
          <div className="prose max-w-prose mx-auto prose-headings:text-[#4A3C31] prose-headings:font-serif prose-p:text-[#4A3C31]/80 prose-li:text-[#4A3C31]/80 font-light leading-relaxed">
            <h3>Acceptance of Terms</h3>
            <p>By accessing and using the Formé Haus website, you agree to comply with and be bound by these Terms of Service. If you do not agree, please refrain from using our storefront.</p>

            <h3>Product Pricing and Availability</h3>
            <p>All prices are listed in Saudi Riyals (SAR) unless otherwise specified. We reserve the right to modify prices and discontinue products without notice. We make every effort to display colors and textures accurately, but cannot guarantee your device's display.</p>

            <h3>Intellectual Property</h3>
            <p>All content on this website, including imagery, design, logos, and text, is the property of Formé Haus and is protected by international copyright laws. Unauthorized reproduction or use is strictly prohibited.</p>
          </div>
        )}
      </div>
    </div>
  );
}
