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

            {/* --- NAVBAR (ESTÉTICA PROMETEDORA) --- */}
            <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? "bg-white py-4 shadow-2xl border-b border-gray-100" : "bg-transparent py-8"}`}>
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

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                        <div className="flex items-center gap-4 text-[#C3001D] font-bold tracking-[0.5em] text-[10px] mb-8 uppercase">
                            <div className="w-16 h-[1px] bg-[#C3001D]" />
                            ESTÁNDARES DE PRECISIÓN · CHILE 2014
                        </div>
                        <h1 className="text-5xl sm:text-7xl md:text-[10rem] font-bold text-white mb-6 md:mb-10 leading-[0.9] md:leading-[0.85] tracking-tighter">
                            EL <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#C3001D]">LATIDO</span> <br className="hidden md:block" />
                            DE LA PRECISIÓN.
                        </h1>
                        <p className="text-lg md:text-2xl text-gray-300 mb-8 md:mb-12 max-w-2xl font-sans font-light leading-relaxed">
                            Soporte técnico <span className="text-white font-bold italic">multimarca</span> especializado en HPLC y GC. Elevamos la confiabilidad analítica de su laboratorio a estándares mundiales.
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
                                <span className="text-[9px] md:text-[10px] uppercase font-bold text-[#C3001D] tracking-[0.3em] mt-2 md:mt-3">Años de Experiencia</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-4xl md:text-6xl font-black font-mono tracking-tighter">0%</span>
                                <span className="text-[9px] md:text-[10px] uppercase font-bold text-[#C3001D] tracking-[0.3em] mt-2 md:mt-3">Margen de Error</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- REPRESENTACIONES OFICIALES --- */}
            <section id="multimarca" className="py-20 md:py-40 bg-white relative">
                <div className="max-w-7xl mx-auto px-6 text-center mb-16 md:mb-24">
                    <h2 className="text-[10px] font-bold text-[#C3001D] tracking-[0.8em] uppercase mb-6 md:mb-10">Alianzas Estratégicas</h2>
                    <h3 className="text-4xl md:text-8xl font-bold text-[#0B1F3A] tracking-tighter leading-[1.1] md:leading-[0.9] italic">REPRESENTACIÓN<br /><span className="text-gray-300">EXCLUSIVA.</span></h3>
                    <p className="mt-8 md:mt-12 text-gray-600 max-w-3xl mx-auto text-lg md:text-2xl font-sans font-light leading-relaxed">
                        Respaldados por los fabricantes líderes en innovación analítica, garantizando trazabilidad y soporte de fábrica en Chile.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
                    {[
                        { src: "/biocrom_brand_hta.png", alt: "HTA" },
                        { src: "/biocrom_brand_kromasil.png", alt: "Kromasil" },
                        { src: "/biocrom_brand_quadrex.png", alt: "Quadrex" },
                        { src: "/biocrom_brand_persee.png", alt: "Persee" },
                        { src: "/biocrom_brand_mz.png", alt: "MZ Analysentechnik" },
                    ].map((brand) => (
                        <div key={brand.src} className="group relative w-full h-32 flex items-center justify-center p-8 border border-gray-100 rounded-3xl bg-gray-50/50 hover:bg-white hover:shadow-2xl transition-all duration-500">
                            <Image
                                src={brand.src}
                                alt={brand.alt}
                                width={180}
                                height={80}
                                className="object-contain filter grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* --- ÁREAS DE NEGOCIO (FULL IMPACT) --- */}
            <section id="areas" className="py-20 md:py-40 bg-[#0B1F3A] relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <Image src="/biocrom_texture.png" alt="Texture" fill className="object-cover" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 md:gap-12 mb-20 md:mb-32 border-l-4 border-[#C3001D] pl-6 md:pl-10">
                        <div className="max-w-3xl">
                            <h2 className="text-5xl md:text-9xl font-bold text-white tracking-tighter leading-none mb-6 md:mb-10 uppercase">DOMINIO<br />TÉCNICO.</h2>
                            <p className="text-gray-400 text-xl md:text-3xl font-sans font-light italic">Ingeniería vertical para la continuidad total de su ciencia.</p>
                        </div>
                        <button className="text-[#C3001D] font-black flex items-center gap-4 group text-lg md:text-2xl hover:text-white transition-colors">
                            VER PORTAFOLIO <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-4 transition-transform text-[#C3001D]" />
                        </button>
                    </div>

                    <BentoGrid>
                        <BentoCard
                            className="md:col-span-2"
                            title="Cromatografía de Alta Presión"
                            description="Especialistas maestros en sistemas HPLC/GC. Calibración, limpieza de fuentes y optimización de software."
                            image="/biocrom_bento_gc.png"
                            icon={Beaker}
                        />
                        <BentoCard
                            title="Equipos de Proceso"
                            description="Mantenimiento preventivo de centrífugas e incubadoras bajo protocolo ISO."
                            image="/biocrom_bento_lab.png"
                            icon={Settings}
                        />
                        <BentoCard
                            title="Óptica e Imagen"
                            description="Sistemas de microscopía y alineación de fuentes UV-Vis analíticas."
                            image="/biocrom_bento_optics.png"
                            icon={Microscope}
                        />
                        <div className="md:col-span-2 bg-[#122849] rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 text-white flex flex-col justify-center relative shadow-3xl overflow-hidden group border border-white/5">
                            <h3 className="text-3xl md:text-6xl font-black mb-6 md:mb-10 relative z-10 tracking-tighter italic">Software de <br className="hidden md:block" /><span className="text-[#C3001D]">Adquisición.</span></h3>
                            <p className="text-gray-400 mb-8 md:mb-12 max-w-lg relative z-10 font-sans text-lg md:text-xl font-light">Unificamos la captura de datos de sus equipos legacy bajo protocolos de red modernos.</p>
                            <button className="bg-white text-[#0B1F3A] px-10 md:px-14 py-4 md:py-5 rounded-full font-black w-fit hover:bg-[#C3001D] hover:text-white transition-all transform hover:scale-110 relative z-10 text-sm md:text-base">
                                CONSULTAR COMPATIBILIDAD
                            </button>
                        </div>
                    </BentoGrid>
                </div>
            </section>

            {/* --- VALIDACIÓN (RECUPERADA: FUNCIÓN 5) --- */}
            <section id="validacion" className="py-20 md:py-40 bg-gray-50 relative overflow-hidden">
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

                    <div className="mt-20 md:mt-40 p-10 md:p-24 bg-[#0B1F3A] rounded-[2rem] md:rounded-[5rem] text-white flex flex-col lg:flex-row items-center justify-between gap-12 md:gap-16 shadow-4xl relative overflow-hidden">
                        <div className="relative z-10 max-w-2xl text-center lg:text-left">
                            <h3 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 tracking-tighter italic uppercase">Rigor Analítico <br className="hidden md:block" /><span className="text-[#C3001D]">Certificable.</span></h3>
                            <p className="text-white/50 text-xl md:text-2xl font-sans font-light leading-relaxed">Entregamos Informes de Trazabilidad completos, fundamentales para auditorías bajo normativas ISO y sanitarias.</p>
                        </div>
                        <div className="relative z-10 grid grid-cols-2 gap-10 md:gap-20 lg:border-l border-white/10 lg:pl-20">
                            <div className="text-center">
                                <span className="text-5xl md:text-8xl font-black font-mono tracking-tighter text-[#C3001D]">500+</span>
                                <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.4em] text-white/40 mt-3 md:mt-4 block leading-tight">Services / Año</span>
                            </div>
                            <div className="text-center">
                                <span className="text-5xl md:text-8xl font-black font-mono tracking-tighter text-[#C3001D]">24h</span>
                                <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.4em] text-white/40 mt-3 md:mt-4 block leading-tight">Response Máx</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SERVICIOS/MÉTODO (RECUPERADO) --- */}
            <section id="servicios" className="py-48 bg-white text-[#0B1F3A]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 items-center">
                        <div className="order-2 lg:order-1">
                            <h2 className="text-[10px] md:text-[12px] font-bold text-[#C3001D] tracking-[0.8em] uppercase mb-6 md:mb-10">Método Analítico</h2>
                            <h3 className="text-4xl md:text-9xl font-black tracking-tighter mb-8 md:mb-16 leading-[1.1] md:leading-[0.8] italic uppercase">EL RIGOR<br />COMO NORMA.</h3>
                            <p className="text-gray-500 text-xl md:text-3xl mb-12 md:mb-24 font-sans font-light leading-relaxed">No sustituimos piezas; restauramos la integridad de su equipo bajo parámetros originales de fábrica.</p>

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
                            <div className="relative rounded-[2rem] md:rounded-[5rem] overflow-hidden border border-gray-100 shadow-4xl bg-white">
                                <Image src="/biocrom_hero.png" alt="Scan" width={800} height={1000} className="object-cover h-[500px] md:h-[900px] transition-transform duration-[4s] hover:scale-110" />
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
            <section id="faq" className="py-40 bg-[#0B1F3A] relative">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16 md:mb-32">
                        <h2 className="text-5xl md:text-9xl font-black text-white tracking-tighter italic uppercase">Consultas<br /><span className="text-[#C3001D]">Técnicas.</span></h2>
                    </div>
                    <div className="space-y-10">
                        {[
                            { q: "¿Atienden sistemas de todas las marcas?", a: "Absolutamente. Nuestra ingeniería es experta en ecosistemas Agilent, Waters, Shimadzu y otros, operando bajo manual de fábrica." },
                            { q: "¿Sus informes son válidos para auditorías ISO?", a: "Sí. Generamos Informes de Trazabilidad Técnica diseñados específicamente para cumplimiento de ISO 9001/17025." },
                            { q: "¿Qué tiempo de respuesta tienen?", a: "Contamos con una política de 12/24h para emergencias en terreno, asegurando el mínimo downtime analítico." }
                        ].map((item) => (
                            <details key={item.q} className="group border border-white/10 rounded-[2rem] md:rounded-[3rem] bg-white/[0.03] overflow-hidden transition-all hover:bg-white/[0.06] cursor-pointer">
                                <summary className="flex items-center justify-between p-8 md:p-12 list-none font-bold text-xl md:text-3xl tracking-tighter text-white">
                                    {item.q}
                                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-[#C3001D] group-open:rotate-90 transition-transform" />
                                </summary>
                                <div className="px-8 md:px-12 pb-8 md:pb-12 text-gray-400 text-lg md:text-2xl font-sans font-light leading-relaxed italic border-t border-white/5 pt-6 md:pt-8">
                                    {item.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA FINAL --- */}
            <section id="contacto" className="py-20 md:py-60 bg-[#C3001D] relative overflow-hidden text-center">
                <div className="relative z-10 max-w-7xl mx-auto px-6 text-white">
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-12 md:mb-20 leading-[0.9] md:leading-[0.85] uppercase">PRECISIÓN<br />AL LÍMITE.</h2>
                    <div className="flex flex-col md:flex-row gap-6 md:gap-12 justify-center items-center">
                        <a href="tel:+56950069920" className="bg-white text-[#0B1F3A] px-10 md:px-24 py-6 md:py-10 rounded-full font-black text-xl md:text-3xl flex items-center gap-4 md:gap-8 hover:scale-110 transition-all shadow-4xl group">
                            <Phone size={30} className="md:w-[40px] md:h-[40px] group-hover:rotate-12 transition-transform" /> +56 9 5006 9920
                        </a>
                        <a href="mailto:ventas@biocrom.cl" className="bg-transparent border-2 md:border-4 border-white text-white px-10 md:px-24 py-6 md:py-10 rounded-full font-black text-xl md:text-3xl flex items-center gap-4 md:gap-8 hover:bg-white hover:text-[#C3001D] transition-all">
                            <Mail size={30} className="md:w-[40px] md:h-[40px]" /> ventas@biocrom.cl
                        </a>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="py-24 bg-black">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-20">
                    <Image src="/biocrom_logo_real.png" alt="Logo" width={220} height={60} className="brightness-0 invert opacity-40" />
                    <div className="flex gap-16 text-[11px] font-bold uppercase tracking-[0.4em] text-white/30">
                        <a href="#" className="hover:text-[#C3001D] transition-colors">Norma ISO</a>
                        <a href="#" className="hover:text-[#C3001D] transition-colors">Privacidad</a>
                        <a href="#" className="hover:text-[#C3001D] transition-colors">Términos</a>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/10">BIOCROM EIRL 2026 · HOJACERO FACTORY</p>
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
