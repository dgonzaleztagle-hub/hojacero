export interface CaseStudy {
    id: string;
    client: string;
    type: 'deployed' | 'concept';
    year: string;
    description: string;
    tags: string[];
    imageBefore: string;
    imageAfter: string;
    coverImage?: string;       // New: Specific for Bento Grid
    imageBeforeHero?: string;  // New: Specific for Slider (alignment)
    imageAfterHero?: string;   // New: Specific for Slider (alignment)
    stats: {
        improvement: string;
        metric: string;
    };
    viewUrl?: string;
    bentoSize?: 'small' | 'medium' | 'large'; // md:col-span-4, 8, or 12
    highlight?: boolean;
}

export const CASES: CaseStudy[] = [
    {
        id: 'apimiel',
        client: 'APIMIEL',
        type: 'deployed',
        year: '2026',
        description: 'De envase genérico a "Arquitectura Líquida". Transformamos la venta de miel en una experiencia de viscosidad premium.',
        tags: ['E-Commerce', 'Liquid FX', '3D'],
        imageBefore: '/prospectos/apimiel/apimiel_before.png',
        imageAfter: '/prospectos/apimiel/apimiel_after_full.png', // Full Scroll
        coverImage: '/prospectos/apimiel/apimiel_hero_clean.png', // Clean Hero
        imageBeforeHero: '/prospectos/apimiel/apimiel_before.png', // Standard crop
        imageAfterHero: '/prospectos/apimiel/apimiel_hero_clean.png', // Clean Hero match
        stats: { improvement: '+140%', metric: 'Time on Site' },
        viewUrl: '/prospectos/apimiel',
        bentoSize: 'large',
        highlight: true
    },
    /*
    {
        id: '360sports',
        client: '360 SPORTS',
        type: 'concept',
        year: '2025',
        description: 'Propuesta conceptual para elevar la adrenalina visual. Grid reactivo y tipografía cinética.',
        tags: ['Sports', 'Kinetic Type', 'Booking'],
        imageBefore: 'https://placehold.co/1920x1080/000000/222222/png?text=OLD+BOOKING+SYSTEM',
        imageAfter: 'https://placehold.co/1920x1080/003300/00ff00/png?text=HOJACERO+VISION:+NEON+TURF',
        stats: { improvement: '∞', metric: 'Aura Increase' },
        viewUrl: '#',
        bentoSize: 'medium',
        highlight: true
    },
    {
        id: 'neural-law',
        client: 'NEURAL LAW',
        type: 'concept',
        year: '2025',
        description: 'Bufete de abogados automatizado. Eliminamos el papel y trajimos la justicia al ciberespacio.',
        tags: ['Legal', 'Minimal', 'Typography'],
        imageBefore: 'https://placehold.co/1920x1080/111/444/png?text=Legacy+Law+Firm',
        imageAfter: 'https://placehold.co/1920x1080/101010/303030/png?text=NEURAL+LAW+INTERFACE',
        stats: { improvement: '-90%', metric: 'Paper Usage' },
        viewUrl: '#',
        bentoSize: 'small'
    },
    {
        id: 'quantum-logistics',
        client: 'Q-LOGISTICS',
        type: 'concept',
        year: '2025',
        description: 'Logística cuántica. Dashboard de control en tiempo real con visualización de datos masivos.',
        tags: ['Logistics', 'Dashboard', 'WebGL'],
        imageBefore: 'https://placehold.co/1920x1080/222/555/png?text=Excel+Spreadsheet',
        imageAfter: 'https://placehold.co/1920x1080/001133/0066cc/png?text=QUANTUM+DATA+VISUALIZER',
        stats: { improvement: 'Realtime', metric: 'Tracking' },
        viewUrl: '#',
        bentoSize: 'small'
    },
    {
        id: 'biocore',
        client: 'BIOCORE',
        type: 'concept',
        year: '2025',
        description: 'Investigación biotecnológica. Estética de laboratorio limpio con micro-interacciones orgánicas.',
        tags: ['BioTech', 'Clean', 'Medical'],
        imageBefore: 'https://placehold.co/1920x1080/eee/fff/png?text=Old+Medical+Site',
        imageAfter: 'https://placehold.co/1920x1080/e0f7fa/006064/png?text=BIOCORE+LAB+VISUALS',
        stats: { improvement: '100%', metric: 'Sterility' },
        viewUrl: '#',
        bentoSize: 'medium'
    },
    {
        id: 'cryptovault',
        client: 'CRYPTO VAULT',
        type: 'concept',
        year: '2025',
        description: 'Billetera fría de alta seguridad. Diseño brutalista y encriptación visual.',
        tags: ['Fintech', 'Brutalism', 'Security'],
        imageBefore: 'https://placehold.co/1920x1080/333/444/png?text=Bank+UI',
        imageAfter: 'https://placehold.co/1920x1080/000/fff/png?text=CRYPTO+VAULT+BRUTALISM',
        stats: { improvement: 'Max', metric: 'Security' },
        viewUrl: '#',
        bentoSize: 'medium'
    }
    */
];
