import clsx from 'clsx';

export function Spinner({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={clsx(
        'animate-spin rounded-full border-bronze/30 border-t-bronze',
        sizes[size],
        className,
      )}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
