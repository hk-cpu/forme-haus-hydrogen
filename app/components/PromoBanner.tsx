import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@remix-run/react';
import { useUI, promoMessages } from '~/context/UIContext';
import { useTranslation } from '~/hooks/useTranslation';

/**
 * PromoBanner - Rotating promotional banner
 *
 * Features:
 * - Auto-rotating promotional messages
 * - Pause/play toggle
 * - Close button (persists in session)
 * - Smooth fade transitions
 * - RTL support
 * - Matches Formé Haus dark luxury aesthetic
 */
export function PromoBanner() {
  const { state, dispatch } = useUI();
  const { isRTL } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate messages
  useEffect(() => {
    if (state.promoBannerPaused || !state.promoBannerVisible) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % promoMessages.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [state.promoBannerPaused, state.promoBannerVisible]);

  if (!state.promoBannerVisible) return null;

  const currentMessage = promoMessages[currentIndex];

  return (
    <div className="promo-banner" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Pause/Play Button */}
      <button
        className="promo-control promo-pause"
        onClick={() => dispatch({ type: 'TOGGLE_PROMO_PAUSE' })}
        aria-label={state.promoBannerPaused ? 'Play announcements' : 'Pause announcements'}
      >
        {state.promoBannerPaused ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        )}
      </button>

      {/* Message Content */}
      <div className="promo-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <Link to={currentMessage.href} className="promo-link">
              {currentMessage.text}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots Indicator */}
      <div className="promo-dots">
        {promoMessages.map((_, idx) => (
          <button
            key={idx}
            className={`promo-dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to announcement ${idx + 1}`}
          />
        ))}
      </div>

      {/* Close Button */}
      <button
        className="promo-control promo-close"
        onClick={() => dispatch({ type: 'CLOSE_PROMO_BANNER' })}
        aria-label="Close announcement banner"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="4" y1="4" x2="20" y2="20" />
          <line x1="20" y1="4" x2="4" y2="20" />
        </svg>
      </button>

      <style>{`
        .promo-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 16px;
          background: linear-gradient(135deg, #a87441 0%, #8B5E3C 100%);
          color: #F5F2F0;
          position: relative;
          z-index: 101;
        }

        .promo-control {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          color: inherit;
          cursor: pointer;
          opacity: 0.8;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .promo-control:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.2);
        }

        .promo-content {
          flex: 1;
          text-align: center;
          min-height: 18px;
          overflow: hidden;
        }

        .promo-link {
          display: inline-block;
          font-family: "DM Sans", "Helvetica Neue", sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: inherit;
          text-decoration: none;
          transition: opacity 0.2s ease;
        }

        .promo-link:hover {
          opacity: 0.85;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .promo-dots {
          display: none;
          gap: 6px;
        }

        .promo-dot {
          width: 6px;
          height: 6px;
          padding: 0;
          background: rgba(255, 255, 255, 0.3);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .promo-dot.active {
          background: rgba(255, 255, 255, 0.9);
          transform: scale(1.2);
        }

        .promo-dot:hover {
          background: rgba(255, 255, 255, 0.6);
        }

        /* RTL adjustments */
        [dir="rtl"] .promo-banner {
          flex-direction: row-reverse;
        }

        /* Desktop: show dots */
        @media (min-width: 768px) {
          .promo-banner {
            padding: 12px 24px;
          }

          .promo-link {
            font-size: 12px;
            letter-spacing: 0.12em;
          }

          .promo-dots {
            display: flex;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .promo-link,
          .promo-control,
          .promo-dot {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

export default PromoBanner;
