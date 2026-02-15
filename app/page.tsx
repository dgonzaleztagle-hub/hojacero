'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SmoothScroll from '@/components/layout/SmoothScroll';
import CustomCursor from '@/components/ui/CustomCursor';
import Loader from '@/components/layout/Loader';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';

// Secciones below-the-fold cargadas lazy para liberar el hilo principal e inicial
const Services = dynamic(() => import('@/components/sections/Services'), { ssr: false });
const Portfolio = dynamic(() => import('@/components/sections/Portfolio'), { ssr: false });
const Cta = dynamic(() => import('@/components/sections/Cta'), { ssr: false });
const FluidBackground = dynamic(() => import('@/components/canvas/FluidBackground'), { ssr: false });
const ChatWidget = dynamic(() => import('@/components/sales-agent/ChatWidget').then(mod => mod.ChatWidget), { ssr: false });
const Footer = dynamic(() => import('@/components/layout/Footer'), { ssr: false });

const INTRO_SEEN_KEY = 'hojacero_intro_seen';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const hasSeenIntro = localStorage.getItem(INTRO_SEEN_KEY);

    if (isMobile && !hasSeenIntro) {
      setShowIntro(true);
    } else {
      setLoading(false);
      setShowIntro(false);
      // En desktop o re-visita, cargar el canvas rápido
      setShowCanvas(true);
    }

    // El bot siempre al final
    const chatTimer = setTimeout(() => setShowChat(true), 4000);
    return () => clearTimeout(chatTimer);
  }, []);

  const handleIntroComplete = () => {
    localStorage.setItem(INTRO_SEEN_KEY, 'true');
    setLoading(false);
    // IMPORTANTE: En móvil, cargar Three.js RECIÉN cuando termina el video
    // Esto evita que compitan por ancho de banda y CPU
    setShowCanvas(true);
  };

  return (
    <SmoothScroll>
      <CustomCursor />

      {loading && showIntro && (
        <Loader onComplete={handleIntroComplete} />
      )}

      <main className="relative min-h-screen w-full">
        {/* Solo montamos Three.js cuando la intro termina (o si es desktop) */}
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

        <Footer />

      </main>

      {showChat && <ChatWidget />}
    </SmoothScroll>
  );
}
