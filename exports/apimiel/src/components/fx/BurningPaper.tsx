"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";

const BurningShaderMaterial = {
    uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uTexture: { value: null },
        uNoiseTexture: { value: null }, // Optional if using procedural noise
        uEmberColor: { value: new THREE.Color("#ff5a00") }, // Deep orange/red
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
    uniform float uProgress;
    uniform sampler2D uTexture;
    uniform vec3 uEmberColor;
    varying vec2 vUv;

    // Simplex Noise (Standard implementation)
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
      vec4 texColor = texture2D(uTexture, vUv);
      
      // Generate procedural noise for the burn pattern
      // Scale controls the size of the "ash/paper chunks"
      float noiseVal = snoise(vUv * 6.0) * 0.5 + 0.5;
      
      // Calculate dissolve logic
      // We essentially want to make pixels transparent if their noise value < progress
      // But we mapped everything to be smoother.
      
      float threshold = uProgress * 1.2 - 0.1; // mapping 0-1 to slightly wider range to ensure full burn
      
      if(noiseVal < threshold) {
        discard;
      }
      
      // Fire Edge Calculation
      float edgeWidth = 0.08;
      float edge = smoothstep(threshold, threshold + edgeWidth, noiseVal);
      
      // If we are in the edge zone, we mix with fire/ember color
      // edge goes from 0 (at burn line) to 1 (safe zone)
      // So 1.0 - edge gives us "hotness"
      
      float hotness = 1.0 - edge;
      vec3 finalColor = mix(texColor.rgb, uEmberColor * 2.5, hotness * hotness); 
      // Multiplied uEmberColor for HDR-like bloom intensity
      
      gl_FragColor = vec4(finalColor, texColor.a);
    }
  `
};

interface BurningPlaneProps {
    src: string;
    trigger: boolean;
    progressRef?: React.MutableRefObject<number>;
}

function BurningPlane({ src, trigger, progressRef }: BurningPlaneProps) {
    const mesh = useRef<THREE.Mesh>(null);
    const texture = useLoader(TextureLoader, src);

    const shaderArgs = useMemo(
        () => ({
            uniforms: {
                uTime: { value: 0 },
                uProgress: { value: 0 },
                uTexture: { value: texture },
                uEmberColor: { value: new THREE.Color("#ff5a00") },
            },
            vertexShader: BurningShaderMaterial.vertexShader,
            fragmentShader: BurningShaderMaterial.fragmentShader,
            transparent: true,
            side: THREE.DoubleSide
        }),
        [texture]
    );

    useFrame((state, delta) => {
        if (mesh.current) {
            const material = mesh.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.getElapsedTime();

            if (progressRef) {
                // External control (Scroll)
                material.uniforms.uProgress.value = progressRef.current;
            } else {
                // Internal Trigger Animation
                const currentProgress = material.uniforms.uProgress.value;
                let target = trigger ? 1.0 : 0.0;

                // Linear interpolate for smooth burn
                const speed = 0.8;
                material.uniforms.uProgress.value = THREE.MathUtils.lerp(currentProgress, target, speed * delta);
            }
        }
    });

    // Aspect ratio correction (simplified, assumes square plane or adjusts via scale parent)
    return (
        <mesh ref={mesh}>
            <planeGeometry args={[1, 1, 32, 32]} />
            <shaderMaterial args={[shaderArgs]} />
        </mesh>
    );
}

export function BurningPaper({
    src,
    isBurning = false,
    progressRef,
    className = ""
}: {
    src: string,
    isBurning?: boolean,
    progressRef?: React.MutableRefObject<number>,
    className?: string
}) {
    return (
        <div className={`relative ${className}`}>
            <Canvas camera={{ position: [0, 0, 1.5] }}>
                <BurningPlane src={src} trigger={isBurning} progressRef={progressRef} />
            </Canvas>
        </div>
    );
}
