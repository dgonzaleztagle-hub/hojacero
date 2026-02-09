'use client';

/**
 * Vista de impresión del reporte territorial
 * Versión simplificada sin animaciones para generación de PDF
 */

interface ReportPrintViewProps {
    report: any;
}

export default function ReportPrintView({ report }: ReportPrintViewProps) {
    const analysis = report.analysis;

    return (
        <div className="bg-white text-black p-8 max-w-[210mm] mx-auto">
            {/* Portada */}
            <div className="text-center mb-12 page-break-after">
                <h1 className="text-4xl font-bold mb-4">
                    Reporte de Inteligencia Territorial
                </h1>
                <p className="text-xl mb-2">{report.address}</p>
                <p className="text-lg text-gray-600 mb-8">
                    Plan {report.plan_type === 1 ? 'Validación Rápida' : 'Premium'}
                </p>
                <div className="mt-16">
                    <p className="text-2xl font-bold">HojaCero Intelligence</p>
                    <p className="text-gray-600">Datos que construyen negocios</p>
                </div>
            </div>

            {/* Mapa */}
            {report.map_url && (
                <div className="mb-12 page-break-after">
                    <h2 className="text-2xl font-bold mb-4">Mapa Territorial</h2>
                    <img
                        src={report.map_url}
                        alt="Mapa territorial"
                        className="w-full h-auto"
                    />
                </div>
            )}

            {/* Resumen Ejecutivo */}
            {analysis?.resumen_ejecutivo && (
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Resumen Ejecutivo</h2>
                    <div className="mb-4">
                        <p className="text-lg">
                            <strong>Score de Viabilidad:</strong> {analysis.resumen_ejecutivo.score_viabilidad}/10
                        </p>
                        <p className="text-lg">
                            <strong>Nivel de Riesgo:</strong> {analysis.resumen_ejecutivo.nivel_riesgo}
                        </p>
                    </div>
                    <p className="text-gray-800 leading-relaxed">
                        {analysis.resumen_ejecutivo.vision_general}
                    </p>
                </div>
            )}

            {/* Ecosistema */}
            {analysis?.ecosistema && (
                <div className="mb-12 page-break-before">
                    <h2 className="text-2xl font-bold mb-4">Ecosistema del Barrio</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold">Tipo de Zona</h3>
                            <p>{analysis.ecosistema.tipo_zona}</p>
                        </div>
                        <div>
                            <h3 className="font-bold">Dinámica</h3>
                            <p className="whitespace-pre-line">{analysis.ecosistema.dinamica}</p>
                        </div>
                        {analysis.ecosistema.conectividad && (
                            <div>
                                <h3 className="font-bold">Conectividad</h3>
                                <p className="whitespace-pre-line">{analysis.ecosistema.conectividad}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Demografía */}
            {analysis?.demografia && (
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Cliente Objetivo</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold">Perfil Principal</h3>
                            <p className="whitespace-pre-line">{analysis.demografia.perfil_principal}</p>
                        </div>
                        <div>
                            <h3 className="font-bold">Poder Adquisitivo</h3>
                            <p className="whitespace-pre-line">{analysis.demografia.poder_adquisitivo}</p>
                        </div>
                        <div>
                            <h3 className="font-bold">Densidad</h3>
                            <p>{analysis.demografia.densidad}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Competencia */}
            {analysis?.competencia && (
                <div className="mb-12 page-break-before">
                    <h2 className="text-2xl font-bold mb-4">Análisis de Competencia</h2>
                    <div className="space-y-4">
                        {Object.entries(analysis.competencia).map(([key, value]) => {
                            if (typeof value === 'string' && value.trim()) {
                                return (
                                    <div key={key}>
                                        <p className="whitespace-pre-line">{value}</p>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            )}

            {/* Plan 2 Premium - Secciones Adicionales */}
            {report.plan_type >= 2 && (
                <>
                    {/* Proyección Financiera */}
                    {analysis?.proyeccion_financiera && (
                        <div className="mb-12 page-break-before">
                            <h2 className="text-2xl font-bold mb-4">Proyección Financiera</h2>
                            {analysis.proyeccion_financiera.disclaimer && (
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                                    <p className="text-sm">{analysis.proyeccion_financiera.disclaimer}</p>
                                </div>
                            )}
                            <div className="space-y-2">
                                <p><strong>Ticket Promedio:</strong> ${analysis.proyeccion_financiera.ticket_promedio?.toLocaleString('es-CL')} CLP</p>
                                <p><strong>Venta Mensual:</strong> ${analysis.proyeccion_financiera.venta_mensual?.toLocaleString('es-CL')} CLP</p>
                            </div>
                        </div>
                    )}

                    {/* Análisis de Inversión */}
                    {analysis?.analisis_inversion && (
                        <>
                            {/* Factibilidad Normativa */}
                            {analysis.analisis_inversion.factibilidad_normativa && (
                                <div className="mb-12 page-break-before">
                                    <h2 className="text-2xl font-bold mb-4">Factibilidad Normativa</h2>
                                    {analysis.analisis_inversion.factibilidad_normativa.disclaimer && (
                                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                                            <p className="text-sm">{analysis.analisis_inversion.factibilidad_normativa.disclaimer}</p>
                                        </div>
                                    )}
                                    <div className="space-y-4">
                                        {analysis.analisis_inversion.factibilidad_normativa.zonificacion_estimada && (
                                            <div>
                                                <h3 className="font-bold">Zonificación Estimada</h3>
                                                <p className="whitespace-pre-line">{analysis.analisis_inversion.factibilidad_normativa.zonificacion_estimada}</p>
                                            </div>
                                        )}
                                        {analysis.analisis_inversion.factibilidad_normativa.aptitud_comercial && (
                                            <div>
                                                <h3 className="font-bold">Aptitud Comercial</h3>
                                                <p className="whitespace-pre-line">{analysis.analisis_inversion.factibilidad_normativa.aptitud_comercial}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Modelo Financiero */}
                            {analysis.analisis_inversion.modelo_financiero && (
                                <div className="mb-12">
                                    <h2 className="text-2xl font-bold mb-4">Modelo Financiero</h2>
                                    {analysis.analisis_inversion.modelo_financiero.disclaimer && (
                                        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                                            <p className="text-sm">{analysis.analisis_inversion.modelo_financiero.disclaimer}</p>
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <p><strong>Cap Rate:</strong> {analysis.analisis_inversion.modelo_financiero.cap_rate}%</p>
                                        <p><strong>Interpretación:</strong> {analysis.analisis_inversion.modelo_financiero.interpretacion_cap_rate}</p>
                                        {analysis.analisis_inversion.modelo_financiero.nota_importante && (
                                            <p className="text-sm italic mt-4">{analysis.analisis_inversion.modelo_financiero.nota_importante}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            {/* Conclusión */}
            {analysis?.conclusion && (
                <div className="mb-12 page-break-before">
                    <h2 className="text-2xl font-bold mb-4">Conclusión</h2>
                    <div className="space-y-4">
                        <p className="text-lg font-bold">Veredicto: {analysis.conclusion.veredicto}</p>
                        <p className="whitespace-pre-line">{analysis.conclusion.mensaje}</p>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="mt-16 pt-8 border-t-2 border-gray-300 text-center">
                <p className="text-xl font-bold">HojaCero Intelligence</p>
                <p className="text-gray-600">Datos que construyen negocios</p>
                <p className="text-sm text-gray-500 mt-2">www.hojacero.cl</p>
            </div>

            <style jsx global>{`
                @media print {
                    .page-break-before {
                        page-break-before: always;
                    }
                    .page-break-after {
                        page-break-after: always;
                    }
                }
            `}</style>
        </div>
    );
}
