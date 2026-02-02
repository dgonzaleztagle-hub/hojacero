'use client';

import React from 'react';
import { GridNodes } from '@/components/premium/GridNodes';
import { ParticleSystem } from '@/components/premium/ParticleSystem';
import { AmbientOrb } from '@/components/premium/AmbientOrb';
import { VortexLines } from '@/components/premium/VortexLines';
import { WaveLines } from '@/components/premium/WaveLines';

/**
 * Primitives Gallery - Laboratorio de ADN Visual
 * Arsenal Expandido de HojaCero.
 */
export default function PrimitivesPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white p-12 font-sans">
            <header className="mb-20">
                <h1 className="text-4xl font-light tracking-[0.3em] uppercase mb-4 text-gold-500">ADN Visual Primitives</h1>
                <p className="text-white/40 max-w-2xl text-sm leading-relaxed">
                    Laboratorio de componentes atómicos para evitar el efecto "plantilla".
                    Cada primitiva responde a un rubro y psicología diferente.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* 1. THE GRID (Industrial) */}
                <div className="flex flex-col gap-6">
                    <div className="h-80 w-full relative group">
                        <GridNodes />
                        <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest bg-black/80 px-3 py-1 border border-white/10">The Grid (Industrial)</div>
                    </div>
                    <div>
                        <h2 className="text-xl font-medium mb-2">Arquitectura & Ingeniería</h2>
                        <p className="text-sm text-white/40">Líneas ortogonales que transmiten orden, estructura y precisión técnica.</p>
                    </div>
                </div>

                {/* 2. THE PARTICLE (Data) */}
                <div className="flex flex-col gap-6">
                    <div className="h-80 w-full relative group">
                        <ParticleSystem />
                        <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest bg-black/80 px-3 py-1 border border-white/10">The Particle (Finance/AI)</div>
                    </div>
                    <div>
                        <h2 className="text-xl font-medium mb-2">Tecnología & Finanzas</h2>
                        <p className="text-sm text-white/40">Dinámica de red y flujo de datos. Conectividad y rapidez de decisión.</p>
                    </div>
                </div>

                {/* 3. THE MESH / WAVE (Creative) */}
                <div className="flex flex-col gap-6">
                    <div className="h-80 w-full relative group bg-black/40 rounded-xl overflow-hidden">
                        <WaveLines color="rgba(255, 255, 255, 0.4)" count={12} speed={0.005} />
                        <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest bg-black/80 px-3 py-1 border border-white/10">The Mesh (Fashion/Silk)</div>
                    </div>
                    <div>
                        <h2 className="text-xl font-medium mb-2">Moda & Alta Costura</h2>
                        <p className="text-sm text-white/40">Superficies fluidas que evocan telas premium y movimiento orgánico.</p>
                    </div>
                </div>

                {/* 4. THE ORB (Wellness) */}
                <div className="flex flex-col gap-6">
                    <div className="h-80 w-full relative group">
                        <AmbientOrb />
                        <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest bg-black/80 px-3 py-1 border border-white/10">The Orb (Health/Zen)</div>
                    </div>
                    <div>
                        <h2 className="text-xl font-medium mb-2">Bienestar & Salud</h2>
                        <p className="text-sm text-white/40">Luces ambientales que respiran. Transmiten paz, calma y enfoque humano.</p>
                    </div>
                </div>

                {/* 5. THE VORTEX (Speed) */}
                <div className="flex flex-col gap-6">
                    <div className="h-80 w-full relative group">
                        <VortexLines />
                        <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest bg-black/80 px-3 py-1 border border-white/10">The Vortex (Speed)</div>
                    </div>
                    <div>
                        <h2 className="text-xl font-medium mb-2">Logística & Futuro</h2>
                        <p className="text-sm text-white/40">Líneas de fuga cinéticas que proyectan avance, rapidez y dinamismo empresarial.</p>
                    </div>
                </div>

            </div>

            <footer className="mt-40 pt-10 border-t border-white/10 text-[9px] uppercase tracking-widest text-white/20">
                Studio HojaCero / Creative Atomization Lab
            </footer>
        </main>
    );
}
