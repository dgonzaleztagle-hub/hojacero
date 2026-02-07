import React from 'react';
import { motion } from 'framer-motion';
import {
    MapPin, Users, Zap, TrendingUp, ShieldAlert,
    Globe, Search, Map, BarChart3, Info
} from 'lucide-react';
import { TerritorialEngine, RadarTerritorialResult } from '@/utils/radar/territorial-engine';

interface ModalTabTerritorialProps {
    selectedLead: any;
    isDark: boolean;
}

export function ModalTabTerritorial({ selectedLead, isDark }: ModalTabTerritorialProps) {
    // Simulamos la llamada al motor con la data del lead
    const result: RadarTerritorialResult = {
        location: {
            address: selectedLead.address || 'Ubicación Detectada',
            lat: selectedLead.lat || -33.4489,
            lng: selectedLead.lng || -70.6693,
            commune: 'Providencia'
        },
        demographics: TerritorialEngine.analyzeDemographics({}),
        flow: TerritorialEngine.analyzeFlow({}),
        commercial: TerritorialEngine.analyzeCommercial({}),
        risk: {
            score: 85,
            status: 'OPTIMO',
            cip_factibilidad: true,
            seguridad_score: 72,
            insights: [
                "Zona con normativa comercial vigente (CIP Aprobado).",
                "Patrullaje constante y buena iluminación nocturna."
            ]
        },
        digital_gap: TerritorialEngine.analyzeDigitalGap([]),
        total_viability: 78.5
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPTIMO': return 'text-green-500';
            case 'OPORTUNIDAD': return 'text-cyan-500';
            case 'RIESGO': return 'text-red-500';
            default: return 'text-zinc-500';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Viability Score */}
            <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] -z-10" />

                <div className="space-y-2">
                    <h3 className="text-sm font-black italic uppercase text-zinc-500 tracking-widest flex items-center gap-2">
                        <Map className="w-4 h-4" /> Veredicto Territorial
                    </h3>
                    <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter">
                        Viabilidad <span className="text-cyan-500">Estratégica</span>
                    </h2>
                    <p className="text-zinc-400 text-sm max-w-md">
                        Basado en el análisis de 5 dimensiones críticas y proxies de flujo peatonal.
                    </p>
                </div>

                <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
                        <circle
                            cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                            strokeDasharray={364.4} strokeDashoffset={364.4 * (1 - result.total_viability / 100)}
                            className="text-cyan-500 transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black italic text-white leading-none">{result.total_viability}%</span>
                        <span className="text-[8px] font-bold text-cyan-500 uppercase tracking-tighter">Score H0</span>
                    </div>
                </div>
            </div>

            {/* Grid de 5 Dimensiones */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* 1. DEMOGRAFÍA */}
                <DimensionCard
                    title="Demográfica"
                    icon={<Users className="w-4 h-4" />}
                    dimension={result.demographics}
                    footer={`Densidad: ${result.demographics.densidad} h/km² • GSE: ${result.demographics.gse_predominante}`}
                />

                {/* 2. FLUJO */}
                <DimensionCard
                    title="Flujo Peatonal"
                    icon={<TrendingUp className="w-4 h-4" />}
                    dimension={result.flow}
                    footer={`Peak: ${result.flow.peak_hours[0]}`}
                />

                {/* 3. COMERCIAL */}
                <DimensionCard
                    title="Comercial"
                    icon={<BarChart3 className="w-4 h-4" />}
                    dimension={result.commercial}
                    footer={`Arriendo: ${result.commercial.arriendo_m2_promedio} UF/m²`}
                />

                {/* 4. RIESGO/ENTORNO */}
                <DimensionCard
                    title="Entorno y Riesgo"
                    icon={<ShieldAlert className="w-4 h-4" />}
                    dimension={result.risk}
                    footer={`CIP: ${result.risk.cip_factibilidad ? 'Aprobado' : 'Pendiente'}`}
                />

                {/* 5. DIGITAL GAP (HojaCero Special) */}
                <DimensionCard
                    title="Madurez Digital"
                    icon={<Globe className="w-4 h-4" />}
                    dimension={result.digital_gap}
                    footer={`${result.digital_gap.competidores_sin_web} locales sin web`}
                    highlight
                />

                {/* 6. CALL TO ACTION - Venta de Plan */}
                <div className="bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-3xl p-6 flex flex-col justify-between text-black relative group overflow-hidden cursor-pointer">
                    <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-30 transition-opacity">
                        <Zap className="w-12 h-12" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-black italic uppercase text-xs">Venta Directa</h4>
                        <h3 className="text-xl font-black italic uppercase leading-none tracking-tighter">DESBLOQUEAR<br />REPORTE FULL</h3>
                    </div>
                    <p className="text-[10px] font-bold opacity-60 mt-4 leading-tight uppercase">
                        Generar dossier de inversión de 12 páginas para bancos e inversionistas.
                    </p>
                    <button className="mt-4 bg-black text-[#00f0ff] py-3 rounded-xl font-black italic uppercase text-[10px] tracking-widest shadow-xl">
                        GENERAR PDF ($350k)
                    </button>
                </div>
            </div>
        </div>
    );
}

function DimensionCard({ title, icon, dimension, footer, highlight = false }: { title: string, icon: any, dimension: any, footer: string, highlight?: boolean }) {
    return (
        <div className={`p-6 rounded-3xl border transition-all duration-300 ${highlight ? 'bg-cyan-500/5 border-cyan-500/30' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${highlight ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                        {icon}
                    </div>
                    <h4 className="text-xs font-black italic uppercase text-zinc-300 tracking-widest">{title}</h4>
                </div>
                <div className={`text-[8px] font-black italic uppercase px-2 py-1 rounded bg-black/40 border border-white/5 ${dimension.status === 'OPTIMO' ? 'text-green-500' :
                    dimension.status === 'OPORTUNIDAD' ? 'text-cyan-500' : 'text-red-500'
                    }`}>
                    {dimension.status}
                </div>
            </div>

            <div className="space-y-3 mb-6">
                {dimension.insights.map((insight: string, i: number) => (
                    <div key={i} className="flex gap-2 items-start group">
                        <div className={`w-1 h-1 rounded-full mt-1.5 shrink-0 ${highlight ? 'bg-cyan-500' : 'bg-zinc-700 group-hover:bg-cyan-500'} transition-colors`} />
                        <p className="text-[10px] text-zinc-400 leading-relaxed font-bold italic group-hover:text-zinc-200 transition-colors">
                            {insight}
                        </p>
                    </div>
                ))}
            </div>

            <div className="pt-4 border-t border-white/5 mt-auto flex justify-between items-center">
                <span className="text-[9px] font-black italic uppercase text-zinc-500">{footer}</span>
                <span className={`text-[10px] font-black italic ${highlight ? 'text-cyan-500' : 'text-zinc-600'}`}>{dimension.score}%</span>
            </div>
        </div>
    );
}
