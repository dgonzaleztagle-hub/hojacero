'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import CustomCursor from '@/components/ui/CustomCursor';
import { VisionModal } from '@/components/ui/VisionModal';
import { CASES, CaseStudy } from './data';

const NoiseOverlay = () => (
    <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
);

const GridPattern = () => (
    <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
);

import { useDisableInspect } from '@/hooks/useDisableInspect';

export default function VisionPage() {
    useDisableInspect(); // Security: Disable Inspect
    const [selectedProject, setSelectedProject] = useState<CaseStudy | null>(null);

    return (
        <main className="relative min-h-screen bg-black text-white selection:bg-cyan-500/30 selection:text-cyan-100">
            <CustomCursor />
            <NoiseOverlay />
            <GridPattern />

            <VisionModal
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
                project={selectedProject}
            />

            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center mix-blend-difference">
                <div className="flex items-center gap-4">
                    <span className="font-display font-bold tracking-widest text-xs">HOJACERO / VISION</span>
                </div>
                <Link href="/" className="text-xs font-mono opacity-50 hover:opacity-100 transition-opacity">[ RETURN TO BASE ]</Link>
            </nav>

            <header className="relative pt-32 pb-16 px-6 container mx-auto">
                <h1 className="text-[clamp(3rem,6vw,6rem)] font-display font-bold leading-[0.9] text-center mb-4">
                    THE VISION <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">INDEX</span>
                </h1>
                <p className="text-center text-zinc-500 max-w-xl mx-auto font-light">
                    No diseñamos páginas web. Diseñamos futuros alternativos.
                    <br />
                    Explora la transformación.
                </p>
            </header>

            {/* THE INDEX (Full Grid) */}
            <section className="px-6 pb-20 container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[300px]">
                    {CASES.map((item, i) => (
                        <motion.div
                            key={item.id}
                            layoutId={`card-${item.id}`} // For future hero animations
                            onClick={() => setSelectedProject(item)}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative group overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] hover:border-cyan-500/30 cursor-pointer transition-all ${item.bentoSize === 'large' ? 'md:col-span-12 md:row-span-2' :
                                item.bentoSize === 'medium' ? 'md:col-span-8' : 'md:col-span-4'
                                }`}
                        >
                            <Image
                                src={item.coverImage || item.imageAfter}
                                alt={item.client}
                                fill
                                className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-cyan-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                                    <span className="text-xl leading-none mb-1">↗</span>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`text-[10px] font-mono uppercase tracking-wider ${item.type === 'deployed' ? 'text-green-400' : 'text-purple-400'
                                        }`}>
                                        {item.type}
                                    </span>
                                </div>
                                <h4 className="text-3xl font-bold font-display leading-tight mb-2 text-white group-hover:text-cyan-50 transition-colors">{item.client}</h4>
                                <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
                                    <p className="text-xs text-zinc-300 pt-2">{item.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </main>
    );
}
