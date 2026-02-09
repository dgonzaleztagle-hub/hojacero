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
    Settings2, ShieldCheck,
    Server, GitBranch, Share2, ClipboardList,
    Monitor, Smartphone, Brain, BarChart
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

const WORKFLOW_DATABASE: WorkflowDetail[] = [
    // DNA SKILLS
    {
        id: 'skill-creative',
        category: 'dna',
        title: 'Creative Director',
        slash: 'DNA Skill',
        icon: Eye,
        strategy: 'Asegura que cada pixel transmita estatus y calidad nivel Awwwards.',
        impact: {
            db: ['N/A'],
            files: ['index.css', 'tailwind.config.ts'],
            core: ['Visual Identity', 'Motion Branding', 'Color Psychology']
        },
        steps: ['Diagnóstico de Tensión Visual.', 'Inyección de Paleta HSL Dinámica.', 'Auditoría de Micro-interacciones.', 'Pass/Fail de Calidad Estética.'],
        rules: ['Prohibido el uso de componentes genéricos.', 'Cada sitio es único, no se copia el Soul.']
    },
    {
        id: 'skill-lead',
        category: 'dna',
        title: 'Factory Lead',
        slash: 'DNA Skill',
        icon: GitBranch,
        strategy: 'Consistencia absoluta en ecosistemas multi-página.',
        impact: {
            db: ['monitored_sites'],
            files: ['layout.tsx', 'navigation.ts'],
            core: ['Consistency Guard', 'Scale Logic', 'Style Lock']
        },
        steps: ['Encadenamiento de Style Lock.', 'Sincronización de Navegación Universal.', 'Auditoría de Inyectores de Datos.', 'Cierre de Arquitectura.'],
        rules: ['No modificar el master una vez duplicado.', 'La navegación debe ser resiliente.']
    },
    {
        id: 'skill-auditor',
        category: 'dna',
        title: 'Factory Auditor',
        slash: 'DNA Skill',
        icon: UserCheck,
        strategy: 'El filtro final antes de la entrega al cliente.',
        impact: {
            db: ['site_status'],
            files: ['qa_report.md'],
            core: ['Technical Security Audit', 'Mobile Health Check', 'SEO Gate']
        },
        steps: ['Prueba de Stress en iPhone SE (393px).', 'Auditoría de Broken Links.', 'Verificación de Kill Switch.', 'Asignación de Score Final.'],
        rules: ['Score < 8.0 = No se entrega.', 'Cero advertencias de consola en producción.']
    },
    {
        id: 'skill-consultant',
        category: 'dna',
        title: 'Factory Consultant',
        slash: 'DNA Skill',
        icon: Brain,
        strategy: 'Análisis crítico y resolución de problemas complejos.',
        impact: {
            db: ['N/A'],
            files: ['implementation_plan.md'],
            core: ['Problem Solving', 'Feasibility Study', 'Strategic Thinking']
        },
        steps: ['Análisis de requerimientos contradictorios.', 'Propuesta de arquitectura técnica.', 'Identificación de riesgos.', 'Estrategia de resolución.'],
        rules: ['Priorizar estabilidad sobre trucos temporales.', 'Ser honesto sobre las limitaciones técnicas.']
    },
    {
        id: 'skill-seo',
        category: 'dna',
        title: 'SEO Strategist',
        slash: 'DNA Skill',
        icon: Search,
        strategy: 'Optimización para el futuro de la búsqueda (AEO/GEO).',
        impact: {
            db: ['N/A'],
            files: ['SEOHead.tsx', 'JSON-LD.json'],
            core: ['AEO Optimization', 'Schema Architecture', 'Answer Grounding']
        },
        steps: ['Inyección de Schema LocalBusiness.', 'Optimización de Answer Boxes.', 'Auditoría de Headings Semánticos.', 'Indexación Automática.'],
        rules: ['Priorizar legibilidad para LLMs (Search Grounding).', 'Imágenes con ALTs descriptivos obligatorios.']
    },
    // FACTORY PIPELINE
    {
        id: 'factory-brand',
        category: 'factory',
        title: 'Factory Brand',
        slash: '/factory-brand',
        icon: Fingerprint,
        strategy: 'Inyección de autoridad de HojaCero en proyectos externos.',
        impact: {
            db: ['N/A'],
            files: ['layout.tsx', 'Footer.tsx'],
            core: ['Brand Identity', 'JSON-LD Authority']
        },
        steps: ['Inyección de Schema corporativo.', 'Filtro Ninja en Footer.', 'Firma de Git.'],
        rules: ['Prohibido usar grises en el branding.', 'Build check obligatorio.']
    },
    {
        id: 'factory-deploy',
        category: 'factory',
        title: 'Factory Deploy',
        slash: '/factory-deploy',
        icon: Rocket,
        strategy: 'Lanzamiento blindado eliminando el error humano.',
        impact: {
            db: ['monitored_sites'],
            files: ['git config'],
            core: ['Deployment Automation', 'Safety Protocols']
        },
        steps: ['Validación de exportación.', 'Git Health Check.', 'Push blindado.'],
        rules: ['No inicializar si no hay export.', 'Verificar .gitignore.']
    },
    {
        id: 'factory-export',
        category: 'factory',
        title: 'Factory Export',
        slash: '/factory-export',
        icon: Box,
        strategy: 'Empaquetado quirúrgico para entrega final.',
        impact: {
            db: ['monitored_sites'],
            files: ['scripts/export-helper.js'],
            core: ['Isolation Logic', 'Dependency Clean']
        },
        steps: ['Auditoría previa.', 'Análisis de dependencias.', 'Generación de build.'],
        rules: ['Solo ejecutar tras pago confirmado.', 'El build debe dar PASS.']
    },
    {
        id: 'factory-final',
        category: 'factory',
        title: 'Factory Final',
        slash: '/factory-final',
        icon: Layout,
        strategy: 'Expansión de landing a sitio multi-página.',
        impact: {
            db: ['monitored_sites'],
            files: ['/nosotros', '/servicios', '/contacto'],
            core: ['Structure Logic', 'Content Expansion']
        },
        steps: ['Lectura de Soul.', 'Expansión de rutas.', 'Cierre de Arquitectura.'],
        rules: ['No romper el demo original.', 'Consistencia visual total.']
    },
    {
        id: 'factory-qa',
        category: 'factory',
        title: 'Factory QA',
        slash: '/factory-qa',
        icon: ShieldCheck,
        strategy: 'Protocolo de aprobación estilo Juez Awwwards.',
        impact: {
            db: ['N/A'],
            files: ['qa_report.md'],
            core: ['Quality Gate', 'Performance Audit']
        },
        steps: ['Auditoría visual.', 'Prueba mobile.', 'Asignación de Score.'],
        rules: ['Score < 8.0 = RECHAZADO.', 'Cero errores técnicos.']
    },
    {
        id: 'factory-seo',
        category: 'factory',
        title: 'Factory SEO',
        slash: '/factory-seo',
        icon: Search,
        strategy: 'Inyección de autoridad técnica y kill switch.',
        impact: {
            db: ['site_status'],
            files: ['SEOHead.tsx', 'sitemap.xml'],
            core: ['AEO Injection', 'Kill Switch Logic']
        },
        steps: ['Registro de cliente.', 'Inyección de JSON-LD.', 'Activación de Kill Switch.'],
        rules: ['Solo para clientes confirmados.', 'UUID obligatorio.']
    },
    {
        id: 'factory-demo',
        category: 'factory',
        title: 'Factory Demo',
        slash: '/factory-demo',
        icon: Flame,
        strategy: 'Generación de landing de alto impacto en 15 mins.',
        impact: {
            db: ['h0_landings'],
            files: ['app/prospectos/'],
            core: ['Visual Impact', 'Sales Conversion']
        },
        steps: ['Discovery.', 'Generación de Vibe.', 'Inyección de componentes.'],
        rules: ['No es un MVP; debe impresionar.', 'Copy real siempre.']
    },
    {
        id: 'factory-alive',
        category: 'factory',
        title: 'Factory Alive',
        slash: '/factory-alive',
        icon: Activity,
        strategy: 'Inyección de vida orgánica mediante matemáticas.',
        impact: {
            db: ['N/A'],
            files: ['components/premium/primitives/'],
            core: ['Motion Personality', 'Visual Vibe']
        },
        steps: ['Diagnóstico.', 'Selección de primitiva (Grid/Particle/Orb).', 'Inyección.'],
        rules: ['Menos es más.', 'Unicidad absoluta.']
    },
    // ACTIVE WORKERS
    {
        id: 'worker-ads-factory',
        category: 'worker',
        title: 'Ads-Factory',
        slash: '/worker-ads-factory',
        icon: Megaphone,
        strategy: 'Inyecta el motor de creación masiva de landings.',
        impact: {
            db: ['h0_landings'],
            files: ['app/lp/'],
            core: ['Conversion UI', 'Dynamic Renderer']
        },
        steps: ['Instalación DB.', 'Inyección Dashboard.', 'QA Conversión.'],
        rules: ['Landings autónomas.', 'Foco en Direct Response.']
    },
    {
        id: 'worker-automate',
        category: 'worker',
        title: 'Worker Automate',
        slash: '/worker-automate',
        icon: Cpu,
        strategy: 'Automatización masiva de assets y data.',
        impact: {
            db: ['N/A'],
            files: ['scripts/automation/'],
            core: ['Bulk Processing', 'Efficiency Engine']
        },
        steps: ['Escaneo manual.', 'Scripts Sharp.', 'ALT automáticos.'],
        rules: ['Si lo haces > 3 veces, automatízalo.', 'Verificar cambios.']
    },
    {
        id: 'worker-cash-pro',
        category: 'worker',
        title: 'Worker Cash Pro',
        slash: '/worker-cash-pro',
        icon: DollarSign,
        strategy: 'Control de flujo de caja y gastos manuales.',
        impact: {
            db: ['cash_register', 'cash_movements'],
            files: ['CashManager.tsx'],
            core: ['Financial Control', 'Admin Tracking']
        },
        steps: ['Tablas DB.', 'Inyección UI.', 'QA Cierre.'],
        rules: ['Registro de diferencia obligatorio.', 'Caja abierta para operar.']
    },
    {
        id: 'worker-food-pro',
        category: 'worker',
        title: 'Worker Food Pro',
        slash: '/worker-food-pro',
        icon: ShoppingBag,
        strategy: 'Motor interactivo para gastronomía.',
        impact: {
            db: ['orders', 'items'],
            files: ['hooks/food-engine/'],
            core: ['Cart Logic', 'Realtime Sync']
        },
        steps: ['Infra DB.', 'FoodProvider.', 'Activación Admin.'],
        rules: ['Local Abierto/Cerrado dinámico.', 'Layout coherente.']
    },
    {
        id: 'worker-maintain',
        category: 'worker',
        title: 'Worker Maintain',
        slash: '/worker-maintain',
        icon: Settings2,
        strategy: 'Optimización proactiva de salud.',
        impact: {
            db: ['maintenance_logs'],
            files: ['backups/'],
            core: ['Performance Fix', 'Security Patch']
        },
        steps: ['Backup.', 'Optimización Sharp.', 'Update Dependencias.'],
        rules: ['Nunca MAJOR sin aprobación.', 'Backup previo siempre.']
    },
    {
        id: 'worker-mensual',
        category: 'worker',
        title: 'Worker Mensual',
        slash: '/worker-mensual',
        icon: ClipboardList,
        strategy: 'Monitor de la flota de mantenimiento.',
        impact: {
            db: ['monitored_sites'],
            files: ['N/A'],
            core: ['Fleet Monitoring', 'Status Engine']
        },
        steps: ['Consulta días.', 'Detección atrasos.', 'Reporte Fleet.'],
        rules: ['Lista diaria.', 'Alertas visuales.']
    },
    {
        id: 'worker-pos-pro',
        category: 'worker',
        title: 'Worker POS Pro',
        slash: '/worker-pos-pro',
        icon: Monitor,
        strategy: 'Terminal ERP para salón profesional.',
        impact: {
            db: ['tables', 'pos_sessions'],
            files: ['PosTerminal.tsx'],
            core: ['Table Management', 'ERP Logic']
        },
        steps: ['Inyección mesas.', 'Terminal táctil.', 'Link Cash Pro.'],
        rules: ['Admin Only.', 'Sync Atómica.']
    },
    {
        id: 'worker-pwa',
        category: 'worker',
        title: 'Worker PWA',
        slash: '/worker-pwa',
        icon: Smartphone,
        strategy: 'Optimización PWA Score 40+ y Offline.',
        impact: {
            db: ['N/A'],
            files: ['sw.js', 'manifest.json'],
            core: ['Offline Mode', 'PWA Resilience']
        },
        steps: ['Iconos Sharp.', 'SW Inyección.', 'Test PWA Builder.'],
        rules: ['Resiliencia absoluta.', 'Iconos Maskable.']
    },
    {
        id: 'worker-twa',
        category: 'worker',
        title: 'Worker TWA',
        slash: '/worker-twa',
        icon: Rocket,
        strategy: 'Conversión a App Nativa Android.',
        impact: {
            db: ['N/A'],
            files: ['assetlinks.json'],
            core: ['Native Handshake', 'Full Screen Mode']
        },
        steps: ['APK Generation.', 'Assetlinks Deploy.', 'Check Handshake.'],
        rules: ['Nunca borrar keystore.', 'Assetlinks previo.']
    },
    {
        id: 'worker-cms-standalone',
        category: 'worker',
        title: 'Worker CMS Pro',
        slash: '/worker-cms-standalone',
        icon: ShieldCheck,
        strategy: 'Autonomía Zero Connection vía GitHub API.',
        impact: {
            db: ['N/A (JSON)'],
            files: ['app/cms/'],
            core: ['GitHub Persistence', 'No-DB Content']
        },
        steps: ['Motor Octokit.', 'Editable Sockets.', 'Admin Dash.'],
        rules: ['Prohibido Supabase.', 'GitHub Key activa.']
    }
];

