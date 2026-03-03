import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
    title: 'Sobre Nosotros | HojaCero — Quién Está Detrás',
    description: 'HojaCero fue fundado por Daniel González Tagle en Santiago de Chile. De repartidor a Director Técnico — conoce la historia real detrás del estudio de ingeniería digital.',
    openGraph: {
        title: 'Sobre Nosotros | HojaCero',
        description: 'La historia real detrás de HojaCero y su fundador Daniel González Tagle.',
        url: 'https://hojacero.cl/about',
    },
    alternates: {
        canonical: 'https://hojacero.cl/about',
    },
};

const products = [
    { name: 'Acargoo', desc: 'Logística con seguimiento en tiempo real', url: 'https://acargoo.cl' },
    { name: 'Vuelve+', desc: 'Motor de fidelización + Google Wallet', url: 'https://vuelve.vip' },
    { name: 'PlusContable', desc: 'SaaS de contabilidad', url: 'https://pluscontable.cl' },
    { name: 'IceBuin', desc: 'Catálogos inteligentes', url: 'https://icebuin.cl' },
    { name: 'Superpanel', desc: 'Gestión de clientes y suscripciones', url: 'https://superpanel.lat' },
    { name: 'Caprex', desc: 'Consultoría premium', url: 'https://caprex.cl' },
    { name: 'Apimiel', desc: 'Apicultura sustentable', url: 'https://apimiel.cl' },
    { name: 'ReparaPads', desc: 'Reparaciones tecnológicas', url: 'https://reparapads.cl' },
];

const techStack = [
    'Next.js', 'React', 'TypeScript', 'Node.js', 'Supabase',
    'Vercel', 'GSAP', 'Framer Motion', 'Tailwind CSS',
];

export default function AboutPage() {
    return (
        <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>
            <Navbar />

            <section style={{ padding: '160px 24px 80px', maxWidth: '760px', margin: '0 auto' }}>
                {/* Breadcrumb */}
                <p style={{
                    fontSize: '11px', fontFamily: 'monospace',
                    letterSpacing: '0.3em', textTransform: 'uppercase',
                    color: '#71717a', marginBottom: '16px',
                }}>
                    Sobre Nosotros
                </p>

                <h1 style={{
                    fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 700,
                    lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '32px',
                }}>
                    No llegamos desde Silicon Valley.{' '}
                    <span style={{
                        background: 'linear-gradient(135deg, #00f0ff, #3b82f6)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                        Llegamos desde la calle.
                    </span>
                </h1>

                <p style={{ fontSize: '18px', color: '#a1a1aa', lineHeight: 1.75, marginBottom: '48px' }}>
                    HojaCero es un estudio de ingeniería digital en Santiago de Chile.
                    Construimos desde landing pages de $50.000 hasta sistemas de logística
                    con mapas en tiempo real. No usamos plantillas. No vendemos humo.
                    Cada línea de código se diseña a medida.
                </p>

                {/* Founder Section */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    paddingTop: '48px', marginBottom: '64px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #00f0ff, #3b82f6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '20px', fontWeight: 700,
                        }}>
                            DG
                        </div>
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Daniel González Tagle</h2>
                            <p style={{ fontSize: '14px', color: '#71717a' }}>Fundador y Director Técnico</p>
                        </div>
                    </div>

                    <div style={{ fontSize: '16px', color: '#d4d4d8', lineHeight: 1.85 }}>
                        <p style={{ marginBottom: '16px' }}>
                            Pasé de repartir pedidos en camioneta a construir software profesional para empresas
                            reales en Chile. No fue un camino convencional — fue un piscinazo con fundamento.
                        </p>
                        <p style={{ marginBottom: '16px' }}>
                            Hoy estudio todos los días, me mantengo al día con cada tecnología que sale, y no
                            solo sé <em>usar</em> inteligencia artificial — entiendo lo que implica armar sistemas
                            grandes, prolijos y que funcionen en producción real.
                        </p>
                        <p style={{ marginBottom: '16px' }}>
                            Autor de{' '}
                            <strong style={{ color: '#fff' }}>&ldquo;IA sin Humo: Cómo usar inteligencia artificial sin venderte cuentos&rdquo;</strong>,
                            donde documento mi proceso real — los errores, las deudas, las soluciones que funcionaron
                            y las que no.
                        </p>
                        <p style={{ marginBottom: '24px' }}>
                            La diferencia entre el Daniel de la camioneta y el de hoy no es un título ni un curso.
                            Son meses de pulirme a punta de errores, construir cosas que se rompían a las 3 de la
                            mañana y aprender a arreglarlas antes de que el cliente se diera cuenta.
                        </p>
                        <a
                            href="https://www.linkedin.com/in/daniel-gonzalez-tagle-7784953a7/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                fontSize: '13px', color: '#00f0ff', textDecoration: 'none',
                                borderBottom: '1px solid rgba(0,240,255,0.3)',
                                paddingBottom: '2px',
                            }}
                        >
                            Ver perfil en LinkedIn →
                        </a>
                    </div>
                </div>

                {/* Ecosystem */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    paddingTop: '48px', marginBottom: '64px',
                }}>
                    <h2 style={{
                        fontSize: '12px', fontFamily: 'monospace',
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        color: '#71717a', marginBottom: '24px',
                    }}>
                        Ecosistema — 8 Productos Activos
                    </h2>
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '2px',
                    }}>
                        {products.map((p) => (
                            <a
                                key={p.name}
                                href={p.url}
                                target="_blank"
                                rel="noopener noreferrer dofollow"
                                style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '16px 0',
                                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                                    textDecoration: 'none', color: 'inherit',
                                }}
                            >
                                <div>
                                    <span style={{ fontSize: '15px', fontWeight: 600 }}>{p.name}</span>
                                    <span style={{ fontSize: '13px', color: '#52525b', marginLeft: '8px' }}>{p.desc}</span>
                                </div>
                                <span style={{ fontSize: '12px', color: '#3f3f46' }}>↗</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Tech Stack */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    paddingTop: '48px', marginBottom: '64px',
                }}>
                    <h2 style={{
                        fontSize: '12px', fontFamily: 'monospace',
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        color: '#71717a', marginBottom: '20px',
                    }}>
                        Stack Técnico
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {techStack.map((tech) => (
                            <span key={tech} style={{
                                fontSize: '12px', padding: '6px 12px',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '6px', color: '#a1a1aa',
                            }}>
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    paddingTop: '48px', textAlign: 'center',
                }}>
                    <p style={{ fontSize: '18px', color: '#a1a1aa', marginBottom: '24px', lineHeight: 1.6 }}>
                        ¿Necesitas a alguien que entienda tu problema antes de escribir código?
                    </p>
                    <Link href="/pricing" style={{
                        display: 'inline-block', padding: '14px 32px',
                        background: 'linear-gradient(135deg, #00f0ff, #3b82f6)',
                        color: '#000', fontWeight: 700, fontSize: '14px',
                        borderRadius: '8px', textDecoration: 'none',
                        letterSpacing: '0.02em',
                    }}>
                        Ver planes →
                    </Link>
                </div>
            </section>

            <Footer />

            {/* JSON-LD AboutPage */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "AboutPage",
                        "name": "Sobre HojaCero",
                        "description": "HojaCero fue fundado por Daniel González Tagle en Santiago de Chile. Estudio de ingeniería digital con más de 8 productos activos.",
                        "url": "https://hojacero.cl/about",
                        "mainEntity": { "@id": "https://hojacero.cl/#organization" },
                    }),
                }}
            />
        </main>
    );
}
