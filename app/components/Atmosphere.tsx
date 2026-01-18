'use client';
import { useEffect, useState } from 'react';
import type { AtmosphereProps } from './Atmosphere.client';

export default function Atmosphere(props: AtmosphereProps) {
    const [AtmosphereComponent, setAtmosphereComponent] = useState<React.ComponentType<AtmosphereProps> | null>(null);

    useEffect(() => {
        // Only import and render on client-side
        // @ts-ignore
        import('./Atmosphere.client').then((mod) => {
            setAtmosphereComponent(() => mod.default);
        });
    }, []);

    if (!AtmosphereComponent) {
        return null; // Return null during SSR and until loaded
    }

    return <AtmosphereComponent {...props} />;
}
