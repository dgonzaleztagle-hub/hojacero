import React from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';

interface RadarScannerProps {
    query: string;
    setQuery: (q: string) => void;
    location: string;
    setLocation: (l: string) => void;
    isScanning: boolean;
    handleScan: () => void;
    error: string;
}

export function RadarScanner({ query, setQuery, location, setLocation, isScanning, handleScan, error }: RadarScannerProps) {
    return (
        <>
            <div className="bg-black border border-white/10 p-1 rounded-2xl flex flex-col md:flex-row shadow-xl">
                <div className="flex-1 border-b md:border-b-0 md:border-r border-white/10 relative group">
                    <div className="absolute top-3 left-4 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Rubro / Nicho</div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ej: Dentistas, Gimnasios, Restaurantes..."
                        className="w-full bg-transparent p-4 pb-2 pt-8 text-white focus:outline-none placeholder:text-zinc-700 h-16"
                        onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                    />
                </div>
                <div className="w-full md:w-1/3 relative group">
                    <div className="absolute top-3 left-4 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Zona</div>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Ej: Las Condes, Providencia"
                        className="w-full bg-transparent p-4 pb-2 pt-8 text-white focus:outline-none placeholder:text-zinc-700 h-16"
                    />
                </div>
                <button
                    onClick={handleScan}
                    disabled={isScanning || !query}
                    className={`px-8 rounded-xl font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2 transition-all m-1
                        ${isScanning ? 'bg-zinc-900 text-zinc-500 cursor-wait' : 'bg-white text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]'}
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
        </>
    );
}
