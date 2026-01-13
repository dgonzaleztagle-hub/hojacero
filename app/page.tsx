import { useState } from 'react';
import dynamic from 'next/dynamic';
import SmoothScroll from '@/components/layout/SmoothScroll';
import CustomCursor from '@/components/ui/CustomCursor';
import Loader from '@/components/layout/Loader';
import Navbar from '@/components/layout/Navbar'; // Import Navbar
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

      <main className="relative min-h-screen w-full">
        <FluidBackground />

        {!loading && <Navbar />}

        <div id="hero">
          <Hero />
        </div>

        <div id="services">
          <Services />
        </div>

        <div id="portfolio">
          <Portfolio />
        </div>

        <div id="cta">
          <Cta />
        </div>

      </main>
    </SmoothScroll>
  );
}
