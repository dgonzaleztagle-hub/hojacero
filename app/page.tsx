'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SmoothScroll from '@/components/layout/SmoothScroll';
import CustomCursor from '@/components/ui/CustomCursor';
import Loader from '@/components/layout/Loader';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import { ChatWidget } from '@/components/sales-agent/ChatWidget';

// Secciones below-the-fold cargadas lazy para reducir bundle inicial
const Services = dynamic(() => import('@/components/sections/Services'), { ssr: false });
const Portfolio = dynamic(() => import('@/components/sections/Portfolio'), { ssr: false });
const Cta = dynamic(() => import('@/components/sections/Cta'), { ssr: false });

const FluidBackground = dynamic(() => import('@/components/canvas/FluidBackground'), {
  ssr: false,
});

const INTRO_SEEN_KEY = 'hojacero_intro_seen';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const hasSeenIntro = localStorage.getItem(INTRO_SEEN_KEY);
    if (hasSeenIntro || isMobile) {
      // Ya vio el intro O es móvil → saltar directo
      setLoading(false);
      setShowIntro(false);
    } else {
      // Primera visita en desktop, mostrar intro
      setShowIntro(true);
    }

    // Diferir Three.js para no bloquear el primer pintado
    const timer = setTimeout(() => setShowCanvas(true), 100);
    return () => clearTimeout(timer);
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
        {/* Three.js se carga después del primer pintado para no bloquear FCP */}
        {showCanvas && <FluidBackground />}

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
