import { MetadataRoute } from 'next'
import { allArticles as articles } from './lab/articles'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://hojacero.cl'

    // Core pages
    const routes = [
        '',
        '/pricing',
        '/login',
        '/vision',
        '/design-lab',
        '/lab',
        '/about',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Service landing pages (satellite — indexed but not in navbar)
    const servicePages = [
        '/servicios/paginas-web-chile',
        '/servicios/desarrollo-apps',
        '/servicios/marketing-digital',
        '/servicios/tienda-online',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }))

    // Case study pages
    const caseStudies = [
        '/casos/acargoo',
        '/casos/vuelve-fidelizacion',
        '/casos/pluscontable',
        '/casos/caprex',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    // Blog articles (SEO transactional)
    const blogArticles = [
        '/blog',
        '/blog/mejores-agencias-diseno-web-chile-2026',
        '/blog/wordpress-vs-desarrollo-a-medida',
        '/blog/como-elegir-agencia-marketing-digital',
        '/blog/guia-digitalizar-negocio-chile',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '/blog' ? 0.8 : 0.7,
    }))

    // Lab articles
    const labArticles = articles.map((article) => ({
        url: `${baseUrl}/lab/${article.slug}`,
        lastModified: new Date(article.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    return [...routes, ...servicePages, ...caseStudies, ...blogArticles, ...labArticles]
}
