
'use client';

import { FactorySection } from '@/types/factory';
import FactoryHero from './sections/FactoryHero';
import FactoryProof from './sections/FactoryProof';
import FactoryCta from './sections/FactoryCta';
// Import other sections as we build them...

interface SectionRendererProps {
    section: FactorySection;
    primaryColor?: string;
}

export default function SectionRenderer({ section, primaryColor }: SectionRendererProps) {
    if (!section.visible) return null;

    switch (section.type) {
        case 'hero':
            return <FactoryHero content={section.content} primaryColor={primaryColor} />;
        case 'proof':
            return <FactoryProof content={section.content} primaryColor={primaryColor} />;
        case 'cta':
            return <FactoryCta content={section.content} primaryColor={primaryColor} />;
        default:
            return (
                <div className="py-20 text-center border border-dashed border-white/10 text-gray-500">
                    Sección "{section.type}" en desarrollo
                </div>
            );
    }
}
