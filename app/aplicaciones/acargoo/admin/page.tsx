'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Map as MapIcon, Package, Users, Activity,
    Search as SearchIcon, Bell, LogOut, Plus, Truck, ArrowUpRight,
    Calendar, CheckCircle2, AlertTriangle, XCircle, ChevronRight,
    Navigation as NavIcon
} from 'lucide-react';

import dynamic from 'next/dynamic';

// Cargar Mapa dinámicamente para evitar errores de SSR (Window is not defined)
const AcargooMap = dynamic(
    () => import('@/components/aplicaciones/acargoo/AcargooMap'),
    { ssr: false, loading: () => <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center font-bold text-slate-400">CARGANDO MAPA...</div> }
);

import LogoAcargoo from '@/components/aplicaciones/acargoo/LogoAcargoo';

// Colores de Marca Acargoo+ (Ajustados a la demo original)
const COLORS = {
    navy: '#1e3a5f',
    orange: '#ff9900',
    bg: '#f8fafc', // Slate 50
    card: '#ffffff',
    border: '#e2e8f0', // Slate 200
    text: '#1e293b', // Slate 800
    textMuted: '#64748b' // Slate 500
};

export default function AcargooAdminPage() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [mounted, setMounted] = useState(false);
    const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
    const [isBulkScheduleOpen, setIsBulkScheduleOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [selectedDriverHistory, setSelectedDriverHistory] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex h-screen overflow-hidden font-sans" style={{ backgroundColor: COLORS.bg, color: COLORS.text }}>
            {/* Modal de Nueva Carga (Mockup) */}
            <AnimatePresence>
                {isNewOrderOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#1e3a5f]/40 backdrop-blur-sm"
                            onClick={() => setIsNewOrderOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden"
                        >
                            <div className="p-10">
                                <h3 className="text-3xl font-bold tracking-tight text-slate-800 mb-2">Registrar <span className="text-orange-500">Nueva Carga.</span></h3>
                                <p className="text-slate-500 font-medium mb-8">Ingresa los detalles del servicio para asignación inmediata.</p>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cliente / Empresa</label>
                                        <input type="text" placeholder="Ej: BioCrom Lab" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tipo de Carga</label>
                                        <select className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-sm">
                                            <option>General</option>
                                            <option>Refrigerado</option>
                                            <option>Peligrosa (IMO)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Origen</label>
                                        <input type="text" placeholder="Dirección de carga" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Destino</label>
                                        <input type="text" placeholder="Dirección de descarga" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-sm" />
                                    </div>
                                </div>

                                <div className="mt-10 flex gap-4">
                                    <button onClick={() => setIsNewOrderOpen(false)} className="flex-1 py-4 font-bold text-slate-500 hover:text-slate-700 transition-colors uppercase text-xs tracking-widest">Descartar</button>
                                    <button className="flex-1 bg-orange-500 text-white py-4 rounded-2xl font-bold shadow-xl shadow-orange-500/20 active:scale-95 transition-all uppercase text-xs tracking-widest">Crear Servicio</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal de Programación Masiva */}
            <AnimatePresence>
                {isBulkScheduleOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#1e3a5f]/40 backdrop-blur-sm"
                            onClick={() => setIsBulkScheduleOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, x: 50 }}
                            animate={{ scale: 1, opacity: 1, x: 0 }}
                            exit={{ scale: 0.9, opacity: 0, x: 50 }}
                            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl relative z-10 overflow-hidden"
                        >
                            <div className="p-10">
                                <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                                    <Package size={32} />
                                </div>
                                <h3 className="text-3xl font-bold tracking-tight text-slate-800 mb-2">Programación <span className="text-blue-600">Masiva.</span></h3>
                                <p className="text-slate-500 font-medium mb-8">Sube tu archivo .csv o .xlsx para procesar múltiples servicios en segundos.</p>

                                <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center hover:border-blue-300 transition-colors cursor-pointer bg-slate-50 group">
                                    <ArrowUpRight className="mx-auto mb-4 text-slate-300 group-hover:text-blue-500 transition-colors rotate-180" size={40} />
                                    <p className="font-bold text-slate-700">Arrastra tu manifiesto de carga aquí</p>
                                    <p className="text-xs text-slate-400 mt-2 italic font-medium">O haz clic para explorar tus archivos</p>
                                </div>

                                <div className="mt-8 flex items-center gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                    <AlertTriangle className="text-orange-500 shrink-0" size={18} />
                                    <p className="text-[10px] font-bold text-orange-700 leading-tight uppercase tracking-wider">Asegúrate de usar el formato oficial de Acargoo+ v2.0</p>
                                </div>

                                <button onClick={() => setIsBulkScheduleOpen(false)} className="w-full mt-10 bg-[#1e3a5f] text-white py-5 rounded-2xl font-bold shadow-xl shadow-blue-900/20 active:scale-95 transition-all uppercase text-xs tracking-widest">Procesar Archivo</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal de Historial de Chofer */}
            <AnimatePresence>
                {selectedDriverHistory && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#1e3a5f]/40 backdrop-blur-sm"
                            onClick={() => setSelectedDriverHistory(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 100 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 100 }}
                            className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden"
                        >
                            <div className="p-12">
                                <div className="flex justify-between items-start mb-10">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-2 italic">Auditoría de Rendimiento</p>
                                        <h3 className="text-4xl font-bold tracking-tight text-slate-800">Historial: <span className="text-[#1e3a5f]">{selectedDriverHistory}</span></h3>
                                    </div>
                                    <button onClick={() => setSelectedDriverHistory(null)} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
                                        <XCircle size={24} />
                                    </button>
                                </div>

                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                    <HistoryRow date="Hoy, 14:20" id="AG-7281" route="Quilicura → Maipú" client="Transportes Lynch" status="Completado" />
                                    <HistoryRow date="Ayer, 09:15" id="AG-7150" route="Pudahuel → Las Condes" client="BioCrom Lab" status="Completado" />
                                    <HistoryRow date="10 Feb, 16:45" id="AG-7098" route="Lampa → San Bernardo" client="Constructor S.A" status="Incidencia" />
                                    <HistoryRow date="09 Feb, 11:00" id="AG-7043" route="Ñuñoa → Providencia" client="Minera Norte" status="Completado" />
                                    <HistoryRow date="08 Feb, 08:30" id="AG-6992" route="Colina → Santiago" client="Express Chile" status="Completado" />
                                </div>

                                <div className="mt-10 pt-10 border-t border-slate-100 flex justify-between items-center text-sm">
                                    <p className="font-bold text-slate-400 uppercase tracking-widest">Total Servicios mes: <span className="text-slate-800 ml-2">42</span></p>
                                    <button className="text-blue-600 font-bold hover:underline underline-offset-4">Exportar PDF de Auditoría</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- SIDEBAR --- */}
            <aside className="w-72 shadow-2xl flex flex-col z-20" style={{ backgroundColor: COLORS.navy }}>
                <div className="p-8">
                    <LogoAcargoo variant="dark" size="md" />
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    <NavItem icon={<LayoutDashboard />} label="Panel de Control" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <NavItem icon={<MapIcon />} label="Mapa de Flota" active={activeTab === 'map'} onClick={() => setActiveTab('map')} />
                    <NavItem icon={<Package />} label="Servicios Activos" active={activeTab === 'services'} onClick={() => setActiveTab('services')} />
                    <NavItem icon={<Users />} label="Gestionar Choferes" active={activeTab === 'drivers'} onClick={() => { setActiveTab('drivers'); setSelectedDriverHistory(null); }} />
                    <NavItem icon={<Activity />} label="Reportes" active={activeTab === 'metrics'} onClick={() => setActiveTab('metrics')} />
                </nav>

                <div className="p-6 border-t border-white/10">
                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 mb-4">
                        <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center font-bold text-white shadow-lg text-sm">DG</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">Daniel Gonzalez</p>
                            <p className="text-[10px] text-white/40 uppercase font-black uppercase tracking-wider">Administrador</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-white/5 transition-colors text-white/60 hover:text-white transition-all">
                        <LogOut size={18} />
                        <span className="font-bold uppercase text-xs tracking-wider">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Hero Gradient background behind main content */}
                <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />

                {/* Header */}
                <header className="h-24 flex items-center justify-between px-10 shrink-0">
                    <div className="flex items-center gap-4 bg-white shadow-sm px-6 py-3 rounded-2xl border border-slate-100 w-[450px]">
                        <SearchIcon className="text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar orden por ID, cliente o dirección..."
                            className="bg-transparent border-none outline-none text-sm w-full font-medium"
                        />
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex flex-col items-end">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estado del Sistema</p>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <p className="text-sm font-black text-slate-700 uppercase italic">Operativo Online</p>
                            </div>
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className={`relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all group ${isNotificationsOpen ? 'bg-orange-500 shadow-xl shadow-orange-500/30' : 'bg-white shadow-sm border border-slate-100 hover:shadow-md'}`}
                            >
                                <Bell size={22} className={isNotificationsOpen ? 'text-white' : 'text-slate-500 group-hover:text-orange-500 transition-colors'} />
                                <span className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full border-2 border-white ${isNotificationsOpen ? 'bg-white' : 'bg-orange-500'}`} />
                            </button>

                            {/* Dropdown de Notificaciones */}
                            <AnimatePresence>
                                {isNotificationsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                        className="absolute right-0 mt-4 w-96 bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(30,58,95,0.25)] border border-slate-100 z-50 overflow-hidden"
                                    >
                                        <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                            <h4 className="font-bold text-slate-800 flex items-center gap-2 uppercase text-xs tracking-widest">
                                                <Activity size={16} className="text-orange-500" /> Centro de Avisos
                                            </h4>
                                            <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-0.5 rounded-lg whitespace-nowrap">3 NUEVOS</span>
                                        </div>
                                        <div className="max-h-[350px] overflow-y-auto">
                                            <NotificationItem title="Nueva Carga Confirmada" time="Hace 2m" desc="AG-7281 asignada a Daniel G. con éxito." type="success" />
                                            <NotificationItem title="Desvío de Ruta Detectado" time="Hace 15m" desc="Unidad H0-302 se alejó de la ruta trazada en Maipú." type="warning" />
                                            <NotificationItem title="Firma Digital Recibida" time="Hace 1h" desc="Servicio AG-7279 entregado y auditado." type="info" />
                                            <NotificationItem title="Alerta de Mantenimiento" time="Hace 3h" desc="La unidad NPR-2024 requiere cambio de aceite pronto." type="warning" />
                                        </div>
                                        <button className="w-full p-4 text-[10px] font-black text-slate-400 border-t border-slate-50 hover:bg-slate-50 transition-colors uppercase tracking-[0.2em] italic">Marcar todo como leído</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            {activeTab === 'dashboard' && <DashboardView onNewOrder={() => setIsNewOrderOpen(true)} onBulkSchedule={() => setIsBulkScheduleOpen(true)} />}
                            {activeTab === 'map' && <MapView />}
                            {activeTab === 'services' && <ServicesView />}
                            {activeTab === 'drivers' && <DriversView onSelectHistory={(name: string) => setSelectedDriverHistory(name)} />}
                            {activeTab === 'metrics' && <MetricsView />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-4 w-full rounded-2xl transition-all duration-300 font-bold uppercase text-[10px] tracking-[0.2em] relative ${active ? 'bg-white text-[#1e3a5f] shadow-xl' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
        >
            {React.cloneElement(icon, { size: 18, color: active ? COLORS.navy : 'currentColor' })}
            {label}
            {active && (
                <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-0 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] -z-10"
                />
            )}
        </button>
    );
}

function DashboardView({ onNewOrder, onBulkSchedule }: { onNewOrder: () => void, onBulkSchedule: () => void }) {
    return (
        <div className="space-y-10">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-5xl font-bold tracking-tight text-slate-900 leading-tight">Panel de <span className="text-orange-500">Gestión.</span></h2>
                    <p className="text-slate-500 font-medium text-lg mt-1">Control integral de flota y servicios en tiempo real.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={onBulkSchedule}
                        className="bg-white border border-slate-200 text-slate-700 px-6 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                    >
                        <Calendar size={18} /> Programar Masivo
                    </button>
                    <button
                        onClick={onNewOrder}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-xl shadow-orange-500/20 active:scale-95"
                    >
                        <Plus size={20} className="stroke-[3]" /> Registrar Nueva Carga
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <StatCard label="En Ruta Ahora" value="14" icon={<Truck />} color="#3b82f6" trend="+2" />
                <StatCard label="Por Iniciar" value="06" icon={<Package />} color="#f59e0b" trend="3 Hoy" />
                <StatCard label="Conductores" value="09" icon={<Users />} color="#10b981" trend="Activos" />
                <StatCard label="Ventas Hoy" value="$640k" icon={<ArrowUpRight />} color="#8b5cf6" trend="+22%" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="xl:col-span-2 p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-2xl font-bold tracking-tight text-slate-800">Últimos Servicios <span className="text-slate-400 text-sm font-medium ml-2">(24h)</span></h3>
                        <button className="text-sm font-bold text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline">Auditar Todo</button>
                    </div>
                    <div className="space-y-6">
                        <OrderRow id="AG-7281" client="Transportes Lynch" start="Providencia" end="Maipú" status="En Tránsito" />
                        <OrderRow id="AG-7280" client="BioCrom Lab" start="Pudahuel" end="Vitacura" status="Confirmado" />
                        <OrderRow id="AG-7279" client="Carlos Muñoz" start="Ñuñoa" end="La Reina" status="Entregado" />
                        <OrderRow id="AG-7278" client="Inmobiliaria Norte" start="Santiago" end="Colina" status="Entregado" />
                    </div>
                </div>

                {/* Performance Chart / List */}
                <div className="p-10 rounded-[2.5rem] bg-[#1e3a5f] text-white shadow-xl shadow-blue-900/10">
                    <h3 className="text-2xl font-bold tracking-tight mb-8 flex items-center gap-3">
                        <Activity className="text-orange-500" /> Rendimiento
                    </h3>
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/50 mb-3">
                                <span>Capacidad Utilizada</span>
                                <span>88%</span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '88%' }}
                                    className="h-full bg-orange-500"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                            <div>
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Horas en Ruta</p>
                                <p className="text-3xl font-bold mt-1">124h</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">KMs Totales</p>
                                <p className="text-3xl font-bold mt-1">1.8k</p>
                            </div>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                            <p className="text-[10px] font-bold text-orange-400 uppercase tracking-[0.2em] mb-4">Nota del Sistema</p>
                            <p className="text-sm text-blue-100/70 leading-relaxed font-medium">Mayor demanda detectada en sector Oriente para las próximas 2 horas. Sugerencia: Reubicar 2 unidades.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ServicesView() {
    return (
        <div className="space-y-8 h-full">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight text-slate-900">Servicios <span className="text-orange-500">Activos.</span></h2>
                    <p className="text-slate-500 font-medium">Torre de control de todos los trayectos en curso.</p>
                </div>
                <div className="flex bg-white p-1 rounded-2xl border border-slate-100">
                    <button className="px-6 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg">Lista</button>
                    <button className="px-6 py-2 rounded-xl text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600">Galería</button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-50">
                            <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">ID / Cliente</th>
                            <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Trayecto</th>
                            <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Operador</th>
                            <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Estado</th>
                            <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Progreso</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        <ServiceItemRow id="AG-7281" client="Transportes Lynch" start="Quilicura" end="Maipú" driver="Daniel Gonzalez" status="Cargando" progress={15} />
                        <ServiceItemRow id="AG-7280" client="BioCrom Lab" start="Pudahuel" end="Vitacura" driver="Pedro Allende" status="En Ruta" progress={65} />
                        <ServiceItemRow id="AG-7279" client="Carlos Muñoz" start="Ñuñoa" end="La Reina" driver="Jorge Paredes" status="Descargando" progress={90} />
                        <ServiceItemRow id="AG-7278" client="Inmobiliaria Norte" start="Santiago" end="Colina" driver="Mario Rivas" status="En Ruta" progress={40} />
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ServiceItemRow({ id, client, start, end, driver, status, progress }: any) {
    return (
        <tr className="hover:bg-slate-50 transition-colors cursor-pointer group">
            <td className="p-8">
                <p className="text-xs font-black text-slate-400 italic mb-1">{id}</p>
                <p className="font-bold text-slate-800">{client}</p>
            </td>
            <td className="p-8">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-700">{start}</span>
                    <ArrowUpRight size={14} className="rotate-90 text-orange-500" />
                    <span className="text-sm font-bold text-slate-700">{end}</span>
                </div>
            </td>
            <td className="p-8">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-600 uppercase italic border border-slate-200">{driver.split(' ')[0][0]}{driver.split(' ')[1][0]}</div>
                    <span className="text-sm font-bold text-slate-700">{driver}</span>
                </div>
            </td>
            <td className="p-8">
                <div className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${status === 'En Ruta' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                    {status}
                </div>
            </td>
            <td className="p-8 overflow-hidden">
                <div className="w-32">
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-orange-500" />
                    </div>
                </div>
            </td>
        </tr>
    );
}

function DriversView({ onSelectHistory }: { onSelectHistory: (name: string) => void }) {
    return (
        <div className="space-y-8 h-full">
            <div>
                <h2 className="text-4xl font-bold tracking-tight text-slate-900">Flota de <span className="text-orange-500">Conductores.</span></h2>
                <p className="text-slate-500 font-medium text-lg mt-1">Gestión de capital humano y activos rodantes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-10">
                <DriverCard name="Daniel Gonzalez" car="Chevrolet NPR 2024" plate="GZ-HJ-34" status="online" trips={142} rating={4.9} onSelectHistory={onSelectHistory} />
                <DriverCard name="Pedro Allende" car="Ford F-150" plate="LL-KK-90" status="online" trips={89} rating={4.8} onSelectHistory={onSelectHistory} />
                <DriverCard name="Jorge Paredes" car="Mercedes-Benz Sprinter" plate="TR-RE-11" status="offline" trips={210} rating={5.0} onSelectHistory={onSelectHistory} />
                <DriverCard name="Mario Rivas" car="Hyundai H-100" plate="CC-XX-22" status="online" trips={56} rating={4.5} onSelectHistory={onSelectHistory} />
                <DriverCard name="Sandro M." car="NPR 2024 Turbo" plate="MM-NN-33" status="break" trips={112} rating={4.7} onSelectHistory={onSelectHistory} />
            </div>
        </div>
    );
}

function DriverCard({ name, car, plate, status, trips, rating, onSelectHistory }: any) {
    const statusColors = {
        online: 'bg-green-500',
        offline: 'bg-slate-400',
        break: 'bg-orange-500'
    };

    return (
        <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 rounded-full -mr-16 -mt-16 group-hover:bg-orange-50 transition-colors" />

            <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center font-bold text-xl text-slate-800 uppercase italic border-2 border-slate-50">{name.split(' ')[0][0]}{name.split(' ')[1][0]}</div>
                <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 ${status === 'online' ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-500'}`}>
                    <span className={`w-2 h-2 rounded-full ${statusColors[status as keyof typeof statusColors] || 'bg-slate-400'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{status}</span>
                </div>
            </div>

            <h4 className="text-xl font-bold text-slate-900 mb-1">{name}</h4>
            <p className="text-sm text-slate-500 font-medium mb-8 italic">{car} • <span className="font-bold uppercase text-orange-500">{plate}</span></p>

            <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-50">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Viajes</p>
                    <p className="text-lg font-bold text-slate-800">{trips}</p>
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Calificación</p>
                    <div className="flex items-center gap-1.5">
                        <p className="text-lg font-bold text-slate-800">{rating}</p>
                        <span className="text-orange-500 text-sm">★</span>
                    </div>
                </div>
            </div>

            <button
                onClick={() => onSelectHistory(name)}
                className="w-full mt-8 py-4 rounded-2xl bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-[#1e3a5f] hover:text-white transition-all active:scale-95"
            >
                Ver Historial Completo
            </button>
        </div>
    );
}

function HistoryRow({ date, id, route, client, status }: any) {
    return (
        <div className="p-6 rounded-2xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all flex items-center justify-between group">
            <div className="flex items-center gap-6">
                <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none">{date.split(',')[0]}</p>
                    <p className="text-xs font-bold text-slate-700 mt-1">{date.split(',')[1]}</p>
                </div>
                <div className="w-px h-8 bg-slate-100" />
                <div>
                    <p className="text-xs font-bold text-slate-800 mb-0.5">{route}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 italic">{id}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{client}</span>
                    </div>
                </div>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${status === 'Completado' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {status}
            </span>
        </div>
    );
}

function NotificationItem({ title, time, desc, type }: any) {
    const icons = {
        success: <CheckCircle2 className="text-green-500" size={16} />,
        warning: <AlertTriangle className="text-orange-500" size={16} />,
        info: <Activity className="text-blue-500" size={16} />,
    };

    return (
        <div className="p-5 border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                    {icons[type as keyof typeof icons]}
                    <h5 className="text-xs font-bold text-slate-800">{title}</h5>
                </div>
                <span className="text-[10px] font-bold text-slate-400 italic">{time}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium pl-6">{desc}</p>
        </div>
    );
}

function MetricsView() {
    return (
        <div className="space-y-10">
            <div>
                <h2 className="text-4xl font-bold tracking-tight text-slate-900">Inteligencia de <span className="text-orange-500">Negocio.</span></h2>
                <p className="text-slate-500 font-medium text-lg mt-1">Análisis predictivo y auditoría de rendimiento.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                <MetricModule title="Volumen Semanal" desc="Métrica de Kg/m³ transportados por día." />
                <MetricModule title="Consumo de Combustible" desc="Auditoría de eficiencia por unidad (km/l)." />
                <MetricModule title="Satisfacción del Cliente" desc="NPS basado en firmas de entrega." />
                <MetricModule title="Rutas Optimizadas" desc="Reducción de huella de carbono vía IA." />
            </div>
        </div>
    );
}

function MetricModule({ title, desc }: any) {
    return (
        <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-slate-100 group-hover:bg-orange-500 transition-colors" />
            <h4 className="text-2xl font-bold text-slate-800 mb-2">{title}</h4>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">{desc}</p>

            {/* Visualización de Gráfico Mockup */}
            <div className="h-40 w-full flex items-end gap-2 px-4">
                {[40, 65, 45, 90, 55, 80, 70].map((h, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.1, duration: 0.8 }}
                        className="flex-1 bg-slate-100 rounded-lg group-hover:bg-orange-100 transition-colors relative"
                    >
                        {i === 3 && <div className="absolute inset-0 bg-orange-500 rounded-lg shadow-lg shadow-orange-500/20" />}
                    </motion.div>
                ))}
            </div>
            <div className="flex justify-between mt-4 px-2">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => <span key={d} className="text-[10px] font-black text-slate-300 uppercase">{d}</span>)}
            </div>
        </div>
    );
}

function MapView() {
    return (
        <div className="h-full w-full rounded-[3rem] overflow-hidden bg-white border border-slate-100 shadow-xl relative animate-in fade-in zoom-in-95 duration-700">
            {/* Mapa Real (Leaflet) */}
            <AcargooMap
                center={[-33.4357, -70.7811]}
                zoom={12}
                markers={[
                    { id: '1', position: [-33.4357, -70.7811], label: 'Daniel G. (Pudahuel)' },
                    { id: '2', position: [-33.3854, -70.5786], label: 'Pedro A. (Vitacura)' },
                    { id: '3', position: [-33.4489, -70.6693], label: 'Jorge P. (Centro)' },
                ]}
            />

            {/* Overlay de Control (Movido para no tapar) */}
            <div className="absolute overflow-hidden bottom-8 right-8 z-20 text-right bg-white/90 backdrop-blur-md px-6 py-4 rounded-3xl border border-slate-200 shadow-2xl">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
                <h4 className="text-sm font-black tracking-tight text-slate-800 uppercase italic leading-none">Control <span className="text-orange-500">Realtime v1.2</span></h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 flex items-center justify-end gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Sincronización Activa
                </p>
            </div>

            {/* Panel Flotante de Mapa */}
            <div className="absolute top-10 left-10 w-80 space-y-4">
                <div className="bg-[#1e3a5f]/95 backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl border border-white/10">
                    <h5 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-8 border-b border-white/10 pb-4">
                        Unidades Online <span className="text-orange-500 ml-2">(08)</span>
                    </h5>
                    <div className="space-y-6">
                        <DriverMiniStatus name="Juan P." car="Ford F-150" status="moving" />
                        <DriverMiniStatus name="Sandro M." car="NPR 2024" status="idle" />
                        <DriverMiniStatus name="Alex T." car="Master XL" status="moving" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color, trend }: any) {
    return (
        <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default">
            <div className="flex justify-between items-start mb-6">
                <div className="p-4 rounded-2xl transition-colors" style={{ backgroundColor: `${color}10`, color: color }}>
                    {React.cloneElement(icon, { size: 28, className: 'stroke-[2.5]' })}
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Variación</span>
                    <span className="text-xs font-bold text-green-500">{trend}</span>
                </div>
            </div>
            <div>
                <p className="text-[11px] font-bold uppercase text-slate-400 tracking-[0.2em] mb-2">{label}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-5xl font-bold tracking-tighter text-slate-800">{value}</h3>
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                </div>
            </div>
        </div>
    );
}

function OrderRow({ id, client, start, end, status }: any) {
    const isCompleted = status === 'Entregado';
    return (
        <div className="flex items-center justify-between p-6 rounded-3xl border border-slate-50 hover:border-slate-200 hover:shadow-md transition-all group bg-slate-50/30">
            <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs shadow-sm">
                    {id.split('-')[1]}
                </div>
                <div>
                    <h4 className="text-lg font-bold text-slate-800">{client}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
                        <span className="text-slate-400 font-medium">De:</span> {start}
                        <ChevronRight size={14} className="text-orange-500 mx-1" />
                        <span className="text-slate-400 font-medium">A:</span> {end}
                    </div>
                </div>
            </div>
            <div className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {status}
            </div>
        </div>
    );
}

function DriverMiniStatus({ name, car, status }: any) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center font-bold text-xs text-white">
                    {name[0]}
                </div>
                <div>
                    <p className="text-xs font-bold text-white">{name} <span className="text-white/30 font-medium">- {car}</span></p>
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${status === 'moving' ? 'bg-orange-500 animate-pulse' : 'bg-blue-400 opacity-50'}`} />
                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{status === 'moving' ? 'En Movimiento' : 'Detenido / Libre'}</span>
                    </div>
                </div>
            </div>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-white/40 hover:text-orange-500">
                <NavIcon size={14} />
            </button>
        </div>
    );
}
