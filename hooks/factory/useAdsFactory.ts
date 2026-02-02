
'use client';

import { useState } from 'react';
import { LandingConfig, FactorySection, DEFAULT_LP_STRUCTURE } from '@/types/factory';

export function useAdsFactory(initialData?: LandingConfig) {
    const [config, setConfig] = useState<LandingConfig>(initialData || {
        slug: '',
        title: '',
        sections: DEFAULT_LP_STRUCTURE,
        is_active: true,
        primary_color: '#00f0ff'
    });

    const updateSection = (id: string, updates: Partial<FactorySection>) => {
        setConfig(prev => ({
            ...prev,
            sections: prev.sections.map(s => s.id === id ? { ...s, ...updates } : s)
        }));
    };

    const updateContent = (sectionId: string, key: string, value: any) => {
        setConfig(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s.id === sectionId
                    ? { ...s, content: { ...s.content, [key]: value } }
                    : s
            )
        }));
    };

    const reorderSections = (newOrder: FactorySection[]) => {
        setConfig(prev => ({ ...prev, sections: newOrder }));
    };

    return {
        config,
        setConfig,
        updateSection,
        updateContent,
        reorderSections
    };
}
