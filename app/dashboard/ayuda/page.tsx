
'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Rocket, Shield, Database,
    Terminal, Layout, Search, Command,
    ChevronRight, BookOpen, UserCheck,
    Settings, Star, AlertCircle, PlayCircle,
    ShoppingBag, DollarSign, Box, BarChart3,
    Cpu, Target, Activity, Flame, Megaphone,
    Code, Fingerprint, Eye, Globe, Lock,
    CheckCircle2, AlertTriangle, Info,
    Cpu as Engine, Settings2, ShieldCheck,
    Server, GitBranch, Share2, ClipboardList
} from 'lucide-react';

type WorkflowCategory = 'factory' | 'worker' | 'maintenance' | 'dna';

interface WorkflowDetail {
    id: string;
    category: WorkflowCategory;
    title: string;
    slash: string;
    strategy: string;
    impact: {
        db: string[];
        files: string[];
        core: string[];
    };
    steps: string[];
    rules: string[];
    icon: any;
}

const MonitorPlay = ({ size, className }: { size?: number, className?: string }) => (
    <PlayCircle size={size} className={className} />
);

const WORKFLOW_DATABASE: WorkflowDetail[] = [
    {
        id: 'factory-brand',
        category: 'factory',
        title: 'Factory Brand Authority',
        slash: '/factory-brand',
        icon: Fingerprint,
        strategy: 'Estandariza la autoridad de HojaCero en proyectos externos proyectando estatus AEO/GEO.',
        impact: {
            db: ['N/A (Frontend Only)'],
            files: ['layout.tsx', 'Footer.tsx', 'package.json'],
            core: ['JSON-LD Authority', 'Silent Branding CSS']
        },
        steps: [
            'Inyección de Schema JSON-LD corporativo.',
            'Implementación de "Filtro Ninja" en Footer.',
            'Verificación de dependencias Modern UI (Tailwind v4).',
            'Firma de Identidad Git (Hojacero Factory Bot).'
        ],
        rules: [
            'Prohibido usar grises en el branding; debe ser invisible al ojo humano pero visible a las IAs.',
            'Build check obligatorio antes de exportar.'
        ]
    },
    {
        id: 'factory-deploy',
        category: 'factory',
        title: 'Factory Safe Deploy',
        slash: '/factory-deploy',
        icon: Rocket,
        strategy: 'Lanzamiento blindado a GitHub y Vercel eliminando el error humano de inicialización.',
        impact: {
            db: ['monitored_sites'],
            files: ['EXPORT_MANIFEST.json', 'git config'],
            core: ['Deployment Automation', 'Asset integrity check']
        },
        steps: [
            'Validación de exportación previa (Manifest Check).',
            'Git Health Check (Verificación de assets ignorados).',
            'Inicialización atómica y vinculación remota.',
            'Push blindado con forzado de fuente de verdad.'
        ],
        rules: [
            'No inicializar git si no existe un export verificado.',
            'Confirmar que los assets NO están en .gitignore antes del push.'
        ]
    },
    {
        id: 'factory-export',
        category: 'factory',
        title: 'Smart Export Standalone',
        slash: '/factory-export',
        icon: Box,
        strategy: 'Empaquetado quirúrgico para entrega final. Copia solo lo necesario, eliminando el peso del monorepo.',
        impact: {
            db: ['monitored_sites'],
            files: ['scripts/export-helper-v3.js', 'package.json gen'],
            core: ['Dependency analysis', 'Isolation logic']
        },
        steps: [
            'Auditoría previa del Juez (Factory Auditor).',
            'Análisis recursivo de dependencias.',
            'Generación de package.json dinámico.',
            'Ejecución de build de prueba en el export.'
        ],
        rules: [
            'Solo ejecutar después de pago confirmado.',
            'El build de prueba debe dar PASS para habilitar el export.'
        ]
    },
    {
        id: 'factory-final',
        category: 'factory',
        title: 'Golden Master Production',
        slash: '/factory-final',
        icon: Layout,
        strategy: 'Transforma una landing de prueba en un ecosistema multi-página profesional de alto valor.',
        impact: {
            db: ['monitored_sites'],
            files: ['/nosotros', '/servicios', '/contacto', 'layout.tsx'],
            core: ['Structural Consistency', 'Style Lock Enforcement']
        },
        steps: [
            'Lectura de Style Lock y Discovery Notes.',
            'Invocación del Arquitecto (Consistency Guard).',
            'Creación de Layout Centralizado y Navbar Premium.',
            'Generación de contenido expandido con validación de secciones WOW.'
        ],
        rules: [
            'Prohibido modificar el demo original; debe clonarse y expandirse.',
            'Cada página secundaria debe ser una hermana gemela estética del demo.'
        ]
    },
    {
        id: 'factory-qa',
        category: 'factory',
        title: 'Juez Awwwards Audit',
        slash: '/factory-qa',
        icon: ShieldCheck,
        strategy: 'Protocolo de rechazo proactivo. Asegura que ningún sitio de calidad mediocre sea entregado.',
        impact: {
            db: ['N/A'],
            files: ['qa_report.md', 'task.md'],
            core: ['Design Gate', 'Technical Security Audit']
        },
        steps: [
            'Simulación de Auditor Técnico y Director Creativo.',
            'Auditoría Mobile (Filtro Real en 393px).',
            'Check de Tensión Visual y Motion Branding.',
            'Generación de qa_report.md (Puntuación 0-10).'
        ],
        rules: [
            'Si el score es < 8.0, el sitio se considera RECHAZADO.',
            'Cero Blockers permitidos para la entrega.'
        ]
    },
    {
        id: 'factory-seo',
        category: 'factory',
        title: 'Oracle SEO & Retention',
        slash: '/factory-seo',
        icon: Search,
        strategy: 'Inyección de autoridad máxima ante buscadores y activación del Kill Switch de seguridad.',
        impact: {
            db: ['site_status', 'monitored_sites'],
            files: ['SEOHead.tsx', 'sitemap.xml', 'robots.txt'],
            core: ['Kill Switch Injection', 'AEO Optimization']
        },
        steps: [
            'Registro de cliente en Supabase y generación de UUID.',
            'Generación de estrategia JSON-LD LocalBusiness.',
            'Inyección del script de Retención (Kill Switch).',
            'Auditoría de imágenes y jerarquía de headings.'
        ],
        rules: [
            'Solo ejecutar para clientes confirmados.',
            'El Kill Switch debe incluir el UUID registrado en Supabase.'
        ]
    },
    {
        id: 'factory-demo',
        category: 'factory',
        title: 'High-Impact Demo Landing',
        slash: '/factory-demo',
        icon: Flame,
        strategy: 'Generación de landing de impacto visual extremo en 15 minutos para cerrar ventas.',
        impact: {
            db: ['h0_landings'],
            files: ['app/prospectos/[cliente]/page.tsx'],
            core: ['Menu Mirroring', 'Visual Vibe Selection']
        },
        steps: [
            'Deep Discovery (Scraping de sitio actual o Soul Interview).',
            'Generación de BRAND_SOUL.md externo.',
            'Inyección de componentes premium (Arsenal V4.0).',
            'Activación de DemoTracker para monitoreo de apertura.'
        ],
        rules: [
            'No es un MVP; es un espejo perfecto elevado.',
            'Prohibido usar texto Lorem Ipsum; usar copy estratégico.'
        ]
    },
    {
        id: 'factory-alive',
        category: 'factory',
        title: 'Primitivas Visuales Alive',
        slash: '/factory-alive',
        icon: Activity,
        strategy: 'Inyección de vida orgánica mediante componentes matemáticos ligeros en el Hero.',
        impact: {
            db: ['N/A'],
            files: ['components/premium/primitives/', 'page.tsx'],
            core: ['Ambient Physics', 'Motion Personality']
        },
        steps: [
            'Diagnóstico de "Hero Muerto".',
            'Selección de primitiva (Grid, Particle, Mesh, Orb) según rubro.',
            'Implementación One-Shot (Z-Index, Resize, Performance).',
            'Validación visual del efecto "Aire/Premium".'
        ],
        rules: [
            'Menos es más: no debe arruinar la legibilidad.',
            'Evitar vicios repetitivos; variar las primitivas entre clientes.'
        ]
    },
    {
        id: 'worker-ads-factory',
        category: 'worker',
        title: 'Ads-Factory Engine',
        slash: '/worker-ads-factory',
        icon: Megaphone,
        strategy: 'Dota al cliente (H0 o externo) de una fábrica de landings de conversión directa.',
        impact: {
            db: ['h0_landings'],
            files: ['app/lp/[slug]/', 'app/dashboard/ads-factory/'],
            core: ['Dynamic Renderer', 'Conversion UI']
        },
        steps: [
            'Instalación de tablas de persistencia de landings.',
            'Inyección del Dashboard de control para Gastón.',
            'Activación de rutas de renderizado dinámico.',
            'QA de conversión sobre landing de prueba.'
        ],
        rules: [
            'Cada landing debe ser autónoma para evitar romper el master.',
            'Mantener el foco en Direct Response.'
        ]
    },
    {
        id: 'worker-automate',
        category: 'worker',
        title: 'Automate Mass Processing',
        slash: '/worker-automate',
        icon: Cpu,
        strategy: 'Automatización masiva de assets y data al estilo ICEBUIN para escalar proyectos.',
        impact: {
            db: ['N/A'],
            files: ['scripts/automation/', 'public/assets/'],
            core: ['Bulk asset processing', 'Data injection scripts']
        },
        steps: [
            'Escaneo de "Manualidad" en el proyecto.',
            'Generación de scripts de procesamiento WebP masivo.',
            'Generación de ALTs automáticos vía IA.',
            'Inyección masiva de contenido desde JSON/Excel.'
        ],
        rules: [
            'Si lo haces > 3 veces, automatízalo.',
            'Verificar cambios en caliente después de cada ejecución masiva.'
        ]
    },
    {
        id: 'worker-cash-pro',
        category: 'worker',
        title: 'Cash Flow Add-on Pro',
        slash: '/worker-cash-pro',
        icon: DollarSign,
        strategy: 'Control total de flujo de efectivo y gastos manuales para negocios físicos.',
        impact: {
            db: ['cash_register', 'cash_movements'],
            files: ['components/food-engine/CashManager.tsx'],
            core: ['Financial Tracking', 'Admin Control']
        },
        steps: [
            'Creación de tablas de diario de caja.',
            'Inyección del componente CashManager en el Dashboard.',
            'Configuración de RLS para Admin Only.',
            'QA de apertura y cierre de caja.'
        ],
        rules: [
            'El registro de cierre debe guardar la diferencia (sobrante/faltante) sin excepción.',
            'Bloqueo de movimientos si la caja no está abierta.'
        ]
    },
    {
        id: 'worker-food-pro',
        category: 'worker',
        title: 'Interactive Food Engine',
        slash: '/worker-food-pro',
        icon: ShoppingBag,
        strategy: 'Inyección de inteligencia interactiva en landings de gastronomía (WhatsApp + Realtime Cart).',
        impact: {
            db: ['orders', 'order_items', 'sessions'],
            files: ['hooks/food-engine/', 'app/dashboard/orders/'],
            core: ['Cart logic', 'Session awareness']
        },
        steps: [
            'Inyección de infraestructura de base de datos segmentada.',
            'Activación del FoodEngineProvider central.',
            'Reemplazo de CTAs estáticos por AddToCart interactivo.',
            'Activación de Admin Titan con alertas sonoras.'
        ],
        rules: [
            'Detectar siempre el estado del local (Abierto/Cerrado) de forma dinámica.',
            'No inyectar lógica sin el layout aprobado.'
        ]
    },
    {
        id: 'worker-maintain',
        category: 'worker',
        title: 'Auto-Maintain Routine',
        slash: '/worker-maintain',
        icon: Settings2,
        strategy: 'Optimización proactiva de salud en sitios de clientes activos.',
        impact: {
            db: ['maintenance_logs'],
            files: ['/backups/', '/site/'],
            core: ['Performance optimization', 'Broken link fix']
        },
        steps: [
            'Identificación del cliente y backup automático.',
            'Optimización masiva de imágenes pesadas.',
            'Actualización segura de dependencias (Minor/Patch).',
            'Auditoría SEO de salud y reporte PDF de cambios.'
        ],
        rules: [
            'Nunca actualizar dependencias MAJOR sin supervisión.',
            'Backup obligatorio antes de tocar archivos de producción.'
        ]
    },
    {
        id: 'worker-mensual',
        category: 'worker',
        title: 'Monthly Maintenance List',
        slash: '/worker-mensual',
        icon: ClipboardList,
        strategy: 'Monitor central de la "flota" de Hoja Cero para mantenimiento programado.',
        impact: {
            db: ['monitored_sites', 'maintenance_logs'],
            files: ['N/A'],
            core: ['Fleet monitoring', 'Delay detection']
        },
        steps: [
            'Consulta de días de mantenimiento programado.',
            'Detección de sitios atrasados o por vencer.',
            'Generación de reporte de estado de la flota.',
            'Acciones rápidas de procesamiento masivo.'
        ],
        rules: [
            'Mantener la lista actualizada diariamente.',
            'Alertas visuales para sitios con > 2 días de atraso.'
        ]
    },
    {
        id: 'worker-pos-pro',
        category: 'worker',
        title: 'Professional POS Terminal',
        slash: '/worker-pos-pro',
        icon: MonitorPlay,
        strategy: 'Transforma el motor de pedidos en un ERP de gestión de salón profesional.',
        impact: {
            db: ['tables', 'pos_sessions'],
            files: ['components/food-engine/PosTerminal.tsx'],
            core: ['Table management', 'ERP Sync']
        },
        steps: [
            'Inyección de infraestructura de gestión de mesas.',
            'Instanciación del terminal POS táctil.',
            'Vinculación con CashManager y Financial Dashboard.',
            'QA de flujo: Mesa -> Comanda -> Cocina -> Pago.'
        ],
        rules: [
            'Acceso exclusivo al personal mediante protección de rutas.',
            'Sincronización atómica para evitar pedidos perdidos.'
        ]
    }
];



