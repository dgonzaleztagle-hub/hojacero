"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Beaker,
    Settings,
    ShieldCheck,
    Microscope,
    Activity,
    Phone,
    Mail,
    MapPin,
    ChevronRight,
    Menu,
    X,
    CheckCircle2,
    Cpu,
    LucideIcon,
    History,
    Globe,
    Truck
} from "lucide-react";


// --- COMPONENTES PREMIUM ---

const BentoGrid = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 ${className}`}>
        {children}
    </div>
);

const BentoCard = ({
    title,
    description,
    image,
    icon: Icon,
    className
}: {
    title: string,
    description: string,
    image: string,
    icon: LucideIcon,
    className?: string
}) => (
    <motion.div
        whileHover={{ y: -5 }}
        className={`relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0B1F3A]/80 backdrop-blur-xl group ${className}`}
    >
        <div className="absolute inset-0 z-0">
            <Image
                src={image}
                alt={title}
                fill
                className="object-cover opacity-30 group-hover:opacity-60 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/60 to-transparent" />
        </div>
        <div className="relative z-10 p-6 md:p-10 flex flex-col h-full justify-end min-h-[320px] md:min-h-[400px]">
            <div className="bg-[#C3001D] p-3 md:p-4 rounded-xl md:rounded-2xl w-fit mb-4 md:mb-6 shadow-2xl transform group-hover:rotate-6 transition-transform">
                <Icon className="text-white w-5 h-5 md:w-7 md:h-7" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3 tracking-tighter leading-none">{title}</h3>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-4 md:mb-6 font-sans italic">{description}</p>
            <div className="flex items-center gap-2 text-[#C3001D] font-bold text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all">
                DETALLE TÉCNICO <ChevronRight className="w-4 h-4" />
            </div>
        </div>
    </motion.div>
);

export default function BiocromLanding() {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const menuItems = [
        { label: "Inicio", href: "#" },
        { label: "Áreas", href: "#areas" },
        { label: "Servicios", href: "#servicios" },
        { label: "Multimarca", href: "#multimarca" },
        { label: "Validación", href: "#validacion" },
        { label: "FAQ", href: "#faq" },
        { label: "Contacto", href: "#contacto" },
    ];

    return (
        <div className="bg-[#0B1F3A] min-h-screen selection:bg-[#C3001D] selection:text-white overflow-x-hidden text-white">
            <Head>
                <title>Biocrom | Precisión Analítica Multimarca HPLC/GC</title>
                <meta name="description" content="Soporte técnico y venta de insumos para laboratorios de cromatografía en Chile. Expertos multimarca desde 2014." />
            </Head>

            {/* --- NAVBAR (GLASSMORPHISM STYLE) --- */}
            <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? "bg-white/80 backdrop-blur-md py-4 shadow-2xl border-b border-gray-100" : "bg-transparent py-8"}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Image
                            src="/biocrom_logo_real.png"
                            alt="Biocrom Logo"
                            width={140}
                            height={40}
                            className={`transition-all duration-500 scale-90 md:scale-100 ${!scrolled ? "brightness-0 invert" : ""}`}
                            priority
                        />
                    </motion.div>

                    <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold tracking-[0.2em] uppercase">
                        {menuItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className={`transition-all hover:text-[#C3001D] relative group ${scrolled ? "text-[#0B1F3A]" : "text-white/80 hover:text-white"}`}
                            >
                                {item.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#C3001D] transition-all group-hover:w-full" />
                            </a>
                        ))}
                        <button className={`px-8 py-3 rounded-full font-black transition-all hover:scale-105 active:scale-95 shadow-xl ${scrolled ? "bg-[#C3001D] text-white" : "bg-white text-[#0B1F3A]"}`}>
                            COTIZAR AHORA
                        </button>
                    </div>

                    <button className={`${scrolled ? "text-[#0B1F3A]" : "text-white"} lg:hidden`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </div>
            </nav>

            {/* --- MOBILE MENU --- */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}
                        className="fixed inset-0 z-40 bg-[#0B1F3A] flex flex-col items-center justify-center gap-8 lg:hidden p-6"
                    >
                        {menuItems.map((item) => (
                            <a key={item.label} href={item.href} className="text-3xl font-bold text-white hover:text-[#C3001D]" onClick={() => setIsMenuOpen(false)}>{item.label}</a>
                        ))}
                        <button className="bg-[#C3001D] text-white px-12 py-5 rounded-full font-black text-xl">CONTACTAR</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-[660px] md:h-screen flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                    >
                        <source src="/biocrom_hero_video.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/20 to-transparent" />
                    <div className="absolute inset-0 bg-[#0B1F3A]/40" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-32 md:pt-40">
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                        <div className="flex items-center gap-4 text-[#C3001D] font-bold tracking-[0.5em] text-[10px] mb-6 md:mb-8 uppercase">
                            <div className="w-16 h-[1px] bg-[#C3001D]" />
                            ESTÁNDARES DE PRECISIÓN · CHILE 2014
                        </div>
                        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-bold text-white mb-6 md:mb-10 leading-[0.95] md:leading-[0.9] tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                            EL <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#C3001D] animate-pulse">LATIDO</span> <br className="hidden md:block" />
                            DE LA PRECISIÓN.
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-8 md:mb-12 max-w-2xl font-sans font-light leading-relaxed">
                            Soporte técnico <span className="text-white font-bold italic">multimarca</span> especializado en HPLC, GC, UHPLC y SFC. Elevamos la confiabilidad analítica de su laboratorio a estándares mundiales.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 mb-20">
                            <button className="bg-[#C3001D] text-white px-12 py-6 rounded-full text-lg font-black hover:scale-105 transition-all shadow-[0_0_50px_rgba(195,0,29,0.5)] group flex items-center gap-3">
                                INICIAR DIAGNÓSTICO <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                            </button>
                            <button className="border border-white/20 text-white px-12 py-6 rounded-full text-lg font-bold hover:bg-white/10 transition-all backdrop-blur-xl">
                                ÁREAS DE SERVICIO
                            </button>
                        </div>

                        {/* MÉTRICAS INTEGRADAS AL HERO */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-8 md:pt-12 border-t border-white/10 max-w-4xl">
                            <div className="flex flex-col">
                                <span className="text-4xl md:text-6xl font-black font-mono tracking-tighter">10+</span>
                                <span className="text-[9px] md:text-[10px] uppercase font-bold text-[#C3001D] tracking-[0.3em] mt-2 md:mt-3">Años de Expertis</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-4xl md:text-6xl font-black font-mono tracking-tighter">0%</span>
                                <span className="text-[9px] md:text-[10px] uppercase font-bold text-[#C3001D] tracking-[0.3em] mt-2 md:mt-3">Margen de Error</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- REPRESENTACIONES OFICIALES (RESTORED RHYTHM: WHITE) --- */}
            <section id="multimarca" className="py-16 md:py-24 bg-white relative border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6 text-center mb-12 md:mb-16">
                    <h2 className="text-[10px] font-bold text-[#C3001D] tracking-[0.8em] uppercase mb-6 md:mb-8">Alianzas Estratégicas</h2>
                    <h3 className="text-4xl md:text-7xl font-black text-[#0B1F3A] tracking-tighter leading-[1.1] md:leading-[0.9] italic uppercase">REPRESENTACIÓN<br /><span className="text-gray-300">EXCLUSIVA.</span></h3>
                    <p className="mt-8 md:mt-12 text-gray-500 max-w-3xl mx-auto text-lg md:text-2xl font-sans font-light leading-relaxed">
                        Respaldados por los fabricantes líderes en innovación analítica, garantizando trazabilidad y soporte de fábrica en Chile.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-14 items-center justify-items-center">
                    {[
                        { src: "/biocrom_brand_hta.png", alt: "HTA" },
                        { src: "/biocrom_brand_kromasil.png", alt: "Kromasil" },
                        { src: "/biocrom_brand_quadrex.png", alt: "Quadrex" },
                        { src: "/biocrom_brand_persee.png", alt: "Persee" },
                        { src: "/biocrom_brand_mz.png", alt: "MZ" },
                    ].map((brand, idx) => (
                        <div key={idx} className="group relative w-full h-24 flex items-center justify-center filter grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                            <Image
                                src={brand.src}
                                alt={brand.alt}
                                width={140}
                                height={60}
                                className="object-contain"
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* --- ÁREAS DE NEGOCIO (FULL IMPACT) --- */}
            <section id="areas" className="py-16 md:py-24 bg-[#0B1F3A] relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <Image src="/biocrom_texture.png" alt="Texture" fill className="object-cover" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 md:gap-12 mb-16 md:mb-24 border-l-4 border-[#C3001D] pl-6 md:pl-10">
                        <div className="max-w-3xl">
                            <h2 className="text-5xl md:text-8xl font-bold text-white tracking-tighter leading-none mb-6 md:mb-10 uppercase">DOMINIO<br />TÉCNICO.</h2>
                            <p className="text-gray-400 text-xl md:text-3xl font-sans font-light italic">Ingeniería vertical para la continuidad total de su ciencia.</p>
                        </div>
                        <button className="text-[#C3001D] font-black flex items-center gap-4 group text-lg md:text-2xl hover:text-white transition-colors">
                            VER PORTAFOLIO <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-4 transition-transform text-[#C3001D]" />
                        </button>
                    </div>

                    <BentoGrid className="mt-8 md:mt-12">
                        <BentoCard
                            className="md:col-span-2 border-white/20"
                            title="Cromatografía UHPLC / SFC"
                            description="Especialistas maestros en sistemas de alta presión HPLC/GC, UHPLC y SFC. Calibración y optimización de software."
                            image="/biocrom_bento_gc.png"
                            icon={Beaker}
                        />
                        <BentoCard
                            title="Equipos de Proceso"
                            description="Mantenimiento preventivo de centrífugas, balanzas e incubadoras bajo protocolo ISO."
                            image="/biocrom_bento_lab.png"
                            icon={Settings}
                        />
                        <BentoCard
                            title="Insumos y Repuestos"
                            description="Linner, septas, cambio de lámparas UV y kits de mantenimiento genérico multimarca."
                            image="/biocrom_hero.png" // Using a clearer instrument image for Context
                            icon={Microscope}
                        />
                        <BentoCard
                            title="Capacitación SENCE"
                            description="Cursos de familiarización HPLC teóricos y prácticos con opción de código SENCE."
                            image="/biocrom_hero.png"
                            icon={History}
                        />
                        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-[#0B1F3A]/90 p-8 md:p-10 flex flex-col justify-end min-h-[350px] md:min-h-[400px] group shadow-2xl">
                            {/* TECHNICAL UI OVERLAY FOR SOFTWARE */}
                            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                                <div className="absolute top-4 left-4 font-mono text-[8px] text-[#C3001D]">X: 124.908 / Y: 890.112</div>
                                <div className="absolute bottom-4 right-4 font-mono text-[8px] text-white/30 truncate w-32 tracking-widest uppercase">system_online // v.2.0.6</div>
                                <div className="h-full w-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
                            </div>
                            <div className="relative z-10">
                                <div className="bg-[#C3001D] p-3 md:p-4 rounded-xl md:rounded-2xl w-fit mb-4 md:mb-6 shadow-[0_0_20px_rgba(195,0,29,0.3)] group-hover:rotate-12 transition-all">
                                    <Activity className="text-white w-5 h-5 md:w-7 md:h-7" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-white mb-2 md:mb-3 tracking-tighter italic leading-none">Software de <br /><span className="text-[#C3001D]">Control.</span></h3>
                                <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-4 md:mb-6 font-sans italic">Unificamos la captura de datos de módulos multimarca bajo protocolos modernos.</p>
                            </div>
                        </div>
                    </BentoGrid>
                    <div className="mt-12 flex justify-center">
                        <button className="bg-white text-[#0B1F3A] px-14 py-5 rounded-full font-black hover:bg-[#C3001D] hover:text-white transition-all transform hover:scale-110 shadow-3xl text-sm md:text-base border border-white/10 uppercase tracking-widest">
                            Consultar Compatibilidad de Software
                        </button>
                    </div>
                </div>
            </section>

            {/* --- VALIDACIÓN (RECUPERADA: FUNCIÓN 5) --- */}
            <section id="validacion" className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24 text-center md:text-left">
                        <div className="space-y-6 md:space-y-8">
                            <History className="text-[#C3001D] w-10 md:w-12 h-10 md:h-12 mx-auto md:mx-0" />
                            <h4 className="text-3xl md:text-4xl font-black text-[#0B1F3A] tracking-tighter">10 AÑOS PROBADOS.</h4>
                            <p className="text-gray-500 leading-relaxed font-sans text-lg md:text-xl italic">Líderes en soporte para laboratorios críticos en Chile desde 2014.</p>
                        </div>
                        <div className="space-y-6 md:space-y-8">
                            <Globe className="text-[#C3001D] w-10 md:w-12 h-10 md:h-12 mx-auto md:mx-0" />
                            <h4 className="text-3xl md:text-4xl font-black text-[#0B1F3A] tracking-tighter uppercase">Cobertura Nacional.</h4>
                            <p className="text-gray-500 leading-relaxed font-sans text-lg md:text-xl italic">Ingeniería en terreno de Arica a Punta Arenas con tiempos récord.</p>
                        </div>
                        <div className="space-y-6 md:space-y-8">
                            <Truck className="text-[#C3001D] w-10 md:w-12 h-10 md:h-12 mx-auto md:mx-0" />
                            <h4 className="text-3xl md:text-4xl font-black text-[#0B1F3A] tracking-tighter">STOCK LOCAL.</h4>
                            <p className="text-gray-500 leading-relaxed font-sans text-lg md:text-xl italic">Insumos y repuestos certificados con entrega inmediata 24/48h.</p>
                        </div>
                    </div>

                    <div className="mt-16 md:mt-24 p-10 md:p-20 bg-[#0B1F3A] rounded-[2rem] md:rounded-[4rem] text-white flex flex-col lg:flex-row items-center justify-between gap-12 md:gap-16 shadow-4xl relative overflow-hidden">
                        <div className="relative z-10 max-w-2xl text-center lg:text-left">
                            <h3 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 tracking-tighter italic uppercase">Rigor Analítico <br className="hidden md:block" /><span className="text-[#C3001D]">Certificable.</span></h3>
                            <p className="text-white/50 text-xl md:text-2xl font-sans font-light leading-relaxed">Entregamos Informes de Trazabilidad completos, fundamentales para auditorías bajo normativas ISO y sanitarias.</p>
                        </div>
                        <div className="relative z-10 grid grid-cols-2 gap-10 md:gap-20 lg:border-l border-white/10 lg:pl-20">
                            <div className="text-center">
                                <span className="text-5xl md:text-7xl font-black font-mono tracking-tighter text-[#C3001D]">500+</span>
                                <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.4em] text-white/40 mt-3 md:mt-4 block leading-tight">Services / Año</span>
                            </div>
                            <div className="text-center">
                                <span className="text-5xl md:text-7xl font-black font-mono tracking-tighter text-[#C3001D]">24h</span>
                                <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.4em] text-white/40 mt-3 md:mt-4 block leading-tight">Response Máx</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SERVICIOS/MÉTODO (RECUPERADO) --- */}
            <section id="servicios" className="py-24 bg-white text-[#0B1F3A]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="order-2 lg:order-1">
                            <h2 className="text-[10px] md:text-[12px] font-bold text-[#C3001D] tracking-[0.8em] uppercase mb-6 md:mb-8">Método Analítico</h2>
                            <h3 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 md:mb-12 leading-[1.1] md:leading-[0.8] italic uppercase">EL RIGOR<br />COMO NORMA.</h3>
                            <p className="text-gray-500 text-xl md:text-2xl mb-12 md:mb-16 font-sans font-light leading-relaxed">No sustituimos piezas; restauramos la integridad de su equipo bajo parámetros originales de fábrica.</p>

                            <div className="space-y-10 md:space-y-16">
                                {[
                                    { title: "Diagnóstico Predictivo", desc: "Localización de ruidos en línea base antes de un fallo catastrófico." },
                                    { title: "Planes Anuales H0", desc: "Mantenimiento preventivo prioritario con emergencia 12/24h." },
                                    { title: "Reporte de Cumplimiento", desc: "Validación técnica detallada para auditorías ISO/ISP." }
                                ].map((item) => (
                                    <div key={item.title} className="flex gap-6 md:gap-10 group">
                                        <div className="w-[3px] h-16 md:h-24 bg-gray-100 group-hover:bg-[#C3001D] transition-all duration-500" />
                                        <div>
                                            <h4 className="font-bold text-2xl md:text-4xl tracking-tighter uppercase mb-2 md:mb-4">{item.title}</h4>
                                            <p className="text-gray-400 font-sans italic text-lg md:text-xl">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative order-1 lg:order-2">
                            <div className="absolute inset-0 bg-[#C3001D]/10 rounded-[2rem] md:rounded-[5rem] blur-[60px] md:blur-[100px] -rotate-12" />
                            <div className="relative rounded-[2rem] md:rounded-[5rem] overflow-hidden border border-gray-100 shadow-4xl bg-white group">
                                <Image src="/biocrom_hero.png" alt="Scan" width={800} height={1000} className="object-cover h-[500px] md:h-[900px] transition-transform duration-[4s] group-hover:scale-110" />

                                {/* SCANN LINE EFFECT */}
                                <motion.div
                                    animate={{ top: ["0%", "100%", "0%"] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 w-full h-[2px] bg-[#C3001D] shadow-[0_0_20px_#C3001D] z-20 pointer-events-none opacity-50"
                                />

                                <div className="absolute bottom-6 md:bottom-16 left-6 md:left-16 right-6 md:right-16 bg-[#0B1F3A] p-8 md:p-16 rounded-[2rem] md:rounded-[4rem] text-white shadow-2xl border border-white/5">
                                    <Activity className="text-[#C3001D] w-8 md:w-10 h-8 md:h-10 mb-4 md:mb-6 animate-pulse" />
                                    <h4 className="text-xl md:text-4xl font-black tracking-tighter italic leading-tight uppercase">"La precisión no es una opción, es la base de su resultado."</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FAQ TÉCNICO (RECUPERADO: AEO) --- */}
            <section id="faq" className="py-24 bg-[#0B1F3A] relative">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-12 md:mb-24">
                        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic uppercase">Consultas<br /><span className="text-[#C3001D]">Técnicas.</span></h2>
                    </div>
                    <div className="max-w-4xl mx-auto space-y-4">
                        {[
                            "¿Atienden sistemas de todas las marcas?",
                            "¿Sus informes son válidos para auditorías ISO?",
                            "¿Qué tiempo de respuesta tienen?",
                        ].map((q) => (
                            <button key={q} className="w-full h-20 md:h-24 flex justify-between items-center px-8 md:px-12 bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl hover:bg-white/[0.05] hover:border-[#C3001D]/30 transition-all text-white text-left group">
                                <span className="text-lg md:text-2xl font-bold tracking-tight">{q}</span>
                                <ChevronRight className="text-[#C3001D] group-hover:translate-x-2 transition-transform w-6 h-6 md:w-8 md:h-8" />
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA FINAL (REDESIGN: PREMIUM DARK) --- */}
            <section id="contacto" className="py-24 md:py-48 bg-[#0B1F3A] relative overflow-hidden text-center border-t border-white/5">
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(195,0,29,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(195,0,29,0.1)_1px,transparent_1px)] [background-size:100px_100px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="mb-12 flex justify-center">
                        <div className="w-24 h-[2px] bg-[#C3001D] animate-pulse shadow-[0_0_15px_#C3001D]" />
                    </div>
                    <h2 className="text-5xl md:text-9xl font-black tracking-tighter mb-16 md:mb-24 leading-[0.9] md:leading-[0.8] uppercase text-white">
                        PRECISIÓN<br /><span className="text-[#C3001D] drop-shadow-[0_0_30px_rgba(195,0,29,0.4)]">AL LÍMITE.</span>
                    </h2>
                    <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                        <a href="tel:+56950069920" className="bg-white text-[#0B1F3A] px-12 py-8 rounded-full font-black text-xl md:text-2xl flex items-center gap-6 hover:scale-110 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] group">
                            <Phone size={30} className="group-hover:rotate-12 transition-transform" /> +56 9 50XX XXXX
                        </a>
                        <a href="mailto:ventas@biocrom.cl" className="bg-[#C3001D] text-white px-12 py-8 rounded-full font-black text-xl md:text-2xl flex items-center gap-6 hover:scale-110 transition-all shadow-[0_0_40px_rgba(195,0,29,0.3)]">
                            <Mail size={30} /> ventas@biocrom.cl
                        </a>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="py-16 bg-black border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <Image src="/biocrom_logo_real.png" alt="Logo" width={180} height={50} className="brightness-0 invert opacity-40" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Ingeniería Analítica desde 2014</p>
                    </div>
                    <div className="flex gap-8 md:gap-16 text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
                        <a href="#" className="hover:text-[#C3001D] transition-colors">Normativa ISO</a>
                        <a href="#" className="hover:text-[#C3001D] transition-colors">Trazabilidad</a>
                        <a href="#" className="hover:text-[#C3001D] transition-colors">Soporte</a>
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-white/10">BIOCROM EIRL 2026 · DIGITAL REBIRTH BY HOJACERO</p>
                </div>
            </footer>

            <style jsx global>{`
        @keyframes subtle-ken-burns {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
        
        body { font-family: 'Space Grotesk', sans-serif; background-color: #0B1F3A; color: white; -webkit-font-smoothing: antialiased; }
        h1, h2, h3, h4 { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.06em; }
        p { font-family: 'Inter', sans-serif; }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0B1F3A; }
        ::-webkit-scrollbar-thumb { background: #C3001D; border-radius: 10px; }
      `}</style>
        </div>
    );
}
