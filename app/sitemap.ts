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
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Lab articles
    const labArticles = articles.map((article) => ({
        url: `${baseUrl}/lab/${article.slug}`,
        lastModified: new Date(article.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    return [...routes, ...labArticles]
}
