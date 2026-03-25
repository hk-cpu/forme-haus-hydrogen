import {Suspense, lazy, useEffect, useState} from 'react';

import type {AtmosphereProps} from './Atmosphere.client';

const AtmosphereClient = lazy(() => import('./Atmosphere.client'));

export default function Atmosphere(props: AtmosphereProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Suspense fallback={null}>
      <AtmosphereClient {...props} />
    </Suspense>
  );
}
