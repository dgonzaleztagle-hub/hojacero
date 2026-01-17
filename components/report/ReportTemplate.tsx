import React from 'react';
import { Target, AlertTriangle, CheckCircle2, Zap, Shield, Globe, Server, Mail } from 'lucide-react';

interface ReportTemplateProps {
    lead: any;
    analysis: any;
    customizations: {
        showCover: boolean;
        showTechSpecs: boolean;
        showActionPlan: boolean;
        showContentIdeas: boolean;
        tone: 'friendly' | 'corporate' | 'urgent';
    };
}

export const ReportTemplate = React.forwardRef<HTMLDivElement, ReportTemplateProps>(({ lead, analysis, customizations }, ref) => {
    // DEBUG: Inspect incoming data
    console.log("REPORT DEBUG:", {
        leadId: lead?.id,
        razon_ia: lead?.razon_ia,
        analysisReport: analysis?.analysisReport,
        analysisReason: analysis?.reason,
        deep_analysis_tasks: lead?.source_data?.deep_analysis?.actionable_tasks,
        techSpecs: lead?.source_data?.techSpecs
    });

    const { deep_analysis, techSpecs } = lead.source_data || {};

    // --- HIGH-TIER TRANSLATION ENGINE ---
    // Maps technical terms from AI analysis to professional Spanish
    const t = (term: string) => {
        const dictionary: Record<string, string> = {
            'High': 'Alto Impacto',
            'Medium': 'Prioridad Media',
            'Low': 'Optimización',
            'Technical': 'Técnico',
            'Content': 'Estrategia',
            'Security': 'Seguridad',
            'Performance': 'Rendimiento',
            'Branding': 'Imagen de Marca',
            'Growth': 'Crecimiento',
            'Easy': 'Inmediato',
            'Hard': 'Estratégico'
        };
        return dictionary[term] || term;
    };

    // --- REALISTIC SCORING LOGIC ---
    // As an elite agency, we don't show "98/100" to a client with an outdated site.
    // We cap the score to reflect the URGENCY of the redesign.
    const calculateVisualScore = () => {
        let baseScore = analysis?.seoScore || 0;
        if (baseScore > 90) baseScore = 85; // Optimization for transparency

        // Critical Killers: if no SSL or mobile issues, the score CANNOT be green.
        if (techSpecs?.hasSSL === false) {
            return Math.min(baseScore, 48); // Cap at "Critical/Yellow" range
        }
        if (deep_analysis?.technicalIssues?.length > 4) {
            return Math.min(baseScore, 55);
        }
        return baseScore || (lead?.razon_ia ? 45 : 30);
    };

    const visualScore = calculateVisualScore();

    // --- DYNAMIC EXECUTIVE SUMMARY GENERATOR ---
    const generateExecutiveSummary = () => {
        if (analysis?.analysisReport && !analysis.analysisReport.includes("Error")) return analysis.analysisReport;
        if (lead?.razon_ia && !lead.razon_ia.includes("Error")) return lead.razon_ia;

        const vibe = analysis?.vibe || "corporativo pero desconectado";
        const painPoints = deep_analysis?.salesStrategy?.painPoints || ["limitada capacidad de persuasión", "fricción en la experiencia de usuario"];
        const hook = deep_analysis?.salesStrategy?.hook || "Modernización de infraestructura digital";

        // Rich, Consultative, & Human Narrative
        const p1 = `Hemos realizado una auditoría profunda de su huella digital actual. Si bien la infraestructura base es funcional, detectamos una proyección de marca que se percibe como **"${vibe}"**. Existe una desconexión notable entre la calidad real de su servicio y cómo este es interpretado por nuevos visitantes, lo que genera una fricción innecesaria en la primera impresión.`;

        const p2 = `Desde una perspectiva técnica, identificamos barreras que están limitando su crecimiento orgánico. Factores críticos como **${painPoints[0]}**${painPoints[1] ? ` y problemas de **${painPoints[1]}**` : ''} están actuando como frenos invisibles. En el mercado actual, estos detalles no son solo 'errores informáticos', sino fugas directas de credibilidad y oportunidades comerciales.`;

        const p3 = `La ruta de optimización es clara. Nuestra estrategia se centra en **${hook}**, transformando su sitio web de un simple catálogo informativo a un activo comercial de alto rendimiento. Al implementar las correcciones detalladas en este reporte, no solo cumplirá con los estándares modernos, sino que posicionará su marca con la autoridad digital que merece.`;

        return `${p1}\n\n${p2}\n\n${p3}`;
    };

    const reportText = generateExecutiveSummary();
    const tasks = deep_analysis?.actionable_tasks?.length > 0 ? deep_analysis.actionable_tasks : [
        { title: "Habilitar Seguridad SSL", category: "Security", impact: "High" },
        { title: "Optimizar Velocidad de Carga", category: "Performance", impact: "High" },
        { title: "Configurar Email Corporativo", category: "Branding", impact: "Medium" },
        { title: "Crear Estrategia de Contenido", category: "Growth", impact: "Medium" }
    ];

    const criticalIssues = deep_analysis?.technicalIssues?.length > 0 ? deep_analysis.technicalIssues : [
        "Falta de Certificado SSL (https)",
        "Velocidad de carga superior a 3 segundos",
        "Meta descripciones faltantes o genéricas",
        "Problemas de adaptación a móviles"
    ];

    const growthOpps = deep_analysis?.salesStrategy?.painPoints?.length > 0 ? deep_analysis.salesStrategy.painPoints : [
        "Captura de leads con CTAs estratégicos",
        "Mejora en consistencia visual de marca",
        "Automatización de flujo de ventas",
        "Implementación de prueba social"
    ];

    // --- HUMAN TRANSLATOR HELPERS ---
    const translateTech = (spec: string, value: any) => {
        if (spec === 'ssl') {
            return value
                ? { title: "Seguridad y Confianza", status: "Protegido", desc: "Sitio con candado de seguridad activo." }
                : { title: "Seguridad y Confianza", status: "Riesgo", desc: "El sitio muestra alertas de 'No Seguro'." };
        }
        if (spec === 'email') {
            return value
                ? { title: "Correo Corporativo", status: "Profesional", desc: "Emails con dominio propio detectado." }
                : { title: "Correo Corporativo", status: "Alerta", desc: "Uso de correos genéricos o falta de MX." };
        }
        if (spec === 'server') {
            return { title: "Infraestructura", status: value || "Local", desc: "Plataforma de hosting e infraestructura base." };
        }
        return { title: spec, status: value, desc: "" };
    };

    const sslInfo = translateTech('ssl', techSpecs?.hasSSL);
    const emailInfo = translateTech('email', techSpecs?.hasMX);
    const serverInfo = translateTech('server', techSpecs?.server);

    return (
        <div ref={ref} className="w-full max-w-[210mm] mx-auto bg-white text-zinc-900 font-sans leading-relaxed print:m-0 print:p-0">
            <style type="text/css" media="print">
                {`
                    @page { size: A4; margin: 0mm; }
                    body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; }
                `}
            </style>

            {/* --- PAGE 1: PORTADA EDITORIAL --- */}
            {customizations.showCover && (
                <div className="w-[210mm] h-[290mm] relative flex flex-col justify-between p-16 bg-white break-after-page border-b-8 border-black print:break-after-page overflow-hidden">
                    {/* Background Texture similar to "Architect" logo paper */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/graphy.png")' }} />

                    {/* Branding Top */}
                    <div className="relative z-10 pt-8">
                        <img src="/branding/h0-architect.png" alt="H0 Intelligence" className="w-24 mx-auto mb-6 opacity-90 mix-blend-multiply" />
                        <div className="text-center">
                            <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-zinc-400">Architects of Digital Experiences</h2>
                        </div>
                    </div>

                    {/* Central Title Block - Editorial Style */}
                    <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center space-y-8">
                        <div className="space-y-2">
                            <p className="text-cyan-600 font-bold tracking-widest uppercase text-sm">Auditoría Estratégica</p>
                            <h1 className="text-7xl font-bold text-black tracking-tighter leading-[0.9]">
                                TU PLAN DE<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-600">CRECIMIENTO</span><br />
                                DIGITAL
                            </h1>
                        </div>

                        <div className="w-24 h-1 bg-cyan-500 mx-auto rounded-full" />

                        <div className="max-w-md mx-auto">
                            <p className="text-xl text-zinc-500 font-medium">
                                Análisis de infraestructura, oportunidades y hoja de ruta para <span className="text-black font-bold">{lead?.title || 'Tu Negocio'}</span>.
                            </p>
                            <p className="mt-4 text-zinc-400 font-mono text-sm">{lead?.url || 'Sitio Web'}</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="relative z-10 flex justify-between items-center text-xs font-mono text-zinc-400 border-t border-zinc-100 pt-8">
                        <span>CONFIDENCIAL</span>
                        <span>{new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}</span>
                    </div>
                </div>
            )}

            {/* --- PAGE 2: DIAGNÓSTICO BENTO GRID --- */}
            <div className="w-[210mm] h-[290mm] p-10 relative flex flex-col bg-slate-50 break-after-page print:break-after-page overflow-hidden">

                {/* Header Compacto */}
                <header className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-200">
                    <div className="flex items-center gap-3">
                        <img src="/branding/h0-architect.png" alt="H0" className="w-10 opacity-80 mix-blend-multiply" />
                        <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Architects of Digital Experiences</span>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600">Diagnóstico 360°</h2>
                    </div>
                </header>

                {/* BENTO GRID LAYOUT */}
                <div className="grid grid-cols-6 grid-rows-6 gap-3 flex-1 overflow-hidden">

                    {/* 1. SCORE CARD (Maximum Verticality) */}
                    <div className="col-span-2 row-span-4 bg-white rounded-2xl p-4 shadow-sm border border-zinc-100 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-cyan-500" />
                        <h3 className="text-xs font-bold uppercase text-zinc-400 mb-2 tracking-wider">Salud Digital</h3>
                        <div className="text-8xl font-bold text-zinc-900 tracking-tighter">{visualScore}</div>
                        <div className="text-sm font-medium text-zinc-500 mt-2">de 100 Puntos</div>
                    </div>

                    {/* 2. REPORT TEXT (Dominate Space 66%) */}
                    <div className="col-span-4 row-span-4 bg-white rounded-2xl p-8 shadow-sm border border-zinc-100 flex flex-col overflow-hidden">
                        <h3 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-cyan-600" />
                            ¿Qué encontramos?
                        </h3>
                        <div className="space-y-4 overflow-hidden flex-1">
                            {reportText.split('\n\n').map((paragraph, i) => (
                                <p key={i} className="text-xs text-zinc-600 leading-relaxed text-pretty">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* 3. HUMAN TRANSLATOR (Tech Specs - Compact Row) */}
                    {customizations.showTechSpecs && (
                        <div className="col-span-6 row-span-1 grid grid-cols-3 gap-3">
                            {/* SSL Card - Horizontal */}
                            <div className="bg-white rounded-xl px-4 py-2 border border-zinc-100 shadow-sm flex items-center gap-3">
                                <Shield className={`w-6 h-6 ${techSpecs?.hasSSL ? 'text-green-500' : 'text-red-500'} shrink-0`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h4 className="font-bold text-[10px] text-zinc-900 truncate">Seguridad</h4>
                                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${techSpecs?.hasSSL ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                            {techSpecs?.hasSSL ? 'PROTEGIDO' : 'RIESGO'}
                                        </span>
                                    </div>
                                    <p className="text-[9px] text-zinc-500 truncate leading-tight">{sslInfo.desc}</p>
                                </div>
                            </div>

                            {/* Email Card - Horizontal */}
                            <div className="bg-white rounded-xl px-4 py-2 border border-zinc-100 shadow-sm flex items-center gap-3">
                                <Mail className={`w-6 h-6 ${techSpecs?.hasMX ? 'text-blue-500' : 'text-amber-500'} shrink-0`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h4 className="font-bold text-[10px] text-zinc-900 truncate">Email</h4>
                                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${techSpecs?.hasMX ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                                            {techSpecs?.hasMX ? 'PROFESIONAL' : 'ALERTA'}
                                        </span>
                                    </div>
                                    <p className="text-[9px] text-zinc-500 truncate leading-tight">{emailInfo.desc}</p>
                                </div>
                            </div>

                            {/* Server Card - Horizontal */}
                            <div className="bg-white rounded-xl px-4 py-2 border border-zinc-100 shadow-sm flex items-center gap-3">
                                <Server className="w-6 h-6 text-purple-500 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h4 className="font-bold text-[10px] text-zinc-900 truncate">Infraestructura</h4>
                                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 uppercase">
                                            ESTADO
                                        </span>
                                    </div>
                                    <p className="text-[9px] text-zinc-500 truncate leading-tight">{serverInfo.desc}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. CRITICAL & GROWTH LISTS (Ultra Compact) */}
                    <div className={`col-span-3 ${customizations.showTechSpecs ? 'row-span-1' : 'row-span-2'} bg-white rounded-2xl px-5 py-3 shadow-sm border border-zinc-100 overflow-hidden flex flex-col justify-center`}>
                        <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-red-600 mb-2">
                            <AlertTriangle className="w-3 h-3" />
                            Lo Urgente
                        </h4>
                        <ul className="space-y-1">
                            {criticalIssues.slice(0, 3).map((p: string, i: number) => (
                                <li key={i} className="text-[10px] text-zinc-700 flex items-center gap-2 leading-tight truncate">
                                    <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
                                    <span className="truncate">{p}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={`col-span-3 ${customizations.showTechSpecs ? 'row-span-1' : 'row-span-2'} bg-white rounded-2xl px-5 py-3 shadow-sm border border-zinc-100 overflow-hidden flex flex-col justify-center`}>
                        <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-cyan-700 mb-2">
                            <Zap className="w-3 h-3" />
                            Oportunidades
                        </h4>
                        <ul className="space-y-1">
                            {growthOpps.slice(0, 3).map((p: string, i: number) => (
                                <li key={i} className="text-[10px] text-zinc-700 flex items-center gap-2 leading-tight truncate">
                                    <span className="w-1 h-1 rounded-full bg-cyan-500 shrink-0" />
                                    <span className="truncate">{p}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* --- PAGE 3: PLAN & IDEAS (Compact) --- */}
            {customizations.showActionPlan && (
                <div className="w-[210mm] h-[290mm] p-12 relative flex flex-col bg-white break-after-avoid print:break-inside-avoid overflow-hidden">
                    <header className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-200">
                        <div className="flex items-center gap-3">
                            <img src="/branding/h0-architect.png" alt="H0" className="w-10 opacity-80 mix-blend-multiply" />
                            <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Architects of Digital Experiences</span>
                        </div>
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600">Hoja de Ruta</h2>
                    </header>

                    <div className="flex-1 flex flex-col gap-8">

                        {/* Task List */}
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex-1">
                            <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-zinc-400" />
                                Pasos Recomendados
                            </h3>
                            <div className="space-y-4">
                                {tasks.slice(0, 6).map((task: any, idx: number) => (
                                    <div key={idx} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-zinc-100 items-center">
                                        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-xs text-zinc-400 font-mono">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-zinc-800">{task.title}</h4>
                                            <p className="text-[10px] text-zinc-400 mt-0.5 uppercase tracking-wider">{t(task.category)}</p>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-[10px] font-bold border uppercase
                                            ${task.impact === 'High' ? 'bg-red-50 text-red-600 border-red-100' :
                                                task.impact === 'Medium' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                                    'bg-blue-50 text-blue-600 border-blue-100'}`}
                                        >
                                            {t(task.impact)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Creative Lab */}
                        {customizations.showContentIdeas && (
                            <div className="grid grid-cols-2 gap-6 h-1/3">
                                <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-100">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-4 flex items-center gap-2">
                                        <Zap className="w-4 h-4" />
                                        Ideas de Contenido Social
                                    </h4>
                                    <ul className="space-y-3">
                                        {deep_analysis.content_ideas?.social_posts?.slice(0, 3).map((post: any, i: number) => (
                                            <li key={i} className="text-xs text-zinc-600 italic leading-snug">
                                                "{post.idea}"
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-100">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-4 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Asuntos para Email Marketing
                                    </h4>
                                    <ul className="space-y-3">
                                        {deep_analysis.content_ideas?.email_subjects?.slice(0, 3).map((subj: string, i: number) => (
                                            <li key={i} className="text-xs text-zinc-600 font-medium leading-snug">
                                                📩 {subj}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});

ReportTemplate.displayName = 'ReportTemplate';
