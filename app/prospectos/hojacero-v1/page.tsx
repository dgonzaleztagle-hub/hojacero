'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SmoothScroll from '@/components/layout/SmoothScroll';
import CustomCursor from '@/components/ui/CustomCursor';
import Loader from '@/components/layout/Loader';
import Navbar from '@/components/layout/Navbar';
import HeroV1 from './HeroV1';
import Services from '@/components/sections/Services';
import Portfolio from '@/components/sections/Portfolio';
import CtaV1 from './CtaV1';

const FluidBackground = dynamic(() => import('@/components/canvas/FluidBackground'), {
    ssr: false,
});

// ============================================================================
// HOJACERO V1 - "TERMINAL PREMIUM"
// Objetivo: Mantener estética espacial + agregar CTAs que conviertan
// Copy: "Design that looks expensive. Engineering that performs."
// ============================================================================

export default function HojaCeroV1Page() {
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
                    <HeroV1 />
                </div>

                <div id="services">
                    <Services />
                </div>

                <div id="portfolio">
                    <Portfolio />
                </div>

                <div id="cta">
                    <CtaV1 />
                </div>

            </main>
        </SmoothScroll>
    );
}
