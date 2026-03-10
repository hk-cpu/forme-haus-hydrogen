import {type MetaFunction} from '@shopify/remix-oxygen';
import {PageHeader} from '~/components/Text';
import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

export const meta: MetaFunction = () => {
  return [{title: 'Privacy Policy | Formé Haus'}];
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-24 min-h-[70vh] container mx-auto px-6 md:px-12 max-w-3xl pb-24">
      <PageHeader heading="Privacy Policy" className="mb-12 text-center" />
      <div className="prose max-w-prose mx-auto prose-headings:text-[#4A3C31] prose-p:text-[#4A3C31]/80">
        <h3>Information Collection</h3>
        <p>Formé Haus values your privacy. We collect personal information (name, email, shipping address, and payment details) solely for the purpose of processing your orders and improving your luxury shopping experience.</p>
        
        <h3>Data Usage</h3>
        <p>Your data is securely encrypted and used exclusively by Formé Haus. We do not sell or share your personal information with uncompromising third parties. We may use your email to send updates about new collections with your consent.</p>

        <h3>Security</h3>
        <p>Our website utilizes industry-standard SSL encryption to protect your payment and personal information during transmission. All transactions are securely processed through trusted payment gateways (such as Mada, Apple Pay, and Visa).</p>
      </div>
    </div>
  );
}
