import {Suspense, lazy, useEffect, useState} from 'react';

import type {AtmosphereProps} from './Atmosphere.client';

const AtmosphereClient = lazy(() => import('./Atmosphere.client'));

export default function Atmosphere(props: AtmosphereProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer until after first paint to avoid blocking TBT
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
      <AtmosphereClient {...props} />
    </Suspense>
  );
}
