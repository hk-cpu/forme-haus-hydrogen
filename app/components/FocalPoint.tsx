'use client';
import { useEffect, useState } from 'react';
// @ts-ignore
import type { FocalPointProps } from './FocalPoint.client';

export default function FocalPoint(props: FocalPointProps) {
    const [Component, setComponent] = useState<React.ComponentType<FocalPointProps> | null>(null);

    useEffect(() => {
        // @ts-ignore
        import('./FocalPoint.client').then((mod) => {
            setComponent(() => mod.default);
        });
    }, []);

    if (!Component) return null;

    return <Component {...props} />;
}
