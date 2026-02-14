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
  const [isMobile, setIsMobile] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    const hasSeenIntro = localStorage.getItem(INTRO_SEEN_KEY);
    if (hasSeenIntro || mobile) {
      // Ya vio el intro O es móvil → saltar directo
      setLoading(false);
      setShowIntro(false);
    } else {
      // Primera visita en desktop, mostrar intro
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
        {/* Three.js solo en desktop — en móvil usa gradiente CSS (600KB menos de JS) */}
        {!isMobile ? (
          <FluidBackground />
        ) : (
          <div className="fixed top-0 left-0 w-full h-full -z-10 bg-black"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,240,255,0.05) 0%, black 70%)' }} />
        )}

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
