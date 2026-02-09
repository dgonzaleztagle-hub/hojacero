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
    Monitor, Smartphone
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
        id: 'skill-creative',
        category: 'dna',
        title: 'Creative Director (DNA)',
        slash: 'Consultoría Estética',
        icon: Eye,
        strategy: 'Asegura que cada pixel transmita estatus y calidad nivel Awwwards.',
        impact: {
            db: ['N/A'],
            files: ['index.css', 'tailwind.config.ts'],
            core: ['Visual Identity', 'Motion Branding', 'Color Psychology']
        },
        steps: ['Diagnóstico de Tensión Visual.', 'Inyección de Paleta HSL Dinámica.', 'Auditoría de Micro-interacciones.', 'Pass/Fail de Calidad Estética.'],
        rules: ['Prohibido el uso de componentes genéricos.', 'Cada demo es único, no se copia el Soul.']
    },
    {
        id: 'skill-lead',
        category: 'dna',
        title: 'Factory Lead (DNA)',
        slash: 'Arquitectura Maestra',
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
        title: 'Factory Auditor (DNA)',
        slash: 'Control de Calidad',
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
        id: 'skill-seo',
        category: 'dna',
        title: 'SEO Strategist (DNA)',
        slash: 'Autoridad Algorítmica',
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
    },
    {
        id: 'worker-cms-standalone',
        category: 'worker',
        title: 'CMS Pro Standalone',
        slash: '/worker-cms-standalone',
        icon: ShieldCheck,
        strategy: 'Inyecta autonomía total (Zero Connection) en el sitio del cliente mediante persistencia vía GitHub API.',
        impact: {
            db: ['N/A (JSON-as-a-DB)'],
            files: ['app/api/cms/', 'app/cms/admin/', 'data/cms-content.json'],
            core: ['GitHub Octokit Persistence', 'Standalone Master Key Auth']
        },
        steps: [
            'Inyección del motor de persistencia Octokit.',
            'Activación de sockets inteligentes <Editable />.',
            'Despliegue del Dashboard Admin Premium en /cms/admin.',
            'Configuración de variables de entorno GITHUB_* y CMS_ACCESS_KEY.'
        ],
        rules: [
            'Prohibido usar Supabase en este motor; la independencia es ley.',
            'El Master Key debe configurarse en Vercel para habilitar el acceso.'
        ]
    },
    {
        id: 'worker-pwa',
        category: 'worker',
        title: 'PWA Performance & Score',
        slash: '/worker-pwa',
        icon: Smartphone,
        strategy: 'Optimiza el sitio para cumplir estándares de PWA Builder (Score 40+) y habilitar modo offline real.',
        impact: {
            db: ['N/A'],
            files: ['sw.js', 'manifest.json', 'offline.html', 'public/prospectos/[nombre]/'],
            core: ['Offline Support', 'Image Precision Engine', 'Service Worker Resilience']
        },
        steps: [
            'Redimensionamiento de iconos (512, 192, 96) y screenshots vía Sharp.',
            'Inyección de Service Worker resiliente con Promise.allSettled.',
            'Configuración de manifest.json con isolación de subcarpetas.',
            'Validación de Bypass en Middleware de Next.js.',
            'Test de Score en PWA Builder (objetivo: 40/44).'
        ],
        rules: [
            'El Service Worker debe instalarse incluso si fallan assets secundarios.',
            'Asegurar el scope exacto para evitar colisiones entre prospectos.',
            'Iconos deben ser maskable para evitar cortes en Samsung/Pixel.'
        ]
    },
    {
        id: 'worker-twa',
        category: 'worker',
        title: 'TWA Native App Generator',
        slash: '/worker-twa',
        icon: Rocket,
        strategy: 'Convierte el PWA en una App Nativa Android (APK) eliminando las barras del navegador.',
        impact: {
            db: ['N/A'],
            files: ['assetlinks.json', 'signing.keystore', '.well-known/'],
            core: ['Native Integration', 'Domain Authority Handshake']
        },
        steps: [
            'Generación de paquete Android en PWA Builder.',
            'Extracción y despliegue de assetlinks.json en .well-known/.',
            'Configuración de Package ID corporativo (cl.hojacero.[nombre]).',
            'Prueba de "Apretón de Manos" (Handshake) para modo Full Screen.'
        ],
        rules: [
            'Nunca borrar el .keystore; es la identidad única de la App.',
            'Subir assetlinks.json antes de la primera apertura para evitar lag de barras.'
        ]
    },
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
        <div className="flex h-screen bg-[#020202] text-white overflow-hidden font-sans">
            {/* COLUMN 1: SIDEBAR TÉCNICO (320px) */}
            <aside className="w-[320px] border-r border-white/5 flex flex-col bg-[#050505]">
                <div className="p-8 border-b border-white/5 space-y-5">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <BookOpen size={20} />
                        </div>
                        <div>
                            <h1 className="text-xs font-black uppercase tracking-[0.3em] italic text-cyan-400">Manual H0</h1>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">V3.5 // Master Database</p>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-all duration-500" />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="Buscar Protocolo o Skill..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#080808] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-[13px] focus:border-cyan-500/30 focus:bg-black outline-none transition-all font-medium placeholder:text-zinc-600 relative z-10"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-8 space-y-10 custom-scrollbar">
                    {(['dna', 'factory', 'worker', 'maintenance'] as WorkflowCategory[]).map(cat => {
                        const items = filteredWorkflows.filter(w => w.category === cat);
                        if (items.length === 0) return null;
                        return (
                            <div key={cat} className="space-y-4">
                                <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] px-3 flex items-center gap-3 ${cat === 'dna' ? 'text-amber-500' :
                                    cat === 'factory' ? 'text-cyan-500' :
                                        cat === 'worker' ? 'text-purple-500' :
                                            'text-green-500'
                                    }`}>
                                    <span className="w-1 h-1 rounded-full bg-current" />
                                    {cat === 'dna' ? 'Human-AI DNA Skills' :
                                        cat === 'factory' ? 'Factory Pipeline' :
                                            cat === 'worker' ? 'Active Workers' :
                                                'Maintenance Fleet'}
                                </h3>
                                <div className="space-y-1.5">
                                    {items.map(w => (
                                        <button
                                            key={w.id}
                                            onClick={() => setSelectedWorkflowId(w.id)}
                                            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left transition-all group relative duration-300 ${selectedWorkflowId === w.id
                                                ? 'bg-gradient-to-r from-white/10 to-transparent border border-white/10 shadow-2xl'
                                                : 'hover:bg-white/5 border border-transparent opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            {selectedWorkflowId === w.id && (
                                                <motion.div
                                                    layoutId="active-pill"
                                                    className="absolute left-0 w-1 h-6 bg-cyan-500 rounded-full"
                                                />
                                            )}
                                            <div className={`p-2 rounded-xl transition-all duration-300 ${selectedWorkflowId === w.id ? 'bg-cyan-500/10 text-cyan-400' : 'bg-black/40 text-zinc-600 group-hover:text-zinc-200'}`}>
                                                <w.icon size={16} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className={`text-[13px] font-black tracking-tight leading-none mb-1.5 ${selectedWorkflowId === w.id ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-100'}`}>
                                                    {w.title}
                                                </div>
                                                <div className="text-[10px] font-mono text-zinc-600 truncate uppercase tracking-widest">{w.slash}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </aside>

            {/* COLUMN 2: CUERPO DE DOCUMENTACIÓN */}
            <main className="flex-1 overflow-y-auto bg-black p-12 lg:p-24 custom-scrollbar relative">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/5 blur-[120px] rounded-full -mr-[400px] -mt-[400px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[100px] rounded-full -ml-[300px] -mb-[300px] pointer-events-none" />

                <div className="max-w-4xl mx-auto space-y-24 relative z-10">
                    {/* Header Workflow */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] ${currentWorkflow.category === 'dna' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20'
                                }`}>
                                {currentWorkflow.category} Protocol
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                            <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.4em]">Revision // 2026.02</span>
                        </div>

                        <h2 className="text-7xl md:text-8xl font-black italic uppercase tracking-tighter text-white leading-[0.85]">
                            {currentWorkflow.title}
                        </h2>

                        <div className="flex flex-wrap items-center gap-6 pt-4">
                            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl group cursor-pointer hover:border-cyan-500/50 transition-all duration-500">
                                <Command size={14} className="text-cyan-500" />
                                <span className="font-mono text-sm font-black text-cyan-400 leading-none">{currentWorkflow.slash}</span>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-500 text-[11px] font-black uppercase tracking-[0.3em]">
                                <Activity size={14} className="text-emerald-500" />
                                Status: Active & Operational
                            </div>
                        </div>
                    </div>

                    {/* Estrategia Comercial */}
                    <section className="space-y-8 p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] relative group hover:border-white/10 transition-colors duration-700">
                        <div className="absolute top-8 left-8 p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500">
                            <Target size={20} />
                        </div>
                        <div className="pl-16 space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-cyan-500/60">Value Proposition</h3>
                            <p className="text-2xl md:text-3xl leading-snug text-zinc-100 font-bold tracking-tight">
                                {currentWorkflow.strategy}
                            </p>
                        </div>
                    </section>

                    {/* Protocolo de Inyección / Pasos */}
                    <section className="space-y-12">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-600 flex items-center gap-4">
                            <Terminal size={14} /> Execution Protocol // Steps
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {currentWorkflow.steps.map((step, i) => (
                                <div key={i} className="group flex items-center gap-8 p-8 bg-zinc-900/40 border border-white/5 rounded-[2.5rem] hover:bg-zinc-900/60 hover:border-cyan-500/20 transition-all duration-500">
                                    <span className="text-3xl font-black italic text-zinc-800 group-hover:text-cyan-500/40 transition-colors duration-500">
                                        0{i + 1}
                                    </span>
                                    <div className="text-lg text-zinc-300 font-bold leading-relaxed tracking-tight">
                                        {step}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Reglas de Oro */}
                    <section className="p-16 bg-gradient-to-br from-amber-500/10 via-black to-black border border-amber-500/20 rounded-[4rem] space-y-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 blur-[100px] rounded-full -mr-32 -mt-32" />

                        <div className="flex items-center gap-5">
                            <div className="p-4 rounded-[1.5rem] bg-amber-500 text-black shadow-xl shadow-amber-500/20">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h4 className="text-xl font-black italic uppercase tracking-tighter text-white">Reglas de Oro</h4>
                                <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.4em] mt-1">Inviolables // Standard Hoja Cero</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                            {currentWorkflow.rules.map((rule, i) => (
                                <div key={i} className="flex items-start gap-4 group/rule">
                                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.8)] group-hover/rule:scale-150 transition-transform duration-300" />
                                    <p className="text-lg text-zinc-400 font-bold leading-relaxed tracking-tight group-hover/rule:text-zinc-100 transition-colors duration-300">
                                        {rule}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Footer Auth */}
                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-[10px] text-zinc-700 font-black uppercase tracking-[0.8em]">
                            Hoja Cero Studio // Master Protocol
                        </div>
                        <div className="flex gap-4">
                            <div className="px-5 py-2 rounded-full border border-white/5 text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                                Auth: Daniel G.
                            </div>
                            <div className="px-5 py-2 rounded-full border border-cyan-500/20 text-[9px] font-bold uppercase tracking-widest text-cyan-500/60">
                                AI Partner: Jarvis V3
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* COLUMN 3: METADATOS TÉCNICOS (380px) */}
            <aside className="w-[380px] border-l border-white/5 bg-[#050505] p-10 hidden xl:flex flex-col gap-12 overflow-y-auto custom-scrollbar">
                <div className="space-y-12">
                    <div className="space-y-4">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400 flex items-center gap-3">
                            <Activity size={14} className="text-cyan-500" /> Huella Técnica
                        </h3>
                        <p className="text-[10px] text-zinc-600 font-medium leading-relaxed uppercase tracking-wider">
                            Impacto del protocolo en infra y archivos núcleo.
                        </p>
                    </div>

                    {/* Database */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white">
                            <Database size={14} className="text-cyan-500" /> Supabase Impact
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            {currentWorkflow.impact.db.map(db => (
                                <div key={db} className="px-4 py-3 bg-black border border-white/10 rounded-2xl font-mono text-[11px] text-cyan-50/70 hover:border-cyan-500/30 transition-colors">
                                    {db}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Files */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white">
                            <Code size={14} className="text-cyan-500" /> Nuclear Files
                        </div>
                        <div className="flex flex-col gap-3">
                            {currentWorkflow.impact.files.map(file => (
                                <div key={file} className="px-6 py-4 bg-zinc-900/30 border border-white/5 rounded-3xl font-mono text-[11px] text-zinc-400 flex items-center gap-4 hover:bg-zinc-900/50 hover:border-cyan-500/20 transition-all duration-300 group">
                                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)] group-hover:scale-125 transition-transform" />
                                    {file}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Core Systems */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white">
                            <Zap size={14} className="text-purple-500" /> Core Engine
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {currentWorkflow.impact.core.map(sys => (
                                <div key={sys} className="p-6 bg-gradient-to-br from-zinc-900/50 to-black border border-white/5 rounded-[2.5rem] group hover:border-purple-500/20 transition-all">
                                    <div className="text-[12px] font-black uppercase tracking-widest text-white mb-2 group-hover:text-purple-400 transition-colors">{sys}</div>
                                    <div className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                                        Protocolo activo vinculado al motor central de Hoja Cero.
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-10 border-t border-white/5">
                    <div className="p-10 bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-[3.5rem] shadow-2xl shadow-cyan-500/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-[50px] rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000" />
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
                                <Info size={24} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Autoridad Final</span>
                        </div>
                        <p className="text-[13px] font-bold leading-snug relative z-10 text-cyan-50">
                            Este manual es la autoridad final para Daniel y sucesores. Cada cambio en un protocolo debe ser documentado y auditado.
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] opacity-60 relative z-10">
                            Protocolo H0-MASTER-V3
                        </div>
                    </div>
                </div>
            </aside>

            {/* CSS para Scrollbar */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
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
