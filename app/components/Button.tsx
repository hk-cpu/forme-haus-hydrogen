import {forwardRef} from 'react';
import {Link} from '@remix-run/react';
import clsx from 'clsx';

import {missingClass} from '~/lib/utils';

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
      primary: `${baseButtonClasses} border border-[#F0EAE6]/40 text-[#F0EAE6] uppercase tracking-[0.25em] text-[10px] hover:bg-[#F0EAE6] hover:text-[#121212] transition-all duration-500 ease-out bg-transparent backdrop-blur-sm`,
      secondary: `${baseButtonClasses} border border-transparent text-[#F0EAE6]/70 hover:text-[#F0EAE6] uppercase tracking-[0.25em] text-[10px] relative group`,
      inline:
        'border-b border-[#F0EAE6]/20 leading-none pb-1 hover:border-[#F0EAE6] transition-colors duration-300',
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
        {...(props?.to ? {preventScrollReset: true} : {})}
        className={styles}
        {...props}
        ref={ref}
      />
    );
  },
);
