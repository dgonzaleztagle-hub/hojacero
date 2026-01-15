'use client'

import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Phone, MapPin, Instagram, ChevronRight, Sparkles, ArrowLeftRight } from 'lucide-react'

/*
=============================================================================
PROMPT USED (Smile Gallery + Design Judgment Protocol + Editorial Curation):

STYLE_ARCHETYPE: Smile Gallery (Modern Dental Confidence)
REFERENCE INSPIRATION: Modern dental offices, smile transformation campaigns

CONTENT EXTRACTION: EDITORIAL JUDGMENT
- Extracted real services with exact prices from familysmiledentalclinic.com
- Dr. Juan Carlos Quiroga - Periodoncista y Medicina Estética
- Location: Augusto Leguía Sur 79, Las Condes
- Phone: +56 9 8815 9895

DESIGN JUDGMENT PROTOCOL:
ANTI-PATTERNS (NEVER DO):
- Centered symmetric hero layouts
- Uniform card grids where all look identical  
- Cyan/blue gradients as primary color
- Generic rounded buttons without personality
- White backgrounds without texture/depth

BEFORE EACH SECTION, ASK:
1. "Could this exist on 1000 generic sites?" → If yes, redesign
2. "What makes THIS section unique?" → Must have an answer
3. "Would I screenshot this for inspiration?" → If no, improve

MEMORABILITY REQUIREMENT:
- ONE element that makes this site unforgettable
- Decision: Before/After interactive slider as hero differentiator
=============================================================================
*/

