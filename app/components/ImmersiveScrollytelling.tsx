// ============================================================================
// IMMERSIVE SCROLLYTELLING - Futuristic Product Storytelling Component
// ============================================================================
// An additive layer that creates scroll-triggered narrative reveals
// without modifying existing ProductDetailPage logic

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ScrollytellingProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    features?: ProductFeature[];
    materials?: string[];
    craftsmanship?: string;
  };
}

interface ProductFeature {
  id: string;
  title: string;
  description: string;
  image: string;
  highlight: string;
}

interface ScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

// ============================================================================
// DEFAULT DATA
// ============================================================================

const defaultFeatures: ProductFeature[] = [
  {
    id: 'materials',
    title: 'Premium Materials',
    description: 'Sourced from the finest mills in Italy and France, our fabrics undergo a rigorous selection process.',
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=90',
    highlight: 'Italian Wool-Cashmere Blend',
  },
  {
    id: 'craftsmanship',
    title: 'Artisan Craftsmanship',
    description: 'Each piece is handcrafted by master artisans with decades of experience in luxury fashion.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=90',
    highlight: '120+ Hours of Work',
  },
  {
    id: 'details',
    title: 'Signature Details',
    description: 'From hand-stitched lapels to genuine horn buttons, every detail speaks of uncompromising quality.',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=90',
    highlight: 'Hand-Finished Elements',
  },
  {
    id: 'sustainability',
    title: 'Sustainable Luxury',
    description: 'Committed to responsible fashion with eco-conscious materials and ethical production practices.',
    image: 'https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=800&q=90',
    highlight: 'Carbon Neutral Certified',
  },
];

// ============================================================================
// KINETIC TYPOGRAPHY COMPONENT
// ============================================================================

function KineticText({ children, className = '', delay = 0 }: { children: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  const words = children.split(' ');
  
  return (
    <div ref={ref} className={`kinetic-text ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="kinetic-word"
          initial={{ y: 100, opacity: 0, rotateX: -90 }}
          animate={isInView ? { y: 0, opacity: 1, rotateX: 0 } : {}}
          transition={{
            duration: 0.8,
            delay: delay + i * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

// ============================================================================
// LIQUID GLASS CARD COMPONENT
// ============================================================================

function LiquidGlassCard({ children, className = '', intensity = 0.5 }: { children: React.ReactNode; className?: string; intensity?: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };
  
  return (
    <div
      ref={cardRef}
      className={`liquid-glass-card ${className}`}
      onMouseMove={handleMouseMove}
      style={{
        '--mouse-x': mousePosition.x,
        '--mouse-y': mousePosition.y,
        '--intensity': intensity,
      } as React.CSSProperties}
    >
      <div className="liquid-glass-shine" />
      <div className="liquid-glass-content">{children}</div>
    </div>
  );
}

// ============================================================================
// PARALLAX IMAGE COMPONENT
// ============================================================================

function ParallaxImage({ src, alt, speed = 0.5 }: { src: string; alt: string; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [-100 * speed, 100 * speed]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
  
  return (
    <div ref={ref} className="parallax-image-container">
      <motion.div className="parallax-image-wrapper" style={{ y: smoothY, scale }}>
        <img src={src} alt={alt} className="parallax-image" />
      </motion.div>
    </div>
  );
}

// ============================================================================
// FEATURE REVEAL SECTION
// ============================================================================

function FeatureReveal({ feature, index }: { feature: ProductFeature; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });
  const isEven = index % 2 === 0;
  
  return (
    <motion.div
      ref={ref}
      className={`feature-reveal ${isEven ? 'feature-left' : 'feature-right'}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="feature-visual">
        <ParallaxImage src={feature.image} alt={feature.title} speed={0.3} />
        <motion.div
          className="feature-highlight-badge"
          initial={{ scale: 0, rotate: -10 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6, type: 'spring' }}
        >
          <span className="highlight-text">{feature.highlight}</span>
        </motion.div>
      </div>
      
      <div className="feature-content">
        <LiquidGlassCard intensity={0.3}>
          <motion.span
            className="feature-number"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            0{index + 1}
          </motion.span>
          <KineticText delay={0.1} className="feature-title">
            {feature.title}
          </KineticText>
          <motion.p
            className="feature-description"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
          >
            {feature.description}
          </motion.p>
        </LiquidGlassCard>
      </div>
    </motion.div>
  );
}

// ============================================================================
// PROGRESS INDICATOR
// ============================================================================

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX }}
    />
  );
}

