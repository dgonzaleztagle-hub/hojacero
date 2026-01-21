'use client';

// ... (We need to wrap the logic to handle hover state)
// Wait, to avoid refactoring the whole component into item sub-components for state, 
// I'll track 'hoveredProject' state in the parent Portfolio component.

import { useRef, useEffect, useState } from 'react'; // Added useState
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import TextScramble from '@/components/ui/TextScramble'; // Import

gsap.registerPlugin(ScrollTrigger);

const projects = [
    {
        id: '01',
        title: 'SUPERPANEL',
        category: 'SAAS / ENTERTAINMENT',
        description: 'Plataforma global de gestión para resellers IPTV. Infraestructura escalable para mercados internacionales.',
        image: '/projects/superpanel.png',
        link: 'https://superpanel.lat',
        status: 'live'
    },
    {
        id: '02',
        title: 'PLUS CONTABLE',
        category: 'FINTECH / SAAS',
        description: 'Gestión administrativa y tributaria integral. Contabilidad automatizada adaptada a normativa chilena.',
        image: '/projects/pluscontable.png',
        link: 'https://pluscontable.cl',
        status: 'live'
    },
    {
        id: '03',
        title: 'TRUCK POS',
        category: 'WEB APP / IN DEVELOPMENT',
        description: 'Sistema de punto de venta móvil para Food Trucks. Control eficiente y flexible en movimiento.',
        image: '/projects/truckpos.png',
        link: '#',
        status: 'development' // Flag para desactivar click
    },
    {
        id: '04',
        title: 'ICE BUIN',
        category: 'E-COMMERCE',
        description: 'Ecommerce de productos congelados premium. Catálogo digital y logística de distribución optimizada.',
        image: '/projects/icebuin.png',
        link: 'https://icebuin.cl',
        status: 'live'
    }
];

export default function Portfolio() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredProject, setHoveredProject] = useState<string | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Parallax effect for images
            gsap.utils.toArray<HTMLElement>('.project-card').forEach((card) => {
                const image = card.querySelector('.project-image');

                gsap.to(image, {
                    yPercent: -20,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="w-full py-32 bg-black text-white relative z-10">
            <div className="container mx-auto px-6 md:px-20">
                <div className="flex items-end justify-between mb-24">
                    <h2 className="text-6xl md:text-9xl font-display font-bold opacity-10 select-none">WORKS</h2>
                    <span className="text-xs font-mono text-accent/80 tracking-widest">SELECTED / 2024-2026</span>
                </div>

                <div className="flex flex-col">
                    {projects.map((project) => {
                        const isDev = project.status === 'development';
                        const CardTag = isDev ? 'div' : Link; // Renderiza div si es dev, Link si es live

                        return (
                            <CardTag
                                key={project.id}
                                href={project.link}
                                className={`project-card group relative border-t border-white/10 py-24 transition-colors duration-500 block ${isDev ? 'cursor-help hover:bg-white/5' : 'hover:bg-white/5 hover-trigger cursor-none'}`}
                                onMouseEnter={() => setHoveredProject(project.id)}
                                onMouseLeave={() => setHoveredProject(null)}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 relative z-20">
                                    <div className="flex flex-col max-w-xl">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-xs font-mono text-gray-500">{project.category}</span>
                                            {isDev && (
                                                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-yellow-500/50">
                                                    Próximamente
                                                </span>
                                            )}
                                        </div>

                                        <h3 className={`text-5xl md:text-8xl font-display font-bold transition-transform duration-500 mb-6 ${isDev ? 'text-gray-600' : 'group-hover:translate-x-4 group-hover:text-accent'}`}>
                                            {project.title}
                                        </h3>

                                        {/* Description with Scramble Effect */}
                                        <div className="h-16 md:h-12 overflow-hidden">
                                            <TextScramble
                                                text={project.description || ''}
                                                trigger={hoveredProject === project.id}
                                                className="text-sm md:text-base text-gray-400 block max-w-md"
                                            />
                                        </div>
                                    </div>

                                    <div className={`relative w-full md:w-[500px] aspect-video overflow-hidden transition-all duration-700 hidden md:block md:mr-12 ${isDev ? 'grayscale opacity-30' : 'grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100'}`}>
                                        <Image
                                            src={project.image}
                                            alt={project.title}
                                            fill
                                            className="project-image object-contain"
                                        />
                                    </div>

                                    {/* Mobile Image */}
                                    <div className={`md:hidden w-full aspect-video relative overflow-hidden mt-4 ${isDev ? 'opacity-50 grayscale' : ''}`}>
                                        <Image
                                            src={project.image}
                                            alt={project.title}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>

                                    {/* Link Button / Label */}
                                    <div className={`md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 transition-opacity duration-300 transform translate-x-10 group-hover:translate-x-0 ${isDev ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                        <span className={`text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest ${isDev ? 'bg-transparent text-gray-500 border border-gray-600' : 'bg-white text-black'}`}>
                                            {isDev ? 'En Desarrollo' : 'View Case'}
                                        </span>
                                    </div>
                                </div>
                            </CardTag>
                        );
                    })}
                    <div className="w-full h-[1px] bg-white/10"></div>
                </div>



            </div>
        </section>
    );
}
