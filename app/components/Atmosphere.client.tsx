'use client';
import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export interface AtmosphereProps {
    count?: number;
    color?: string;
    size?: number;
    opacity?: number;
}

function Sparkles({ count = 100, color = "#C4A484", size = 0.015, opacity = 0.5 }: AtmosphereProps) {
    const points = useRef<THREE.Points>(null!);
    const { viewport } = useThree();

    // Generate random positions
    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
            velocities[i] = 0.1 + Math.random() * 0.5;
        }
        return { positions, velocities };
    }, [count]);

    useFrame((state, delta) => {
        const { positions, velocities } = particles;
        for (let i = 0; i < count; i++) {
            // Gentle floating animation
            positions[i * 3 + 1] += 0.05 * velocities[i] * delta;

            // Wrap around screen
            if (positions[i * 3 + 1] > 5) positions[i * 3 + 1] = -5;

            // Subtle mouse interaction
            const mouseX = state.mouse.x * (viewport.width / 2);
            const mouseY = state.mouse.y * (viewport.height / 2);

            positions[i * 3] += (mouseX * 0.01 - positions[i * 3]) * 0.01;
        }
        points.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.positions.length / 3}
                    array={particles.positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={size}
                color={color}
                transparent
                opacity={opacity}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

const Atmosphere: React.FC<AtmosphereProps> = (props) => {
    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                dpr={[1, 2]}
            >
                <Sparkles {...props} />
            </Canvas>
        </div>
    );
};

export default Atmosphere;
