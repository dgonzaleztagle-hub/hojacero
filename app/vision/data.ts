export interface CaseStudy {
    id: string;
    client: string;
    type: 'deployed' | 'concept';
    year: string;
    description: string;
    tags: string[];
    imageAfter: string;
    accentColor: string;
    viewUrl: string;
    imageBefore?: string;
    imageBeforeHero?: string;
    imageAfterHero?: string;
    stats?: {
        improvement: string;
        metric: string;
    };
}

export const CASES: CaseStudy[] = [
    {
        id: 'apimiel',
        client: 'APIMIEL',
        type: 'deployed',
        year: '2026',
        description: 'De envase genérico a "Arquitectura Líquida". Transformamos la venta de miel en una experiencia de viscosidad premium.',
        tags: ['E-Commerce', 'Store Engine', '3D'],
        imageAfter: '/prospectos/apimiel/apimiel_hero_clean.png',
        accentColor: '#fbbf24',
        viewUrl: '/prospectos/apimiel'
    },
    {
        id: 'biocrom',
        client: 'BIOCROM',
        type: 'deployed',
        year: '2026',
        description: 'La ciencia de la precisión técnica. Una interfaz diseñada para transmitir rigor analítico y confianza industrial.',
        tags: ['Industrial', 'Bento Grid', 'Laboratorio'],
        imageAfter: '/biocrom_hero.png',
        accentColor: '#ef4444',
        viewUrl: '/prospectos/biocrom'
    },
    {
        id: 'donde-germain',
        client: 'DONDE GERMAIN',
        type: 'deployed',
        year: '2026',
        description: 'Food Engine en acción. Sistema de pedidos interactivo que triplicó la conversión digital del restaurante.',
        tags: ['Food Tech', 'Ecommerce', 'Tracking'],
        imageAfter: '/germain_pwa_icon.jpg',
        accentColor: '#f97316',
        viewUrl: '/prospectos/donde-germain'
    },
    {
        id: 'reparapads',
        client: 'REPARAPADS',
        type: 'deployed',
        year: '2026',
        description: 'Optimización de servicios técnicos. Una landing quirúrgica para un servicio de reparación de alta gama.',
        tags: ['Tech Service', 'Lead Gen', 'Minimal'],
        imageAfter: '/og-image.jpg',
        accentColor: '#3b82f6',
        viewUrl: '/prospectos/reparpads'
    },
    {
        id: 'mitifuu',
        client: 'MITIFUU',
        type: 'deployed',
        year: '2026',
        description: 'Evolución del Food Engine v3. Diseño inmersivo para gastronomía de autor con pedidos en tiempo real.',
        tags: ['Gastronomía', 'Realtime', 'UI/UX'],
        imageAfter: '/logo-h0-hybrid.png',
        accentColor: '#10b981',
        viewUrl: '/prospectos/mitifuu-v3'
    },
    {
        id: 'family-smile',
        client: 'FAMILY SMILE',
        type: 'deployed',
        year: '2026',
        description: 'Humanizing Healthcare. Una experiencia dental que elimina la fricción y genera autoridad instantánea.',
        tags: ['Health', 'Booking', 'Trust'],
        imageAfter: '/logo.png',
        accentColor: '#06b6d4',
        viewUrl: '/prospectos/family-smile-v3'
    }
];
