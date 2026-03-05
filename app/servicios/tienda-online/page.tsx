import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tiendas Online a Medida en Chile — Sin Shopify, Sin Limitaciones | HojaCero",
    description:
        "Tiendas online y e-commerce a medida en Chile. Sin Shopify, sin WooCommerce, sin comisiones por venta. Código propio con Next.js, catálogos inteligentes y pasarelas de pago integradas. Desde catálogos por $150.000 CLP.",
    keywords: [
        "tienda online Chile",
        "e-commerce a medida Chile",
        "crear tienda virtual Chile",
        "tienda online Santiago",
        "e-commerce sin Shopify",
        "tienda online sin comisiones",
        "catálogo digital Chile",
        "vender online Chile",
        "plataforma e-commerce Chile",
        "tienda web a medida",
    ],
    alternates: { canonical: "https://hojacero.cl/servicios/tienda-online" },
    openGraph: {
        title: "Tiendas Online a Medida en Chile | HojaCero",
        description: "E-commerce sin Shopify, sin comisiones, sin limitaciones. Código a medida.",
        url: "https://hojacero.cl/servicios/tienda-online",
        type: "website", locale: "es_CL", siteName: "HojaCero",
    },
};

const faqs = [
    { question: "¿Cuánto cuesta una tienda online en Chile?", answer: "Un catálogo digital inteligente con gestión de productos parte desde $150.000 CLP. Para e-commerce completo con carrito de compras, pasarelas de pago y gestión de inventario, los precios se definen según la complejidad. Te damos presupuesto detallado en la primera conversación por WhatsApp." },
    { question: "¿Por qué no usan Shopify o WooCommerce?", answer: "Shopify cobra comisiones por cada venta (entre 0.5% y 2%), más su mensualidad. WooCommerce necesita hosting caro, plugins de pago y mantenimiento constante de WordPress. Nuestras tiendas son código propio: no hay comisiones por venta, no hay mensualidades de plataforma, y el rendimiento es muy superior." },
    { question: "¿Puedo gestionar los productos yo mismo?", answer: "Sí. Cada tienda incluye un panel de administración donde puedes agregar, editar y eliminar productos. En algunos casos, como IceBuin, la gestión se hace desde Excel para máxima simplicidad — subes tu planilla y los productos se actualizan automáticamente." },
    { question: "¿Qué pasarelas de pago integran?", answer: "Integramos las pasarelas más usadas en Chile: Webpay (Transbank), MercadoPago, Flow y Stripe. Cada tienda se configura según las necesidades del negocio y el volumen de ventas esperado." },
    { question: "¿Las tiendas son responsive (se ven en celular)?", answer: "Sí, todas nuestras tiendas están diseñadas mobile-first. Más del 70% del tráfico en Chile viene desde celulares, así que el diseño se optimiza primero para móvil y luego se adapta a escritorio." },
];

