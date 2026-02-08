// ============================================================================
// FUTURISTIC PRODUCT OVERLAY
// ============================================================================
// An additive wrapper that layers futuristic UI enhancements on top of
// the existing ProductDetailPage without modifying its core logic.
//
// Features:
// - Toggle between Standard and Immersive Scrollytelling modes
// - 3D Product Viewer integration
// - Tactile Maximalism CSS effects
// - Floating action buttons for mode switching
// ============================================================================

import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tokens } from './Theme';

// Lazy load the heavy components for performance
const ImmersiveScrollytelling = lazy(() => import('./ImmersiveScrollytelling'));
const Product3DViewer = lazy(() => import('./Product3DViewer'));

// ============================================================================
// TYPES
// ============================================================================

interface FuturisticOverlayProps {
  children: React.ReactNode;
  product: {
    id: string;
    sku: string;
    name: string;
    price: number;
    description: string;
    longDescription?: string;
    images: string[];
    model3d?: string;
    features?: Array<{
      id: string;
      title: string;
      description: string;
      image: string;
      highlight: string;
    }>;
  };
}

type ViewMode = 'standard' | 'immersive' | '3d';

// ============================================================================
// MODE SWITCHER COMPONENT
// ============================================================================

function ModeSwitcher({ 
  currentMode, 
  onModeChange,
  has3DModel 
}: { 
  currentMode: ViewMode; 
  onModeChange: (mode: ViewMode) => void;
  has3DModel: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const modes: { id: ViewMode; label: string; icon: React.ReactNode; description: string }[] = [
    {
      id: 'standard',
      label: 'Classic',
      description: 'Traditional gallery view',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      ),
    },
    {
      id: 'immersive',
      label: 'Immersive',
      description: 'Scrollytelling experience',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
    },
  ];
  
  if (has3DModel) {
    modes.push({
      id: '3d',
      label: '3D View',
      description: 'Interactive 3D model',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    });
  }
  
  return (
    <div className="mode-switcher">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="mode-options"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {modes.map((mode) => (
              <motion.button
                key={mode.id}
                className={`mode-option ${currentMode === mode.id ? 'active' : ''}`}
                onClick={() => {
                  onModeChange(mode.id);
                  setIsExpanded(false);
                }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="mode-icon">{mode.icon}</span>
                <span className="mode-label">{mode.label}</span>
                <span className="mode-desc">{mode.description}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        className={`mode-toggle ${isExpanded ? 'expanded' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="toggle-icon">
          {currentMode === 'standard' && modes[0].icon}
          {currentMode === 'immersive' && modes[1].icon}
          {currentMode === '3d' && modes[2]?.icon}
        </span>
        <span className="toggle-label">
          {currentMode === 'standard' && 'Classic View'}
          {currentMode === 'immersive' && 'Immersive'}
          {currentMode === '3d' && '3D View'}
        </span>
        <motion.span 
          className="toggle-arrow"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.span>
      </motion.button>
    </div>
  );
}

// ============================================================================
// FLOATING CTA COMPONENT
// ============================================================================

function FloatingCTA({ onClick }: { onClick: () => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const lastScrollY = useRef(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 400;
      
      // Show when scrolling up past threshold, hide when scrolling down
      if (currentScrollY > scrollThreshold) {
        if (currentScrollY < lastScrollY.current) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else {
        setIsVisible(false);
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="floating-cta"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.button
            className="floating-btn"
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="floating-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </span>
            <span className="floating-text">Add to Bag</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// PROGRESSIVE ENHANCEMENT BADGE
// ============================================================================

function EnhancementBadge() {
  return (
    <motion.div
      className="enhancement-badge"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <span className="badge-dot" />
      <span className="badge-text">Futuristic Mode</span>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function FuturisticProductOverlay({ children, product }: FuturisticOverlayProps) {
  const [mode, setMode] = useState<ViewMode>('standard');
  const [isLoading, setIsLoading] = useState(false);
  const standardViewRef = useRef<HTMLDivElement>(null);
  
  // Handle mode change with loading state
  const handleModeChange = (newMode: ViewMode) => {
    if (newMode === mode) return;
    
    setIsLoading(true);
    
    // Simulate transition
    setTimeout(() => {
      setMode(newMode);
      setIsLoading(false);
      
      // Scroll to top for immersive modes
      if (newMode !== 'standard') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 400);
  };
  
  // Scroll to add to cart in standard view
  const scrollToAddToCart = () => {
    if (standardViewRef.current) {
      const addToCartBtn = standardViewRef.current.querySelector('.pdp-add-to-cart');
      addToCartBtn?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Add a subtle highlight effect
      if (addToCartBtn) {
        addToCartBtn.classList.add('fp-highlight-pulse');
        setTimeout(() => addToCartBtn.classList.remove('fp-highlight-pulse'), 2000);
      }
    }
  };
  
  const has3DModel = !!product.model3d;
  
  return (
    <div className="futuristic-overlay">
      {/* Mode Switcher - Always visible */}
      <div className="overlay-controls">
        <ModeSwitcher 
          currentMode={mode} 
          onModeChange={handleModeChange}
          has3DModel={has3DModel}
        />
        {mode !== 'standard' && <EnhancementBadge />}
      </div>
      
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="mode-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="loading-ring">
              <div className="loading-ring-inner" />
            </div>
            <span className="loading-text">Loading Experience</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Content Views */}
      <div className="overlay-content">
        <AnimatePresence mode="wait">
          {mode === 'standard' && (
            <motion.div
              key="standard"
              ref={standardViewRef}
              className="view-standard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          )}
          
          {mode === 'immersive' && (
            <motion.div
              key="immersive"
              className="view-immersive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Suspense fallback={
                <div className="suspense-fallback">
                  <div className="fallback-ring" />
                  <span>Loading Immersive Experience...</span>
                </div>
              }>
                <ImmersiveScrollytelling product={product} />
              </Suspense>
            </motion.div>
          )}
          
          {mode === '3d' && (
            <motion.div
              key="3d"
              className="view-3d"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="view-3d-container">
                <Suspense fallback={
                  <div className="suspense-fallback">
                    <div className="fallback-ring" />
                    <span>Loading 3D Viewer...</span>
                  </div>
                }>
                  <Product3DViewer product={product} />
                </Suspense>
              </div>
              <motion.div 
                className="view-3d-info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2>{product.name}</h2>
                <p className="price">AED {product.price.toLocaleString()}</p>
                <p className="description">{product.description}</p>
                <motion.button
                  className="btn-add-cart"
                  onClick={() => setMode('standard')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue to Purchase
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Floating CTA - Only in standard mode */}
      {mode === 'standard' && <FloatingCTA onClick={scrollToAddToCart} />}
      
      <style>{`
        .futuristic-overlay {
          position: relative;
        }
        
        /* Controls */
        .overlay-controls {
          position: fixed;
          top: 100px;
          right: 20px;
          z-index: 90;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }
        
        /* Mode Switcher */
        .mode-switcher {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }
        
        .mode-options {
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(168, 116, 65, 0.2);
          border-radius: 16px;
          padding: 8px;
          min-width: 200px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }
        
        .mode-option {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          background: transparent;
          border: none;
          border-radius: 12px;
          color: rgba(245, 242, 240, 0.7);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }
        
        .mode-option:hover,
        .mode-option.active {
          background: rgba(168, 116, 65, 0.15);
          color: #F5F2F0;
        }
        
        .mode-option.active {
          border: 1px solid rgba(168, 116, 65, 0.4);
        }
        
        .mode-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: rgba(168, 116, 65, 0.1);
          border-radius: 8px;
          color: #a87441;
        }
        
        .mode-label {
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          font-weight: 500;
        }
        
        .mode-desc {
          font-family: "DM Sans", sans-serif;
          font-size: 11px;
          color: rgba(245, 242, 240, 0.4);
          margin-left: auto;
        }
        
        .mode-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          background: linear-gradient(135deg, rgba(168, 116, 65, 0.9), rgba(139, 94, 60, 0.9));
          backdrop-filter: blur(10px);
          border: none;
          border-radius: 30px;
          color: white;
          font-family: "DM Sans", sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 8px 30px rgba(168, 116, 65, 0.3);
          transition: all 0.3s ease;
        }
        
        .mode-toggle:hover {
          box-shadow: 0 12px 40px rgba(168, 116, 65, 0.4);
          transform: translateY(-2px);
        }
        
        .toggle-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .toggle-arrow {
          display: flex;
          align-items: center;
          opacity: 0.7;
        }
        
        /* Enhancement Badge */
        .enhancement-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: rgba(10, 10, 10, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(168, 116, 65, 0.3);
          border-radius: 20px;
          font-family: "DM Sans", sans-serif;
          font-size: 11px;
          color: #a87441;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        
        .badge-dot {
          width: 6px;
          height: 6px;
          background: #a87441;
          border-radius: 50%;
          animation: badgePulse 2s ease-in-out infinite;
        }
        
        @keyframes badgePulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(168, 116, 65, 0.4); }
          50% { opacity: 0.8; box-shadow: 0 0 0 6px rgba(168, 116, 65, 0); }
        }
        
        /* Loading */
        .mode-loading {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #0a0a0a;
          z-index: 200;
        }
        
        .loading-ring {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, transparent, #a87441, transparent);
          animation: loadingSpin 1s linear infinite;
          padding: 2px;
        }
        
        .loading-ring-inner {
          width: 100%;
          height: 100%;
          background: #0a0a0a;
          border-radius: 50%;
        }
        
        @keyframes loadingSpin {
          to { transform: rotate(360deg); }
        }
        
        .loading-text {
          margin-top: 16px;
          font-family: "DM Sans", sans-serif;
          font-size: 13px;
          color: rgba(245, 242, 240, 0.6);
          letter-spacing: 0.1em;
        }
        
        /* Content Views */
        .overlay-content {
          position: relative;
        }
        
        .view-standard {
          min-height: 100vh;
        }
        
        .view-immersive {
          position: relative;
        }
        
        .view-3d {
          min-height: 100vh;
          padding: 100px 20px 40px;
          background: linear-gradient(180deg, #0a0a0a 0%, #141414 100%);
        }
        
        .view-3d-container {
          height: 70vh;
          border-radius: 24px;
          overflow: hidden;
          margin-bottom: 40px;
        }
        
        .view-3d-info {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
          color: #F5F2F0;
        }
        
        .view-3d-info h2 {
          font-family: "Cormorant Garamond", serif;
          font-size: 32px;
          font-weight: 300;
          margin-bottom: 12px;
        }
        
        .view-3d-info .price {
          font-family: "DM Sans", sans-serif;
          font-size: 20px;
          color: #a87441;
          margin-bottom: 16px;
        }
        
        .view-3d-info .description {
          font-family: "DM Sans", sans-serif;
          font-size: 15px;
          line-height: 1.7;
          color: rgba(245, 242, 240, 0.7);
          margin-bottom: 32px;
        }
        
        .btn-add-cart {
          padding: 16px 40px;
          background: linear-gradient(135deg, #a87441, #8b5e3c);
          border: none;
          border-radius: 30px;
          color: white;
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 30px rgba(168, 116, 65, 0.3);
        }
        
        .btn-add-cart:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(168, 116, 65, 0.4);
        }
        
        /* Suspense Fallback */
        .suspense-fallback {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 500px;
          color: rgba(245, 242, 240, 0.6);
        }
        
        .fallback-ring {
          width: 40px;
          height: 40px;
          border: 2px solid rgba(168, 116, 65, 0.2);
          border-top-color: #a87441;
          border-radius: 50%;
          animation: loadingSpin 1s linear infinite;
          margin-bottom: 16px;
        }
        
        .suspense-fallback span {
          font-family: "DM Sans", sans-serif;
          font-size: 13px;
          letter-spacing: 0.05em;
        }
        
        /* Floating CTA */
        .floating-cta {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
        }
        
        .floating-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 28px;
          background: linear-gradient(135deg, #a87441, #8b5e3c);
          border: none;
          border-radius: 50px;
          color: white;
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 10px 40px rgba(168, 116, 65, 0.4);
          transition: all 0.3s ease;
        }
        
        .floating-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 50px rgba(168, 116, 65, 0.5);
        }
        
        .floating-icon {
          display: flex;
          align-items: center;
        }
        
        /* Highlight Pulse for Add to Cart */
        :global(.fp-highlight-pulse) {
          animation: highlightPulse 2s ease-in-out;
        }
        
        @keyframes highlightPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(168, 116, 65, 0.4); }
          50% { box-shadow: 0 0 0 20px rgba(168, 116, 65, 0); }
        }
        
        /* Desktop Adjustments */
        @media (min-width: 1024px) {
          .overlay-controls {
            top: 120px;
            right: 40px;
          }
          
          .view-3d {
            padding: 120px 60px 60px;
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 60px;
            align-items: center;
          }
          
          .view-3d-container {
            height: 80vh;
            margin-bottom: 0;
          }
          
          .view-3d-info {
            text-align: left;
            margin: 0;
          }
          
          .view-3d-info h2 {
            font-size: 42px;
          }
        }
        
        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .loading-ring,
          .fallback-ring {
            animation: none;
          }
          
          .badge-dot {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export { FuturisticProductOverlay };
