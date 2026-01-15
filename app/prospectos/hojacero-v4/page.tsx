'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SmoothScroll from '@/components/layout/SmoothScroll';
import CustomCursor from '@/components/ui/CustomCursor';
import Loader from '@/components/layout/Loader';
import Navbar from '@/components/layout/Navbar';
import HeroV4 from './HeroV4';
import Services from '@/components/sections/Services';
import Portfolio from '@/components/sections/Portfolio';
import CtaV4 from './CtaV4';

const FluidBackground = dynamic(() => import('@/components/canvas/FluidBackground'), {
    ssr: false,
});

// ============================================================================
// HOJACERO V4 - "FINAL CANDIDATE"
// Objetivo: The perfect balance.
// Slogan: EN (Cool) -> ES (Impacto) on hover
// CTAs: Español (Conversión)
// Statement: Spatial UI experiment (Technical Flex)
// ============================================================================

export default function HojaCeroV4Page() {
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
                    <HeroV4 />
                </div>

                <div id="services">
                    <Services />
                </div>

                <div id="portfolio">
                    <Portfolio />
                </div>

                <div id="cta">
                    <CtaV4 />
                </div>

            </main>
        </SmoothScroll>
    );
}
