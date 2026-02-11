// Style Presets para Conversion Badges
// 4 combinaciones: Premium/Direct x Light/Dark

export type BadgeStylePreset = 'premium-light' | 'premium-dark' | 'direct-light' | 'direct-dark';

export interface BadgeStyle {
    // Bestseller Badge
    bestseller: {
        bg: string;
        text: string;
        icon: string;
        label: string;
        animate: boolean;
    };
    // Low Stock Badge
    lowStock: {
        bg: string;
        text: string;
        icon: string;
        labelPrefix: string;
        animate: boolean;
    };
    // Viewers Count
    viewers: {
        text: string;
        icon: string;
    };
    // Trust Bar
    trustBar: {
        bg: string;
        text: string;
    };
}

export const BADGE_STYLES: Record<BadgeStylePreset, BadgeStyle> = {
    // 1. Premium Light (Joyería, Boutique, Lujo)
    'premium-light': {
        bestseller: {
            bg: 'bg-gradient-to-r from-amber-100 to-yellow-50',
            text: 'text-amber-900',
            icon: 'text-amber-700',
            label: 'Más Elegido',
            animate: false
        },
        lowStock: {
            bg: 'bg-slate-100',
            text: 'text-slate-700',
            icon: 'text-slate-600',
            labelPrefix: 'Disponibilidad Limitada',
            animate: false
        },
        viewers: {
            text: 'text-slate-500',
            icon: 'text-slate-400'
        },
        trustBar: {
            bg: 'bg-slate-50',
            text: 'text-slate-700'
        }
    },

    // 2. Premium Dark (Lujo nocturno, Tech Premium)
    'premium-dark': {
        bestseller: {
            bg: 'bg-gradient-to-r from-amber-900/20 to-yellow-900/10',
            text: 'text-amber-200',
            icon: 'text-amber-300',
            label: 'Más Elegido',
            animate: false
        },
        lowStock: {
            bg: 'bg-slate-800/50',
            text: 'text-slate-300',
            icon: 'text-slate-400',
            labelPrefix: 'Disponibilidad Limitada',
            animate: false
        },
        viewers: {
            text: 'text-slate-400',
            icon: 'text-slate-500'
        },
        trustBar: {
            bg: 'bg-slate-900',
            text: 'text-slate-200'
        }
    },

    // 3. Direct Light (Retail, E-commerce, Ferretería)
    'direct-light': {
        bestseller: {
            bg: 'bg-yellow-500',
            text: 'text-white',
            icon: 'text-white',
            label: 'Bestseller',
            animate: false
        },
        lowStock: {
            bg: 'bg-red-500',
            text: 'text-white',
            icon: 'text-white',
            labelPrefix: '⚠️ Solo quedan',
            animate: true // pulse animation
        },
        viewers: {
            text: 'text-gray-500',
            icon: 'text-gray-400'
        },
        trustBar: {
            bg: 'bg-gray-900',
            text: 'text-white'
        }
    },

    // 4. Direct Dark (E-commerce nocturno, Gaming, Tech)
    'direct-dark': {
        bestseller: {
            bg: 'bg-yellow-400',
            text: 'text-gray-900',
            icon: 'text-gray-900',
            label: 'Bestseller',
            animate: false
        },
        lowStock: {
            bg: 'bg-red-600',
            text: 'text-white',
            icon: 'text-white',
            labelPrefix: '⚠️ Solo quedan',
            animate: true
        },
        viewers: {
            text: 'text-gray-400',
            icon: 'text-gray-500'
        },
        trustBar: {
            bg: 'bg-gray-950',
            text: 'text-gray-100'
        }
    }
};

export function getBadgeStyle(preset: BadgeStylePreset): BadgeStyle {
    return BADGE_STYLES[preset];
}
