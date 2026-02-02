
export type FactorySectionType = 'hero' | 'problem' | 'proof' | 'features' | 'faq' | 'cta';

export interface FactorySection {
    id: string;
    type: FactorySectionType;
    visible: boolean;
    content: any;
}

export interface LandingConfig {
    id?: string;
    slug: string;
    title: string;
    description?: string;
    sections: FactorySection[];
    is_active: boolean;
    primary_color?: string;
}

export const DEFAULT_LP_STRUCTURE: FactorySection[] = [
    {
        id: 'hero_1',
        type: 'hero',
        visible: true,
        content: {
            title: 'Título Maestro de tu Campaña',
            subtitle: 'Explica el beneficio principal aquí. Sé claro y directo.',
            cta_text: '¡Quiero Saber Más!',
            image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'
        }
    },
    {
        id: 'proof_1',
        type: 'proof',
        visible: true,
        content: {
            title: 'Lo que dicen de nosotros',
            testimonials: [
                { name: 'Juan Pérez', text: 'Excelente servicio, cumplió todas mis expectativas.', stars: 5 },
                { name: 'María García', text: 'Rápido y profesional. Muy recomendable.', stars: 5 }
            ]
        }
    },
    {
        id: 'cta_1',
        type: 'cta',
        visible: true,
        content: {
            title: '¿Listo para el siguiente paso?',
            subtitle: 'Haz clic abajo y hablemos por WhatsApp.',
            cta_text: 'Contactar Ahora',
            whatsapp_number: ''
        }
    }
];
