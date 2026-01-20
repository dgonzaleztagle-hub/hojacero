"use client";

import { motion } from "framer-motion";

export default function Nosotros() {
    return (
        <main className="pt-32 pb-24 bg-[#1A1A1A] text-[#FDF5E6]">
            {/* Header Nosotros */}
            <section className="px-6 md:px-24 mb-32">
                <div className="max-w-4xl">
                    <span className="text-xs uppercase tracking-[0.4em] text-[#D4AF37] mb-6 block">Nuestra Herencia</span>
                    <h1 className="text-6xl md:text-8xl font-serif leading-tight mb-12">Desde el Corazón de Santa Bárbara.</h1>
                    <p className="text-xl md:text-2xl font-light text-[#FDF5E6]/80 leading-relaxed max-w-2xl">
                        Fundada a principios de los años 2000, Apimiel nació en los bosques endémicos de Quillaileo,
                        con la visión de llevar la pureza de la miel chilena al mundo, respetando siempre el equilibrio de la colmena.
                    </p>
                </div>
            </section>

            {/* Grano de Verdad: Historia & Misión */}
            <section id="historia" className="py-24 px-6 md:px-24 bg-[#FDF5E6] text-[#1A1A1A]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                    <div className="relative aspect-[4/5] bg-[#1A1A1A] overflow-hidden">
                        <img
                            src="/prospectos/apimiel/assets/flora_detail.png"
                            alt="Detalle Flora Endémica"
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                        />
                    </div>
                    <div>
                        <h2 className="text-5xl font-serif mb-8" id="mision">Nuestra Misión</h2>
                        <p className="text-lg font-light leading-relaxed mb-12">
                            Producir y comercializar productos apícolas orgánicos de la más alta calidad,
                            que promuevan el bienestar de nuestros consumidores y contribuyan a la preservación del ecosistema.
                            Creemos en la apicultura como un acto de custodia forestal.
                        </p>

                        <h2 className="text-5xl font-serif mb-8" id="vision">Visión de Futuro</h2>
                        <p className="text-lg font-light leading-relaxed">
                            Consolidarnos como líderes nacionales en la producción de miel orgánica,
                            siendo reconocidos por el impacto positivo en la conservación de los bosques endémicos
                            y el fortalecimiento de la economía local de la Región del Biobío.
                        </p>
                    </div>
                </div>
            </section>

            {/* Valores en Grid Asimétrico */}
            <section className="py-24 px-6 md:px-24">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-7 bg-[#2A2A2A] p-12 flex flex-col justify-end min-h-[400px]">
                            <span className="text-[#D4AF37] text-4xl mb-6 font-serif">01</span>
                            <h3 className="text-2xl font-serif mb-4">Origen Protegido</h3>
                            <p className="text-[#FDF5E6]/60 font-light">
                                Nuestras colmenas se encuentran en zonas libres de pesticidas y contaminación industrial.
                            </p>
                        </div>
                        <div className="md:col-span-5 bg-[#D4AF37] p-12 text-[#1A1A1A] min-h-[400px] flex flex-col justify-end">
                            <span className="text-4xl mb-6 font-serif">02</span>
                            <h3 className="text-2xl font-serif mb-4">Pureza Cruda</h3>
                            <p className="opacity-80 font-light text-lg">
                                No filtramos ni calentamos nuestra miel. Conservamos cada enzima y polen tal como sale de la colmena.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
