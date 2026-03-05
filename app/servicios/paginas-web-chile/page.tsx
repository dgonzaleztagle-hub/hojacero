import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

// ============================================================================
// LANDING PAGE SATÉLITE: Páginas Web en Chile
// Keywords: "página web Chile", "diseño web barato", "landing page Santiago"
// SSR PURO — Google ve todo el HTML
// CTA → WhatsApp HojaCero: +56958946617
// ============================================================================

export const metadata: Metadata = {
    title: "Páginas Web Profesionales en Chile desde $50.000 | HojaCero",
    description:
        "Diseño web profesional en Santiago de Chile a precios reales. Landing pages desde $50.000 CLP, sitios premium desde $150.000 CLP. Entrega en 24-72 horas. Sin plantillas, sin mensualidades. Código a medida con Next.js y diseño nivel agencia internacional.",
    keywords: [
        "página web Chile",
        "diseño web Santiago",
        "landing page barata Chile",
        "cuánto cuesta página web Chile",
        "agencia diseño web Chile",
        "página web para pyme",
        "web para emprendedores Chile",
        "diseño web profesional Chile",
        "página web barata Santiago",
        "crear página web Chile",
    ],
    alternates: {
        canonical: "https://hojacero.cl/servicios/paginas-web-chile",
    },
    openGraph: {
        title: "Páginas Web Profesionales desde $50.000 | HojaCero",
        description:
            "Landing pages y sitios web a medida en Chile. Sin plantillas, sin mensualidades. Entrega en 24-72 horas.",
        url: "https://hojacero.cl/servicios/paginas-web-chile",
        type: "website",
        locale: "es_CL",
        siteName: "HojaCero",
    },
};

// FAQ data para schema y renderizado
const faqs = [
    {
        question: "¿Cuánto cuesta una página web en Chile?",
        answer:
            "En HojaCero, una landing page profesional cuesta $50.000 CLP (pago único). Incluye diseño responsive, formulario de contacto, botón de WhatsApp, certificado SSL y entrega en 24-48 horas. Para sitios premium con animaciones y SEO, el plan Express es de $150.000 CLP.",
    },
    {
        question: "¿Cuánto demora hacer una página web?",
        answer:
            "Una landing page simple se entrega en 24-48 horas. Un sitio premium con animaciones y SEO se entrega en 48-72 horas. Para proyectos más complejos, los tiempos se definen según el alcance, pero nuestro proceso acelerado con IA nos permite entregar en semanas lo que otras agencias entregan en meses.",
    },
    {
        question: "¿Usan WordPress o plantillas?",
        answer:
            "No. Todos nuestros sitios son código 100% a medida con Next.js, React y tecnología moderna. No usamos WordPress, Wix ni plantillas prediseñadas. Esto significa que tu sitio carga más rápido, es más seguro y no depende de actualizaciones de terceros.",
    },
    {
        question: "¿Hay costos mensuales o mensualidades?",
        answer:
            "No hay mensualidades obligatorias. Nuestros planes son pagos únicos. El hosting en Vercel tiene plan gratuito que funciona perfecto para la mayoría de negocios. Solo pagas si necesitas funcionalidades extra o mantenimiento mensual.",
    },
    {
        question: "¿Qué incluye el diseño web de HojaCero?",
        answer:
            "Todos nuestros sitios incluyen: diseño responsive (celular + computador), formulario de contacto funcional, botón de WhatsApp directo, certificado SSL, optimización de velocidad, y código limpio listo para SEO. Los planes Express agregan animaciones profesionales, SEO técnico completo y diseño nivel agencia premium.",
    },
    {
        question: "¿Puedo ver ejemplos de sitios que han hecho?",
        answer:
            "Claro. Algunos ejemplos reales: caprex.cl (consultoría), reparapads.cl (reparaciones), apimiel.cl (apicultura), acargoo.cl (logística). Todos con diseño premium, código a medida y rendimiento optimizado. Visita nuestro portafolio completo en hojacero.cl.",
    },
];

// Portafolio mini
const portfolio = [
    {
        name: "Caprex",
        description: "Consultoría en gestión de agua",
        url: "https://caprex.cl",
        tag: "Sitio Premium",
    },
    {
        name: "Apimiel",
        description: "Marca de miel y apicultura",
        url: "https://apimiel.cl",
        tag: "E-commerce",
    },
    {
        name: "ReparPads",
        description: "Servicio de reparaciones",
        url: "https://reparpads.cl",
        tag: "Landing Pro",
    },
];

