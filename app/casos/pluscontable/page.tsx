import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Caso PlusContable: SaaS de Contabilidad con 50+ Funciones | HojaCero",
    description:
        "Cómo construimos PlusContable, un software de contabilidad SaaS con más de 50 funciones para contadores independientes en Chile. Plataforma completa con gestión de clientes, libros contables, declaraciones y reportes automáticos.",
    keywords: ["software contable Chile", "SaaS contabilidad", "sistema contable online", "software para contadores", "PlusContable", "caso estudio desarrollo software"],
    alternates: { canonical: "https://hojacero.cl/casos/pluscontable" },
    openGraph: {
        title: "Caso PlusContable: SaaS Contable con 50+ Funciones | HojaCero",
        description: "Software de contabilidad SaaS para contadores independientes en Chile. 50+ funciones.",
        url: "https://hojacero.cl/casos/pluscontable", type: "article", locale: "es_CL", siteName: "HojaCero",
    },
};

const metrics = [
    { value: "50+", label: "Funciones" },
    { value: "SaaS", label: "Modelo de negocio" },
    { value: "Multi-tenant", label: "Arquitectura" },
    { value: "Live", label: "Usuarios activos" },
];

const features = [
    { title: "Gestión de clientes", description: "Cada contador gestiona múltiples empresas desde un solo panel. Datos tributarios, contactos y documentación organizada por cliente." },
    { title: "Libros contables digitales", description: "Libro Mayor, Diario, Balance y Estado de Resultados generados automáticamente. Cálculos en tiempo real con cada movimiento." },
    { title: "Declaraciones automatizadas", description: "Preparación automática de F29 y otras declaraciones tributarias. El contador revisa y aprueba, el sistema calcula." },
    { title: "Reportes exportables", description: "Generación de reportes en PDF y Excel listos para el SII o para el cliente. Formato profesional sin diseño manual." },
];

export default function PlusContablePage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article",
                headline: "Caso PlusContable: SaaS de Contabilidad con 50+ Funciones",
                description: "Cómo construimos un software de contabilidad SaaS completo para contadores independientes en Chile.",
                author: { "@type": "Person", name: "Daniel González", url: "https://hojacero.cl" },
                publisher: { "@id": "https://hojacero.cl/#organization" },
                datePublished: "2025-03-01", dateModified: "2026-03-01",
                mainEntityOfPage: "https://hojacero.cl/casos/pluscontable",
            },
            {
                "@type": "SoftwareApplication", name: "PlusContable", applicationCategory: "BusinessApplication",
                operatingSystem: "Web", url: "https://pluscontable.cl",
                description: "Software de contabilidad SaaS con 50+ funciones para contadores independientes.",
                creator: { "@id": "https://hojacero.cl/#organization" },
            },
            {
                "@type": "BreadcrumbList", itemListElement: [
                    { "@type": "ListItem", position: 1, name: "HojaCero", item: "https://hojacero.cl" },
                    { "@type": "ListItem", position: 2, name: "Casos", item: "https://hojacero.cl/casos" },
                    { "@type": "ListItem", position: 3, name: "PlusContable", item: "https://hojacero.cl/casos/pluscontable" },
                ]
            },
        ],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* HERO */}
            <section className="relative min-h-[80vh] flex items-center bg-black overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 w-full">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
                        <span className="text-[10px] uppercase tracking-widest text-[#00f0ff]">Caso de estudio</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] mb-6">PlusContable</h1>
                    <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed mb-4">Software de contabilidad SaaS con más de 50 funciones para contadores independientes. Gestión de clientes, libros contables, declaraciones y reportes automáticos.</p>
                    <div className="flex items-center gap-4 mb-10">
                        <a href="https://pluscontable.cl" target="_blank" rel="noopener noreferrer" className="text-sm text-[#00f0ff] hover:underline">pluscontable.cl →</a>
                        <span className="text-zinc-600">|</span>
                        <span className="text-sm text-zinc-500">SaaS Contable · Chile</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {metrics.map((m, i) => (
                            <div key={i} className="text-center p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                                <div className="text-2xl font-display font-bold text-[#00f0ff]">{m.value}</div>
                                <div className="text-xs text-zinc-500 mt-1">{m.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DESAFÍO */}
            <section className="py-20 bg-zinc-950">
                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">El desafío</p>
                    <h2 className="text-3xl font-display font-bold mb-8">Contadores ahogados en Excel</h2>
                    <p className="text-zinc-400 leading-relaxed text-lg mb-6">Los contadores independientes en Chile manejan múltiples empresas con Excel, papeles y sistemas obsoletos que cuestan una fortuna. No existe una herramienta moderna, accesible y hecha para el mercado chileno que cubra todo lo que necesitan.</p>
                    <p className="text-zinc-400 leading-relaxed">PlusContable nació para resolver exactamente eso: un software moderno, rápido y específico para la realidad tributaria chilena, diseñado para contadores que quieren trabajar más rápido y con menos errores.</p>
                </div>
            </section>

            {/* SOLUCIÓN */}
            <section className="py-20 bg-black">
                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#00f0ff] mb-4">La solución</p>
                    <h2 className="text-3xl font-display font-bold mb-12">50+ funciones en una sola plataforma</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((f, i) => (
                            <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-emerald-500/20 transition-all duration-500">
                                <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ARQUITECTURA */}
            <section className="py-20 bg-zinc-950">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl font-display font-bold mb-12">Arquitectura multi-tenant</h2>
                    <p className="text-zinc-400 leading-relaxed mb-8">PlusContable usa una arquitectura multi-tenant donde cada contador tiene su propio espacio aislado. Los datos de cada empresa están completamente separados a nivel de base de datos, garantizando seguridad y privacidad.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {[
                            { name: "Next.js", role: "Frontend y API routes" },
                            { name: "Supabase", role: "DB + Auth + RLS" },
                            { name: "TypeScript", role: "Type safety estricto" },
                            { name: "Row Level Security", role: "Aislamiento de datos" },
                            { name: "PDF Generation", role: "Reportes automáticos" },
                            { name: "Vercel", role: "Deploy y CDN" },
                        ].map((t, i) => (
                            <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                                <div className="text-sm font-bold text-[#00f0ff]">{t.name}</div>
                                <div className="text-xs text-zinc-500 mt-1">{t.role}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-black">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6">¿Necesitas un<br /><span className="text-[#00f0ff]">sistema SaaS</span>?</h2>
                    <p className="text-zinc-400 text-lg mb-10">Construimos plataformas SaaS completas a medida. Desde la arquitectura hasta el deploy. Cuéntanos tu idea.</p>
                    <a href="https://wa.me/56958946617?text=Hola!%20Vi%20el%20caso%20de%20PlusContable%20y%20quiero%20construir%20un%20SaaS" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-lg px-10 py-5 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                        Conversemos tu SaaS
                    </a>
                    <div className="mt-8"><Link href="/servicios/desarrollo-apps" className="text-sm text-zinc-500 hover:text-white transition-colors">Ver servicio de desarrollo →</Link></div>
                </div>
            </section>
            <div className="h-16 md:hidden" />
        </>
    );
}
