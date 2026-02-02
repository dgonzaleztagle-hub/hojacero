'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Rocket, Shield, Database,
    Terminal, Layout, Search, Command,
    ChevronRight, BookOpen, UserCheck,
    Settings, Star, AlertCircle, PlayCircle,
    ShoppingBag, DollarSign, Box, BarChart3,
    Cpu, Target, Activity, Flame
} from 'lucide-react';

type SectionKey = 'maestro' | 'factory' | 'pro' | 'workers' | 'skills' | 'seguridad';

interface HelpItem {
    id: string;
    title: string;
    desc: string;
    icon: any;
    details: string;
    workflow?: string;
    syntax?: string;
    tags?: string[];
}

export default function BibliaH0Page() {
    const [selectedTab, setSelectedTab] = useState<SectionKey>('maestro');
    const [searchQuery, setSearchQuery] = useState('');

    const sections: Record<SectionKey, { label: string; icon: any; items: HelpItem[] }> = {
        maestro: {
            label: 'Flujo Maestro',
            icon: Target,
            items: [
                {
                    id: 'f1', title: '1. Radar & Captación', icon: Target,
                    desc: 'Detección activa de oportunidades con IA.',
                    details: 'Usa el módulo RADAR para escanear zonas comerciales. La IA no solo busca negocios, sino que mide su "Technical Debt" (deuda técnica). Si el sitio es lento o feo, el Lead entra automáticamente al Pipeline.',
                    tags: ['Radar', 'Scanner']
                },
                {
                    id: 'f2', title: '2. Inyección de Demo', icon: flame,
                    desc: 'Generación del "WOW Effect" inmediato.',
                    details: 'Ejecución de /factory-demo. Creamos un espejo premium de su negocio actual en < 20 min. Es la bala de plata para cerrar el trato.',
                    workflow: '/factory-demo',
                    tags: ['Venta', 'Visual']
                },
                {
                    id: 'f3', title: '3. Firma & Onboarding', icon: UserCheck,
                    desc: 'Cierre comercial y activación de proyecto.',
                    details: 'Una vez aprobado el demo, se solicita el anticipo. El lead se mueve a "Producción" y se activan los recursos del sistema.',
                    tags: ['Comercial']
                },
                {
                    id: 'f4', title: '4. Producción Final', icon: Rocket,
                    desc: 'Escalado a sitio multi-página.',
                    details: 'Se corre /factory-final para generar toda la infraestructura (Home, Servicios, Nosotros). Se aplican los estilos Gold Master.',
                    workflow: '/factory-final',
                    tags: ['Dev', 'Escale']
                },
                {
                    id: 'f5', title: '5. Technical SEO & Kill-Switch', icon: Shield,
                    desc: 'Blindaje y optimización de entrega.',
                    details: 'Con /factory-seo inyectamos el ADN técnico, registramos en monitored_sites y activamos el sistema de retención (Kill Switch).',
                    workflow: '/factory-seo',
                    tags: ['Seguridad', 'SEO']
                }
            ]
        },
        factory: {
            label: 'Factory Core',
            icon: Cpu,
            items: [
                {
                    id: 'c1', title: '/factory-demo', icon: Layout,
                    desc: 'Crea una landing premium desde una URL.',
                    syntax: '/factory-demo para [URL]',
                    details: 'Scrapea contenido real, detecta industria y aplica plantillas Awwwards-Level automáticas.',
                    workflow: 'factory-demo.md'
                },
                {
                    id: 'c2', title: '/factory-final', icon: BookOpen,
                    desc: 'Genera todas las páginas del sitio.',
                    syntax: '/factory-final para [Nombre]',
                    details: 'Expande la estética del demo a todas las sub-páginas necesarias siguiendo la coherencia visual.',
                    workflow: 'factory-final.md'
                },
                {
                    id: 'c3', title: '/factory-qa', icon: UserCheck,
                    desc: 'Auditoría de Calidad Awwwards.',
                    syntax: '/factory-qa para [Nombre]',
                    details: 'Verifica micro-animaciones, contraste, mobile-fitness y consistencia. Si no brilla, no pasa.',
                    workflow: 'factory-qa.md'
                },
                {
                    id: 'c4', title: '/factory-brand', icon: Star,
                    desc: 'Aplica el ADN visual de HojaCero.',
                    syntax: '/factory-brand para [Nombre]',
                    details: 'Fuerza fuentes tipográficas, espaciados y elementos de marca para un look premium absoluto.',
                    workflow: 'factory-brand.md'
                }
            ]
        },
        pro: {
            label: 'Motores Pro (Add-ons)',
            icon: Zap,
            items: [
                {
                    id: 'p1', title: '/worker-food-pro', icon: ShoppingBag,
                    desc: 'Inyecta el CRM/ERP Gastronómico.',
                    details: 'Nuestra gema más preciada para restaurantes. Activa pedidos online, estados de cocina y control de mesas.',
                    workflow: 'worker-food-pro.md',
                    tags: ['Food', 'ERP']
                },
                {
                    id: 'p2', title: '/worker-pos-pro', icon: Terminal,
                    desc: 'Control de Salón Profesional.',
                    details: 'Activa la terminal táctil de pedidos, gestión de mesas físicas y arqueo de caja integrado.',
                    workflow: 'worker-pos-pro.md',
                    tags: ['POS', 'Mesas']
                },
                {
                    id: 'p3', title: '/worker-cash-pro', icon: DollarSign,
                    desc: 'Control de Caja y Flujo.',
                    details: 'Inyecta la lógica de apertura/cierre de caja, gastos manuales y balance diario en tiempo real.',
                    workflow: 'worker-cash-pro.md',
                    tags: ['Finanzas']
                }
            ]
        },
        workers: {
            label: 'Recurrentes & Ops',
            icon: Settings,
            items: [
                {
                    id: 'w1', title: '/worker-mensual', icon: Activity,
                    desc: 'Planificador de mantenciones.',
                    details: 'Consulta Supabase y genera la hoja de ruta del día: quién necesita mantención y quién está pendiente de pago.',
                    workflow: 'worker-mensual.md'
                },
                {
                    id: 'w2', title: '/worker-maintain', icon: Zap,
                    desc: 'Mantenedor Automático.',
                    details: 'Entra al sitio del cliente, actualiza dependencias, optimiza assets y verifica el estado del SEO.',
                    workflow: 'worker-maintain.md'
                },
                {
                    id: 'w3', title: '/worker-automate', icon: Command,
                    desc: 'Procesamiento masivo de assets.',
                    details: 'Automatiza el renombrado, compresión y SEO de imágenes antes de subirlas al servidor.',
                    workflow: 'worker-automate.md'
                }
            ]
        },
        skills: {
            label: 'Agentes IA',
            icon: Cpu,
            items: [
                {
                    id: 's1', title: 'Creative Director', icon: Star,
                    desc: 'El ojo visor de la estética.',
                    details: 'Asegura que cada píxel sea impecable. Prohíbe el uso de placeholders y de diseños genéricos.'
                },
                {
                    id: 's2', title: 'Factory Auditor', icon: Shield,
                    desc: 'El inspector de seguridad y código.',
                    details: 'Limpia fugas técnicas, verifica RLS en Supabase y asegura que el código sea mantenible.'
                },
                {
                    id: 's3', title: 'SEO Strategist', icon: Target,
                    desc: 'El oráculo del tráfico.',
                    details: 'Define las keywords maestras y los metadatos que posicionarán al cliente en los primeros 3 puestos de Google.'
                }
            ]
        },
        seguridad: {
            label: 'Seguridad & Control',
            icon: Shield,
            items: [
                {
                    id: 'sc1', title: 'Kill Switch', icon: AlertCircle,
                    desc: 'Botón de pánico ante falta de pago.',
                    details: 'Un pequeño script inyectado que consulta Supabase. Si is_active es FALSE, el sitio se bloquea con un mensaje de mantenimiento.'
                },
                {
                    id: 'sc2', title: 'Monitored Sites', icon: Database,
                    desc: 'Nuestra flota de barcos vigilados.',
                    details: 'Tabla centralizada en Supabase que controla cada implementación activa. Es nuestro ERP interno.'
                }
            ]
        }
    };

    const filteredItems = sections[selectedTab].items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 md:p-10 font-sans">
            {/* --- HEADER --- */}
            <header className="mb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none mb-2">
                            Biblioteca <br /> <span className="text-cyan-400">La Fábrica.</span>
                        </h1>
                        <p className="text-zinc-500 font-medium italic uppercase tracking-[0.2em] text-[10px]">
                            El manual de supervivencia para el equipo HojaCero
                        </p>
                    </div>

                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar comando, motor o flujo..."
                            className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-cyan-400/50 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* --- TABS --- */}
                <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                    {(Object.keys(sections) as SectionKey[]).map((key) => {
                        const Icon = sections[key].icon;
                        const isActive = selectedTab === key;
                        return (
                            <button
                                key={key}
                                onClick={() => setSelectedTab(key)}
                                className={`
                                    flex items-center gap-3 px-6 py-4 rounded-2xl whitespace-nowrap font-black italic uppercase text-[10px] tracking-widest transition-all
                                    ${isActive
                                        ? 'bg-cyan-500 text-black shadow-[0_0_30px_rgba(34,211,238,0.2)]'
                                        : 'bg-zinc-900 text-zinc-500 hover:bg-zinc-800 border border-white/5'}
                                `}
                            >
                                <Icon size={14} />
                                {sections[key].label}
                            </button>
                        );
                    })}
                </div>
            </header>

            {/* --- CONTENT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredItems.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group bg-zinc-900/50 border border-white/5 hover:border-cyan-400/30 p-8 rounded-[2.5rem] flex flex-col justify-between transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-cyan-400/20 transition-colors">
                                        <item.icon size={20} className="text-cyan-400" />
                                    </div>
                                    <div className="flex gap-2">
                                        {item.tags?.map(tag => (
                                            <span key={tag} className="bg-white/5 px-3 py-1 rounded-full text-[8px] font-black uppercase text-zinc-500 tracking-tighter">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2 group-hover:text-cyan-400 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-medium">
                                    {item.desc}
                                </p>

                                <div className="bg-black/40 rounded-3xl p-6 border border-white/5 mb-6">
                                    <p className="text-xs text-zinc-500 font-bold uppercase italic mb-3 flex items-center gap-2">
                                        <BookOpen size={10} /> Funcionamiento Interno
                                    </p>
                                    <p className="text-zinc-300 text-sm leading-relaxed">
                                        {item.details}
                                    </p>
                                </div>
                            </div>

                            {(item.syntax || item.workflow) && (
                                <div className="pt-6 border-t border-white/5 space-y-3">
                                    {item.syntax && (
                                        <div className="flex items-center gap-3">
                                            <Terminal size={14} className="text-cyan-400" />
                                            <code className="text-[10px] font-black text-cyan-400/80 tracking-tight">
                                                {item.syntax}
                                            </code>
                                        </div>
                                    )}
                                    {item.workflow && (
                                        <div className="flex items-center gap-3">
                                            <PlayCircle size={14} className="text-green-500" />
                                            <span className="text-[10px] font-black italic uppercase text-zinc-500">
                                                Workflow: <span className="text-zinc-300">{item.workflow}</span>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* --- QUICK REF BAR --- */}
            <footer className="mt-20 p-8 bg-zinc-900 border border-white/5 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full -mr-32 -mt-32" />
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-cyan-500 text-black rounded-2xl flex items-center justify-center">
                        <Command size={24} />
                    </div>
                    <div>
                        <h4 className="font-black italic uppercase text-xl tracking-tighter">¿Cómo llamo a los obreros?</h4>
                        <p className="text-zinc-500 text-sm">Usa los comandos '/' en la consola de Antigravity para ejecutar cualquier workflow.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="px-8 py-4 bg-white text-black rounded-2xl font-black italic uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all">
                        Solicitar Nueva Automatización
                    </button>
                    <button className="px-8 py-4 bg-zinc-800 text-white rounded-2xl font-black italic uppercase text-[10px] tracking-widest border border-white/5 hover:bg-zinc-700 transition-all">
                        Reportar Error
                    </button>
                </div>
            </footer>
        </div>
    );
}

const flame = Flame; // Alias para evitar conflictos de nombres si los hubiera.
