import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Caso Caprex: Sitio Web Premium para Consultoría de Agua | HojaCero",
    description:
        "Cómo construimos el sitio web premium de Caprex, empresa de consultoría en gestión de recursos hídricos. Diseño nivel Awwwards con animaciones avanzadas, SEO técnico y rendimiento optimizado. Entrega en 48 horas.",
    keywords: ["sitio web consultoría", "diseño web premium Chile", "web para empresa", "diseño web Awwwards", "caso estudio diseño web", "sitio web profesional Chile"],
    alternates: { canonical: "https://hojacero.cl/casos/caprex" },
    openGraph: {
        title: "Caso Caprex: Sitio Web Premium para Consultoría | HojaCero",
        description: "Diseño web nivel agencia internacional para consultoría de agua. Animaciones, SEO técnico, rendimiento.",
        url: "https://hojacero.cl/casos/caprex", type: "article", locale: "es_CL", siteName: "HojaCero",
    },
};

const metrics = [
    { value: "48h", label: "Tiempo de entrega" },
    { value: "95+", label: "Score Lighthouse" },
    { value: "7", label: "Páginas completas" },
    { value: "Live", label: "En producción" },
];

const features = [
    { title: "Diseño premium con animaciones", description: "Cada sección tiene transiciones suaves y micro-animaciones que guían al usuario. Scroll-driven animations con GSAP, parallax sutil y hovers interactivos." },
    { title: "SEO técnico completo", description: "Schema JSON-LD personalizado, metadata optimizada, Open Graph, sitemap dinámico, y canonical tags. Todo lo necesario para que Google indexe correctamente." },
    { title: "Multi-página con navegación fluida", description: "7 páginas interconectadas: Home, Servicios, Misión y Visión, Equipo, Proyectos, Testimonios y Contacto. Transiciones entre páginas instantáneas." },
    { title: "Rendimiento optimizado", description: "Score de Lighthouse 95+ en Performance, Accessibility y SEO. Imágenes optimizadas, lazy loading y code splitting automático con Next.js." },
];

