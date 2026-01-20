"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Color } from "three";

const FluidShaderMaterial = {
    uniforms: {
        uTime: { value: 0 },
        uColorStart: { value: new Color("#FBF9F4") }, // Cream Base
        uColorEnd: { value: new Color("#E8E4D8") },   // Darker Parchment
        uResolution: { value: new THREE.Vector2() },
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorStart;
    uniform vec3 uColorEnd;
    varying vec2 vUv;

    // Simplex Noise Function (Simplified)
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      // Slow organic movement
      float noise = snoise(vUv * 2.0 + uTime * 0.1); 
      
      // Secondary layer
      float noise2 = snoise(vUv * 4.0 - uTime * 0.15);

      float pattern = noise * 0.5 + noise2 * 0.2;
      
      // Soft mixing
      vec3 color = mix(uColorStart, uColorEnd, pattern + 0.5);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
};

interface GradientPlaneProps {
    colorA: string;
    colorB: string;
}

function GradientPlane({ colorA, colorB }: GradientPlaneProps) {
    const mesh = useRef<THREE.Mesh>(null);

    // Create shader material instance
    const shaderArgs = useMemo(
        () => ({
            uniforms: {
                uTime: { value: 0 },
                uColorStart: { value: new Color(colorA) },
                uColorEnd: { value: new Color(colorB) },
                uResolution: { value: new THREE.Vector2(1, 1) }
            },
            vertexShader: FluidShaderMaterial.vertexShader,
            fragmentShader: FluidShaderMaterial.fragmentShader,
        }),
        [colorA, colorB]
    );

    useFrame((state) => {
        if (mesh.current) {
            // Access the material as a custom ShaderMaterial type to avoid TS errors
            const material = mesh.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.getElapsedTime();
            // Update colors dynamically if props change
            material.uniforms.uColorStart.value.set(colorA);
            material.uniforms.uColorEnd.value.set(colorB);
        }
    });

    return (
        <mesh ref={mesh} scale={[10, 10, 1]}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial args={[shaderArgs]} />
        </mesh>
    );
}

interface LiquidBackgroundProps {
    className?: string;
    colorA?: string;
    colorB?: string;
}

export function LiquidBackground({
    className = "",
    colorA = "#FBF9F4", // Original Cream
    colorB = "#EADBC8"  // Original Darker Parchment
}: LiquidBackgroundProps) {
    return (
        <div className={`absolute inset-0 -z-10 ${className}`}>
            <Canvas camera={{ position: [0, 0, 1] }}>
                <GradientPlane colorA={colorA} colorB={colorB} />
            </Canvas>
        </div>
    );
}
