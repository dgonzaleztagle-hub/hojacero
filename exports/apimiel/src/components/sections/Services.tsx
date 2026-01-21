'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Data structure updated with "Boutique Tech" approach
const services = [
    {
        id: '01',
        title: 'DISEÑO & DESARROLLO',
        subtitle: 'Ingeniería Boutique',
        description: 'Código que se siente como arte. Sitios rápidos, finos y robustos.',
        stack: ['Next.js', 'React', 'Tailwind', 'Framer Motion'],
        features: [
            'Experiencia en sistemas complejos (SaaS, ERPs)',
            'UI de galería de arte, lógica de empresa',
            'Performance extremo y animaciones fluidas'
        ],
        action: 'Quiero un sitio premium'
    },
    {
        id: '02',
        title: 'INFRAESTRUCTURA CLOUD',
        subtitle: 'Tu castillo en la nube',
        description: 'Duerme tranquilo. Tu negocio escala seguro y sin caídas.',
        stack: ['Supabase', 'Vercel', 'PostgreSQL', 'Edge Network'],
        features: [
            'Bases de datos reales, no juguetes',
            'Escalamiento automático global',
            'Seguridad y Auth de nivel empresarial'
        ],
        action: 'Asegurar mi infraestructura'
    },
    {
        id: '03',
        title: 'ESTRATEGIA DIGITAL',
        subtitle: 'Visibilidad Real',
        description: 'Que Google te ame. Que tus clientes te encuentren.',
        stack: ['Technical SEO', 'Google Analytics 4', 'Core Web Vitals'],
        features: [
            'Optimizamos para humanos y algoritmos',
            'Estructura que rankea (SEO Técnico)',
            'Métricas que importan, no vanidad'
        ],
        action: 'Mejorar mi ranking'
    },
    {
        id: '04',
        title: 'TRANSFORMACIÓN AI',
        subtitle: 'Automatización Inteligente',
        description: 'Ponemos a trabajar a los robots para ti. Menos rutina, más estrategia.',
        stack: ['LLM Integration', 'Automation', 'Custom Agents'],
        features: [
            'Automatizamos procesos manuales',
            'Integración práctica de AI (sin humo)',
            'Chatbots y Asistentes que sí resuelven'
        ],
        action: 'Automatizar mi negocio'
    }
];

export default function Services() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const handleToggle = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleScrollToCta = () => {
        const cta = document.getElementById('cta');
        if (cta) cta.scrollIntoView({ behavior: 'smooth' });
    };

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

            // Animate text elements initial fade in
            gsap.utils.toArray<HTMLElement>('.service-item-trigger').forEach((item) => {
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
                    <p className="text-3xl md:text-5xl font-light leading-tight max-w-4xl text-white/80">
                        No somos solo una agencia. <span className="text-white font-display">Somos artesanos digitales.</span>
                        <br />
                        <span className="text-2xl md:text-3xl text-gray-500 mt-4 block">
                            Fusionamos arte visual con sistemas complejos.
                        </span>
                    </p>
                </div>

                <div className="flex flex-col">
                    {/* Header Line */}
                    <div className="w-full h-[1px] bg-white/20 service-line mb-12"></div>

                    {services.map((service) => {
                        const isExpanded = expandedId === service.id;

                        return (
                            <div key={service.id} className="group relative mb-12">
                                {/* Clickable Header */}
                                <div
                                    onClick={() => handleToggle(service.id)}
                                    className="service-item-trigger flex flex-col md:flex-row md:items-baseline gap-6 md:gap-20 py-8 cursor-pointer transition-colors duration-500 hover:bg-white/5 px-4 -mx-4 rounded-lg"
                                >
                                    <span className={`text-sm font-mono transition-colors ${isExpanded ? 'text-accent' : 'text-accent/60 group-hover:text-accent'}`}>
                                        /{service.id}
                                    </span>

                                    <div className="flex-1">
                                        <h3 className={`text-3xl md:text-5xl font-display font-bold mb-2 transition-colors duration-300 ${isExpanded ? 'text-accent' : 'group-hover:text-accent'}`}>
                                            {service.title}
                                        </h3>
                                        <p className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-4">
                                            {service.subtitle}
                                        </p>
                                        <p className="text-lg md:text-xl font-light text-gray-400 max-w-2xl group-hover:text-white transition-colors duration-300">
                                            {service.description}
                                        </p>
                                    </div>

                                    {/* Arrow / Chevron */}
                                    <div className={`md:self-center transition-all duration-300 transform ${isExpanded ? 'rotate-90 opacity-100 text-accent' : 'opacity-0 group-hover:opacity-100 -translate-x-10 group-hover:translate-x-0'}`}>
                                        <span className="text-4xl">→</span>
                                    </div>
                                </div>

                                {/* Expanded Content (Accordion) */}
                                <div
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <div className="px-4 -mx-4 pb-8">
                                        <div className="pt-6 border-t border-white/10 mt-2 grid grid-cols-1 md:grid-cols-2 gap-8 pl-0 md:pl-[6.5rem]">
                                            {/* Tech Stack */}
                                            <div>
                                                <h4 className="text-xs font-mono text-accent mb-4 tracking-widest">NUESTRO STACK</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {service.stack.map(tech => (
                                                        <span key={tech} className="px-3 py-1 border border-white/20 rounded-full text-xs text-gray-300 hover:border-accent hover:text-accent transition-colors cursor-default">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Capabilities & Action */}
                                            <div>
                                                <h4 className="text-xs font-mono text-accent mb-4 tracking-widest">REALIDAD</h4>
                                                <ul className="text-sm text-gray-400 space-y-2 mb-6">
                                                    {service.features.map((f, i) => (
                                                        <li key={i} className="flex items-start">
                                                            <span className="text-accent mr-2">+</span>
                                                            {f}
                                                        </li>
                                                    ))}
                                                </ul>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleScrollToCta();
                                                    }}
                                                    className="text-sm font-bold uppercase tracking-widest border-b border-white hover:border-accent hover:text-accent transition-colors pb-1"
                                                >
                                                    {service.action} →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Separator Line */}
                                <div className="w-full h-[1px] bg-white/10 service-line"></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
