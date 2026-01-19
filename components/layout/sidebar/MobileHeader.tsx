'use client';

import { Menu } from 'lucide-react';
import { useDashboard } from '@/app/dashboard/DashboardContext';

export default function MobileHeader() {
    const { theme, toggleSidebar } = useDashboard();
    const isDark = theme === 'dark';

    return (
        <header className={`md:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-40 transition-colors duration-300 ${isDark ? 'bg-neutral-950 border-white/10' : 'bg-gray-100 border-gray-200'
            }`}>
            <button
                onClick={toggleSidebar}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-200 text-gray-900'
                    }`}
            >
                <Menu className="w-6 h-6" />
            </button>

            <div className={`font-['Syncopate'] font-bold tracking-widest text-sm ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                HOJA CERO_
            </div>

            <div className="w-10" /> {/* Spacer for balance */}
        </header>
    );
}
