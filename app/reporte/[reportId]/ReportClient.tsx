'use client';

import { useEffect } from 'react';
import { ReportHero } from './components/ReportHero';
import { EcosistemaSection } from './components/EcosistemaSection';
import { DemografiaSection } from './components/DemografiaSection';
import { FlujosSection } from './components/FlujosSection';
import { CompetenciaSection } from './components/CompetenciaSection';
import { VeredictoSection } from './components/VeredictoSection';
import { DigitalSection } from './components/DigitalSection';
import { MapExplorationSection } from './components/MapExplorationSection';
import { CTASection } from './components/CTASection';

interface ReportClientProps {
    report: any;
}

export function ReportClient({ report }: ReportClientProps) {
    // Smooth scroll behavior
    useEffect(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
        return () => {
            document.documentElement.style.scrollBehavior = 'auto';
        };
    }, []);

    const analysis = report.analysis || {};

    // Extract coordinates from JSONB field
    const coordinates = report.coordinates || {};
    const lat = coordinates.lat || report.lat;
    const lng = coordinates.lng || report.lng;

    return (
        <main className="bg-black text-white">
            {/* Hero */}
            <ReportHero
                address={report.address}
                businessType={report.business_type}
                createdAt={report.created_at}
                mapUrl={report.map_url}
                lat={lat}
                lng={lng}
                competitors={report.dimensiones?.restaurants || []}
            />

            {/* Ecosistema */}
            {analysis.ecosistema && (
                <EcosistemaSection data={analysis.ecosistema} />
            )}

            {/* Demografía */}
            {analysis.demografia && (
                <DemografiaSection data={analysis.demografia} />
            )}

            {/* Flujos */}
            {analysis.flujos && (
                <FlujosSection
                    data={analysis.flujos}
                    anchors_fallback={report.dimensiones?.anchors_comerciales || report.dimensiones?.anchors}
                />
            )}

            {/* Competencia */}
            {analysis.competencia && (
                <CompetenciaSection
                    data={{
                        ...analysis.competencia,
                        categorias: report.dimensiones?.saturation?.byCategory,
                        tiers: report.dimensiones?.saturation?.tiers
                    }}
                />
            )}

            {/* Exploración Territorial Interactiva */}
            {(lat && lng) && (
                <MapExplorationSection
                    lat={lat}
                    lng={lng}
                    address={report.address}
                    competitors={report.dimensiones?.restaurants || []}
                />
            )}

            {/* Veredicto */}
            {analysis.veredicto && (
                <VeredictoSection data={analysis.veredicto} />
            )}

            {/* Digital */}
            {analysis.digital && (
                <DigitalSection data={analysis.digital} />
            )}

            {/* CTA */}
            <CTASection />
        </main>
    );
}
