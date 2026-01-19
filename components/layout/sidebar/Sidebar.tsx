'use client';

import Link from 'next/link';
import { Home, BarChart2, Users, Settings, LogOut, ChevronRight, Activity, Mail, FileText, Database, Lock, Cpu, Target, KanbanSquare, HelpCircle, LayoutDashboard } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useDashboard } from '@/app/dashboard/DashboardContext';

import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';

export default function Sidebar() {
    const pathname = usePathname();
    const { theme, isSidebarOpen, closeSidebar } = useDashboard();
    const [unreadCount, setUnreadCount] = useState(0);
    const supabase = createClient();

    useEffect(() => {
        const fetchUnread = async () => {
            const { count } = await supabase.from('email_inbox').select('*', { count: 'exact', head: true }).eq('is_read', false);
            setUnreadCount(count || 0);
        };

        fetchUnread();

        const channel = supabase.channel('sidebar-badges')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'email_inbox' }, fetchUnread)
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const menuItems: { label: string; href: string; icon: any; isBeta?: boolean; badge?: number }[] = [
        { label: 'DASHBOARD', href: '/dashboard', icon: LayoutDashboard }, // Main Overview
        { label: 'MÉTRICAS', href: '/dashboard/metrics', icon: Activity }, // Replaces Pulse
        { label: 'INBOX', href: '/dashboard/inbox', icon: Mail, badge: unreadCount },
        { label: 'VAULT', href: '/dashboard/vault', icon: Lock },
        { label: 'RADAR', href: '/dashboard/radar', icon: Target },
        { label: 'AYUDA', href: '/dashboard/ayuda', icon: HelpCircle },
    ];

    // Theme-aware colors
    const isDark = theme === 'dark';

    return (
        <>
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar Drawer */}
            <aside className={`
                w-64 h-screen border-r flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 transform
                ${isDark ? 'bg-black border-white/10' : 'bg-white border-gray-200'}
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
            `}>
                {/* ... Header ... */}
                <div className={`h-20 flex items-center px-6 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                    <span className={`font-['Syncopate'] font-bold tracking-widest text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        HOJA CERO_
                    </span>
                    <button onClick={closeSidebar} className="md:hidden ml-auto text-gray-500">
                        <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-8 px-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = item.href === '/dashboard'
                            ? pathname === '/dashboard'
                            : pathname.startsWith(item.href);
                        const badge = 'badge' in item ? item.badge : null;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeSidebar} // Close on nav
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group
                                    ${isActive
                                        ? isDark
                                            ? 'bg-white/10 text-cyan-400 border border-cyan-400/20'
                                            : 'bg-blue-50 text-blue-600 border border-blue-200'
                                        : isDark
                                            ? 'text-zinc-400 hover:text-white hover:bg-white/5'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive
                                    ? isDark ? 'text-cyan-400' : 'text-blue-600'
                                    : isDark ? 'text-zinc-500 group-hover:text-white' : 'text-gray-400 group-hover:text-gray-700'
                                    }`} />
                                <span className="tracking-wide flex-1">{item.label}</span>
                                {item.isBeta && (
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-blue-100 text-blue-600'}`}>
                                        Beta
                                    </span>
                                )}
                                {badge && badge > 0 && (
                                    <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                        {badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
                {/* ... Footer ... */}

                {/* User Footer (Static) */}
                <div className={`p-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3 px-2 p-2 select-none">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold ${isDark ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-500' : 'bg-blue-100 border-blue-300 text-blue-600'
                            }`}>
                            DG
                        </div>
                        <div className="flex-1">
                            <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Daniel & Gaston
                            </p>
                            <p className={`text-[10px] uppercase tracking-wider flex items-center gap-1 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? 'bg-cyan-500' : 'bg-blue-500'}`}></span>
                                SUPER ADMIN
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

