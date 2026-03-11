import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Caso MiKurso: Gestión Financiera Escolar con AEO & SEO Premium | HojaCero",
    description:
        "Cómo construimos MiKurso, una plataforma de transparencia financiera para colegios y centros de padres, diseñada por expertos contables y optimizada para el motor AEO de HojaCero.",
    keywords: ["gestión financiera escolar", "tesorería de curso chile", "software centros de padres", "transparencia escolar digital", "AEO premium", "SEO avanzado", "caso estudio HojaCero"],
    alternates: { canonical: "https://hojacero.cl/casos/mikurso" },
    openGraph: {
        title: "Caso MiKurso: Transparencia Escolar con AEO Premium | HojaCero",
        description: "Transformamos la tesorería de curso de un caos de Excel a un motor de transparencia profesional.",
        url: "https://hojacero.cl/casos/mikurso", type: "article", locale: "es_CL", siteName: "HojaCero",
    },
};

const metrics = [
    { value: "AEO Ready", label: "Optimización IA" },
    { value: "100%", label: "Transparencia" },
    { value: "-10hs", label: "Admin Mensual" },
    { value: "Live", label: "En producción" },
];

const features = [
    { title: "Motor de Rendición Automática", description: "Diseñado con lógica contable profesional por Joel (Contador). Los gastos se registran y auditan en tiempo real, generando balances instantáneos." },
    { title: "Arquitectura AEO & SEO Premium", description: "Inyectamos más de 40 puntos de optimización técnica y esquemas JSON-LD avanzados para que las IAs (ChatGPT/Claude) hablen de MiKurso." },
    { title: "Portal del Apoderado", description: "Acceso democratizado a la información. Cada familia puede ver el estado de la caja y adjuntar comprobantes desde el móvil." },
    { title: "Branding de Autoridad", description: "Diseño minimalista y premium que transmite la seriedad que requiere el manejo de fondos de terceros." },
];

