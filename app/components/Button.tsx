import { forwardRef, useState } from 'react';
import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

import { missingClass } from '~/lib/utils';

export const Button = forwardRef(
  (
    {
      as = 'button',
      className = '',
      variant = 'primary',
      width = 'auto',
      loading = false,
      disabled = false,
      children,
      ...props
    }: {
      as?: React.ElementType;
      className?: string;
      variant?: 'primary' | 'secondary' | 'inline' | 'bronze' | 'outline';
      width?: 'auto' | 'full';
      loading?: boolean;
      disabled?: boolean;
      children?: React.ReactNode;
      [key: string]: any;
    },
    ref,
  ) => {
    const Component = props?.to ? Link : as;
    const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

    // Ripple effect handler
    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      if (disabled || loading) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();

      setRipples((prev) => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
      }, 800);

      props.onClick?.(e);
    };

    const baseButtonClasses =
      'relative overflow-hidden inline-flex items-center justify-center rounded-lg font-medium text-center transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a87441] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]';

    const variants = {
      primary: `${baseButtonClasses} bg-[#a87441] text-white border border-[#a87441] hover:bg-[#8B5E3C] hover:border-[#8B5E3C] uppercase tracking-[0.2em] text-[11px] py-4 px-8 shadow-[0_4px_14px_0_rgba(168,116,65,0.39)] hover:shadow-[0_6px_20px_rgba(168,116,65,0.23)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed`,

      secondary: `${baseButtonClasses} bg-transparent border border-[#F0EAE6]/30 text-[#F0EAE6] hover:bg-[#F0EAE6]/5 hover:border-[#F0EAE6]/50 uppercase tracking-[0.2em] text-[11px] py-4 px-8 disabled:opacity-50 hover:shadow-[0_0_15px_rgba(240,234,230,0.1)]`,

      bronze: `${baseButtonClasses} bg-gradient-to-r from-[#a87441] via-[#b88a5c] to-[#8B5E3C] text-white uppercase tracking-[0.2em] text-[11px] py-4 px-8 shadow-lg hover:shadow-xl hover:brightness-110 disabled:opacity-50 bg-[length:200%_auto] hover:bg-right transition-[background-position] duration-700`,

      outline: `${baseButtonClasses} bg-transparent border-[1.5px] border-[#a87441] text-[#a87441] hover:bg-[#a87441] hover:text-white uppercase tracking-[0.2em] text-[11px] py-4 px-8 disabled:opacity-50 hover:shadow-[0_0_20px_rgba(168,116,65,0.4)]`,

      inline: 'relative inline-flex items-center text-[#F0EAE6]/70 hover:text-[#a87441] transition-colors duration-300 group',
    };

    const widths = {
      auto: 'w-auto',
      full: 'w-full',
    };

    const styles = clsx(
      missingClass(className, 'bg-') && variants[variant],
      missingClass(className, 'w-') && widths[width],
      (loading || disabled) && 'opacity-70 cursor-not-allowed',
      className,
    );

    // Loading spinner
    const LoadingSpinner = () => (
      <motion.svg
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-4 h-4 mr-2"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="31.42 31.42"
          transform="rotate(-90 12 12)"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 12 12"
            to="360 12 12"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      </motion.svg>
    );

    // Inline variant special rendering
    if (variant === 'inline') {
      return (
        <Component
          className={styles}
          {...props}
          ref={ref}
        >
          <span className="relative">
            {children}
            <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-[#a87441] group-hover:w-full transition-all duration-300" />
          </span>
        </Component>
      );
    }

    return (
      <Component
        className={styles}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
        ref={ref}
      >
        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
            }}
          />
        ))}

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center">
          {loading && <LoadingSpinner />}
          {children}
        </span>
      </Component>
    );
  },
);

Button.displayName = 'Button';

export default Button;
