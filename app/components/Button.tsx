import { forwardRef } from 'react';
import { Link } from '@remix-run/react';
import clsx from 'clsx';

import { missingClass } from '~/lib/utils';

export const Button = forwardRef(
  (
    {
      as = 'button',
      className = '',
      variant = 'primary',
      width = 'auto',
      ...props
    }: {
      as?: React.ElementType;
      className?: string;
      variant?: 'primary' | 'secondary' | 'inline';
      width?: 'auto' | 'full';
      [key: string]: any;
    },
    ref,
  ) => {
    const Component = props?.to ? Link : as;

    const baseButtonClasses =
      'inline-block rounded font-medium text-center py-3 px-6';

    const variants = {
      primary: `${baseButtonClasses} border border-[#AA9B8F]/30 text-[#F5F2F0] uppercase tracking-[0.2em] text-xs hover:bg-[#F5F2F0] hover:text-[#2E2C2B] transition-colors duration-300 bg-transparent`,
      secondary: `${baseButtonClasses} border border-[#F5F2F0]/20 bg-transparent text-[#F5F2F0] hover:bg-[#F5F2F0]/10 uppercase tracking-widest text-xs`,
      inline: 'border-b border-primary/10 leading-none pb-1',
    };

    const widths = {
      auto: 'w-auto',
      full: 'w-full',
    };

    const styles = clsx(
      missingClass(className, 'bg-') && variants[variant],
      missingClass(className, 'w-') && widths[width],
      className,
    );

    return (
      <Component
        // @todo: not supported until react-router makes it into Remix.
        // preventScrollReset={true}
        className={styles}
        {...props}
        ref={ref}
      />
    );
  },
);
