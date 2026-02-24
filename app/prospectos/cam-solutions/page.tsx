'use client'

import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Activity,
    Phone,
    Mail,
    ChevronRight,
    Menu,
    X,
    CheckCircle2,
    Truck,
    ShoppingCart,
} from 'lucide-react'

import { B2BSideCart, B2BProductModal } from '@/components/b2b-store/B2BEngineComponents'
import { useB2BEngine, B2BEngineProvider, B2BProduct } from '@/hooks/b2b-engine/useB2BEngine'

// --- COMPONENTES ATÓMICOS ---
const Logo = ({ scrolled }: { scrolled: boolean }) => (
    <div className="flex items-center gap-3 group cursor-pointer">
        <div className="relative w-10 h-10 flex items-center justify-center">
            <div className={`absolute inset-0 ${scrolled ? 'bg-cyan-500/20' : 'bg-cyan-500/40'} blur-lg rounded-full group-hover:bg-cyan-500/50 transition-all duration-500`} />
            <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
                <path d="M50 5 L89 27.5 L89 72.5 L50 95 L11 72.5 L11 27.5 Z" fill="none" stroke="#06b6d4" strokeWidth="4" className="drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                <path d="M45 25 L65 45 L35 55 L55 75" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
        <div className="flex flex-col">
            <span className={`font-bold tracking-[0.2em] leading-none uppercase text-lg transition-colors duration-500 ${scrolled ? 'text-[#0f172a]' : 'text-white'}`}>CAM SOLUTIONS</span>
            <span className="text-cyan-500/80 text-[8px] tracking-[0.3em] uppercase font-bold">Flujo Digital B2B</span>
        </div>
    </div>
)

const BentoGrid = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 ${className}`}>
        {children}
    </div>
)

interface BentoCardProps {
    title: string;
    description: string;
    image?: string;
    className?: string;
    price: string;
    badge?: string;
    onClick?: () => void;
}

const BentoCard = ({ title, description, image, className, price, badge, onClick }: BentoCardProps) => (
    <motion.div
        whileHover={{ y: -5 }}
        className={`relative overflow-hidden rounded-[2.5rem] border border-cyan-500/10 bg-[#0c1222]/80 backdrop-blur-xl group flex flex-col h-full ${className}`}
    >
        {image && (
            <div className="absolute inset-0 z-0">
                <img src={image} alt={title} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] via-[#0c1222]/80 to-[#0c1222]/20" />
            </div>
        )}
        <div className="relative z-10 p-6 md:p-10 flex flex-col flex-1 justify-end min-h-[320px] md:min-h-[400px]">
            {badge && (
                <span className="px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] uppercase font-bold tracking-widest mb-auto w-fit">
                    {badge}
                </span>
            )}
            <h3 className="text-2xl md:text-4xl font-black text-white mb-2 md:mb-3 tracking-tighter leading-[1.1] mt-6">{title}</h3>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6 font-sans font-light">{description}</p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-cyan-500/20">
                <span className="text-white font-bold">{price}</span>
                <button onClick={onClick} className="flex items-center gap-2 text-[#06b6d4] font-bold text-[10px] uppercase tracking-widest group-hover:bg-cyan-500 group-hover:text-[#0f172a] px-4 py-2 rounded-full transition-all duration-300">
                    Añadir Pedido <ShoppingCart className="w-4 h-4" />
                </button>
            </div>
        </div>
    </motion.div>
)

