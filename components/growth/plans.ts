export const GROWTH_PLANS = {
    foundation: {
        name: 'Foundation Protocol',
        tasks: [
            { title: 'Configurar Google Analytics 4', category: 'Setup', is_recurring: false },
            { title: 'Configurar Google Search Console', category: 'SEO', is_recurring: false },
            { title: 'Verificar Google My Business', category: 'SEO', is_recurring: false },
            { title: 'Instalar Meta Pixel', category: 'Setup', is_recurring: false },
            { title: 'Optimizar Títulos y Metas (Home)', category: 'SEO', is_recurring: false },
        ]
    },
    velocity: {
        name: 'Velocity Engine',
        tasks: [
            { title: 'Auditoría Mensual de Campañas', category: 'Ads', is_recurring: true, recurrence: 'monthly' },
            { title: 'Crear 4 Anuncios Nuevos (A/B Test)', category: 'Ads', is_recurring: true, recurrence: 'monthly' },
            { title: 'Reporte de Rendimiento Mensual', category: 'Reporting', is_recurring: true, recurrence: 'monthly' },
            { title: 'Optimizar Landing Page Principal', category: 'CRO', is_recurring: false },
            { title: 'Secuencia de Email (Bienvenida)', category: 'Email', is_recurring: false },
        ]
    },
    dominance: {
        name: 'Dominance Matrix',
        tasks: [
            { title: 'Reunión de Estrategia Quincenal', category: 'Strategy', is_recurring: true, recurrence: 'weekly' },
            { title: 'Producción de 4 Videos Cortos', category: 'Content', is_recurring: true, recurrence: 'monthly' },
            { title: 'Redacción Artículo SEO "Power Page"', category: 'Content', is_recurring: true, recurrence: 'monthly' },
            { title: 'Optimización CRM & Lead Scoring', category: 'CRM', is_recurring: false },
            { title: 'Configurar Server-Side Tracking (CAPI)', category: 'Dev', is_recurring: false },
        ]
    }
};
