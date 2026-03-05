import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Desarrollo de Apps y Software a Medida en Chile | HojaCero",
    description:
        "Desarrollo de aplicaciones web, software a medida y sistemas complejos en Santiago de Chile. Desde apps de logística hasta SaaS y plataformas completas. Stack moderno: Next.js, React, TypeScript, Supabase. Portafolio con 8+ productos activos.",
    keywords: [
        "desarrollo apps Chile",
        "software a medida Santiago",
        "crear aplicación web Chile",
        "desarrollo software Chile",
        "app a medida",
        "sistema de gestión Chile",
        "SaaS Chile",
        "desarrollo web apps",
        "programación a medida Santiago",
        "empresa desarrollo software Chile",
    ],
    alternates: {
        canonical: "https://hojacero.cl/servicios/desarrollo-apps",
    },
    openGraph: {
        title: "Desarrollo de Apps y Software a Medida | HojaCero",
        description:
            "Apps, SaaS y sistemas complejos en Chile. 8+ productos activos. Stack moderno: Next.js, React, Supabase.",
        url: "https://hojacero.cl/servicios/desarrollo-apps",
        type: "website",
        locale: "es_CL",
        siteName: "HojaCero",
    },
};

const faqs = [
    {
        question: "¿Qué tipo de aplicaciones desarrollan?",
        answer:
            "Desarrollamos aplicaciones web progresivas (PWA), sistemas de gestión empresarial, plataformas SaaS, e-commerce con inventario, sistemas de logística con tracking en tiempo real, y soluciones de software a medida. Ejemplos reales: Acargoo (logística), Vuelve+ (fidelización con Google Wallet), PlusContable (SaaS contable), IceBuin (catálogos inteligentes).",
    },
    {
        question: "¿Cuánto cuesta desarrollar una app a medida?",
        answer:
            "Depende de la complejidad. Una app web básica de gestión puede partir desde $500.000 CLP. Sistemas más complejos como logística con mapas o SaaS con múltiples módulos se cotizan según alcance. Te damos presupuesto transparente y detallado en la primera conversación.",
    },
    {
        question: "¿Qué tecnologías usan?",
        answer:
            "Trabajamos con Next.js, React, TypeScript, Node.js y Supabase como stack principal. Para mapas usamos Mapbox, para pagos Stripe. Todo código es moderno, mantenible y escalable. No usamos WordPress ni frameworks limitados.",
    },
    {
        question: "¿Cuánto demora desarrollar una app?",
        answer:
            "Un MVP funcional puede estar listo en 2-4 semanas. Sistemas más complejos requieren 4-8 semanas dependiendo del alcance. Nuestro proceso acelerado con IA nos permite entregar en semanas lo que tradicionalmente toma meses, sin comprometer calidad.",
    },
    {
        question: "¿Puedo ver ejemplos reales de apps que han construido?",
        answer:
            "Sí. Acargoo.cl es un sistema de logística con cotización automática y tracking en mapa. Vuelve.vip es un motor de fidelización con tarjetas para Google Wallet. PlusContable.cl es un SaaS de contabilidad con 50+ funciones. Superpanel.lat es un sistema de gestión de clientes. Todos están en producción con usuarios reales.",
    },
];

const products = [
    {
        name: "Acargoo",
        type: "Sistema de Logística",
        description:
            "Cotización automática de envíos, panel de administración y tracking en tiempo real con vista de mapa.",
        url: "https://acargoo.cl",
        tech: ["Next.js", "Mapbox", "Supabase"],
    },
    {
        name: "Vuelve+",
        type: "Motor de Fidelización",
        description:
            "Programa de puntos con tarjetas digitales para Google Wallet y panel de administración para comercios.",
        url: "https://vuelve.vip",
        tech: ["React", "Google Wallet API", "Supabase"],
    },
    {
        name: "PlusContable",
        type: "SaaS Contable",
        description:
            "Software de contabilidad con 50+ funciones para contadores independientes. Usuarios activos en producción.",
        url: "https://pluscontable.cl",
        tech: ["Next.js", "TypeScript", "Supabase"],
    },
    {
        name: "IceBuin",
        type: "Catálogo Inteligente",
        description:
            "Sistema de catálogos digitales con gestión desde Excel y actualización automática de productos.",
        url: "https://icebuin.cl",
        tech: ["React", "Excel API", "Supabase"],
    },
];

