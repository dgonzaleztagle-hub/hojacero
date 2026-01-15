'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SmoothScroll from '@/components/layout/SmoothScroll';
import CustomCursor from '@/components/ui/CustomCursor';
import Loader from '@/components/layout/Loader';
import Navbar from '@/components/layout/Navbar';
import HeroV3 from './HeroV3';
import Services from '@/components/sections/Services';
import Portfolio from '@/components/sections/Portfolio';
import CtaV3 from './CtaV3';

const FluidBackground = dynamic(() => import('@/components/canvas/FluidBackground'), {
    ssr: false,
});

// ============================================================================
// HOJACERO V3 - "CASI ARROGANTE"
// Objetivo: Provocativo, confiado, memorable
// Copy: "If your website looks cheap, your business looks cheap. We fix that."
// ============================================================================

export default function HojaCeroV3Page() {
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
                    <HeroV3 />
                </div>

                <div id="services">
                    <Services />
                </div>

                <div id="portfolio">
                    <Portfolio />
                </div>

                <div id="cta">
                    <CtaV3 />
                </div>

            </main>
        </SmoothScroll>
    );
}
