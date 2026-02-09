'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Zap, FileText, TrendingUp, Users, Building2,
    Shield, Download, Loader2, CheckCircle2, AlertCircle,
    ChevronRight, Sparkles, Target, BarChart3,
    ShoppingCart, Activity, ShoppingBag, Scissors, Coffee,
    Car, Train, Clock, DollarSign, AlertTriangle, Lightbulb,
    Rocket, TrendingDown, Star, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateTerritorialPDF } from '@/lib/pdf-generator';

const PLANS = [
    {
        id: 1,
        name: 'Validación Rápida',
        price: '$150.000',
        description: 'Viabilidad en 6 secciones',
        icon: Target,
        color: 'from-blue-600 to-cyan-600',
        features: ['Ecosistema del barrio', 'Demografía objetivo', 'Flujos y visibilidad', 'Scan de competencia', 'Veredicto ejecutivo', 'Estrategia digital']
    },
    {
        id: 2,
        name: 'Plan Premium',
        price: '$400.000',
        description: 'Estrategia + Inversión completa',
        icon: TrendingUp,
        color: 'from-purple-600 to-pink-600',
        features: [
            '✅ Todo lo de Plan 1',
            '📊 Análisis Comercial Profundo:',
            '  • Avatar profundo del cliente',
            '  • Auditoría digital competidores',
            '  • Matriz de riesgo 🚦',
            '  • Estrategia de lanzamiento',
            '  • Proyección financiera',
            '💰 Análisis de Inversión:',
            '  • Factibilidad normativa',
            '  • Modelo financiero (Cap Rate, NOI)',
            '  • Tenant mix recomendado'
        ],
        popular: true
    }
];

const BUSINESS_TYPES = [
    // Gastronomía (con Smart Hunting)
    { id: 'restaurant', name: 'Restaurante', icon: Building2 },
    { id: 'cafe', name: 'Cafetería', icon: Coffee },
    { id: 'fast_food', name: 'Comida Rápida', icon: Building2 },

    // Retail
    { id: 'supermarket', name: 'Minimarket', icon: ShoppingCart },
    { id: 'pharmacy', name: 'Farmacia', icon: Shield },
    { id: 'clothes', name: 'Ropa', icon: ShoppingBag },
    { id: 'hardware', name: 'Ferretería', icon: Building2 },
    { id: 'bookstore', name: 'Librería', icon: Building2 },
    { id: 'optics', name: 'Óptica', icon: Building2 },

    // Servicios Personales
    { id: 'hairdresser', name: 'Peluquería', icon: Scissors },
    { id: 'gym', name: 'Gimnasio', icon: Activity },
    { id: 'beauty', name: 'Centro de Estética', icon: Scissors },
    { id: 'veterinary', name: 'Veterinaria', icon: Building2 },

    // Servicios Profesionales
    { id: 'dental', name: 'Clínica Dental', icon: Shield },
    { id: 'medical', name: 'Centro Médico', icon: Shield },
    { id: 'car_service', name: 'Taller Mecánico', icon: Car },
    { id: 'laundry', name: 'Lavandería', icon: Building2 },

    // Otros Comercios
    { id: 'bakery', name: 'Panadería', icon: Building2 },
    { id: 'pet_store', name: 'Tienda de Mascotas', icon: Building2 },
    { id: 'florist', name: 'Floristería', icon: Building2 }
];

interface Report {
    id: string;
    address: string;
    plan_type: number;
    comuna?: string;
    coordinates?: { lat: number; lng: number };
    map_url?: string; // URL del mapa estático
    dimensiones?: any;
    analysis?: any;
}

// ============================================
// COMPONENTES DE REPORTE POR PLAN
// ============================================

