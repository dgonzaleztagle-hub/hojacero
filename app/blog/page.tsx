import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Blog — Guías de Diseño Web, Apps y Marketing Digital en Chile | HojaCero",
    description:
        "Guías prácticas sobre diseño web, desarrollo de apps, marketing digital y SEO en Chile. Contenido técnico real de ingenieros, no de marketeros. Tips, comparativas y análisis para tomar mejores decisiones digitales.",
    keywords: ["blog diseño web Chile", "guías marketing digital", "blog desarrollo apps", "SEO Chile blog", "agencia digital blog"],
    alternates: { canonical: "https://hojacero.cl/blog" },
    openGraph: {
        title: "Blog HojaCero — Guías Digitales para Chile",
        description: "Contenido técnico real sobre diseño web, apps y marketing digital.",
        url: "https://hojacero.cl/blog", type: "website", locale: "es_CL", siteName: "HojaCero",
    },
};

const articles = [
    {
        slug: "mejores-agencias-diseno-web-chile-2026",
        title: "Las Mejores Agencias de Diseño Web en Chile (2026)",
        excerpt: "Análisis objetivo de las mejores agencias de diseño web en Chile. Qué buscar, qué evitar, y cómo diferenciar una agencia real de una fábrica de templates.",
        date: "2026-03-04",
        readTime: "8 min",
        tag: "Guía",
    },
    {
        slug: "wordpress-vs-desarrollo-a-medida",
        title: "WordPress vs Desarrollo a Medida: ¿Qué Conviene en 2026?",
        excerpt: "Comparativa técnica honesta entre WordPress y desarrollo a medida con Next.js. Cuándo conviene cada uno, costos reales y rendimiento.",
        date: "2026-03-04",
        readTime: "10 min",
        tag: "Comparativa",
    },
    {
        slug: "como-elegir-agencia-marketing-digital",
        title: "Cómo Elegir una Agencia de Marketing Digital en Chile",
        excerpt: "Guía práctica para elegir la agencia correcta. Red flags, preguntas clave, y qué resultados exigir. Basado en experiencia real.",
        date: "2026-03-04",
        readTime: "7 min",
        tag: "Guía",
    },
    {
        slug: "guia-digitalizar-negocio-chile",
        title: "Guía Completa para Digitalizar tu Negocio en Chile (2026)",
        excerpt: "Paso a paso para llevar tu negocio al mundo digital. Desde la página web hasta el e-commerce, con precios reales del mercado chileno.",
        date: "2026-03-04",
        readTime: "12 min",
        tag: "Guía",
    },
];

export default function BlogPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Blog",
                name: "Blog HojaCero",
                description: "Guías y artículos sobre diseño web, desarrollo de apps y marketing digital en Chile.",
                url: "https://hojacero.cl/blog",
                publisher: { "@id": "https://hojacero.cl/#organization" },
            },
            {
                "@type": "BreadcrumbList", itemListElement: [
                    { "@type": "ListItem", position: 1, name: "HojaCero", item: "https://hojacero.cl" },
                    { "@type": "ListItem", position: 2, name: "Blog", item: "https://hojacero.cl/blog" },
                ]
            },
        ],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* HERO */}
            <section className="py-24 bg-black">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
                        <span className="text-[10px] uppercase tracking-widest text-[#00f0ff]">Blog</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-display font-bold leading-[1.1] mb-6">Guías para tomar<br /><span className="text-[#00f0ff]">mejores decisiones</span><br />digitales</h1>
                    <p className="text-lg text-zinc-400 max-w-xl leading-relaxed">Contenido técnico real de ingenieros. Sin clickbait, sin humo, sin listas patrocinadas.</p>
                </div>
            </section>

            {/* ARTÍCULOS */}
            <section className="py-12 bg-zinc-950">
                <div className="max-w-4xl mx-auto px-6 space-y-6">
                    {articles.map((article) => (
                        <Link key={article.slug} href={`/blog/${article.slug}`} className="block group p-8 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#00f0ff]/20 transition-all duration-500">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-[10px] uppercase tracking-widest text-[#00f0ff] bg-[#00f0ff]/10 px-2.5 py-1 rounded-full">{article.tag}</span>
                                <span className="text-xs text-zinc-500">{article.readTime}</span>
                                <span className="text-xs text-zinc-600">·</span>
                                <span className="text-xs text-zinc-500">{new Date(article.date).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-display font-bold mb-3 group-hover:text-[#00f0ff] transition-colors">{article.title}</h2>
                            <p className="text-sm text-zinc-400 leading-relaxed">{article.excerpt}</p>
                            <span className="inline-block mt-4 text-sm text-[#00f0ff] group-hover:underline">Leer artículo →</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-black">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-2xl font-display font-bold mb-4">¿Sacaste alguna conclusión?</h2>
                    <p className="text-zinc-400 mb-8">Si tienes preguntas o quieres explorar alguna de estas ideas para tu negocio, hablemos.</p>
                    <a href="https://wa.me/56958946617?text=Hola!%20Leí%20el%20blog%20y%20tengo%20una%20consulta" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                        Consultanos gratis
                    </a>
                </div>
            </section>
            <div className="h-16 md:hidden" />
        </>
    );
}
