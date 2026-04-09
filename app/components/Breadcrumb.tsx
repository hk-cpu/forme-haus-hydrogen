import * as React from 'react';
import {Link} from '@remix-run/react';

import {IconCaret} from '~/components/Icon';
import {cn} from '~/lib/utils';

type BreadcrumbVariant = 'light' | 'dark';

const BreadcrumbContext = React.createContext<BreadcrumbVariant>('dark');

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<'nav'> & {
    separator?: React.ReactNode;
    variant?: BreadcrumbVariant;
  }
>(({variant = 'dark', ...props}, ref) => (
  <BreadcrumbContext.Provider value={variant}>
    <nav ref={ref} aria-label="breadcrumb" {...props} />
  </BreadcrumbContext.Provider>
));
Breadcrumb.displayName = 'Breadcrumb';

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<'ol'>
>(({className, ...props}, ref) => {
  const variant = React.useContext(BreadcrumbContext);
  return (
    <ol
      ref={ref}
      className={cn(
        'flex flex-wrap items-center gap-1.5 break-words text-sm sm:gap-2.5',
        variant === 'light' ? 'text-brand-text/60' : 'text-warm/50',
        className,
      )}
      {...props}
    />
  );
});
BreadcrumbList.displayName = 'BreadcrumbList';

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<'li'>
>(({className, ...props}, ref) => (
  <li
    ref={ref}
    className={cn('inline-flex items-center gap-1.5', className)}
    {...props}
  />
));
BreadcrumbItem.displayName = 'BreadcrumbItem';

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<'a'> & {
    asChild?: boolean;
    to?: string;
  }
>(({asChild, className, to, children, ...props}, ref) => {
  const variant = React.useContext(BreadcrumbContext);
  const hoverClass =
    variant === 'light' ? 'hover:text-brand-text' : 'hover:text-warm';

  if (to) {
    return (
      <Link
        to={to}
        className={cn('transition-colors', hoverClass, className)}
        // @ts-ignore
        ref={ref}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      ref={ref}
      className={cn('transition-colors', hoverClass, className)}
      {...props}
    >
      {children}
    </a>
  );
});
BreadcrumbLink.displayName = 'BreadcrumbLink';

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'>
>(({className, ...props}, ref) => {
  const variant = React.useContext(BreadcrumbContext);
  return (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        'font-normal',
        variant === 'light' ? 'text-brand-text' : 'text-warm',
        className,
      )}
      {...props}
    />
  );
});
BreadcrumbPage.displayName = 'BreadcrumbPage';

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<'li'>) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn('[&>svg]:size-3.5', className)}
    {...props}
  >
    {children ?? <IconCaret direction="right" className="w-3.5 h-3.5" />}
  </li>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = 'BreadcrumbElipssis';

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
