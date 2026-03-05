import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Marketing Digital y SEO Técnico Real en Chile | HojaCero",
    description:
        "Marketing digital y SEO técnico real en Santiago de Chile. No vendemos humo: implementamos estrategia AEO/GEO, Schema avanzado y optimización de rendimiento que genera resultados medibles. Desde auditorías por $100.000 CLP.",
    keywords: [
        "marketing digital Chile",
        "SEO Santiago",
        "agencia SEO Chile",
        "posicionamiento web Chile",
        "marketing digital Santiago",
        "agencia marketing digital Chile",
        "SEO técnico Chile",
        "posicionamiento Google Chile",
        "AEO Chile",
        "estrategia digital Chile",
    ],
    alternates: { canonical: "https://hojacero.cl/servicios/marketing-digital" },
    openGraph: {
        title: "Marketing Digital y SEO Real | HojaCero",
        description: "SEO técnico y estrategia AEO/GEO que genera resultados reales. No humo.",
        url: "https://hojacero.cl/servicios/marketing-digital",
        type: "website", locale: "es_CL", siteName: "HojaCero",
    },
};

const faqs = [
    { question: "¿Qué diferencia a HojaCero de otras agencias de marketing?", answer: "No somos una agencia de marketing tradicional. Somos ingenieros digitales. Nuestro SEO no es instalar Yoast en WordPress — es Schema JSON-LD personalizado, optimización de Core Web Vitals a nivel de código, estrategia AEO/GEO para que las inteligencias artificiales recomienden tu negocio, y contenido técnico que genera autoridad real." },
    { question: "¿Qué es AEO y GEO?", answer: "AEO (Answer Engine Optimization) es optimizar tu contenido para que las IAs como ChatGPT, Gemini y Perplexity te citen como fuente cuando alguien pregunta sobre tu industria. GEO (Generative Engine Optimization) es la evolución del SEO para la era de las búsquedas con IA. En HojaCero implementamos ambas estrategias con Schema avanzado, contenido estructurado y autoridad técnica." },
    { question: "¿Cuánto cuesta una auditoría SEO?", answer: "Una auditoría web completa cuesta $100.000 CLP e incluye análisis de velocidad, seguridad, SEO técnico, análisis de competencia, reporte detallado en PDF y una reunión de 30 minutos para explicar los hallazgos y recomendaciones." },
    { question: "¿Hacen manejo de redes sociales?", answer: "No manejamos redes sociales directamente. Nuestro enfoque es SEO técnico, optimización de rendimiento y estrategia AEO/GEO. Para redes sociales trabajamos con partners de confianza que complementan nuestra estrategia digital." },
    { question: "¿Cuánto tarda en verse resultados en SEO?", answer: "Los cambios técnicos (velocidad, Schema, Core Web Vitals) tienen impacto en semanas. El posicionamiento orgánico en Google toma 3-6 meses para keywords competitivas. Para AEO (aparecer en IAs), los resultados pueden verse más rápido porque las IAs actualizan sus fuentes constantemente." },
];

