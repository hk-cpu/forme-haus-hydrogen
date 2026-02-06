import type {Product} from '@shopify/hydrogen/storefront-api-types';

// Fallback placeholder content for Formé Haus
const PLACEHOLDERS = {
  HEROS: [
    // primaryHero
    {
      heading: {value: 'Modern Elegance'},
      byline: {
        value: 'Discover our curated collection of luxury womenswear',
      },
      cta: {value: 'Shop Now →'},
      handle: 'new-arrivals',
      spread: {
        reference: {
          mediaContentType: 'IMAGE',
          alt: 'Elegant woman in flowing dress against minimalist backdrop',
          previewImage: {
            url: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/files/Hydrogen_Hero_Feature_1.jpg?v=1654902468',
          },
          id: 'gid://shopify/MediaImage/29259478466616',
          image: {
            url: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/files/Hydrogen_Hero_Feature_1.jpg?v=1654902468',
            width: 2500,
            height: 3155,
          },
        },
      },
      spreadSecondary: {
        reference: {
          __typename: 'MediaImage',
          mediaContentType: 'IMAGE',
          alt: 'Close-up detail of premium fabric texture and craftsmanship',
          previewImage: {
            url: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/files/Hydrogen_Hero_Feature_2.jpg?v=1654902468',
          },
          id: 'gid://shopify/MediaImage/29259478499384',
          image: {
            url: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/files/Hydrogen_Hero_Feature_2.jpg?v=1654902468',
            width: 2500,
            height: 3155,
          },
        },
      },
      height: 'full',
      top: true,
      decoding: 'sync',
      loading: 'eager',
    },
    // secondaryHero
    {
      heading: {value: 'From Day to Evening'},
      byline: null,
      cta: {value: 'Shop Now →'},
      handle: 'evening-wear',
      spread: {
        reference: {
          __typename: 'MediaImage',
          mediaContentType: 'IMAGE',
          alt: 'Sophisticated evening wear collection showcase',
          previewImage: {
            url: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/files/Chalet_Collection_Feature_1.jpg?v=1654902306',
          },
          id: 'gid://shopify/MediaImage/29259478368312',
          image: {
            url: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/files/Chalet_Collection_Feature_1.jpg?v=1654902306',
            width: 2500,
            height: 2500,
          },
        },
      },
      spreadSecondary: {
        reference: {
          __typename: 'MediaImage',
          mediaContentType: 'IMAGE',
          alt: 'Elegant accessories and styling details',
          previewImage: {
            url: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/files/Chalet_Collection_Feature_2.jpg?v=1654902306',
          },
          id: 'gid://shopify/MediaImage/29259478401080',
          image: {
            url: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/files/Chalet_Collection_Feature_2.jpg?v=1654902306',
            width: 2500,
            height: 2500,
          },
        },
      },
    },
    // tertiaryHero
    {
      heading: {value: 'The New Season Collection'},
      byline: {value: 'Just Arrived'},
      cta: {value: 'Shop Now →'},
      handle: 'new-season',
      spread: {
        reference: {
          __typename: 'MediaImage',
          mediaContentType: 'IMAGE',
          alt: 'Models showcasing the latest collection pieces',
          previewImage: {
            url: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/files/Collection_Feature_Wide.jpg?v=1654902160',
          },
          id: 'gid://shopify/MediaImage/29259478302776',
          image: {
            url: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/files/Collection_Feature_Wide.jpg?v=1654902160',
            width: 5000,
            height: 2500,
          },
        },
      },
      spreadSecondary: null,
    },
  ],
  PRODUCT_INFO: [
    {
      title: 'Description',
      content:
        'Crafted with meticulous attention to detail, this piece embodies the Formé Haus commitment to quality and timeless design. Made from premium materials for lasting comfort and elegance.',
    },
    {
      title: 'Size and Fit',
      content:
        'This garment features a relaxed, true-to-size fit. For a more tailored silhouette, consider sizing down. Model is wearing size S. Refer to our size guide for detailed measurements.',
    },
    {
      title: 'Delivery and Returns',
      content: `We offer complimentary shipping on all orders over 500 SAR within Saudi Arabia. International shipping available. Returns accepted within 14 days of delivery for unworn items with original tags attached. Please see our full return policy for details.`,
    },
  ],
  PRODUCT: {
    label: 'New Arrival',
    id: 'gid://shopify/Product/6730850828344',
    title: 'Silk Evening Dress',
    publishedAt: '2024-01-15T10:00:00Z',
    handle: 'silk-evening-dress',
    description:
      'An exquisite silk evening dress featuring fluid draping and a refined silhouette. The premium silk fabric offers luxurious feel and elegant movement. Perfect for special occasions and evening events.',
    priceRange: {
      minVariantPrice: {
        amount: '2500.0',
        currencyCode: 'SAR',
      },
      maxVariantPrice: {
        amount: '2500.0',
        currencyCode: 'SAR',
      },
    },
    options: [
      {
        name: 'Color',
        values: ['Midnight', 'Champagne', 'Blush'],
      },
      {
        name: 'Size',
        values: ['XS', 'S', 'M', 'L', 'XL'],
      },
    ],
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/41007289630776',
          image: {
            url: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/products/hydrogen-morning.jpg?v=1636146509',
            altText: 'Silk Evening Dress in Midnight',
            width: 1200,
            height: 1504,
          },
          price: {
            amount: '2500.0',
            currencyCode: 'SAR',
          },
          compareAtPrice: {
            amount: '3200.0',
            currencyCode: 'SAR',
          },
        },
      ],
    },
  },
};

/**
 * getHeroPlaceholder() returns placeholder content when the expected metafields
 * don't exist. Define the following five custom metafields on your Shopify store to override placeholders:
 * - hero.title             Single line text
 * - hero.byline            Single line text
 * - hero.cta               Single line text
 * - hero.spread            File
 * - hero.spread_secondary   File
 *
 * @see https://help.shopify.com/manual/metafields/metafield-definitions/creating-custom-metafield-definitions
 * @see https://github.com/Shopify/hydrogen/discussions/1790
 */

export function getHeroPlaceholder(heros: any[]) {
  if (!heros?.length) return [];

  // when we pass a collection without metafields,
  // we merge it with placeholder data
  return heros.map((hero, index) => {
    // assume passed hero has metafields data already
    if (hero?.heading?.value) {
      return hero;
    }

    // hero placeholder
    const placeholder = PLACEHOLDERS.HEROS[index];

    // prioritize metafield data if available, else the hero hero values
    // otherwise the placeholder values
    const byLine =
      hero?.byLine || hero?.descriptionHtml
        ? {value: hero.descriptionHtml}
        : placeholder.byline;

    const heading =
      hero?.heading || hero?.title ? {value: hero.title} : placeholder.heading;

    // merge hero placeholder with hero data
    return {
      heading,
      byLine,
      cta: hero?.cta || placeholder.cta,
      handle: hero?.handle || placeholder.handle,
      id: hero?.id || index,
      spread: hero?.spread || placeholder.spread,
      spreadSecondary: hero?.spreadSecondary || placeholder.spreadSecondary,
      height: placeholder?.height || undefined,
      top: placeholder?.top || undefined,
    };
  });
}

// get product info placeholder data
export function getProductInfoPlaceholder() {
  function getMultipleRandom(arr: any[], infos: number) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, infos);
  }
  return getMultipleRandom(PLACEHOLDERS.PRODUCT_INFO, 3);
}

export function getProductPlaceholder(): Product {
  return PLACEHOLDERS.PRODUCT as unknown as Product;
}
