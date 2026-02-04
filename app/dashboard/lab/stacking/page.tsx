'use client';

import React from 'react';
import { StackingCards } from '@/components/premium/StackingCards';
import { LayoutDashboard, Target, Zap, Rocket, Activity, Shield } from 'lucide-react';

export default function StackingLabPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <header className="p-12 text-center">
                <h1 className="text-4xl font-bold tracking-tight mb-4">StackingCards Lab_</h1>
                <p className="text-zinc-500 uppercase text-xs tracking-[0.3em]">Componente Refinado de Kimi x HojaCero</p>
            </header>

            <StackingCards
                cardHeight="80vh"
                stackOffset={40}
                scaleAmount={0.04}
            >
                {/* CARD 1: EL RADAR */}
                <div className="w-full h-full bg-zinc-900 border border-white/10 p-12 flex flex-col justify-between">
                    <div>
                        <Target className="w-12 h-12 text-cyan-500 mb-6" />
                        <h2 className="text-5xl font-bold mb-4">Radar Comercial 2.0</h2>
                        <p className="text-xl text-zinc-400 max-w-2xl">
                            Detección proactiva de fuga de capital mediante inteligencia forense.
                            Kimi ahora vive dentro del Radar.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <span className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-full text-xs font-bold uppercase tracking-widest border border-cyan-500/20">Forensic ready</span>
                        <span className="px-4 py-2 bg-white/5 text-zinc-500 rounded-full text-xs font-bold uppercase tracking-widest border border-white/5">v2.0_</span>
                    </div>
                </div>

                {/* CARD 2: FACTORY */}
                <div className="w-full h-full bg-blue-600 p-12 flex flex-col justify-between">
                    <div>
                        <Zap className="w-12 h-12 text-white mb-6" />
                        <h2 className="text-5xl font-bold text-white mb-4">Factory DNA_</h2>
                        <p className="text-xl text-blue-100 max-w-2xl">
                            Demos generados en segundos con estrategias basadas en el dolor real
                            del cliente. No es diseño, es medicina empresarial.
                        </p>
                    </div>
                    <div className="h-40 w-full bg-white/10 rounded-3xl backdrop-blur-md border border-white/20" />
                </div>

                {/* CARD 3: EL ARSENAL */}
                <div className="w-full h-full bg-zinc-100 p-12 flex flex-col justify-between text-black">
                    <div>
                        <Rocket className="w-12 h-12 text-black mb-6" />
                        <h2 className="text-5xl font-bold mb-4">El Arsenal Operativo</h2>
                        <p className="text-xl text-zinc-600 max-w-2xl">
                            Automatización total del flujo de venta. Pitching, Shadowing y
                            Seguimiento sin mover un solo dedo.
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-black/5 rounded-2xl border border-black/5" />
                        ))}
                    </div>
                </div>

                {/* CARD 4: GASTON */}
                <div className="w-full h-full bg-emerald-500 p-12 flex flex-col justify-between">
                    <div>
                        <Shield className="w-12 h-12 text-white mb-6" />
                        <h2 className="text-5xl font-bold text-white mb-4">Gastón: Territorial_</h2>
                        <p className="text-xl text-emerald-100 max-w-2xl">
                            La pieza final. Inteligencia geográfica para dominar el territorio
                            físico con la misma precisión que el digital.
                        </p>
                    </div>
                    <div className="flex justify-end">
                        <div className="w-24 h-24 rounded-full bg-white/20 animate-pulse" />
                    </div>
                </div>
            </StackingCards>

            <footer className="p-24 text-center text-zinc-700 text-xs uppercase tracking-widest">
                Scroll Finalizado _ HojaCero Creative Tech
            </footer>
        </div>
    );
}
