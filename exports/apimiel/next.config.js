/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Default to static export for maximum portability? Or standalone? 
    // User requested standalone site. 'output: export' = static HTML. 
    // 'standalone' usually refers to 'output: standalone' for docker, or just a standard nextjs app.
    // Given description, usually it's standard build or static export. 
    // Let's stick to standard build for Vercel unless user wants static.
    // The previous workflow said "output: export", so let's keep that but comment it if they want dynamic features.
    // Actually, for Vercel, no config is needed usually.
    // But let's add minimal config.
    images: {
        unoptimized: true, // Needed for static export if used
    }
};

module.exports = nextConfig;
