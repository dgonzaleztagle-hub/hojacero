import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { allArticles as articles } from '../articles';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Generate static params for all articles
export async function generateStaticParams() {
    return articles.map((article) => ({
        slug: article.slug,
    }));
}

// Dynamic metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const article = articles.find((a) => a.slug === slug);
    if (!article) return { title: 'Artículo no encontrado' };

    return {
        title: `${article.title} | HojaCero Lab`,
        description: article.excerpt,
        keywords: article.keywords,
        alternates: {
            canonical: `https://hojacero.cl/lab/${article.slug}`,
        },
        openGraph: {
            title: article.title,
            description: article.excerpt,
            url: `https://hojacero.cl/lab/${article.slug}`,
            type: 'article',
            publishedTime: article.date,
            authors: ['Daniel González'],
        },
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = articles.find((a) => a.slug === slug);

    if (!article) {
        notFound();
    }

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

    // Find next and previous articles
    const currentIndex = articles.findIndex((a) => a.slug === slug);
    const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
    const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

    return (
        <main style={{
            minHeight: '100vh',
            background: '#0a0a0a',
            color: '#fff',
        }}>
            <Navbar />

            {/* Article Header */}
            <article style={{
                maxWidth: '720px',
                margin: '0 auto',
                padding: '160px 24px 80px',
            }}>
                {/* Breadcrumb */}
                <nav style={{
                    marginBottom: '40px',
                    fontSize: '12px',
                    color: '#52525b',
                }}>
                    <Link href="/lab" style={{ color: '#71717a', textDecoration: 'none' }}>
                        ← Lab
                    </Link>
                </nav>

                {/* Meta */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '24px',
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
                    <span style={{ fontSize: '12px', color: '#52525b' }}>
                        {article.readTime}
                    </span>
                    <span style={{ fontSize: '12px', color: '#52525b' }}>
                        {new Date(article.date).toLocaleDateString('es-CL', {
                            year: 'numeric',
                            month: 'long',
                        })}
                    </span>
                </div>

                {/* Title */}
                <h1 style={{
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    fontWeight: 700,
                    lineHeight: 1.1,
                    letterSpacing: '-0.03em',
                    marginBottom: '16px',
                }}>
                    {article.title}
                </h1>

                {/* Subtitle */}
                <p style={{
                    fontSize: '18px',
                    color: '#a1a1aa',
                    lineHeight: 1.6,
                    marginBottom: '16px',
                }}>
                    {article.subtitle}
                </p>

                {/* Author */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '20px 0',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    marginBottom: '48px',
                }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #00f0ff, #3b82f6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 700,
                    }}>
                        DG
                    </div>
                    <div>
                        <p style={{ fontSize: '14px', fontWeight: 600 }}>Daniel González</p>
                        <p style={{ fontSize: '12px', color: '#71717a' }}>Fundador de HojaCero</p>
                    </div>
                </div>

                {/* Content */}
                <div
                    className="lab-article-content"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                    style={{
                        fontSize: '16px',
                        lineHeight: 1.85,
                        color: '#d4d4d8',
                    }}
                />

                {/* Navigation */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '80px',
                    paddingTop: '40px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    gap: '24px',
                }}>
                    {prevArticle ? (
                        <Link href={`/lab/${prevArticle.slug}`} style={{
                            textDecoration: 'none',
                            color: '#71717a',
                            fontSize: '14px',
                            transition: 'color 0.2s',
                        }}>
                            ← {prevArticle.title.length > 40
                                ? prevArticle.title.substring(0, 40) + '...'
                                : prevArticle.title}
                        </Link>
                    ) : <span />}

                    {nextArticle ? (
                        <Link href={`/lab/${nextArticle.slug}`} style={{
                            textDecoration: 'none',
                            color: '#71717a',
                            fontSize: '14px',
                            textAlign: 'right',
                            transition: 'color 0.2s',
                        }}>
                            {nextArticle.title.length > 40
                                ? nextArticle.title.substring(0, 40) + '...'
                                : nextArticle.title} →
                        </Link>
                    ) : <span />}
                </div>
            </article>

            <Footer />

            {/* JSON-LD Article + Breadcrumbs */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@graph": [
                            {
                                "@type": "BreadcrumbList",
                                "itemListElement": [
                                    {
                                        "@type": "ListItem",
                                        "position": 1,
                                        "name": "HojaCero",
                                        "item": "https://hojacero.cl",
                                    },
                                    {
                                        "@type": "ListItem",
                                        "position": 2,
                                        "name": "Lab",
                                        "item": "https://hojacero.cl/lab",
                                    },
                                    {
                                        "@type": "ListItem",
                                        "position": 3,
                                        "name": article.title,
                                        "item": `https://hojacero.cl/lab/${article.slug}`,
                                    },
                                ],
                            },
                            {
                                "@type": "Article",
                                "headline": article.title,
                                "description": article.excerpt,
                                "datePublished": article.date,
                                "dateModified": article.date,
                                "author": { "@id": "https://hojacero.cl/#founder" },
                                "publisher": { "@id": "https://hojacero.cl/#organization" },
                                "mainEntityOfPage": {
                                    "@type": "WebPage",
                                    "@id": `https://hojacero.cl/lab/${article.slug}`,
                                },
                                "keywords": article.keywords.join(', '),
                                "inLanguage": "es-CL",
                                "isPartOf": { "@id": "https://hojacero.cl/#website" },
                            },
                        ],
                    }),
                }}
            />

            {/* Article Styles */}
            <style>{`
                .lab-article-content h2 {
                    font-size: 24px;
                    font-weight: 700;
                    margin: 48px 0 16px;
                    color: #fff;
                    letter-spacing: -0.02em;
                }
                .lab-article-content p {
                    margin: 0 0 20px;
                }
                .lab-article-content a {
                    color: #00f0ff;
                    text-decoration: underline;
                    text-underline-offset: 3px;
                }
                .lab-article-content a:hover {
                    color: #fff;
                }
                .lab-article-content strong {
                    color: #fff;
                    font-weight: 600;
                }
                .lab-article-content em {
                    color: #a1a1aa;
                }
                .lab-article-content ul {
                    margin: 0 0 24px;
                    padding-left: 24px;
                }
                .lab-article-content li {
                    margin-bottom: 8px;
                    color: #a1a1aa;
                }
                .lab-article-content li strong {
                    color: #fff;
                }
            `}</style>
        </main>
    );
}
