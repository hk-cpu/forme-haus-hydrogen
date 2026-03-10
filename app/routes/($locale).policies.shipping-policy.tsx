import {type MetaFunction} from '@shopify/remix-oxygen';
import {PageHeader} from '~/components/Text';
import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

export const meta: MetaFunction = () => {
  return [{title: 'Shipping Policy | Formé Haus'}];
};

export default function ShippingPolicyPage() {
  return (
    <div className="pt-24 min-h-[70vh] container mx-auto px-6 md:px-12 max-w-3xl pb-24">
      <PageHeader heading="Shipping Policy" className="mb-12 text-center" />
      <div className="prose max-w-prose mx-auto prose-headings:text-[#4A3C31] prose-p:text-[#4A3C31]/80">
        <h3>Domestic Shipping (Saudi Arabia)</h3>
        <p>We provide fast and reliable shipping across the Kingdom of Saudi Arabia. Standard delivery takes 1-2 business days. Shipping is complimentary on all orders over 300 SAR.</p>
        
        <h3>International Shipping</h3>
        <p>Formé Haus ships globally. International orders are dispatched via our premium courier partners and typically arrive within 5-7 business days depending on the destination. Customs and import duties are the responsibility of the customer.</p>

        <h3>Order Processing</h3>
        <p>Orders are processed and dispatched within 24 hours of placement (excluding weekends and public holidays). Once your order has been shipped, you will receive a tracking link via email and SMS.</p>
      </div>
    </div>
  );
}
