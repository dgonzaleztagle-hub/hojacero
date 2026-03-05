import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Caso Acargoo: Sistema de Logística con Tracking en Tiempo Real | HojaCero",
    description:
        "Cómo construimos Acargoo, un sistema de logística completo con cotización automática de envíos, tracking en mapa en tiempo real y panel de administración. Desarrollo a medida con Next.js, Mapbox y Supabase en Santiago de Chile.",
    keywords: ["sistema logística Chile", "tracking envíos", "cotización automática envíos", "software logística", "desarrollo logística Chile", "caso de estudio HojaCero"],
    alternates: { canonical: "https://hojacero.cl/casos/acargoo" },
    openGraph: {
        title: "Caso Acargoo: Logística con Tracking en Tiempo Real | HojaCero",
        description: "Sistema completo de logística con cotización automática y tracking en mapa. Next.js + Mapbox + Supabase.",
        url: "https://hojacero.cl/casos/acargoo",
        type: "article",
        locale: "es_CL",
        siteName: "HojaCero",
    },
};

const metrics = [
    { value: "3 semanas", label: "Desarrollo completo" },
    { value: "100%", label: "Código a medida" },
    { value: "Mapbox", label: "Tracking en mapa" },
    { value: "Live", label: "En producción" },
];

const features = [
    { title: "Cotización automática", description: "El usuario ingresa origen, destino y tipo de carga. El sistema calcula automáticamente el precio basado en distancia, peso y volumen. Sin llamadas, sin esperas." },
    { title: "Tracking en mapa", description: "Seguimiento en tiempo real de cada envío con vista de mapa interactivo usando Mapbox. El cliente ve exactamente dónde está su paquete en todo momento." },
    { title: "Panel de administración", description: "Dashboard completo para el operador con gestión de envíos, clientes, tarifas y reportes. Todo desde una interfaz limpia y moderna." },
    { title: "Notificaciones", description: "Sistema de alertas automáticas por cambio de estado del envío. El cliente recibe actualizaciones sin tener que preguntar." },
];

const techStack = [
    { name: "Next.js", role: "Framework principal" },
    { name: "TypeScript", role: "Tipado estricto" },
    { name: "Supabase", role: "Base de datos y auth" },
    { name: "Mapbox", role: "Mapas y geolocalización" },
    { name: "Vercel", role: "Hosting y deploy" },
    { name: "Tailwind CSS", role: "Estilos" },
];

