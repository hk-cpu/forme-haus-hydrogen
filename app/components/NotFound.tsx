import {Form} from '@remix-run/react';

import {Button} from './Button';
import {FeaturedProducts} from './FeaturedProducts';
import {PageHeader, Text} from './Text';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './Breadcrumb';
import {Input} from './Input';

export function NotFound({type = 'page'}: {type?: string}) {
  const heading = `Page Not Found`;
  const description = `We couldn't find the ${type} you're looking for. It may have been moved, renamed, or temporarily unavailable.`;

  return (
    <>
      {/* Breadcrumb */}
      <div className="px-6 md:px-12 lg:px-16 py-4 bg-cream">
        <Breadcrumb variant="light">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink to="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>404</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* 404 Content */}
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 md:px-12 lg:px-16 py-16 bg-cream">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Number */}
          <div className="font-serif text-[120px] md:text-[180px] leading-none text-bronze/20 mb-4 select-none">
            404
          </div>

          {/* Heading */}
          <h1 className="font-serif text-3xl md:text-5xl italic text-[#4A3C31] mb-6">
            {heading}
          </h1>

          {/* Description */}
          <p className="text-[15px] leading-relaxed text-[#5C5046] mb-8 max-w-lg mx-auto">
            {description}
          </p>

          {/* Search Bar */}
          <Form
            method="get"
            action="/search"
            className="relative max-w-md mx-auto mb-8"
          >
            <Input
              name="q"
              placeholder="Search our store..."
              type="search"
              variant="search"
              className="text-[#4A3C31]"
            />
            <button
              type="submit"
              className="absolute right-0 top-1/2 -translate-y-1/2 py-2 px-4 bg-[#a87441] text-white text-[11px] uppercase tracking-[0.2em] rounded hover:bg-[#8B5E3C] transition-colors"
            >
              Search
            </button>
          </Form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" to="/">
              Return to Home
            </Button>
            <Button variant="outline" to="/collections">
              Browse Collections
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <section className="px-6 md:px-12 lg:px-16 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#a87441] mb-3 block">
              You May Also Like
            </span>
            <h2 className="font-serif text-2xl md:text-3xl italic text-[#4A3C31]">
              Featured Products
            </h2>
          </div>
          <FeaturedProducts
            count={4}
            heading=""
            layout="page"
            sortKey="BEST_SELLING"
          />
        </div>
      </section>
    </>
  );
}
