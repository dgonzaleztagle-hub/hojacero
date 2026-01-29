'use client';

import { KineticText } from '@/components/premium/KineticText';
import TextScramble from '@/components/ui/TextScramble';
import { BentoGrid, BentoGridItem } from '@/components/premium/BentoGrid';
import { MagneticCursor } from '@/components/premium/MagneticCursor';
import { AnimatedGradient } from '@/components/premium/AnimatedGradient';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ReparpadsPage() {
    return (
        <div className="flex flex-col w-full">

            {/* --- HERO SECTION: TECH LAB STARTUP --- */}
            <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden border-b border-[#10B981]/20">
                <AnimatedGradient colors={['#050505', '#022c22', '#050505']} speed={3} blur={100} />

                {/* HUD Elements */}
                {/* HUD Elements */}
                <div className="absolute top-6 left-6 z-50">
                    <Image
                        src="/prospectos/reparpads/logo_v2.png"
                        alt="Reparpads Logo"
                        width={220}
                        height={220}
                        className="object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                    />
                </div>
                <div className="absolute top-10 right-10 font-orbitron text-xs text-[#10B981] tracking-[0.3em] opacity-60">
                    LOC: LA FLORIDA
                </div>

                <div className="z-10 text-center max-w-4xl px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-4 inline-block px-3 py-1 border border-[#10B981]/50 rounded-full bg-[#10B981]/10 text-[#10B981] text-sm font-bold tracking-widest uppercase font-rajdhani"
                    >
                        Servicio Técnico Especializado
                    </motion.div>

                    <div className="font-orbitron font-black text-6xl md:text-8xl lg:text-9xl mb-2 text-white tracking-tighter mix-blend-difference">
                        <KineticText text="REPARPADS" animation="scale" splitBy="chars" stagger={0.05} />
                    </div>

                    <div className="font-rajdhani text-xl md:text-3xl text-[#10B981] mt-4 flex items-center justify-center gap-2">
                        <span>[ STATUS: </span>
                        <TextScramble
                            text="BATERÍA VIVA"
                            trigger={true}
                            className="font-bold text-[#F59E0B]"
                        />
                        <span> ]</span>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="text-gray-400 mt-8 max-w-lg mx-auto font-rajdhani text-lg leading-relaxed"
                    >
                        Resucitamos tu hardware electrónico. Mantenimiento, cambio de sensores y reparación de módulos. No lo botes, actualízalo.
                    </motion.p>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-10 flex flex-col items-center gap-2"
                >
                    <span className="text-[10px] text-[#10B981] tracking-widest font-orbitron">SCROLL TO SCAN</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-[#10B981] to-transparent" />
                </motion.div>
            </section>


            {/* --- SERVICES GRID: BLUEPRINT STYLE --- */}
            <section className="py-24 px-4 md:px-12 bg-[#050505] relative">
                <div className="absolute inset-0 bg-[url('/prospectos/reparpads/grid.svg')] opacity-5 pointer-events-none" />

                <div className="max-w-7xl mx-auto mb-16">
                    <h2 className="font-orbitron text-4xl md:text-5xl text-white mb-4">PROTOCOLOS <span className="text-[#10B981]">DE SERVICIO</span></h2>
                    <div className="h-1 w-24 bg-[#10B981]" />
                </div>

                <BentoGrid className="max-w-7xl mx-auto">
                    {items.map((item, i) => (
                        <BentoGridItem
                            key={i}
                            title={item.title}
                            description={item.description}
                            header={item.header}
                            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
                            icon={item.icon}
                        />
                    ))}
                </BentoGrid>
            </section>


            {/* --- WHY US: INDUSTRIAL TECH --- */}
            <section className="py-24 bg-[#080808] border-t border-[#10B981]/10">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="font-rajdhani text-[#F59E0B] text-lg font-bold mb-2 tracking-widest">
                      // SYSTEM DIAGNOSTICS
                        </div>
                        <h3 className="font-orbitron text-4xl md:text-5xl text-white mb-6 leading-tight">
                            MÁS RÁPIDO QUE <br />
                            EL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#F59E0B]">SERVICIO OFICIAL</span>.
                        </h3>
                        <p className="font-rajdhani text-gray-400 text-xl mb-8">
                            Sabemos que tienes tocatas el fin de semana. Por eso nuestros tiempos de respuesta son de "Guerra". Diagnóstico preciso, solución definitiva.
                        </p>

                        <ul className="space-y-4 font-rajdhani text-lg text-white">
                            <li className="flex items-center gap-3">
                                <span className="text-[#10B981]">➜</span> Diagnóstico en 24hrs
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-[#10B981]">➜</span> Piezas reforzadas (Mejor que original)
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-[#10B981]">➜</span> Garantía de por vida en soldaduras
                            </li>
                        </ul>

                        <div className="mt-12">
                            <MagneticCursor>
                                <a href="https://wa.me/56958274826" className="px-8 py-4 bg-[#10B981] text-black font-orbitron font-bold tracking-wider hover:bg-[#F59E0B] transition-colors clip-path-polygon">
                                    INICIAR REPARACIÓN
                                </a>
                            </MagneticCursor>
                        </div>
                    </div>

                    <div className="relative h-[500px] w-full bg-[#050505] border border-[#10B981]/30 rounded-lg overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#10B981]/20 to-transparent opacity-50" />
                        {/* Placeholder for "Tech Image" - Ideally an exploded view of a drum pad */}
                        {/* Tech Image: Exploded View */}
                        <Image
                            src="/prospectos/reparpads/schematic.png"
                            alt="Drum Pad Schematic"
                            fill
                            className="object-cover opacity-60"
                        />

                        {/* HUD Overlay */}
                        <div className="absolute top-4 left-4 font-mono text-[10px] text-[#10B981]">
                            SCANNING_HARDWARE...
                        </div>
                        <div className="absolute bottom-4 right-4 font-mono text-[10px] text-[#10B981]">
                            INTEGRITY: 100%
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER: SYSTEM SHUTDOWN --- */}
            <footer className="bg-black py-12 border-t border-[#10B981]/20">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <h4 className="font-orbitron text-2xl text-white">REPARPADS</h4>
                        <p className="font-rajdhani text-gray-500 text-sm mt-1">La Florida, Santiago, Chile.</p>
                        <div className="flex gap-4 mt-4">
                            <a href="https://instagram.com/reparpads" target="_blank" rel="noopener noreferrer" className="text-[#10B981] hover:text-[#F59E0B] transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                            </a>
                        </div>
                    </div>
                    <div className="font-rajdhani text-[#10B981] text-sm">
                        <span className="opacity-50">SYSTEM_VERSION:</span> v1.0.4
                    </div>
                    <div className="text-gray-600 text-xs font-rajdhani">
                        © 2024 REPARPADS. OPERATIONAL.
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Data for Bento Grid
const Skeleton = ({ bg, border }: { bg: string, border: string }) => (
    <div className={`flex flex-1 w-full h-full min-h-[6rem] rounded-xl ${bg} border ${border} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent,rgba(255,255,255,0.05),transparent)] animate-shimmer" />
    </div>
);

const items = [
    {
        title: "Sensors Upgrade",
        description: "Reemplazo de sensores piezoeléctricos gastados por versiones de alta sensibilidad.",
        header: (
            <div className="relative w-full h-full min-h-[6rem] rounded-xl overflow-hidden border border-[#10B981]/20 group">
                <Image src="/prospectos/reparpads/macro.png" alt="Soldering" fill className="object-cover opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
        ),
        icon: <span className="text-2xl">⚡</span>,
    },
    {
        title: "Módulo Rescue",
        description: "Reparación de pantallas LCD, botones pegados y potenciómetros con ruido.",
        header: (
            <div className="relative w-full h-full min-h-[6rem] rounded-xl overflow-hidden border border-[#F59E0B]/20 group">
                <Image src="/prospectos/reparpads/waveform.png" alt="Oscilloscope" fill className="object-cover opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
        ),
        icon: <span className="text-2xl">🎛️</span>,
    },
    {
        title: "Cable Management",
        description: "Re-cableado interno y reforzamiento de jacks 1/4 para evitar falsos contactos.",
        header: (
            <div className="relative w-full h-full min-h-[6rem] rounded-xl overflow-hidden border border-blue-500/20 group">
                <Image src="/prospectos/reparpads/cables.png" alt="Cable Management" fill className="object-cover opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
        ),
        icon: <span className="text-2xl">🔌</span>,
    },
    {
        title: "Limpieza Profunda",
        description: "Desarme completo, limpieza de sulfato y lubricación de partes móviles. Tu batería queda como nueva.",
        header: (
            <div className="relative w-full h-full min-h-[6rem] rounded-xl overflow-hidden border border-purple-500/20 group">
                <Image src="/prospectos/reparpads/drum_pad_medium.png" alt="Drum Pad Cleaning" fill className="object-cover opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
        ),
        icon: <span className="text-2xl">✨</span>,
    },
    {
        title: "Roland / Alesis / Yamaha",
        description: "Trabajamos con todas las marcas principales del mercado.",
        header: (
            <div className="relative w-full h-full min-h-[6rem] rounded-xl overflow-hidden border border-white/10 group">
                <Image src="/prospectos/reparpads/gear.png" alt="Pro Audio Gear" fill className="object-cover opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
        ),
        icon: <span className="text-2xl">🛡️</span>,
    },
];


