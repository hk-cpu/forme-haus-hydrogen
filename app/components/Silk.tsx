'use client';
import { useEffect, useState } from 'react';
import type { SilkProps } from './Silk.client';

export default function Silk(props: SilkProps) {
    const [SilkComponent, setSilkComponent] = useState<React.ComponentType<SilkProps> | null>(null);

    useEffect(() => {
        // Only import and render on client-side
        import('./Silk.client').then((mod) => {
            setSilkComponent(() => mod.default);
        });
    }, []);

    if (!SilkComponent) {
        return null; // Return null during SSR and until loaded
    }

    return <SilkComponent {...props} />;
}
