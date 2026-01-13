'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles() {
    const count = 2000;
    const mesh = useRef<THREE.Points>(null!);

    // Mouse state refs for smooth damping (lerping)
    const mouse = useRef({ x: 0, y: 0 });
    const target = useRef({ x: 0, y: 0 });

    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }
        return positions;
    }, [count]);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const windowHalfX = window.innerWidth / 2;
            const windowHalfY = window.innerHeight / 2;

            target.current.x = (event.clientX - windowHalfX) * 0.001;
            target.current.y = (event.clientY - windowHalfY) * 0.001;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (mesh.current) {
            // Rotate entire system slightly over time
            mesh.current.rotation.y += 0.002;

            // Wave effect
            mesh.current.position.y = Math.sin(time * 0.5) * 0.2;

            // Mouse Ease (Lerp)
            // current = current + (target - current) * factor
            const currentRotationY = mesh.current.rotation.y;
            const currentRotationX = mesh.current.rotation.x;

            // We want to ADD the mouse influence to the base rotation or set it?
            // Original code: particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
            // Wait, the original code had continuous rotation AND mouse interaction. 
            // Actually original was: 
            // particlesMesh.rotation.y += 0.002; (Base spin)
            // particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y); (Mouse influence overwriting/fighting?)

            // Let's separate the base rotation from the mouse tilt to avoid conflict.
            // Or just apply the mouse offset to a container, and spin the inner one?
            // Simpler interpretation of original: 
            // It was accumulating rotation, but the mouse logic tries to force it to a specific angle.
            // Let's implement a "Mouse interaction" that adds to the rotation, but gently.

            // Re-reading original:
            // particlesMesh.rotation.y += 0.002;
            // particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
            // This mathematically means: Rotation Y moves 5% towards targetX every frame, PLUS 0.002 constant.
            // It effectively makes it spin but allows you to "drag" or "push" it with mouse.

            mesh.current.rotation.y += 0.05 * (target.current.x - mesh.current.rotation.y);
            mesh.current.rotation.x += 0.05 * (target.current.y - mesh.current.rotation.x);

            // Add constant spin on top (or rather, the target itself should perhaps be moving if we want constant spin?)
            // Actually, if we just want it to React, let's stick to the lerp. The 0.002 in original might have been fighting the lerp or acting as a "drift".
            // Let's add a separate drift to the target to keep it spinning.

            target.current.x += 0.002;
        }
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particlesPosition, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.02}
                color="#00f0ff"
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
                sizeAttenuation={true}
            />
        </points>
    );
}

export default function FluidBackground() {
    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 bg-black opacity-60 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <Particles />
            </Canvas>
        </div>
    );
}