const ReportPlan1 = ({ analysis, dimensiones, mapUrl }: { analysis: any; dimensiones: any; mapUrl?: string }) => {
    console.log('🔍 Analysis recibido:', analysis);
    if (!analysis) return null;

    // Si no hay secciones estructuradas, mostrar el JSON raw para debug
    const hasSections = analysis.ecosistema || analysis.demografia || analysis.veredicto;
    if (!hasSections) {
        return (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                <p className="text-yellow-400 font-bold mb-2">⚠️ Debug: Estructura inesperada en análisis</p>
                <pre className="text-xs text-zinc-400 overflow-auto max-h-96">{JSON.stringify(analysis, null, 2)}</pre>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Ecosistema */}
            {analysis.ecosistema && (
                <Section
                    icon={<MapPin className="w-6 h-6 text-blue-400" />}
                    title={analysis.ecosistema.titulo || "El Ecosistema"}
                    gradient="from-blue-600/20 to-cyan-600/20"
                    border="border-blue-500/30"
                >
                    <div className="space-y-2">
                        <Badge color="blue">{analysis.ecosistema.tipo_zona}</Badge>
                        <p className="text-sm text-zinc-300 leading-relaxed">{analysis.ecosistema.dinamica}</p>
                        <p className="text-xs text-zinc-400">{analysis.ecosistema.conectividad}</p>
                    </div>
                </Section>
            )}

            {/* Mapa Territorial */}
            {mapUrl && (
                <Section
                    icon={<MapPin className="w-5 h-5 text-emerald-400" />}
                    title="Mapa Territorial"
                    gradient="from-emerald-600/20 to-teal-600/20"
                    border="border-emerald-500/30"
                >
                    <div className="rounded-lg overflow-hidden border border-emerald-500/20">
                        <img
                            src={mapUrl}
                            alt="Mapa territorial con ubicación y competidores"
                            className="w-full h-auto min-h-[300px] object-cover"
                        />
                        <div className="bg-zinc-900/50 p-2 text-[10px] text-zinc-400 flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                <span>Tu ubicación</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                <span>Competidores</span>
                            </div>
                        </div>
                    </div>
                </Section>
            )}

            {/* Demografía */}
            {analysis.demografia && (
                <Section
                    icon={<Users className="w-5 h-5 text-purple-400" />}
                    title={analysis.demografia.titulo || "Tu Cliente Objetivo"}
                    gradient="from-purple-600/20 to-pink-600/20"
                    border="border-purple-500/30"
                >
                    <div className="space-y-2.5">
                        <p className="text-sm text-zinc-300 font-medium leading-relaxed">{analysis.demografia.perfil_principal || 'Perfil demográfico en análisis'}</p>
                        <div className="grid grid-cols-2 gap-3">
                            <DataBox label="Poder Adquisitivo" value={analysis.demografia.poder_adquisitivo || dimensiones?.gse?.ingreso || 'N/A'} />
                            <DataBox label="Densidad" value={analysis.demografia.densidad || 'Media-Alta'} />
                        </div>
                        {analysis.demografia.dato_clave && <Insight text={analysis.demografia.dato_clave} />}
                    </div>
                </Section>
            )}

            {/* Flujos */}
            {analysis.flujos && (
                <Section
                    icon={<Car className="w-5 h-5 text-green-400" />}
                    title={analysis.flujos.titulo || "Flujos y Visibilidad"}
                    gradient="from-green-600/20 to-emerald-600/20"
                    border="border-green-500/30"
                >
                    <div className="space-y-2.5">
                        <div className="grid grid-cols-2 gap-3">
                            <DataBox label="Flujo Vehicular" value={analysis.flujos.flujo_vehicular || 'Medio'} />
                            <DataBox label="Flujo Peatonal" value={analysis.flujos.flujo_peatonal || 'Medio-Alto'} />
                        </div>
                        {analysis.flujos.polos_atraccion?.length > 0 && (
                            <div>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5">Polos de Atracción</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {analysis.flujos.polos_atraccion.map((polo: string, i: number) => (
                                        <Badge key={i} color="green">{polo}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Section>
            )}

            {/* Competencia */}
            {analysis.competencia && (
                <Section
                    icon={<Target className="w-5 h-5 text-orange-400" />}
                    title={analysis.competencia.titulo || "Scan de Mercado"}
                    gradient="from-orange-600/20 to-red-600/20"
                    border="border-orange-500/30"
                >
                    <div className="space-y-2.5">
                        <p className="text-sm text-zinc-300 leading-relaxed">{analysis.competencia.analisis_saturacion || 'Análisis de saturación en proceso'}</p>
                        {analysis.competencia.oportunidad && <Insight text={analysis.competencia.oportunidad} isPositive />}
                        {analysis.competencia.riesgo && <Insight text={analysis.competencia.riesgo} isWarning />}
                    </div>
                </Section>
            )}

            {/* Veredicto */}
            {analysis.veredicto && (
                <Section
                    icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    title="Veredicto"
                    gradient="from-emerald-600/30 to-green-600/30"
                    border="border-emerald-500/40"
                >
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <ViabilityBadge level={analysis.veredicto.viabilidad || 'MEDIA'} />
                        </div>
                        <p className="text-sm text-zinc-200 font-medium leading-relaxed">{analysis.veredicto.resumen || 'Evaluación en proceso'}</p>
                        {analysis.veredicto.estrategia_recomendada && (
                            <div className="bg-black/30 rounded-lg p-3 border border-emerald-500/20">
                                <p className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1.5">Estrategia Recomendada</p>
                                <p className="text-sm text-white font-medium leading-relaxed">{analysis.veredicto.estrategia_recomendada}</p>
                            </div>
                        )}
                    </div>
                </Section>
            )}

            {/* Digital */}
            {analysis.digital && (
                <Section
                    icon={<Rocket className="w-5 h-5 text-cyan-400" />}
                    title={analysis.digital.titulo || "Recomendación Digital"}
                    gradient="from-cyan-600/20 to-blue-600/20"
                    border="border-cyan-500/30"
                >
                    <div className="space-y-1.5">
                        {analysis.digital.plan_ataque && analysis.digital.plan_ataque.length > 0 ? (
                            analysis.digital.plan_ataque.map((accion: string, i: number) => (
                                <div key={i} className="flex items-start gap-2 bg-black/20 rounded-lg p-2.5">
                                    <span className="w-5 h-5 rounded-full bg-cyan-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                                    <p className="text-xs text-zinc-300 leading-relaxed">
                                        {typeof accion === 'object' ? (
                                            <>
                                                <span className="font-bold text-cyan-400">{(accion as any).plataforma}:</span> {(accion as any).detalle}
                                            </>
                                        ) : accion}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="bg-cyan-600/10 border border-cyan-500/20 rounded-lg p-3">
                                <p className="text-xs text-cyan-300 leading-relaxed">
                                    💡 Estrategia digital en análisis. Recomendaciones incluirán: presencia en redes sociales, grupos locales, y plataformas de delivery.
                                </p>
                            </div>
                        )}
                    </div>
                </Section>
            )}
        </div>
    );
};

const ReportPlan2 = ({ analysis, dimensiones }: { analysis: any; dimensiones: any }) => {
    if (!analysis) return null;

    return (
        <div className="space-y-6">
            {/* Resumen Ejecutivo */}
            {analysis.resumen_ejecutivo && (
                <Section
                    icon={<Star className="w-6 h-6 text-yellow-400" />}
                    title="Resumen Ejecutivo"
                    gradient="from-yellow-600/20 to-orange-600/20"
                    border="border-yellow-500/30"
                >
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl px-6 py-3">
                                <p className="text-xs text-yellow-200 uppercase">Score Viabilidad</p>
                                <p className="text-3xl font-black text-white">{analysis.resumen_ejecutivo.score_viabilidad}/10</p>
                            </div>
                            <div className="bg-black/40 rounded-2xl px-6 py-3 border border-white/10">
                                <p className="text-xs text-zinc-400 uppercase">Nivel de Riesgo</p>
                                <p className="text-lg font-bold text-white">{analysis.resumen_ejecutivo.nivel_riesgo}</p>
                            </div>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">{analysis.resumen_ejecutivo.vision_general}</p>
                    </div>
                </Section>
            )}

            {/* Demografía Profunda */}
            {analysis.demografia_profunda && (
                <Section
                    icon={<Users className="w-6 h-6 text-purple-400" />}
                    title="Demografía Profunda"
                    gradient="from-purple-600/20 to-pink-600/20"
                    border="border-purple-500/30"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-black/20 rounded-xl p-4 border border-purple-500/20">
                            <p className="text-xs text-purple-400 uppercase tracking-wider mb-2">👤 Avatar Pagador</p>
                            <p className="text-white font-medium mb-1">{analysis.demografia_profunda.avatar_pagador?.descripcion}</p>
                            <p className="text-sm text-zinc-400">{analysis.demografia_profunda.avatar_pagador?.comportamiento}</p>
                        </div>
                        <div className="bg-black/20 rounded-xl p-4 border border-pink-500/20">
                            <p className="text-xs text-pink-400 uppercase tracking-wider mb-2">👥 Avatar Influenciador</p>
                            <p className="text-white font-medium mb-1">{analysis.demografia_profunda.avatar_influenciador?.descripcion}</p>
                            <p className="text-sm text-zinc-400">{analysis.demografia_profunda.avatar_influenciador?.rol}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <DataBox label="Ticket Promedio" value={analysis.demografia_profunda.ticket_promedio_zona} />
                        <DataBox label="Frecuencia" value={analysis.demografia_profunda.frecuencia_compra} />
                    </div>
                </Section>
            )}

            {/* Flujo y Accesibilidad */}
            {analysis.flujo_accesibilidad && (
                <Section
                    icon={<Train className="w-6 h-6 text-green-400" />}
                    title="Flujo y Accesibilidad"
                    gradient="from-green-600/20 to-emerald-600/20"
                    border="border-green-500/30"
                >
                    <div className="space-y-4">
                        <p className="text-zinc-300">{analysis.flujo_accesibilidad.ultima_milla}</p>
                        <p className="text-zinc-400 text-sm">{analysis.flujo_accesibilidad.estacionamiento}</p>
                        {analysis.flujo_accesibilidad.horarios_oro?.length > 0 && (
                            <div>
                                <p className="text-xs text-green-400 uppercase tracking-wider mb-2">⏰ Horarios de Oro</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {analysis.flujo_accesibilidad.horarios_oro.map((h: any, i: number) => (
                                        <div key={i} className="bg-green-600/10 rounded-lg p-3 border border-green-500/20">
                                            <p className="text-white font-bold">{h.hora}</p>
                                            <p className="text-xs text-zinc-400">{h.tipo_venta}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Section>
            )}

            {/* Auditoría Digital */}
            {analysis.auditoria_digital && (
                <Section
                    icon={<Target className="w-6 h-6 text-orange-400" />}
                    title="Auditoría Digital de Competidores"
                    gradient="from-orange-600/20 to-red-600/20"
                    border="border-orange-500/30"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['competidor_1', 'competidor_2'].map((key) => {
                            const comp = analysis.auditoria_digital[key];
                            if (!comp) return null;
                            return (
                                <div key={key} className="bg-black/20 rounded-xl p-4 border border-orange-500/20">
                                    <p className="text-white font-bold mb-2">{comp.nombre}</p>
                                    <p className="text-sm text-zinc-400 mb-2">{comp.presencia}</p>
                                    <p className="text-xs text-red-400">❌ {comp.debilidad}</p>
                                    <p className="text-xs text-green-400 mt-1">✅ {comp.oportunidad}</p>
                                </div>
                            );
                        })}
                    </div>
                    <Insight text={analysis.auditoria_digital.conclusion_digital} isPositive />
                </Section>
            )}

            {/* Matriz de Riesgo */}
            {analysis.matriz_riesgo && (
                <Section
                    icon={<AlertTriangle className="w-6 h-6 text-yellow-400" />}
                    title="Matriz de Riesgo 🚦"
                    gradient="from-yellow-600/20 to-amber-600/20"
                    border="border-yellow-500/30"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(analysis.matriz_riesgo).map(([key, value]: [string, any]) => (
                            <div key={key} className="bg-black/20 rounded-xl p-4 border border-white/10">
                                <p className="text-xs text-zinc-500 uppercase mb-1">{key}</p>
                                <p className="text-lg font-bold text-white mb-1">{value.nivel}</p>
                                <p className="text-xs text-zinc-400">{value.descripcion}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Estrategia de Lanzamiento */}
            {analysis.estrategia_lanzamiento && (
                <Section
                    icon={<Rocket className="w-6 h-6 text-cyan-400" />}
                    title="Estrategia de Lanzamiento"
                    gradient="from-cyan-600/20 to-blue-600/20"
                    border="border-cyan-500/30"
                >
                    <div className="space-y-4">
                        {['fase_1_hype', 'fase_2_marcha_blanca', 'fase_3_retencion'].map((fase) => {
                            const data = analysis.estrategia_lanzamiento[fase];
                            if (!data) return null;
                            return (
                                <div key={fase} className="bg-black/20 rounded-xl p-4 border border-cyan-500/20">
                                    <p className="text-cyan-400 font-bold mb-2">{data.nombre}</p>
                                    <ul className="space-y-1">
                                        {data.acciones?.map((a: string, i: number) => (
                                            <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                                                <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                                                {typeof a === 'object' ? (
                                                    <>
                                                        <span className="font-bold text-cyan-400">{(a as any).plataforma}:</span> {(a as any).detalle}
                                                    </>
                                                ) : a}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </Section>
            )}

            {/* Proyección Financiera */}
            {analysis.proyeccion_financiera && (
                <Section
                    icon={<DollarSign className="w-6 h-6 text-green-400" />}
                    title="Proyección Financiera"
                    gradient="from-green-600/20 to-emerald-600/20"
                    border="border-green-500/30"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <DataBox label="Pedidos L-J" value={analysis.proyeccion_financiera.pedidos_lunes_jueves} />
                        <DataBox label="Pedidos V-S" value={analysis.proyeccion_financiera.pedidos_viernes_sabado} />
                        <DataBox label="Ticket Promedio" value={`$${analysis.proyeccion_financiera.ticket_promedio?.toLocaleString('es-CL')}`} />
                        <DataBox label="Venta Mensual" value={`$${analysis.proyeccion_financiera.venta_mensual?.toLocaleString('es-CL')}`} highlight />
                    </div>
                    <p className="text-xs text-zinc-500 mt-2 italic">{analysis.proyeccion_financiera.nota}</p>
                </Section>
            )}

            {/* Análisis de Inversión (Plan 2 Premium) */}
            {analysis.analisis_inversion && (
                <>
                    {/* Factibilidad Normativa */}
                    {analysis.analisis_inversion.factibilidad_normativa && (
                        <Section
                            icon={<Shield className="w-6 h-6 text-blue-400" />}
                            title="Factibilidad Normativa"
                            gradient="from-blue-600/20 to-cyan-600/20"
                            border="border-blue-500/30"
                        >
                            <div className="space-y-4">
                                <div className="bg-yellow-600/10 border border-yellow-500/20 rounded-lg p-3">
                                    <p className="text-xs text-yellow-400">{analysis.analisis_inversion.factibilidad_normativa.disclaimer}</p>
                                </div>
                                <DataBox label="Zonificación Estimada" value={analysis.analisis_inversion.factibilidad_normativa.zonificacion_estimada} />
                                <DataBox label="Aptitud Comercial" value={analysis.analisis_inversion.factibilidad_normativa.aptitud_comercial} />
                                {analysis.analisis_inversion.factibilidad_normativa.pasos_siguientes && (
                                    <div>
                                        <p className="text-xs text-blue-400 uppercase tracking-wider mb-2">📝 Pasos Siguientes</p>
                                        <ul className="space-y-1">
                                            {analysis.analisis_inversion.factibilidad_normativa.pasos_siguientes.map((paso: string, i: number) => (
                                                <li key={i} className="text-xs text-zinc-300 flex items-start gap-2">
                                                    <ChevronRight className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" />
                                                    {paso}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </Section>
                    )}

                    {/* Modelo Financiero */}
                    {analysis.analisis_inversion.modelo_financiero && (
                        <Section
                            icon={<DollarSign className="w-6 h-6 text-green-400" />}
                            title="Modelo Financiero"
                            gradient="from-green-600/20 to-emerald-600/20"
                            border="border-green-500/30"
                        >
                            <div className="space-y-4">
                                <div className="bg-yellow-600/10 border border-yellow-500/20 rounded-lg p-3">
                                    <p className="text-xs text-yellow-400">{analysis.analisis_inversion.modelo_financiero.disclaimer}</p>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <DataBox label="Precio Adquisición (UF)" value={analysis.analisis_inversion.modelo_financiero.precio_adquisicion_uf} />
                                    <DataBox label="Habilitación (UF)" value={analysis.analisis_inversion.modelo_financiero.habilitacion_uf} />
                                    <DataBox label="Inversión Total (UF)" value={analysis.analisis_inversion.modelo_financiero.inversion_total_uf} highlight />
                                    <DataBox label="Arriendo Mensual (UF)" value={analysis.analisis_inversion.modelo_financiero.arriendo_mensual_uf} />
                                </div>
                                <div className="bg-gradient-to-r from-green-600/30 to-emerald-600/30 rounded-xl p-4 border border-green-500/30">
                                    <p className="text-xs text-green-400 uppercase">Cap Rate Proyectado</p>
                                    <p className="text-4xl font-black text-white">{analysis.analisis_inversion.modelo_financiero.cap_rate}%</p>
                                    <p className="text-xs text-zinc-400 mt-1">{analysis.analisis_inversion.modelo_financiero.interpretacion_cap_rate}</p>
                                </div>
                            </div>
                        </Section>
                    )}
                </>
            )}

            {/* Conclusión */}
            {analysis.conclusion && (
                <Section
                    icon={<CheckCircle2 className="w-6 h-6 text-emerald-400" />}
                    title="Conclusión"
                    gradient="from-emerald-600/30 to-green-600/30"
                    border="border-emerald-500/40"
                >
                    <div className="space-y-4">
                        <ViabilityBadge level={analysis.conclusion.veredicto} />
                        <p className="text-zinc-200 font-medium leading-relaxed">{analysis.conclusion.mensaje}</p>
                    </div>
                </Section>
            )}
        </div>
    );
};

const ReportPlan3 = ({ analysis, dimensiones }: { analysis: any; dimensiones: any }) => {
    if (!analysis) return null;

    return (
        <div className="space-y-6">
            {/* Resumen Ejecutivo Inversión */}
            {analysis.resumen_ejecutivo && (
                <Section
                    icon={<TrendingUp className="w-6 h-6 text-amber-400" />}
                    title="Resumen Ejecutivo - Dossier de Inversión"
                    gradient="from-amber-600/20 to-orange-600/20"
                    border="border-amber-500/30"
                >
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "px-6 py-3 rounded-2xl font-black text-xl",
                                analysis.resumen_ejecutivo.veredicto_inversion === 'STRONG BUY' ? "bg-green-600 text-white" :
                                    analysis.resumen_ejecutivo.veredicto_inversion === 'BUY' ? "bg-emerald-600 text-white" :
                                        analysis.resumen_ejecutivo.veredicto_inversion === 'HOLD' ? "bg-yellow-600 text-white" :
                                            "bg-red-600 text-white"
                            )}>
                                {analysis.resumen_ejecutivo.veredicto_inversion}
                            </div>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">{analysis.resumen_ejecutivo.tesis}</p>
                        {analysis.resumen_ejecutivo.indicadores_clave && (
                            <div className="grid grid-cols-3 gap-4">
                                <DataBox label="Inversión (UF)" value={analysis.resumen_ejecutivo.indicadores_clave.inversion_estimada_uf} highlight />
                                <DataBox label="Cap Rate" value={`${analysis.resumen_ejecutivo.indicadores_clave.cap_rate_proyectado}%`} />
                                <DataBox label="Plusvalía 3 años" value={analysis.resumen_ejecutivo.indicadores_clave.plusvalia_3_años} />
                            </div>
                        )}
                    </div>
                </Section>
            )}

            {/* Macro Entorno */}
            {analysis.macro_entorno && (
                <Section
                    icon={<MapPin className="w-6 h-6 text-blue-400" />}
                    title="Macro-Entorno"
                    gradient="from-blue-600/20 to-cyan-600/20"
                    border="border-blue-500/30"
                >
                    <div className="space-y-3">
                        <p className="text-zinc-300">{analysis.macro_entorno.efecto_fortaleza}</p>
                        <div className="grid grid-cols-2 gap-4">
                            <DataBox label="Masa Crítica" value={analysis.macro_entorno.masa_critica} />
                            <DataBox label="GSE Predominante" value={analysis.macro_entorno.gse_predominante} />
                        </div>
                        <Insight text={analysis.macro_entorno.comportamiento_consumidor} isPositive />
                    </div>
                </Section>
            )}

            {/* Inteligencia de Mercado (Tenant Mix) */}
            {analysis.inteligencia_mercado && (
                <Section
                    icon={<BarChart3 className="w-6 h-6 text-purple-400" />}
                    title="Inteligencia de Mercado - Tenant Mix"
                    gradient="from-purple-600/20 to-pink-600/20"
                    border="border-purple-500/30"
                >
                    <div className="space-y-4">
                        {analysis.inteligencia_mercado.tenant_mix_evitar?.length > 0 && (
                            <div>
                                <p className="text-xs text-red-400 uppercase tracking-wider mb-2">❌ Evitar</p>
                                {analysis.inteligencia_mercado.tenant_mix_evitar.map((t: any, i: number) => (
                                    <div key={i} className="bg-red-600/10 rounded-lg p-3 border border-red-500/20 mb-2">
                                        <p className="text-white font-bold">{t.rubro}</p>
                                        <p className="text-xs text-zinc-400">{t.razon}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {analysis.inteligencia_mercado.tenant_mix_recomendado?.length > 0 && (
                            <div>
                                <p className="text-xs text-green-400 uppercase tracking-wider mb-2">✅ Recomendado</p>
                                {analysis.inteligencia_mercado.tenant_mix_recomendado.map((t: any, i: number) => (
                                    <div key={i} className="bg-green-600/10 rounded-lg p-3 border border-green-500/20 mb-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-6 h-6 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center">#{t.prioridad}</span>
                                            <p className="text-white font-bold">{t.rubro}</p>
                                        </div>
                                        <p className="text-xs text-zinc-400">{t.data} — {t.estrategia}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Section>
            )}

            {/* Modelo Financiero */}
            {analysis.modelo_financiero && (
                <Section
                    icon={<DollarSign className="w-6 h-6 text-green-400" />}
                    title="Modelo Financiero"
                    gradient="from-green-600/20 to-emerald-600/20"
                    border="border-green-500/30"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <DataBox label="Precio Adquisición (UF)" value={analysis.modelo_financiero.precio_adquisicion_uf} />
                        <DataBox label="Habilitación (UF)" value={analysis.modelo_financiero.habilitacion_uf} />
                        <DataBox label="Inversión Total (UF)" value={analysis.modelo_financiero.inversion_total_uf} highlight />
                        <DataBox label="NOI (UF/año)" value={analysis.modelo_financiero.noi_uf} />
                    </div>
                    <div className="mt-4 bg-gradient-to-r from-green-600/30 to-emerald-600/30 rounded-xl p-4 border border-green-500/30">
                        <p className="text-xs text-green-400 uppercase">Cap Rate Proyectado</p>
                        <p className="text-4xl font-black text-white">{analysis.modelo_financiero.cap_rate}%</p>
                    </div>
                </Section>
            )}

            {/* Stress Test */}
            {analysis.stress_test && (
                <Section
                    icon={<AlertTriangle className="w-6 h-6 text-yellow-400" />}
                    title="Stress Test - Análisis de Sensibilidad"
                    gradient="from-yellow-600/20 to-amber-600/20"
                    border="border-yellow-500/30"
                >
                    <div className="grid grid-cols-3 gap-4">
                        {['pesimista', 'base', 'optimista'].map((escenario) => {
                            const data = analysis.stress_test[escenario];
                            if (!data) return null;
                            return (
                                <div key={escenario} className={cn(
                                    "rounded-xl p-4 border",
                                    escenario === 'pesimista' ? "bg-red-600/10 border-red-500/20" :
                                        escenario === 'base' ? "bg-yellow-600/10 border-yellow-500/20" :
                                            "bg-green-600/10 border-green-500/20"
                                )}>
                                    <p className="text-xs uppercase tracking-wider mb-2 text-zinc-400">{escenario}</p>
                                    <p className="text-lg font-bold text-white">Cap Rate: {data.cap_rate}%</p>
                                    <p className="text-xs text-zinc-400">Vacancia: {data.vacancia}%</p>
                                </div>
                            );
                        })}
                    </div>
                </Section>
            )}

            {/* Estrategia de Salida */}
            {analysis.estrategia_salida && (
                <Section
                    icon={<TrendingUp className="w-6 h-6 text-cyan-400" />}
                    title="Estrategia de Salida"
                    gradient="from-cyan-600/20 to-blue-600/20"
                    border="border-cyan-500/30"
                >
                    <div className="grid grid-cols-3 gap-4">
                        <DataBox label="Horizonte" value={`${analysis.estrategia_salida.horizonte_años} años`} />
                        <DataBox label="Valor Venta (UF)" value={analysis.estrategia_salida.valor_venta_estimado_uf} />
                        <DataBox label="Utilidad (UF)" value={analysis.estrategia_salida.utilidad_capital_uf} highlight />
                    </div>
                </Section>
            )}

            {/* Hoja de Ruta */}
            {analysis.hoja_ruta && (
                <Section
                    icon={<Rocket className="w-6 h-6 text-emerald-400" />}
                    title="Hoja de Ruta"
                    gradient="from-emerald-600/20 to-green-600/20"
                    border="border-emerald-500/30"
                >
                    <div className="space-y-2">
                        {analysis.hoja_ruta.map((paso: string, i: number) => (
                            <div key={i} className="flex items-start gap-3 bg-black/20 rounded-lg p-3">
                                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                                <p className="text-zinc-300 text-sm">
                                    {typeof paso === 'object' ? (
                                        <>
                                            <span className="font-bold text-emerald-400">{(paso as any).plataforma}:</span> {(paso as any).detalle}
                                        </>
                                    ) : paso}
                                </p>
                            </div>
                        ))}
                    </div>
                </Section>
            )}
        </div>
    );
};

// ============================================
// COMPONENTES DE UI
// ============================================

const Section = ({ icon, title, gradient, border, children }: { icon: React.ReactNode; title: string; gradient: string; border: string; children: React.ReactNode }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("bg-gradient-to-br rounded-2xl p-4 border", gradient, border)}
    >
        <div className="flex items-center gap-2 mb-3">
            {icon}
            <h3 className="text-base font-bold text-white">{title}</h3>
        </div>
        {children}
    </motion.div>
);

const Badge = ({ color, children }: { color: string; children: React.ReactNode }) => (
    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide", `bg-${color}-600/20 text-${color}-400 border border-${color}-500/30`)}>
        {children}
    </span>
);

const DataBox = ({ label, value, highlight }: { label: string; value: any; highlight?: boolean }) => (
    <div className={cn("bg-black/30 rounded-lg p-2.5 border", highlight ? "border-green-500/30" : "border-white/10")}>
        <p className="text-[10px] text-zinc-500 uppercase tracking-wide">{label}</p>
        <p className={cn("text-sm font-bold mt-0.5", highlight ? "text-green-400" : "text-white")}>{value || 'N/A'}</p>
    </div>
);

const Insight = ({ text, isPositive, isWarning }: { text: string; isPositive?: boolean; isWarning?: boolean }) => (
    <div className={cn(
        "flex items-start gap-2 p-2.5 rounded-lg border",
        isPositive ? "bg-green-600/10 border-green-500/20" :
            isWarning ? "bg-yellow-600/10 border-yellow-500/20" :
                "bg-blue-600/10 border-blue-500/20"
    )}>
        <Lightbulb className={cn("w-3.5 h-3.5 shrink-0 mt-0.5", isPositive ? "text-green-400" : isWarning ? "text-yellow-400" : "text-blue-400")} />
        <p className="text-xs text-zinc-300 leading-relaxed">{text}</p>
    </div>
);

const ViabilityBadge = ({ level }: { level: string }) => {
    const config: Record<string, { color: string; bg: string }> = {
        'MUY ALTA': { color: 'text-green-400', bg: 'bg-green-600' },
        'ALTA': { color: 'text-emerald-400', bg: 'bg-emerald-600' },
        'MEDIA': { color: 'text-yellow-400', bg: 'bg-yellow-600' },
        'BAJA': { color: 'text-red-400', bg: 'bg-red-600' },
        'ORO': { color: 'text-yellow-400', bg: 'bg-gradient-to-r from-yellow-500 to-amber-500' },
        'PLATA': { color: 'text-zinc-300', bg: 'bg-gradient-to-r from-zinc-400 to-zinc-500' },
        'BRONCE': { color: 'text-orange-400', bg: 'bg-gradient-to-r from-orange-600 to-amber-700' },
        'RIESGO': { color: 'text-red-400', bg: 'bg-red-600' },
        'STRONG BUY': { color: 'text-green-400', bg: 'bg-green-600' },
        'BUY': { color: 'text-emerald-400', bg: 'bg-emerald-600' },
        'HOLD': { color: 'text-yellow-400', bg: 'bg-yellow-600' },
        'SELL': { color: 'text-red-400', bg: 'bg-red-600' },
    };
    const c = config[level?.toUpperCase()] || { color: 'text-zinc-400', bg: 'bg-zinc-600' };

    return (
        <span className={cn("px-4 py-2 rounded-xl font-black text-sm uppercase text-white", c.bg)}>
            {level}
        </span>
    );
};

// ============================================
// PÁGINA PRINCIPAL
// ============================================

export default function TerritorialPage() {
    const [selectedPlan, setSelectedPlan] = useState(1);
    const [address, setAddress] = useState('');
    const [businessType, setBusinessType] = useState('restaurant');
    const [businessName, setBusinessName] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [currentReport, setCurrentReport] = useState<Report | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!address.trim()) {
            setError('Ingresa una dirección válida');
            return;
        }

        setIsAnalyzing(true);
        setError(null);
        setCurrentReport(null);

        try {
            const response = await fetch(
                '/api/territorial/analyze',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        address: address.trim(),
                        plan_type: selectedPlan,
                        business_type: businessType,
                        business_name: businessName || undefined
                    })
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();

            if (data.success) {
                setCurrentReport({
                    id: data.report_id,
                    address: data.address,
                    plan_type: selectedPlan,
                    comuna: data.comuna,
                    coordinates: data.coordinates,
                    map_url: data.map_url, // URL del mapa estático
                    dimensiones: data.dimensiones,
                    analysis: data.analysis
                });
            } else {
                throw new Error(data.error || 'Error desconocido');
            }
        } catch (err: any) {
            console.error('Error:', err);
            setError(err.message || 'Error al analizar la ubicación');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-black uppercase tracking-wider text-blue-400">Inteligencia Territorial v2.0</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Motor de Análisis Territorial</h1>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto">Reportes profesionales estilo consultor con datos reales — Costo $0</p>
                </motion.div>

                {/* Selector de Planes */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PLANS.map((plan) => {
                        const Icon = plan.icon;
                        const isSelected = selectedPlan === plan.id;
                        return (
                            <motion.button
                                key={plan.id}
                                onClick={() => setSelectedPlan(plan.id)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    "relative p-6 rounded-3xl border-2 transition-all text-left overflow-hidden group",
                                    isSelected ? "border-white/30 bg-white/5" : "border-white/10 bg-white/[0.02] hover:border-white/20"
                                )}
                            >
                                {plan.popular && (
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
                                        <span className="text-[10px] font-black uppercase text-white">Popular</span>
                                    </div>
                                )}
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br", plan.color)}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-black text-white mb-1">{plan.name}</h3>
                                <p className="text-xl font-black text-white mb-2">{plan.price}</p>
                                <p className="text-sm text-zinc-400 mb-4">{plan.description}</p>
                                <ul className="space-y-1">
                                    {plan.features.slice(0, 4).map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                                            <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                    {plan.features.length > 4 && <li className="text-xs text-zinc-500">+{plan.features.length - 4} más...</li>}
                                </ul>
                                {isSelected && (
                                    <motion.div layoutId="selected-plan" className="absolute inset-0 border-2 border-white rounded-3xl pointer-events-none" />
                                )}
                            </motion.button>
                        );
                    })}
                </motion.div>

                {/* Input */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                    {/* Rubro */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Building2 className="w-6 h-6 text-orange-400" />
                            <h2 className="text-lg font-bold text-white">Giro Comercial</h2>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                            {BUSINESS_TYPES.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setBusinessType(type.id)}
                                    className={cn(
                                        "px-3 py-2 rounded-xl text-xs font-bold transition-all border",
                                        businessType === type.id
                                            ? "bg-orange-500 text-white border-orange-500"
                                            : "bg-black/40 text-zinc-400 border-white/10 hover:border-white/30"
                                    )}
                                >
                                    {type.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dirección */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <MapPin className="w-6 h-6 text-blue-400" />
                            <h2 className="text-lg font-bold text-white">Ubicación</h2>
                        </div>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                                placeholder="Ej: Av. Providencia 1234, Santiago"
                                className="flex-1 px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50"
                                disabled={isAnalyzing}
                            />
                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || !address.trim()}
                                className={cn(
                                    "px-8 py-4 rounded-2xl font-black uppercase tracking-wider text-sm transition-all flex items-center gap-3",
                                    isAnalyzing || !address.trim()
                                        ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
                                )}
                            >
                                {isAnalyzing ? (<><Loader2 className="w-5 h-5 animate-spin" />Analizando...</>) : (<><Zap className="w-5 h-5" />Analizar</>)}
                            </button>
                        </div>
                        {error && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400" />
                                <p className="text-sm text-red-300">{error}</p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Resultados */}
                <AnimatePresence mode="wait">
                    {currentReport && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                            {/* Header del Reporte */}
                            <div className="bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Reporte Generado</p>
                                    <h2 className="text-2xl font-black text-white">{currentReport.address}</h2>
                                    <p className="text-sm text-zinc-400">Comuna: {currentReport.comuna} | Plan {currentReport.plan_type}</p>
                                </div>
                                <div className="flex gap-3">
                                    {/* Botón Ver Reporte Interactivo */}
                                    <Link
                                        href={`/reporte/${currentReport.id}`}
                                        target="_blank"
                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-bold text-white flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                        Ver Reporte Interactivo
                                    </Link>

                                    {/* Botón Descargar PDF */}
                                    <button
                                        onClick={async () => {
                                            try {
                                                const response = await fetch(`/api/reporte/${currentReport.id}/pdf`);
                                                if (!response.ok) throw new Error('Error generando PDF');

                                                const blob = await response.blob();
                                                const url = window.URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = `reporte-territorial-${currentReport.id}.pdf`;
                                                document.body.appendChild(a);
                                                a.click();
                                                window.URL.revokeObjectURL(url);
                                                document.body.removeChild(a);
                                            } catch (error) {
                                                console.error('Error descargando PDF:', error);
                                                alert('Error al generar el PDF. Intenta nuevamente.');
                                            }
                                        }}
                                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold text-white flex items-center gap-2 hover:shadow-lg hover:shadow-green-500/20 transition-all"
                                    >
                                        <Download className="w-5 h-5" />
                                        Descargar PDF
                                    </button>
                                </div>
                            </div>

                            {/* Contenido del Reporte según Plan */}
                            {currentReport.plan_type === 1 && <ReportPlan1 analysis={currentReport.analysis} dimensiones={currentReport.dimensiones} mapUrl={currentReport.map_url} />}
                            {currentReport.plan_type === 2 && <ReportPlan2 analysis={currentReport.analysis} dimensiones={currentReport.dimensiones} />}
                            {currentReport.plan_type === 3 && <ReportPlan3 analysis={currentReport.analysis} dimensiones={currentReport.dimensiones} />}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
