'use client';

import React, { useState, useEffect } from 'react';
import {
    Users,
    Share2,
    ExternalLink,
    Target,
    ShieldAlert,
    Zap,
    Loader2,
    Search,
    Radar,
    Fingerprint,
    Ghost,
    AlertCircle,
    CheckCircle2,
    Lock,
    Shield,
    Database,
    RotateCcw,
    Activity,
    Eye,
    Unlock,
    Binary,
    ArrowRight,
    MessageSquare,
    Mail,
    Wrench,
    TrendingUp,
    DollarSign,
    Calendar,
    AlertTriangle,
    TrendingDown,
    Skull
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StackingCards } from '@/components/premium/StackingCards';

interface ModalTabForenseProps {
    selectedLead: any;
    isDark: boolean;
    onLeadUpdate: (lead: any) => void;
    onDeepAnalyze: () => void;
    isDeepAnalyzing: boolean;
    setModalTab: (tab: any) => void;
}

type LayerStatus = 'idle' | 'scanning' | 'found' | 'none';

interface ForensicLayer {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<any>;
}

const FORENSIC_LAYERS: ForensicLayer[] = [
    { id: 'fb_ads', name: 'Social Ads Core', description: 'Facebook Ads Library & Meta Pixel', icon: Share2 },
    { id: 'b2b_signals', name: 'B2B Ghosting', description: 'LinkedIn Company & Personal signals', icon: Ghost },
    { id: 'search_shadow', name: 'Search Shadowing', description: 'Google Ads & Search presence', icon: Search },
    { id: 'dna_history', name: 'DNA History', description: 'Antigüedad y cambios de dominio', icon: Fingerprint },
    { id: 'tech_debt', name: 'Technical Debt', description: 'Leaks técnicos y huella de servidor', icon: Shield },
];

