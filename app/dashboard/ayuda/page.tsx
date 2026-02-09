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
    description: string; // Nuevo campo para manual detallado
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
        description: 'Actúa como el motor de dirección de arte y garantía de calidad estética. Su misión es eliminar el "olor a plantilla" inyectando Caos Controlado y principios de diseño parisino. Odia los componentes genéricos y las sombras sucias. Obligatorio ejecutar su criterio antes de cualquier generación de diseño para asegurar que el ADN HojaCero esté presente.',
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
        description: 'El arquitecto encargado de mantener la integridad del sistema en proyectos de gran escala. Supervisa la expansión de rutas, la sincronización de navegación universal y el encadenamiento de Style Locks. Asegura que el proyecto no pierda su coherencia técnica mientras crece de una sola landing a un sitio corporativo complejo.',
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
        description: 'Realiza auditorías técnicas estrictas para garantizar la calidad, seguridad y mantenibilidad del código. Valida el performance mobile (iPhone SE), busca links rotos, verifica la inyección de Kill Switches y asigna un score final. Si el score es inferior a 8.0, el proyecto no se considera apto para entrega.',
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
        description: 'Proporciona asesoría arquitectónica de alto nivel y análisis crítico para features complejas. Se encarga de analizar requerimientos contradictorios, proponer arquitecturas técnicas robustas e identificar riesgos antes de la ejecución. Su enfoque es la estabilidad y la visión estratégica a largo plazo.',
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
        description: 'Define la estrategia de SEO técnico, AEO (Answer Engine Optimization) y autoridad para sitios aprobados. Inyecta marcado Schema LocalBusiness, optimiza para Answer Boxes y asegura que el contenido sea legible para LLMs. Su objetivo es blindar la presencia digital del cliente en la era de la IA.',
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
        description: 'Protocolo de marcaje de sitios con el ADN HojaCero. Inyecta autoridad visual y técnica mediante la configuración de Schema corporativo, la firma de Git y el "Filtro Ninja" en el Footer para asegurar que el proyecto sea reconocido como una pieza de colección. Bloquea el uso de grises genéricos en favor de una identidad blindada.',
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
        description: 'Gestiona la subida final a producción (Vercel) de forma segura. Realiza un Health Check de Git para evitar el error de "repo sin assets", verifica el EXPORT_MANIFEST y automatiza el push al repositorio del cliente. Su objetivo es asegurar que lo que el cliente ve en el demo sea exactamente lo que llega a su dominio.',
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
        description: 'Empaqueta un sitio de prospecto mediante un análisis inteligente de dependencias. Copia exclusivamente los archivos necesarios, genera un package.json optimizado y realiza un build de prueba. Es fundamental para garantizar la autonomía total del cliente, entregando un código limpio y funcional sin rastro de archivos volátiles.',
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
        description: 'Genera la estructura multi-página completa para un prospecto de alto valor. Basándose en el Brand Soul, expande la landing original hacia rutas críticas como /nosotros, /servicios y /contacto, manteniendo la coherencia visual y la autoridad técnica en cada rincón del sitio. Es el paso final para convertir un demo en una plataforma corporativa.',
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
        description: 'Protocolo de Quality Assurance exhaustivo que actúa como el "Juez Final". Evalúa el sitio bajo estándares internacionales de diseño y performance. No solo busca errores técnicos, sino que asegura que la pieza transmita el nivel de "Wow" esperado por HojaCero. Un sitio rechazado por QA requiere volver a la fase de diseño.',
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
        description: 'Inyecta el "Cerebro SEO" en el sitio. Registra al cliente en la base de datos central, configura las meta-etiquetas dinámicas, genera el sitemap y activa el mecanismo de Kill Switch para control de pagos. Asegura que el sitio esté optimizado para indexación inmediata y protección comercial de la agencia.',
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
        description: 'El motor principal de prospección de HojaCero. Genera una landing page completa y visualmente impactante a partir de un simple prompt o el nombre de un cliente. Utiliza inyección de componentes premium para lograr un efecto "Wow" inmediato, sirviendo como la prueba de concepto definitiva para cerrar ventas de alto valor.',
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
        description: 'Dota al sitio de una personalidad dinámica mediante la inyección de "Primitivas de Vida". Utiliza Orbs, Grids infinitos y sistemas de partículas basados en matemáticas para que el sitio no se sienta estático. Es el toque final que hace que una interfaz "respire" y reaccione a la presencia del usuario sin sacrificar rendimiento.',
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
        description: 'Dota al proyecto de una fábrica de landings especializada en conversión para pauta digital. Inyecta el motor h0_landings en Supabase, despliega un dashboard administrativo y activa un renderer dinámico capaz de generar Landing Pages de respuesta directa sin tocar código adicional. Ideal para campañas de marketing de escala masiva.',
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
        description: 'La chispa de automatización total (Estilo ICEBUIN). Escanea el proyecto en busca de procesos manuales repetitivos —como optimización de imágenes pesadas o generación de ALTs— y genera scripts automáticos para resolverlos. Su filosofía es: "Si lo haces más de 3 veces, escribe un script para que H0 lo haga por ti".',
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
        description: 'Módulo financiero crítico para negocios físicos. Inyecta un sistema de gestión de caja manual que rastrea ingresos, egresos y movimientos diarios. Se integra perfectamente con el POS para proporcionar una vista en tiempo real de la liquidez del negocio, asegurando que cada dólar que entra o sale quede registrado bajo auditoría.',
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
        description: 'Convierte una landing estática en una plataforma de pedidos inteligente. Inyecta el Food Engine que gestiona carritos de compra, sincronización en tiempo real con la administración y notificaciones automáticas de pedidos. Incluye lógica de apertura/cierre dinámica y un dashboard "Germain Control" para monitorear ventas vivas.',
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
        description: 'Módulo de mantenimiento automático para sitios en producción. Ejecuta auditorías de performance, optimiza imágenes pesadas, verifica links rotos y actualiza dependencias críticas (Patch/Minor). Siempre genera un backup previo y entrega un reporte detallado de los ahorros de espacio y mejoras de velocidad logradas.',
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
        description: 'Sistema de inteligencia de flota que monitorea el estado de todos los sitios bajo contrato de mantenimiento. Identifica automáticamente qué sitios necesitan atención esta semana, detecta desviaciones en el performance y proporciona un listado priorizado para asegurar que ningún cliente se quede sin su optimización mensual.',
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
        description: 'Transforma el dashboard en un terminal de Punto de Venta (POS) profesional. Permite la gestión de mesas en tiempo real, sincronización atómica con la cocina y el cierre de caja automático. Diseñado para alta fidelidad táctil y operaciones críticas donde la velocidad y la precisión en la facturación son vitales.',
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
        description: 'Inyecta resiliencia total mediante el estándar Progressive Web App. Genera assets adaptables (iconos maskable), configura Service Workers resilientes y asegura un modo offline real con landing de emergencia. Su meta es alcanzar el Score 40 en PWA Builder, garantizando una experiencia de "App nativa" desde el navegador.',
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
        description: 'Convierte el sitio en una aplicación nativa para Android usando el protocolo Trusted Web Activities (TWA). Genera el handshake de seguridad mediante assetlinks.json para eliminar la barra del navegador y dejar el sitio en pantalla completa. Es el paso final para que el cliente tenga presencia oficial en la Google Play Store.',
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
        description: 'Módulo de autogestión 100% independiente que utiliza la API de GitHub como base de datos (No-DB). Permite al cliente editar textos y activos directamente desde un panel premium, reflejando los cambios automáticamente en el repositorio. Máxima autonomía, sin dependencias de bases de datos externas y con propiedad total del código.',
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

                        {/* DESCRIPCIÓN DETALLADA (MODO MANUAL) */}
                        <div className="space-y-6">
                            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                                <BookOpen size={16} className="text-primary" /> Guía Operativa
                            </h3>
                            <div className="prose prose-invert prose-sm max-w-none text-muted-foreground leading-relaxed space-y-4">
                                {currentWorkflow.description.split('\n').map((para, i) => (
                                    <p key={i} className={para.startsWith('-') ? 'pl-4 border-l border-border/50' : ''}>
                                        {para}
                                    </p>
                                ))}
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
