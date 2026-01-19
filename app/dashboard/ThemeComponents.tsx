'use client';

import { useDashboard } from './DashboardContext';
import { Sun, Moon } from 'lucide-react';

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const { theme, toggleTheme } = useDashboard();

    return (
        <div className={`min-h-screen flex dashboard-container transition-colors duration-300 ${theme === 'dark'
            ? 'bg-neutral-950 text-white'
            : 'bg-gray-100 text-gray-900'
            }`}>
            {/* Theme Toggle Button - Fixed position */}
            <button
                onClick={toggleTheme}
                className={`fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all hover:scale-110 ${theme === 'dark'
                    ? 'bg-zinc-800 text-yellow-400 hover:bg-zinc-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {children}
        </div>
    );
}

import MobileHeader from '@/components/layout/sidebar/MobileHeader';

export function MainContent({ children }: { children: React.ReactNode }) {
    const { theme } = useDashboard();

    return (
        <main className={`flex-1 md:ml-64 transition-colors duration-300 flex flex-col ${theme === 'dark' ? 'bg-neutral-950' : 'bg-gray-100'
            }`}>
            <MobileHeader />
            <div className="w-full h-full p-4">
                {children}
            </div>
        </main>
    );
}