export default function CaprexPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article",
                headline: "Caso Caprex: Sitio Web Premium para Consultoría de Agua",
                description: "Cómo construimos un sitio web premium con diseño nivel Awwwards para una empresa de consultoría hídrica.",
                author: { "@type": "Person", name: "Daniel González", url: "https://hojacero.cl" },
                publisher: { "@id": "https://hojacero.cl/#organization" },
                datePublished: "2025-09-01", dateModified: "2026-03-01",
                mainEntityOfPage: "https://hojacero.cl/casos/caprex",
            },
            {
                "@type": "BreadcrumbList", itemListElement: [
                    { "@type": "ListItem", position: 1, name: "HojaCero", item: "https://hojacero.cl" },
                    { "@type": "ListItem", position: 2, name: "Casos", item: "https://hojacero.cl/casos" },
                    { "@type": "ListItem", position: 3, name: "Caprex", item: "https://hojacero.cl/casos/caprex" },
                ]
            },
        ],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* HERO */}
            <section className="relative min-h-[80vh] flex items-center bg-black overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-sky-500/20 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 w-full">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
                        <span className="text-[10px] uppercase tracking-widest text-[#00f0ff]">Caso de estudio</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] mb-6">Caprex</h1>
                    <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed mb-4">Sitio web premium para consultoría en gestión de recursos hídricos. Diseño nivel agencia internacional con animaciones avanzadas, SEO técnico y rendimiento optimizado.</p>
                    <div className="flex items-center gap-4 mb-10">
                        <a href="https://caprex.cl" target="_blank" rel="noopener noreferrer" className="text-sm text-[#00f0ff] hover:underline">caprex.cl →</a>
                        <span className="text-zinc-600">|</span>
                        <span className="text-sm text-zinc-500">Consultoría Hídrica · Chile</span>
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
                    <h2 className="text-3xl font-display font-bold mb-8">Una marca técnica que necesitaba presencia digital premium</h2>
                    <p className="text-zinc-400 leading-relaxed text-lg mb-6">Caprex es una empresa seria de consultoría en gestión de agua. Trabajan con corporaciones, municipios y proyectos grandes. Necesitaban un sitio web que reflejara su nivel de profesionalismo y generara confianza inmediata.</p>
                    <p className="text-zinc-400 leading-relaxed">El desafío no era técnico solamente — era crear una experiencia digital que comunicara autoridad, expertise y confianza en un sector donde la credibilidad lo es todo. Y entregarlo en menos de 48 horas.</p>
                </div>
            </section>

            {/* SOLUCIÓN */}
            <section className="py-20 bg-black">
                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#00f0ff] mb-4">La solución</p>
                    <h2 className="text-3xl font-display font-bold mb-12">Diseño premium en tiempo récord</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((f, i) => (
                            <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-sky-500/20 transition-all duration-500">
                                <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DETALLE DE PÁGINAS */}
            <section className="py-20 bg-zinc-950">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl font-display font-bold mb-12">7 páginas, una experiencia coherente</h2>
                    <div className="space-y-4">
                        {[
                            { name: "Home", desc: "Hero con video de fondo, servicios destacados, testimonios y CTA" },
                            { name: "Servicios", desc: "Catálogo de servicios con iconos y descripciones detalladas" },
                            { name: "Misión y Visión", desc: "Valores de la empresa con la voz de Carla Gajardo, fundadora" },
                            { name: "Equipo", desc: "Perfiles del equipo con fotos profesionales y especialidades" },
                            { name: "Proyectos", desc: "Portafolio de proyectos ejecutados con resultados medibles" },
                            { name: "Testimonios", desc: "Reseñas verificadas de clientes con foto y empresa" },
                            { name: "Contacto", desc: "Formulario de contacto funcional + mapa + datos directos" },
                        ].map((page, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                                <span className="text-xs font-display font-bold text-[#00f0ff] w-8">{String(i + 1).padStart(2, '0')}</span>
                                <div>
                                    <span className="font-semibold text-sm">{page.name}</span>
                                    <span className="text-xs text-zinc-500 ml-2">{page.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* RESULTADO */}
            <section className="py-20 bg-black">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl font-display font-bold mb-8">El resultado</h2>
                    <p className="text-zinc-400 leading-relaxed text-lg mb-8">Caprex pasó de no tener presencia digital a tener un sitio web que recibe elogios constantes de sus clientes y socios. La entrega fue en 48 horas, con 7 páginas completas, animaciones premium y SEO técnico implementado. El sitio se convirtió en una herramienta de ventas real.</p>
                    <blockquote className="border-l-2 border-[#00f0ff] pl-6 my-8">
                        <p className="text-zinc-300 italic text-lg">&ldquo;El sitio superó completamente nuestras expectativas. La gente nos felicita constantemente por lo profesional que se ve.&rdquo;</p>
                        <cite className="text-sm text-zinc-500 mt-2 block not-italic">— Cliente Caprex</cite>
                    </blockquote>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-zinc-950">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6">¿Necesitas un sitio<br /><span className="text-[#00f0ff]">web premium</span>?</h2>
                    <p className="text-zinc-400 text-lg mb-10">Diseñamos sitios web que generan confianza y convierten visitantes en clientes. Premium de verdad, no de template.</p>
                    <a href="https://wa.me/56958946617?text=Hola!%20Vi%20el%20caso%20de%20Caprex%20y%20quiero%20un%20sitio%20web%20premium" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-lg px-10 py-5 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                        Quiero mi sitio premium
                    </a>
                    <div className="mt-8"><Link href="/servicios/paginas-web-chile" className="text-sm text-zinc-500 hover:text-white transition-colors">Ver servicio de diseño web →</Link></div>
                </div>
            </section>
            <div className="h-16 md:hidden" />
        </>
    );
}
