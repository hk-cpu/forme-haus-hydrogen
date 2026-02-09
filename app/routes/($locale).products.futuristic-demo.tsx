// ============================================================================
// FUTURISTIC PRODUCT DEMO ROUTE
// ============================================================================
// Demonstrates the new immersive scrollytelling, 3D viewer, and tactile
// maximalism effects without modifying existing product logic.

import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import FuturisticProductOverlay from '~/components/FuturisticProductOverlay';
import ProductDetailPage from '~/components/ProductDetailPage';

// Import the futuristic polish CSS
import '~/styles/futuristic-polish.css';

// ============================================================================
// DEMO PRODUCT DATA
// ============================================================================

const demoProduct = {
  id: '1AJIYZ',
  sku: '1AJIYZ',
  name: 'Signature Wool Cashmere Coat',
  price: 18500,
  description: 'An elegant wool-cashmere coat featuring a refined silhouette and meticulous craftsmanship. This timeless piece embodies the essence of luxury outerwear.',
  longDescription: 'Crafted from the finest wool-cashmere blend, this coat represents the pinnacle of luxury tailoring. The double-faced construction eliminates the need for lining, creating a lightweight yet warm garment. Features include hand-stitched lapels, horn buttons, and a concealed interior pocket. The relaxed fit allows for comfortable layering while maintaining a sophisticated drape.',
  images: [
    'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1200&q=90',
    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1200&q=90',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=90',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&q=90',
  ],
  // Note: Add a 3D model URL here to enable 3D view
  // model3d: '/models/coat.glb',
  sizes: ['34', '36', '38', '40', '42', '44'],
  isNew: true,
  inStoreServices: [
    'Personal styling appointments available',
    'Alterations and repairs',
    'Complimentary gift wrapping',
  ],
  deliveryInfo: 'Complimentary express delivery. Orders placed before 2pm arrive the next business day. Free returns within 14 days.',
  giftingInfo: 'Make it special with our signature gift packaging. Add a personalized message to complete your gift.',
  features: [
    {
      id: 'materials',
      title: 'Premium Materials',
      description: 'Sourced from the finest mills in Italy and France, our fabrics undergo a rigorous selection process ensuring only the highest quality materials touch your skin.',
      image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=90',
      highlight: 'Italian Wool-Cashmere',
    },
    {
      id: 'craftsmanship',
      title: 'Artisan Craftsmanship',
      description: 'Each piece is handcrafted by master artisans with decades of experience in luxury fashion. Every stitch tells a story of dedication and precision.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=90',
      highlight: '120+ Hours of Work',
    },
    {
      id: 'details',
      title: 'Signature Details',
      description: 'From hand-stitched lapels to genuine horn buttons, every detail speaks of uncompromising quality and attention to the finest elements.',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=90',
      highlight: 'Hand-Finished',
    },
    {
      id: 'sustainability',
      title: 'Sustainable Luxury',
      description: 'Committed to responsible fashion with eco-conscious materials and ethical production practices that honor both craft and planet.',
      image: 'https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=800&q=90',
      highlight: 'Carbon Neutral',
    },
  ],
};

// ============================================================================
// LOADER
// ============================================================================

export async function loader({ context }: LoaderFunctionArgs) {
  // In a real scenario, you would fetch the product data here
  // For demo purposes, we're using static data
  return {
    product: demoProduct,
  };
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function FuturisticProductDemo() {
  const { product } = useLoaderData<typeof loader>();
  
  return (
    <div className="futuristic-demo-page">
      {/* 
        The FuturisticProductOverlay wraps the standard ProductDetailPage
        and adds the new immersive, 3D, and polished experiences as an
        optional layer without modifying the original component.
      */}
      <FuturisticProductOverlay product={product}>
        <ProductDetailPage product={product} />
      </FuturisticProductOverlay>
      
      <style>{`
        .futuristic-demo-page {
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
}
