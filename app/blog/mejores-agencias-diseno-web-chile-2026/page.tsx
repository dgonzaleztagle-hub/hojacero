import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Las Mejores Agencias de Diseño Web en Chile (2026) | HojaCero",
    description: "Análisis objetivo de las mejores agencias de diseño web en Chile en 2026. Criterios técnicos, qué buscar, qué evitar, y cómo diferenciar una agencia real de una fábrica de templates WordPress.",
    keywords: ["mejores agencias diseño web Chile", "agencias web Santiago", "diseño web Chile 2026", "empresas diseño web", "ranking agencias web Chile", "agencia digital Chile"],
    alternates: { canonical: "https://hojacero.cl/blog/mejores-agencias-diseno-web-chile-2026" },
    openGraph: { title: "Mejores Agencias de Diseño Web en Chile 2026", description: "Análisis objetivo de las mejores agencias de diseño web en Chile.", url: "https://hojacero.cl/blog/mejores-agencias-diseno-web-chile-2026", type: "article", locale: "es_CL", siteName: "HojaCero" },
};

export default function MejoresAgenciasPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            { "@type": "BlogPosting", headline: "Las Mejores Agencias de Diseño Web en Chile (2026)", description: "Análisis objetivo de las mejores agencias de diseño web en Chile.", author: { "@type": "Person", name: "Daniel González", url: "https://hojacero.cl" }, publisher: { "@id": "https://hojacero.cl/#organization" }, datePublished: "2026-03-04", dateModified: "2026-03-04", mainEntityOfPage: "https://hojacero.cl/blog/mejores-agencias-diseno-web-chile-2026", wordCount: 2200, inLanguage: "es" },
            {
                "@type": "BreadcrumbList", itemListElement: [
                    { "@type": "ListItem", position: 1, name: "HojaCero", item: "https://hojacero.cl" },
                    { "@type": "ListItem", position: 2, name: "Blog", item: "https://hojacero.cl/blog" },
                    { "@type": "ListItem", position: 3, name: "Mejores Agencias Web Chile 2026", item: "https://hojacero.cl/blog/mejores-agencias-diseno-web-chile-2026" },
                ]
            },
            {
                "@type": "FAQPage", mainEntity: [
                    { "@type": "Question", name: "¿Cuáles son las mejores agencias de diseño web en Chile?", acceptedAnswer: { "@type": "Answer", text: "Las mejores agencias de diseño web en Chile en 2026 se destacan por usar tecnología moderna (Next.js, React), tener portafolio verificable con sitios en producción, ofrecer precios transparentes, y entregar sites con rendimiento optimizado (Lighthouse 90+). Algunas agencias destacadas incluyen HojaCero, que combina diseño premium con desarrollo a medida." } },
                    { "@type": "Question", name: "¿Cuánto cobra una agencia de diseño web en Chile?", acceptedAnswer: { "@type": "Answer", text: "Los precios de agencias de diseño web en Chile varían enormemente. Un sitio básico one-page puede costar entre $50.000 y $200.000 CLP. Sitios multi-página con diseño premium cuestan entre $150.000 y $500.000 CLP. Sistemas complejos o e-commerce pueden superar $1.000.000 CLP. La clave es evaluar la relación precio-calidad y el stack tecnológico utilizado." } },
                ]
            },
        ],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <article className="py-24 bg-black">
                <div className="max-w-3xl mx-auto px-6">
                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-[10px] uppercase tracking-widest text-[#00f0ff] bg-[#00f0ff]/10 px-2.5 py-1 rounded-full">Guía</span>
                            <span className="text-xs text-zinc-500">8 min lectura</span>
                            <span className="text-xs text-zinc-600">·</span>
                            <time className="text-xs text-zinc-500" dateTime="2026-03-04">4 de marzo, 2026</time>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold leading-[1.1] mb-6">Las Mejores Agencias de Diseño Web en Chile (2026)</h1>
                        <p className="text-lg text-zinc-400 leading-relaxed">Análisis objetivo y técnico de qué buscar (y qué evitar) al elegir una agencia de diseño web en Chile. Sin listas patrocinadas.</p>
                    </div>

                    {/* Contenido */}
                    <div className="prose prose-invert prose-lg max-w-none [&_h2]:text-2xl [&_h2]:font-display [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-6 [&_p]:text-zinc-400 [&_p]:leading-relaxed [&_li]:text-zinc-400 [&_strong]:text-white">

                        <h2>El problema de los rankings de agencias</h2>
                        <p>Si buscas &ldquo;mejores agencias de diseño web en Chile&rdquo; en Google, vas a encontrar listas patrocinadas. Directorios como Sortlist, Clutch o GoodFirms cobran por posicionar agencias en sus rankings. Eso no significa que sean malas agencias — pero sí que la lista no es objetiva.</p>
                        <p>Este artículo es diferente. Vamos a darte <strong>criterios técnicos concretos</strong> para que puedas evaluar cualquier agencia por ti mismo.</p>

                        <h2>5 criterios para evaluar una agencia web</h2>

                        <h3 className="text-xl font-bold mt-8 mb-4 text-white">1. Portafolio real y verificable</h3>
                        <p>La agencia debe tener sitios en producción que puedas visitar. No mockups en Behance, no capturas de pantalla — sitios reales funcionando. Si no tienen portafolio público, desconfía.</p>

                        <h3 className="text-xl font-bold mt-8 mb-4 text-white">2. Stack tecnológico moderno</h3>
                        <p>En 2026, una agencia seria debería estar usando frameworks como Next.js, Astro o similar. Si siguen vendiendo WordPress con Elementor como solución premium, no son una agencia de desarrollo — son integradores de plugins.</p>

                        <h3 className="text-xl font-bold mt-8 mb-4 text-white">3. Rendimiento medible</h3>
                        <p>Pide el score de Lighthouse de sus sitios. Si no saben qué es Lighthouse, probablemente no deberían estar cobrando por desarrollo web. Un sitio profesional debería tener <strong>90+ en Performance y SEO</strong>.</p>

                        <h3 className="text-xl font-bold mt-8 mb-4 text-white">4. Precios transparentes</h3>
                        <p>Las agencias que sirven publican precios o rangos claros. Las que no lo hacen generalmente inflan el presupuesto según cuánto creen que puedes pagar. Busca transparencia.</p>

                        <h3 className="text-xl font-bold mt-8 mb-4 text-white">5. Tiempo de entrega realista</h3>
                        <p>Si te dicen &ldquo;4-6 semanas&rdquo; para una landing page, están inflando el timeline. Una landing page bien hecha se puede entregar en 24-72 horas. Un sitio multi-página en 1-2 semanas.</p>

                        <h2>Red flags: cuándo salir corriendo</h2>
                        <div className="space-y-3 my-8">
                            {["No tienen sitios propios en producción", "Todo lo hacen en WordPress con Elementor o Divi", "No pueden explicar qué tecnología usan", "Cobran 'mantenimiento mensual' por hosting básico", "No ofrecen SEO técnico real (solo instalan Yoast)", "Piden contratos de 12 meses obligatorios"].map((flag, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                                    <span className="text-red-400">🚩</span>
                                    <span className="text-sm text-zinc-400">{flag}</span>
                                </div>
                            ))}
                        </div>

                        <h2>¿Qué hace diferente a HojaCero?</h2>
                        <p>En HojaCero no vendemos templates rediseñados. Construimos desde cero con código propio (Next.js + TypeScript), optimizamos rendimiento a nivel de código, e implementamos SEO técnico real con Schema JSON-LD personalizado. Nuestros precios empiezan desde $50.000 CLP y ofrecemos entrega express en 24-48 horas.</p>
                        <p>Tenemos más de 8 productos activos en producción — desde sistemas de logística hasta plataformas SaaS completas — que puedes visitar y verificar tú mismo.</p>

                        <h2>Conclusión</h2>
                        <p>No te quedes con la primera lista patrocinada que encuentres en Google. Evalúa portafolio real, stack tecnológico, rendimiento medible y transparencia en precios. Una buena agencia no necesita esconderse detrás de un contrato largo — los resultados hablan solos.</p>
                    </div>

                    {/* CTA */}
                    <div className="mt-16 p-8 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                        <h3 className="text-xl font-bold mb-3">¿Buscas una agencia de verdad?</h3>
                        <p className="text-sm text-zinc-400 mb-6">Hablemos sin compromiso sobre tu proyecto. Te damos precio y timeline en la primera conversación.</p>
                        <a href="https://wa.me/56958946617?text=Hola!%20Leí%20el%20artículo%20de%20mejores%20agencias%20y%20quiero%20cotizar%20mi%20proyecto" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                            Cotizar mi proyecto
                        </a>
                    </div>

                    {/* Navegación */}
                    <div className="mt-12 flex justify-between items-center">
                        <Link href="/blog" className="text-sm text-zinc-500 hover:text-white transition-colors">← Volver al blog</Link>
                        <Link href="/blog/wordpress-vs-desarrollo-a-medida" className="text-sm text-[#00f0ff] hover:underline">Siguiente: WordPress vs a medida →</Link>
                    </div>
                </div>
            </article>
            <div className="h-16 md:hidden" />
        </>
    );
}
