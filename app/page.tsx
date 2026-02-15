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

const FluidBackground = dynamic(() => import('@/components/canvas/FluidBackground'), { ssr: false });
const ChatWidget = dynamic(() => import('@/components/sales-agent/ChatWidget').then(mod => mod.ChatWidget), { ssr: false });

const INTRO_SEEN_KEY = 'hojacero_intro_seen';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const hasSeenIntro = localStorage.getItem(INTRO_SEEN_KEY);

    if (isMobile && !hasSeenIntro) {
      setShowIntro(true);
    } else {
      setLoading(false);
      setShowIntro(false);
    }

    // Diferir elementos pesados
    const canvasTimer = setTimeout(() => setShowCanvas(true), 200);
    const chatTimer = setTimeout(() => setShowChat(true), 3000);

    return () => {
      clearTimeout(canvasTimer);
      clearTimeout(chatTimer);
    };
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

      {/* Bot cargado con delay para no afectar scores */}
      {showChat && <ChatWidget />}
    </SmoothScroll>
  );
}
