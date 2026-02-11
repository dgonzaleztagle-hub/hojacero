'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Zap,
    ShieldCheck,
    Truck,
    Settings2,
    ChevronRight,
    Microscope,
    Box,
    Cpu,
    ArrowRight
} from 'lucide-react'

// --- COMPONENTES ATÓMICOS ---

const Logo = () => (
    <div className="flex items-center gap-3 group cursor-pointer">
        <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-cyan-500/20 blur-lg rounded-full group-hover:bg-cyan-500/30 transition-all" />
            <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
                <path
                    d="M50 5 L89 27.5 L89 72.5 L50 95 L11 72.5 L11 27.5 Z"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="4"
                    className="drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                />
                <path
                    d="M45 25 L65 45 L35 55 L55 75"
                    fill="none"
                    stroke="white"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
        <div className="flex flex-col">
            <span className="text-white font-bold tracking-[0.2em] leading-none uppercase text-lg">CAM SOLUTIONS</span>
            <span className="text-cyan-500/60 text-[8px] tracking-[0.3em] uppercase font-medium">Equipos e Insumos CAD/CAM</span>
        </div>
    </div>
)

const Badge = ({ children }: { children: React.ReactNode }) => (
    <span className="px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] uppercase font-bold tracking-widest mb-4 inline-block">
        {children}
    </span>
)

const ProductCard = ({ title, metric, description, icon: Icon, price, image }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-[#1e293b]/40 border border-slate-700/50 rounded-[2rem] backdrop-blur-sm group hover:border-cyan-500/40 transition-all overflow-hidden flex flex-col h-full"
    >
        {image && (
            <div className="h-48 w-full overflow-hidden relative">
                <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] to-transparent opacity-60" />
            </div>
        )}
        <div className="p-8 flex-1 flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-cyan-500 font-bold text-sm mb-4">{metric}</p>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">{description}</p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700/30">
                <span className="text-white font-bold">{price}</span>
                <button className="text-cyan-400 p-2 hover:bg-cyan-500/10 rounded-full transition-colors">
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    </motion.div>
)

// --- PÁGINA PRINCIPAL ---

