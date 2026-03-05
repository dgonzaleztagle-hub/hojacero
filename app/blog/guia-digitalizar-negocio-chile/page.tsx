import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Guía Completa para Digitalizar tu Negocio en Chile (2026) | HojaCero",
    description: "Guía paso a paso para llevar tu negocio al mundo digital en Chile. Desde la página web hasta el e-commerce, con precios reales, opciones de tecnología y un mapa claro de por dónde empezar.",
    keywords: ["digitalizar negocio Chile", "transformación digital Chile", "cómo crear negocio online", "digitalización pyme Chile", "negocio digital Chile 2026", "presencia digital negocio"],
    alternates: { canonical: "https://hojacero.cl/blog/guia-digitalizar-negocio-chile" },
    openGraph: { title: "Guía para Digitalizar tu Negocio en Chile 2026", description: "Paso a paso con precios reales del mercado chileno.", url: "https://hojacero.cl/blog/guia-digitalizar-negocio-chile", type: "article", locale: "es_CL", siteName: "HojaCero" },
};

export default function GuiaDigitalizarPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            { "@type": "BlogPosting", headline: "Guía Completa para Digitalizar tu Negocio en Chile (2026)", description: "Paso a paso para llevar tu negocio al mundo digital.", author: { "@type": "Person", name: "Daniel González", url: "https://hojacero.cl" }, publisher: { "@id": "https://hojacero.cl/#organization" }, datePublished: "2026-03-04", dateModified: "2026-03-04", mainEntityOfPage: "https://hojacero.cl/blog/guia-digitalizar-negocio-chile", wordCount: 2800, inLanguage: "es" },
            {
                "@type": "BreadcrumbList", itemListElement: [
                    { "@type": "ListItem", position: 1, name: "HojaCero", item: "https://hojacero.cl" },
                    { "@type": "ListItem", position: 2, name: "Blog", item: "https://hojacero.cl/blog" },
                    { "@type": "ListItem", position: 3, name: "Guía Digitalizar Negocio", item: "https://hojacero.cl/blog/guia-digitalizar-negocio-chile" },
                ]
            },
            {
                "@type": "HowTo", name: "Cómo Digitalizar tu Negocio en Chile", description: "Guía paso a paso para la transformación digital de tu negocio.", step: [
                    { "@type": "HowToStep", position: 1, name: "Presencia digital básica", text: "Crear un sitio web profesional que represente tu marca y genere confianza." },
                    { "@type": "HowToStep", position: 2, name: "Google Business Profile", text: "Registrar y optimizar tu perfil de Google My Business para aparecer en búsquedas locales." },
                    { "@type": "HowToStep", position: 3, name: "E-commerce o catálogo digital", text: "Implementar venta online o un catálogo de productos según tu modelo de negocio." },
                    { "@type": "HowToStep", position: 4, name: "Marketing digital", text: "Implementar SEO técnico y estrategia de contenido para atraer tráfico orgánico." },
                    { "@type": "HowToStep", position: 5, name: "Automatización", text: "Automatizar procesos repetitivos como cotizaciones, facturación y gestión de clientes." },
                ]
            },
            {
                "@type": "FAQPage", mainEntity: [
                    { "@type": "Question", name: "¿Cuánto cuesta digitalizar un negocio en Chile?", acceptedAnswer: { "@type": "Answer", text: "El costo mínimo para tener presencia digital básica en Chile es desde $50.000 CLP (sitio web one-page). Un pack completo con sitio web, Google Business Profile, y catálogo digital puede costar entre $150.000 y $300.000 CLP. E-commerce completo con pasarelas de pago desde $300.000 CLP. La inversión se recupera rápidamente con los primeros clientes que llegan por internet." } },
                    { "@type": "Question", name: "¿Por dónde empiezo a digitalizar mi negocio?", acceptedAnswer: { "@type": "Answer", text: "El primer paso siempre es tener un sitio web profesional. No necesitas algo complejo: una página bien diseñada con tu información de contacto, servicios y un botón de WhatsApp es suficiente para empezar. Luego, registra tu Google Business Profile (es gratis) para aparecer en búsquedas locales. A partir de ahí, evalúa si necesitas e-commerce o si un catálogo digital es más adecuado para tu modelo." } },
                ]
            },
        ],
    };

    const steps = [
        { step: 1, title: "Sitio web profesional", price: "Desde $50.000 CLP", desc: "Tu base digital. No necesitas algo mega complejo — necesitas algo que represente bien tu marca, cargue rápido y tenga un botón de WhatsApp visible.", time: "24-72 horas" },
        { step: 2, title: "Google Business Profile", price: "Gratis", desc: "Registra tu negocio en Google para aparecer en el mapa cuando alguien busca tu rubro cerca de ti. Es gratis y tiene un impacto enorme en búsquedas locales.", time: "30 minutos" },
        { step: 3, title: "Catálogo o e-commerce", price: "Desde $150.000 CLP", desc: "Si vendes productos, necesitas un catálogo digital como mínimo. Para venta online completa con carrito y pasarela de pago, el precio sube pero el retorno es inmediato.", time: "1-2 semanas" },
        { step: 4, title: "SEO y contenido", price: "Desde $100.000 CLP", desc: "Que tu sitio aparezca cuando buscan lo que ofreces. SEO técnico real (no Yoast) + contenido estratégico que Google quiera mostrar.", time: "Resultados en 3-6 meses" },
        { step: 5, title: "Automatización", price: "Variable", desc: "Automatizar cotizaciones, gestión de pedidos, facturación y comunicación con clientes. Ahorras tiempo y reduces errores.", time: "2-4 semanas" },
    ];

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <article className="py-24 bg-black">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-[10px] uppercase tracking-widest text-[#00f0ff] bg-[#00f0ff]/10 px-2.5 py-1 rounded-full">Guía</span>
                            <span className="text-xs text-zinc-500">12 min lectura</span>
                            <span className="text-xs text-zinc-600">·</span>
                            <time className="text-xs text-zinc-500" dateTime="2026-03-04">4 de marzo, 2026</time>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold leading-[1.1] mb-6">Guía Completa para Digitalizar tu Negocio en Chile (2026)</h1>
                        <p className="text-lg text-zinc-400 leading-relaxed">El mapa completo: por dónde empezar, cuánto cuesta, y qué priorizar según tu tipo de negocio.</p>
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none [&_h2]:text-2xl [&_h2]:font-display [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-6 [&_p]:text-zinc-400 [&_p]:leading-relaxed [&_li]:text-zinc-400 [&_strong]:text-white">

                        <h2>¿Por qué digitalizar en 2026?</h2>
                        <p>En Chile, más del 70% de las búsquedas de servicios locales se hacen desde el celular. Si tu negocio no tiene presencia digital, estás <strong>invisible</strong> para la mayoría de tus potenciales clientes. No es una exageración — es matemática.</p>
                        <p>La buena noticia: digitalizar tu negocio hoy es <strong>más barato y más rápido</strong> que nunca. Ya no necesitas gastar millones en una agencia tradicional. Con la tecnología correcta, puedes tener presencia profesional desde $50.000 CLP.</p>

                        <h2>Los 5 pasos para digitalizar tu negocio</h2>
                    </div>

                    {/* Steps */}
                    <div className="space-y-6 my-12">
                        {steps.map((s) => (
                            <div key={s.step} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                                <div className="flex items-start gap-4">
                                    <span className="text-3xl font-display font-bold text-[#00f0ff]/20">{String(s.step).padStart(2, '0')}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold">{s.title}</h3>
                                            <span className="text-xs text-[#00f0ff] bg-[#00f0ff]/10 px-2 py-0.5 rounded-full">{s.price}</span>
                                        </div>
                                        <p className="text-sm text-zinc-400 leading-relaxed mb-2">{s.desc}</p>
                                        <span className="text-xs text-zinc-500">⏱ {s.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none [&_h2]:text-2xl [&_h2]:font-display [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-6 [&_p]:text-zinc-400 [&_p]:leading-relaxed [&_li]:text-zinc-400 [&_strong]:text-white">

                        <h2>Por dónde empezar según tu negocio</h2>
                        <div className="space-y-4 my-8 not-prose">
                            {[
                                { tipo: "🍕 Restaurante o cafetería", prioridad: "Google Business Profile + Menú digital + WhatsApp CTA" },
                                { tipo: "🛒 Tienda o retail", prioridad: "Catálogo digital o e-commerce + Google Business Profile" },
                                { tipo: "💼 Servicios profesionales", prioridad: "Sitio web premium + SEO técnico + Portafolio de casos" },
                                { tipo: "🏗️ Construcción o industria", prioridad: "Sitio web con catálogo de servicios + Google Business Profile" },
                                { tipo: "💡 Startup o SaaS", prioridad: "Sitio web + MVP del producto + SEO + Blog técnico" },
                            ].map((item, i) => (
                                <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                                    <span className="text-sm font-bold text-white">{item.tipo}</span>
                                    <p className="text-xs text-zinc-400 mt-1">Prioridad: {item.prioridad}</p>
                                </div>
                            ))}
                        </div>

                        <h2>Errores comunes al digitalizar</h2>
                        <ul>
                            <li><strong>Empezar por las redes sociales.</strong> Instagram no es tu sitio web. Si tu negocio desaparece de Instagram mañana, ¿qué te queda? Siempre empieza por tu propio sitio web.</li>
                            <li><strong>Gastar en ads sin tener un sitio optimizado.</strong> Si tu sitio carga lento o no tiene CTAs claros, estás tirando plata en publicidad que no convierte.</li>
                            <li><strong>Elegir la tecnología más barata sin pensar en el futuro.</strong> Un sitio WordPress de $20.000 hoy te puede costar $200.000 en mantenimiento y problemas en un año.</li>
                            <li><strong>No medir nada.</strong> Si no tienes Google Analytics o Search Console configurados, estás ciego. No sabes qué funciona y qué no.</li>
                        </ul>

                        <h2>El costo real de NO digitalizar</h2>
                        <p>Cada mes sin presencia digital es un mes donde tus competidores captan los clientes que deberían estar encontrándote a ti. En Chile, un negocio local típico puede generar entre 5 y 20 leads mensuales adicionales solo con un sitio web bien optimizado y un Google Business Profile activo.</p>
                        <p>Si cada lead vale $50.000 CLP promedio, eso son entre <strong>$250.000 y $1.000.000 CLP mensuales</strong> que estás dejando en la mesa. La inversión para empezar es de $50.000 CLP. Haz la cuenta.</p>
                    </div>

                    <div className="mt-16 p-8 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                        <h3 className="text-xl font-bold mb-3">¿Listo para dar el salto digital?</h3>
                        <p className="text-sm text-zinc-400 mb-6">Cuéntanos sobre tu negocio y te armamos un plan a medida. Sin compromiso.</p>
                        <a href="https://wa.me/56958946617?text=Hola!%20Leí%20la%20guía%20de%20digitalización%20y%20quiero%20digitalizar%20mi%20negocio" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                            Digitalizar mi negocio
                        </a>
                    </div>

                    <div className="mt-12 flex justify-between items-center">
                        <Link href="/blog/como-elegir-agencia-marketing-digital" className="text-sm text-zinc-500 hover:text-white transition-colors">← Cómo elegir agencia</Link>
                        <Link href="/blog" className="text-sm text-[#00f0ff] hover:underline">Ver todos los artículos →</Link>
                    </div>
                </div>
            </article>
            <div className="h-16 md:hidden" />
        </>
    );
}