export default function PaginasWebChilePage() {
    // JSON-LD Schema
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "@id": "https://hojacero.cl/servicios/paginas-web-chile#service",
                name: "Diseño y Desarrollo de Páginas Web en Chile",
                description:
                    "Servicio de diseño web profesional en Santiago de Chile. Landing pages desde $50.000 CLP y sitios premium desde $150.000 CLP. Código a medida con Next.js, sin plantillas.",
                provider: { "@id": "https://hojacero.cl/#organization" },
                areaServed: { "@type": "Country", name: "Chile" },
                serviceType: "Diseño Web",
                hasOfferCatalog: {
                    "@type": "OfferCatalog",
                    name: "Planes de Páginas Web",
                    itemListElement: [
                        {
                            "@type": "Offer",
                            name: "Starter — Landing de Conversión",
                            description:
                                "Landing page profesional con diseño responsive, formulario de contacto, WhatsApp directo, SSL incluido. Entrega en 24-48 horas.",
                            price: "50000",
                            priceCurrency: "CLP",
                        },
                        {
                            "@type": "Offer",
                            name: "Express — Sitio Premium con SEO",
                            description:
                                "Sitio web premium con animaciones, SEO técnico completo, diseño nivel agencia internacional. Entrega en 48-72 horas.",
                            price: "150000",
                            priceCurrency: "CLP",
                        },
                    ],
                },
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "HojaCero",
                        item: "https://hojacero.cl",
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: "Servicios",
                        item: "https://hojacero.cl/servicios",
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: "Páginas Web Chile",
                        item: "https://hojacero.cl/servicios/paginas-web-chile",
                    },
                ],
            },
            {
                "@type": "FAQPage",
                mainEntity: faqs.map((faq) => ({
                    "@type": "Question",
                    name: faq.question,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: faq.answer,
                    },
                })),
            },
        ],
    };

    return (
        <>
            {/* Schema JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* ═══════════════ HERO ═══════════════ */}
            <section className="relative min-h-[90vh] flex items-center bg-black overflow-hidden">
                {/* Gradient Orb */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#00f0ff]/20 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
                    <div className="max-w-3xl">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
                            <span className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse" />
                            <span className="text-xs text-zinc-400">
                                Respuesta en menos de 5 minutos
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-[1.1] mb-6">
                            Páginas Web
                            <br />
                            <span className="text-[#00f0ff]">Profesionales</span>
                            <br />
                            en Chile
                        </h1>

                        <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mb-4 leading-relaxed">
                            Desde{" "}
                            <span className="text-white font-semibold">$50.000 CLP</span>.
                            Sin plantillas, sin mensualidades, sin letra chica. Código a
                            medida con diseño nivel agencia internacional.
                        </p>

                        <p className="text-sm text-zinc-500 mb-10">
                            Entrega en 24-72 horas · Diseño 100% responsive · SSL incluido
                        </p>

                        {/* CTA Primario */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="https://wa.me/56958946617?text=Hola!%20Me%20interesa%20una%20página%20web%20profesional"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                </svg>
                                Quiero mi página web
                            </a>
                            <a
                                href="#precios"
                                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-medium px-8 py-4 rounded-2xl transition-all duration-300 hover:bg-white/5"
                            >
                                Ver precios ↓
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════ DOLOR ═══════════════ */}
            <section className="py-20 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">
                        El problema
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-display font-bold mb-16">
                        ¿Te suena familiar?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: "💸",
                                title: "Precios inflados",
                                description:
                                    "Agencias que cobran $500.000+ por una página que debería costar una fracción. Te venden humo, reuniones interminables y cotizaciones que tardan una semana.",
                            },
                            {
                                icon: "🐌",
                                title: "Tiempos eternos",
                                description:
                                    'Te dicen "4-6 semanas" para una landing page simple. Luego son 2 meses. Mientras tanto, tu negocio sigue sin presencia digital y pierdes clientes.',
                            },
                            {
                                icon: "🔒",
                                title: "Dependencia total",
                                description:
                                    "WordPress con 30 plugins, hosting caro, plantillas que se rompen con cada actualización. No puedes cambiar un texto sin llamar al diseñador.",
                            },
                        ].map((pain, i) => (
                            <div
                                key={i}
                                className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-all duration-300"
                            >
                                <span className="text-4xl mb-4 block">{pain.icon}</span>
                                <h3 className="text-xl font-bold mb-3">{pain.title}</h3>
                                <p className="text-zinc-400 leading-relaxed text-sm">
                                    {pain.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ SOLUCIÓN ═══════════════ */}
            <section className="py-20 bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#00f0ff] mb-4">
                        Nuestra solución
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6">
                        ¿Por qué HojaCero es diferente?
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mb-16 text-lg">
                        Somos un estudio de ingeniería digital, no una agencia de marketing.
                        Construimos desde cero con código limpio, sin plantillas y sin
                        intermediarios.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                metric: "24-72h",
                                label: "Tiempo de entrega",
                                detail: "No semanas. Horas.",
                            },
                            {
                                metric: "$50K",
                                label: "Precio inicial",
                                detail: "Pago único, sin mensualidades",
                            },
                            {
                                metric: "100%",
                                label: "Código a medida",
                                detail: "Next.js, React, cero plantillas",
                            },
                            {
                                metric: "8+",
                                label: "Productos activos",
                                detail: "Portafolio real y verificable",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="text-center p-8 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5"
                            >
                                <div className="text-4xl font-display font-bold text-[#00f0ff] mb-2">
                                    {item.metric}
                                </div>
                                <div className="text-sm font-semibold text-white mb-1">
                                    {item.label}
                                </div>
                                <div className="text-xs text-zinc-500">{item.detail}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ PRECIOS ═══════════════ */}
            <section id="precios" className="py-20 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">
                        Precios reales
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-display font-bold mb-16">
                        Sin letra chica, sin sorpresas
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Plan Starter */}
                        <div className="relative p-8 bg-white/[0.02] border border-white/10 rounded-2xl hover:border-[#00f0ff]/30 transition-all duration-500 group">
                            <div className="text-xs uppercase tracking-widest text-zinc-500 mb-4">
                                Starter
                            </div>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-5xl font-display font-bold">
                                    $50.000
                                </span>
                                <span className="text-zinc-500 text-sm">CLP</span>
                            </div>
                            <p className="text-xs text-zinc-500 mb-8">
                                Pago único · Sin mensualidades
                            </p>
                            <ul className="space-y-3 mb-10">
                                {[
                                    "Diseño one-page responsive",
                                    "Formulario de contacto",
                                    "Botón WhatsApp directo",
                                    "Certificado SSL incluido",
                                    "Entrega en 24-48 horas",
                                ].map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-3 text-sm text-zinc-300"
                                    >
                                        <svg
                                            className="w-4 h-4 text-[#00f0ff] shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="https://wa.me/56958946617?text=Hola!%20Me%20interesa%20el%20plan%20Starter%20de%20$50.000"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center py-3.5 border border-white/20 rounded-xl text-sm font-semibold hover:bg-white hover:text-black transition-all duration-300"
                            >
                                Elegir Starter →
                            </a>
                        </div>

                        {/* Plan Express — Destacado */}
                        <div className="relative p-8 bg-gradient-to-b from-[#00f0ff]/10 to-transparent border-2 border-[#00f0ff]/30 rounded-2xl scale-[1.02] shadow-2xl shadow-cyan-500/5">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00f0ff] text-black text-xs font-bold px-4 py-1 rounded-full">
                                MÁS POPULAR
                            </div>
                            <div className="text-xs uppercase tracking-widest text-[#00f0ff] mb-4">
                                Express
                            </div>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-5xl font-display font-bold">
                                    $150.000
                                </span>
                                <span className="text-zinc-500 text-sm">CLP</span>
                            </div>
                            <p className="text-xs text-zinc-500 mb-8">
                                Pago único · Sin mensualidades
                            </p>
                            <ul className="space-y-3 mb-10">
                                {[
                                    "Todo lo del plan Starter",
                                    "Diseño premium con animaciones",
                                    "SEO técnico completo",
                                    "Velocidad de carga optimizada",
                                    "Entrega en 48-72 horas",
                                    "Diseño nivel Awwwards",
                                ].map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-3 text-sm text-zinc-300"
                                    >
                                        <svg
                                            className="w-4 h-4 text-[#00f0ff] shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="https://wa.me/56958946617?text=Hola!%20Me%20interesa%20el%20plan%20Express%20de%20$150.000"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center py-3.5 bg-[#00f0ff] text-black rounded-xl text-sm font-bold hover:bg-[#00d4e0] transition-all duration-300"
                            >
                                Elegir Express →
                            </a>
                        </div>

                        {/* Plan Auditoría */}
                        <div className="relative p-8 bg-white/[0.02] border border-white/10 rounded-2xl hover:border-[#00f0ff]/30 transition-all duration-500">
                            <div className="text-xs uppercase tracking-widest text-zinc-500 mb-4">
                                Auditoría
                            </div>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-5xl font-display font-bold">
                                    $100.000
                                </span>
                                <span className="text-zinc-500 text-sm">CLP</span>
                            </div>
                            <p className="text-xs text-zinc-500 mb-8">
                                Ya tienes web y quieres mejorarla
                            </p>
                            <ul className="space-y-3 mb-10">
                                {[
                                    "Análisis de velocidad y SEO",
                                    "Auditoría de seguridad",
                                    "Análisis de competencia",
                                    "Reporte detallado PDF",
                                    "Reunión de 30 minutos",
                                ].map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-3 text-sm text-zinc-300"
                                    >
                                        <svg
                                            className="w-4 h-4 text-[#00f0ff] shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="https://wa.me/56958946617?text=Hola!%20Me%20interesa%20una%20auditoría%20web"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center py-3.5 border border-white/20 rounded-xl text-sm font-semibold hover:bg-white hover:text-black transition-all duration-300"
                            >
                                Pedir Auditoría →
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════ PORTAFOLIO MINI ═══════════════ */}
            <section className="py-20 bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">
                        Portafolio real
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-display font-bold mb-16">
                        Sitios que hemos construido
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {portfolio.map((project, i) => (
                            <a
                                key={i}
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative overflow-hidden rounded-2xl border border-white/5 hover:border-[#00f0ff]/30 transition-all duration-500"
                            >
                                <div className="aspect-video bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center">
                                    <span className="text-3xl font-display font-bold text-white/20 group-hover:text-white/40 transition-colors">
                                        {project.name}
                                    </span>
                                </div>
                                <div className="p-6 bg-zinc-950">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-lg">{project.name}</h3>
                                        <span className="text-[10px] uppercase tracking-widest text-[#00f0ff] bg-[#00f0ff]/10 px-2 py-1 rounded-full">
                                            {project.tag}
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-500">
                                        {project.description}
                                    </p>
                                    <p className="text-xs text-zinc-600 mt-2 group-hover:text-[#00f0ff] transition-colors">
                                        Ver sitio →
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            href="/"
                            className="text-sm text-zinc-500 hover:text-white transition-colors"
                        >
                            Ver portafolio completo en HojaCero.cl →
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════════ SOCIAL PROOF ═══════════════ */}
            <section className="py-20 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">
                        Respaldado por
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-display font-bold mb-16">
                        Lo que dicen nuestros clientes
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {[
                            {
                                quote:
                                    "Necesitábamos un sitio web rápido, profesional y que representara nuestra marca. HojaCero lo entregó en menos de 48 horas y el resultado superó nuestras expectativas.",
                                name: "Cliente Caprex",
                                role: "Consultoría en agua",
                            },
                            {
                                quote:
                                    "Pasamos de no tener presencia digital a tener un sitio que la gente nos felicita constantemente. Y lo mejor: sin pagar mensualidades ni estar amarrados a nadie.",
                                name: "Cliente ReparPads",
                                role: "Servicio de reparaciones",
                            },
                        ].map((testimonial, i) => (
                            <div
                                key={i}
                                className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl"
                            >
                                <svg
                                    className="w-8 h-8 text-[#00f0ff]/20 mb-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                </svg>
                                <p className="text-zinc-300 leading-relaxed mb-6 italic">
                                    &ldquo;{testimonial.quote}&rdquo;
                                </p>
                                <div>
                                    <p className="font-semibold text-sm">{testimonial.name}</p>
                                    <p className="text-xs text-zinc-500">{testimonial.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-8 mt-16">
                        {[
                            "8+ Productos Activos",
                            "Fundado en 2024",
                            "Santiago, Chile",
                            "Código A Medida",
                        ].map((badge, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 text-xs text-zinc-500"
                            >
                                <svg
                                    className="w-3 h-3 text-[#00f0ff]"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                {badge}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ FAQ ═══════════════ */}
            <section className="py-20 bg-black">
                <div className="max-w-3xl mx-auto px-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">
                        Preguntas frecuentes
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-display font-bold mb-12">
                        Todo lo que necesitas saber
                    </h2>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <details
                                key={i}
                                className="group bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden"
                            >
                                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/[0.03] transition-colors">
                                    <h3 className="text-sm sm:text-base font-semibold pr-4">
                                        {faq.question}
                                    </h3>
                                    <svg
                                        className="w-5 h-5 text-zinc-500 shrink-0 group-open:rotate-180 transition-transform duration-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </summary>
                                <div className="px-6 pb-6">
                                    <p className="text-sm text-zinc-400 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ CTA FINAL ═══════════════ */}
            <section className="py-24 bg-zinc-950">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-5xl font-display font-bold mb-6">
                        ¿Listo para tener
                        <br />
                        <span className="text-[#00f0ff]">tu página web</span>?
                    </h2>
                    <p className="text-zinc-400 text-lg mb-10">
                        Cuéntanos qué necesitas y te decimos en 5 minutos cuánto cuesta y
                        cuánto demora. Sin reuniones interminables ni cotizaciones que tardan
                        una semana.
                    </p>
                    <a
                        href="https://wa.me/56958946617?text=Hola!%20Quiero%20crear%20mi%20página%20web%20profesional"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-lg px-10 py-5 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        </svg>
                        Hablemos por WhatsApp
                    </a>
                    <p className="text-xs text-zinc-600 mt-4">
                        Respuesta promedio: menos de 5 minutos
                    </p>
                </div>
            </section>

            {/* Spacer para sticky CTA en móvil */}
            <div className="h-16 md:hidden" />
        </>
    );
}
