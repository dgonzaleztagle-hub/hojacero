"use client";

import Hero from "./components/Hero";
import BentoGrid from "./components/BentoGrid";

export default function ApimielHomePage() {
    return (
        <main className="min-h-screen bg-[#0A0A0A]">
            {/* 
        Home Original WOW Aprobada 
        Nota: El Navbar y Footer ahora viven en layout.tsx 
        para evitar duplicidad. 
      */}
            <Hero />
            <BentoGrid />

            {/* Sección Sustentabilidad Compacta (Original) */}
            <section className="py-24 px-6 md:px-24 bg-[#FDF5E6] text-[#1A1A1A]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-4 block">Herencia & Futuro</span>
                        <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">Apicultura Sustentable.</h2>
                        <p className="text-xl font-light opacity-80 leading-relaxed mb-8">
                            En el corazón de Santa Bárbara, Biobío, cosechamos solo el excedente.
                            Garantizamos la hibernación de nuestras abejas y la polinización eterna del bosque nativo.
                        </p>
                        <button className="px-10 py-4 border border-[#1A1A1A] text-xs uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-[#FDF5E6] transition-all">
                            Explorar el Manifiesto
                        </button>
                    </div>
                    <div className="order-1 md:order-2 aspect-square bg-[#1A1A1A] relative overflow-hidden group">
                        <img
                            src="/prospectos/apimiel/assets/beehives_landscape.png"
                            alt="Paisaje Colmenas"
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}
