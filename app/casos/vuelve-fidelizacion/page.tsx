import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Caso Vuelve+: Motor de Fidelización con Google Wallet | HojaCero",
    description:
        "Cómo construimos Vuelve+, un motor de fidelización digital con tarjetas de puntos para Google Wallet, panel de administración para comercios y sistema de recompensas automático. Desarrollo a medida en Chile.",
    keywords: ["programa fidelización Chile", "Google Wallet tarjeta puntos", "loyalty program", "fidelización clientes", "tarjeta digital puntos", "caso estudio HojaCero"],
    alternates: { canonical: "https://hojacero.cl/casos/vuelve-fidelizacion" },
    openGraph: {
        title: "Caso Vuelve+: Fidelización con Google Wallet | HojaCero",
        description: "Motor de fidelización con tarjetas digitales para Google Wallet. Desarrollo a medida en Chile.",
        url: "https://hojacero.cl/casos/vuelve-fidelizacion", type: "article", locale: "es_CL", siteName: "HojaCero",
    },
};

const metrics = [
    { value: "Google Wallet", label: "Integración nativa" },
    { value: "B2B", label: "Multi-comercio" },
    { value: "Real-time", label: "Puntos instantáneos" },
    { value: "Live", label: "En producción" },
];

const features = [
    { title: "Tarjetas para Google Wallet", description: "Cada cliente recibe una tarjeta digital que se agrega directamente a Google Wallet. Los puntos se actualizan en tiempo real sin necesidad de abrir una app." },
    { title: "Panel multi-comercio", description: "Cada negocio tiene su propio panel de administración. Configuran reglas de puntos, recompensas, y ven estadísticas de uso. Un solo motor, múltiples marcas." },
    { title: "Sistema de puntos automático", description: "Los puntos se acumulan automáticamente con cada compra. El comercio escanea un QR y el sistema hace todo el cálculo. Sin fricción." },
    { title: "Recompensas personalizables", description: "Cada comercio define sus propias recompensas: descuentos, productos gratis, experiencias exclusivas. El cliente las canjea desde su wallet." },
];

export default function VuelveFidelizacionPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article",
                headline: "Caso Vuelve+: Motor de Fidelización con Google Wallet",
                description: "Cómo construimos un motor de fidelización con tarjetas digitales para Google Wallet.",
                author: { "@type": "Person", name: "Daniel González", url: "https://hojacero.cl" },
                publisher: { "@id": "https://hojacero.cl/#organization" },
                datePublished: "2025-08-01", dateModified: "2026-03-01",
                mainEntityOfPage: "https://hojacero.cl/casos/vuelve-fidelizacion",
            },
            {
                "@type": "SoftwareApplication", name: "Vuelve+", applicationCategory: "BusinessApplication",
                operatingSystem: "Web", url: "https://vuelve.vip",
                description: "Motor de fidelización digital con tarjetas para Google Wallet y panel multi-comercio.",
                creator: { "@id": "https://hojacero.cl/#organization" },
            },
            {
                "@type": "BreadcrumbList", itemListElement: [
                    { "@type": "ListItem", position: 1, name: "HojaCero", item: "https://hojacero.cl" },
                    { "@type": "ListItem", position: 2, name: "Casos", item: "https://hojacero.cl/casos" },
                    { "@type": "ListItem", position: 3, name: "Vuelve+", item: "https://hojacero.cl/casos/vuelve-fidelizacion" },
                ]
            },
        ],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* HERO */}
            <section className="relative min-h-[80vh] flex items-center bg-black overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-violet-500/20 via-pink-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 w-full">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
                        <span className="text-[10px] uppercase tracking-widest text-[#00f0ff]">Caso de estudio</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] mb-6">Vuelve+</h1>
                    <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed mb-4">Motor de fidelización digital con tarjetas de puntos para Google Wallet, panel multi-comercio y sistema de recompensas automático.</p>
                    <div className="flex items-center gap-4 mb-10">
                        <a href="https://vuelve.vip" target="_blank" rel="noopener noreferrer" className="text-sm text-[#00f0ff] hover:underline">vuelve.vip →</a>
                        <span className="text-zinc-600">|</span>
                        <span className="text-sm text-zinc-500">Fidelización · Chile</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {metrics.map((m, i) => (
                            <div key={i} className="text-center p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                                <div className="text-xl font-display font-bold text-[#00f0ff]">{m.value}</div>
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
                    <h2 className="text-3xl font-display font-bold mb-8">¿Por qué construir esto?</h2>
                    <p className="text-zinc-400 leading-relaxed text-lg mb-6">Los programas de fidelización tradicionales dependen de apps que nadie descarga, tarjetas físicas que se pierden, o sistemas caros como Loyverse. Queríamos crear algo que viviera donde el cliente ya está: en su billetera digital de Google.</p>
                    <p className="text-zinc-400 leading-relaxed mb-6">El reto técnico era integrar la API de Google Wallet para generar tarjetas dinámicas que se actualizaran en tiempo real, sin que el usuario tuviera que hacer nada más que agregar la tarjeta una vez.</p>
                </div>
            </section>

            {/* SOLUCIÓN */}
            <section className="py-20 bg-black">
                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#00f0ff] mb-4">La solución</p>
                    <h2 className="text-3xl font-display font-bold mb-12">¿Qué construimos?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((f, i) => (
                            <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-violet-500/20 transition-all duration-500">
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
                    <h2 className="text-3xl font-display font-bold mb-12">Stack técnico</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {[
                            { name: "Next.js", role: "Frontend y API" },
                            { name: "Google Wallet API", role: "Tarjetas digitales" },
                            { name: "Supabase", role: "Base de datos" },
                            { name: "TypeScript", role: "Tipado estricto" },
                            { name: "QR Generation", role: "Identificación" },
                            { name: "Vercel", role: "Deploy" },
                        ].map((t, i) => (
                            <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                                <div className="text-sm font-bold text-[#00f0ff]">{t.name}</div>
                                <div className="text-xs text-zinc-500 mt-1">{t.role}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* RESULTADO */}
            <section className="py-20 bg-black">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl font-display font-bold mb-8">El resultado</h2>
                    <p className="text-zinc-400 leading-relaxed text-lg mb-8">Vuelve+ es un motor de fidelización completo que funciona como servicio B2B. Cada comercio tiene su propio panel, sus propias reglas, y sus clientes llevan la tarjeta de puntos directamente en Google Wallet. Sin apps que descargar, sin tarjetas físicas, sin fricción.</p>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-zinc-950">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6">¿Necesitas un programa<br /><span className="text-[#00f0ff]">de fidelización</span>?</h2>
                    <p className="text-zinc-400 text-lg mb-10">Podemos crear un sistema similar para tu negocio o integrarte directamente a la plataforma Vuelve+.</p>
                    <a href="https://wa.me/56958946617?text=Hola!%20Vi%20el%20caso%20de%20Vuelve%2B%20y%20me%20interesa%20un%20programa%20de%20fidelización" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-lg px-10 py-5 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                        Quiero algo similar
                    </a>
                    <div className="mt-8"><Link href="/servicios/desarrollo-apps" className="text-sm text-zinc-500 hover:text-white transition-colors">Ver servicio de desarrollo →</Link></div>
                </div>
            </section>
            <div className="h-16 md:hidden" />
        </>
    );
}
