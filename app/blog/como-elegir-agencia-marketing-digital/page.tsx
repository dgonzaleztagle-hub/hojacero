import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Cómo Elegir una Agencia de Marketing Digital en Chile | HojaCero",
    description: "Guía práctica para elegir la agencia de marketing digital correcta en Chile. Qué preguntar, qué exigir, red flags, y cómo evaluar resultados reales. Basado en experiencia de un estudio de ingeniería digital.",
    keywords: ["elegir agencia marketing digital", "agencia marketing Chile", "marketing digital Santiago", "cómo elegir agencia digital", "agencia SEO Chile", "marketing digital Chile 2026"],
    alternates: { canonical: "https://hojacero.cl/blog/como-elegir-agencia-marketing-digital" },
    openGraph: { title: "Cómo Elegir una Agencia de Marketing Digital", description: "Guía práctica con criterios reales.", url: "https://hojacero.cl/blog/como-elegir-agencia-marketing-digital", type: "article", locale: "es_CL", siteName: "HojaCero" },
};

export default function ComoElegirAgenciaPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            { "@type": "BlogPosting", headline: "Cómo Elegir una Agencia de Marketing Digital en Chile", description: "Guía práctica para elegir agencia de marketing digital.", author: { "@type": "Person", name: "Daniel González", url: "https://hojacero.cl" }, publisher: { "@id": "https://hojacero.cl/#organization" }, datePublished: "2026-03-04", dateModified: "2026-03-04", mainEntityOfPage: "https://hojacero.cl/blog/como-elegir-agencia-marketing-digital", wordCount: 1800, inLanguage: "es" },
            {
                "@type": "BreadcrumbList", itemListElement: [
                    { "@type": "ListItem", position: 1, name: "HojaCero", item: "https://hojacero.cl" },
                    { "@type": "ListItem", position: 2, name: "Blog", item: "https://hojacero.cl/blog" },
                    { "@type": "ListItem", position: 3, name: "Cómo Elegir Agencia de Marketing", item: "https://hojacero.cl/blog/como-elegir-agencia-marketing-digital" },
                ]
            },
            {
                "@type": "FAQPage", mainEntity: [
                    { "@type": "Question", name: "¿Cómo saber si una agencia de marketing digital es buena?", acceptedAnswer: { "@type": "Answer", text: "Una buena agencia de marketing digital muestra resultados medibles (no solo impresiones), tiene casos de estudio verificables, no promete resultados imposibles, explica su metodología con claridad, y no te obliga a contratos anuales. Pide siempre ver métricas reales: tráfico orgánico, conversiones, y posiciones en Google." } },
                    { "@type": "Question", name: "¿Cuánto debería cobrar una agencia de marketing digital en Chile?", acceptedAnswer: { "@type": "Answer", text: "Los precios en Chile varían mucho. Una auditoría SEO básica debería costar entre $100.000 y $300.000 CLP. Servicios mensuales de SEO o marketing digital van desde $200.000 a $1.000.000+ CLP dependiendo del alcance. Desconfía de precios extremadamente bajos (menos de $100.000/mes) porque probablemente no están haciendo nada real." } },
                ]
            },
        ],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <article className="py-24 bg-black">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-[10px] uppercase tracking-widest text-[#00f0ff] bg-[#00f0ff]/10 px-2.5 py-1 rounded-full">Guía</span>
                            <span className="text-xs text-zinc-500">7 min lectura</span>
                            <span className="text-xs text-zinc-600">·</span>
                            <time className="text-xs text-zinc-500" dateTime="2026-03-04">4 de marzo, 2026</time>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold leading-[1.1] mb-6">Cómo Elegir una Agencia de Marketing Digital en Chile</h1>
                        <p className="text-lg text-zinc-400 leading-relaxed">Guía práctica con preguntas clave, red flags, y criterios reales para no tirar tu plata.</p>
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none [&_h2]:text-2xl [&_h2]:font-display [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-6 [&_p]:text-zinc-400 [&_p]:leading-relaxed [&_li]:text-zinc-400 [&_strong]:text-white">

                        <h2>Las 5 preguntas que debes hacer</h2>

                        <div className="space-y-6 my-8 not-prose">
                            {[
                                { q: "¿Pueden mostrarme resultados medibles?", why: "No 'likes' o 'impresiones'. Resultados reales: aumento de tráfico orgánico, conversiones, posiciones en Google para keywords específicas." },
                                { q: "¿Qué exactamente van a hacer cada mes?", why: "Si no pueden explicarte con detalle qué tareas ejecutan mensualmente, probablemente no están haciendo nada sustancial." },
                                { q: "¿Tienen casos de estudio verificables?", why: "Pide URLs de clientes reales donde puedas verificar el trabajo. Si solo muestran mockups o reportes en PDF, desconfía." },
                                { q: "¿Cuánto tiempo tarda en verse resultados?", why: "Respuesta honesta: SEO toma 3-6 meses, ads pagados se ven en semanas. Si te prometen resultados inmediatos en SEO, mienten." },
                                { q: "¿Puedo cancelar cuando quiera?", why: "Las agencias buenas no necesitan contratos largos para retener clientes. Si te obligan a 12 meses, algo anda mal." },
                            ].map((item, i) => (
                                <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                                    <div className="flex items-start gap-3">
                                        <span className="text-[#00f0ff] font-display font-bold text-lg">{i + 1}</span>
                                        <div>
                                            <h3 className="text-base font-bold text-white mb-2">{item.q}</h3>
                                            <p className="text-sm text-zinc-400">{item.why}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h2>Red flags de agencias digitales</h2>
                        <div className="space-y-3 my-8 not-prose">
                            {[
                                "Te prometen 'primera página de Google' en menos de un mes",
                                "No pueden explicar qué tecnologías o herramientas usan",
                                "Su propio sitio web es lento o se ve anticuado",
                                "Solo hablan de 'redes sociales' pero no de SEO, contenido o conversión",
                                "Te cobran por métricas de vanidad (impresiones, alcance, seguidores)",
                                "No tienen un solo cliente que puedas contactar como referencia",
                            ].map((flag, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-lg text-sm text-zinc-400">
                                    <span className="text-red-400">🚩</span> {flag}
                                </div>
                            ))}
                        </div>

                        <h2>¿Qué resultados deberías exigir?</h2>
                        <p>Según el servicio contratado, estos son los KPIs que deberían mejorar:</p>
                        <ul>
                            <li><strong>SEO:</strong> Posiciones en Google para keywords específicas, tráfico orgánico mensual, Core Web Vitals</li>
                            <li><strong>Ads pagados:</strong> CPC, CPA, ROAS, y conversiones reales (no clics)</li>
                            <li><strong>Contenido:</strong> Tráfico orgánico desde artículos, tiempo en página, CTR desde Google</li>
                            <li><strong>Redes sociales:</strong> Engagement rate real, conversiones atribuibles, tráfico al sitio</li>
                        </ul>

                        <h2>Nuestro enfoque en HojaCero</h2>
                        <p>No somos una agencia de marketing full-service. Nuestro foco es <strong>SEO técnico real</strong>: Schema JSON-LD, optimización de Core Web Vitals, estrategia AEO/GEO, y contenido técnico. No manejamos redes sociales. Si necesitas eso, te conectamos con partners que complementan nuestro trabajo.</p>
                        <p>Nuestras auditorías de SEO técnico parten desde $100.000 CLP e incluyen reporte detallado en PDF, análisis de competencia y reunión de 30 minutos.</p>
                    </div>

                    <div className="mt-16 p-8 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                        <h3 className="text-xl font-bold mb-3">¿Quieres una auditoría SEO real?</h3>
                        <p className="text-sm text-zinc-400 mb-6">Te decimos exactamente cómo está tu web y qué mejorar. Sin humo.</p>
                        <a href="https://wa.me/56958946617?text=Hola!%20Leí%20la%20guía%20de%20agencias%20y%20quiero%20una%20auditoría%20SEO" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                            Pedir auditoría SEO
                        </a>
                    </div>

                    <div className="mt-12 flex justify-between items-center">
                        <Link href="/blog/wordpress-vs-desarrollo-a-medida" className="text-sm text-zinc-500 hover:text-white transition-colors">← WordPress vs a medida</Link>
                        <Link href="/blog/guia-digitalizar-negocio-chile" className="text-sm text-[#00f0ff] hover:underline">Siguiente: Digitalizar negocio →</Link>
                    </div>
                </div>
            </article>
            <div className="h-16 md:hidden" />
        </>
    );
}
