'use client';

import Link from 'next/link';
import { Home, BarChart2, Users, Settings, LogOut, ChevronRight, Activity, Mail, FileText, Database, Lock, Cpu, Target, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useDashboard } from '@/app/dashboard/DashboardContext';

export default function Sidebar() {
    const pathname = usePathname();
    const { currentClient, switchClient, clients, userRole, toggleUserRole, theme } = useDashboard();

    const menuItems = [
        { label: 'PULSO', href: '/dashboard/pulse', icon: Activity },
        { label: 'INBOX', href: '/dashboard/inbox', icon: Mail },
        { label: userRole === 'ADMIN' ? 'ARQUITECTO' : 'SOLICITUDES', href: '/dashboard/architect', icon: Cpu }, // Dynamic Label
        { label: 'CMS', href: '/dashboard/cms', icon: Database },
        { label: 'VAULT', href: '/dashboard/vault', icon: Lock },
        ...(userRole === 'ADMIN' ? [{ label: 'RADAR', href: '/dashboard/radar', icon: Target, isBeta: true }] : []), // Admin Only
    ];

    // Theme-aware colors
    const isDark = theme === 'dark';

    return (
        <aside className={`w-64 h-screen border-r flex flex-col fixed left-0 top-0 z-50 transition-colors duration-300 ${isDark ? 'bg-black border-white/10' : 'bg-white border-gray-200'
            }`}>
            {/* ... Header ... */}
            <div className={`h-20 flex flex-col justify-center px-6 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                {/* ... Client Switcher ... */}
                <span className={`font-['Syncopate'] font-bold tracking-widest text-xs mb-2 ${isDark ? 'text-white opacity-50' : 'text-gray-500'}`}>
                    HOJA CERO_
                </span>
                <div className="relative group">
                    <select
                        value={currentClient.id}
                        onChange={(e) => switchClient(e.target.value)}
                        className={`w-full bg-transparent font-bold text-sm appearance-none cursor-pointer focus:outline-none uppercase tracking-wide ${isDark ? 'text-cyan-400' : 'text-blue-600'
                            }`}
                    >
                        {clients.map(client => (
                            <option key={client.id} value={client.id} className={isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}>
                                {client.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className={`w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-8 px-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    // Rename 'ARQUITECTO' to 'SOLICITUDES' for Clients
                    const displayName = (item.label === 'ARQUITECTO' && userRole === 'CLIENT') ? 'SOLICITUDES' : item.label;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
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
                            <span className="tracking-wide">{displayName}</span>
                        </Link>
                    );
                })}
            </nav>
            {/* ... Footer ... */}

            {/* User Footer (Mock) */}
            <div className={`p-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                <div
                    className={`flex items-center gap-3 px-2 cursor-pointer rounded-lg p-2 transition-colors select-none ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'
                        }`}
                    onClick={toggleUserRole}
                    title="Click to toggle Role (Dev/Client)"
                >
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-colors ${userRole === 'ADMIN'
                        ? isDark ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-500' : 'bg-blue-100 border-blue-300 text-blue-600'
                        : isDark ? 'bg-neutral-700 border-white/20 text-white' : 'bg-gray-200 border-gray-300 text-gray-700'
                        }`}>
                        {userRole === 'ADMIN' ? 'DG' : 'CL'}
                    </div>
                    <div className="flex-1">
                        <p className={`text-xs font-bold transition-all ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {userRole === 'ADMIN' ? 'Daniel & Gaston' : 'Cliente Visita'}
                        </p>
                        <p className={`text-[10px] uppercase tracking-wider flex items-center gap-1 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                            {userRole === 'ADMIN' ? (
                                <><span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? 'bg-cyan-500' : 'bg-blue-500'}`}></span> SUPER ADMIN</>
                            ) : (
                                'VISTA CLIENTE'
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

