"use client";

import { BurningReveal } from "@/components/fx/BurningReveal";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useState } from "react";

export default function BurningLeafPage() {
    const [trigger, setTrigger] = useState(0);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 flex flex-col font-sans">
            {/* Navigation */}
            <nav className="p-8 pb-0">
                <Link
                    href="/design-lab"
                    className="inline-flex items-center gap-2 text-neutral-500 hover:text-emerald-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Volver al Lab</span>
                </Link>
            </nav>

            <main className="flex-1 flex flex-col items-center justify-center p-8 gap-12">
                <div className="text-center max-w-2xl">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-emerald-500 mb-4">
                        Experiment 01: Burning Leaf
                    </h1>
                    <p className="text-neutral-400 mb-8">
                        Efecto de revelación orgánica usando filtros de desplazamiento SVG y turbulencia.
                        Simula la física de algo "quemándose" o reconstituyéndose desde el caos.
                    </p>

                    <button
                        onClick={() => setTrigger(t => t + 1)}
                        className="flex items-center gap-2 mx-auto px-6 py-2 rounded-full border border-neutral-700 hover:bg-neutral-800 hover:border-emerald-500/50 transition-all text-sm font-medium"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reiniciar Efecto
                    </button>
                </div>

                {/* The Experiment Stage */}
                <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-900 grid place-items-center">

                    {/* Background Texture/Context */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center" />

                    <BurningReveal key={trigger} duration={3} className="relative z-10 p-12 text-center">
                        <h2 className="text-7xl font-serif text-white tracking-tighter mb-4 shadow-black drop-shadow-2xl">
                            Renacimiento
                        </h2>
                        <p className="text-xl text-neutral-300 font-light tracking-wide max-w-lg mx-auto leading-relaxed">
                            "La verdadera elegancia no es destacar, sino ser recordado."
                        </p>
                        <div className="mt-8 flex justify-center gap-4">
                            <div className="w-32 h-1 bg-emerald-500 rounded-full" />
                        </div>
                    </BurningReveal>

                </div>
            </main>
        </div>
    );
}