export default function AcargooPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article",
                headline: "Caso Acargoo: Sistema de Logística con Tracking en Tiempo Real",
                description: "Cómo construimos un sistema de logística completo con cotización automática y tracking en mapa en tiempo real.",
                author: { "@type": "Person", name: "Daniel González", url: "https://hojacero.cl" },
                publisher: { "@id": "https://hojacero.cl/#organization" },
                datePublished: "2025-06-01",
                dateModified: "2026-03-01",
                mainEntityOfPage: "https://hojacero.cl/casos/acargoo",
                image: "https://hojacero.cl/og-image.jpg",
            },
            {
                "@type": "SoftwareApplication",
                name: "Acargoo",
                applicationCategory: "BusinessApplication",
                operatingSystem: "Web",
                url: "https://acargoo.cl",
                description: "Sistema de logística con cotización automática de envíos y tracking en tiempo real.",
                creator: { "@id": "https://hojacero.cl/#organization" },
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "HojaCero", item: "https://hojacero.cl" },
                    { "@type": "ListItem", position: 2, name: "Casos", item: "https://hojacero.cl/casos" },
                    { "@type": "ListItem", position: 3, name: "Acargoo", item: "https://hojacero.cl/casos/acargoo" },
                ],
            },
        ],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* HERO */}
            <section className="relative min-h-[80vh] flex items-center bg-black overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/20 via-[#00f0ff]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 w-full">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
                        <span className="text-[10px] uppercase tracking-widest text-[#00f0ff]">Caso de estudio</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] mb-6">
                        Acargoo
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed mb-4">
                        Sistema de logística completo con cotización automática de envíos, tracking en mapa en tiempo real y panel de administración.
                    </p>
                    <div className="flex items-center gap-4 mb-10">
                        <a href="https://acargoo.cl" target="_blank" rel="noopener noreferrer" className="text-sm text-[#00f0ff] hover:underline">acargoo.cl →</a>
                        <span className="text-zinc-600">|</span>
                        <span className="text-sm text-zinc-500">Logística · Santiago, Chile</span>
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

            {/* EL DESAFÍO */}
            <section className="py-20 bg-zinc-950">
                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">El desafío</p>
                    <h2 className="text-3xl font-display font-bold mb-8">¿Qué necesitaba el cliente?</h2>
                    <div className="prose prose-invert max-w-none">
                        <p className="text-zinc-400 leading-relaxed text-lg mb-6">
                            Acargoo necesitaba digitalizar completamente su operación de envíos. Su proceso era manual: cotizaciones por teléfono, seguimiento por WhatsApp, y documentación en planillas Excel. Esto generaba errores, demoras y una experiencia frustrante tanto para el equipo como para los clientes.
                        </p>
                        <p className="text-zinc-400 leading-relaxed mb-6">
                            El objetivo era claro: crear un sistema web integral que automatizara la cotización de envíos, permitiera tracking en tiempo real, y le diera al equipo un panel de control para gestionar toda la operación desde un solo lugar.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {["Cotizaciones manuales con errores frecuentes", "Sin tracking visible para el cliente", "Documentación dispersa en Excel"].map((pain, i) => (
                                <div key={i} className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl text-sm text-zinc-400">❌ {pain}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* LA SOLUCIÓN */}
            <section className="py-20 bg-black">
                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#00f0ff] mb-4">La solución</p>
                    <h2 className="text-3xl font-display font-bold mb-12">¿Qué construimos?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((f, i) => (
                            <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#00f0ff]/20 transition-all duration-500">
                                <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* STACK TÉCNICO */}
            <section className="py-20 bg-zinc-950">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl font-display font-bold mb-12">Stack técnico</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {techStack.map((t, i) => (
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
                    <p className="text-zinc-400 leading-relaxed text-lg mb-8">
                        Acargoo pasó de un proceso 100% manual a un sistema digital completo en 3 semanas. El cliente ahora puede cotizar envíos automáticamente, sus clientes pueden hacer tracking en tiempo real, y toda la operación está centralizada en un panel moderno y fácil de usar.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { label: "Cotizaciones automáticas", desc: "Sin errores, sin llamadas" },
                            { label: "Tracking en mapa", desc: "Visibilidad total para el cliente" },
                            { label: "Gestión centralizada", desc: "Todo en un solo panel" },
                        ].map((r, i) => (
                            <div key={i} className="p-4 bg-[#00f0ff]/5 border border-[#00f0ff]/10 rounded-xl">
                                <div className="text-sm font-bold text-[#00f0ff] mb-1">✅ {r.label}</div>
                                <div className="text-xs text-zinc-400">{r.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-zinc-950">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6">¿Necesitas un sistema<br /><span className="text-[#00f0ff]">similar</span>?</h2>
                    <p className="text-zinc-400 text-lg mb-10">Cuéntanos tu proyecto y te decimos cómo lo implementaríamos, cuánto cuesta y cuánto toma.</p>
                    <a href="https://wa.me/56958946617?text=Hola!%20Vi%20el%20caso%20de%20Acargoo%20y%20necesito%20algo%20similar" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-lg px-10 py-5 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                        Quiero algo similar
                    </a>
                    <div className="mt-8">
                        <Link href="/servicios/desarrollo-apps" className="text-sm text-zinc-500 hover:text-white transition-colors">Ver servicio de desarrollo de apps →</Link>
                    </div>
                </div>
            </section>
            <div className="h-16 md:hidden" />
        </>
    );
}
