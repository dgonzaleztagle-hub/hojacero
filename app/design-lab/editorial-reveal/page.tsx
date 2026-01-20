"use client";

import { EditorialReveal, EditorialFlow } from "@/components/fx/EditorialReveal";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useState } from "react";

export default function EditorialRevealPage() {
    const [key, setKey] = useState(0);

    return (
        <div className="min-h-screen bg-[#FBF9F4] text-neutral-900 flex flex-col font-serif">
            <nav className="p-8 pb-0 flex justify-between items-center relative z-50">
                <Link
                    href="/design-lab"
                    className="inline-flex items-center gap-2 text-neutral-500 hover:text-emerald-600 transition-colors font-sans"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Volver al Lab</span>
                </Link>
                <button
                    onClick={() => setKey(k => k + 1)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-300 hover:bg-white transition-all text-xs font-medium font-sans uppercase tracking-widest"
                >
                    <RefreshCw className="w-3 h-3" />
                    Replay
                </button>
            </nav>

            <main key={key} className="flex-1 flex flex-col justify-center px-8 md:px-24 max-w-7xl mx-auto w-full py-20">

                {/* Large Typography Section */}
                <div className="mb-24">
                    <EditorialFlow gap={0.15}>
                        <h1 className="text-[12vw] leading-[0.85] font-light tracking-tighter text-neutral-950">
                            Editorial
                        </h1>
                        <h1 className="text-[12vw] leading-[0.85] font-light tracking-tighter text-neutral-950 italic">
                            Masking
                        </h1>
                        <h1 className="text-[12vw] leading-[0.85] font-light tracking-tighter text-neutral-950">
                            Revolution
                        </h1>
                    </EditorialFlow>
                </div>

                {/* Content Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 font-sans">
                    <div>
                        <EditorialReveal delay={0.6}>
                            <p className="text-xl text-neutral-600 leading-relaxed max-w-sm">
                                La diferencia entre un sitio web y una experiencia editorial radica en cómo se entrega el contenido.
                            </p>
                        </EditorialReveal>
                    </div>
                    <div>
                        <EditorialFlow gap={0.1} className="flex flex-col gap-6">
                            <p className="text-neutral-500 border-l-2 border-emerald-500 pl-6">
                                A diferencia del "fade in" tradicional, el "Masked Reveal" simula que el texto ya estaba ahí, solo esperando ser descubierto. Es la técnica favorita de sitios como Awwwards, Apple y Shopify Editions.
                            </p>
                            <p className="text-neutral-500">
                                Combina `overflow: hidden` con una traslación en Y del 110% al 0%. Simple, matemático, perfecto.
                            </p>
                        </EditorialFlow>
                    </div>
                </div>

            </main>
        </div>
    );
}
