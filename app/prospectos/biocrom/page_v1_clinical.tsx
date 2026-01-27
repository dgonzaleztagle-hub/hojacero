'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    Beaker,
    Settings,
    Cpu,
    ShieldCheck,
    BarChart4,
    GraduationCap,
    Microscope,
    Mail,
    Phone,
    MapPin,
    ChevronRight,
    Menu,
    X,
    Search,
    ShoppingCart,
    ChevronDown
} from 'lucide-react';

import { DemoTracker } from '@/components/tracking/DemoTracker';
import { BentoGrid, BentoGridItem } from '@/components/premium/BentoGrid';
import { AnimatedCounter } from '@/components/premium/AnimatedCounter';
import { Magnetic } from '@/components/premium/Magnetic';
import { useScroll, useTransform } from 'framer-motion';
import { Accordion } from '@/components/premium/Accordion';
import { InfiniteLogoScroll } from '@/components/premium/InfiniteLogoScroll';

const BiocromLanding = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const containerRef = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]); // Dolly Zoom Effect

    const partnerLogos = [
        "/prospectos/biocrom/logos/hta.png",
        "/prospectos/biocrom/logos/kromasil.png",
        "/prospectos/biocrom/logos/quadrex.png",
        "/prospectos/biocrom/logos/mz.png",
        "/prospectos/biocrom/logos/dataapex.png",
        "/prospectos/biocrom/logos/persee.png",
    ];

    // FAQ Data for AEO/GEO Visibility
    const faqs = [
        {
            question: "¿Biocrom está habilitado para compras por Mercado Público?",
            answer: "Sí, Biocrom (Asesorías Patricio Germán Puentes Gutiérrez E.I.R.L.) es proveedor habilitado del Estado de Chile para convenios marco y licitaciones directas."
        },
        {
            question: "¿Qué marcas de cromatografía representan en Chile?",
            answer: "Somos distribuidores oficiales de DataApex (Software Clarity), Kromasil (Columnas HPLC), y brindamos soporte técnico multimarca (Agilent, Shimadzu, Waters)."
        },
        {
            question: "¿Realizan validación de sistemas cromatográficos?",
            answer: "Sí, ejecutamos protocolos IQ/OQ/PQ para validación de sistemas HPLC y GC, asegurando cumplimiento normativo GLP/GMP."
        }
    ];

    return (
        <main className="relative min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
            <DemoTracker />

            {/* --- PROTOCOLO MIRROR: MENÚ DE 2 NIVELES (9 ÍTEMS) --- */}
            <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">

                {/* Top Bar: Contacto & Accesos Rápidos */}
                <div className="hidden md:flex justify-between items-center px-6 md:px-24 py-2 bg-slate-900 text-white text-[10px] uppercase tracking-widest font-bold">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2"><Phone className="w-3 h-3" /> +56 9 5006 9920</span>
                        <span className="flex items-center gap-2"><Mail className="w-3 h-3" /> contacto@biocrom.cl</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#catalogo" className="hover:text-blue-300 transition-colors">Catálogo de Productos</a>
                        <a href="#galeria" className="hover:text-blue-300 transition-colors">Galería de Fotos</a>
                        <a href="#contacto" className="hover:text-blue-300 transition-colors">Contacto</a>
                    </div>
                </div>

                {/* Main Nav: Identidad & Negocio Core */}
                <div className="px-6 md:px-24 py-4 md:py-6 flex justify-between items-center">
                    {/* Logo */}
                    {/* Logo Real */}
                    {/* Logo Real */}
                    <div className="flex items-center gap-2">
                        <div className="relative w-72 h-16">
                            <Image
                                src="/prospectos/biocrom/logo-v2.png"
                                alt="Biocrom EIRL Logo"
                                fill
                                className="object-contain object-left"
                                priority
                            />
                        </div>
                    </div>

                    {/* Desktop Menu - Core Business Items */}
                    <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-[#0f172a]">
                        <a href="#inicio" className="hover:text-blue-600 transition-colors">Inicio</a>
                        <a href="#nosotros" className="hover:text-blue-600 transition-colors">Quiénes Somos</a>
                        <a href="#servicios" className="hover:text-blue-600 transition-colors">Servicios</a>
                        <a href="#asesorias" className="hover:text-blue-600 transition-colors">Asesorías</a>
                        <a href="#ventas" className="hover:text-blue-600 transition-colors">Ventas</a>
                        <a href="#capacitacion" className="hover:text-blue-600 transition-colors text-blue-700">Capacitación</a>
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-900 font-bold">
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden bg-slate-50 border-t border-slate-200 px-6 py-8 space-y-4 shadow-xl">
                        {['Inicio', 'Quiénes Somos', 'Asesorías', 'Ventas', 'Servicios', 'Capacitación', 'Catálogo', 'Galería', 'Contacto'].map((item) => (
                            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="block text-sm font-bold uppercase tracking-widest text-slate-800 py-2 border-b border-slate-200 last:border-0 hover:pl-2 transition-all hover:text-blue-600">
                                {item}
                            </a>
                        ))}
                    </div>
                )}
            </header>

            {/* --- HERO SECTION: CLINICAL PRECISION (Fallback Solido) --- */}
            <section ref={containerRef} id="inicio" className="relative pt-40 md:pt-48 pb-24 px-6 md:px-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-[1920px] mx-auto">
                <div className="order-2 md:order-1 relative z-10">
                    <div className="inline-block py-2 px-4 bg-blue-50 text-blue-800 border border-blue-100 font-bold text-[10px] uppercase tracking-[0.2em] mb-8">
                        Distribuidor Autorizado DataApex
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-[#0f172a] leading-[0.9] mb-8">
                        Analytical<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">Precision.</span>
                    </h1>
                    <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-md mb-10">
                        Elevando el estándar del análisis científico en Chile. Especialistas en cromatografía líquida, gaseosa y microscopía óptica desde 2014.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Magnetic>
                            <button className="bg-[#0f172a] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-2xl shadow-blue-900/20">
                                Ver Catálogo
                            </button>
                        </Magnetic>
                        <Magnetic>
                            <button className="border-2 border-slate-200 text-slate-900 px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors">
                                Servicio Técnico
                            </button>
                        </Magnetic>
                    </div>
                </div>

                <div className="order-1 md:order-2 relative h-[400px] md:h-[600px] w-full bg-slate-100 rounded-lg overflow-hidden group">
                    {/* Defensive CSS: Fallback Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center z-0">
                        <div className="text-slate-400 font-bold uppercase tracking-widest">HPLC Column Visualization</div>
                    </div>
                    {/* Main Image - Full HD with Parallax */}
                    <motion.div style={{ y, scale }} className="relative w-full h-[120%] -top-[10%]">
                        <Image
                            src="/prospectos/biocrom/hero.png"
                            alt="Columna HPLC de Alta Precisión Biocrom"
                            fill
                            className="object-cover relative z-10"
                            priority
                        />
                    </motion.div>
                </div>
            </section>

            {/* --- IDENTITY: INFINITE TRUST STREAM --- */}
            <div className="py-10 bg-white border-b border-slate-100 mb-16">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-xs text-slate-400 font-bold tracking-widest uppercase mb-6">Representamos en Chile</p>
                    <InfiniteLogoScroll
                        items={partnerLogos}
                        direction="left"
                        speed="slow"
                    />
                </div>
            </div>

            {/* --- SERVICES: THE FULL SPECTRUM (Bento Grid) --- */}
            <section id="servicios" className="py-24 px-6 md:px-24 bg-slate-50 border-t border-slate-200">
                <div className="max-w-7xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#0f172a] mb-6">
                        Infraestructura de Servicios
                    </h2>
                    <div className="h-1 w-24 bg-blue-600"></div>
                </div>

                <BentoGrid className="max-w-7xl mx-auto">
                    {/* Asesorías */}
                    <BentoGridItem
                        title="Asesorías Técnicas"
                        description="Consultoría experta para la implementación de laboratorios analíticos y optimización de métodos."
                        header={<div className="h-48 w-full bg-[#0f172a] p-8 flex flex-col justify-end group overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-50"><Settings className="w-12 h-12 text-white" /></div>
                            <div className="relative z-10 text-white font-bold uppercase text-sm tracking-widest">Consultoría Senior</div>
                        </div>}
                        className="md:col-span-1"
                    />

                    {/* Ventas & Distribución */}
                    <BentoGridItem
                        title="Ventas & Distribución"
                        description="Representación oficial de DataApex, Kromasil y equipamiento multimarca para HPLC y GC."
                        header={<div className="h-48 w-full bg-white border border-slate-200 relative overflow-hidden">
                            <div className="absolute inset-0 bg-blue-50/50"></div>
                            <Image src="/prospectos/biocrom/optics.png" alt="Óptica de Precisión" fill className="object-cover opacity-90 group-hover:scale-105 transition-transform" />
                        </div>}
                        className="md:col-span-2"
                    />

                    {/* Software */}
                    <BentoGridItem
                        title="Software DataApex"
                        description="Licenciamiento, upgrade y soporte para Clarity Chromatography Software."
                        header={<div className="h-48 w-full bg-white border border-slate-200 relative overflow-hidden">
                            <Image src="/prospectos/biocrom/software.png" alt="Clarity Software Interface" fill className="object-cover opacity-90 group-hover:scale-105 transition-transform" />
                        </div>}
                        className="md:col-span-2"
                    />

                    {/* Capacitación */}
                    <BentoGridItem
                        title="Capacitación"
                        description="Entrenamiento certificado para analistas en operación de software y hardware."
                        header={<div className="h-48 w-full bg-blue-600 p-8 flex items-center justify-center">
                            <GraduationCap className="w-16 h-16 text-white" />
                        </div>}
                        className="md:col-span-1"
                    />
                </BentoGrid>
            </section>

            {/* --- DIFERENCIACIÓN: MARCAS & AUTORIDAD (Visible AEO) --- */}
            <section id="nosotros" className="py-24 px-6 md:px-24 bg-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">

                    {/* AEO Friendly FAQ - Visible */}
                    <div>
                        <span className="text-blue-600 font-bold text-[10px] uppercase tracking-widest mb-4 block">Base de Conocimiento Técnica</span>
                        <h2 className="text-4xl font-black uppercase tracking-tighter text-[#0f172a] mb-12">
                            Validación &<br />Cumplimiento.
                        </h2>

                        <div className="space-y-6">
                            {/* Replaced static list with Interactive Accordion */}
                            <Accordion items={faqs} />
                        </div>
                    </div>

                    {/* Authority Grid */}
                    <div className="bg-[#0f172a] p-12 text-white rounded-2xl relative overflow-hidden">
                        {/* Decorative Number */}
                        <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-9xl leading-none">10</div>

                        <div className="relative z-10 space-y-12">
                            <div>
                                <div className="flex items-center gap-4 mb-4 text-blue-400">
                                    <ShieldCheck className="w-8 h-8" />
                                    <span className="font-bold uppercase tracking-widest text-xs">Verificado</span>
                                </div>
                                <h3 className="text-3xl font-black uppercase tracking-tight mb-2">Mercado Público</h3>
                                <p className="text-slate-400 text-sm">Proveedor del Estado habilitado. Cumplimiento total de normativa de compras públicas.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-8 border-t border-slate-700 pt-8">
                                <div>
                                    <div className="text-4xl font-black mb-1"><AnimatedCounter from={0} to={10} duration={2} />+</div>
                                    <div className="text-[10px] uppercase tracking-widest text-slate-500">Años de Trayectoria</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-black mb-1"><AnimatedCounter from={0} to={150} duration={2} />+</div>
                                    <div className="text-[10px] uppercase tracking-widest text-slate-500">Clientes Atendidos</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER: COMPACT STANDARD --- */}
            <footer id="contacto" className="py-8 bg-slate-50 border-t border-slate-200 px-6 md:px-24">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="relative w-48 h-12 drop-shadow-md">
                        <Image
                            src="/prospectos/biocrom/logo-v2.png"
                            alt="Biocrom Logo Footer"
                            fill
                            className="object-contain object-left"
                        />
                    </div>

                    <div className="flex gap-6 text-[10px] uppercase font-bold text-slate-500">
                        <a href="#" className="hover:text-blue-600">Aviso Legal</a>
                        <a href="#" className="hover:text-blue-600">Privacidad</a>
                        <a href="#" className="hover:text-blue-600">Mapa del Sitio</a>
                    </div>

                    <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">© 2026 Biocrom EIRL</p>
                        <a href="https://hojacero.cl" target="_blank" className="text-[10px] uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors flex items-center justify-end gap-1 font-bold">
                            Creado por HojaCero.cl
                        </a>
                    </div>
                </div>
            </footer>
        </main >
    );
};

export default BiocromLanding;
