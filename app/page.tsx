'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SmoothScroll from '@/components/layout/SmoothScroll';
import CustomCursor from '@/components/ui/CustomCursor';
import Loader from '@/components/layout/Loader';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import Portfolio from '@/components/sections/Portfolio';
import Cta from '@/components/sections/Cta';
import { ChatWidget } from '@/components/sales-agent/ChatWidget';

const FluidBackground = dynamic(() => import('@/components/canvas/FluidBackground'), {
  ssr: false,
});

const INTRO_SEEN_KEY = 'hojacero_intro_seen';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  // Check localStorage on mount
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem(INTRO_SEEN_KEY);
    if (hasSeenIntro) {
      // Ya vio el intro → saltar directo
      setLoading(false);
      setShowIntro(false);
    } else {
      // Primera visita → mostrar intro (el video actúa como loading screen natural)
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    localStorage.setItem(INTRO_SEEN_KEY, 'true');
    setLoading(false);
  };

  return (
    <SmoothScroll>
      <CustomCursor />

      {loading && showIntro && (
        <Loader onComplete={handleIntroComplete} />
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

      {/* Bot solo disponible en landing */}
      <ChatWidget />
    </SmoothScroll>
  );
}
