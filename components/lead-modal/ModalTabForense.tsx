'use client';

import React, { useMemo } from 'react';
import {
    AlertTriangle,
    CheckCircle2,
    ExternalLink,
    Fingerprint,
    Globe,
    Lock,
    Radar,
    ShieldAlert,
    Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalTabForenseProps {
    selectedLead: {
        source_data?: {
            scraped?: Record<string, unknown>;
            kimi_forensics?: {
                secuestro?: { esSecuestrable?: boolean; anguloVenta?: string };
                copyright?: { añoDetectado?: string | number; esObsoleto?: boolean };
                saludSocial?: Array<{ platform?: string; url?: string }>;
            };
            facebook?: string;
            instagram?: string;
            forensic_needs_refresh?: boolean;
            deep_analysis_stale?: boolean;
        };
        [key: string]: unknown;
    };
    isDark: boolean;
    onDeepAnalyze: () => void;
    isDeepAnalyzing: boolean;
    setModalTab: (tab: 'diagnostico' | 'auditoria' | 'estrategia' | 'trabajo' | 'forense') => void;
}

type ForensicFinding = {
    id: string;
    title: string;
    detail: string;
    severity: 'critical' | 'warning' | 'info' | 'ok';
    actionLabel?: string;
    actionTab?: 'diagnostico' | 'auditoria' | 'estrategia' | 'trabajo' | 'forense';
    externalUrl?: string;
};

const normalizeUrl = (value?: string | null): string | null => {
    if (!value) return null;
    const trimmed = String(value).trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    return `https://${trimmed}`;
};

export const ModalTabForense = ({
    selectedLead,
    isDark,
    onDeepAnalyze,
    isDeepAnalyzing,
    setModalTab
}: ModalTabForenseProps) => {
    const scraped = useMemo(
        () => (selectedLead?.source_data?.scraped || {}) as Record<string, unknown>,
        [selectedLead?.source_data?.scraped]
    );
    const kimi = useMemo(
        () => (selectedLead?.source_data?.kimi_forensics || {}),
        [selectedLead?.source_data?.kimi_forensics]
    );

    const socialHealth = Array.isArray(kimi?.saludSocial) ? kimi.saludSocial : [];
    const staleForensics = Boolean(selectedLead?.source_data?.forensic_needs_refresh || selectedLead?.source_data?.deep_analysis_stale);
    const socialByPlatform = new Map(
        socialHealth
            .filter((entry) => entry?.platform)
            .map((entry) => [String(entry.platform).toLowerCase(), entry])
    );

    const facebookUrl = normalizeUrl(
        socialByPlatform.get('facebook')?.url || (scraped?.facebook as string | undefined) || selectedLead?.source_data?.facebook
    );
    const linkedinUrl = normalizeUrl(
        socialByPlatform.get('linkedin')?.url || (scraped?.linkedin as string | undefined)
    );
    const instagramUrl = normalizeUrl(
        socialByPlatform.get('instagram')?.url || (scraped?.instagram as string | undefined) || selectedLead?.source_data?.instagram
    );

    const findings = useMemo<ForensicFinding[]>(() => {
        const list: ForensicFinding[] = [];

        if (kimi?.secuestro?.esSecuestrable) {
            list.push({
                id: 'secuestro',
                title: 'Secuestro Técnico Detectado',
                detail: kimi?.secuestro?.anguloVenta || 'La infraestructura depende de una plataforma con bajo control real del cliente.',
                severity: 'critical',
                actionLabel: 'Plan de rescate',
                actionTab: 'estrategia'
            });
        } else {
            list.push({
                id: 'ownership',
                title: 'Propiedad Técnica sin alerta',
                detail: 'No hay señal clara de secuestro técnico en esta auditoría.',
                severity: 'ok'
            });
        }

        if (kimi?.copyright?.añoDetectado) {
            const stale = Boolean(kimi?.copyright?.esObsoleto);
            list.push({
                id: 'copyright',
                title: stale ? 'Huella de abandono temporal' : 'Huella temporal saludable',
                detail: stale
                    ? `Copyright © ${kimi.copyright.añoDetectado}. Señal de abandono prolongado.`
                    : `Copyright © ${kimi.copyright.añoDetectado}. Señal de mantenimiento reciente.`,
                severity: stale ? 'warning' : 'ok',
                actionLabel: stale ? 'Actualizar propuesta' : undefined,
                actionTab: stale ? 'trabajo' : undefined
            });
        }

        if (scraped?.hasSSL === false) {
            list.push({
                id: 'ssl',
                title: 'Sitio inseguro (sin HTTPS)',
                detail: 'No hay SSL activo. Esto afecta confianza y conversión de usuarios.',
                severity: 'critical',
                actionLabel: 'Corregir en trabajo',
                actionTab: 'trabajo'
            });
        }

        if (scraped?.hasViewport === false) {
            list.push({
                id: 'viewport',
                title: 'Sitio no optimizado móvil',
                detail: 'Falta meta viewport. Riesgo alto de mala experiencia en celulares.',
                severity: 'warning',
                actionLabel: 'Revisar diagnóstico',
                actionTab: 'diagnostico'
            });
        }

        const socialCount = [facebookUrl, linkedinUrl, instagramUrl].filter(Boolean).length;
        if (socialCount === 0) {
            list.push({
                id: 'social',
                title: 'Sin huella social verificable',
                detail: 'No se detectaron perfiles relevantes de redes sociales para este lead.',
                severity: 'warning'
            });
        } else {
            list.push({
                id: 'social-ok',
                title: 'Huella social verificada',
                detail: `Se detectaron ${socialCount} activos sociales útiles para contacto/validación.`,
                severity: 'info'
            });
        }

        const emails = Array.isArray(scraped?.emails) ? (scraped.emails as string[]) : [];
        if (emails.length === 0) {
            list.push({
                id: 'emails',
                title: 'Sin correos detectados',
                detail: 'No se encontraron emails corporativos en el rastreo actual.',
                severity: 'warning'
            });
        } else {
            list.push({
                id: 'emails-ok',
                title: 'Correos corporativos detectados',
                detail: `${emails.length} correo(s) disponibles para outreach directo.`,
                severity: 'info',
                actionLabel: 'Ir a trabajo',
                actionTab: 'trabajo'
            });
        }

        return list;
    }, [facebookUrl, instagramUrl, kimi, linkedinUrl, scraped]);

    const verdict = useMemo(() => {
        const critical = findings.filter(f => f.severity === 'critical').length;
        const warning = findings.filter(f => f.severity === 'warning').length;
        if (critical > 0) {
            return { type: 'critical', label: 'Intervención urgente', text: 'Hay brechas forenses críticas que justifican propuesta inmediata.' };
        }
        if (warning > 1) {
            return { type: 'warning', label: 'Intervención recomendada', text: 'Hay señales débiles que sostienen una oferta de mejora prioritaria.' };
        }
        return { type: 'ok', label: 'Estado controlado', text: 'No hay brechas críticas; se recomienda enfoque de optimización incremental.' };
    }, [findings]);

    const hasAnyForensicData = Boolean(selectedLead?.source_data?.scraped || selectedLead?.source_data?.kimi_forensics);

    if (!hasAnyForensicData) {
        return (
            <div className={cn(
                'p-8 rounded-3xl border border-dashed flex items-center justify-between gap-6',
                isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-300'
            )}>
                <div className="space-y-2">
                    <h4 className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                        Forense sin datos sincronizados
                    </h4>
                    <p className={cn('text-sm', isDark ? 'text-zinc-400' : 'text-gray-600')}>
                        Ejecuta auditoría profunda para construir huella forense real de este lead.
                    </p>
                </div>
                <button
                    onClick={onDeepAnalyze}
                    disabled={isDeepAnalyzing}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-red-500 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    <Radar className="w-4 h-4" />
                    {isDeepAnalyzing ? 'Auditando...' : 'Iniciar forense'}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className={cn(
                'p-6 rounded-3xl border',
                isDark ? 'bg-zinc-900/50 border-white/10' : 'bg-white border-gray-200'
            )}>
                {staleForensics && (
                    <div className={cn(
                        'mb-4 px-3 py-2 rounded-xl border text-xs',
                        isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-700'
                    )}>
                        Diagnóstico base fue actualizado. Recomendada re-auditoría forense para sincronizar evidencias.
                    </div>
                )}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400">Consola Forense</p>
                        <h3 className={cn('text-xl font-bold mt-1', isDark ? 'text-white' : 'text-gray-900')}>
                            {verdict.label}
                        </h3>
                        <p className={cn('text-sm mt-2', isDark ? 'text-zinc-400' : 'text-gray-600')}>
                            {verdict.text}
                        </p>
                    </div>
                    <button
                        onClick={onDeepAnalyze}
                        disabled={isDeepAnalyzing}
                        className={cn(
                            'px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider',
                            isDark ? 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        )}
                    >
                        {isDeepAnalyzing ? 'Re-auditando...' : 'Re-auditar'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {findings.map((finding) => {
                    const tone =
                        finding.severity === 'critical' ? 'border-red-500/40 bg-red-500/10' :
                            finding.severity === 'warning' ? 'border-amber-500/40 bg-amber-500/10' :
                                finding.severity === 'ok' ? 'border-green-500/40 bg-green-500/10' :
                                    'border-blue-500/40 bg-blue-500/10';
                    const icon =
                        finding.severity === 'critical' ? <ShieldAlert className="w-5 h-5 text-red-400" /> :
                            finding.severity === 'warning' ? <AlertTriangle className="w-5 h-5 text-amber-400" /> :
                                finding.severity === 'ok' ? <CheckCircle2 className="w-5 h-5 text-green-400" /> :
                                    <Fingerprint className="w-5 h-5 text-blue-400" />;

                    return (
                        <div
                            key={finding.id}
                            className={cn('p-5 rounded-2xl border', tone)}
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">{icon}</div>
                                <div className="flex-1">
                                    <h4 className={cn('text-sm font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                                        {finding.title}
                                    </h4>
                                    <p className={cn('text-xs mt-2 leading-relaxed', isDark ? 'text-zinc-300' : 'text-gray-700')}>
                                        {finding.detail}
                                    </p>
                                </div>
                            </div>

                            {(finding.actionTab || finding.externalUrl) && (
                                <div className="mt-4">
                                    {finding.actionTab && (
                                        <button
                                            onClick={() => setModalTab(finding.actionTab!)}
                                            className={cn(
                                                'px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border',
                                                isDark ? 'bg-white/10 border-white/10 text-zinc-200 hover:bg-white/20' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'
                                            )}
                                        >
                                            {finding.actionLabel || 'Abrir'}
                                        </button>
                                    )}
                                    {!finding.actionTab && finding.externalUrl && (
                                        <a
                                            href={finding.externalUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={cn(
                                                'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border',
                                                isDark ? 'bg-white/10 border-white/10 text-zinc-200 hover:bg-white/20' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'
                                            )}
                                        >
                                            {finding.actionLabel || 'Abrir'}
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className={cn(
                'p-5 rounded-2xl border',
                isDark ? 'bg-zinc-900/60 border-white/10' : 'bg-white border-gray-200'
            )}>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3">Activos verificados</p>
                <div className="flex flex-wrap gap-2">
                    {facebookUrl && (
                        <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
                            <Users className="w-3 h-3" /> Facebook <ExternalLink className="w-3 h-3" />
                        </a>
                    )}
                    {linkedinUrl && (
                        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                            <Globe className="w-3 h-3" /> LinkedIn <ExternalLink className="w-3 h-3" />
                        </a>
                    )}
                    {instagramUrl && (
                        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold">
                            <Globe className="w-3 h-3" /> Instagram <ExternalLink className="w-3 h-3" />
                        </a>
                    )}
                    {!facebookUrl && !linkedinUrl && !instagramUrl && (
                        <span className={cn('text-xs', isDark ? 'text-zinc-500' : 'text-gray-500')}>Sin perfiles forenses validados.</span>
                    )}
                    {scraped?.hasSSL === false && (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
                            <Lock className="w-3 h-3" /> SSL ausente
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