function CAMSolutionsPremiumView() {
    const [scrolled, setScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isContactOpen, setIsContactOpen] = useState(false)
    const [contactSent, setContactSent] = useState(false)

    // B2B Engine State
    const { cartCount, setIsCartOpen } = useB2BEngine();
    const [selectedProduct, setSelectedProduct] = useState<B2BProduct | null>(null);

    // B2B Catalog Data
    const CATALOG_PRODUCTS: B2BProduct[] = [
        {
            id: 'resina-hs',
            name: 'Resinas de Alta Precisión',
            category: 'Impresión 3D',
            basePrice: 55000,
            specs: [
                { label: 'Compatibilidad', value: 'Asiga, SprintRay, Phrozen' },
                { label: 'Longitud de Onda', value: '385nm / 405nm' },
                { label: 'Presentación', value: 'Botella 1KG' }
            ],
            variants: [
                {
                    groupName: 'Aplicación Clínica',
                    options: [
                        { id: 'model', label: 'Modelos Dentales (Gris/Beige)', priceModifier: 0 },
                        { id: 'guide', label: 'Guías Quirúrgicas (Transparente)', priceModifier: 15000 },
                        { id: 'temp', label: 'Coronas Provisorias (A1/A2/A3)', priceModifier: 35000 }
                    ]
                }
            ]
        },
        {
            id: 'zirconia-4k',
            name: 'Aidite 4K Multilayer',
            category: 'Discos Zirconia',
            basePrice: 45990,
            specs: [
                { label: 'Resistencia', value: '1050 MPa' },
                { label: 'Translúcidez', value: '53% (Incisal)' },
                { label: 'Sinterización', value: 'Rápida (2 Horas)' }
            ],
            variants: [
                {
                    groupName: 'Grosor',
                    options: [
                        { id: '12mm', label: '12mm', priceModifier: 0 },
                        { id: '14mm', label: '14mm', priceModifier: 2000 },
                        { id: '16mm', label: '16mm', priceModifier: 5000 },
                        { id: '20mm', label: '20mm', priceModifier: 9000 },
                    ]
                },
                {
                    groupName: 'Color (VITA)',
                    options: [
                        { id: 'a1', label: 'A1', priceModifier: 0 },
                        { id: 'a2', label: 'A2', priceModifier: 0 },
                        { id: 'a3', label: 'A3', priceModifier: 0 },
                        { id: 'b1', label: 'B1', priceModifier: 0 },
                        { id: 'bl1', label: 'Bleach 1', priceModifier: 5000 },
                    ]
                }
            ]
        },
        {
            id: 'roland-burs',
            name: 'Fresas Roland Zirconia',
            category: 'Hardware & Repuestos',
            basePrice: 24900,
            specs: [
                { label: 'Compatibilidad', value: 'Roland DWX-52D / 52DCi' },
                { label: 'Recubrimiento', value: 'Diamante Industrial' },
                { label: 'Vida Útil Estimada', value: '3x Mayor a Genéricas' }
            ],
            variants: [
                {
                    groupName: 'Diámetro de Fresa',
                    options: [
                        { id: '2.0mm', label: '2.0mm (Desbaste Max)', priceModifier: 0 },
                        { id: '1.0mm', label: '1.0mm (Detalle Fino)', priceModifier: 0 },
                        { id: '0.6mm', label: '0.6mm (Fisuras)', priceModifier: 2000 },
                        { id: '0.3mm', label: '0.3mm (Micro Detalle)', priceModifier: 5000 },
                    ]
                }
            ]
        }
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const openContact = () => { setIsContactOpen(true); setContactSent(false) }
    const submitContact = (e: React.FormEvent) => { e.preventDefault(); setContactSent(true) }

    return (
        <div className="bg-[#0f172a] min-h-screen selection:bg-cyan-500 selection:text-white overflow-x-hidden text-slate-300 font-sans">
            <Head>
                <title>CAM Solutions | Especialistas en CAD/CAM Dental</title>
                <meta name="description" content="Insumos CAD/CAM de alta precisión. Resinas High-Speed y Zirconia Multilayer para laboratorios dentales en Chile." />
            </Head>

            {/* NAVBAR */}
            <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md py-4 shadow-2xl border-b border-gray-100' : 'bg-transparent py-8'}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
                        <Logo scrolled={scrolled} />
                    </motion.div>

                    <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold tracking-[0.2em] uppercase">
                        {['Inicio', 'Catálogo B2B', 'Logística', 'Soporte Técnico', 'Contacto'].map((item) => (
                            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className={`transition-all hover:text-cyan-500 relative group ${scrolled ? 'text-[#0f172a]' : 'text-white/80 hover:text-white'}`}>
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyan-500 transition-all group-hover:w-full" />
                            </a>
                        ))}
                        <button onClick={() => setIsCartOpen(true)} className={`px-8 py-3 rounded-full font-black transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2 ${scrolled ? 'bg-cyan-500 text-[#0f172a]' : 'bg-white text-[#0f172a]'}`}>
                            <ShoppingCart size={16} /> MI PEDIDO ({cartCount})
                        </button>
                    </div>

                    <button className={`${scrolled ? 'text-[#0f172a]' : 'text-white'} lg:hidden`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </div>
            </nav>

            {/* HERO CINEMÁTICO (Conservando el video original de CAM) */}
            <section className="relative min-h-[85vh] md:h-screen flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-70">
                        <source src="/prospectos/cam-solutions/hero.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent" />
                    <div className="absolute inset-0 bg-[#0f172a]/30" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="flex items-center gap-4 text-cyan-400 font-bold tracking-[0.5em] text-[10px] mb-8 uppercase">
                            <div className="w-16 h-[2px] bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                            El Nuevo Estándar Dental
                        </div>
                        <h1 className="text-5xl sm:text-7xl md:text-[8rem] font-black text-white mb-6 md:mb-10 leading-[0.9] md:leading-[0.85] tracking-tighter uppercase">
                            Estética <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-cyan-500 to-blue-600">Biónica.</span><br className="hidden md:block" />
                            Velocidad Industrial.
                        </h1>
                        <p className="text-lg md:text-2xl text-slate-300 mb-8 md:mb-12 max-w-3xl font-sans font-light leading-relaxed">
                            Resinas High-Speed y Zirconia Multilayer <strong className="text-white font-semibold">Aidite 4K</strong>. Materiales diseñados para erradicar las repeticiones y acelerar el flujo de tu laboratorio.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 mb-16">
                            <button onClick={openContact} className="bg-cyan-500 text-[#0f172a] px-10 py-5 rounded-full text-sm font-black tracking-widest uppercase hover:bg-cyan-400 hover:scale-105 transition-all shadow-[0_0_40px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3">
                                HACER PEDIDO B2B <ChevronRight className="w-5 h-5" />
                            </button>
                            <button onClick={() => document.getElementById('catálogo-b2b')?.scrollIntoView({ behavior: 'smooth' })} className="border border-white/20 text-white px-10 py-5 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-white/10 transition-all backdrop-blur-md text-center">
                                VER CATÁLOGO TÉCNICO
                            </button>
                        </div>

                        {/* MÉTRICAS FRONTALES */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-8 md:pt-12 border-t border-white/10 max-w-4xl">
                            <div className="flex flex-col">
                                <span className="text-4xl md:text-5xl font-black font-mono text-white">1050<span className="text-xl text-cyan-500">MPa</span></span>
                                <span className="text-[9px] md:text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] mt-2">Dureza Cervical</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-4xl md:text-5xl font-black font-mono text-white">53<span className="text-xl text-cyan-500">%</span></span>
                                <span className="text-[9px] md:text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] mt-2">Translúcidez Max</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-4xl md:text-5xl font-black font-mono text-white">2<span className="text-xl text-cyan-500">Horas</span></span>
                                <span className="text-[9px] md:text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] mt-2">Sinterización Rápida</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* MARCAS (Adaptadas de Biocrom) */}
            <section className="py-16 md:py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-6 text-center mb-10">
                    <h3 className="text-2xl md:text-4xl font-black text-[#0f172a] tracking-tight uppercase">Ingeniería Certificada</h3>
                    <p className="mt-4 text-slate-500 font-sans font-light">Representamos a las fábricas que dictan el estándar global.</p>
                </div>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 items-center justify-items-center">
                    {['AIDITE', '3SHAPE', 'ROLAND', 'AMANN GIRRBACH'].map((brand) => (
                        <div key={brand} className="w-full h-24 flex items-center justify-center p-6 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all duration-500 group">
                            <span className="text-2xl md:text-3xl font-black text-slate-300 group-hover:text-cyan-600 transition-colors tracking-tighter uppercase">{brand}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* CATÁLOGO INTERACTIVO (Gesnex Ready / Food Engine) */}
            <section id="catálogo-b2b" className="py-24 md:py-40 bg-[#0f172a] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="mb-20 md:mb-32 border-l-4 border-cyan-500 pl-6 md:pl-10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] uppercase font-bold tracking-widest">
                                Storefront B2B
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6 md:mb-10 uppercase">MATERIALES QUE<br /><span className="text-cyan-400">ESCALAN.</span></h2>
                        <p className="text-slate-400 text-xl font-sans font-light max-w-2xl">Selecciona los insumos para tu flujo de trabajo. Integración con inventario y facturación en tiempo real.</p>
                    </div>

                    <BentoGrid>
                        <BentoCard
                            className="md:col-span-2"
                            badge="High-Speed Protocol"
                            title="Resinas de Alta Precisión"
                            description="Impresiones sin fallos térmicos. Formuladas para modelos, guías quirúrgicas y coronas provisorias. Curado UV optimizado para impresoras industriales Asiga y SprintRay."
                            price="Desde $55.000"
                            image="https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&q=80&w=1200"
                            onClick={() => setSelectedProduct(CATALOG_PRODUCTS[0])}
                        />
                        <BentoCard
                            badge="Premium Esthetics"
                            title="Aidite 4K Multilayer"
                            description="Discos de Zirconia con transición biónica. Ahorra tiempo en glaseado con una translucidez incisal del 53%."
                            price="Desde $45.990"
                            image="https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=800"
                            onClick={() => setSelectedProduct(CATALOG_PRODUCTS[1])}
                        />
                        <BentoCard
                            badge="Hardware"
                            title="Fresas Roland Zirconia"
                            description="Recubrimiento de diamante industrial para una vida útil 3x más larga. Eje calibrado sin vibración."
                            price="Desde $24.900"
                            image="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
                            onClick={() => setSelectedProduct(CATALOG_PRODUCTS[2])}
                        />

                        <div className="md:col-span-2 bg-[#0c1222] rounded-[2.5rem] p-8 md:p-16 text-white flex flex-col justify-center relative shadow-2xl overflow-hidden group border border-cyan-500/20">
                            <div className="absolute inset-0 z-0">
                                <img src="https://implantplaza.hu/uploads/products/styles/800x800/3-shape-e4-3d-scanner-dental-system-premium-incl-labcare-61af2c299bff5.jpg" alt="3Shape" className="w-full h-full object-contain object-right opacity-30 group-hover:scale-105 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#0c1222] via-[#0c1222]/90 to-transparent" />
                            </div>
                            <span className="px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-[10px] uppercase font-bold tracking-widest mb-6 w-fit relative z-10">Equipamiento Mayor</span>
                            <h3 className="text-4xl md:text-6xl font-black mb-6 relative z-10 tracking-tighter uppercase">Scanners &<br /><span className="text-cyan-400">Fresadoras.</span></h3>
                            <p className="text-slate-400 mb-8 max-w-md relative z-10 font-sans text-lg font-light">Ecosistema 3Shape y Roland de entrega inmediata. Soporte de instalación e inducción clínica garantizado.</p>
                            <button onClick={openContact} className="bg-white text-[#0f172a] px-10 py-4 rounded-full font-black w-fit hover:bg-cyan-500 transition-all transform hover:scale-105 relative z-10 text-sm tracking-widest uppercase">
                                SOLICITAR ASESORÍA
                            </button>
                        </div>
                    </BentoGrid>
                </div>
            </section>

            {/* SECCIÓN LOGÍSTICA CHILEXPRESS (El Segundo Motor) */}
            <section id="logistica" className="py-24 md:py-40 bg-[#06101c] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
                        <div>
                            <Truck className="w-16 h-16 text-cyan-500 mb-8" />
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 uppercase leading-tight">
                                LOGÍSTICA PRIORITARIA.<br />
                                <span className="text-slate-500">CERTEZA ABSOLUTA.</span>
                            </h2>
                            <p className="text-xl text-slate-400 font-sans font-light leading-relaxed mb-10">
                                Sabemos que un laboratorio sin insumos es dinero perdido. Nuestro sistema B2B está integrado en tiempo real con la nube de <strong className="text-white">Chilexpress</strong> para garantizar tiempos de tránsito.
                            </p>

                            <div className="space-y-6">
                                <div className="bg-[#0f172a] border border-white/5 p-6 rounded-2xl flex items-center justify-between">
                                    <span className="text-slate-300 font-medium">Pedidos antes de las 14:00 hrs</span>
                                    <span className="text-cyan-400 font-black tracking-widest uppercase text-sm">Despacho Mismo Día</span>
                                </div>
                                <div className="bg-[#0f172a] border border-white/5 p-6 rounded-2xl flex items-center justify-between">
                                    <span className="text-slate-300 font-medium">Entregas Santiago (RM)</span>
                                    <span className="text-cyan-400 font-black tracking-widest uppercase text-sm">24 Horas Hábiles</span>
                                </div>
                            </div>
                        </div>

                        {/* WIDGET SIMULADO CHILExpress */}
                        <div className="bg-[#0a1220] rounded-[3rem] p-10 border border-cyan-500/20 shadow-[0_0_80px_rgba(6,182,212,0.05)] relative">
                            <div className="absolute top-6 right-8 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] uppercase tracking-widest text-emerald-500 font-bold">API Online</span>
                            </div>
                            <h4 className="text-white font-bold text-xl mb-8 flex items-center gap-3"><Activity className="w-5 h-5 text-cyan-500" /> Simulador de Envíos</h4>

                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-4 mb-2 block">Región de Destino</label>
                                    <select className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-4 text-white appearance-none focus:outline-none focus:border-cyan-500 transition-colors cursor-not-allowed opacity-70">
                                        <option>Región Metropolitana (RM)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-4 mb-2 block">Volumen (Discos Zirconia x10)</label>
                                    <input disabled value="1.5 KG" className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none cursor-not-allowed opacity-70" />
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-6 mt-6 flex justify-between items-end">
                                <div>
                                    <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold block mb-1">Costo Estimado</span>
                                    <span className="text-3xl font-black text-white">$4.990</span>
                                </div>
                                <button className="bg-cyan-500/20 text-cyan-400 px-6 py-3 rounded-xl text-sm font-bold opacity-50 cursor-not-allowed">Calcular</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA FINAL CAM SOLUTIONS */}
            <section id="contacto" className="py-24 md:py-40 bg-cyan-600 relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="relative z-10 max-w-7xl mx-auto px-6 text-[#0f172a]">
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 md:mb-12 leading-[0.9] md:leading-[0.85] uppercase">
                        SÚMATE AL<br />FLUJO DIGITAL.
                    </h2>
                    <p className="text-xl md:text-2xl font-bold mb-12 max-w-2xl mx-auto text-[#0f172a]/70">Ingresa como cliente mayorista y accede a precios preferenciales en resinas y bloques CAD/CAM.</p>
                    <div className="flex flex-col md:flex-row gap-5 md:gap-8 justify-center items-center">
                        <a href="tel:+56912345678" className="bg-[#0f172a] text-white px-8 md:px-12 py-5 rounded-full font-black text-sm md:text-lg tracking-widest uppercase flex items-center gap-3 md:gap-4 hover:scale-105 transition-all shadow-2xl group">
                            <Phone size={20} className="group-hover:rotate-12 transition-transform text-cyan-400" /> Hablar con Ventas
                        </a>
                        <button onClick={openContact} className="bg-transparent border-2 border-[#0f172a] text-[#0f172a] px-8 md:px-12 py-5 rounded-full font-black text-sm md:text-lg tracking-widest uppercase hover:bg-[#0f172a] hover:text-white transition-all">
                            Solicitar Catálogo PDF
                        </button>
                    </div>
                </div>
            </section>

            <footer className="py-12 bg-[#06101c] text-center border-t border-white/5">
                <p className="text-slate-600 text-[10px] uppercase tracking-[0.3em] font-bold">
                    CAM SOLUTIONS EIRL © 2026. <br className="md:hidden mt-2" />POWERED BY <span className="text-cyan-600/60">HOJACERO B2B ENGINE</span>
                </p>
            </footer>

            {/* MODAL DE CONTACTO */}
            <AnimatePresence>
                {isContactOpen && (
                    <motion.div className="fixed inset-0 z-[75] bg-[#0f172a]/90 backdrop-blur-md flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsContactOpen(false)}>
                        <motion.div className="bg-[#0c1222] border border-cyan-500/30 w-full max-w-2xl rounded-[2rem] p-8 shadow-2xl" initial={{ y: 30, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0, scale: 0.98 }} transition={{ duration: 0.25 }} onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <p className="text-xs tracking-[0.3em] uppercase font-bold text-cyan-500 mb-2">Apertura de Cuenta B2B</p>
                                    <h4 className="text-4xl font-black text-white tracking-tighter uppercase">Cotización Rápida</h4>
                                </div>
                                <button onClick={() => setIsContactOpen(false)} className="text-slate-500 hover:text-white bg-white/5 p-2 rounded-full"><X size={20} /></button>
                            </div>
                            {contactSent ? (
                                <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-8 text-center text-emerald-400">
                                    <CheckCircle2 size={48} className="mx-auto mb-4" />
                                    <p className="text-xl font-bold">Solicitud enviada correctamente.</p>
                                    <p className="text-sm mt-2 opacity-80">El equipo comercial de CAM Solutions te contactará vía WhatsApp.</p>
                                </div>
                            ) : (
                                <form onSubmit={submitContact} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input placeholder="Nombre del Laboratorio / Clínica *" required className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-4 text-white focus:border-cyan-500 focus:outline-none" />
                                        <input type="tel" placeholder="WhatsApp Consultas *" required className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-4 text-white focus:border-cyan-500 focus:outline-none" />
                                    </div>
                                    <input type="email" placeholder="Correo Electrónico *" required className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-4 text-white focus:border-cyan-500 focus:outline-none" />
                                    <button type="submit" className="w-full bg-cyan-500 text-[#0f172a] py-5 rounded-xl font-black uppercase tracking-widest mt-4 hover:bg-cyan-400 transition-colors">Enviar Solicitud al Ejecutivo</button>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* B2B STORE COMPONENTS */}
            {selectedProduct && (
                <B2BProductModal
                    isOpen={!!selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    product={selectedProduct}
                />
            )}
            <B2BSideCart />
        </div>
    )
}

export default function CAMSolutionsPremium() {
    return (
        <B2BEngineProvider storeId="cam_solutions_b2b">
            <CAMSolutionsPremiumView />
        </B2BEngineProvider>
    )
}
