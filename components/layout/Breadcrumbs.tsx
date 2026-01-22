'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
    const pathname = usePathname();
    if (pathname === '/dashboard') return null;

    const paths = pathname.split('/').filter(Boolean);

    if (paths.length === 0) return null;

    const labels: Record<string, string> = {
        dashboard: 'HQ',
        radar: 'Radar',
        pipeline: 'Pipeline',
        growth: 'Growth',
        vault: 'Vault',
        academy: 'Academy',
        inbox: 'Inbox',
        metrics: 'Métricas',
        ayuda: 'Ayuda'
    };

    return (
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6 overflow-x-auto whitespace-nowrap hide-scrollbar">
            <Link href="/dashboard" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 group">
                <Home className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </Link>

            {paths.slice(1).map((path, index) => {
                const href = `/${paths.slice(0, index + 2).join('/')}`;
                const isLast = index === paths.length - 2;
                const label = labels[path] || path;

                return (
                    <React.Fragment key={path}>
                        <ChevronRight className="w-3 h-3 text-zinc-800 shrink-0" />
                        {isLast ? (
                            <span className="text-white border-b border-cyan-500/50 pb-0.5">{label}</span>
                        ) : (
                            <Link href={href} className="hover:text-cyan-400 transition-colors">
                                {label}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
}
