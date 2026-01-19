import React from 'react';

export function ScoreIndicator({ score }: { score: number }) {
    let colorClass = 'bg-zinc-700 text-zinc-400 border-zinc-600';
    if (score >= 80) colorClass = 'bg-green-500 text-black border-green-400 font-bold shadow-[0_0_10px_rgba(34,197,94,0.3)]';
    else if (score >= 50) colorClass = 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
    else if (score > 0) colorClass = 'bg-red-500/20 text-red-500 border-red-500/30';

    return (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs border ${colorClass} transition-all`}>
            {score}
        </div>
    );
}

export function TargetIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-500 animate-pulse">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="opacity-20" />
            <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" className="opacity-50" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
    );
}
