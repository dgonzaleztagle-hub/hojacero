'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Calendar, Menu, Phone, ArrowLeftRight } from 'lucide-react';

export default function FamilySmilePage() {
    return (
        <main className="w-full relative overflow-hidden">

            {/* --- NAVBAR --- */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 flex justify-between items-center backdrop-blur-md bg-[#FAFAF9]/80 border-b border-black/5">
                <div className="flex items-center gap-2">
                    {/* Logo Concept */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0F766E] to-[#2DD4BF] flex items-center justify-center text-white font-serif italic font-bold text-lg">
                        F
                    </div>
                    <span className="font-serif font-bold text-xl tracking-tight text-[#0F766E]">Family Smile</span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 tracking-wide">
                    <a href="#" className="hover:text-[#0F766E] transition-colors">Clínica</a>
                    <a href="#" className="hover:text-[#0F766E] transition-colors">Periodoncia</a>
                    <a href="#" className="hover:text-[#0F766E] transition-colors">Estética Facial</a>
                    <a href="#" className="hover:text-[#0F766E] transition-colors">Casos de Éxito</a>
                </div>

                <div className="flex items-center gap-4">
                    <button className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0F766E] hover:opacity-70 transition-opacity">
                        <Phone className="w-3.5 h-3.5" /> +56 9 8815 9895
                    </button>
                    <button className="bg-[#18181B] text-[#FAFAF9] px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#0F766E] transition-colors duration-300 shadow-lg shadow-black/5 flex items-center gap-2">
                        Agendar Hora <Calendar className="w-3.5 h-3.5" />
                    </button>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-[90vh] flex flex-col pt-32 px-6 md:px-12 pb-20">

                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 w-[50vw] h-[80vh] bg-gradient-to-bl from-[#2DD4BF]/10 to-transparent rounded-bl-[10rem] -z-10 blur-3xl opacity-60" />
                <div className="absolute bottom-0 left-0 w-[40vw] h-[60vh] bg-gradient-to-tr from-[#C084FC]/5 to-transparent rounded-tr-[15rem] -z-10 blur-3xl opacity-40" />

                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center flex-1">

                    {/* Text Content */}
                    <div className="lg:col-span-7 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#0F766E]/20 bg-[#0F766E]/5 text-[#0F766E] text-[10px] uppercase font-bold tracking-widest mb-6">
                                <Star className="w-3 h-3 fill-current" /> Excelencia en Las Condes
                            </div>

                            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-[#18181B] mb-6">
                                Más que dientes.<br />
                                <span className="italic text-[#0F766E]">Armonía Facial.</span>
                            </h1>

                            <p className="font-sans text-lg md:text-xl text-zinc-500 font-light leading-relaxed max-w-xl">
                                La fusión perfecta entre <strong className="text-zinc-800 font-medium">salud clínica avanzada</strong> y <strong className="text-zinc-800 font-medium">estética de alta gama</strong>. Liderado por Dr. Juan Carlos Quiroga.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="flex flex-wrap items-center gap-4"
                        >
                            <button className="group bg-[#0F766E] text-white px-8 py-4 rounded-full text-sm font-bold tracking-wide shadow-xl shadow-[#0F766E]/20 hover:shadow-2xl hover:bg-[#0D6059] transition-all flex items-center gap-3">
                                Evaluación Estética Gratuitas
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button className="px-8 py-4 rounded-full border border-black/10 text-zinc-600 font-medium text-sm hover:bg-white hover:border-black/20 transition-all">
                                Ver Tratamientos
                            </button>
                        </motion.div>

                        {/* Social Proof Mini */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-center gap-4 pt-4"
                        >
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-zinc-200 border-2 border-[#FAFAF9] flex items-center justify-center text-xs font-bold text-zinc-400">
                                        User
                                    </div>
                                ))}
                            </div>
                            <div className="text-xs text-zinc-500">
                                <div className="flex text-yellow-500 mb-0.5">★★★★★</div>
                                <span className="font-bold text-zinc-800">5.0/5</span> en Google Reviews
                            </div>
                        </motion.div>
                    </div>

                    {/* Visual Content (High-End Image) */}
                    <div className="lg:col-span-5 relative h-[500px] lg:h-[700px]">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-2xl shadow-[#0F766E]/10"
                        >
                            {/* Hero Image */}
                            <div className="absolute inset-0 bg-zinc-200">
                                <img
                                    src="/prospectos/family-smile/hero.png"
                                    alt="Sonrisa perfecta y natural"
                                    className="w-full h-full object-cover"
                                />
                                <div className="w-full h-full bg-gradient-to-b from-transparent to-black/30 absolute inset-0 z-10"></div>

                                {/* Decorative Elements on top of image */}
                                <div className="absolute bottom-10 left-10 right-10 z-20 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-[#0F766E] font-bold mb-1">Resultado Real</p>
                                            <h3 className="font-serif text-xl italic text-zinc-900">Rinolook & Diseño de Sonrisa</h3>
                                        </div>
                                        <div className="bg-[#2DD4BF] text-white text-[10px] font-bold px-2 py-1 rounded">ANTES / DESPUÉS</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- SERVICES TEASER (Bento) --- */}
            <section className="px-6 md:px-12 py-20 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-[#0F766E] text-xs font-bold uppercase tracking-widest">Nuestras Especialidades</span>
                        <h2 className="font-serif text-4xl md:text-5xl text-[#18181B]">Ciencia y Arte <span className="italic text-zinc-400">&</span> Equilibrio.</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
                        {/* Card 1: Dental */}
                        <div className="md:col-span-1 bg-[#FAFAF9] rounded-[2.5rem] p-8 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-500 group border border-transparent hover:border-[#0F766E]/10">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-[#0F766E]/10 flex items-center justify-center text-[#0F766E] mb-6">
                                    <span className="text-2xl">🦷</span>
                                </div>
                                <h3 className="font-serif text-2xl mb-2 text-zinc-900">Odontología Clínica</h3>
                                <p className="text-sm text-zinc-500 leading-relaxed">
                                    Periodoncia, Ortodoncia invisible y rehabilitación oral con tecnología mínimamente invasiva.
                                </p>
                            </div>
                            <div className="w-full h-40 bg-zinc-200 rounded-2xl mt-8 group-hover:shadow-lg transition-shadow overflow-hidden">
                                <img src="/prospectos/family-smile/dental.png" alt="Clínica Dental Minimalista" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                            </div>
                        </div>

                        {/* Card 2: Aesthetic (Featured) */}
                        <div className="md:col-span-2 bg-[#18181B] rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-8 relative overflow-hidden group">
                            {/* Background Image Absolute */}
                            <div className="absolute inset-0 z-0">
                                <img src="/prospectos/family-smile/aesthetic.png" alt="Estética Facial 3D" className="w-full h-full object-cover opacity-30 mix-blend-screen group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#18181B] via-[#18181B]/80 to-transparent"></div>
                            </div>

                            <div className="z-10 flex flex-col justify-center max-w-sm">
                                <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-white/80 text-[10px] font-bold uppercase tracking-widest mb-6 w-fit">
                                    Trending
                                </div>
                                <h3 className="font-serif text-4xl text-white mb-4 leading-tight">
                                    Medicina Estética <br /><span className="italic text-[#2DD4BF]">Facial Avanzada</span>
                                </h3>
                                <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                                    Armonización orofacial completa. Rinomodelación, Ácido Hialurónico, Bioestimuladores y Endoláser. Resultados naturales sin cirugía.
                                </p>
                                <button className="bg-white text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#2DD4BF] transition-colors w-fit">
                                    Ver Procedimientos
                                </button>
                            </div>

                            <div className="flex-1 bg-white/5 rounded-3xl border border-white/10 p-6 flex items-center justify-center relative group-hover:scale-[1.02] transition-transform duration-700 backdrop-blur-sm z-10 w-full h-full min-h-[300px]">
                                <BeforeAfterSlider />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

function BeforeAfterSlider() {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;
        setSliderPosition(percentage);
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onTouchMove={(e) => {
                if (!containerRef.current) return;
                const rect = containerRef.current.getBoundingClientRect();
                const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
                const percentage = (x / rect.width) * 100;
                setSliderPosition(percentage);
            }}
            className="relative w-full h-full rounded-2xl overflow-hidden cursor-ew-resize select-none shadow-2xl"
        >
            {/* Image 1 (Background - AFTER/Color) */}
            <img
                src="/prospectos/family-smile/comparison.png"
                alt="After Result"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-[#2DD4BF] text-white text-[10px] font-bold px-2 py-1 rounded z-10">DESPUÉS</div>

            {/* Image 2 (Foreground - BEFORE/BW - Clipped) */}
            <div
                className="absolute inset-0 overflow-hidden border-r-2 border-white/50"
                style={{ width: `${sliderPosition}%` }}
            >
                <img
                    src="/prospectos/family-smile/comparison.png"
                    alt="Before Result"
                    className="absolute inset-0 w-full max-w-none h-full object-cover filter grayscale contrast-125 brightness-90"
                    style={{ width: containerRef.current ? containerRef.current.offsetWidth : '100%' }}
                />
                <div className="absolute top-4 left-4 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md">ANTES</div>
            </div>

            {/* Dragger Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white/50 shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none flex items-center justify-center"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg transform -translate-x-1/2">
                    <ArrowLeftRight size={14} className="text-[#0F766E]" />
                </div>
            </div>
        </div>
    );
}
