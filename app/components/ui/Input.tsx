import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({className = '', startIcon, endIcon, ...props}, ref) => {
    const base = [
      'w-full rounded-md',
      'bg-foreground/5 border border-foreground/10',
      'text-foreground placeholder:text-foreground/40',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-bronze',
      'px-4 py-3 transition-all ease-[var(--ease-luxe)] duration-200',
    ].join(' ');

    return (
      <div className="relative">
        {startIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe pointer-events-none">
            {startIcon}
          </span>
        )}
        <input
          ref={ref}
          className={[
            base,
            startIcon ? 'pl-10' : '',
            endIcon ? 'pr-10' : '',
            className,
          ].join(' ').trim()}
          {...props}
        />
        {endIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-taupe">
            {endIcon}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;

