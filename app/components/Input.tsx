import clsx from 'clsx';

export function Input({
  className = '',
  type,
  variant,
  ...props
}: {
  className?: string;
  type?: string;
  variant: 'search' | 'minisearch';
  [key: string]: any;
}) {
  const variants = {
    search:
      'bg-transparent px-0 py-2 text-heading w-full focus:ring-0 border-x-0 border-t-0 transition-colors border-b-2 border-primary/10 focus:border-primary/90 placeholder:text-primary/40 focus:placeholder:text-primary/20 placeholder:transition-opacity',
    minisearch:
      'bg-transparent hidden md:inline-block text-left lg:text-right border-b transition border-transparent -mb-px border-x-0 border-t-0 appearance-none px-0 py-1 focus:ring-transparent placeholder:opacity-20 placeholder:text-inherit focus:placeholder:opacity-10',
  };

  const styles = clsx(variants[variant], className);

  return (
    <div className={clsx("relative group", className)}>
      <input type={type} {...props} className={styles} />
      {variant === 'search' && (
        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#a87441] transition-all duration-500 group-focus-within:w-full" />
      )}
    </div>
  );
}
