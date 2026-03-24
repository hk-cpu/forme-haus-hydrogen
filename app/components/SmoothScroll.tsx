import {useEffect, useState} from 'react';
import Lenis from 'lenis';

export default function SmoothScroll() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch devices (mobile/tablet)
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window || navigator.maxTouchPoints > 0,
      );
    };
    checkTouch();

    // Check if full-page scroll is enabled (snap scroll)
    const hasFullPageScroll = document.querySelector('.fullpage-scroll-container');
    
    // Don't initialize Lenis if:
    // 1. It's a touch device
    // 2. Full-page snap scrolling is enabled (they conflict)
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || hasFullPageScroll) {
      // Ensure native scrolling works properly
      document.body.style.touchAction = 'pan-y';
      document.documentElement.style.touchAction = 'pan-y';
      return;
    }

    // Initialize Lenis only for desktop (mouse wheel) when no full-page scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      // Important: Don't prevent touch events
      prevent: (node) => {
        // Allow default touch behavior
        return false;
      },
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      document.body.style.touchAction = '';
      document.documentElement.style.touchAction = '';
    };
  }, []);

  return null;
}
