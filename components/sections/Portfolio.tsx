'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const projects = [
    {
        id: '01',
        title: 'SUPERPANEL',
        category: 'SAAS / ENTERTAINMENT',
        image: '/projects/superpanel.png',
        link: 'https://superpanel.lat'
    },
    {
        id: '02',
        title: 'PLUS CONTABLE',
        category: 'FINTECH / SAAS',
        image: '/projects/pluscontable.png',
        link: 'https://pluscontable.cl'
    },
    {
        id: '03',
        title: 'TRUCK POS',
        category: 'WEB APP / IN DEVELOPMENT',
        image: '/projects/truckpos.png',
        link: '#'
    },
    {
        id: '04',
        title: 'ICE BUIN',
        category: 'E-COMMERCE',
        image: '/projects/icebuin.png',
        link: 'https://icebuin.cl'
    }
];

export default function Portfolio() {
    const containerRef = useRef<HTMLDivElement>(null);

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
                        <Link key={project.id} href={project.link} className="project-card group relative border-t border-white/10 py-24 hover:bg-white/5 transition-colors duration-500 hover-trigger cursor-none block">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 relative z-20">
                                <div className="flex flex-col">
                                    <span className="text-xs font-mono text-gray-500 mb-4">{project.category}</span>
                                    <h3 className="text-5xl md:text-8xl font-display font-bold group-hover:translate-x-4 transition-transform duration-500 group-hover:text-accent">
                                        {project.title}
                                    </h3>
                                </div>

                                <div className="relative w-full md:w-[500px] aspect-video overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100 hidden md:block">
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="project-image object-cover transform scale-125"
                                    />
                                </div>

                                {/* Mobile Image (visible only on small screens) */}
                                <div className="md:hidden w-full aspect-video relative overflow-hidden mt-4">
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="object-cover"
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

                <div className="mt-32 text-center">
                    <Link href="#" className="inline-block border border-white/20 px-12 py-6 rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 hover-trigger">
                        View All Projects
                    </Link>
                </div>

            </div>
        </section>
    );
}
