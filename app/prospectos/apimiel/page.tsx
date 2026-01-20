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

            {/* Sección Sustentabilidad Compacta (Overlap Hojo Layout) */}
            <section className="relative py-24 px-6 md:px-24 text-[#1A1A1A] overflow-hidden">
                {/* Fondo Parcial Beige (Overlap Effect) */}
                <div className="absolute bottom-0 left-0 right-0 h-[85%] bg-[#FDF5E6] rounded-t-[5rem] z-0 overflow-hidden">
                    {/* Textura contenida en el bloque beige */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] contrast-150 brightness-100 mix-blend-multiply" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 pt-12 md:pt-10">
                        <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-4 block font-bold">Herencia & Futuro</span>
                        <h2 className="text-5xl md:text-6xl font-serif mb-6 leading-[1.1]">Apicultura <br /><span className="italic font-light">Sustentable</span>.</h2>
                        <p className="text-sm md:text-base font-light opacity-80 leading-relaxed mb-6 max-w-lg text-justify">
                            La apicultura sustentable es la base de nuestro trabajo. En Apimiel, entendemos que la cosecha debe ser equilibrada, respetando el ciclo de vida de las abejas. Solo recolectamos el excedente de miel, permitiendo que las abejas mantengan reservas suficientes para alimentarse durante los meses de inactividad.
                        </p>
                        <p className="text-sm md:text-base font-light opacity-80 leading-relaxed mb-8 max-w-lg text-justify">
                            Este ciclo es vital no solo para la supervivencia de las abejas, sino también para la conservación de los bosques nativos. A través de la polinización, las abejas permiten el desarrollo de semillas y frutos, favoreciendo la biodiversidad y asegurando la salud de nuestros ecosistemas.
                        </p>
                        <a href="/prospectos/apimiel/nosotros" className="inline-block group px-8 py-3 border border-[#1A1A1A]/20 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#1A1A1A] hover:text-[#FDF5E6] transition-all rounded-full duration-500">
                            Explorar el Manifiesto
                        </a>
                    </div>
                    {/* Imagen: Flota entre el negro (arriba) y el beige (abajo) */}
                    <div className="order-1 md:order-2 aspect-video bg-[#1A1A1A] relative overflow-hidden group rounded-[2.5rem] shadow-2xl z-20">
                        <img
                            src="/prospectos/apimiel/assets/beehives_landscape.png"
                            alt="Paisaje Colmenas"
                            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                        />
                        {/* Barniz fotográfico */}
                        <div className="absolute inset-0 bg-[#A67B5B] mix-blend-color opacity-10 pointer-events-none" />
                    </div>
                </div>
            </section>
        </main>
    );
}
