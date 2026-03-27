import {type MetaFunction} from '@shopify/remix-oxygen';

import {PageHeader} from '~/components/Text';
import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

export const meta: MetaFunction = () => {
  return [{title: 'FAQs | Formé Haus'}];
};

export default function FaqsPage() {
  return (
    <div className="pt-24 min-h-[70vh] container mx-auto px-6 md:px-12 max-w-3xl pb-24">
      <PageHeader
        heading="Frequently Asked Questions"
        className="mb-12 text-center"
      />
      <div className="space-y-8 text-[#4A3C31]">
        <div>
          <h3 className="font-serif text-2xl mb-2">
            What is your shipping policy?
          </h3>
          <p className="text-[#4A3C31]/80">
            We offer complimentary global shipping on all orders over 300 SAR.
            Standard delivery within Saudi Arabia takes 1-2 business days.
          </p>
        </div>
        <div>
          <h3 className="font-serif text-2xl mb-2">Do you accept returns?</h3>
          <p className="text-[#4A3C31]/80">
            Yes, we accept returns within 14 days of delivery. Items must be in
            their original condition and packaging. Please visit our Returns
            portal to initiate a process.
          </p>
        </div>
        <div>
          <h3 className="font-serif text-2xl mb-2">
            How do I care for my leather phone case?
          </h3>
          <p className="text-[#4A3C31]/80">
            To maintain the premium quality of your leather case, keep it away
            from direct sunlight and moisture. Clean gently with a soft, dry
            cloth.
          </p>
        </div>
        <div>
          <h3 className="font-serif text-2xl mb-2">
            Are your sunglasses polarized?
          </h3>
          <p className="text-[#4A3C31]/80">
            Our sunglasses collection features a mix of polarized and
            non-polarized 100% UV protection lenses. Please check individual
            product descriptions for specific details.
          </p>
        </div>
      </div>
    </div>
  );
}
