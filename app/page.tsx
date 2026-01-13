'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SmoothScroll from '@/components/layout/SmoothScroll';
import CustomCursor from '@/components/ui/CustomCursor';
import Loader from '@/components/layout/Loader';
import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import Portfolio from '@/components/sections/Portfolio';
import Cta from '@/components/sections/Cta';

const FluidBackground = dynamic(() => import('@/components/canvas/FluidBackground'), {
  ssr: false,
});

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <SmoothScroll>
      <CustomCursor />

      {loading && (
        <Loader onComplete={() => setLoading(false)} />
      )}

      {/* Main Content - hidden while loading? Or just covered?
          If we unmount Loader, we show this.
          Actually, we can render this underneath.
      */}
      <main className="relative min-h-screen w-full">
        <FluidBackground />

        {/* Navigation (Inline for now, move to component later) */}
        {!loading && (
          <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center mix-blend-difference animate-in fade-in duration-1000">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full border border-current animate-spin-slow"></div>
              <span className="font-display font-bold tracking-widest text-sm">HOJA CERO</span>
            </div>
            <div className="hidden md:flex gap-12 text-xs font-bold tracking-[0.2em] uppercase">
              <a href="#" className="hover-trigger relative group">Work<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full"></span></a>
              <a href="#" className="hover-trigger relative group">Studio<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full"></span></a>
              <a href="#" className="hover-trigger relative group">Contact<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full"></span></a>
            </div>
          </nav>
        )}

        <Hero />

        <Services />

        <Portfolio />

        <Cta />




      </main>
    </SmoothScroll>
  );
}
