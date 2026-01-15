'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SmoothScroll from '@/components/layout/SmoothScroll';
import CustomCursor from '@/components/ui/CustomCursor';
import Loader from '@/components/layout/Loader';
import Navbar from '@/components/layout/Navbar';
import HeroV5 from './HeroV5';
import Services from '@/components/sections/Services';
import Portfolio from '@/components/sections/Portfolio';
import CtaV5 from './CtaV5';

const FluidBackground = dynamic(() => import('@/components/canvas/FluidBackground'), {
    ssr: false,
});

// ============================================================================
// HOJACERO V5 - "THE PERFECT MERGE"
// Estética: V2 (Aire, elegancia, light typo)
// Funcionalidad: V4 (Hover translate, Spanish CTAs)
// ============================================================================

export default function HojaCeroV5Page() {
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
                    <HeroV5 />
                </div>

                <div id="services">
                    <Services />
                </div>

                <div id="portfolio">
                    <Portfolio />
                </div>

                <div id="cta">
                    <CtaV5 />
                </div>

            </main>
        </SmoothScroll>
    );
}
