"use client";

import { BurningPaper } from "@/components/fx/BurningPaper";
import { LiquidBackground } from "@/components/fx/LiquidBackground";
import { MagneticButton } from "@/components/fx/MagneticButton";
import { EditorialReveal } from "@/components/fx/EditorialReveal";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Flame } from "lucide-react";

export default function BurningPaperPage() {
    const [isBurning, setIsBurning] = useState(false);

    return (
        <div className="min-h-screen relative font-serif text-neutral-900 bg-transparent">

            {/* Background (Always behind) */}
            <LiquidBackground className="fixed inset-0 opacity-80" />

            {/* Nav */}
            <nav className="fixed top-0 left-0 w-full p-8 flex justify-between items-center z-50">
                <Link
                    href="/design-lab"
                    className="inline-flex items-center gap-2 hover:text-emerald-700 transition-colors font-sans uppercase tracking-widest text-xs"
                >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Lab</span>
                </Link>
                <MagneticButton strength={0.2}>
                    <button
                        onClick={() => setIsBurning(!isBurning)}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full border transition-all uppercase tracking-widest text-xs font-bold font-sans ${isBurning ? 'bg-orange-500 text-white border-orange-500' : 'bg-transparent border-neutral-900 text-neutral-900'}`}
                    >
                        <Flame className={`w-4 h-4 ${isBurning ? 'animate-pulse' : ''}`} />
                        {isBurning ? "Restore Card" : "Burn Card"}
                    </button>
                </MagneticButton>
            </nav>

            <main className="flex-1 min-h-screen flex flex-col items-center justify-center p-8">

                <div className="relative w-[400px] h-[550px]">
                    {/* The "Paper" Component */}
                    {/* We overlay the BurningPaper on top of 'hidden' content to reveal it? 
                Actually, the BurningPaper IS the content that disappears. 
                So let's put something BEHIND it. */}

                    {/* Hidden Content (Revealed when burned) */}
                    <div className="absolute inset-0 bg-white shadow-2xl rounded-sm flex flex-col items-center justify-center p-8 text-center border border-neutral-200">
                        <EditorialReveal delay={0.5}>
                            <span className="text-emerald-600 font-sans text-xs uppercase tracking-widest mb-4 block">Hidden Message</span>
                            <h2 className="text-4xl font-light mb-4">The Future is<br />Organic</h2>
                            <p className="text-neutral-500 text-sm font-sans leading-relaxed">
                                Beneath the surface lies the true essence of the design. Fire merely cleanses the path for the new.
                            </p>
                        </EditorialReveal>
                    </div>

                    {/* The Burning Layer (On top) */}
                    <div className="absolute inset-[-50px] pointer-events-none z-10 w-[500px] h-[650px]">
                        {/* 
                    Using a texture that looks like paper or a card.
                    For this demo, we use a textured image.
                 */}
                        <BurningPaper
                            src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1000&auto=format&fit=crop"
                            isBurning={isBurning}
                            className="w-full h-full"
                        />
                    </div>

                </div>

                <div className="mt-12 text-center max-w-md">
                    <p className="text-neutral-500 font-sans text-sm">
                        Experiment #07: True Dissolve Shader.
                        <br />
                        Uses Perlin noise to calculate the burn threshold. Pixels within the threshold turn emissive orange before being discarded.
                    </p>
                </div>

            </main>
        </div>
    );
}