export const ModalTabForense = ({
    selectedLead,
    isDark,
    onLeadUpdate,
    onDeepAnalyze,
    isDeepAnalyzing,
    setModalTab
}: ModalTabForenseProps) => {
    const [isGlobalScanning, setIsGlobalScanning] = useState(false);
    const [layersStatus, setLayersStatus] = useState<Record<string, LayerStatus>>(() => {
        // Inicializar desde datos previos si existen
        if (selectedLead?.source_data?.deep_analysis) {
            const status: Record<string, LayerStatus> = {};
            FORENSIC_LAYERS.forEach(l => status[l.id] = 'found'); // Simplificación rápida por ahora
            return status;
        }
        return {};
    });
    const [findings, setFindings] = useState<any[]>([]);
    const [verdict, setVerdict] = useState<{ type: 'positive' | 'neutral' | 'negative'; message: string } | null>(null);

    // Deep Analysis Data Extraction
    const deepData = selectedLead?.source_data?.deep_analysis;
    const hasDeepData = !!deepData;

    // Reset view when lead changes
    useEffect(() => {
        setFindings([]);
        setVerdict(null);
        setLayersStatus({});
    }, [selectedLead?.id]);

    // Auto-trigger scan when deep analysis finishes
    useEffect(() => {
        const hasFindingsAlready = findings.length > 0;
        const alreadyHasData = !!selectedLead?.source_data?.deep_analysis;

        console.log('🔍 FORENSE useEffect:', {
            hasDeepData,
            isDeepAnalyzing,
            layersStatusKeys: Object.keys(layersStatus).length,
            isGlobalScanning,
            hasFindingsAlready,
            alreadyHasData,
            findingsLength: findings.length
        });

        if (hasDeepData && !isDeepAnalyzing && Object.keys(layersStatus).length === 0 && !isGlobalScanning && !hasFindingsAlready && !alreadyHasData) {
            console.log('🔍 Ejecutando runForensicScan()');
            runForensicScan();
        } else if (alreadyHasData && findings.length === 0) {
            console.log('🔍 Ejecutando loadExistingFindings()');
            // Cargar hallazgos sin animación si ya existen en la DB
            loadExistingFindings();
        }
    }, [hasDeepData, isDeepAnalyzing, selectedLead?.id]);

    const loadExistingFindings = () => {
        const scraped = selectedLead?.source_data?.scraped;
        const deep = selectedLead?.source_data?.deep_analysis;
        const kimiData = selectedLead?.source_data?.kimi_forensics;
        if (!scraped && !deep) return;

        const newStatus: Record<string, LayerStatus> = {};
        const newFindings: any[] = [];

        // === CAPA 1: Social Ads Core (fb_ads) ===
        const fb = selectedLead?.facebook || selectedLead?.source_data?.facebook || scraped?.facebook || scraped?.instagram;
        if (fb) {
            newStatus['fb_ads'] = 'found';
            newFindings.push({
                title: "Huella Social: Perfil Activo",
                content: `Descubierto: ${fb}. El rastro digital indica interacción activa.`,
                action: {
                    label: "Ver Perfil",
                    icon: <ExternalLink className="w-4 h-4" />,
                    onClick: () => window.open(fb.startsWith('http') ? fb : `https://${fb}`, '_blank')
                },
                icon: <Share2 className="w-5 h-5 text-blue-400" />,
                color: "from-blue-600/30 to-indigo-600/30"
            });
        } else {
            newStatus['fb_ads'] = 'none';
        }

        // === CAPA 2: B2B Ghosting (b2b_signals) ===
        const li = scraped?.linkedin;
        const emails = scraped?.emails || selectedLead?.source_data?.emails || [];
        if (li || emails.length > 0) {
            newStatus['b2b_signals'] = 'found';
            newFindings.push({
                title: "Infiltración B2B & Contactos",
                content: li ? `LinkedIn: ${li}. Correos: ${emails.length}` : `Emails: ${emails.length} corporativos encontrados.`,
                action: {
                    label: emails.length > 0 ? "Disparar IA Email" : "Ver LinkedIn",
                    icon: emails.length > 0 ? <Mail className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />,
                    onClick: () => emails.length > 0 ? setModalTab('trabajo') : window.open(li, '_blank')
                },
                icon: <Users className="w-5 h-5 text-purple-400" />,
                color: "from-purple-600/30 to-pink-600/30"
            });
        } else {
            newStatus['b2b_signals'] = 'none';
        }

        // === CAPA 3: Search Shadowing ===
        const hasWeakSEO = !scraped?.hasMetaDesc || !scraped?.hasTitle || !scraped?.hasViewport;
        const hasBadScore = (deep?.seoScore !== undefined && deep?.seoScore < 70);
        const noWebsite = !selectedLead.website;
        if (hasBadScore || noWebsite || hasWeakSEO) {
            newStatus['search_shadow'] = 'found';
            const reason = noWebsite
                ? "El cliente es INVISIBLE en la red. No tiene sitio web oficial."
                : hasWeakSEO
                    ? "Faltan elementos SEO críticos (meta tags, viewport). Google lo ignora."
                    : `Score de autoridad bajo (${deep?.seoScore || 0}/100). Competidores lo están opacando.`;
            newFindings.push({
                title: "Sombra Digital: Tráfico & SEO",
                content: reason,
                action: {
                    label: "Estrategia de Dominio",
                    icon: <Target className="w-4 h-4" />,
                    onClick: () => setModalTab('diagnostico')
                },
                icon: <Search className="w-5 h-5 text-yellow-400" />,
                color: "from-yellow-600/30 to-orange-600/30"
            });
        } else {
            newStatus['search_shadow'] = 'none';
        }

        // === CAPA 4: DNA History ===
        const copyrightData = kimiData?.copyright;
        const esObsoleto = copyrightData?.esObsoleto;
        const añoDetectado = copyrightData?.añoDetectado;
        const añosCopyright = copyrightData?.añosAbandonado || 0;
        if (esObsoleto || (añoDetectado && añoDetectado < new Date().getFullYear() - 1)) {
            newStatus['dna_history'] = 'found';
            newFindings.push({
                title: "Huella Temporal Detectada",
                content: añoDetectado
                    ? `Copyright © ${añoDetectado} detectado. ${añosCopyright} años sin actualizar = sitio ABANDONADO.`
                    : "El dominio muestra signos de abandono prolongado.",
                action: {
                    label: "Proponer Renovación",
                    icon: <RotateCcw className="w-4 h-4" />,
                    onClick: () => setModalTab('estrategia')
                },
                icon: <Fingerprint className="w-5 h-5 text-amber-400" />,
                color: "from-amber-600/30 to-orange-600/30"
            });
        } else {
            newStatus['dna_history'] = 'none';
        }

        // === CAPA 5: Technical Debt ===
        const problems = deep?.technicalIssues || [];
        const isSecuestrable = kimiData?.secuestro?.esSecuestrable;
        const noSSL = scraped?.hasSSL === false;
        const noViewport = scraped?.hasViewport === false;
        const cms = scraped?.cms;
        if (problems.length > 0 || isSecuestrable || noSSL || noViewport) {
            newStatus['tech_debt'] = 'found';
            let reason = '';
            if (noSSL) {
                reason = "⚠️ Sin SSL (https). Los navegadores marcan este sitio como INSEGURO.";
            } else if (isSecuestrable) {
                reason = `Plataforma ${cms || 'limitada'} detectada. El cliente NO es dueño real de su sitio.`;
            } else if (noViewport) {
                reason = "Sitio NO responsive. 60% del tráfico es móvil y lo está perdiendo.";
            } else {
                reason = problems[0]?.issue || "Múltiples fugas técnicas detectadas.";
            }
            newFindings.push({
                title: "Deuda Técnica Detectada",
                content: reason,
                action: {
                    label: "Reparar infraestructura",
                    icon: <Wrench className="w-4 h-4" />,
                    onClick: () => setModalTab('trabajo')
                },
                icon: <Binary className="w-5 h-5 text-cyan-400" />,
                color: "from-cyan-600/30 to-blue-600/30"
            });
        } else {
            newStatus['tech_debt'] = 'none';
        }

        // Establecer veredicto si existe
        if (deep?.executiveSummary) {
            setVerdict({
                type: deep.verdict === 'CONTACTAR URGENTE' ? 'positive' : 'neutral',
                message: deep.executiveSummary
            });
        }

        setLayersStatus(newStatus);
        setFindings(newFindings);
        console.log('🔍 LOAD EXISTING FINDINGS:', {
            findingsCount: newFindings.length,
            layersStatus: newStatus,
            findings: newFindings.map(f => f.title)
        });
    };

    const runForensicScan = async () => {
        if (!hasDeepData) {
            onDeepAnalyze();
            return;
        }

        const newStatus: Record<string, LayerStatus> = {};
        const newFindings: any[] = [];
        const scraped = selectedLead?.source_data?.scraped;

        for (const layer of FORENSIC_LAYERS) {
            newStatus[layer.id] = 'scanning';
            setLayersStatus({ ...newStatus });

            await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300));

            let hasFinding = false;
            let findingData = null;

            if (layer.id === 'fb_ads') {
                const fb = selectedLead?.facebook || selectedLead?.source_data?.facebook || scraped?.facebook || scraped?.instagram;
                if (fb) {
                    hasFinding = true;
                    findingData = {
                        title: "Huella Social: Perfil Activo",
                        content: `Descubierto: ${fb}. El rastro digital indica interacción activa pero nula optimización de conversión.`,
                        action: {
                            label: "Ver Perfil",
                            icon: <ExternalLink className="w-4 h-4" />,
                            onClick: () => window.open(fb.startsWith('http') ? fb : `https://${fb}`, '_blank')
                        },
                        icon: <Share2 className="w-5 h-5 text-blue-400" />,
                        color: "from-blue-600/30 to-indigo-600/30"
                    };
                }
            } else if (layer.id === 'b2b_signals') {
                const li = scraped?.linkedin;
                const emails = scraped?.emails || selectedLead?.source_data?.emails || [];
                if (li || emails.length > 0) {
                    hasFinding = true;
                    findingData = {
                        title: "Infiltración B2B & Contactos",
                        content: li
                            ? `LinkedIn Descubierto: ${li}. Se han infiltrado ${emails.length} correos corporativos.`
                            : `Se han infiltrado ${emails.length} correos corporativos para prospección directa.`,
                        action: {
                            label: emails.length > 0 ? "Disparar IA Email" : "Ver LinkedIn",
                            icon: emails.length > 0 ? <Mail className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />,
                            onClick: () => emails.length > 0 ? setModalTab('trabajo') : window.open(li, '_blank')
                        },
                        icon: <Users className="w-5 h-5 text-purple-400" />,
                        color: "from-purple-600/30 to-pink-600/30"
                    };
                }
            } else if (layer.id === 'tech_debt') {
                // MEJORADO: Criterios concretos para Technical Debt:
                // 1. technicalIssues de la IA
                // 2. CMS secuestrable (Wix/WordPress/Jimdo) = deuda técnica inherente
                // 3. Sin SSL
                // 4. Sin viewport (no responsive)
                const scrapedData = selectedLead?.source_data?.scraped;
                const kimiData = selectedLead?.source_data?.kimi_forensics;
                const problems = deepData?.technicalIssues || [];
                const isSecuestrable = kimiData?.secuestro?.esSecuestrable;
                const noSSL = scrapedData?.hasSSL === false;
                const noViewport = scrapedData?.hasViewport === false;
                const cms = scrapedData?.cms;

                // Cualquiera de estos indica deuda técnica
                if (problems.length > 0 || isSecuestrable || noSSL || noViewport) {
                    hasFinding = true;
                    let reason = '';
                    if (noSSL) {
                        reason = "⚠️ Sin SSL (https). Los navegadores marcan este sitio como INSEGURO.";
                    } else if (isSecuestrable) {
                        reason = kimiData?.secuestro?.anguloVenta || `Plataforma ${cms || 'limitada'} detectada. El cliente NO es dueño real de su sitio.`;
                    } else if (noViewport) {
                        reason = "Sitio NO responsive. 60% del tráfico es móvil y lo está perdiendo.";
                    } else {
                        reason = problems[0]?.issue || "Múltiples fugas técnicas detectadas.";
                    }

                    findingData = {
                        title: `Deuda Técnica Detectada`,
                        content: reason,
                        action: {
                            label: "Reparar infraestructura",
                            icon: <Wrench className="w-4 h-4" />,
                            onClick: () => setModalTab('trabajo')
                        },
                        icon: <Binary className="w-5 h-5 text-cyan-400" />,
                        color: "from-cyan-600/30 to-blue-600/30"
                    };
                }
            } else if (layer.id === 'search_shadow') {
                // Criterios más robustos para Search Shadowing:
                // 1. seoScore bajo de la IA
                // 2. No tiene website
                // 3. Falta meta descripción, título o viewport (indicadores técnicos concretos)
                const scrapedData = selectedLead?.source_data?.scraped;
                const hasWeakSEO = !scrapedData?.hasMetaDesc || !scrapedData?.hasTitle || !scrapedData?.hasViewport;
                const hasBadScore = (deepData?.seoScore !== undefined && deepData?.seoScore < 70);
                const noWebsite = !selectedLead.website;

                if (hasBadScore || noWebsite || hasWeakSEO) {
                    hasFinding = true;
                    const reason = noWebsite
                        ? "El cliente es INVISIBLE en la red. No tiene sitio web oficial."
                        : hasWeakSEO
                            ? "Faltan elementos SEO críticos (meta tags, viewport). Google lo ignora."
                            : `Score de autoridad bajo (${deepData?.seoScore || 0}/100). Competidores lo están opacando.`;

                    findingData = {
                        title: "Sombra Digital: Tráfico & SEO",
                        content: reason,
                        action: {
                            label: "Estrategia de Dominio",
                            icon: <Target className="w-4 h-4" />,
                            onClick: () => setModalTab('diagnostico')
                        },
                        icon: <Search className="w-5 h-5 text-yellow-400" />,
                        color: "from-yellow-600/30 to-orange-600/30"
                    };
                }
            } else if (layer.id === 'dna_history') {
                // NUEVO: DNA History - Antigüedad y obsolescencia del dominio
                // Usamos datos de Kimi Forensics (copyright detection)
                const kimiData = selectedLead?.source_data?.kimi_forensics;
                const copyrightData = kimiData?.copyright;
                const scrapedData = selectedLead?.source_data?.scraped;

                // Señales de sitio antiguo/abandonado:
                // 1. Copyright viejo (2+ años)
                // 2. WordPress detectado (indica sitio establecido)
                // 3. Dominio existe pero con problemas técnicos evidentes
                const esObsoleto = copyrightData?.esObsoleto;
                const añosCopyright = copyrightData?.añosAbandonado || 0;
                const añoDetectado = copyrightData?.añoDetectado;

                if (esObsoleto || (añoDetectado && añoDetectado < new Date().getFullYear() - 1)) {
                    hasFinding = true;
                    findingData = {
                        title: "Huella Temporal Detectada",
                        content: añoDetectado
                            ? `Copyright © ${añoDetectado} detectado. ${añosCopyright} años sin actualizar = sitio ABANDONADO.`
                            : "El dominio muestra signos de abandono prolongado.",
                        action: {
                            label: "Proponer Renovación",
                            icon: <RotateCcw className="w-4 h-4" />,
                            onClick: () => setModalTab('estrategia')
                        },
                        icon: <Fingerprint className="w-5 h-5 text-amber-400" />,
                        color: "from-amber-600/30 to-orange-600/30"
                    };
                }
            }

            if (hasFinding && findingData) {
                newStatus[layer.id] = 'found';
                newFindings.push(findingData);
            } else {
                newStatus[layer.id] = 'none';
            }
            setLayersStatus({ ...newStatus });
        }

        setFindings(newFindings);
        setIsGlobalScanning(false);
        generateVerdict(newStatus);
    };

    const generateVerdict = (status: Record<string, LayerStatus>) => {
        const foundCount = Object.values(status).filter(s => s === 'found').length;
        const iaVerdict = deepData?.executiveSummary || deepData?.verdict;

        if (iaVerdict) {
            setVerdict({
                type: deepData?.verdict === 'CONTACTAR URGENTE' ? 'negative' : 'neutral',
                message: iaVerdict
            });
            return;
        }

        if (foundCount > 2) {
            setVerdict({
                type: 'negative',
                message: "Intervención Urgente: Se han detectado múltiples brechas de inteligencia y fugas de capital activas."
            });
        } else if (foundCount > 0) {
            setVerdict({
                type: 'neutral',
                message: "Rastro Activo: Existen hallazgos específicos que requieren optimización, pero la estructura base es sólida."
            });
        } else {
            setVerdict({
                type: 'positive',
                message: "Rastro Limpio: No se han detectado brechas críticas en las capas analizadas. Operación saludable."
            });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                <div className={cn(
                    "lg:col-span-12 p-8 rounded-3xl border transition-all",
                    isDark ? "bg-zinc-900/60 border-white/10" : "bg-white border-gray-200 shadow-xl"
                )}>
                    <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                        <div>
                            <h4 className={cn("font-bold text-base uppercase tracking-[0.2em]", isDark ? "text-zinc-300" : "text-gray-900")}>
                                Consola Operativa Kimi 2.0
                            </h4>
                            <p className={cn("text-sm mt-1", isDark ? "text-zinc-500" : "text-gray-500")}>Monitoreo de capas de inteligencia profunda</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 bg-black/40 px-5 py-2.5 rounded-2xl border border-white/10 shadow-inner">
                                {(isGlobalScanning || isDeepAnalyzing) ? (
                                    <>
                                        <Activity className="w-5 h-5 text-red-500 animate-pulse" />
                                        <span className="text-xs font-black uppercase tracking-widest text-red-500">Infiltración Activa...</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                                        <span className={cn("text-xs font-black uppercase tracking-widest", isDark ? "text-emerald-400" : "text-emerald-600")}>Sistema Sincronizado</span>
                                    </>
                                )}
                            </div>

                            {!(isGlobalScanning || isDeepAnalyzing) && (
                                <button
                                    onClick={onDeepAnalyze}
                                    className={cn(
                                        "px-6 py-2.5 rounded-2xl border flex items-center gap-3 transition-all active:scale-95 group",
                                        isDark
                                            ? "bg-white/5 border-white/10 hover:bg-red-600/20 hover:border-red-500/50 text-zinc-400 hover:text-red-400"
                                            : "bg-white border-gray-200 hover:bg-red-50 hover:border-red-200 text-gray-500 hover:text-red-600"
                                    )}
                                >
                                    <RotateCcw className="w-4 h-4 group-hover:rotate-[-180deg] transition-transform duration-500" />
                                    <span className="text-[10px] font-black uppercase tracking-tighter">Forzar Re-Auditoría Kimi</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {FORENSIC_LAYERS.map((layer) => {
                            const currentStatus = layersStatus[layer.id] || 'idle';
                            const Icon = layer.icon;
                            return (
                                <div key={layer.id} className="flex items-center justify-between group p-2 rounded-xl hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-lg",
                                            currentStatus === 'scanning' ? "bg-red-500/30 text-red-400 ring-2 ring-red-500/50" :
                                                currentStatus === 'found' ? "bg-yellow-500/30 text-yellow-500 ring-1 ring-yellow-500/30" :
                                                    currentStatus === 'none' ? "bg-green-500/30 text-green-500" :
                                                        isDark ? "bg-white/5 text-zinc-500" : "bg-gray-100 text-gray-400"
                                        )}>
                                            {currentStatus === 'scanning' ? <Loader2 className="w-6 h-6 animate-spin" /> : <Icon className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <p className={cn("text-sm font-bold", isDark ? "text-zinc-200" : "text-gray-900")}>{layer.name}</p>
                                            <p className={cn("text-xs mt-0.5", isDark ? "text-zinc-500" : "text-gray-500")}>{layer.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={cn(
                                            "text-xs font-black uppercase tracking-tight",
                                            currentStatus === 'scanning' ? "text-red-400" :
                                                currentStatus === 'found' ? "text-yellow-500" :
                                                    currentStatus === 'none' ? "text-green-500" :
                                                        isDark ? "text-zinc-700" : "text-gray-300"
                                        )}>
                                            {currentStatus === 'scanning' ? "Analizando" :
                                                currentStatus === 'found' ? "Hallazgo" :
                                                    currentStatus === 'none' ? "Limpio" : "Esperando a Kimi"}
                                        </span>
                                        {currentStatus === 'none' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                        {currentStatus === 'found' && <AlertCircle className="w-4 h-4 text-yellow-500" />}
                                        {currentStatus === 'idle' && <Lock className="w-4 h-4 text-zinc-800" />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {isDeepAnalyzing ? (
                        <div className={cn(
                            "md:col-span-2 p-8 rounded-3xl border flex items-center gap-8 relative overflow-hidden",
                            isDark ? "bg-red-600/10 border-red-500/30" : "bg-red-50 border-red-300"
                        )}>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                            <div className="w-20 h-20 bg-red-600/20 text-red-500 rounded-3xl flex items-center justify-center shrink-0 shadow-lg animate-pulse">
                                <Search className="w-10 h-10" />
                            </div>
                            <div className="flex-1 relative z-10">
                                <h4 className="font-black text-xl text-red-500 uppercase tracking-tighter">Investigación en Curso</h4>
                                <p className={cn("text-sm mt-1 font-medium", isDark ? "text-red-200/60" : "text-red-900/60")}>
                                    Kimi está buceando en la red para descubrir huellas digitales, redes sociales y deuda técnica...
                                </p>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-full animate-bounce">
                                <Loader2 className="w-4 h-4 text-white animate-spin" />
                                <span className="text-[10px] font-black text-white uppercase">Buceando</span>
                            </div>
                        </div>
                    ) : !hasDeepData ? (
                        <div className={cn(
                            "md:col-span-2 p-8 rounded-3xl border border-dashed flex items-center gap-8",
                            isDark ? "bg-red-500/10 border-red-500/30" : "bg-red-50 border-red-300"
                        )}>
                            <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-3xl flex items-center justify-center shrink-0 shadow-inner">
                                <Database className="w-10 h-10" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-xl text-red-500">Datos no sincronizados</h4>
                                <p className={cn("text-sm mt-2 leading-relaxed", isDark ? "text-red-200/60" : "text-red-900/60")}>
                                    Kimi requiere ejecutar su motor de **Descubrimiento y Auditoría** para extraer hallazgos digitales reales de este prospecto.
                                </p>
                            </div>
                            <button
                                onClick={onDeepAnalyze}
                                disabled={isDeepAnalyzing}
                                className="px-8 py-4 bg-red-600 text-white font-black uppercase tracking-wider text-xs rounded-2xl hover:bg-red-500 disabled:opacity-50 transition-all flex items-center gap-3 shadow-lg shadow-red-600/20 active:scale-95"
                            >
                                <Radar className="w-5 h-5" />
                                Iniciar Extracción
                            </button>
                        </div>
                    ) : (
                        <div className={cn(
                            "md:col-span-2 group relative overflow-hidden p-8 rounded-3xl border transition-all text-left",
                            isGlobalScanning || findings.length > 0
                                ? isDark ? "bg-gradient-to-r from-emerald-600/20 to-emerald-900/20 border-emerald-500/40" : "bg-emerald-50 border-emerald-200"
                                : isDark ? "bg-gradient-to-r from-red-600/20 to-red-900/20 border-red-500/40" : "bg-red-50 border-red-200"
                        )}
                            onClick={() => findings.length === 0 && runForensicScan()}
                        >
                            <div className="flex items-center gap-6 relative z-10">
                                <div className={cn(
                                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-xl",
                                    isGlobalScanning || findings.length > 0
                                        ? isDark ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-600"
                                        : isDark ? "bg-red-600 text-white" : "bg-red-100 text-red-600"
                                )}>
                                    {isGlobalScanning ? <Loader2 className="w-8 h-8 animate-spin" /> :
                                        findings.length > 0 ? <CheckCircle2 className="w-8 h-8" /> : <Shield className="w-8 h-8" />}
                                </div>
                                <div>
                                    <h4 className={cn("font-black text-2xl tracking-tight uppercase",
                                        findings.length > 0 ? (isDark ? "text-emerald-400" : "text-emerald-600") : (isDark ? "text-white" : "text-red-600")
                                    )}>
                                        {findings.length > 0 ? "Expediente Decodificado" : "Procesar Arsenal"}
                                    </h4>
                                    <p className={cn("text-sm mt-1 font-medium", isDark ? "text-zinc-400" : "text-gray-600")}>
                                        {findings.length > 0
                                            ? "Kimi ha revelado la evidencia digital real del prospecto."
                                            : "Decodificando evidencia digital real extraída por Kimi"}
                                    </p>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Search className="w-24 h-24" />
                            </div>
                        </div>
                    )}

                    <div className={cn(
                        "p-8 rounded-3xl border flex flex-col justify-center",
                        isDark ? "bg-zinc-900/80 border-white/10" : "bg-gray-100 border-gray-200"
                    )}>
                        <div className="flex items-center gap-3 mb-4">
                            <Fingerprint className="w-5 h-5 text-red-500" />
                            <span className={cn("font-black uppercase tracking-widest text-[10px]", isDark ? "text-zinc-400" : "text-gray-500")}>Discovery de Activos</span>
                        </div>

                        <div className="space-y-3">
                            {/* Emails */}
                            {(() => {
                                const emails = selectedLead?.source_data?.scraped?.emails || selectedLead?.source_data?.emails || [];
                                if (emails.length > 0) {
                                    return (
                                        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                                            <p className="text-[10px] font-black text-zinc-600 mb-1 uppercase">Emails Descubiertos</p>
                                            <p className="font-mono text-xs truncate text-white">{emails[0]}</p>
                                            {emails.length > 1 && <p className="text-[9px] text-zinc-500 mt-1">+{emails.length - 1} más detectados</p>}
                                        </div>
                                    );
                                }
                                return (
                                    <div className="flex items-center gap-2 text-zinc-500 bg-black/10 p-2 rounded-lg border border-dashed border-white/5">
                                        <AlertCircle className="w-3 h-3 shrink-0" />
                                        <p className="text-[10px] font-bold">Sin emails detectados</p>
                                    </div>
                                );
                            })()}

                            {/* Social Discovery */}
                            {(() => {
                                const fb = selectedLead?.facebook || selectedLead?.source_data?.scraped?.facebook;
                                const li = selectedLead?.source_data?.scraped?.linkedin;
                                if (fb || li) {
                                    return (
                                        <div className="flex flex-wrap gap-2">
                                            {li && (
                                                <button
                                                    onClick={() => window.open(li, '_blank')}
                                                    className="flex items-center gap-2 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-[10px] font-bold hover:bg-blue-500/20 transition-colors"
                                                >
                                                    <Ghost className="w-3 h-3" /> LinkedIn
                                                </button>
                                            )}
                                            {fb && (
                                                <button
                                                    onClick={() => window.open(fb.startsWith('http') ? fb : `https://${fb}`, '_blank')}
                                                    className="flex items-center gap-2 px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 text-[10px] font-bold hover:bg-indigo-500/20 transition-colors"
                                                >
                                                    <Share2 className="w-3 h-3" /> Facebook
                                                </button>
                                            )}
                                        </div>
                                    );
                                }
                                return null;
                            })()}
                        </div>

                        <p className={cn("mt-4 text-[10px] italic leading-relaxed", isDark ? "text-zinc-500" : "text-gray-500")}>
                            "Kimi ha infiltrado la huella digital del prospecto."
                        </p>
                    </div>
                </div>
            </div>

            {/* === KIMI FORENSICS REAL === */}
            {selectedLead?.source_data?.kimi_forensics && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2">
                    {/* Loss Score Card - DESHABILITADO INTENCIONALMENTE */}
                    {/* Razón: Los cálculos son demasiado inexactos para B2B de alto ticket. */}
                    {/* Ejemplo: Biocrom (equipos de millones USD) mostraba pérdida de $20k CLP = ridículo */}
                    {/* Esto daña credibilidad y genera malos speech de ventas */}

                    {/* Secuestro Técnico Card */}
                    {selectedLead.source_data.kimi_forensics.secuestro?.esSecuestrable && (
                        <div className={cn(
                            "p-6 rounded-2xl border relative overflow-hidden",
                            isDark ? "bg-purple-600/20 border-purple-500/40" : "bg-purple-50 border-purple-300"
                        )}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wider text-purple-400">Secuestro Técnico</p>
                                    <p className="text-lg font-black text-white">
                                        {selectedLead.source_data.kimi_forensics.secuestro?.plataforma}
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-zinc-300 leading-relaxed">
                                {selectedLead.source_data.kimi_forensics.secuestro?.anguloVenta}
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                                <span className="text-[10px] font-bold text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">
                                    +{selectedLead.source_data.kimi_forensics.secuestro?.puntos} pts oportunidad
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Copyright Detection Card */}
                    {selectedLead.source_data.kimi_forensics.copyright?.añoDetectado && (
                        <div className={cn(
                            "p-6 rounded-2xl border relative overflow-hidden",
                            selectedLead.source_data.kimi_forensics.copyright?.esObsoleto
                                ? "bg-amber-600/20 border-amber-500/40"
                                : "bg-green-600/20 border-green-500/40"
                        )}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center",
                                    selectedLead.source_data.kimi_forensics.copyright?.esObsoleto
                                        ? "bg-amber-600 text-white"
                                        : "bg-green-600 text-white"
                                )}>
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wider text-amber-400">Copyright Detectado</p>
                                    <p className="text-2xl font-black text-white">
                                        © {selectedLead.source_data.kimi_forensics.copyright?.añoDetectado}
                                    </p>
                                </div>
                            </div>
                            {selectedLead.source_data.kimi_forensics.copyright?.esObsoleto ? (
                                <p className="text-xs text-amber-300">
                                    ⚠️ {selectedLead.source_data.kimi_forensics.copyright?.añosAbandonado} años sin actualizar = sitio abandonado
                                </p>
                            ) : (
                                <p className="text-xs text-green-300">
                                    ✅ Sitio actualizado recientemente
                                </p>
                            )}
                        </div>
                    )}

                    {/* Si no hay secuestro, mostrar salud social */}
                    {!selectedLead.source_data.kimi_forensics.secuestro?.esSecuestrable &&
                        selectedLead.source_data.kimi_forensics.saludSocial?.length > 0 && (
                            <div className={cn(
                                "p-6 rounded-2xl border",
                                isDark ? "bg-blue-600/20 border-blue-500/40" : "bg-blue-50 border-blue-300"
                            )}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                                        <Share2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-wider text-blue-400">Presencia Social</p>
                                        <p className="text-lg font-black text-white">
                                            {selectedLead.source_data.kimi_forensics.saludSocial.length} redes activas
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedLead.source_data.kimi_forensics.saludSocial.map((red: any, i: number) => (
                                        <span key={i} className="text-[10px] font-bold text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full capitalize">
                                            {red.platform}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                </div>
            )}

            {verdict && (
                <div className={cn(
                    "p-8 rounded-3xl border animate-in zoom-in-95 duration-500 flex items-center gap-8 shadow-2xl",
                    verdict.type === 'negative' ? "bg-red-600/20 border-red-500/30" :
                        verdict.type === 'neutral' ? "bg-yellow-600/20 border-yellow-500/30" :
                            "bg-green-600/20 border-green-500/30"
                )}>
                    <div className={cn(
                        "w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 shadow-xl",
                        verdict.type === 'negative' ? "bg-red-600 text-white" :
                            verdict.type === 'neutral' ? "bg-yellow-600 text-black" :
                                "bg-green-600 text-white"
                    )}>
                        {verdict.type === 'positive' ? <CheckCircle2 className="w-10 h-10" /> : <ShieldAlert className="w-10 h-10" />}
                    </div>
                    <div>
                        <h5 className={cn(
                            "text-xs font-black uppercase tracking-[0.3em] mb-3",
                            verdict.type === 'negative' ? "text-red-400" :
                                verdict.type === 'neutral' ? "text-yellow-600" :
                                    "text-green-400"
                        )}>
                            Veredicto Kimi Deep-Infiltration
                        </h5>
                        <p className={cn("text-xl font-black leading-tight", isDark ? "text-white" : "text-gray-900")}>
                            {verdict.message}
                        </p>
                    </div>
                </div>
            )}

            {(() => {
                console.log('🔍 RENDER CHECK:', {
                    findingsLength: findings.length,
                    findings: findings.map(f => ({ title: f.title, hasAction: !!f.action }))
                });
                return findings.length > 0 && (
                    <div className="pt-8 animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="h-px bg-white/10 flex-1" />
                            <h5 className={cn("text-xs font-black uppercase tracking-[0.3em]", isDark ? "text-zinc-500" : "text-gray-400")}>
                                Evidencia Digital Confirmada
                            </h5>
                            <div className="h-px bg-white/10 flex-1" />
                        </div>

                        <div className={cn(
                            "grid grid-cols-1 md:grid-cols-2 gap-4",
                            isDark ? "p-6" : "p-6"
                        )}>
                            {findings.map((c: any, i: number) => (
                                <div key={i} className={cn(
                                    "p-6 rounded-2xl border relative overflow-hidden group hover:scale-[1.02] transition-all",
                                    isDark ? "bg-gradient-to-br border-white/10" : "bg-white border-gray-200",
                                    c.color
                                )}>
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white/10">
                                            {c.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h6 className="text-lg font-black text-white mb-2">{c.title}</h6>
                                            <p className="text-sm text-zinc-200 leading-relaxed">{c.content}</p>
                                        </div>
                                    </div>

                                    {c.action && (
                                        <button
                                            onClick={c.action.onClick}
                                            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-lg transition-all"
                                        >
                                            {c.action.icon}
                                            {c.action.label}
                                            <ArrowRight className="w-3 h-3" />
                                        </button>
                                    )}

                                    <div className="absolute -bottom-2 -right-2 opacity-5">
                                        {React.cloneElement(c.icon, { className: "w-20 h-20" })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })()}

            < div className={cn(
                "p-8 rounded-3xl border flex items-start gap-6 transition-all",
                isDark ? "bg-zinc-950/80 border-white/5 text-zinc-400" : "bg-white border-gray-200 text-gray-500 shadow-sm"
            )}>
                <ShieldAlert className="w-8 h-8 shrink-0 text-red-500 opacity-80" />
                <div className="space-y-2">
                    <p className="text-sm font-bold tracking-tight uppercase">Protocolo de Integridad Técnica</p>
                    <p className="text-sm leading-relaxed">
                        Daniel, cada hallazgo arriba tiene ahora un **Gatillo de Acción**. No te limites a ver el problema; úsalo para disparar la solución de HojaCero. Si ves Deuda Técnica, repara. Si ves Oportunidad en Ads, inyecta el motor.
                    </p>
                </div>
            </div>

        </div >
    );
};
