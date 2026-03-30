import {Suspense, lazy, useEffect, useState} from 'react';

import type {SilkProps} from './Silk.client';

const SilkClient = lazy(() => import('./Silk.client'));

export default function Silk(props: SilkProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer Three.js until after first paint to avoid blocking TBT
    const id =
      typeof requestIdleCallback !== 'undefined'
        ? requestIdleCallback(() => setMounted(true), {timeout: 2000})
        : setTimeout(() => setMounted(true), 500);
    return () => {
      typeof requestIdleCallback !== 'undefined'
        ? cancelIdleCallback(id as number)
        : clearTimeout(id as unknown as ReturnType<typeof setTimeout>);
    };
  }, []);

  if (!mounted) return null;

  return (
    <Suspense fallback={null}>
      <SilkClient {...props} />
    </Suspense>
  );
}
