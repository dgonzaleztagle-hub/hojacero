import Link from 'next/link';
import { Metadata } from 'next';
import { allArticles as articles } from './articles';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
    title: 'Lab | HojaCero — Historias Reales de Desarrollo en Chile',
    description: 'Casos de estudio, lecciones técnicas y artículos sobre desarrollo web, inteligencia artificial y emprendimiento tecnológico en Chile. Sin humo, solo resultados.',
    openGraph: {
        title: 'Lab | HojaCero',
        description: 'Historias reales de desarrollo web y software en Chile.',
        url: 'https://hojacero.cl/lab',
    },
};

const categoryLabel: Record<string, string> = {
    'caso-de-estudio': 'Caso de Estudio',
    'tecnico': 'Técnico',
    'opinion': 'Opinión',
    'guia': 'Guía',
};

const categoryColor: Record<string, string> = {
    'caso-de-estudio': '#00f0ff',
    'tecnico': '#8b5cf6',
    'opinion': '#f59e0b',
    'guia': '#10b981',
};

export default function LabPage() {
    return (
        <main style={{
            minHeight: '100vh',
            background: '#0a0a0a',
            color: '#fff',
        }}>
            <Navbar />

            {/* Hero */}
            <section style={{
                padding: '160px 24px 80px',
                maxWidth: '900px',
                margin: '0 auto',
            }}>
                <p style={{
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: '#71717a',
                    marginBottom: '16px',
                }}>
                    Lab / Artículos
                </p>
                <h1 style={{
                    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                    fontWeight: 700,
                    lineHeight: 1,
                    marginBottom: '24px',
                    letterSpacing: '-0.03em',
                }}>
                    Historias <span style={{
                        background: 'linear-gradient(135deg, #00f0ff, #3b82f6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>reales</span>
                </h1>
                <p style={{
                    fontSize: '18px',
                    color: '#a1a1aa',
                    lineHeight: 1.7,
                    maxWidth: '600px',
                }}>
                    Casos de estudio, lecciones técnicas y el proceso real detrás de cada proyecto que construimos. Sin teoría vacía — solo lo que funciona.
                </p>
            </section>

            {/* Articles Grid */}
            <section style={{
                padding: '0 24px 120px',
                maxWidth: '900px',
                margin: '0 auto',
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                }}>
                    {articles.map((article) => (
                        <Link
                            key={article.slug}
                            href={`/lab/${article.slug}`}
                            style={{
                                display: 'block',
                                padding: '32px 0',
                                borderBottom: '1px solid rgba(255,255,255,0.06)',
                                textDecoration: 'none',
                                color: 'inherit',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginBottom: '12px',
                            }}>
                                <span style={{
                                    fontSize: '10px',
                                    fontFamily: 'monospace',
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    color: categoryColor[article.category] || '#71717a',
                                    padding: '3px 8px',
                                    border: `1px solid ${categoryColor[article.category] || '#71717a'}40`,
                                    borderRadius: '4px',
                                }}>
                                    {categoryLabel[article.category]}
                                </span>
                                <span style={{
                                    fontSize: '12px',
                                    color: '#52525b',
                                }}>
                                    {article.readTime}
                                </span>
                            </div>

                            <h2 style={{
                                fontSize: '20px',
                                fontWeight: 600,
                                marginBottom: '8px',
                                lineHeight: 1.3,
                            }}>
                                {article.title}
                            </h2>

                            <p style={{
                                fontSize: '14px',
                                color: '#71717a',
                                lineHeight: 1.6,
                                maxWidth: '700px',
                            }}>
                                {article.excerpt}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            <Footer />

            {/* JSON-LD CollectionPage */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        "name": "Lab — HojaCero",
                        "description": "Artículos técnicos, casos de estudio y lecciones de desarrollo web en Chile",
                        "url": "https://hojacero.cl/lab",
                        "publisher": { "@id": "https://hojacero.cl/#organization" },
                        "mainEntity": {
                            "@type": "ItemList",
                            "itemListElement": articles.map((a, i) => ({
                                "@type": "ListItem",
                                "position": i + 1,
                                "url": `https://hojacero.cl/lab/${a.slug}`,
                                "name": a.title,
                            })),
                        },
                    }),
                }}
            />
        </main>
    );
}
