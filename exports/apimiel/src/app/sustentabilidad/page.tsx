"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function SustentabilidadPage() {
    return (
        <main className="min-h-screen pt-40 pb-40 bg-[#0A0A0A] text-[#FDF5E6]">
            <section className="px-6 md:px-24 max-w-7xl mx-auto">
                <div className="mb-20 border-b border-[#D4AF37]/30 pb-12">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] mb-6 block font-medium">Compromiso Biosférico</span>
                    <h1 className="text-4xl md:text-6xl font-serif leading-tight">
                        Cosechar <br /> <span className="italic font-light opacity-60">el Excedente.</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">

                    {/* Columna Texto (7 cols) - Ahora tiene prioridad visual */}
                    <div className="md:col-span-7">
                        <h2 className="text-2xl font-serif mb-8 text-[#D4AF37]">La Ley de la Hibernación</h2>

                        <div className="space-y-6 text-sm md:text-base font-light opacity-80 leading-relaxed text-justify">
                            <p>
                                La apicultura sustentable es la base de nuestro trabajo. En Apimiel, entendemos que la cosecha debe ser equilibrada, respetando el ciclo de vida de las abejas. Solo recolectamos el excedente de miel, permitiendo que las abejas mantengan reservas suficientes para alimentarse durante los meses de inactividad. De esta manera, garantizamos que puedan hibernar y mantener sus colonias intactas hasta la próxima temporada de polinización.
                            </p>
                            <p>
                                Este ciclo es vital no solo para la supervivencia de las abejas, sino también para la conservación de los bosques nativos. A través de la polinización, las abejas permiten el desarrollo de semillas y frutos, favoreciendo la biodiversidad y asegurando la salud de nuestros ecosistemas. Así, nuestra apicultura contribuye a la economía circular local y preserva los recursos naturales para las generaciones futuras.
                            </p>
                        </div>

                        <div className="mt-12 border-l border-[#D4AF37] pl-6">
                            <p className="text-xs uppercase tracking-widest text-[#D4AF37] mb-2">Principios Rectores</p>
                            <ul className="space-y-2">
                                <li className="text-sm opacity-60">Respeto a ciclos de floración endémica.</li>
                                <li className="text-sm opacity-60">Polinización dirigida de bosques nativos.</li>
                                <li className="text-sm opacity-60">Cero pesticidas en radio de vuelo.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Columna Imagen (5 cols) - Controlada */}
                    <div className="md:col-span-5 relative mt-8 md:mt-0">
                        <div className="relative aspect-[3/4] w-full max-w-sm ml-auto bg-[#1A1A1A] rounded-lg overflow-hidden border border-[#D4AF37]/20 shadow-2xl">
                            <Image
                                src="/prospectos/apimiel/assets/beehives_landscape.png"
                                alt="Bosque Nativo y Colmenas"
                                fill
                                className="object-cover opacity-80 hover:scale-105 transition-transform duration-1000 grayscale hover:grayscale-0"
                            />
                            {/* Overlay Sutil */}
                            <div className="absolute inset-0 bg-[#0A0A0A]/20 pointer-events-none" />
                        </div>
                        <p className="text-[9px] text-right mt-2 text-[#D4AF37]/50 uppercase tracking-widest mr-2">
                            Santa Bárbara, Región del Biobío
                        </p>
                    </div>

                </div>
            </section>
        </main>
    );
}
