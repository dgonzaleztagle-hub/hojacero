
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
    CheckCircle2, AlertTriangle, Info
} from 'lucide-react';

type SectionKey = 'maestro' | 'factory' | 'pro' | 'workers' | 'skills' | 'seguridad';

interface HelpItem {
    id: string;
    title: string;
    desc: string;
    icon: any;
    details: string;
    strategy: string;
    tags: string[];
    workflow?: string;
    impact?: {
        db: string[];
        files: string[];
        skills: string[];
    };
    rulesOfGold: string[];
}

export default function BibliaH0Page() {
    const [selectedTab, setSelectedTab] = useState<SectionKey>('maestro');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    const sections: Record<SectionKey, { label: string; icon: any; items: HelpItem[] }> = {
        maestro: {
            label: 'Ciclo de Vida H0',
            icon: Target,
            items: [
                {
                    id: 'm1', title: 'Radar & Discovery', icon: Target,
                    desc: 'Detección quirúrgica de debilidad técnica en prospectos.',
                    strategy: 'El Radar no es un buscador, es un microscopio. Buscamos el "Technical Debt" del cliente para entrar con una solución que lo haga sentir obsoleto.',
                    details: 'Utiliza el motor de scraping para medir: LCP (velocidad), diseño responsive, y presencia de trackers. Si un sitio tarda > 3s o no tiene móvil, la IA genera un "Brief de Ataque" que Daniel usa para el primer contacto.',
                    tags: ['Radar', 'Growth'],
                    impact: {
                        db: ['leads_scanner', 'lead_activities'],
                        files: ['utils/radar.ts', 'hooks/useRadar.ts'],
                        skills: ['SEO Strategist']
                    },
                    rulesOfGold: [
                        'Nunca contactar sin un "Grano de Verdad" técnico.',
                        'Prioritizar empresas con AdWords activo pero web mediocre.'
                    ]
                },
                {
                    id: 'm2', title: 'Inyección de Demo (The Hook)', icon: Flame,
                    desc: 'El golpe de efecto: un espejo premium en tiempo récord.',
                    strategy: 'Vender una idea es difícil; vender un espejo perfecto de su propio negocio es inevitable. Es nuestra bala de plata.',
                    details: 'Ejecución del comando /factory-demo. El sistema clona la estructura real (Menú Espejo), eleva el diseño a Nivel Awwwards y entrega un link funcional que el cliente abre en su móvil.',
                    workflow: '/factory-demo',
                    tags: ['Venta', 'Factory'],
                    impact: {
                        db: ['h0_landings'],
                        files: ['app/prospectos/[cliente]/', 'components/premium/'],
                        skills: ['Creative Director']
                    },
                    rulesOfGold: [
                        'Z-Index Check: El contenido siempre debe ser legible.',
                        'Protocolo Mirror: No inventar categorías, replicar el negocio real.',
                        'Visibilidad Daniel: Prohibido usar grises ilegibles.'
                    ]
                },
                {
                    id: 'm3', title: 'Producción Golden Master', icon: Rocket,
                    desc: 'Escalado industrial a arquitectura multi-página.',
                    strategy: 'Transformamos la landing de prueba en una infraestructura empresarial completa, blindada para el tráfico real.',
                    details: 'Activación de /factory-final. Generamos Layouts centralizados, SEO Head avanzado y el contenido expandido (Nosotros, Servicios, Contacto). Cada página hereda el ADN visual del demo aprobado.',
                    workflow: '/factory-final',
                    tags: ['Dev', 'Scale'],
                    impact: {
                        db: ['monitored_sites'],
                        files: ['app/prospectos/[cliente]/**'],
                        skills: ['Factory Lead']
                    },
                    rulesOfGold: [
                        'Cada página nueva debe ser una "hermana gemela" del demo.',
                        'Secciones WOW obligatorias en cada sub-página.'
                    ]
                },
                {
                    id: 'm4', title: 'Blindaje & Entrega', icon: Shield,
                    desc: 'Optimización final y activación de retención activa.',
                    strategy: 'El sitio no solo debe ser bonito; debe ser indestructible y asegurar que el cliente se mantenga al día con sus pagos.',
                    details: 'Inyectamos /factory-seo y el sistema Kill Switch. Registramos el sitio en nuestro ERP interno para monitoreo 24/7 y activamos el rastreo de eventos (DemoTracker).',
                    workflow: '/factory-seo',
                    tags: ['Seguridad', 'SEO'],
                    impact: {
                        db: ['site_status', 'monitored_sites'],
                        files: ['components/seo/SEOHead.tsx', 'layout.tsx'],
                        skills: ['Factory Auditor']
                    },
                    rulesOfGold: [
                        'Sitemap y Robots.txt obligatorios antes del deploy.',
                        'El Kill Switch debe estar correctamente vinculado al UUID de Supabase.'
                    ]
                }
            ]
        },
        factory: {
            label: 'Industrial Factory',
            icon: Cpu,
            items: [
                {
                    id: 'f1', title: '/factory-demo', icon: Layout,
                    desc: 'Generación de landing premium desde URL.',
                    strategy: 'Nuestra herramienta más potente de conversión comercial.',
                    details: 'Scrapea el alma del negocio, detecta su industria y aplica una de las 45 plantillas V4.0 Skill-Driven. Incluye activos generados por IA a 1080p (estricto) y micro-animaciones GSAP/Framer.',
                    workflow: 'factory-demo.md',
                    tags: ['Demo', 'Automatic'],
                    rulesOfGold: [
                        'Speeed es una condición de fallo, la precisión es lo único que importa.',
                        'Prohibido usar 4K en assets de prospectos.'
                    ]
                },
                {
                    id: 'f2', title: '/factory-final', icon: Box,
                    desc: 'Cierra el ciclo de desarrollo multi-página.',
                    strategy: 'Entrega de un producto terminado listo para producción.',
                    details: 'Crea las sub-páginas (Nosotros, Servicios, Contacto) manteniendo el Style Lock del demo. Asegura la coherencia tipográfica y de espaciado en todo el sitio.',
                    workflow: 'factory-final.md',
                    tags: ['Final', 'Multi-page'],
                    rulesOfGold: [
                        'No modificar el page.tsx del demo (es sagrado).',
                        'Validar el "Content Handshake" con el usuario antes de construir.'
                    ]
                },
                {
                    id: 'f3', title: '/factory-qa', icon: UserCheck,
                    desc: 'Filtro de calidad e inspección técnica.',
                    strategy: 'Ningún sitio sale de la fábrica si no es un 10/10.',
                    details: 'Actúa como un Juez de Awwwards. Revisa: Legibilidad móvil, contraste, links rotos, RLS en base de datos y fluidez de animaciones.',
                    workflow: 'factory-qa.md',
                    tags: ['QA', 'Review'],
                    rulesOfGold: [
                        'Si el sitio parece una plantilla de $50, se rechaza.',
                        'Márgenes mínimos de 24px en mobile.'
                    ]
                },
                {
                    id: 'f4', title: '/factory-alive', icon: Flame,
                    desc: 'Inyección de primitivas de diseño generativo.',
                    strategy: 'Dale "vida" al Hero sin usar videos pesados.',
                    details: 'Decide e inyecta componentes como GridNodes, ParticleSystem o AmbientOrb según la psicología de la marca definida en el BRAND_SOUL.md.',
                    workflow: 'factory-alive.md',
                    tags: ['Motion', 'Premium'],
                    rulesOfGold: [
                        'Z-index Check obligatorio para no tapar el texto.',
                        'Menos es más: no saturar si el diseño base es potente.'
                    ]
                },
                {
                    id: 'f5', title: '/factory-seo', icon: Globe,
                    desc: 'Estrategia de autoridad técnica y AEO.',
                    strategy: 'Asegura que el cliente domine los resultados de búsqueda local.',
                    details: 'Inyecta JSON-LD estructurado (Schema.org) adaptado a la industria. Genera Meta Titles de alta conversión y audita la jerarquía de Headings (H1-H3).',
                    workflow: 'factory-seo.md',
                    tags: ['SEO', 'Google'],
                    rulesOfGold: [
                        'Un solo H1 por página.',
                        'Alt text descriptivo en el 100% de las imágenes.'
                    ]
                },
                {
                    id: 'f6', title: '/factory-export', icon: Box,
                    desc: 'Empaquetado para entrega final.',
                    strategy: 'Preparación del bundle listo para subir a Vercel.',
                    details: 'Recopila todos los assets de public/prospectos/[cliente], genera el build estático y verifica que las rutas relativas no se rompan.',
                    workflow: 'factory-export.md',
                    tags: ['Ops', 'Delivery'],
                    rulesOfGold: [
                        'Verificar que el tamaño del bundle no exceda límites de hosting.',
                        'Limpiar archivos de desarrollo antes del zip.'
                    ]
                }
            ]
        },
        pro: {
            label: 'Motores Pro (Add-ons)',
            icon: Zap,
            items: [
                {
                    id: 'p1', title: '/worker-food-pro', icon: ShoppingBag,
                    desc: 'ERP Gastronómico "Donde Germain".',
                    strategy: 'El motor más rentable de Hoja Cero para el sector alimentación.',
                    details: 'Inyecta lógica de pedidos en tiempo real, estados de cocina (KDS), control de sesiones y WhatsApp dinámico. Convierte una landing en una máquina de facturación.',
                    workflow: 'worker-food-pro.md',
                    tags: ['H0-Engine', 'Resto'],
                    impact: {
                        db: ['_orders', '_order_items', '_sessions'],
                        files: ['hooks/food-engine/', 'components/food/'],
                        skills: ['Factory Consultant']
                    },
                    rulesOfGold: [
                        'Prefijo de base de datos obligatorio para aislamiento de datos.',
                        'Alertas sonoras para pedidos nuevos son críticas.'
                    ]
                },
                {
                    id: 'p2', title: '/worker-pos-pro', icon: Terminal,
                    desc: 'Terminal de Punto de Venta (POS).',
                    strategy: 'Control total de salón y mesas físicas.',
                    details: 'Gestión de mesas por zonas (Salón, Terraza), comanda digital y cierre de caja integrado. Diseñado para tablets y uso intensivo en local.',
                    workflow: 'worker-pos-pro.md',
                    tags: ['POS', 'Retail'],
                    rulesOfGold: [
                        'Interacción 100% táctil (botones grandes de 48px).',
                        'Actualización realtime del estado de las mesas.'
                    ]
                },
                {
                    id: 'p3', title: '/worker-cash-pro', icon: DollarSign,
                    desc: 'Gestor de Flujo de Caja y Gastos.',
                    strategy: 'Transparencia financiera absoluta para el dueño del negocio.',
                    details: 'Registro de aperturas, retiros, gastos manuales y arqueos. Se integra con el POS y el Food Engine para cuadrar cada peso.',
                    workflow: 'worker-cash-pro.md',
                    tags: ['Finance', 'ERP'],
                    rulesOfGold: [
                        'Cero tolerancia a descuadres no explicados.',
                        'RLS estricto: montos solo visibles para Admins.'
                    ]
                },
                {
                    id: 'p4', title: '/worker-ads-factory', icon: Megaphone,
                    desc: 'Fábrica de Landings de Conversión.',
                    strategy: 'Permite al cliente crear campañas de pauta sin depender de nosotros.',
                    details: 'Editor visual basado en bloques maestros (Hero, Proof, CTA). Optimizado para "Direct Response" y carga ultra-rápida móvil.',
                    workflow: 'worker-ads-factory.md',
                    tags: ['Marketing', 'Ads'],
                    rulesOfGold: [
                        'CTA enfocado a un solo objetivo (WhatsApp o Form).',
                        'Diseño móvil-primero obligatorio.'
                    ]
                }
            ]
        },
        workers: {
            label: 'Operaciones & Soporte',
            icon: Settings,
            items: [
                {
                    id: 'w1', title: '/worker-mensual', icon: Activity,
                    desc: 'Planificador de Flota y Cobros.',
                    strategy: 'Nuestro radar interno para mantener el flujo de caja del estudio.',
                    details: 'Consulta Supabase para listar quién necesita mantención hoy y quién tiene facturas pendientes. Genera la hoja de ruta para Daniel y Gastón.',
                    workflow: 'worker-mensual.md',
                    tags: ['Admin', 'H0-HQ'],
                    rulesOfGold: [
                        'Alertar clientes con más de 2 días de retraso.',
                        'Marcar para mantenimiento solo si el pago está al día.'
                    ]
                },
                {
                    id: 'w2', title: '/worker-maintain', icon: Zap,
                    desc: 'IA de Mantenimiento Automático.',
                    strategy: 'Soporte premium que no requiere tiempo humano.',
                    details: 'Entra al sitio del cliente, actualiza Next.js/Tailwind, comprime imágenes nuevas y verifica que el SEO no haya bajado de ranking.',
                    workflow: 'worker-maintain.md',
                    tags: ['Maintenance', 'IA'],
                    rulesOfGold: [
                        'Backup obligatorio antes de cualquier update.',
                        'Actualizar solo Patch/Minor, nunca Major sin supervisión.'
                    ]
                },
                {
                    id: 'w3', title: '/worker-automate', icon: Command,
                    desc: 'Inyección de "Superpoderes" (ICEBUIN).',
                    strategy: 'Automatización de tareas masivas de datos y assets.',
                    details: 'Basado en la filosofía ICEBUIN. Scripts para procesar 1000 fotos, generar 100 descripciones con IA o migrar datos de catálogos legacy.',
                    workflow: 'worker-automate.md',
                    tags: ['Scripts', 'Power'],
                    rulesOfGold: [
                        'Si haces algo más de 3 veces, automatízalo.',
                        'Validar el 10% de los outputs generados por IA.'
                    ]
                }
            ]
        },
        skills: {
            label: 'Inteligencia Jarvis',
            icon: Cpu,
            items: [
                {
                    id: 's1', title: 'Creative Director', icon: Star,
                    desc: 'El selector estético implacable.',
                    details: 'Ejerce su autoridad para elegir paletas de colores, tipografías y layouts. Su palabra es ley en cuanto al "WOW Effect".',
                    strategy: 'Asegurar que H0 nunca entregue algo mediocre.',
                    tags: ['Art', 'Skill'],
                    rulesOfGold: [
                        'Prohibido el uso de Placeholders.',
                        'Ondas, grids y ruido como texturas de lujo.'
                    ]
                },
                {
                    id: 's2', title: 'Factory Auditor', icon: Shield,
                    desc: 'El guardián del código y la seguridad.',
                    details: 'Revisa vulnerabilidades, fugas de API Keys y asegura que las políticas de Supabase (RLS) protejan la data del cliente.',
                    strategy: 'Evitar hackeos y asegurar escalabilidad.',
                    tags: ['Security', 'Expert'],
                    rulesOfGold: [
                        'Limpia logs de consola antes de producción.',
                        'Verifica que el Kill Switch sea in-bypassable.'
                    ]
                },
                {
                    id: 's3', title: 'SEO Strategist', icon: Target,
                    desc: 'El oráculo del posicionamiento AEO.',
                    details: 'Investiga las "Preguntas Frecuentes Reales" para alimentar a los Answer Engines. Define la estructura de datos perfecta.',
                    strategy: 'Hacer que el negocio del cliente sea la respuesta de la IA.',
                    tags: ['SEO', 'Oracle'],
                    rulesOfGold: [
                        'Contenido real > Contenido IA relleno.',
                        'Keywords semánticas en el primer párrafo del Hero.'
                    ]
                }
            ]
        },
        seguridad: {
            label: 'Control de Retención',
            icon: Shield,
            items: [
                {
                    id: 'sc1', title: 'Kill Switch (Protocolo H0)', icon: AlertCircle,
                    desc: 'Sistema de bloqueo por falta de pago.',
                    details: 'Un script de 3 líneas inyectado que consulta Supabase. Si is_active = false, reemplaza el sitio por una pantalla de "En Mantenimiento".',
                    strategy: 'Garantizar el pago de las cuotas de mantenimiento.',
                    tags: ['Finance', 'Security'],
                    rulesOfGold: [
                        'Debe ser lo primero que se ejecute en el <head>.',
                        'Nunca mostrar mensajes agresivos, siempre "Mantenimiento".'
                    ]
                },
                {
                    id: 'sc2', title: 'Monitored Sites Dashboard', icon: Database,
                    desc: 'La torre de control de la flota.',
                    details: 'Tabla maestra en Supabase donde rastreamos UUID, Plan, Fecha de Pago y Estado Tecnológico de cada implementación.',
                    strategy: 'Visión global del negocio propio.',
                    tags: ['Admin', 'HQ'],
                    rulesOfGold: [
                        'Actualizar el log de mantención tras cada /worker-maintain.'
                    ]
                }
            ]
        }
    };

    const filteredItems = useMemo(() => {
        return sections[selectedTab].items.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [selectedTab, searchQuery, sections]);

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 md:p-10 font-sans selection:bg-cyan-500/30">
            {/* --- HEADER --- */}
            <header className="mb-12 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <span className="h-px w-8 bg-cyan-500" />
                            <span className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.3em]">Manual de Ingeniería H0</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.8] mb-4">
                            BIBLIA <br /> <span className="text-cyan-400">MAESTRA.</span>
                        </h1>
                        <p className="max-w-md text-zinc-500 font-medium text-sm leading-relaxed">
                            Protocolos quirúrgicos, automatización industrial y estrategias de autoridad técnica para dominar el mercado.
                        </p>
                    </motion.div>

                    <div className="relative group w-full md:w-96">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar comando, tabla o estrategia..."
                            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm focus:outline-none focus:border-cyan-400/50 transition-all backdrop-blur-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* --- NAVIGATION TABS --- */}
                <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-white/5">
                    {(Object.keys(sections) as SectionKey[]).map((key) => {
                        const Icon = sections[key].icon;
                        const isActive = selectedTab === key;
                        return (
                            <button
                                key={key}
                                onClick={() => setSelectedTab(key)}
                                className={`
                                    flex items-center gap-3 px-8 py-5 rounded-t-3xl whitespace-nowrap font-black italic uppercase text-[10px] tracking-widest transition-all relative
                                    ${isActive
                                        ? 'bg-zinc-900 border-x border-t border-white/10 text-cyan-400'
                                        : 'text-zinc-500 hover:text-white'}
                                `}
                            >
                                <Icon size={14} className={isActive ? 'text-cyan-400' : 'text-zinc-600'} />
                                {sections[key].label}
                                {isActive && (
                                    <motion.div
                                        layoutId="tab-underline"
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </header>

            {/* --- CONTENT BENTO GRID --- */}
            <main className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item, idx) => {
                            const isExpanded = expandedItem === item.id;
                            return (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                                    className={`
                                        group bg-zinc-900/40 border border-white/5 hover:border-cyan-500/30 p-8 rounded-[2.5rem] cursor-pointer transition-all
                                        ${isExpanded ? 'lg:col-span-2 bg-zinc-900/80' : 'hover:scale-[1.01]'}
                                    `}
                                >
                                    <div className="flex flex-col md:flex-row gap-8">
                                        {/* Left Side: Summary */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center border border-white/5 ring-4 ring-zinc-900 group-hover:ring-cyan-500/10 transition-all">
                                                    <item.icon size={24} className="text-cyan-400" />
                                                </div>
                                                <div className="flex flex-wrap gap-2 justify-end">
                                                    {item.tags?.map(tag => (
                                                        <span key={tag} className="bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full text-[8px] font-black uppercase text-cyan-400 tracking-tighter">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4 group-hover:text-cyan-400 transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-zinc-400 text-base leading-relaxed mb-6 font-medium">
                                                {item.desc}
                                            </p>

                                            <div className="flex items-center gap-4 text-xs font-black uppercase italic text-zinc-600">
                                                <span className="flex items-center gap-2">
                                                    <Fingerprint size={14} /> ID: {item.id}
                                                </span>
                                                {item.workflow && (
                                                    <span className="flex items-center gap-2 text-cyan-500/60">
                                                        <Code size={14} /> {item.workflow}
                                                    </span>
                                                )}
                                                <span className="ml-auto text-cyan-500 group-hover:translate-x-1 transition-transform">
                                                    {isExpanded ? 'VER MENOS -' : 'PROFUNDIZAR +'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right Side: Deep Content (Visible when expanded) */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className="flex-[1.5] space-y-8 pt-4 md:pt-0"
                                                >
                                                    {/* Impact Section */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="bg-black/40 rounded-3xl p-6 border border-white/5">
                                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-3 flex items-center gap-2">
                                                                <Database size={10} /> Impacto Técnico
                                                            </h4>
                                                            <div className="space-y-2">
                                                                <p className="text-[10px] text-zinc-500 font-bold uppercase">Tablas:</p>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {item.impact?.db.map(t => <span key={t} className="text-[9px] font-mono text-zinc-300">[{t}]</span>)}
                                                                </div>
                                                                <p className="text-[10px] text-zinc-500 font-bold uppercase mt-3">Críticos:</p>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {item.impact?.files.map(f => <span key={f} className="text-[9px] font-mono text-zinc-400">{f}</span>)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="bg-black/40 rounded-3xl p-6 border border-white/5">
                                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-3 flex items-center gap-2">
                                                                <Lock size={10} /> Reglas de Oro
                                                            </h4>
                                                            <ul className="space-y-2">
                                                                {item.rulesOfGold.map((rule, i) => (
                                                                    <li key={i} className="flex gap-2 text-[10px] text-zinc-300 font-medium">
                                                                        <CheckCircle2 size={10} className="text-amber-500 shrink-0 mt-0.5" />
                                                                        {rule}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    {/* Full Details */}
                                                    <div className="space-y-6">
                                                        <div className="bg-cyan-500/5 rounded-[2rem] p-8 border border-cyan-500/10">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <div className="p-2 bg-cyan-500 text-black rounded-lg">
                                                                    <BookOpen size={16} />
                                                                </div>
                                                                <h4 className="text-sm font-black italic uppercase tracking-widest text-white">Autoridad Técnica</h4>
                                                            </div>
                                                            <p className="text-zinc-300 text-sm leading-relaxed mb-6 italic">
                                                                "{item.details}"
                                                            </p>
                                                            <div className="h-px bg-white/5 mb-6" />
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <div className="p-2 bg-zinc-800 text-white rounded-lg">
                                                                    <Target size={16} />
                                                                </div>
                                                                <h4 className="text-sm font-black italic uppercase tracking-widest text-white">Valor de Negocio</h4>
                                                            </div>
                                                            <p className="text-zinc-400 text-sm leading-relaxed">
                                                                {item.strategy}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {filteredItems.length === 0 && (
                    <div className="py-20 text-center">
                        <AlertTriangle className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                        <h3 className="text-xl font-black italic uppercase text-zinc-500">No se encontraron protocolos para "{searchQuery}"</h3>
                    </div>
                )}
            </main>

            {/* --- FOOTER HQ --- */}
            <footer className="mt-20 max-w-7xl mx-auto">
                <div className="p-12 bg-zinc-900 border border-white/5 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full -mr-48 -mt-48 transition-all group-hover:bg-cyan-500/20" />

                    <div className="flex items-center gap-8 relative z-10">
                        <div className="w-20 h-20 bg-cyan-500 text-black rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.3)]">
                            <Command size={32} />
                        </div>
                        <div>
                            <h4 className="font-black italic uppercase text-3xl tracking-tighter mb-2">Sincronización Total.</h4>
                            <p className="text-zinc-500 text-sm max-w-md">Para ejecutar cualquier protocolo, usa los comandos "/" en la interfaz de Jarvis. La automatización es el fin de la manualidad.</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                        <button className="px-10 py-5 bg-white text-black rounded-2xl font-black italic uppercase text-xs tracking-widest hover:scale-105 hover:bg-cyan-400 active:scale-95 transition-all">
                            Nueva Inyección
                        </button>
                        <button className="px-10 py-5 bg-zinc-800 text-white rounded-2xl font-black italic uppercase text-xs tracking-widest border border-white/5 hover:bg-zinc-700 transition-all">
                            Manual de Guerra
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em] pb-12">
                    Hoja Cero Studio © 2026 // Jarvis Intelligence System // No more MVPs.
                </div>
            </footer>
        </div>
    );
}
