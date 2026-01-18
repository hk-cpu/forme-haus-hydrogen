'use client';
import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export interface FocalPointProps {
    color?: string;
    speed?: number;
}

function Shape({ color = "#C4A484", speed = 0.5 }: FocalPointProps) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const { mouse, viewport } = useThree();

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        // Continuous rotation
        meshRef.current.rotation.x += delta * speed * 0.2;
        meshRef.current.rotation.y += delta * speed * 0.3;

        // Mouse follow tilt
        const targetRotationX = (state.mouse.y * Math.PI) / 8;
        const targetRotationY = (state.mouse.x * Math.PI) / 8;

        meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.05;
        meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.05;

        // Gentle breathing scale
        const s = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
        meshRef.current.scale.set(s, s, s);
    });

    return (
        <group>
            <mesh ref={meshRef}>
                <torusKnotGeometry args={[1, 0.3, 128, 32]} />
                <meshPhysicalMaterial
                    color={color}
                    metalness={0.9}
                    roughness={0.1}
                    transmission={0.5}
                    thickness={2}
                    envMapIntensity={2}
                />
            </mesh>
            <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
            <pointLight position={[-10, -10, -10]} intensity={1} color={color} />
        </group>
    );
}

export default function FocalPoint(props: FocalPointProps) {
    return (
        <div className="absolute inset-0 pointer-events-none z-0">
            <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <Shape {...props} />
            </Canvas>
        </div>
    );
}
