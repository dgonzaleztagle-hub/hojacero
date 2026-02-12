'use client';

import Link from 'next/link';
import { Home, BarChart2, Users, Settings, LogOut, ChevronRight, Activity, Mail, FileText, Database, Lock, Cpu, Target, KanbanSquare, HelpCircle, LayoutDashboard, Rocket, BookOpen, Calendar, Megaphone, Shield, Globe } from 'lucide-react';

// ... (lines 5-34)

import { usePathname } from 'next/navigation';
import { useDashboard } from '@/app/dashboard/DashboardContext';
import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';

export default function Sidebar() {
    const pathname = usePathname();
    const { theme, isSidebarOpen, closeSidebar } = useDashboard();
    const [unreadCount, setUnreadCount] = useState(0);
    const [agendaCount, setAgendaCount] = useState(0);
    const supabase = createClient();

    useEffect(() => {
        const fetchUnread = async () => {
            const { count } = await supabase.from('email_inbox').select('*', { count: 'exact', head: true }).eq('is_read', false);
            setUnreadCount(count || 0);
        };

        const fetchAgenda = async () => {
            // Reuniones de hoy pendientes
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const { count } = await supabase
                .from('agenda_events')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pending')
                .gte('start_time', today.toISOString())
                .lt('start_time', tomorrow.toISOString());

            setAgendaCount(count || 0);
        };

        fetchUnread();
        fetchAgenda();

        const channel = supabase.channel('sidebar-badges')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'email_inbox' }, fetchUnread)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'agenda_events' }, fetchAgenda)
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const menuItems: { label: string; href: string; icon: any; isBeta?: boolean; badge?: number; badgeColor?: string }[] = [
        { label: 'DASHBOARD', href: '/dashboard', icon: LayoutDashboard },
        { label: 'RADAR', href: '/dashboard/radar', icon: Target },
        { label: 'PIPELINE', href: '/dashboard/pipeline', icon: KanbanSquare },
        { label: 'AGENDA', href: '/dashboard/agenda', icon: Calendar, badge: agendaCount, badgeColor: 'cyan' },
        { label: 'GROWTH', href: '/dashboard/growth', icon: Rocket },
        { label: 'VAULT', href: '/dashboard/vault', icon: Lock },
        { label: 'FLOTA', href: '/dashboard/fleet', icon: Shield },
        { label: 'INBOX', href: '/dashboard/inbox', icon: Mail, badge: unreadCount },
        { label: 'ADS FACTORY', href: '/dashboard/ads-factory', icon: Megaphone },
        { label: 'TERRITORIAL', href: '/dashboard/territorial', icon: Globe },
        { label: 'AYUDA', href: '/dashboard/ayuda', icon: BookOpen },
        { label: 'ACADEMY', href: '/dashboard/academy', icon: Cpu },
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
                w-52 h-screen border-r flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 transform
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
                        const badgeColor = 'badgeColor' in item ? item.badgeColor : 'red';

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeSidebar} // Close on nav
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group
                                    ${isActive
                                        ? isDark
                                            ? 'bg-white/10 text-cyan-400 border border-cyan-400/20'
                                            : 'bg-blue-50 text-blue-600 border border-blue-200/50 shadow-sm'
                                        : isDark
                                            ? 'text-zinc-500 hover:text-white hover:bg-white/5'
                                            : 'text-zinc-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 transition-colors ${isActive
                                    ? isDark ? 'text-cyan-400' : 'text-blue-600'
                                    : isDark ? 'text-zinc-600 group-hover:text-white' : 'text-zinc-400 group-hover:text-gray-900'
                                    }`} />
                                <span className={`tracking-wide flex-1 transition-colors ${isActive
                                    ? isDark ? 'text-white' : 'text-blue-700 font-bold'
                                    : ''
                                    }`}>{item.label}</span>
                                {item.isBeta && (
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter ${isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-blue-100/50 text-blue-600 border border-blue-200/50'}`}>
                                        Beta
                                    </span>
                                )}
                                {badge && badge > 0 && (
                                    <span className={`text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-sm ${badgeColor === 'cyan' ? 'bg-cyan-500' : 'bg-red-500'
                                        }`}>
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
                    <div className="flex items-center gap-3 px-2 p-2 select-none cursor-pointer hover:opacity-80 transition-opacity" onClick={handleRegisterDevice}>
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

function handleRegisterDevice() {
    // Función simple para registrar dispositivo actual
    // En el futuro mover a DemoTracker.tsx como hook exportado si se complica
    if (!confirm('¿Registrar este dispositivo como EQUIPO (Daniel/Gastón)?\n\nEsto evitará que tus visitas a los demos generen notificaciones.')) return;

    const fingerprint = generateFingerprint();

    fetch('/api/tracking/team-device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fingerprint,
            owner: 'admin', // Por defecto admin
            device_name: navigator.platform
        })
    }).then(res => res.json()).then(data => {
        if (data.success) {
            alert('✅ Dispositivo registrado correctamente.\nTus visitas ya no contarán en las métricas.');
        } else {
            alert('❌ Error: ' + data.error);
        }
    });
}

function generateFingerprint(): string {
    const data = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        screen.colorDepth,
        new Date().getTimezoneOffset(),
        navigator.hardwareConcurrency || 'unknown',
        // @ts-ignore
        navigator.deviceMemory || 'unknown'
    ].join('|');

    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
}

