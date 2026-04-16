import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

const base =
  'inline-flex items-center justify-center rounded-md whitespace-nowrap select-none ' +
  'transition-all ease-[var(--ease-luxe)] duration-200 focus:outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-bronze disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary:
    'bg-bronze text-white hover:bg-bronze-dark shadow-[var(--shadow-card)]',
  secondary: 'border border-taupe text-foreground/90 hover:bg-foreground/5',
  ghost: 'text-foreground/90 hover:bg-foreground/5',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-12 px-6 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const cls = [base, variants[variant], sizes[size], className]
    .join(' ')
    .trim();
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}

export default Button;
