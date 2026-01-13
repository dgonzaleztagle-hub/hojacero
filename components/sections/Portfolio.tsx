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
        link: 'https://superpanel.lat'
    },
    {
        id: '02',
        title: 'PLUS CONTABLE',
        category: 'FINTECH / SAAS',
        description: 'Gestión administrativa y tributaria integral. Contabilidad automatizada adaptada a normativa chilena.',
        image: '/projects/pluscontable.png',
        link: 'https://pluscontable.cl'
    },
    {
        id: '03',
        title: 'TRUCK POS',
        category: 'WEB APP / IN DEVELOPMENT',
        description: 'Sistema de punto de venta móvil para Food Trucks. Control eficiente y flexible en movimiento.',
        image: '/projects/truckpos.png',
        link: '#'
    },
    {
        id: '04',
        title: 'ICE BUIN',
        category: 'E-COMMERCE',
        description: 'Ecommerce de productos congelados premium. Catálogo digital y logística de distribución optimizada.',
        image: '/projects/icebuin.png',
        link: 'https://icebuin.cl'
    }
];

export default function Portfolio() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredProject, setHoveredProject] = useState<string | null>(null); // Track hover

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
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            href={project.link}
                            className="project-card group relative border-t border-white/10 py-24 hover:bg-white/5 transition-colors duration-500 hover-trigger cursor-none block"
                            onMouseEnter={() => setHoveredProject(project.id)}
                            onMouseLeave={() => setHoveredProject(null)}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 relative z-20">
                                <div className="flex flex-col max-w-xl">
                                    <span className="text-xs font-mono text-gray-500 mb-4">{project.category}</span>
                                    <h3 className="text-5xl md:text-8xl font-display font-bold group-hover:translate-x-4 transition-transform duration-500 group-hover:text-accent mb-6">
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

                                <div className="relative w-full md:w-[500px] aspect-video overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100 hidden md:block md:mr-12">
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="project-image object-contain"
                                    />
                                </div>

                                {/* Mobile Image (visible only on small screens) */}
                                <div className="md:hidden w-full aspect-video relative overflow-hidden mt-4">
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                <div className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-10 group-hover:translate-x-0">
                                    <span className="text-xs font-bold bg-white text-black px-4 py-2 rounded-full uppercase tracking-widest">View Case</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                    <div className="w-full h-[1px] bg-white/10"></div>
                </div>



            </div>
        </section>
    );
}