export default function FamilySmileV3() {
    return (
        <main className="w-full relative overflow-hidden bg-[#FAFAF9]">

            {/* NAVBAR - Elegant, not generic */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5 md:px-12 flex justify-between items-center backdrop-blur-md bg-[#FAFAF9]/80 border-b border-black/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0F766E] to-[#2DD4BF] flex items-center justify-center text-white font-serif italic font-bold text-lg shadow-lg shadow-[#0F766E]/20">
                        F
                    </div>
                    <div>
                        <span className="font-serif font-bold text-lg tracking-tight text-[#18181B] block leading-none">Family Smile</span>
                        <span className="text-[10px] text-zinc-400 uppercase tracking-widest">Dr. Juan Carlos Quiroga</span>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
                    <a href="#servicios" className="hover:text-[#0F766E] transition-colors">Servicios</a>
                    <a href="#estetica" className="hover:text-[#0F766E] transition-colors">Medicina Estética</a>
                    <a href="#contacto" className="hover:text-[#0F766E] transition-colors">Contacto</a>
                </div>

                <div className="flex items-center gap-4">
                    <a href="tel:+56988159895" className="hidden md:flex items-center gap-2 text-xs font-bold text-[#0F766E]">
                        <Phone className="w-3.5 h-3.5" /> +56 9 8815 9895
                    </a>
                    <a
                        href="https://www.familysmiledentalclinic.com/book-online"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#18181B] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#0F766E] transition-colors shadow-lg"
                    >
                        Reservar Hora
                    </a>
                </div>
            </nav>

            {/* HERO - Asymmetric, not centered. Decision: 7/5 grid with transformation focus */}
            <section className="relative min-h-screen flex flex-col pt-28 px-6 md:px-12 pb-16">

                {/* Abstract background - not solid white */}
                <div className="absolute top-0 right-0 w-[60vw] h-[80vh] bg-gradient-to-bl from-[#2DD4BF]/8 to-transparent rounded-bl-[12rem] -z-10" />
                <div className="absolute bottom-20 left-0 w-[40vw] h-[50vh] bg-gradient-to-tr from-[#0F766E]/5 to-transparent rounded-tr-[10rem] -z-10" />

                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center flex-1">

                    {/* Text - 7 columns, NOT centered */}
                    <div className="lg:col-span-7 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Badge - real credential */}
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0F766E]/20 bg-[#0F766E]/5 text-[#0F766E] text-[10px] uppercase font-bold tracking-widest mb-6">
                                <Sparkles className="w-3 h-3" /> Periodoncista & Medicina Estética
                            </div>

                            {/* Headline - Serif + Italic mix, NOT generic */}
                            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[0.95] text-[#18181B] mb-6">
                                Tu sonrisa,<br />
                                <span className="italic text-[#0F766E]">tu mejor versión.</span>
                            </h1>

                            {/* Subheadline - Real value prop */}
                            <p className="text-lg md:text-xl text-zinc-500 font-light leading-relaxed max-w-lg">
                                Odontología clínica avanzada y medicina estética facial.
                                <strong className="text-zinc-700 font-medium"> Sin cirugía, resultados naturales.</strong>
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex flex-wrap gap-4"
                        >
                            <a
                                href="https://www.familysmiledentalclinic.com/book-online"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group bg-[#0F766E] text-white px-8 py-4 rounded-full text-sm font-bold tracking-wide shadow-xl shadow-[#0F766E]/25 hover:shadow-2xl hover:bg-[#0D6059] transition-all flex items-center gap-3"
                            >
                                Agendar Evaluación
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a
                                href="https://www.instagram.com/familysmilecl"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-4 rounded-full border border-zinc-200 text-zinc-600 font-medium text-sm hover:bg-white hover:border-zinc-300 transition-all flex items-center gap-2"
                            >
                                <Instagram className="w-4 h-4" /> @familysmilecl
                            </a>
                        </motion.div>

                        {/* Location badge - Real data */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-center gap-3 pt-4 text-sm text-zinc-400"
                        >
                            <MapPin className="w-4 h-4 text-[#0F766E]" />
                            <span>Augusto Leguía Sur 79, Las Condes</span>
                        </motion.div>
                    </div>

                    {/* Visual - 5 columns, INTERACTIVE element (memorability requirement) */}
                    <div className="lg:col-span-5 relative">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="relative"
                        >
                            {/* Main visual container with unique shape */}
                            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl shadow-[#0F766E]/15">
                                <BeforeAfterSlider />

                                {/* Overlay card - glassmorphism */}
                                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-white/50 shadow-lg">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-[#0F766E] font-bold mb-1">Resultado Real</p>
                                            <h3 className="font-serif text-lg text-zinc-900">Diseño de Sonrisa</h3>
                                        </div>
                                        <div className="bg-[#2DD4BF] text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
                                            ANTES / DESPUÉS
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* SERVICES - NOT uniform grid. Decision: Featured card + smaller cards */}
            <section id="servicios" className="px-6 md:px-12 py-24 bg-white">
                <div className="max-w-7xl mx-auto">

                    <div className="mb-16">
                        <span className="text-[#0F766E] text-xs font-bold uppercase tracking-widest">Servicios Dentales</span>
                        <h2 className="font-serif text-4xl md:text-5xl text-[#18181B] mt-4">
                            Cuidado integral <span className="italic text-zinc-400">&</span> tecnología.
                        </h2>
                    </div>

                    {/* Asymmetric grid - 1 featured + rest smaller */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Featured service - DIFFERENT from others */}
                        <div className="md:col-span-2 bg-gradient-to-br from-[#0F766E] to-[#0D6059] rounded-[2rem] p-10 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10">
                                <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                                    Especialidad Principal
                                </div>
                                <h3 className="font-serif text-3xl md:text-4xl mb-4">Periodoncia</h3>
                                <p className="text-white/70 text-lg leading-relaxed max-w-md mb-8">
                                    Tratamiento especializado de las encías. Recupera la salud de tu sonrisa con el Dr. Quiroga, especialista certificado.
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl font-bold">$15.000 <span className="text-base font-normal text-white/50">consulta</span></span>
                                    <a
                                        href="https://www.familysmiledentalclinic.com/book-online"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white text-[#0F766E] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#2DD4BF] hover:text-white transition-colors"
                                    >
                                        Reservar
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Regular services - smaller, simpler */}
                        <div className="space-y-6">
                            <ServiceCard name="Urgencia Dental" price="$10.000" />
                            <ServiceCard name="Blanqueamiento" price="$100.000" />
                            <ServiceCard name="Implantes" price="$700.000" />
                        </div>
                    </div>

                    {/* Second row - different layout */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <ServiceCardSmall name="Endodoncia" price="$15.000" />
                        <ServiceCardSmall name="Ortodoncia" price="$15.000" />
                        <ServiceCardSmall name="Limpieza Preventiva" price="$60.000" />
                        <ServiceCardSmall name="Tapadura en Resina" price="Desde $20.000" />
                    </div>
                </div>
            </section>

            {/* MEDICINA ESTÉTICA - Dark section for contrast */}
            <section id="estetica" className="px-6 md:px-12 py-24 bg-[#18181B] text-white relative overflow-hidden">

                {/* Abstract shapes */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-[#2DD4BF]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#C084FC]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

                <div className="max-w-7xl mx-auto relative z-10">

                    <div className="text-center mb-16">
                        <span className="text-[#2DD4BF] text-xs font-bold uppercase tracking-widest">Medicina Estética Facial</span>
                        <h2 className="font-serif text-4xl md:text-5xl text-white mt-4">
                            Rejuvenece <span className="italic text-zinc-500">sin cirugía.</span>
                        </h2>
                        <p className="text-zinc-400 mt-4 max-w-xl mx-auto">
                            Tecnología láser de última generación. Resultados naturales que respetan tu esencia.
                        </p>
                    </div>

                    {/* Grid with hierarchy */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <AestheticCard
                            name="Botox"
                            price="Desde $100.000"
                            description="Tratamiento para arrugas por zonas"
                            featured
                        />
                        <AestheticCard
                            name="Ácido Hialurónico"
                            price="$250.000"
                            description="Volumen y definición natural para labios"
                        />
                        <AestheticCard
                            name="Exosomas"
                            price="$250.000"
                            description="Rejuvenecimiento celular avanzado"
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                        <AestheticCardSmall name="Endolifting Láser" price="Desde $800.000" />
                        <AestheticCardSmall name="Peeling Hollywood" price="$600" />
                        <AestheticCardSmall name="Tratamiento Ojeras" price="$600" />
                    </div>

                    <div className="text-center mt-12">
                        <a
                            href="https://www.familysmiledentalclinic.com/servicios-de-medicina-est%C3%A9tica"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[#2DD4BF] hover:text-white transition-colors text-sm font-medium"
                        >
                            Ver todos los tratamientos <ChevronRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </section>

            {/* CONTACT - Clean, not generic */}
            <section id="contacto" className="px-6 md:px-12 py-24 bg-[#FAFAF9]">
                <div className="max-w-4xl mx-auto text-center">

                    <h2 className="font-serif text-4xl md:text-5xl text-[#18181B] mb-6">
                        ¿Lista para <span className="italic text-[#0F766E]">transformarte?</span>
                    </h2>
                    <p className="text-zinc-500 text-lg mb-12 max-w-lg mx-auto">
                        Agenda tu evaluación gratuita y descubre el plan perfecto para tu sonrisa.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                        <a
                            href="https://www.familysmiledentalclinic.com/book-online"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#0F766E] text-white px-10 py-5 rounded-full text-sm font-bold tracking-wide shadow-xl shadow-[#0F766E]/25 hover:shadow-2xl hover:bg-[#0D6059] transition-all"
                        >
                            Reservar Hora Online
                        </a>
                        <a
                            href="tel:+56988159895"
                            className="px-8 py-5 rounded-full border border-zinc-200 text-zinc-600 font-medium text-sm hover:bg-white transition-all flex items-center gap-2"
                        >
                            <Phone className="w-4 h-4" /> +56 9 8815 9895
                        </a>
                    </div>

                    {/* Contact cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm">
                            <Phone className="w-8 h-8 text-[#0F766E] mx-auto mb-4" />
                            <h3 className="font-semibold text-zinc-900 mb-2">Teléfono</h3>
                            <p className="text-zinc-500">+56 9 8815 9895</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm">
                            <MapPin className="w-8 h-8 text-[#0F766E] mx-auto mb-4" />
                            <h3 className="font-semibold text-zinc-900 mb-2">Ubicación</h3>
                            <p className="text-zinc-500">Augusto Leguía Sur 79<br />Las Condes, Santiago</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm">
                            <Instagram className="w-8 h-8 text-[#0F766E] mx-auto mb-4" />
                            <h3 className="font-semibold text-zinc-900 mb-2">Instagram</h3>
                            <p className="text-zinc-500">@familysmilecl</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-[#18181B] text-zinc-400 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0F766E] to-[#2DD4BF] flex items-center justify-center text-white font-serif italic font-bold text-sm">
                            F
                        </div>
                        <span className="font-serif text-white">Family Smile Dental Clinic</span>
                    </div>
                    <p className="text-sm">© 2024 Family Smile. Todos los derechos reservados.</p>
                    <p className="text-xs text-zinc-600">Demo generado por HojaCero Factory</p>
                </div>
            </footer>
        </main>
    )
}

// ============================================================================
// COMPONENTS - Custom, not generic
// ============================================================================

function BeforeAfterSlider() {
    const [position, setPosition] = useState(50)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
        setPosition((x / rect.width) * 100)
    }

    return (
        <div
            ref={containerRef}
            onMouseMove={(e) => handleMove(e.clientX)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
            className="relative w-full h-full cursor-ew-resize select-none bg-gradient-to-br from-zinc-200 to-zinc-300"
        >
            {/* Placeholder - in production, real images */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2DD4BF]/30 to-[#0F766E]/50 flex items-center justify-center">
                <span className="text-white/80 text-sm font-medium">Resultado</span>
            </div>

            <div
                className="absolute inset-0 bg-zinc-400 flex items-center justify-center"
                style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            >
                <span className="text-white/80 text-sm font-medium">Antes</span>
            </div>

            {/* Slider handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-xl z-20"
                style={{ left: `${position}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <ArrowLeftRight className="w-4 h-4 text-[#0F766E]" />
                </div>
            </div>
        </div>
    )
}

function ServiceCard({ name, price }: { name: string; price: string }) {
    return (
        <div className="bg-[#FAFAF9] rounded-2xl p-6 hover:shadow-lg hover:bg-white transition-all group border border-transparent hover:border-[#0F766E]/10">
            <h4 className="font-serif text-xl text-zinc-900 mb-2">{name}</h4>
            <p className="text-2xl font-bold text-[#0F766E]">{price}</p>
        </div>
    )
}

function ServiceCardSmall({ name, price }: { name: string; price: string }) {
    return (
        <div className="bg-[#FAFAF9] rounded-xl p-4 hover:bg-white transition-all border border-transparent hover:border-zinc-200">
            <h4 className="font-medium text-zinc-900 text-sm mb-1">{name}</h4>
            <p className="text-lg font-bold text-[#0F766E]">{price}</p>
        </div>
    )
}

function AestheticCard({ name, price, description, featured }: { name: string; price: string; description: string; featured?: boolean }) {
    return (
        <div className={`rounded-2xl p-8 ${featured ? 'bg-gradient-to-br from-[#2DD4BF]/20 to-transparent border border-[#2DD4BF]/30' : 'bg-white/5 border border-white/10'} hover:bg-white/10 transition-all`}>
            {featured && (
                <div className="inline-block px-2 py-1 bg-[#2DD4BF] text-black text-[10px] font-bold uppercase tracking-widest rounded mb-4">
                    Popular
                </div>
            )}
            <h4 className="font-serif text-2xl text-white mb-2">{name}</h4>
            <p className="text-zinc-400 text-sm mb-4">{description}</p>
            <p className="text-2xl font-bold text-[#2DD4BF]">{price}</p>
        </div>
    )
}

function AestheticCardSmall({ name, price }: { name: string; price: string }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
            <h4 className="font-medium text-white text-sm mb-1">{name}</h4>
            <p className="text-lg font-bold text-[#2DD4BF]">{price}</p>
        </div>
    )
}
