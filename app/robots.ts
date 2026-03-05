import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            // Default rule for all bots
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/dashboard/', '/api/', '/admin/', '/internal/'],
            },
            // AI Bot crawlers — explicit allow for AEO/GEO strategy
            {
                userAgent: 'GPTBot',
                allow: '/',
                disallow: ['/dashboard/', '/api/', '/admin/'],
            },
            {
                userAgent: 'Google-Extended',
                allow: '/',
            },
            {
                userAgent: 'ClaudeBot',
                allow: '/',
                disallow: ['/dashboard/', '/api/', '/admin/'],
            },
            {
                userAgent: 'PerplexityBot',
                allow: '/',
            },
            {
                userAgent: 'Applebot-Extended',
                allow: '/',
            },
            {
                userAgent: 'CCBot',
                allow: '/',
            },
        ],
        sitemap: 'https://hojacero.cl/sitemap.xml',
    }
}
