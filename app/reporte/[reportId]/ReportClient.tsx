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

// Plan 350k Components
import { AuditoriaDigitalProfundaSection } from './components/plan350k/AuditoriaDigitalProfundaSection';
import { AnalisisAlgoritmosSection } from './components/plan350k/AnalisisAlgoritmosSection';
import { MatrizRiesgoSection } from './components/plan350k/MatrizRiesgoSection';
import { EstrategiaLanzamientoSection } from './components/plan350k/EstrategiaLanzamientoSection';
import { ProyeccionFinancieraSection } from './components/plan350k/ProyeccionFinancieraSection';

// Plan 600k Components
import { MacroEntornoSection } from './components/plan600k/MacroEntornoSection';
import { InteligenciaMercadoSection } from './components/plan600k/InteligenciaMercadoSection';
import { FactibilidadNormativaSection } from './components/plan600k/FactibilidadNormativaSection';
import { EscenariosDesarrolloSection } from './components/plan600k/EscenariosDesarrolloSection';
import { ModeloFinancieroSection } from './components/plan600k/ModeloFinancieroSection';
import { StressTestSection } from './components/plan600k/StressTestSection';
import { EstrategiaSalidaSection } from './components/plan600k/EstrategiaSalidaSection';

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

            {/* ========== PLAN 350K - SECCIONES ESTRATÉGICAS ========== */}
            {report.plan_type >= 2 && (
                <>
                    {/* Auditoría Digital Profunda */}
                    {analysis.auditoria_digital && (
                        <AuditoriaDigitalProfundaSection data={analysis.auditoria_digital} />
                    )}

                    {/* Análisis de Algoritmos */}
                    {analysis.analisis_algoritmos && (
                        <AnalisisAlgoritmosSection data={analysis.analisis_algoritmos} />
                    )}

                    {/* Matriz de Riesgo */}
                    {analysis.matriz_riesgo && (
                        <MatrizRiesgoSection data={analysis.matriz_riesgo} />
                    )}

                    {/* Estrategia de Lanzamiento */}
                    {analysis.estrategia_lanzamiento && (
                        <EstrategiaLanzamientoSection data={analysis.estrategia_lanzamiento} />
                    )}

                    {/* Proyección Financiera */}
                    {analysis.proyeccion_financiera && (
                        <ProyeccionFinancieraSection data={analysis.proyeccion_financiera} />
                    )}
                </>
            )}

            {/* ========== PLAN 600K - SECCIONES DE INVERSIÓN ========== */}
            {report.plan_type >= 3 && (
                <>
                    {/* Macro-Entorno */}
                    {analysis.macro_entorno && (
                        <MacroEntornoSection data={analysis.macro_entorno} />
                    )}

                    {/* Inteligencia de Mercado */}
                    {analysis.inteligencia_mercado && (
                        <InteligenciaMercadoSection data={analysis.inteligencia_mercado} />
                    )}

                    {/* Factibilidad Normativa */}
                    {analysis.factibilidad_normativa && (
                        <FactibilidadNormativaSection data={analysis.factibilidad_normativa} />
                    )}

                    {/* Escenarios de Desarrollo */}
                    {analysis.escenarios_desarrollo && (
                        <EscenariosDesarrolloSection data={analysis.escenarios_desarrollo} />
                    )}

                    {/* Modelo Financiero */}
                    {analysis.modelo_financiero && (
                        <ModeloFinancieroSection data={analysis.modelo_financiero} />
                    )}

                    {/* Stress Test */}
                    {analysis.stress_test && (
                        <StressTestSection data={analysis.stress_test} />
                    )}

                    {/* Estrategia de Salida */}
                    {analysis.estrategia_salida && (
                        <EstrategiaSalidaSection data={analysis.estrategia_salida} />
                    )}
                </>
            )}

            {/* CTA */}
            <CTASection />
        </main>
    );
}
