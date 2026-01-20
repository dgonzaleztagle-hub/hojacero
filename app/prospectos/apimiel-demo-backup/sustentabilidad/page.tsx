"use client";

import { motion } from "framer-motion";

export default function Sustentabilidad() {
    return (
        <main className="pt-32 pb-24 bg-[#1A1A1A] text-[#FDF5E6]">
            {/* Hero Sustentabilidad */}
            <section className="px-6 md:px-24 mb-32 h-[70vh] flex items-center">
                <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="text-xs uppercase tracking-[0.4em] text-[#D4AF37] mb-6 block">Reserva de Vida</span>
                        <h1 className="text-6xl md:text-7xl font-serif leading-tight mb-8">Apicultura Sustentable.</h1>
                        <p className="text-lg font-light text-[#FDF5E6]/70 leading-relaxed">
                            En Apimiel, el respeto por la biología de la abeja es la prioridad absoluta.
                            Nuestro método de trabajo se basa en el equilibrio, asegurando que la colmena
                            permanezca fuerte para las futuras generaciones.
                        </p>
                    </div>
                    <div className="relative aspect-square overflow-hidden border border-[#D4AF37]/20">
                        <img
                            src="/prospectos/apimiel/assets/beehives_landscape.png"
                            alt="Equilibrio Ecológico"
                            className="absolute inset-0 w-full h-full object-cover scale-110"
                        />
                        <div className="absolute inset-0 bg-[#1A1A1A]/30" />
                    </div>
                </div>
            </section>

            {/* El Grano de Verdad: Reserva de Hibernación */}
            <section className="py-32 px-6 md:px-24 bg-[#FDF5E6] text-[#1A1A1A]">
                <div className="max-w-5xl mx-auto text-center">
                    <span className="text-xs uppercase tracking-widest text-[#D4AF37] mb-4 block">La Diferencia Apimiel</span>
                    <h2 className="text-5xl md:text-6xl font-serif mb-12">La Cosecha del Excedente.</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left mt-24">
                        <div className="space-y-4">
                            <h4 className="font-serif text-xl border-b border-[#1A1A1A]/10 pb-4">01. Hibernación Protegida</h4>
                            <p className="font-light opacity-70">
                                A diferencia de la industria, garantizamos que las abejas mantengan sus reservas de miel
                                suficientes para los fríos inviernos de Santa Bárbara.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-serif text-xl border-b border-[#1A1A1A]/10 pb-4">02. Ciclo de Polinización</h4>
                            <p className="font-light opacity-70">
                                Nuestras colonias sanas aseguran la polinización de miles de hectáreas de bosque nativo,
                                devolviendo vida al Biobío en cada ciclo.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-serif text-xl border-b border-[#1A1A1A]/10 pb-4">03. Bosque Endémico</h4>
                            <p className="font-light opacity-70">
                                Trabajamos exclusivamente con flora nativa (Quillay, Arrayán, Corcolen), preservando la
                                genética de especies únicas en el mundo.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quote de Autoridad */}
            <section className="py-24 px-6 text-center italic font-serif text-3xl md:text-4xl text-[#D4AF37]/60">
                <div className="max-w-3xl mx-auto">
                    "No tomamos lo que queremos, tomamos lo que la naturaleza nos regala después de cuidarla."
                </div>
            </section>
        </main>
    );
}