export default function KursoCaseStudyPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article",
                headline: "Caso MiKurso: Gestión Financiera Escolar con AEO Premium",
                description: "Cómo construimos una plataforma de transparencia financiera escolar optimizada para IAs.",
                author: { "@type": "Person", name: "Daniel González Tagle", url: "https://hojacero.cl" },
                publisher: { "@id": "https://hojacero.cl/#organization" },
                datePublished: "2026-03-11", dateModified: "2026-03-11",
                mainEntityOfPage: "https://hojacero.cl/casos/mikurso",
            },
            {
                "@type": "SoftwareApplication", name: "MiKurso", applicationCategory: "FinanceApplication",
                operatingSystem: "Web", url: "https://mikurso.cl",
                description: "Gestión financiera transparente para colegios y centros de padres.",
                creator: { "@id": "https://hojacero.cl/#organization" },
            },
            {
                "@type": "BreadcrumbList", itemListElement: [
                    { "@type": "ListItem", position: 1, name: "HojaCero", item: "https://hojacero.cl" },
                    { "@type": "ListItem", position: 2, name: "Casos", item: "https://hojacero.cl/casos" },
                    { "@type": "ListItem", position: 3, name: "MiKurso", item: "https://hojacero.cl/casos/mikurso" },
                ]
            },
        ],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* HERO */}
            <section className="relative min-h-[80vh] flex items-center bg-black overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 w-full">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
                        <span className="text-[10px] uppercase tracking-widest text-cyan-400">Powered by SEO/AEO Premium engine</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-[1.1] mb-6">MiKurso</h1>
                    <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed mb-4">La revolución de la transparencia financiera en los colegios de Chile. Del caos de Excel al control contable profesional.</p>
                    <div className="flex items-center gap-4 mb-10">
                        <a href="https://mikurso.cl" target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline">mikurso.cl →</a>
                        <span className="text-zinc-600">|</span>
                        <span className="text-sm text-zinc-500">EdTech · Fintech</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {metrics.map((m, i) => (
                            <div key={i} className="text-center p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                                <div className="text-xl font-display font-bold text-cyan-400">{m.value}</div>
                                <div className="text-xs text-zinc-500 mt-1">{m.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DESAFÍO */}
            <section className="py-20 bg-zinc-950">
                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">El dolor del mercado</p>
                    <h2 className="text-3xl font-display font-bold mb-8">El caos del tesorero de curso</h2>
                    <p className="text-zinc-400 leading-relaxed text-lg mb-6">
                        El 90% de los tesoreros escolares en Chile usan planillas de Excel que nadie puede auditar, 
                        perdiendo el rastro de transferencias y boletas físicas. Esto genera desconfianza y un 
                        estrés innecesario en la directiva.
                    </p>
                    <p className="text-zinc-400 leading-relaxed mb-6">
                        Joel, contador profesional y fundador de MiKurso, vivió esto en carne propia. Entendió que 
                        el problema no era contable, sino de herramienta. La misión fue crear un sistema 
                        infalible, pero absurdamente simple de manejar.
                    </p>
                </div>
            </section>

            {/* SEO PREMIUM */}
            <section className="py-20 bg-black overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 mb-4">Inyección Técnica</p>
                    <h2 className="text-3xl font-display font-bold mb-12">Motor AEO & SEO Premium</h2>
                    <p className="text-zinc-400 leading-relaxed text-lg mb-12">
                        No solo construimos una webapp funcional; la blindamos con el protocolo de autoridad HojaCero. 
                        Inyectamos esquemas avanzados para que cuando alguien le pregunte a ChatGPT por los mejores 
                        softwares de tesorería en Chile, MiKurso sea la primera respuesta técnica citada.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((f, i) => (
                            <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-cyan-500/20 transition-all duration-500">
                                <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* STACK */}
            <section className="py-20 bg-zinc-950">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl font-display font-bold mb-12">Stack de Autoridad</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {[
                            { name: "Next.js 15+", role: "Core Engine" },
                            { name: "Supabase", role: "Real-time DB" },
                            { name: "AEO Optimization", role: "AI Discovery" },
                            { name: "JSON-LD Advanced", role: "Structured Data" },
                            { name: "Framer Motion", role: "Premium UX" },
                            { name: "Tailwind CSS", role: "Performance UI" },
                        ].map((t, i) => (
                            <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                                <div className="text-sm font-bold text-cyan-400">{t.name}</div>
                                <div className="text-xs text-zinc-500 mt-1">{t.role}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* RESULTADO */}
            <section className="py-20 bg-black">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl font-display font-bold mb-8">El resultado para el negocio</h2>
                    <p className="text-zinc-400 leading-relaxed text-lg mb-8">
                        MiKurso nace con una base de autoridad técnica que le permite competir contra gigantes 
                        establecidos desde el día 1. Con un blog optimizado bajo el ADN HojaCero y un 
                        enfoque en la confianza radical, MiKurso está listo para dominar la gestión financiera escolar 
                        de la próxima década.
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-zinc-950">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6">¿Tu proyecto necesita<br /><span className="text-cyan-400">Autoridad Digital</span>?</h2>
                    <p className="text-zinc-400 text-lg mb-10">Integramos el Motor SEO/AEO Premium en cada desarrollo de HojaCero para garantizar que no solo existas, sino que domines.</p>
                    <a href="https://wa.me/56958946617?text=Hola!%20Vi%20el%20caso%20de%20MiKurso%20y%20me%20interesa%20el%20motor%20SEO-AEO%20Premium" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-lg px-10 py-5 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
                        Hablar con un estratega
                    </a>
                    <div className="mt-8"><Link href="/servicios/desarrollo-apps" className="text-sm text-zinc-500 hover:text-white transition-colors">Ver servicios de desarrollo →</Link></div>
                </div>
            </section>
            <div className="h-16 md:hidden" />
        </>
    );
}
