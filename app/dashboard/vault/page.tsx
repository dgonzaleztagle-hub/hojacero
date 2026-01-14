'use client';

import { FileText, Image as ImageIcon, Box, Download, MoreVertical, FileCode, Shield } from 'lucide-react';
import { useDashboard } from '../DashboardContext';

// Mock Assets Data
const MOCK_ASSETS = [
    { id: 1, name: 'Brand_Guidelines_v2.pdf', type: 'PDF', size: '4.2 MB', category: 'BRANDING', date: '12 Ene, 2024' },
    { id: 2, name: 'Logo_Pack_Final.zip', type: 'ZIP', size: '15.8 MB', category: 'ASSETS', date: '10 Ene, 2024' },
    { id: 3, name: 'Home_Wireframes.fig', type: 'FIGMA', size: '2.1 MB', category: 'DESIGN', date: '08 Ene, 2024' },
    { id: 4, name: 'SEO_Keyword_Research.xlsx', type: 'SHEET', size: '1.5 MB', category: 'MARKETING', date: 'Ayer' },
    { id: 5, name: 'Contrato_Servicios_Signed.pdf', type: 'PDF', size: '850 KB', category: 'LEGAL', date: '01 Ene, 2024' },
    { id: 6, name: 'Social_Media_Kit_Q1.zip', type: 'ZIP', size: '45.2 MB', category: 'MARKETING', date: 'Hoy' },
];

export default function VaultPage() {
    const { currentClient } = useDashboard();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-end justify-between border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-light text-white tracking-tight">Bóveda de Activos</h1>
                    <p className="text-zinc-500 mt-1">Recursos Seguros: <span className="text-cyan-400">{currentClient.name}</span></p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20">
                    <Shield className="w-3 h-3" />
                    ENCRIPTACIÓN AES-256
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard label="Archivos Totales" value="24" />
                <StatCard label="Espacio Usado" value="1.2 GB" />
                <StatCard label="Última Subida" value="Hoy, 10:42 AM" />
                <StatCard label="Accesos" value="Daniel, Gaston, Cliente" />
            </div>

            {/* File Grid */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Explorador de Archivos</h3>
                    <div className="flex gap-2">
                        <select className="bg-zinc-900 border border-white/10 text-xs text-white rounded px-3 py-1 focus:outline-none focus:border-cyan-500">
                            <option>Todos los Tipos</option>
                            <option>Documentos</option>
                            <option>Imágenes</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {MOCK_ASSETS.map((file) => (
                        <div key={file.id} className="group bg-zinc-900/50 border border-white/5 hover:border-cyan-500/30 rounded-xl p-4 transition-all hover:bg-zinc-900 flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${file.type === 'PDF' ? 'bg-red-500/10 text-red-400' :
                                    file.type === 'ZIP' ? 'bg-yellow-500/10 text-yellow-400' :
                                        file.type === 'FIGMA' ? 'bg-purple-500/10 text-purple-400' :
                                            file.type === 'SHEET' ? 'bg-green-500/10 text-green-400' :
                                                'bg-zinc-800 text-zinc-400'
                                }`}>
                                {file.type === 'PDF' && <FileText className="w-6 h-6" />}
                                {file.type === 'ZIP' && <Box className="w-6 h-6" />}
                                {file.type === 'FIGMA' && <ImageWrapper className="w-6 h-6" />}
                                {file.type === 'SHEET' && <FileCode className="w-6 h-6" />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-sm font-medium text-white truncate pr-2 group-hover:text-cyan-400 transition-colors">{file.name}</h4>
                                    <button className="text-zinc-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                                    <span className="font-mono">{file.size}</span>
                                    <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
                                    <span>{file.date}</span>
                                </p>
                                <div className="flex items-center gap-2 mt-3">
                                    <span className="text-[10px] bg-white/5 text-zinc-400 px-2 py-0.5 rounded border border-white/5">
                                        {file.category}
                                    </span>
                                </div>
                            </div>

                            <button className="self-end p-2 bg-white/5 hover:bg-cyan-500 hover:text-black text-zinc-400 rounded-lg transition-colors" title="Descargar">
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Helper Components
function StatCard({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-zinc-900/30 border border-white/5 p-4 rounded-xl">
            <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">{label}</p>
            <p className="text-lg font-mono text-white">{value}</p>
        </div>
    );
}

function ImageWrapper({ className }: { className?: string }) {
    return <ImageIcon className={className} />;
}
