'use client';

import Link from 'next/link';
import { Home, BarChart2, Users, Settings, LogOut, ChevronRight, Activity, Mail, FileText, Database, Lock, Cpu, Target, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useDashboard } from '@/app/dashboard/DashboardContext';

export default function Sidebar() {
    const pathname = usePathname();
    const { currentClient, switchClient, clients, userRole, toggleUserRole } = useDashboard();

    const menuItems = [
        { label: 'PULSO', href: '/dashboard/pulse', icon: Activity },
        { label: 'INBOX', href: '/dashboard/inbox', icon: Mail },
        { label: userRole === 'ADMIN' ? 'ARQUITECTO' : 'SOLICITUDES', href: '/dashboard/architect', icon: Cpu }, // Dynamic Label
        { label: 'CMS', href: '/dashboard/cms', icon: Database },
        { label: 'VAULT', href: '/dashboard/vault', icon: Lock },
        ...(userRole === 'ADMIN' ? [{ label: 'RADAR', href: '/dashboard/radar', icon: Target, isBeta: true }] : []), // Admin Only
    ];

    return (
        <aside className="w-64 h-screen bg-black border-r border-white/10 flex flex-col fixed left-0 top-0 z-50">
            {/* ... Header ... */}
            <div className="h-20 flex flex-col justify-center px-6 border-b border-white/10">
                {/* ... Client Switcher ... */}
                <span className="font-['Syncopate'] font-bold text-white tracking-widest text-xs mb-2 opacity-50">
                    HOJA CERO_
                </span>
                <div className="relative group">
                    <select
                        value={currentClient.id}
                        onChange={(e) => switchClient(e.target.value)}
                        className="w-full bg-transparent text-cyan-400 font-bold text-sm appearance-none cursor-pointer focus:outline-none uppercase tracking-wide"
                    >
                        {clients.map(client => (
                            <option key={client.id} value={client.id} className="bg-black text-white">
                                {client.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-cyan-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                                    ? 'bg-white/10 text-cyan-400 border border-cyan-400/20'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-white'}`} />
                            <span className="tracking-wide">{displayName}</span>
                        </Link>
                    );
                })}
            </nav>
            {/* ... Footer ... */}

            {/* User Footer (Mock) */}
            <div className="p-4 border-t border-white/10">
                <div
                    className="flex items-center gap-3 px-2 cursor-pointer hover:bg-white/5 rounded-lg p-2 transition-colors select-none"
                    onClick={toggleUserRole}
                    title="Click to toggle Role (Dev/Client)"
                >
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-colors ${userRole === 'ADMIN'
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-500'
                        : 'bg-neutral-700 border-white/20 text-white'
                        }`}>
                        {userRole === 'ADMIN' ? 'DG' : 'CL'}
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-white transition-all">
                            {userRole === 'ADMIN' ? 'Daniel & Gaston' : 'Cliente Visita'}
                        </p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                            {userRole === 'ADMIN' ? (
                                <><span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span> SUPER ADMIN</>
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
