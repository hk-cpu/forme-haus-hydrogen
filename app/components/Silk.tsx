import { Suspense, lazy, useEffect, useState } from 'react';
import type { SilkProps } from './Silk.client';

const SilkClient = lazy(() => import('./Silk.client'));

export default function Silk(props: SilkProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Suspense fallback={null}>
            <SilkClient {...props} />
        </Suspense>
    );
}
