'use client';

import { useState } from 'react';
import { useDashboard } from '../DashboardContext';
import { Search, Loader2, Globe, MapPin, Star, AlertCircle, Save, Filter, ChevronRight, HelpCircle, Target } from 'lucide-react';

export default function RadarPage() {
    const { userRole } = useDashboard();
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('Santiago, Chile');
    const [isScanning, setIsScanning] = useState(false);
    const [leads, setLeads] = useState<any[]>([]);
    const [error, setError] = useState('');

    const handleSaveLead = async (lead: any) => {
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: lead.title,
                    direccion: lead.address,
                    sitio_web: lead.website,
                    telefono: lead.phone,
                    puntaje_oportunidad: lead.analysis.score,
                    razon_ia: lead.analysis.reason,
                    categoria: 'radar', // Default category
                    estado: 'nuevo',
                    fuente: 'radar',
                    zona_busqueda: location,
                })
            });
            const data = await res.json();
            if (data.success) {
                // Determine color based on score
                let color = 'text-green-400';
                if (lead.analysis.score < 50) color = 'text-red-400';
                else if (lead.analysis.score < 80) color = 'text-yellow-400';

                // Visual feedback (Primitive toast)
                alert(`✅ Lead Guardado: ${lead.title}`);
                // In a perfect world we use a real toast component here
            } else {
                alert(`⚠️ Error: ${data.error}`);
            }
        } catch (err) {
            alert('Error de conexión');
        }
    };

    const handleScan = async () => {
        if (!query) return;
        setIsScanning(true);
        setError('');
        setLeads([]);

        try {
            const res = await fetch('/api/radar/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, location })
            });
            const data = await res.json();

            if (data.success) {
                setLeads(data.leads);
            } else {
                setError(data.error || 'Error al escanear.');
            }
        } catch (err) {
            setError('Error de conexión.');
        } finally {
            setIsScanning(false);
        }
    };

    if (userRole !== 'ADMIN') {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                <div className="bg-red-500/10 p-6 rounded-full">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-2xl font-light text-white">Acceso Restringido</h2>
                <p className="text-zinc-500 max-w-md">El módulo RADAR es una herramienta de inteligencia comercial exclusiva para el equipo de HojaCero.</p>
            </div>
        );
    }

    return (
    const [selectedLead, setSelectedLead] = useState<any | null>(null);

    // ... (existing handlers)

    const openLeadDetails = (lead: any) => {
        setSelectedLead(lead);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-20">
            {/* ... (Header & Search Controls remain mostly same, just updating Results) ... */}

            {/* Header & Metrics */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                    {/* ... same header content ... */}
                    <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
                        <TargetIcon />
                        RADAR
                        <span className="text-xs bg-cyan-500/20 text-cyan-500 px-2 py-0.5 rounded border border-cyan-500/30">Admin Tool</span>
                    </h1>
                    <p className="text-zinc-500 mt-2 text-sm max-w-xl">
                        Inteligencia de Leads impulsada por Gemini Flash. Escanea el mercado, analiza competidores y detecta oportunidades de venta web.
                    </p>
                </div>
                {leads.length > 0 && (
                    <div className="flex gap-4 text-xs font-mono text-zinc-400">
                        {/* Metrics */}
                        <div className="bg-zinc-900 border border-white/10 px-3 py-1 rounded flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            {leads.filter(l => l.analysis?.score > 80).length} Oportunidades Altas
                        </div>
                        <div className="bg-zinc-900 border border-white/10 px-3 py-1 rounded flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            {leads.filter(l => !l.website).length} Sin Sitio Web
                        </div>
                    </div>
                )}
            </div>

            {/* SEARCH CONTROLS (Identical) */}
            <div className="bg-black border border-white/10 p-1 rounded-2xl flex flex-col md:flex-row shadow-[0_0_50px_-20px_rgba(0,0,0,0.5)]">
                <div className="flex-1 border-b md:border-b-0 md:border-r border-white/10 relative group">
                    <div className="absolute top-3 left-4 text-[10px] text-zinc-500 font-bold uppercase tracking-wider group-focus-within:text-cyan-500 transition-colors">Rubro / Nicho</div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ej: Odontólogos, Pizzerías..."
                        className="w-full bg-transparent p-4 pb-2 pt-8 text-white focus:outline-none placeholder:text-zinc-700 h-16"
                        onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                    />
                </div>
                <div className="w-full md:w-1/3 relative group">
                    <div className="absolute top-3 left-4 text-[10px] text-zinc-500 font-bold uppercase tracking-wider group-focus-within:text-cyan-500 transition-colors">Zona Geográfica</div>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Ej: Providencia"
                        className="w-full bg-transparent p-4 pb-2 pt-8 text-white focus:outline-none placeholder:text-zinc-700 h-16"
                    />
                </div>
                <button
                    onClick={handleScan}
                    disabled={isScanning || !query}
                    className={`px-8 rounded-xl font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2 transition-all m-1
                        ${isScanning
                            ? 'bg-zinc-900 text-zinc-500 cursor-wait'
                            : 'bg-white text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                        }
                    `}
                >
                    {isScanning ? <Loader2 className="animate-spin w-4 h-4" /> : <Search className="w-4 h-4" />}
                    {isScanning ? 'Escaneando...' : 'Escanear'}
                </button>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            {/* RESULTS LIST VIEW */}
            {leads.length > 0 && (
                <div className="space-y-2">
                    <div className="grid grid-cols-12 gap-4 px-6 text-[10px] uppercase tracking-wider font-bold text-zinc-500 pb-2 border-b border-white/5 select-none">
                        <div className="col-span-4">Negocio / Dirección</div>
                        <div className="col-span-2">Reputación</div>
                        <div className="col-span-3">Diagnóstico AI</div>
                        <div className="col-span-1 text-center">Score</div>
                        <div className="col-span-2 text-right">Acción</div>
                    </div>

                    {leads.map((lead, idx) => (
                        <div
                            key={idx}
                            onClick={() => openLeadDetails(lead)}
                            className="group grid grid-cols-12 gap-4 p-4 items-center bg-black border border-white/5 rounded-xl hover:border-cyan-500/30 hover:bg-white/[0.02] cursor-pointer transition-all animate-in slide-in-from-bottom-2 duration-300"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            {/* NAME & ADDRESS */}
                            <div className="col-span-4 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-white truncate text-sm group-hover:text-cyan-400 transition-colors">{lead.title}</h3>
                                    {lead.website ? (
                                        <div className="text-zinc-600" title={lead.website} onClick={(e) => e.stopPropagation()}>
                                            <a href={lead.website} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                                                <Globe className="w-3 h-3" />
                                            </a>
                                        </div>
                                    ) : (
                                        <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-500 text-[9px] font-bold border border-red-500/20">NO WEB</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 text-zinc-500 text-xs mt-0.5 truncate">
                                    <MapPin className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate">{lead.address}</span>
                                </div>
                            </div>

                            {/* RATING */}
                            <div className="col-span-2 flex items-center gap-2">
                                <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span className="font-bold text-xs">{lead.rating || 'N/A'}</span>
                                </div>
                                <span className="text-[10px] text-zinc-600">({lead.userRatingCount || 0})</span>
                            </div>

                            {/* AI ANALYSIS */}
                            <div className="col-span-3 min-w-0">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white text-xs font-medium">{lead.analysis?.opportunity || 'Pendiente'}</span>
                                        {lead.analysis?.vibe && (
                                            <span className="text-[10px] text-zinc-500 px-1.5 py-0.5 bg-zinc-900 rounded border border-white/10 truncate max-w-[100px]">
                                                {lead.analysis.vibe}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-zinc-400 truncate italic w-full">"{lead.analysis?.reason || '...'}"</p>
                                </div>
                            </div>

                            {/* SCORE */}
                            <div className="col-span-1 flex justify-center">
                                <ScoreIndicator score={lead.analysis?.score || 0} />
                            </div>

                            {/* ACTIONS */}
                            <div className="col-span-2 flex items-center justify-end gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleSaveLead(lead); }}
                                    className="p-2 rounded-lg bg-zinc-900 border border-white/10 hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/50 transition-all text-zinc-400 group-hover:bg-white/10"
                                    title="Guardar Lead"
                                >
                                    <Save className="w-4 h-4" />
                                </button>
                                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* NO RESULTS STATE */}
            {!isScanning && leads.length === 0 && !error && (
                <div className="flex flex-col items-center justify-center h-64 text-zinc-800 border-2 border-dashed border-zinc-900 rounded-3xl">
                    <Target className="w-16 h-16 mb-4 opacity-10" />
                    <p className="font-medium text-zinc-700">Radar en espera</p>
                    <p className="text-sm">Inicia un escaneo para mapear el terreno.</p>
                </div>
            )}

            {/* DETAIL MODAL */}
            {selectedLead && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl relative">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-start sticky top-0 bg-zinc-950 z-10">
                            <div>
                                <h2 className="text-2xl font-light text-white mb-1">{selectedLead.title}</h2>
                                <div className="flex items-center gap-2 text-sm text-zinc-400">
                                    <MapPin className="w-3 h-3" />
                                    {selectedLead.address}
                                </div>
                            </div>
                            <button onClick={() => setSelectedLead(null)} className="text-zinc-500 hover:text-white transition-colors">
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-8">

                            {/* AI Analysis Section */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-wider flex items-center gap-2">
                                    <Target className="w-4 h-4" /> Diagnóstico de Inteligencia (Gemini)
                                </h3>
                                <div className="bg-zinc-900/50 rounded-xl p-5 border border-white/5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <ScoreIndicator score={selectedLead.analysis?.score || 0} />
                                            <div>
                                                <div className="text-sm font-bold text-white uppercase">{selectedLead.analysis?.opportunity || 'N/A'}</div>
                                                <div className="text-xs text-zinc-500">Oportunidad Detectada</div>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300">
                                            Vibe: {selectedLead.analysis?.vibe || 'N/A'}
                                        </div>
                                    </div>

                                    <div className="h-px bg-white/5 w-full"></div>

                                    <div>
                                        <span className="text-xs text-zinc-500 block mb-1">Análisis Racional:</span>
                                        <p className="text-sm text-zinc-300 italic">"{selectedLead.analysis?.reason || 'Sin análisis disponible'}"</p>
                                    </div>

                                    {/* Actionable Insights (Mock based on Score) */}
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                            <span className="text-[10px] text-purple-500 font-bold uppercase block mb-1">Estrategia Marketing</span>
                                            <p className="text-xs text-zinc-400">
                                                {selectedLead.analysis?.score > 70
                                                    ? 'Cliente potencial para SEO y rebranding. Enfocar en ROI.'
                                                    : 'Posible necesidad de identidad visual básica.'}
                                            </p>
                                        </div>
                                        <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                            <span className="text-[10px] text-cyan-500 font-bold uppercase block mb-1">Estrategia Técnica</span>
                                            <p className="text-xs text-zinc-400">
                                                {selectedLead.website
                                                    ? 'Auditoría de performance y conversión web.'
                                                    : 'Venta de sitio web One-Page de alto rendimiento.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Contacto</h4>
                                    <div className="space-y-3 text-sm">
                                        {selectedLead.website ? (
                                            <a href={selectedLead.website} target="_blank" className="flex items-center gap-2 text-cyan-400 hover:underline">
                                                <Globe className="w-4 h-4" /> {selectedLead.website}
                                            </a>
                                        ) : (
                                            <div className="flex items-center gap-2 text-red-500">
                                                <AlertCircle className="w-4 h-4" /> Sin Sitio Web
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-zinc-400">
                                            <span className="lowercase">📞</span> {selectedLead.phoneNumber || 'No disponible'}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Horarios</h4>
                                    <div className="space-y-1 text-xs text-zinc-400">
                                        {(selectedLead.openingHours || []).map((h: string, i: number) => (
                                            <div key={i}>{h}</div>
                                        ))}
                                        {(!selectedLead.openingHours || selectedLead.openingHours.length === 0) && <p>No disponibles</p>}
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-white/10 bg-zinc-900/50 flex justify-end gap-3 sticky bottom-0">
                            <button
                                onClick={() => setSelectedLead(null)}
                                className="px-6 py-3 rounded-xl font-medium text-sm text-zinc-400 hover:bg-white/5 transition-colors"
                            >
                                Cerrar
                            </button>
                            <button
                                onClick={() => { handleSaveLead(selectedLead); setSelectedLead(null); }}
                                className="px-8 py-3 rounded-xl font-bold text-sm bg-white text-black hover:bg-cyan-400 transition-all shadow-lg hover:shadow-cyan-500/20 flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Guardar en Leads
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ... (ScoreIndicator and TargetIcon functions remain same)

function ScoreIndicator({ score }: { score: number }) {
    // Color logic
    let colorClass = 'bg-zinc-700 text-zinc-400 border-zinc-600'; // Default
    if (score >= 80) colorClass = 'bg-green-500 text-black border-green-400 font-bold shadow-[0_0_10px_rgba(34,197,94,0.3)]';
    else if (score >= 50) colorClass = 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
    else if (score < 50) colorClass = 'bg-red-500/20 text-red-500 border-red-500/30';

    return (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs border ${colorClass} transition-all`}>
            {score}
        </div>
    );
}

function TargetIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-500 animate-pulse">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="opacity-20" />
            <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" className="opacity-50" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
    )
}
