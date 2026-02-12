import React from 'react';
import { Search, Loader2, AlertCircle, Zap } from 'lucide-react';
import { useDashboard } from '@/app/dashboard/DashboardContext';

interface RadarScannerProps {
    query: string;
    setQuery: (q: string) => void;
    location: string;
    setLocation: (l: string) => void;
    profileName: string;
    isScanning: boolean;
    isFlashMode: boolean;
    setIsFlashMode: (f: boolean) => void;
    handleScan: () => void;
    error: string;
}

export function RadarScanner({ query, setQuery, location, setLocation, profileName, isScanning, isFlashMode, setIsFlashMode, handleScan, error }: RadarScannerProps) {
    const { theme } = useDashboard();
    const isDark = theme === 'dark';

    return (
        <>
            <div className={`border p-1 rounded-2xl flex flex-col md:flex-row shadow-xl transition-all ${isDark ? 'bg-black border-white/10' : 'bg-white border-gray-200'}`}>
                <div className={`flex-1 border-b md:border-b-0 md:border-r relative group transition-colors ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                    <div className={`absolute top-3 left-4 text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>Rubro / Nicho</div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ej: Dentistas, Gimnasios, Restaurantes..."
                        className={`w-full bg-transparent p-4 pb-2 pt-8 focus:outline-none h-16 transition-colors ${isDark ? 'text-white placeholder:text-zinc-700' : 'text-gray-900 placeholder:text-gray-300'}`}
                        onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                    />
                </div>
                <div className={`w-full md:w-1/3 relative group border-r transition-colors ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                    <div className={`absolute top-3 left-4 text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>Zona</div>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Ej: Las Condes, Providencia"
                        className={`w-full bg-transparent p-4 pb-2 pt-8 focus:outline-none h-16 transition-colors ${isDark ? 'text-white placeholder:text-zinc-700' : 'text-gray-900 placeholder:text-gray-300'}`}
                        onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                    />
                </div>

                {/* User Badge */}
                <div className="hidden md:flex flex-col justify-center px-4 min-w-[100px]">
                    <span className={`text-[9px] uppercase font-bold tracking-wider mb-1 ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>Usuario</span>
                    <span className={`text-sm font-medium flex items-center gap-1 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                        <div className={`w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-cyan-500' : 'bg-cyan-600'}`} />
                        {profileName}
                    </span>
                </div>

                {/* Flash Mode Toggle */}
                <div className={`flex items-center px-4 md:border-l transition-colors ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                    <button
                        onClick={() => setIsFlashMode(!isFlashMode)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${isFlashMode ? (isDark ? 'bg-amber-500 text-black' : 'bg-amber-100 text-amber-700 border border-amber-200') : (isDark ? 'bg-zinc-900 text-zinc-500' : 'bg-gray-100 text-gray-500')} font-bold uppercase text-[10px] tracking-tight`}
                        title="Modo Flash: Escaneo rápido de 10 resultados"
                    >
                        <Zap className={`w-3 h-3 ${isFlashMode ? (isDark ? 'fill-black' : 'fill-amber-700') : ''}`} />
                        {isFlashMode ? 'FLASH PRO' : 'Flash?'}
                    </button>
                </div>

                <button
                    onClick={handleScan}
                    disabled={isScanning || !query}
                    className={`px-8 rounded-xl font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2 transition-all m-1 flex-shrink-0
                        ${isScanning
                            ? (isDark ? 'bg-zinc-900 text-zinc-500 cursor-wait' : 'bg-gray-100 text-gray-400 cursor-wait')
                            : (isDark ? 'bg-white text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]' : 'bg-black text-white hover:bg-indigo-600 shadow-lg')}
                    `}
                >
                    {isScanning ? <Loader2 className="animate-spin w-4 h-4" /> : <Search className="w-4 h-4" />}
                    {isScanning ? '...' : 'Escanear'}
                </button>
            </div>

            {error && (
                <div className={`p-4 rounded-xl text-sm flex items-center gap-2 border ${isDark ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-red-50 border-red-200 text-red-600'}`}>
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}
        </>
    );
}