export default function AyudaPage() {
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
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans border-t border-border/40">
            {/* SIDEBAR: Navegación de Protocolos */}
            <aside className="w-80 border-r border-border bg-muted/30 flex flex-col">
                <div className="p-6 border-b border-border space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <BookOpen size={18} />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold tracking-tight">Manual H0</h1>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Master Protocol v3.6</p>
                        </div>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                        <input
                            type="text"
                            placeholder="Buscar protocolo..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg py-2 pl-9 pr-3 text-xs focus:ring-1 focus:ring-primary outline-none transition-all"
                        />
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-8 hide-scrollbar">
                    {(['dna', 'factory', 'worker'] as WorkflowCategory[]).map(cat => {
                        const items = filteredWorkflows.filter(w => w.category === cat);
                        if (items.length === 0) return null;
                        return (
                            <div key={cat} className="space-y-2">
                                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-3">
                                    {cat === 'dna' ? 'H0 ADN Skills' :
                                        cat === 'factory' ? 'Factory Pipeline' :
                                            'Active Workers'}
                                </h3>
                                <div className="space-y-1">
                                    {items.map(w => (
                                        <button
                                            key={w.id}
                                            onClick={() => setSelectedWorkflowId(w.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all relative ${selectedWorkflowId === w.id
                                                    ? 'bg-primary/10 text-primary shadow-sm'
                                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            {selectedWorkflowId === w.id && (
                                                <motion.div
                                                    layoutId="active-bar"
                                                    className="absolute left-0 w-1 h-4 bg-primary rounded-full"
                                                />
                                            )}
                                            <w.icon size={16} className={selectedWorkflowId === w.id ? 'text-primary' : 'text-muted-foreground'} />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[13px] font-semibold leading-none truncate">{w.title}</div>
                                                <div className="text-[10px] font-mono opacity-50 truncate mt-1">{w.slash}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </nav>
            </aside>

            {/* MAIN: Documentación Detallada */}
            <main className="flex-1 overflow-y-auto bg-background p-12 lg:p-20 relative">
                <div className="max-w-3xl mx-auto space-y-16">
                    {/* Header */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                                {currentWorkflow.category} Protocol
                            </span>
                            <div className="h-px flex-1 bg-border" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                                {currentWorkflow.title}
                            </h2>
                            <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
                                Slash Trigger: {currentWorkflow.slash}
                            </p>
                        </div>

                        <div className="p-6 bg-muted/40 rounded-2xl border border-border/50">
                            <div className="flex gap-4">
                                <Target className="text-primary mt-1 shrink-0" size={20} />
                                <div className="space-y-1">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Estrategia de Valor</h4>
                                    <p className="text-lg font-medium leading-relaxed text-foreground/90 italic">
                                        "{currentWorkflow.strategy}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contenido Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Pasos */}
                        <div className="space-y-6">
                            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                                <Terminal size={16} className="text-primary" /> Protocolo de Inyección
                            </h3>
                            <div className="space-y-3">
                                {currentWorkflow.steps.map((step, i) => (
                                    <div key={i} className="flex gap-4 items-start p-4 bg-muted/20 border border-border/40 rounded-xl hover:border-primary/30 transition-colors">
                                        <span className="text-xs font-black text-primary/40 mt-0.5">0{i + 1}</span>
                                        <p className="text-sm font-semibold text-foreground/80 leading-snug">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reglas */}
                        <div className="space-y-6">
                            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                                <ShieldCheck size={16} className="text-amber-500" /> Reglas de Oro
                            </h3>
                            <div className="space-y-3">
                                {currentWorkflow.rules.map((rule, i) => (
                                    <div key={i} className="flex gap-3 items-start p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                                        <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                                        <p className="text-sm font-medium text-amber-700 dark:text-amber-200/80 leading-snug italic">{rule}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Huella Técnica */}
                    <div className="pt-12 border-t border-border">
                        <section className="space-y-8 text-center md:text-left">
                            <h3 className="text-sm font-bold uppercase tracking-widest inline-flex items-center gap-2">
                                <Activity size={16} className="text-primary" /> Huella Técnica & Auditoría
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest justify-center md:justify-start">
                                        <Database size={12} /> Supabase Impact
                                    </div>
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        {currentWorkflow.impact.db.map(db => (
                                            <span key={db} className="px-2 py-1 bg-background border border-border rounded text-[10px] font-mono font-bold">{db}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest justify-center md:justify-start">
                                        <Code size={12} /> Nuclear Files
                                    </div>
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        {currentWorkflow.impact.files.map(f => (
                                            <span key={f} className="px-2 py-1 bg-background border border-border rounded text-[10px] font-mono font-bold truncate max-w-[120px]">{f}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest justify-center md:justify-start">
                                        <Zap size={12} /> Core Engine
                                    </div>
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        {currentWorkflow.impact.core.map(c => (
                                            <span key={c} className="px-2 py-1 bg-primary/5 border border-primary/10 text-primary rounded text-[10px] font-bold uppercase tracking-wider">{c}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Footer Authority */}
                    <footer className="pt-20 pb-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-border">
                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.6em]">
                            Hoja Cero Studio // Master Protocol
                        </div>
                        <div className="flex gap-4">
                            <div className="px-4 py-1.5 rounded-lg border border-border text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                                Auth: DG // V3.6
                            </div>
                            <div className="px-4 py-1.5 rounded-lg border border-primary/20 text-[9px] font-bold uppercase tracking-widest text-primary/70">
                                AI: Jarvis v3 (Opus Mindset)
                            </div>
                        </div>
                    </footer>
                </div>
            </main>

            {/* Scroll Management */}
            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