export default function MarketingDigitalPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            { "@type": "Service", "@id": "https://hojacero.cl/servicios/marketing-digital#service", name: "Marketing Digital y SEO Técnico en Chile", description: "Servicio de SEO técnico real, estrategia AEO/GEO y optimización de rendimiento web en Santiago de Chile.", provider: { "@id": "https://hojacero.cl/#organization" }, areaServed: { "@type": "Country", name: "Chile" }, serviceType: "Marketing Digital y SEO" },
            {
                "@type": "BreadcrumbList", itemListElement: [
                    { "@type": "ListItem", position: 1, name: "HojaCero", item: "https://hojacero.cl" },
                    { "@type": "ListItem", position: 2, name: "Servicios", item: "https://hojacero.cl/servicios" },
                    { "@type": "ListItem", position: 3, name: "Marketing Digital", item: "https://hojacero.cl/servicios/marketing-digital" },
                ]
            },
            { "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
        ],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* HERO */}
            <section className="relative min-h-[90vh] flex items-center bg-black overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/15 via-[#00f0ff]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-xs text-zinc-400">SEO técnico real, no plugins de WordPress</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-[1.1] mb-6">Marketing Digital<br /><span className="text-[#00f0ff]">y SEO</span> Técnico<br />Real</h1>
                        <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mb-4 leading-relaxed">No vendemos humo. Implementamos Schema avanzado, Core Web Vitals optimizados y estrategia <span className="text-white font-semibold">AEO/GEO</span> para que Google y las IAs te recomienden.</p>
                        <p className="text-sm text-zinc-500 mb-10">Auditorías desde $100.000 CLP · Resultados medibles · Sin contratos anuales</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="https://wa.me/56958946617?text=Hola!%20Me%20interesa%20el%20marketing%20digital%20y%20SEO" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                                Quiero mejorar mi SEO
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* QUÉ HACEMOS DIFERENTE */}
            <section className="py-20 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl sm:text-4xl font-display font-bold mb-16">SEO real vs. SEO de humo</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="p-8 bg-red-500/5 border border-red-500/10 rounded-2xl">
                            <h3 className="text-red-400 font-bold text-lg mb-6">❌ Lo que hacen otros</h3>
                            <ul className="space-y-3 text-sm text-zinc-400">
                                {["Instalar Yoast en WordPress", "Reportes de vanidad (impresiones sin conversión)", "Keywords stuffing sin estrategia", "Mismo plan para todos los clientes", "Contratos de 12 meses obligatorios"].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span> {item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-8 bg-[#00f0ff]/5 border border-[#00f0ff]/10 rounded-2xl">
                            <h3 className="text-[#00f0ff] font-bold text-lg mb-6">✅ Lo que hacemos nosotros</h3>
                            <ul className="space-y-3 text-sm text-zinc-300">
                                {["Schema JSON-LD personalizado por página", "Core Web Vitals optimizados a nivel de código", "Estrategia AEO/GEO para IAs", "Plan a medida según tu negocio", "Sin contratos — trabajamos por resultados"].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2"><span className="text-[#00f0ff] mt-0.5">✓</span> {item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICIOS */}
            <section className="py-20 bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl sm:text-4xl font-display font-bold mb-16">Nuestros servicios de marketing digital</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: "🔍", title: "Auditoría Web Completa", price: "$100.000 CLP", description: "Análisis profundo de velocidad, seguridad, SEO y competencia. Reporte PDF + reunión de 30 min.", cta: "Hola!%20Quiero%20una%20auditoría%20web" },
                            { icon: "📈", title: "SEO Técnico", price: "Desde $200.000 CLP", description: "Implementación de Schema, optimización de Core Web Vitals, sitemap, robots.txt, y estructura de URLs.", cta: "Hola!%20Me%20interesa%20el%20SEO%20técnico" },
                            { icon: "🤖", title: "AEO / GEO", price: "Consultar", description: "Estrategia para que ChatGPT, Gemini y Perplexity recomienden tu negocio. El futuro del posicionamiento.", cta: "Hola!%20Me%20interesa%20la%20estrategia%20AEO%20GEO" },
                        ].map((service, i) => (
                            <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#00f0ff]/20 transition-all duration-500 flex flex-col">
                                <span className="text-4xl mb-4">{service.icon}</span>
                                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                                <p className="text-[#00f0ff] text-sm font-semibold mb-4">{service.price}</p>
                                <p className="text-sm text-zinc-400 leading-relaxed mb-8 flex-1">{service.description}</p>
                                <a href={`https://wa.me/56958946617?text=${service.cta}`} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-3 border border-white/20 rounded-xl text-sm font-semibold hover:bg-white hover:text-black transition-all duration-300">
                                    Consultar →
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 bg-zinc-950">
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

            {/* CTA FINAL */}
            <section className="py-24 bg-black">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-5xl font-display font-bold mb-6">¿Tu negocio merece<br /><span className="text-[#00f0ff]">ser encontrado</span>?</h2>
                    <p className="text-zinc-400 text-lg mb-10">Hablemos sobre cómo hacer que Google y las IAs recomienden tu negocio. Sin compromiso, sin contratos eternos.</p>
                    <a href="https://wa.me/56958946617?text=Hola!%20Quiero%20mejorar%20el%20posicionamiento%20digital%20de%20mi%20negocio" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-lg px-10 py-5 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                        Hablemos por WhatsApp
                    </a>
                </div>
            </section>
            <div className="h-16 md:hidden" />
        </>
    );
}
