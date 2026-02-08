import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { tokens, useStore, Icons } from './LuxuryStorefront';

// ============================================================================
// PRODUCT DETAIL PAGE
// ============================================================================

interface ProductDetailProps {
  product?: {
    id: string;
    sku: string;
    name: string;
    price: number;
    description: string;
    longDescription?: string;
    images: string[];
    sizes: string[];
    isNew?: boolean;
    inStoreServices?: string[];
    deliveryInfo?: string;
    giftingInfo?: string;
  };
}

const defaultProduct = {
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
  sizes: ['34', '36', '38', '40', '42', '44'],
  isNew: true,
  inStoreServices: [
    'Personal styling appointments available',
    'Alterations and repairs',
    'Complimentary gift wrapping',
  ],
  deliveryInfo: 'Complimentary express delivery. Orders placed before 2pm arrive the next business day. Free returns within 14 days.',
  giftingInfo: 'Make it special with our signature gift packaging. Add a personalized message to complete your gift.',
};

export default function ProductDetailPage({ product = defaultProduct }: ProductDetailProps) {
  const { state, dispatch } = useStore();
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const isWishlisted = state.wishlist.includes(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      // Shake animation or highlight size selector
      return;
    }
    dispatch({
      type: 'ADD_TO_CART',
      item: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
      },
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const accordionSections = [
    { id: 'services', title: 'In-store Service', content: product.inStoreServices },
    { id: 'delivery', title: 'Delivery & Returns', content: product.deliveryInfo },
    { id: 'gifting', title: 'Gifting', content: product.giftingInfo },
  ];

  // Suggested products for "Complete the Look"
  const suggestedProducts = [
    { id: '2', name: 'Silk Scarf', price: 2400, image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&q=80' },
    { id: '3', name: 'Leather Gloves', price: 1850, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80' },
    { id: '4', name: 'Wool Beret', price: 980, image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&q=80' },
  ];

  return (
    <div className="pdp">
      {/* Image Gallery */}
      <section className="pdp-gallery">
        <div className="gallery-main" ref={imageContainerRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              className="gallery-image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <img src={product.images[currentImage]} alt={product.name} />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button className="gallery-nav gallery-nav-prev" onClick={prevImage}>
            <Icons.ChevronLeft />
          </button>
          <button className="gallery-nav gallery-nav-next" onClick={nextImage}>
            <Icons.ChevronRight />
          </button>

          {/* Wishlist Button */}
          <button
            className="gallery-wishlist"
            onClick={() => dispatch({ type: 'TOGGLE_WISHLIST', id: product.id })}
          >
            <Icons.Heart filled={isWishlisted} />
          </button>

          {/* Image Counter */}
          <div className="gallery-counter">
            {currentImage + 1} / {product.images.length}
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="gallery-thumbnails">
          {product.images.map((img, idx) => (
            <button
              key={idx}
              className={`thumbnail ${idx === currentImage ? 'active' : ''}`}
              onClick={() => setCurrentImage(idx)}
            >
              <img src={img} alt={`View ${idx + 1}`} />
            </button>
          ))}
        </div>
      </section>

      {/* Product Info */}
      <section className="pdp-info">
        <div className="pdp-header">
          <span className="pdp-sku">{product.sku}</span>
          {product.isNew && <span className="pdp-badge">New</span>}
        </div>

        <h1 className="pdp-title">{product.name}</h1>
        <p className="pdp-price">AED {product.price.toLocaleString()}</p>

        {/* Size Selector */}
        <div className="pdp-sizes">
          <div className="sizes-header">
            <span>Select Size</span>
            <button className="size-guide-link">Size Guide</button>
          </div>
          <div className="sizes-grid">
            {product.sizes.map((size) => (
              <button
                key={size}
                className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
          {!selectedSize && (
            <p className="size-hint">Please select a size</p>
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          className={`pdp-add-to-cart ${addedToCart ? 'added' : ''}`}
          onClick={handleAddToCart}
          whileTap={{ scale: 0.98 }}
        >
          {addedToCart ? 'Added to Bag ✓' : 'Place in Cart'}
        </motion.button>

        <button className="pdp-contact-advisor">
          Contact an Advisor
        </button>

        {/* Description */}
        <div className="pdp-description">
          <p>{product.description}</p>
          {product.longDescription && (
            <>
              <AnimatePresence>
                {showFullDescription && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="pdp-description-extended"
                  >
                    {product.longDescription}
                  </motion.p>
                )}
              </AnimatePresence>
              <button
                className="see-more-btn"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? 'See Less' : 'See More'}
              </button>
            </>
          )}
        </div>

        {/* Accordion Sections */}
        <div className="pdp-accordions">
          {accordionSections.map((section) => (
            <div key={section.id} className="accordion-section">
              <button
                className="accordion-header"
                onClick={() =>
                  setExpandedSection(
                    expandedSection === section.id ? null : section.id
                  )
                }
              >
                <span>{section.title}</span>
                <motion.span
                  animate={{ rotate: expandedSection === section.id ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icons.Plus />
                </motion.span>
              </button>
              <AnimatePresence>
                {expandedSection === section.id && (
                  <motion.div
                    className="accordion-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {Array.isArray(section.content) ? (
                      <ul>
                        {section.content.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{section.content}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Complete the Look Section */}
      <section className="pdp-complete-look">
        <h2 className="complete-look-title">Complete the Look</h2>
        <div className="complete-look-grid">
          {suggestedProducts.map((item, index) => (
            <motion.a
              key={item.id}
              href={`/products/${item.id}`}
              className="suggested-product"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="suggested-product-image">
                <img src={item.image} alt={item.name} />
              </div>
              <h3 className="suggested-product-name">{item.name}</h3>
              <p className="suggested-product-price">AED {item.price.toLocaleString()}</p>
            </motion.a>
          ))}
        </div>
      </section>

      <style>{`
        .pdp {
          background: ${tokens.colors.ivory};
        }

        /* ========== Gallery ========== */
        .pdp-gallery {
          position: relative;
        }
        .gallery-main {
          position: relative;
          width: 100%;
          aspect-ratio: 3/4;
          background: ${tokens.colors.cream};
          overflow: hidden;
        }
        .gallery-image {
          width: 100%;
          height: 100%;
        }
        .gallery-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .gallery-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${tokens.colors.ivory};
          border: none;
          color: ${tokens.colors.black};
          cursor: pointer;
          transition: all ${tokens.timing.fast} ${tokens.easing.smooth};
          opacity: 0.9;
        }
        .gallery-nav:hover {
          opacity: 1;
          background: ${tokens.colors.black};
          color: ${tokens.colors.ivory};
        }
        .gallery-nav-prev {
          left: 16px;
        }
        .gallery-nav-next {
          right: 16px;
        }
        .gallery-wishlist {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${tokens.colors.ivory};
          border: none;
          border-radius: 50%;
          color: ${tokens.colors.black};
          cursor: pointer;
          transition: transform ${tokens.timing.fast} ${tokens.easing.smooth};
        }
        .gallery-wishlist:hover {
          transform: scale(1.1);
        }
        .gallery-counter {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          font-family: ${tokens.fonts.sans};
          font-size: 12px;
          color: ${tokens.colors.charcoal};
          background: ${tokens.colors.ivory};
          padding: 6px 14px;
        }
        .gallery-thumbnails {
          display: flex;
          gap: 8px;
          padding: 16px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .gallery-thumbnails::-webkit-scrollbar {
          display: none;
        }
        .thumbnail {
          flex-shrink: 0;
          width: 64px;
          height: 80px;
          padding: 0;
          background: none;
          border: 2px solid transparent;
          cursor: pointer;
          transition: border-color ${tokens.timing.fast} ${tokens.easing.smooth};
          overflow: hidden;
        }
        .thumbnail.active {
          border-color: ${tokens.colors.black};
        }
        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* ========== Product Info ========== */
        .pdp-info {
          padding: 24px 20px;
        }
        .pdp-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .pdp-sku {
          font-family: ${tokens.fonts.sans};
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: ${tokens.colors.midGray};
        }
        .pdp-badge {
          font-family: ${tokens.fonts.sans};
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: ${tokens.colors.charcoal};
          padding: 4px 10px;
          background: ${tokens.colors.cream};
        }
        .pdp-title {
          font-family: ${tokens.fonts.serif};
          font-size: 28px;
          font-weight: 400;
          line-height: 1.2;
          color: ${tokens.colors.black};
          margin-bottom: 12px;
        }
        .pdp-price {
          font-family: ${tokens.fonts.sans};
          font-size: 16px;
          color: ${tokens.colors.charcoal};
          margin-bottom: 32px;
        }

        /* ========== Size Selector ========== */
        .pdp-sizes {
          margin-bottom: 24px;
        }
        .sizes-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .sizes-header span {
          font-family: ${tokens.fonts.sans};
          font-size: 13px;
          font-weight: 500;
          color: ${tokens.colors.black};
        }
        .size-guide-link {
          background: none;
          border: none;
          font-family: ${tokens.fonts.sans};
          font-size: 12px;
          color: ${tokens.colors.charcoal};
          text-decoration: underline;
          cursor: pointer;
        }
        .sizes-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
        }
        .size-btn {
          padding: 14px 8px;
          background: transparent;
          border: 1px solid ${tokens.colors.warmGray};
          font-family: ${tokens.fonts.sans};
          font-size: 13px;
          color: ${tokens.colors.black};
          cursor: pointer;
          transition: all ${tokens.timing.fast} ${tokens.easing.smooth};
        }
        .size-btn:hover {
          border-color: ${tokens.colors.black};
        }
        .size-btn.selected {
          background: ${tokens.colors.black};
          border-color: ${tokens.colors.black};
          color: ${tokens.colors.ivory};
        }
        .size-hint {
          font-family: ${tokens.fonts.sans};
          font-size: 12px;
          color: ${tokens.colors.midGray};
          margin-top: 12px;
        }

        /* ========== CTA Buttons ========== */
        .pdp-add-to-cart {
          width: 100%;
          padding: 18px;
          background: ${tokens.colors.black};
          border: none;
          color: ${tokens.colors.ivory};
          font-family: ${tokens.fonts.sans};
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all ${tokens.timing.fast} ${tokens.easing.smooth};
          margin-bottom: 12px;
        }
        .pdp-add-to-cart:hover {
          opacity: 0.9;
        }
        .pdp-add-to-cart.added {
          background: #2d6a4f;
        }
        .pdp-contact-advisor {
          width: 100%;
          padding: 16px;
          background: transparent;
          border: none;
          font-family: ${tokens.fonts.sans};
          font-size: 13px;
          color: ${tokens.colors.charcoal};
          text-decoration: underline;
          cursor: pointer;
          margin-bottom: 32px;
        }

        /* ========== Description ========== */
        .pdp-description {
          padding-bottom: 24px;
          border-bottom: 1px solid ${tokens.colors.warmGray};
          margin-bottom: 0;
        }
        .pdp-description p {
          font-family: ${tokens.fonts.sans};
          font-size: 14px;
          line-height: 1.7;
          color: ${tokens.colors.charcoal};
        }
        .pdp-description-extended {
          margin-top: 16px;
          overflow: hidden;
        }
        .see-more-btn {
          background: none;
          border: none;
          font-family: ${tokens.fonts.sans};
          font-size: 13px;
          color: ${tokens.colors.black};
          text-decoration: underline;
          cursor: pointer;
          margin-top: 12px;
        }

        /* ========== Accordions ========== */
        .pdp-accordions {
          border-bottom: 1px solid ${tokens.colors.warmGray};
        }
        .accordion-section {
          border-top: 1px solid ${tokens.colors.warmGray};
        }
        .accordion-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 20px 0;
          background: none;
          border: none;
          font-family: ${tokens.fonts.sans};
          font-size: 14px;
          font-weight: 500;
          color: ${tokens.colors.black};
          cursor: pointer;
        }
        .accordion-content {
          overflow: hidden;
          padding-bottom: 20px;
        }
        .accordion-content p,
        .accordion-content li {
          font-family: ${tokens.fonts.sans};
          font-size: 13px;
          line-height: 1.7;
          color: ${tokens.colors.charcoal};
        }
        .accordion-content ul {
          list-style: none;
          padding: 0;
        }
        .accordion-content li {
          padding: 6px 0;
          padding-left: 16px;
          position: relative;
        }
        .accordion-content li::before {
          content: '·';
          position: absolute;
          left: 0;
          color: ${tokens.colors.midGray};
        }

        /* ========== Complete the Look ========== */
        .pdp-complete-look {
          padding: 48px 20px;
          border-top: 1px solid ${tokens.colors.warmGray};
        }
        .complete-look-title {
          font-family: ${tokens.fonts.serif};
          font-size: 22px;
          font-weight: 400;
          text-align: center;
          margin-bottom: 32px;
          color: ${tokens.colors.black};
        }
        .complete-look-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .suggested-product {
          text-decoration: none;
        }
        .suggested-product-image {
          aspect-ratio: 3/4;
          background: ${tokens.colors.cream};
          overflow: hidden;
          margin-bottom: 12px;
        }
        .suggested-product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ${tokens.easing.luxe};
        }
        .suggested-product:hover .suggested-product-image img {
          transform: scale(1.05);
        }
        .suggested-product-name {
          font-family: ${tokens.fonts.serif};
          font-size: 13px;
          color: ${tokens.colors.black};
          margin-bottom: 4px;
        }
        .suggested-product-price {
          font-family: ${tokens.fonts.sans};
          font-size: 12px;
          color: ${tokens.colors.charcoal};
        }

        /* ========== Desktop Layout ========== */
        @media (min-width: 1024px) {
          .pdp {
            display: grid;
            grid-template-columns: 1fr 420px;
            gap: 0;
          }
          .pdp-gallery {
            position: sticky;
            top: 77px;
            height: calc(100vh - 77px);
          }
          .gallery-main {
            height: calc(100% - 112px);
            aspect-ratio: auto;
          }
          .gallery-thumbnails {
            flex-wrap: nowrap;
            justify-content: center;
            padding: 16px 24px;
          }
          .thumbnail {
            width: 72px;
            height: 90px;
          }
          .pdp-info {
            padding: 40px;
            max-height: calc(100vh - 77px);
            overflow-y: auto;
          }
          .pdp-title {
            font-size: 32px;
          }
          .pdp-complete-look {
            grid-column: 1 / -1;
            padding: 80px 60px;
          }
          .complete-look-grid {
            max-width: 900px;
            margin: 0 auto;
            gap: 32px;
          }
        }
      `}</style>
    </div>
  );
}

export { ProductDetailPage };
