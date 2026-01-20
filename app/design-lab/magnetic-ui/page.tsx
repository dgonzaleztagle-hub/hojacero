"use client";

import { MagneticButton } from "@/components/fx/MagneticButton";
import Link from "next/link";
import { ArrowLeft, Send, Menu, ArrowUpRight } from "lucide-react";

export default function MagneticPage() {
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-indigo-500/30">
            <nav className="p-8 pb-0 flex justify-between items-center">
                <Link
                    href="/design-lab"
                    className="inline-flex items-center gap-2 text-neutral-500 hover:text-indigo-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Volver al Lab</span>
                </Link>
                <MagneticButton strength={0.2} className="p-2">
                    <Menu className="w-6 h-6 text-neutral-400 hover:text-white transition-colors" />
                </MagneticButton>
            </nav>

            <main className="flex-1 flex flex-col items-center justify-center p-8 gap-24">

                <div className="text-center max-w-xl space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">Magnetic UI</h1>
                    <p className="text-neutral-400">
                        La interfaz ya no es estática. Los elementos sienten tu presencia antes de que los toques.
                        Sutil, táctil y profundamente satisfactorio.
                    </p>
                </div>

                {/* Demo Area */}
                <div className="flex flex-wrap gap-12 justify-center items-center">

                    {/* Primary CTA style */}
                    <MagneticButton strength={0.4}>
                        <button className="px-8 py-4 bg-indigo-600 rounded-full text-white font-medium text-lg flex items-center gap-3 hover:bg-indigo-500 transition-colors shadow-[0_0_30px_-5px_rgba(79,70,229,0.3)]">
                            Let's Talk
                            <Send className="w-4 h-4" />
                        </button>
                    </MagneticButton>

                    {/* Outline style */}
                    <MagneticButton strength={0.3}>
                        <button className="w-32 h-32 rounded-full border border-neutral-700 hover:border-white transition-colors flex flex-col items-center justify-center gap-2 group bg-neutral-900/50 backdrop-blur-sm">
                            <span className="text-sm text-neutral-400 group-hover:text-white">View Project</span>
                            <ArrowUpRight className="w-5 h-5 text-neutral-500 group-hover:text-white group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </MagneticButton>

                    {/* Text Link style */}
                    <MagneticButton strength={0.2}>
                        <span className="text-2xl font-light text-neutral-300 hover:text-white border-b border-transparent hover:border-white pb-1 transition-colors">
                            hello@hojacero.com
                        </span>
                    </MagneticButton>

                </div>

                <div className="absolute bottom-12 text-center">
                    <p className="text-xs text-neutral-600 uppercase tracking-widest">
                        Move your cursor near the elements
                    </p>
                </div>

            </main>
        </div>
    );
}