export default function TiendaOnlinePage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            { "@type": "Service", "@id": "https://hojacero.cl/servicios/tienda-online#service", name: "Tiendas Online y E-commerce a Medida en Chile", description: "Desarrollo de tiendas online a medida en Chile. Sin Shopify, sin comisiones por venta. Código propio con Next.js y pasarelas de pago locales.", provider: { "@id": "https://hojacero.cl/#organization" }, areaServed: { "@type": "Country", name: "Chile" }, serviceType: "Desarrollo E-commerce" },
            {
                "@type": "BreadcrumbList", itemListElement: [
                    { "@type": "ListItem", position: 1, name: "HojaCero", item: "https://hojacero.cl" },
                    { "@type": "ListItem", position: 2, name: "Servicios", item: "https://hojacero.cl/servicios" },
                    { "@type": "ListItem", position: 3, name: "Tienda Online", item: "https://hojacero.cl/servicios/tienda-online" },
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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
                            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                            <span className="text-xs text-zinc-400">Sin comisiones por venta · Sin mensualidades de plataforma</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-[1.1] mb-6">Tiendas Online<br /><span className="text-[#00f0ff]">a Medida</span><br />en Chile</h1>
                        <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mb-4 leading-relaxed">Sin Shopify, sin WooCommerce, sin comisiones. Tu tienda es <span className="text-white font-semibold">tuya</span>, con código propio, rápida y sin depender de nadie.</p>
                        <p className="text-sm text-zinc-500 mb-10">Catálogos desde $150.000 CLP · Pasarelas de pago chilenas · Mobile-first</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="https://wa.me/56958946617?text=Hola!%20Quiero%20crear%20una%20tienda%20online" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                                Quiero mi tienda online
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* COMPARATIVA */}
            <section className="py-20 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl sm:text-4xl font-display font-bold mb-16">¿Por qué no Shopify ni WooCommerce?</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px] text-sm">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-4 px-4 text-zinc-500 font-normal">Característica</th>
                                    <th className="py-4 px-4 text-zinc-500 font-normal">Shopify</th>
                                    <th className="py-4 px-4 text-zinc-500 font-normal">WooCommerce</th>
                                    <th className="py-4 px-4 text-[#00f0ff] font-semibold">HojaCero</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { feature: "Comisión por venta", shopify: "0.5-2%", woo: "PayPal 3.4%", h0: "0%" },
                                    { feature: "Mensualidad", shopify: "$29-$299 USD", woo: "Hosting $10+ USD", h0: "Gratis (Vercel)" },
                                    { feature: "Velocidad", shopify: "Media", woo: "Lenta (plugins)", h0: "Ultra-rápida" },
                                    { feature: "Personalización", shopify: "Limitada a temas", woo: "Limitada a plugins", h0: "100% a medida" },
                                    { feature: "Seguridad", shopify: "Dependes de ellos", woo: "Vulnerable (plugins)", h0: "Código propio" },
                                    { feature: "SEO real", shopify: "Básico", woo: "Yoast (superficial)", h0: "Schema técnico" },
                                ].map((row, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                                        <td className="py-3 px-4 text-zinc-300 font-medium">{row.feature}</td>
                                        <td className="py-3 px-4 text-center text-zinc-500">{row.shopify}</td>
                                        <td className="py-3 px-4 text-center text-zinc-500">{row.woo}</td>
                                        <td className="py-3 px-4 text-center text-[#00f0ff] font-semibold">{row.h0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* EJEMPLO REAL */}
            <section className="py-20 bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl sm:text-4xl font-display font-bold mb-16">Ejemplo real: IceBuin</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-[10px] uppercase tracking-widest text-[#00f0ff]">Caso de estudio</span>
                            <h3 className="text-2xl font-bold mt-2 mb-4">Catálogo inteligente con gestión desde Excel</h3>
                            <p className="text-zinc-400 leading-relaxed mb-6">IceBuin es un catálogo digital donde el dueño gestiona sus productos desde una simple planilla de Excel. Sube la planilla, los productos se actualizan automáticamente en el sitio. Sin panel complicado, sin plugins, sin WordPress.</p>
                            <ul className="space-y-2 mb-8">
                                {["Gestión de productos desde Excel", "Actualización automática del catálogo", "Diseño premium responsive", "WhatsApp directo por producto", "Cero dependencia de plataformas"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                                        <svg className="w-4 h-4 text-[#00f0ff] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <a href="https://icebuin.cl" target="_blank" rel="noopener noreferrer" className="text-sm text-[#00f0ff] hover:underline">Ver IceBuin en vivo →</a>
                        </div>
                        <div className="aspect-video bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl border border-white/5 flex items-center justify-center">
                            <span className="text-4xl font-display font-bold text-white/10">IceBuin</span>
                        </div>
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
                    <h2 className="text-3xl sm:text-5xl font-display font-bold mb-6">¿Listo para<br /><span className="text-[#00f0ff]">vender online</span>?</h2>
                    <p className="text-zinc-400 text-lg mb-10">Cuéntanos qué vendes y te proponemos la mejor solución. Sin compromiso, sin comisiones ocultas.</p>
                    <a href="https://wa.me/56958946617?text=Hola!%20Quiero%20crear%20mi%20tienda%20online%20a%20medida" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-lg px-10 py-5 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                        Hablemos por WhatsApp
                    </a>
                </div>
            </section>
            <div className="h-16 md:hidden" />
        </>
    );
}
