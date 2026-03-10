import {type MetaFunction} from '@shopify/remix-oxygen';
import {PageHeader} from '~/components/Text';
import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

export const meta: MetaFunction = () => {
  return [{title: 'Our Story | Formé Haus'}];
};

export default function AboutPage() {
  return (
    <div className="pt-24 min-h-[70vh] container mx-auto px-6 md:px-12 max-w-4xl pb-24">
      <PageHeader heading="Our Story" className="mb-12 text-center" />
      <div className="prose dark:prose-invert max-w-prose mx-auto prose-headings:text-[#4A3C31] prose-headings:font-serif prose-p:text-[#4A3C31]/80 text-center">
        <p className="mb-6 leading-relaxed">
          FORME HAUS Collection is an Australian Tech Accessory brand owned, run and led by women. We create purposeful pieces for our everyday wardrobe.
        </p>
      </div>
    </div>
  );
}
