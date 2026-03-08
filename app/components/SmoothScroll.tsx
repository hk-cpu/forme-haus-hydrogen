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

    // Don't initialize Lenis on touch devices - use native scrolling
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      // Ensure touch scrolling works properly
      document.body.style.touchAction = 'pan-y';
      document.documentElement.style.touchAction = 'pan-y';
      return;
    }

    // Initialize Lenis only for desktop (mouse wheel)
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
