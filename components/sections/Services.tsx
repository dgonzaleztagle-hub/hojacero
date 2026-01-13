'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        id: '01',
        title: 'DISEÑO & DESARROLLO',
        description: 'Interfaces que desafían la gravedad. Desde Single Page Apps hasta Ecosistemas Web Complejos. Next.js, React, UI/UX de alto impacto.',
    },
    {
        id: '02',
        title: 'INFRAESTRUCTURA CLOUD',
        description: 'Arquitectura escalable y segura. Gestión de servidores, Dominios, Hosting y Despliegue continuo. Tu base digital, solida como roca.',
    },
    {
        id: '03',
        title: 'ESTRATEGIA DIGITAL',
        description: 'Marketing que penetra. SEO técnico, Posicionamiento orgánico y campañas de conversión. No solo existes, dominas.',
    },
    {
        id: '04',
        title: 'TRANSFORMACIÓN AI',
        description: 'El futuro ahora. Integración de Inteligencia Artificial, Automatización de flujos y chatbots avanzados. Potencia sin límites.',
    }
];

export default function Services() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate line separators
            gsap.utils.toArray<HTMLElement>('.service-line').forEach((line) => {
                gsap.fromTo(line,
                    { scaleX: 0, transformOrigin: 'left' },
                    {
                        scaleX: 1,
                        duration: 1.5,
                        ease: 'expo.out',
                        scrollTrigger: {
                            trigger: line,
                            start: 'top 80%',
                        }
                    }
                );
            });

            // Animate text elements
            gsap.utils.toArray<HTMLElement>('.service-item').forEach((item) => {
                gsap.fromTo(item,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 85%',
                        }
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="w-full py-32 relative z-10 bg-black text-white">
            <div className="container mx-auto px-6 md:px-20">
                <div className="mb-20">
                    <h2 className="text-xs font-bold font-display tracking-[0.2em] text-accent mb-4">NUESTRA ESENCIA</h2>
                    <p className="text-4xl md:text-6xl font-light leading-tight max-w-4xl text-white/80">
                        No somos solo una agencia. <span className="text-white font-display">Somos tu brazo armado digital.</span>
                        Orquestamos tecnología, diseño y estrategia para construir imperios en la nube.
                    </p>
                </div>

                <div className="flex flex-col">
                    {/* Header Line */}
                    <div className="w-full h-[1px] bg-white/20 service-line mb-12"></div>

                    {services.map((service) => (
                        <div key={service.id} className="service-item group relative mb-12">
                            <div className="flex flex-col md:flex-row md:items-baseline gap-6 md:gap-20 py-8 hover-trigger cursor-none transition-colors duration-500 hover:bg-white/5 px-4 -mx-4 rounded-lg">
                                <span className="text-sm font-mono text-accent/60 group-hover:text-accent transition-colors">/{service.id}</span>

                                <div className="flex-1">
                                    <h3 className="text-3xl md:text-5xl font-display font-bold mb-4 group-hover:text-accent transition-colors duration-300">
                                        {service.title}
                                    </h3>
                                    <p className="text-lg md:text-xl font-light text-gray-400 max-w-2xl group-hover:text-white transition-colors duration-300">
                                        {service.description}
                                    </p>
                                </div>

                                <div className="md:self-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-10 group-hover:translate-x-0 transform">
                                    <span className="text-4xl text-accent">→</span>
                                </div>
                            </div>

                            {/* Separator Line */}
                            <div className="w-full h-[1px] bg-white/10 service-line"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