// ============================================================================
// HERO SECTION
// ============================================================================

function HeroReveal({ product }: { product: ScrollytellingProps['product'] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  
  return (
    <motion.div ref={containerRef} className="scrolly-hero" style={{ opacity }}>
      <motion.div className="scrolly-hero-content" style={{ scale, y }}>
        <motion.div
          className="scrolly-hero-image"
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={product.images[0]} alt={product.name} />
          <div className="scrolly-hero-overlay" />
        </motion.div>
        
        <div className="scrolly-hero-text">
          <motion.span
            className="scrolly-hero-label"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            The Collection
          </motion.span>
          <KineticText delay={0.7} className="scrolly-hero-title">
            {product.name}
          </KineticText>
          <motion.div
            className="scrolly-hero-meta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span className="meta-price">AED {product.price.toLocaleString()}</span>
            <span className="meta-divider" />
            <span className="meta-sku">{product.id}</span>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="scroll-line" />
        <span>Scroll to Explore</span>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ImmersiveScrollytelling({ product }: ScrollytellingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const features = product.features || defaultFeatures;
  
  return (
    <div ref={containerRef} className="immersive-scrollytelling">
      <ScrollProgress />
      
      {/* Hero Section */}
      <HeroReveal product={product} />
      
      {/* Features Sections */}
      <section className="scrolly-features">
        {features.map((feature, index) => (
          <FeatureReveal key={feature.id} feature={feature} index={index} />
        ))}
      </section>
      
      {/* Closing CTA */}
      <section className="scrolly-cta">
        <div className="cta-content">
          <KineticText className="cta-title">Define Your Legacy</KineticText>
          <motion.p
            className="cta-description"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Experience the pinnacle of luxury fashion
          </motion.p>
        </div>
      </section>
      
      <style>{`
        .immersive-scrollytelling {
          position: relative;
          background: linear-gradient(180deg, #0a0a0a 0%, #141414 50%, #0a0a0a 100%);
          color: #F5F2F0;
          overflow-x: hidden;
        }
        
        /* Scroll Progress */
        .scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #a87441, #D4AF87, #a87441);
          transform-origin: left;
          z-index: 1000;
        }
        
        /* Hero Section */
        .scrolly-hero {
          position: relative;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        .scrolly-hero-content {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .scrolly-hero-image {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        
        .scrolly-hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .scrolly-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(10, 10, 10, 0.3) 0%,
            rgba(10, 10, 10, 0.6) 50%,
            rgba(10, 10, 10, 0.9) 100%
          );
        }
        
        .scrolly-hero-text {
          position: absolute;
          bottom: 15%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 10;
          width: 90%;
          max-width: 900px;
        }
        
        .scrolly-hero-label {
          display: block;
          font-family: "DM Sans", sans-serif;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #a87441;
          margin-bottom: 24px;
        }
        
        .scrolly-hero-title {
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 300;
          line-height: 1.1;
          margin-bottom: 32px;
        }
        
        .scrolly-hero-meta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          font-family: "DM Sans", sans-serif;
        }
        
        .meta-price {
          font-size: 14px;
          color: #D4AF87;
        }
        
        .meta-divider {
          width: 1px;
          height: 12px;
          background: rgba(245, 242, 240, 0.3);
        }
        
        .meta-sku {
          font-size: 12px;
          letter-spacing: 0.1em;
          color: rgba(245, 242, 240, 0.6);
        }
        
        /* Scroll Indicator */
        .scroll-indicator {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: rgba(245, 242, 240, 0.5);
          font-family: "DM Sans", sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        
        .scroll-line {
          width: 1px;
          height: 60px;
          background: linear-gradient(180deg, #a87441, transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }
        
        @keyframes scrollPulse {
          0%, 100% { transform: scaleY(1); opacity: 1; }
          50% { transform: scaleY(0.6); opacity: 0.5; }
        }
        
        /* Kinetic Typography */
        .kinetic-text {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3em;
          justify-content: center;
        }
        
        .kinetic-word {
          display: inline-block;
          perspective: 1000px;
        }
        
        /* Liquid Glass Card */
        .liquid-glass-card {
          position: relative;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 40px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .liquid-glass-card:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(168, 116, 65, 0.1);
        }
        
        .liquid-glass-shine {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at calc(var(--mouse-x, 0.5) * 100%) calc(var(--mouse-y, 0.5) * 100%),
            rgba(255, 255, 255, 0.15) 0%,
            rgba(255, 255, 255, 0.05) 30%,
            transparent 60%
          );
          opacity: 0.8;
          pointer-events: none;
        }
        
        .liquid-glass-content {
          position: relative;
          z-index: 1;
        }
        
        /* Parallax Image */
        .parallax-image-container {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
        }
        
        .parallax-image-wrapper {
          width: 100%;
          height: 100%;
        }
        
        .parallax-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        /* Features Section */
        .scrolly-features {
          padding: 120px 20px;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .feature-reveal {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          margin-bottom: 120px;
          align-items: center;
        }
        
        .feature-visual {
          position: relative;
        }
        
        .feature-visual .parallax-image-container {
          aspect-ratio: 4/5;
        }
        
        .feature-highlight-badge {
          position: absolute;
          bottom: -20px;
          right: 20px;
          background: linear-gradient(135deg, #a87441, #D4AF87);
          padding: 16px 24px;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(168, 116, 65, 0.3);
        }
        
        .highlight-text {
          font-family: "DM Sans", sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #0a0a0a;
        }
        
        .feature-content {
          padding: 20px;
        }
        
        .feature-number {
          display: block;
          font-family: "DM Sans", sans-serif;
          font-size: 12px;
          letter-spacing: 0.3em;
          color: #a87441;
          margin-bottom: 16px;
        }
        
        .feature-title {
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 300;
          margin-bottom: 24px;
          color: #F5F2F0;
        }
        
        .feature-description {
          font-family: "DM Sans", sans-serif;
          font-size: 15px;
          line-height: 1.8;
          color: rgba(245, 242, 240, 0.7);
        }
        
        /* CTA Section */
        .scrolly-cta {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 80px 20px;
          background: radial-gradient(ellipse at center, rgba(168, 116, 65, 0.1) 0%, transparent 70%);
        }
        
        .cta-title {
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(2.5rem, 7vw, 4.5rem);
          font-weight: 300;
          margin-bottom: 24px;
        }
        
        .cta-description {
          font-family: "DM Sans", sans-serif;
          font-size: 16px;
          color: rgba(245, 242, 240, 0.6);
          letter-spacing: 0.05em;
        }
        
        /* Desktop Layout */
        @media (min-width: 1024px) {
          .scrolly-features {
            padding: 200px 60px;
          }
          
          .feature-reveal {
            grid-template-columns: 1fr 1fr;
            gap: 80px;
            margin-bottom: 200px;
          }
          
          .feature-reveal.feature-right {
            direction: rtl;
          }
          
          .feature-reveal.feature-right > * {
            direction: ltr;
          }
          
          .feature-visual .parallax-image-container {
            aspect-ratio: 3/4;
          }
          
          .feature-highlight-badge {
            bottom: -30px;
            right: -20px;
            padding: 20px 32px;
          }
          
          .liquid-glass-card {
            padding: 60px;
          }
        }
        
        /* Vaporwave Accent Animations */
        @keyframes vaporwaveGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(168, 116, 65, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(168, 116, 65, 0.5), 0 0 60px rgba(212, 175, 135, 0.2);
          }
        }
        
        .feature-highlight-badge {
          animation: vaporwaveGlow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export { ImmersiveScrollytelling };