export default function CAMSolutionsMVP() {
    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans selection:bg-cyan-500 selection:text-white">

            {/* NAVBAR */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-xl px-6 md:px-12 py-5">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Logo />
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
                        <a href="#maquinaria" className="hover:text-cyan-400 transition-colors">Maquinaria</a>
                        <a href="#insumos" className="hover:text-cyan-400 transition-colors">Insumos</a>
                        <a href="#logistica" className="hover:text-cyan-400 transition-colors">Chilexpress</a>
                    </div>
                    <button className="bg-cyan-500 hover:bg-cyan-400 text-[#0f172a] px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/20">
                        Cotizar Ahora
                    </button>
                </div>
            </nav>

            <main>

                {/* HERO - Sección "El Proveedor" + Autoridad */}
                <section className="relative pt-40 pb-24 px-6 md:px-12 overflow-hidden min-h-[90vh] flex items-center bg-[#0f172a]">
                    {/* VIDEO BACKGROUND (Capa base absoluta) */}
                    <div className="absolute inset-0">
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover opacity-70"
                        >
                            <source src="/prospectos/cam-solutions/hero.mp4" type="video/mp4" />
                        </video>
                        {/* Overlay sutil */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/20 to-transparent" />
                        <div className="absolute inset-0 bg-[#0f172a]/30" />
                    </div>

                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Badge>Expertise en Odontología Digital</Badge>
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-[1.1]">
                                Más que un proveedor: <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                                    tu socio tecnológico.
                                </span>
                            </h1>
                            <p className="text-xl text-slate-400 leading-relaxed mb-10 max-w-xl">
                                Impulsamos la transformación digital de laboratorios y clínicas en Chile con el respaldo de
                                <strong className="text-white font-semibold"> 3Mash</strong>. Equipos de precisión quirúrgica y soporte técnico de primer nivel.
                            </p>

                            {/* Trust Indicators */}
                            <div className="flex flex-wrap gap-8 items-center border-t border-white/5 pt-10">
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-2xl">4μm</span>
                                    <span className="text-[10px] uppercase tracking-widest text-slate-500">Precisión Máxima</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-2xl">14min</span>
                                    <span className="text-[10px] uppercase tracking-widest text-slate-500">Impresión Record</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-2xl">+500</span>
                                    <span className="text-[10px] uppercase tracking-widest text-slate-500">Clientes en Turquía</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Visual - Showcase de Tecnología */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="relative"
                        >
                            <div className="aspect-square bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-[3rem] border border-white/10 flex items-center justify-center relative overflow-hidden group p-1">
                                <img
                                    src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000"
                                    alt="3Shape E4 Dental Tech"
                                    className="w-full h-full object-cover rounded-[2.5rem] opacity-90 group-hover:scale-105 transition-transform duration-1000"
                                />
                                {/* Overlay para resaltar el texto */}
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent pt-20" />

                                <div className="absolute bottom-10 left-0 right-0 text-center z-10">
                                    <h3 className="text-white text-3xl font-bold mb-1 tracking-[0.2em]">3SHAPE E4</h3>
                                    <p className="text-cyan-400 text-[10px] uppercase tracking-[0.4em] font-bold">The Gold Standard</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* SECCIÓN PRODUCTOS - Alta Conversión B2B */}
                <section id="maquinaria" className="py-24 px-6 md:px-12 bg-[#0c1222]">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-16">
                            <Badge>Catálogo Especializado</Badge>
                            <h2 className="text-4xl font-bold text-white tracking-tight">
                                La precisión que tu laboratorio <br />
                                necesita para escalar.
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <ProductCard
                                title="3Shape E4 Scanner"
                                metric="9 segundos por arco"
                                description="Productividad clínica sin precedentes con 4 cámaras de 5MP. Exactitud certificada ISO."
                                icon={Microscope}
                                price="Cotizar Demo"
                                image="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800" // Referencia a tecnología dental
                            />
                            <ProductCard
                                title="Fresas Roland Zirconia"
                                metric="Vitta & Amann Girrbach"
                                description="Recubrimiento de diamante para una vida útil extendida. Fresado suave y sin vibraciones."
                                icon={Settings2}
                                price="Desde $24.990"
                                image="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" // Referencia industrial
                            />
                            <ProductCard
                                title="PMMA Multilayer"
                                metric="High Translucency"
                                description="Degradado natural de color para restauraciones temporales de estética superior."
                                icon={Box}
                                price="Desde $12.500"
                                image="https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&q=80&w=800" // Referencia laboratorio
                            />
                        </div>
                    </div>
                </section>

                {/* BANNER LOGISTICA - CHILEXPRESS */}
                <section id="logistica" className="py-20 px-6 md:px-12">
                    <div className="max-w-7xl mx-auto bg-gradient-to-r from-cyan-900/40 to-[#0f172a] rounded-[3rem] border border-cyan-500/20 p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
                        <div className="bg-white p-6 rounded-3xl shadow-2xl shadow-cyan-500/10">
                            <Truck className="w-16 h-16 text-cyan-600" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <Badge>Logística Garantizada</Badge>
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Integrado con Chilexpress</span>
                            </div>
                            <h3 className="text-3xl text-white font-bold mb-4">Insumos siempre a tiempo.</h3>
                            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                                Sabemos que un laboratorio detenido es dinero perdido. Por eso integramos nuestra tienda directamente
                                con Chilexpress para despachos prioritarios en todo Chile. Cálculos de envío en tiempo real.
                            </p>
                        </div>
                        <button className="whitespace-nowrap bg-white text-[#0f172a] px-10 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-cyan-100 transition-colors shadow-xl">
                            Ver Stock Real
                        </button>
                    </div>
                </section>

                {/* FORMULARIO DE CIERRE */}
                <section className="py-24 px-6 md:px-12 text-center relative overflow-hidden">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl text-white font-bold mb-8">¿Listo para el próximo <span className="italic text-cyan-400">salto digital?</span></h2>
                        <p className="text-slate-400 text-xl mb-12">Agenda una asesoría técnica personalizada y resolvamos juntos tus dudas sobre equipamiento.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <input
                                type="email"
                                placeholder="Tu correo corporativo..."
                                className="bg-white/5 border border-white/10 rounded-full px-8 py-5 text-white focus:outline-none focus:border-cyan-500 transition-colors min-w-[300px]"
                            />
                            <button className="bg-cyan-500 text-[#0f172a] px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-500/20">
                                Agendar Llamada
                            </button>
                        </div>
                    </div>
                </section>

            </main>

            <footer className="py-12 border-t border-white/5 text-center">
                <p className="text-slate-600 text-xs uppercase tracking-widest">
                    CAM SOLUTIONS — © 2024. Power by <span className="text-slate-500">HojaCero Factory</span>
                </p>
            </footer>
        </div>
    )
}
