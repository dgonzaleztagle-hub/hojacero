'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SmoothScroll from '@/components/layout/SmoothScroll';
import CustomCursor from '@/components/ui/CustomCursor';
import Loader from '@/components/layout/Loader';
import Navbar from '@/components/layout/Navbar';
import HeroV2 from './HeroV2';
import Services from '@/components/sections/Services';
import Portfolio from '@/components/sections/Portfolio';
import CtaV2 from './CtaV2';

const FluidBackground = dynamic(() => import('@/components/canvas/FluidBackground'), {
    ssr: false,
});

// ============================================================================
// HOJACERO V2 - "MÁS ELEGANTE / MENOS TEXTO"
// Objetivo: Mínimo texto, máxima elegancia
// Copy: "Premium websites & apps for brands who care about aesthetics."
// ============================================================================

export default function HojaCeroV2Page() {
    const [loading, setLoading] = useState(true);

    return (
        <SmoothScroll>
            <CustomCursor />

            {loading && (
                <Loader onComplete={() => setLoading(false)} />
            )}

            <main className="relative min-h-screen w-full">
                <FluidBackground />

                {!loading && <Navbar />}

                <div id="hero">
                    <HeroV2 />
                </div>

                <div id="services">
                    <Services />
                </div>

                <div id="portfolio">
                    <Portfolio />
                </div>

                <div id="cta">
                    <CtaV2 />
                </div>

            </main>
        </SmoothScroll>
    );
}