export default function DesarrolloAppsPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "@id": "https://hojacero.cl/servicios/desarrollo-apps#service",
                name: "Desarrollo de Aplicaciones y Software a Medida en Chile",
                description:
                    "Servicio de desarrollo de aplicaciones web, SaaS y sistemas complejos en Santiago de Chile. Stack moderno con Next.js, React, TypeScript y Supabase.",
                provider: { "@id": "https://hojacero.cl/#organization" },
                areaServed: { "@type": "Country", name: "Chile" },
                serviceType: "Desarrollo de Software",
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "HojaCero", item: "https://hojacero.cl" },
                    { "@type": "ListItem", position: 2, name: "Servicios", item: "https://hojacero.cl/servicios" },
                    { "@type": "ListItem", position: 3, name: "Desarrollo de Apps", item: "https://hojacero.cl/servicios/desarrollo-apps" },
                ],
            },
            {
                "@type": "FAQPage",
                mainEntity: faqs.map((faq) => ({
                    "@type": "Question",
                    name: faq.question,
                    acceptedAnswer: { "@type": "Answer", text: faq.answer },
                })),
            },
        ],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* ═══════════════ HERO ═══════════════ */}
            <section className="relative min-h-[90vh] flex items-center bg-black overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/20 via-[#00f0ff]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
                            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                            <span className="text-xs text-zinc-400">8+ productos activos en producción</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-[1.1] mb-6">
                            Desarrollo de
                            <br />
                            <span className="text-[#00f0ff]">Apps y Software</span>
                            <br />
                            a Medida
                        </h1>
                        <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mb-4 leading-relaxed">
                            Desde sistemas de logística hasta plataformas SaaS completas. Construimos software real con usuarios reales, no prototipos que se quedan en el cajón.
                        </p>
                        <p className="text-sm text-zinc-500 mb-10">Next.js · React · TypeScript · Supabase · Mapbox</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="https://wa.me/56958946617?text=Hola!%20Necesito%20desarrollar%20una%20aplicación%20o%20sistema" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                                Conversemos tu proyecto
                            </a>
                            <a href="#productos" className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-medium px-8 py-4 rounded-2xl transition-all duration-300 hover:bg-white/5">
                                Ver productos reales ↓
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════ PROCESO ═══════════════ */}
            <section className="py-20 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">Cómo trabajamos</p>
                    <h2 className="text-3xl sm:text-4xl font-display font-bold mb-16">De la idea al producto en semanas, no meses</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: "01", title: "Conversación", description: "Nos cuentas qué necesitas por WhatsApp. Entendemos tu problema antes de proponer soluciones." },
                            { step: "02", title: "Arquitectura", description: "Diseñamos la estructura técnica y te mostramos el plan. Sin jerga, sin humo — solo claridad." },
                            { step: "03", title: "Construcción", description: "Desarrollamos por etapas con entregas visibles. Ves tu producto crecer cada semana." },
                            { step: "04", title: "Lanzamiento", description: "Deploy a producción con todo listo: dominio, SSL, y producto funcionando con usuarios reales." },
                        ].map((item, i) => (
                            <div key={i} className="relative p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                                <span className="text-5xl font-display font-bold text-white/5 absolute top-4 right-4">{item.step}</span>
                                <h3 className="text-lg font-bold mb-3 mt-8">{item.title}</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ PRODUCTOS REALES ═══════════════ */}
            <section id="productos" className="py-20 bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">Productos en producción</p>
                    <h2 className="text-3xl sm:text-4xl font-display font-bold mb-16">Software real, con usuarios reales</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {products.map((product, i) => (
                            <a key={i} href={product.url} target="_blank" rel="noopener noreferrer" className="group p-8 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#00f0ff]/30 transition-all duration-500">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <span className="text-[10px] uppercase tracking-widest text-[#00f0ff]">{product.type}</span>
                                        <h3 className="text-2xl font-bold">{product.name}</h3>
                                    </div>
                                    <span className="text-zinc-600 group-hover:text-[#00f0ff] transition-colors">→</span>
                                </div>
                                <p className="text-sm text-zinc-400 leading-relaxed mb-6">{product.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {product.tech.map((t, j) => (
                                        <span key={j} className="text-[10px] px-2 py-1 bg-white/5 rounded-full text-zinc-500">{t}</span>
                                    ))}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ POR QUÉ NOSOTROS ═══════════════ */}
            <section className="py-20 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl sm:text-4xl font-display font-bold mb-16">¿Por qué elegirnos?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: "⚡", title: "Velocidad real", description: "Entregamos MVPs en semanas, no meses. IA como herramienta de aceleración + supervisión técnica humana." },
                            { icon: "💰", title: "Precios justos", description: "Sin oficinas lujosas ni equipos inflados. Estudio lean que pasa el ahorro al cliente." },
                            { icon: "🔧", title: "Stack moderno", description: "Next.js, React, TypeScript, Supabase. Nada de WordPress ni tecnología obsoleta." },
                            { icon: "📱", title: "8+ productos activos", description: "No somos teóricos. Tenemos apps reales en producción con usuarios de verdad." },
                            { icon: "🤖", title: "IA como herramienta", description: "Usamos IA para acelerar, no para reemplazar el criterio humano. Cada línea se revisa." },
                            { icon: "🇨🇱", title: "100% Chile", description: "Entendemos el mercado chileno, los pagos locales y las necesidades reales de pymes." },
                        ].map((item, i) => (
                            <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                                <span className="text-3xl mb-3 block">{item.icon}</span>
                                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ FAQ ═══════════════ */}
            <section className="py-20 bg-black">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl sm:text-4xl font-display font-bold mb-12">Preguntas frecuentes</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <details key={i} className="group bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
                                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/[0.03] transition-colors">
                                    <h3 className="text-sm sm:text-base font-semibold pr-4">{faq.question}</h3>
                                    <svg className="w-5 h-5 text-zinc-500 shrink-0 group-open:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </summary>
                                <div className="px-6 pb-6"><p className="text-sm text-zinc-400 leading-relaxed">{faq.answer}</p></div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ CTA FINAL ═══════════════ */}
            <section className="py-24 bg-zinc-950">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-5xl font-display font-bold mb-6">¿Tienes una idea?<br /><span className="text-[#00f0ff]">Hagámosla realidad</span></h2>
                    <p className="text-zinc-400 text-lg mb-10">Cuéntanos tu proyecto y te decimos cómo lo haríamos, cuánto cuesta y cuánto demora. Sin compromiso.</p>
                    <a href="https://wa.me/56958946617?text=Hola!%20Tengo%20un%20proyecto%20de%20software%20y%20quiero%20conversarlo" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-lg px-10 py-5 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                        Conversemos tu proyecto
                    </a>
                </div>
            </section>
            <div className="h-16 md:hidden" />
        </>
    );
}
