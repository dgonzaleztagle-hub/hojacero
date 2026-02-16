"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
    Home,
    Building2,
    MapPin,
    Phone,
    Mail,
    ChevronRight,
    Menu,
    X,
    Search,
    Bed,
    Bath,
    Square,
    TrendingUp,
    Shield,
    Clock,
    Award,
    ChevronDown
} from "lucide-react";

// Componente de contador animado
const AnimatedCounter = ({ end, suffix = "" }: { end: number; suffix?: string }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;

        let start = 0;
        const duration = 2000;
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [isInView, end]);

    return <span ref={ref}>{count}{suffix}</span>;
};

// Componente de propiedad para el mapa
interface Property {
    id: number;
    title: string;
    price: string;
    location: string;
    description: string;
    beds: number;
    baths: number;
    area: number;
    image: string;
    lat: number;
    lng: number;
}

const PropertyCard = ({ property, onOpen }: { property: Property; onOpen: (property: Property) => void }) => (
    <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 group cursor-pointer"
        onClick={() => onOpen(property)}
    >
        <div className="relative h-64 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
            <div className="absolute top-4 right-4 z-20 bg-[#1A2B3C] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                {property.price}
            </div>
            <img
                src={property.image}
                alt={property.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
        </div>
        <div className="p-6">
            <h3 className="text-xl font-bold text-[#1A2B3C] mb-2 group-hover:text-[#D4AF37] transition-colors">
                {property.title}
            </h3>
            <div className="flex items-center gap-2 text-gray-500 mb-4">
                <MapPin size={16} />
                <span className="text-sm">{property.location}</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <Bed size={18} className="text-[#1A2B3C]" />
                    <span>{property.beds}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Bath size={18} className="text-[#1A2B3C]" />
                    <span>{property.baths}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Square size={18} className="text-[#1A2B3C]" />
                    <span>{property.area}m²</span>
                </div>
            </div>
        </div>
    </motion.div>
);

export default function SubiabreLanding() {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
    const [appointmentSource, setAppointmentSource] = useState("general");
    const [appointmentSent, setAppointmentSent] = useState(false);
    const [appointmentForm, setAppointmentForm] = useState({
        name: "",
        phone: "",
        message: "",
    });
    const navRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const menuItems = [
        { label: "Inicio", href: "#" },
        { label: "Propiedades", href: "#propiedades-heading" },
        { label: "Servicios", href: "#servicios" },
        { label: "Nosotros", href: "#nosotros" },
        { label: "Contacto", href: "#contacto" },
    ];

    // Propiedades de ejemplo
    const properties: Property[] = [
        {
            id: 1,
            title: "Casa Moderna con Vista al Mar",
            price: "UF 8.500",
            location: "Pelluco, Puerto Montt",
            description: "Casa de diseño contemporáneo, gran terraza y orientación norponiente. Ideal para quienes priorizan luz natural y conectividad.",
            beds: 4,
            baths: 3,
            area: 280,
            image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80",
            lat: -41.47,
            lng: -72.94
        },
        {
            id: 2,
            title: "Departamento Vista Panorámica",
            price: "UF 5.200",
            location: "Centro, Puerto Montt",
            description: "Departamento con ventanales de muro a muro, excelente conectividad urbana y terminaciones premium listas para habitar.",
            beds: 3,
            baths: 2,
            area: 120,
            image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=80",
            lat: -41.46,
            lng: -72.93
        },
        {
            id: 3,
            title: "Casa Estilo Patagónico",
            price: "UF 12.000",
            location: "Alerce, Puerto Montt",
            description: "Volumetría robusta, materiales nobles y espacios amplios para vida familiar. Enfocada en confort térmico y privacidad.",
            beds: 5,
            baths: 4,
            area: 350,
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
            lat: -41.48,
            lng: -72.95
        },
        {
            id: 4,
            title: "Penthouse Vista al Volcán",
            price: "UF 15.500",
            location: "Costanera, Puerto Montt",
            description: "Penthouse de alto estándar con vistas abiertas y distribución social amplia para recibir invitados con estilo.",
            beds: 4,
            baths: 3,
            area: 220,
            image: "https://loremflickr.com/1600/1000/modern-house?lock=101",
            lat: -41.45,
            lng: -72.92
        }
    ];

    const scrollToSection = (target: string) => {
        const id = target === "#" ? "top" : target.replace("#", "");
        const navHeight = navRef.current?.offsetHeight || 96;
        const navOffset = navHeight + 16;
        const sectionAdjust: Record<string, number> = {
            servicios: 120,
        };
        const extraOffset = sectionAdjust[id] || 0;
        const top = id === "top"
            ? 0
            : (document.getElementById(id)?.getBoundingClientRect().top || 0) + window.scrollY - navOffset + extraOffset;
        window.scrollTo({ top, behavior: "smooth" });
    };

    const openAppointment = (source: string) => {
        setAppointmentSource(source);
        setAppointmentSent(false);
        setIsAppointmentOpen(true);
    };

    const submitAppointment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAppointmentSent(true);
    };

    return (
        <div id="top" className="bg-white min-h-screen selection:bg-[#D4AF37] selection:text-white overflow-x-hidden">
            {/* NAVBAR */}
            <nav ref={navRef} className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? "bg-white/95 backdrop-blur-xl py-4 shadow-lg" : "bg-[#1A2B3C]/80 backdrop-blur-md py-6 shadow-lg"}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex flex-col">
                            <div
                                className={`text-2xl md:text-3xl font-black tracking-tighter leading-none ${scrolled
                                    ? "text-[#1A2B3C]"
                                    : "text-white"
                                    }`}
                                style={{
                                    textShadow: scrolled
                                        ? '2px 2px 4px rgba(26,43,60,0.2)'
                                        : '0 2px 8px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.3)'
                                }}
                            >
                                SUBIABRE
                            </div>
                            <div className={`text-[9px] md:text-[10px] font-bold ${scrolled ? "text-[#1A2B3C]/60" : "text-white/80"} tracking-[0.3em] uppercase`}>
                                Propiedades
                            </div>
                        </div>
                    </motion.div>

                    <div className="hidden lg:flex items-center gap-8 text-sm font-semibold">
                        {menuItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection(item.href);
                                }}
                                className={`transition-all hover:text-[#D4AF37] relative group ${scrolled ? "text-[#1A2B3C]" : "text-white drop-shadow-lg"}`}
                            >
                                {item.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#D4AF37] transition-all group-hover:w-full" />
                            </a>
                        ))}
                        <button
                            onClick={() => openAppointment("navbar-desktop")}
                            className={`px-6 py-3 rounded-full font-bold transition-all hover:scale-105 shadow-lg ${scrolled ? "bg-[#1A2B3C] text-white" : "bg-white text-[#1A2B3C]"}`}
                        >
                            Agendar Visita
                        </button>
                    </div>

                    <button className={`${scrolled ? "text-[#1A2B3C]" : "text-white drop-shadow-lg"} lg:hidden`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </nav>

            {/* MOBILE MENU */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="fixed inset-0 z-40 bg-[#1A2B3C] flex flex-col items-center justify-center gap-8 lg:hidden"
                    >
                        {menuItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="text-2xl font-bold text-white hover:text-[#D4AF37]"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsMenuOpen(false);
                                    scrollToSection(item.href);
                                }}
                            >
                                {item.label}
                            </a>
                        ))}
                        <button
                            onClick={() => {
                                setIsMenuOpen(false);
                                openAppointment("navbar-mobile");
                            }}
                            className="bg-[#D4AF37] text-white px-10 py-4 rounded-full font-bold text-lg"
                        >
                            Agendar Visita
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HERO SECTION - AWWWARDS LEVEL */}
            <section className="relative h-[100svh] flex items-start overflow-hidden pt-24 md:pt-28 pb-8 md:pb-10">
                {/* VIDEO BACKGROUND CON PARALLAX */}
                <motion.div
                    className="absolute inset-0 z-0"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                >
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src="/hero_subiabre.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1A2B3C]/95 via-[#1A2B3C]/70 to-[#1A2B3C]/40" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.15),transparent_50%)]" />
                </motion.div>

                {/* PARTÍCULAS ARQUITECTÓNICAS SUTILES */}
                <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
                    {[
                        { x: 120, y: 80, delay: 0 },
                        { x: 450, y: 200, delay: 0.5 },
                        { x: 800, y: 150, delay: 1 },
                        { x: 1200, y: 300, delay: 1.5 },
                        { x: 300, y: 500, delay: 2 },
                        { x: 900, y: 400, delay: 2.5 },
                        { x: 600, y: 100, delay: 3 },
                        { x: 1400, y: 250, delay: 3.5 }
                    ].map((particle, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-white/10 rounded-full blur-sm"
                            initial={{
                                x: particle.x,
                                y: particle.y,
                            }}
                            animate={{
                                y: [particle.y, particle.y - 200],
                                opacity: [0, 0.3, 0],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                delay: particle.delay,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>


                <div className="relative z-10 max-w-7xl mx-auto px-6 h-full w-full flex items-start">
                <motion.div
                    className="w-full h-full flex flex-col justify-between"
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                <div className="max-w-5xl">
                {/* TAG ANIMADO */}
                <motion.div
                    className="flex items-center gap-4 text-[#D4AF37] font-bold tracking-[0.3em] text-[10px] mb-6 uppercase"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <motion.div
                        className="h-[2px] bg-gradient-to-r from-[#D4AF37] to-transparent"
                        initial={{ width: 0 }}
                        animate={{ width: 60 }}
                        transition={{ delay: 0.5, duration: 1 }}
                    />
                    Propiedades Premium · Puerto Montt
                </motion.div>

                {/* TÍTULO CON EFECTO REVEAL */}
                <div className="overflow-hidden mb-8">
                    <motion.h1
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[8rem] font-black text-white leading-[0.84] tracking-tighter"
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    >
                        TU HOGAR<br />
                        <span className="relative inline-block">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#D4AF37]">
                                PERFECTO
                            </span>
                            <motion.span
                                className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-[#D4AF37] via-[#C49B2E] to-transparent"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ delay: 1.2, duration: 1.2, ease: "easeOut" }}
                            />
                        </span>
                        <br />
                        TE ESPERA.
                    </motion.h1>
                </div>

                <motion.p
                    className="text-base md:text-lg text-gray-200 mb-6 max-w-2xl font-light leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                >
                    Encuentra la propiedad de tus sueños con el respaldo de{" "}
                    <span className="text-white font-bold relative">
                        15 años de experiencia
                        <motion.span
                            className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37]"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 1.5, duration: 0.8 }}
                            style={{ transformOrigin: "left" }}
                        />
                    </span>{" "}
                    en el mercado inmobiliario.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row gap-3 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                >
                    <motion.button
                        onClick={() => scrollToSection("#propiedades-heading")}
                        className="relative bg-[#D4AF37] text-white px-10 py-4 rounded-full text-base md:text-lg font-bold overflow-hidden group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="relative z-10 flex items-center gap-3 justify-center">
                            Ver Propiedades
                            <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                        </span>
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-[#C49B2E] to-[#D4AF37]"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.button>
                    <motion.button
                        onClick={() => openAppointment("hero")}
                        className="relative border-2 border-white/30 text-white px-10 py-4 rounded-full text-base md:text-lg font-bold backdrop-blur-xl bg-white/5 overflow-hidden group"
                        whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.5)" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="relative z-10">Agendar Asesoría</span>
                        <motion.div
                            className="absolute inset-0 bg-white/10"
                            initial={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.button>
                </motion.div>
                </div>

                {/* MÉTRICAS CON GLASSMORPHISM EXTREMO */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl pb-2"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 1 }}
                >
                    {[
                        { end: 500, suffix: "+", label: "Propiedades Vendidas" },
                        { end: 15, suffix: "+", label: "Años de Experiencia" },
                        { end: 24, suffix: "h", label: "Tiempo de Respuesta" },
                        { end: 98, suffix: "%", label: "Satisfacción Cliente" }
                    ].map((metric, i) => (
                        <motion.div
                            key={i}
                            className="relative group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.4 + i * 0.1, duration: 0.6 }}
                            whileHover={{ y: -5 }}
                        >
                            {/* GLASSMORPHISM CARD */}
                            <div className="relative p-3 md:p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
                                {/* GLOW EFFECT */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* ANIMATED BORDER */}
                                <motion.div
                                    className="absolute inset-0 rounded-2xl"
                                    style={{
                                        background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
                                    }}
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 3,
                                        delay: i * 0.5,
                                        ease: "linear"
                                    }}
                                />

                                <div className="relative z-10">
                                    <div className="text-3xl md:text-4xl font-black font-mono text-white mb-1 tracking-tighter">
                                        <AnimatedCounter end={metric.end} suffix={metric.suffix} />
                                    </div>
                                    <div className="text-[10px] uppercase font-bold text-white tracking-[0.2em] leading-tight">
                                        {metric.label}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </div>

                {/* SCROLL INDICATOR MEJORADO */ }
    <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
    >
        <span className="text-white/60 text-xs uppercase tracking-widest font-bold">Scroll</span>
        <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
            <ChevronDown className="text-white/80 w-6 h-6" />
        </motion.div>
    </motion.div>
            </section >

        {/* MAPA INTERACTIVO 3D */ }
        < section id = "propiedades" className = "py-32 bg-gray-50 relative overflow-hidden" >
            <div className="max-w-7xl mx-auto px-6">
                <div id="propiedades-heading" className="text-center mb-16">
                    <h2 className="text-xs font-bold text-[#D4AF37] tracking-widest uppercase mb-4">
                        Explora Nuestro Portafolio
                    </h2>
                    <h3 className="text-5xl md:text-7xl font-black text-[#1A2B3C] tracking-tighter mb-6">
                        PROPIEDADES<br />
                        <span className="text-gray-300">DESTACADAS.</span>
                    </h3>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Selección exclusiva de las mejores propiedades en las zonas más cotizadas de Puerto Montt y alrededores.
                    </p>
                </div>

                {/* MAPA INTERACTIVO 3D CON MAPBOX */}
                <div className="mb-16 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 h-[500px] relative">
                    <iframe
                        src="https://www.openstreetmap.org/export/embed.html?bbox=-73.05%2C-41.58%2C-72.80%2C-41.35&layer=mapnik&marker=-41.4693%2C-72.9424"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="Mapa de Propiedades"
                        loading="lazy"
                    />
                    <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                            <MapPin className="text-[#D4AF37] w-5 h-5" />
                            <div>
                                <div className="text-sm font-bold text-[#1A2B3C]">Puerto Montt, Chile</div>
                                <div className="text-xs text-gray-500">4 propiedades disponibles</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* GRID DE PROPIEDADES */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {properties.map((property) => (
                        <PropertyCard key={property.id} property={property} onOpen={setSelectedProperty} />
                    ))}
                </div>

                <div className="text-center mt-12">
                    <button
                        onClick={() => openAppointment("properties-grid")}
                        className="bg-[#1A2B3C] text-white px-10 py-4 rounded-full font-bold hover:bg-[#D4AF37] transition-all"
                    >
                        Ver Todas las Propiedades
                    </button>
                </div>
            </div>
            </section >

        {/* SERVICIOS */ }
        < section id = "servicios" className = "py-32 bg-white" >
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-xs font-bold text-[#D4AF37] tracking-widest uppercase mb-6">
                            Nuestros Servicios
                        </h2>
                        <h3 className="text-5xl md:text-7xl font-black text-[#1A2B3C] tracking-tighter mb-8 leading-tight">
                            ASESORÍA<br />
                            INTEGRAL.
                        </h3>
                        <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                            Te acompañamos en cada paso del proceso, desde la búsqueda hasta la firma final.
                        </p>

                        <div className="space-y-8">
                            {[
                                { icon: Search, title: "Búsqueda Personalizada", desc: "Encontramos la propiedad perfecta según tus necesidades y presupuesto." },
                                { icon: TrendingUp, title: "Análisis de Mercado", desc: "Estudios detallados de valorización y proyección de inversión." },
                                { icon: Shield, title: "Asesoría Legal", desc: "Respaldo jurídico completo en todo el proceso de compra o venta." },
                                { icon: Clock, title: "Gestión Rápida", desc: "Procesos ágiles con respuesta en menos de 24 horas." }
                            ].map((service) => (
                                <div key={service.title} className="flex gap-6 group">
                                    <div className="flex-shrink-0">
                                        <div className="w-14 h-14 bg-[#1A2B3C] rounded-2xl flex items-center justify-center group-hover:bg-[#D4AF37] transition-all">
                                            <service.icon className="text-white w-6 h-6" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xl text-[#1A2B3C] mb-2">{service.title}</h4>
                                        <p className="text-gray-600">{service.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-[3rem] blur-[80px] -rotate-6" />
                        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
                            <div className="aspect-[4/5] relative bg-gradient-to-br from-gray-800 to-gray-600">
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="absolute inset-0 w-full h-full object-cover"
                                >
                                    <source src="/hero_subiabre.mp4" type="video/mp4" />
                                </video>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1A2B3C]/60 to-transparent" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </section >

        {/* NOSOTROS */ }
        < section id = "nosotros" className = "py-32 bg-[#1A2B3C] text-white" >
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    {[
                        { icon: Award, title: "EXPERIENCIA COMPROBADA", desc: "15 años liderando el mercado inmobiliario con resultados excepcionales." },
                        { icon: Shield, title: "CONFIANZA GARANTIZADA", desc: "Transparencia total en cada transacción, respaldada por cientos de clientes satisfechos." },
                        { icon: TrendingUp, title: "INVERSIÓN INTELIGENTE", desc: "Asesoría estratégica para maximizar el valor de tu inversión inmobiliaria." }
                    ].map((item) => (
                        <div key={item.title} className="text-center">
                            <item.icon className="text-[#D4AF37] w-12 h-12 mx-auto mb-6" />
                            <h4 className="text-2xl font-black tracking-tight mb-4">{item.title}</h4>
                            <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
            </section >

        {/* CONTACTO */ }
        < section id = "contacto" className = "py-32 bg-gradient-to-br from-[#D4AF37] to-[#C49B2E] text-white" >
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-tight">
                    ENCUENTRA<br />TU HOGAR HOY.
                </h2>
                <p className="text-xl mb-12 text-white/90">
                    Agenda una asesoría gratuita y descubre las mejores oportunidades del mercado.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="tel:+56912345678" className="bg-white text-[#1A2B3C] px-10 py-5 rounded-full font-bold text-lg flex items-center gap-3 justify-center hover:scale-105 transition-all shadow-xl">
                        <Phone size={20} /> +56 9 1234 5678
                    </a>
                    <a href="mailto:contacto@subiabre.cl" className="border-2 border-white text-white px-10 py-5 rounded-full font-bold text-lg flex items-center gap-3 justify-center hover:bg-white/10 transition-all">
                        <Mail size={20} /> contacto@subiabre.cl
                    </a>
                </div>
            </div>
            </section >

        {/* FOOTER */ }
        < footer className = "py-16 bg-[#0F1419] border-t border-white/10" >
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col">
                    <div className="text-2xl font-black text-white tracking-tighter leading-none">SUBIABRE</div>
                    <div className="text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase">Propiedades</div>
                </div>
                <div className="flex gap-8 text-xs font-bold uppercase tracking-wider text-white/50">
                    <a href="#servicios" onClick={(e) => { e.preventDefault(); scrollToSection("#servicios"); }} className="hover:text-[#D4AF37] transition-colors">Privacidad</a>
                    <a href="#nosotros" onClick={(e) => { e.preventDefault(); scrollToSection("#nosotros"); }} className="hover:text-[#D4AF37] transition-colors">Términos</a>
                    <a href="#contacto" onClick={(e) => { e.preventDefault(); scrollToSection("#contacto"); }} className="hover:text-[#D4AF37] transition-colors">Legal</a>
                </div>
                <p className="text-xs uppercase tracking-widest text-white/30">
                    SUBIABRE 2026 · <span className="text-[#D4AF37]/60">HOJACERO</span>
                </p>
            </div>
            </footer >

        <AnimatePresence>
            {selectedProperty && (
                <motion.div
                    className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedProperty(null)}
                >
                    <motion.div
                        className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl"
                        initial={{ y: 40, opacity: 0, scale: 0.96 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 20, opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.25 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative h-72 md:h-96">
                            <img src={selectedProperty.image} alt={selectedProperty.title} className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <button
                                onClick={() => setSelectedProperty(null)}
                                className="absolute top-4 right-4 bg-white/90 text-[#1A2B3C] rounded-full p-2 hover:bg-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#D4AF37] mb-2">Ficha Demo</p>
                                <h4 className="text-3xl font-black tracking-tight">{selectedProperty.title}</h4>
                                <p className="text-sm md:text-base text-gray-200 mt-2">{selectedProperty.location}</p>
                            </div>
                        </div>
                        <div className="p-6 md:p-8">
                            <div className="flex flex-wrap items-center gap-4 mb-4 text-[#1A2B3C]">
                                <span className="bg-[#1A2B3C] text-white px-4 py-2 rounded-full font-bold">{selectedProperty.price}</span>
                                <span className="inline-flex items-center gap-2"><Bed size={16} /> {selectedProperty.beds} dormitorios</span>
                                <span className="inline-flex items-center gap-2"><Bath size={16} /> {selectedProperty.baths} baños</span>
                                <span className="inline-flex items-center gap-2"><Square size={16} /> {selectedProperty.area} m²</span>
                            </div>
                            <p className="text-gray-600 leading-relaxed">{selectedProperty.description}</p>
                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => {
                                        setSelectedProperty(null);
                                        openAppointment(`property-${selectedProperty.id}`);
                                    }}
                                    className="bg-[#D4AF37] text-white px-6 py-3 rounded-full font-bold hover:brightness-95 transition-all"
                                >
                                    Agendar Visita a Esta Propiedad
                                </button>
                                <button
                                    onClick={() => setSelectedProperty(null)}
                                    className="border border-gray-300 text-[#1A2B3C] px-6 py-3 rounded-full font-bold hover:bg-gray-50 transition-all"
                                >
                                    Seguir Explorando
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        <AnimatePresence>
            {isAppointmentOpen && (
                <motion.div
                    className="fixed inset-0 z-[75] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsAppointmentOpen(false)}
                >
                    <motion.div
                        className="bg-white w-full max-w-xl rounded-3xl p-6 md:p-8 shadow-2xl"
                        initial={{ y: 30, opacity: 0, scale: 0.97 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 20, opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.25 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#D4AF37]">Agenda Demo</p>
                                <h4 className="text-3xl font-black text-[#1A2B3C] tracking-tight">Agendar Visita</h4>
                                <p className="text-sm text-gray-500 mt-1">Solicitud simulada · origen: {appointmentSource}</p>
                            </div>
                            <button onClick={() => setIsAppointmentOpen(false)} className="text-gray-500 hover:text-[#1A2B3C]">
                                <X size={20} />
                            </button>
                        </div>

                        {appointmentSent ? (
                            <div className="rounded-2xl bg-[#1A2B3C] text-white p-6">
                                <p className="text-sm uppercase tracking-[0.2em] text-[#D4AF37] font-bold mb-2">Solicitud recibida</p>
                                <p className="text-lg font-semibold">Demo enviada. Te contactaremos dentro de 24h hábiles.</p>
                                <button
                                    className="mt-4 bg-[#D4AF37] text-white px-5 py-2 rounded-full font-bold"
                                    onClick={() => setIsAppointmentOpen(false)}
                                >
                                    Cerrar
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={submitAppointment} className="space-y-4">
                                <input
                                    value={appointmentForm.name}
                                    onChange={(e) => setAppointmentForm((prev) => ({ ...prev, name: e.target.value }))}
                                    placeholder="Nombre completo"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3"
                                    required
                                />
                                <input
                                    value={appointmentForm.phone}
                                    onChange={(e) => setAppointmentForm((prev) => ({ ...prev, phone: e.target.value }))}
                                    placeholder="WhatsApp"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3"
                                    required
                                />
                                <textarea
                                    value={appointmentForm.message}
                                    onChange={(e) => setAppointmentForm((prev) => ({ ...prev, message: e.target.value }))}
                                    placeholder="¿Qué tipo de propiedad buscas?"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 min-h-24"
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-[#D4AF37] text-white py-3 rounded-full font-bold hover:brightness-95 transition-all"
                                >
                                    Enviar Solicitud
                                </button>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
                
                body {
                    font-family: 'Inter', sans-serif;
                    -webkit-font-smoothing: antialiased;
                }
                
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                ::-webkit-scrollbar-thumb {
                    background: #1A2B3C;
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #D4AF37;
                }
            `}</style>
        </div >
    );
}
