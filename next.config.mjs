/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['images.unsplash.com'],
        formats: ['image/avif', 'image/webp'],
    },
    // Parche para Chromium en Vercel
    serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
    outputFileTracingIncludes: {
        '/api/analyze': ['./node_modules/@sparticuz/chromium/bin/*'],
    },
};

export default nextConfig;