export default function BibliaH0Page() {
    const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(WORKFLOW_DATABASE[0].id);
    const [searchQuery, setSearchQuery] = useState('');

    const currentWorkflow = useMemo(() =>
        WORKFLOW_DATABASE.find(w => w.id === selectedWorkflowId) || WORKFLOW_DATABASE[0]
        , [selectedWorkflowId]);

    const filteredWorkflows = useMemo(() =>
        WORKFLOW_DATABASE.filter(w =>
            w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            w.slash.toLowerCase().includes(searchQuery.toLowerCase())
        )
        , [searchQuery]);

    return (
        <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
            {/* COLUMN 1: SIDEBAR TÉCNICO (300px) */}
            <aside className="w-[300px] border-r border-white/5 flex flex-col bg-[#080808]">
                <div className="p-6 border-b border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center">
                            <BookOpen size={18} />
                        </div>
                        <h1 className="text-sm font-black uppercase tracking-[0.2em] italic">Biblia H0</h1>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                        <input
                            type="text"
                            placeholder="Buscar Workflow..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs focus:border-cyan-500/50 outline-none transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 custom-scrollbar">
                    {(['factory', 'worker', 'maintenance'] as WorkflowCategory[]).map(cat => (
                        <div key={cat} className="space-y-3">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 px-2">
                                {cat === 'factory' ? '🏭 Factory Pipeline' :
                                    cat === 'worker' ? '🤖 Active Workers' :
                                        '🔧 Maintenance Fleet'}
                            </h3>
                            <div className="space-y-1">
                                {filteredWorkflows.filter(w => w.category === cat).map(w => (
                                    <button
                                        key={w.id}
                                        onClick={() => setSelectedWorkflowId(w.id)}
                                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-left transition-all group ${selectedWorkflowId === w.id
                                            ? 'bg-white/10 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                                            : 'hover:bg-white/5 border border-transparent'
                                            }`}
                                    >
                                        <w.icon size={18} className={selectedWorkflowId === w.id ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-zinc-300'} />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[13px] font-black tracking-tight leading-none mb-1">{w.title}</div>
                                            <div className="text-[11px] font-mono text-zinc-500 truncate">{w.slash}</div>
                                        </div>
                                        {selectedWorkflowId === w.id && <ChevronRight size={16} className="text-cyan-400" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* COLUMN 2: CUERPO DE DOCUMENTACIÓN (EXPANDABLE) */}
            <main className="flex-1 overflow-y-auto bg-[#050505] p-12 lg:p-20 custom-scrollbar relative">
                <div className="max-w-4xl mx-auto space-y-16">
                    {/* Header Workflow */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="h-px w-8 bg-cyan-500" />
                            <span className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.4em]">{currentWorkflow.category} PROTOCOL</span>
                        </div>
                        <h2 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-[0.9]">
                            {currentWorkflow.title}
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full font-mono text-xs text-cyan-400">
                                {currentWorkflow.slash}
                            </div>
                            <div className="text-zinc-500 text-xs font-medium uppercase tracking-widest">
                                Rev. 2026.02 // Hoja Cero Standard
                            </div>
                        </div>
                    </div>

                    {/* Estrategia Comercial */}
                    <section className="space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-3">
                            <Target size={14} /> Estrategia Comercial
                        </h3>
                        <p className="text-xl leading-relaxed text-zinc-100 font-bold tracking-tight">
                            {currentWorkflow.strategy}
                        </p>
                    </section>

                    {/* Protocolo de Inyección */}
                    <section className="space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-3">
                            <Terminal size={14} /> Protocolo de Inyección
                        </h3>
                        <div className="space-y-6">
                            {currentWorkflow.steps.map((step, i) => (
                                <div key={i} className="flex gap-8 group">
                                    <span className="text-cyan-500 font-mono text-sm mt-1.5 font-black">0{i + 1}.</span>
                                    <div className="flex-1 pb-6 border-b border-white/5 group-last:border-none text-lg text-zinc-200 font-medium leading-[1.6]">
                                        {step}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Reglas de Oro */}
                    <section className="p-10 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full -mr-32 -mt-32" />
                        <h4 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 relative z-10">
                            <Shield size={14} /> Reglas de Oro (Inviolables)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                            {currentWorkflow.rules.map((rule, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                                    <p className="text-base text-zinc-300 font-bold leading-relaxed tracking-tight">
                                        {rule}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="mt-20 text-center text-zinc-800 text-[9px] font-black uppercase tracking-[0.8em] py-12">
                    Hoja Cero Studio // Manual de Ingeniería // No More MVPs
                </div>
            </main>

            {/* COLUMN 3: METADATOS TÉCNICOS (350px) */}
            <aside className="w-[350px] border-l border-white/5 bg-[#080808] p-8 hidden xl:flex flex-col gap-10">
                <div className="space-y-10">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400 border-b border-white/5 pb-4">
                        Huella Técnica
                    </h3>

                    {/* Database */}
                    <div className="space-y-5">
                        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-zinc-100">
                            <Database size={14} className="text-cyan-400" /> Supabase Impact
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            {currentWorkflow.impact.db.map(db => (
                                <span key={db} className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl font-mono text-[11px] text-cyan-50/70">
                                    {db}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Files */}
                    <div className="space-y-5">
                        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-zinc-100">
                            <Code size={14} className="text-cyan-400" /> Nuclear Files
                        </div>
                        <div className="flex flex-col gap-2.5">
                            {currentWorkflow.impact.files.map(file => (
                                <div key={file} className="px-4 py-3 bg-zinc-950 border border-white/10 rounded-2xl font-mono text-[11px] text-zinc-100 flex items-center gap-3 shadow-inner">
                                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                                    {file}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Core Systems */}
                    <div className="space-y-5 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-zinc-100">
                            <Zap size={14} className="text-amber-500" /> Core Engine
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {currentWorkflow.impact.core.map(sys => (
                                <div key={sys} className="p-5 bg-zinc-900/50 border border-white/10 rounded-[2rem]">
                                    <div className="text-[11px] font-black uppercase tracking-widest text-white mb-2">{sys}</div>
                                    <div className="text-[10px] text-zinc-400 font-medium leading-relaxed">
                                        Protocolo activo vinculado al motor central de Hoja Cero.
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-auto space-y-6">
                    <div className="p-6 bg-cyan-500 text-black rounded-[2rem] space-y-3 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
                        <div className="flex items-center gap-3">
                            <Info size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Transferencia ID</span>
                        </div>
                        <p className="text-[11px] font-bold leading-tight">
                            Este manual es la autoridad final para Daniel y sucesores. Cada cambio en un workflow debe ser documentado aquí.
                        </p>
                    </div>
                </div>
            </aside>

            {/* CSS para Scrollbar */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div>
    );
}

