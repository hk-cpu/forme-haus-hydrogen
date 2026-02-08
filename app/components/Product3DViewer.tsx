// ============================================================================
// 3D PRODUCT VIEWER - Futuristic Interactive Product Visualization
// ============================================================================
// A standalone component that provides immersive 3D product exploration
// Uses model-viewer for high-performance WebGL rendering
// Falls back to image gallery if 3D model is unavailable

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Product3DViewerProps {
  product: {
    id: string;
    name: string;
    images: string[];
    model3d?: string;
    modelAlt?: string;
  };
  className?: string;
}

interface ViewerState {
  isLoading: boolean;
  isError: boolean;
  isFullscreen: boolean;
  currentView: '3d' | 'image';
  autoRotate: boolean;
  zoom: number;
}

interface HotspotData {
  position: string;
  normal: string;
  label: string;
  description: string;
}

// ============================================================================
// DEFAULT HOTSPOTS FOR LUXURY PRODUCTS
// ============================================================================

const defaultHotspots: HotspotData[] = [
  {
    position: '0.2m 0.8m 0.1m',
    normal: '0 1 0',
    label: 'Premium Fabric',
    description: 'Italian wool-cashmere blend',
  },
  {
    position: '-0.15m 0.4m 0.2m',
    normal: '-1 0 0',
    label: 'Craftsmanship',
    description: 'Hand-stitched detailing',
  },
  {
    position: '0.1m 0.1m 0.15m',
    normal: '0 0 1',
    label: 'Signature Hardware',
    description: 'Genuine horn buttons',
  },
];

// ============================================================================
// VIEW TOGGLE COMPONENT
// ============================================================================

function ViewToggle({ 
  currentView, 
  onToggle 
}: { 
  currentView: '3d' | 'image'; 
  onToggle: (view: '3d' | 'image') => void;
}) {
  return (
    <div className="viewer-toggle">
      <motion.button
        className={`toggle-btn ${currentView === 'image' ? 'active' : ''}`}
        onClick={() => onToggle('image')}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <span>Photo</span>
      </motion.button>
      <motion.button
        className={`toggle-btn ${currentView === '3d' ? 'active' : ''}`}
        onClick={() => onToggle('3d')}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
        <span>3D View</span>
      </motion.button>
    </div>
  );
}

// ============================================================================
// VIEWER CONTROLS COMPONENT
// ============================================================================

