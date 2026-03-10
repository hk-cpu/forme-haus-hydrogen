import {type MetaFunction} from '@shopify/remix-oxygen';
import {PageHeader} from '~/components/Text';
import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

export const meta: MetaFunction = () => {
  return [{title: 'Terms of Service | Formé Haus'}];
};

export default function TermsOfServicePage() {
  return (
    <div className="pt-24 min-h-[70vh] container mx-auto px-6 md:px-12 max-w-3xl pb-24">
      <PageHeader heading="Terms of Service" className="mb-12 text-center" />
      <div className="prose max-w-prose mx-auto prose-headings:text-[#4A3C31] prose-p:text-[#4A3C31]/80">
        <h3>Acceptance of Terms</h3>
        <p>By accessing and using the Formé Haus website, you agree to comply with and be bound by these Terms of Service. If you do not agree, please refrain from using our storefront.</p>
        
        <h3>Product Pricing and Availability</h3>
        <p>All prices are listed in Saudi Riyals (SAR) unless otherwise specified. We reserve the right to modify prices and discontinue products without notice. We make every effort to display colors and textures accurately, but cannot guarantee your device's display.</p>

        <h3>Intellectual Property</h3>
        <p>All content on this website, including imagery, design, logos, and text, is the property of Formé Haus and is protected by international copyright laws. Unauthorized reproduction or use is strictly prohibited.</p>
      </div>
    </div>
  );
}