function ViewerControls({
  autoRotate,
  onAutoRotateToggle,
  onFullscreen,
  onZoomIn,
  onZoomOut,
}: {
  autoRotate: boolean;
  onAutoRotateToggle: () => void;
  onFullscreen: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}) {
  return (
    <div className="viewer-controls">
      <motion.button
        className={`control-btn ${autoRotate ? 'active' : ''}`}
        onClick={onAutoRotateToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Auto Rotate"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </motion.button>
      
      <div className="control-divider" />
      
      <motion.button
        className="control-btn"
        onClick={onZoomOut}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Zoom Out"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </motion.button>
      
      <motion.button
        className="control-btn"
        onClick={onZoomIn}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Zoom In"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </motion.button>
      
      <div className="control-divider" />
      
      <motion.button
        className="control-btn"
        onClick={onFullscreen}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Fullscreen"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      </motion.button>
    </div>
  );
}

// ============================================================================
// HOTSPOT ANNOTATION COMPONENT
// ============================================================================

function HotspotAnnotation({ hotspot, isVisible }: { hotspot: HotspotData; isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="hotspot-annotation"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="annotation-dot" />
          <div className="annotation-content">
            <span className="annotation-label">{hotspot.label}</span>
            <span className="annotation-desc">{hotspot.description}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// LOADING STATE COMPONENT
// ============================================================================

function ViewerLoader() {
  return (
    <div className="viewer-loader">
      <div className="loader-ring">
        <div className="loader-ring-inner" />
      </div>
      <div className="loader-text">Loading 3D Experience</div>
      <div className="loader-progress">
        <motion.div
          className="loader-bar"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// FALLBACK IMAGE GALLERY
// ============================================================================

function ImageGallery({ images, productName }: { images: string[]; productName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);
  
  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);
  
  return (
    <div className="image-gallery">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="gallery-main-image"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
        >
          <img src={images[currentIndex]} alt={`${productName} - View ${currentIndex + 1}`} />
        </motion.div>
      </AnimatePresence>
      
      <div className="gallery-thumbnails">
        {images.map((img, idx) => (
          <motion.button
            key={idx}
            className={`gallery-thumb ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={img} alt={`Thumbnail ${idx + 1}`} />
          </motion.button>
        ))}
      </div>
      
      <div className="gallery-nav">
        <motion.button
          className="gallery-nav-btn"
          onClick={prevImage}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </motion.button>
        <motion.button
          className="gallery-nav-btn"
          onClick={nextImage}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN 3D VIEWER COMPONENT
// ============================================================================

export default function Product3DViewer({ product, className = '' }: Product3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelViewerRef = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<ViewerState>({
    isLoading: true,
    isError: false,
    isFullscreen: false,
    currentView: 'image',
    autoRotate: true,
    zoom: 1,
  });
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  
  // Check if model-viewer is available
  const [modelViewerAvailable, setModelViewerAvailable] = useState(false);
  
  useEffect(() => {
    // Check if model-viewer custom element is defined
    const checkModelViewer = () => {
      const available = customElements.get('model-viewer') !== undefined;
      setModelViewerAvailable(available);
      if (!available && product.model3d) {
        // Try to load model-viewer script
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js';
        script.onload = () => setModelViewerAvailable(true);
        document.head.appendChild(script);
      }
    };
    
    checkModelViewer();
  }, [product.model3d]);
  
  // Handle fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setState(prev => ({ ...prev, isFullscreen: true }));
    } else {
      document.exitFullscreen?.();
      setState(prev => ({ ...prev, isFullscreen: false }));
    }
  }, []);
  
  // Handle zoom
  const zoomIn = useCallback(() => {
    setState(prev => ({ ...prev, zoom: Math.min(prev.zoom + 0.2, 2) }));
  }, []);
  
  const zoomOut = useCallback(() => {
    setState(prev => ({ ...prev, zoom: Math.max(prev.zoom - 0.2, 0.5) }));
  }, []);
  
  // Toggle auto-rotate
  const toggleAutoRotate = useCallback(() => {
    setState(prev => ({ ...prev, autoRotate: !prev.autoRotate }));
  }, []);
  
  // Switch view
  const switchView = useCallback((view: '3d' | 'image') => {
    setState(prev => ({ ...prev, currentView: view, isLoading: view === '3d' && !modelLoaded }));
  }, [modelLoaded]);
  
  // Handle model load
  const handleModelLoad = useCallback(() => {
    setModelLoaded(true);
    setState(prev => ({ ...prev, isLoading: false }));
  }, []);
  
  // Determine if we can show 3D view
  const canShow3D = modelViewerAvailable && product.model3d;
  
  return (
    <div 
      ref={containerRef}
      className={`product-3d-viewer ${className} ${state.isFullscreen ? 'fullscreen' : ''}`}
    >
      {/* View Toggle */}
      {canShow3D && (
        <ViewToggle currentView={state.currentView} onToggle={switchView} />
      )}
      
      {/* Main Viewer Area */}
      <div className="viewer-container">
        <AnimatePresence mode="wait">
          {state.currentView === '3d' && canShow3D ? (
            <motion.div
              key="3d-view"
              className="viewer-3d"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {state.isLoading && <ViewerLoader />}
              
              {/* Model Viewer - using createElement to bypass JSX type checking */}
              {React.createElement('model-viewer', {
                ref: modelViewerRef,
                src: product.model3d,
                alt: product.modelAlt || `3D view of ${product.name}`,
                'camera-controls': true,
                'auto-rotate': state.autoRotate,
                'auto-rotate-delay': 0,
                'rotation-per-second': '30deg',
                'camera-orbit': '0deg 75deg 1.5m',
                'min-camera-orbit': 'auto auto 0.5m',
                'max-camera-orbit': 'auto auto 2m',
                'field-of-view': '30deg',
                exposure: 1,
                'shadow-intensity': 1,
                'shadow-softness': 0.5,
                'environment-image': 'neutral',
                style: {width: '100%', height: '100%'},
                onLoad: handleModelLoad,
                children: defaultHotspots.map((hotspot, index) => (
                  <button
                    key={index}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore - slot is a valid attribute for model-viewer
                    slot={`hotspot-${index}`}
                    data-position={hotspot.position}
                    data-normal={hotspot.normal}
                    className="model-hotspot"
                    onClick={() => setActiveHotspot(activeHotspot === index ? null : index)}
                  >
                    <div className="hotspot-pulse" />
                    <HotspotAnnotation hotspot={hotspot} isVisible={activeHotspot === index} />
                  </button>
                ))
              } as any)}
              
              {/* 3D Controls */}
              <ViewerControls
                autoRotate={state.autoRotate}
                onAutoRotateToggle={toggleAutoRotate}
                onFullscreen={toggleFullscreen}
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
              />
              
              {/* Interaction hint */}
              <motion.div 
                className="viewer-hint"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <span>Drag to rotate • Scroll to zoom</span>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="image-view"
              className="viewer-image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ImageGallery images={product.images} productName={product.name} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Product Info Overlay */}
      <motion.div 
        className="viewer-info"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="viewer-badge">{state.currentView === '3d' ? 'Interactive 3D' : 'High-Res Gallery'}</span>
        <h3 className="viewer-name">{product.name}</h3>
      </motion.div>
      
      <style>{`
        .product-3d-viewer {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 500px;
          background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%);
          border-radius: 20px;
          overflow: hidden;
        }
        
        .product-3d-viewer.fullscreen {
          border-radius: 0;
          position: fixed;
          inset: 0;
          z-index: 9999;
        }
        
        /* View Toggle */
        .viewer-toggle {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          padding: 6px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(20px);
          border-radius: 30px;
          z-index: 10;
        }
        
        .toggle-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: transparent;
          border: none;
          border-radius: 24px;
          color: rgba(245, 242, 240, 0.6);
          font-family: "DM Sans", sans-serif;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .toggle-btn.active {
          background: linear-gradient(135deg, #a87441, #D4AF87);
          color: #0a0a0a;
          font-weight: 500;
        }
        
        .toggle-btn:not(.active):hover {
          color: #F5F2F0;
        }
        
        /* Viewer Container */
        .viewer-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        /* 3D View */
        .viewer-3d {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .viewer-3d model-viewer {
          width: 100%;
          height: 100%;
          background: transparent;
        }
        
        /* Hotspots */
        .model-hotspot {
          position: relative;
          width: 24px;
          height: 24px;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .hotspot-pulse {
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, #a87441, #D4AF87);
          border-radius: 50%;
          position: relative;
        }
        
        .hotspot-pulse::before {
          content: '';
          position: absolute;
          inset: -8px;
          border: 2px solid rgba(168, 116, 65, 0.5);
          border-radius: 50%;
          animation: hotspotPulse 2s ease-out infinite;
        }
        
        @keyframes hotspotPulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        /* Hotspot Annotation */
        .hotspot-annotation {
          position: absolute;
          left: 30px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(168, 116, 65, 0.3);
          border-radius: 12px;
          padding: 16px 20px;
          min-width: 180px;
          z-index: 100;
        }
        
        .annotation-dot {
          position: absolute;
          left: -25px;
          top: 50%;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          background: #a87441;
          border-radius: 50%;
        }
        
        .annotation-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .annotation-label {
          font-family: "DM Sans", sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #D4AF87;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .annotation-desc {
          font-family: "DM Sans", sans-serif;
          font-size: 13px;
          color: rgba(245, 242, 240, 0.8);
        }
        
        /* Controls */
        .viewer-controls {
          position: absolute;
          bottom: 30px;
          right: 30px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(20px);
          border-radius: 30px;
          z-index: 10;
        }
        
        .control-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          border-radius: 50%;
          color: rgba(245, 242, 240, 0.7);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .control-btn:hover {
          background: rgba(168, 116, 65, 0.2);
          color: #F5F2F0;
        }
        
        .control-btn.active {
          background: rgba(168, 116, 65, 0.3);
          color: #D4AF87;
        }
        
        .control-divider {
          width: 1px;
          height: 24px;
          background: rgba(245, 242, 240, 0.2);
        }
        
        /* Viewer Hint */
        .viewer-hint {
          position: absolute;
          bottom: 30px;
          left: 30px;
          padding: 10px 18px;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          color: rgba(245, 242, 240, 0.6);
          font-family: "DM Sans", sans-serif;
          font-size: 12px;
          letter-spacing: 0.02em;
        }
        
        /* Loader */
        .viewer-loader {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #0a0a0a;
          z-index: 50;
        }
        
        .loader-ring {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, transparent, #a87441, transparent);
          animation: loaderSpin 1.5s linear infinite;
          padding: 3px;
        }
        
        .loader-ring-inner {
          width: 100%;
          height: 100%;
          background: #0a0a0a;
          border-radius: 50%;
        }
        
        @keyframes loaderSpin {
          to { transform: rotate(360deg); }
        }
        
        .loader-text {
          margin-top: 24px;
          font-family: "Cormorant Garamond", serif;
          font-size: 18px;
          color: #F5F2F0;
          letter-spacing: 0.1em;
        }
        
        .loader-progress {
          width: 200px;
          height: 2px;
          background: rgba(245, 242, 240, 0.1);
          border-radius: 2px;
          margin-top: 20px;
          overflow: hidden;
        }
        
        .loader-bar {
          height: 100%;
          background: linear-gradient(90deg, #a87441, #D4AF87);
          border-radius: 2px;
        }
        
        /* Image Gallery */
        .image-gallery {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .gallery-main-image {
          flex: 1;
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          margin: 20px;
        }
        
        .gallery-main-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .gallery-thumbnails {
          display: flex;
          gap: 12px;
          padding: 0 20px 20px;
          justify-content: center;
        }
        
        .gallery-thumb {
          width: 60px;
          height: 75px;
          padding: 0;
          background: none;
          border: 2px solid transparent;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 0.6;
        }
        
        .gallery-thumb.active {
          border-color: #a87441;
          opacity: 1;
        }
        
        .gallery-thumb:hover {
          opacity: 1;
        }
        
        .gallery-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .gallery-nav {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          padding: 0 30px;
          pointer-events: none;
          transform: translateY(-50%);
        }
        
        .gallery-nav-btn {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          border: none;
          border-radius: 50%;
          color: #F5F2F0;
          cursor: pointer;
          pointer-events: auto;
          transition: all 0.3s ease;
        }
        
        .gallery-nav-btn:hover {
          background: rgba(168, 116, 65, 0.8);
        }
        
        /* Viewer Info */
        .viewer-info {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 10;
        }
        
        .viewer-badge {
          display: inline-block;
          padding: 6px 12px;
          background: linear-gradient(135deg, rgba(168, 116, 65, 0.3), rgba(212, 175, 135, 0.2));
          border: 1px solid rgba(168, 116, 65, 0.4);
          border-radius: 20px;
          font-family: "DM Sans", sans-serif;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #D4AF87;
          margin-bottom: 8px;
        }
        
        .viewer-name {
          font-family: "Cormorant Garamond", serif;
          font-size: 18px;
          font-weight: 400;
          color: #F5F2F0;
          margin: 0;
        }
        
        /* Desktop Adjustments */
        @media (min-width: 1024px) {
          .product-3d-viewer {
            min-height: 600px;
          }
          
          .gallery-main-image {
            margin: 30px;
          }
          
          .gallery-thumbnails {
            padding: 0 30px 30px;
          }
          
          .gallery-thumb {
            width: 70px;
            height: 88px;
          }
          
          .viewer-name {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}

export { Product3DViewer };
