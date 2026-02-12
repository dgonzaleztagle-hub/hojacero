'use client';

import { Cliente } from './types';
import { X, ExternalLink, Activity, DollarSign, CreditCard } from 'lucide-react';
import { getEstado } from './utils';
import CredentialsManager from './CredentialsManager';
import ClientChat from './ClientChat';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDashboard } from '@/app/dashboard/DashboardContext';

interface VaultDetailProps {
    cliente: Cliente | null;
    onClose: () => void;
}

export default function VaultDetail({ cliente, onClose }: VaultDetailProps) {
    // Only mount AnimatePresence content when cliente exists
    // The parent controls 'cliente' being null or an object

    // Calculate status only if client exists
    const { theme } = useDashboard();
    const isDark = theme === 'dark';
    const estado = cliente ? getEstado(cliente.ultimo_pago, cliente.dia_cobro, cliente.contract_start) : null;

    return (
        <AnimatePresence>
            {cliente && estado && (
                <>
                    {/* Mobile Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />

                    {/* Main Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={`
                            fixed inset-y-0 right-0 z-50 w-full md:w-[450px] shadow-2xl flex flex-col border-l
                            ${isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-gray-200'}
                            md:static md:transform-none md:h-[calc(100vh-100px)] md:z-0 md:rounded-2xl md:border md:shadow-none
                            ${isDark ? 'md:bg-neutral-900/50 md:backdrop-blur-xl' : 'md:bg-white'}
                        `}
                    >
                        {/* Header */}
                        <div className={`flex items-center justify-between p-6 border-b backdrop-blur-md sticky top-0 z-10 ${isDark ? 'border-white/5 bg-neutral-900/80' : 'border-gray-100 bg-white/80'}`}>
                            <div>
                                <h2 className={`text-xl font-bold truncate max-w-[250px] ${isDark ? 'text-white' : 'text-gray-900'}`}>{cliente.client_name}</h2>
                                <div className="flex items-center gap-2 text-xs mt-1">
                                    <span className={`px-2 py-0.5 rounded-full ${estado.color.replace('text-', 'text-').replace('bg-', 'bg-')}`}>
                                        {estado.estado}
                                    </span>
                                    <span className="text-zinc-500">•</span>
                                    <a href={`https://${cliente.site_url}`} target="_blank" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                        {cliente.site_url} <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-zinc-400 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-900'}`}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">

                            {/* KPI Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className={`p-3 rounded-xl border ${isDark ? 'bg-zinc-800/30 border-white/5' : 'bg-gray-100 border-gray-200'}`}>
                                    <span className="text-zinc-500 text-xs uppercase font-bold flex items-center gap-1 mb-1">
                                        <DollarSign className="w-3 h-3" /> Plan
                                    </span>
                                    <p className={`font-mono font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{cliente.plan_type}</p>
                                    <p className="text-zinc-400 text-xs">${(cliente.monto_mensual || 0).toLocaleString()}/mo</p>
                                </div>
                                <div className={`p-3 rounded-xl border ${isDark ? 'bg-zinc-800/30 border-white/5' : 'bg-gray-100 border-gray-200'}`}>
                                    <span className="text-zinc-500 text-xs uppercase font-bold flex items-center gap-1 mb-1">
                                        <Activity className="w-3 h-3" /> Estado
                                    </span>
                                    <p className={`font-medium ${cliente.is_active ? isDark ? 'text-green-400' : 'text-green-600' : isDark ? 'text-red-400' : 'text-red-600'}`}>
                                        {cliente.is_active ? 'Activo' : 'Suspendido'}
                                    </p>
                                    <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>Dia de cobro: {cliente.dia_cobro}</p>
                                </div>
                            </div>

                            {/* Implementación Badge if pending */}
                            {cliente.cuotas_pagadas < cliente.cuotas_implementacion && (
                                <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-4 rounded-xl border border-blue-500/20 flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-200 font-bold text-sm">Implementación en curso</p>
                                        <p className="text-blue-400/60 text-xs">Cuota {cliente.cuotas_pagadas} de {cliente.cuotas_implementacion}</p>
                                    </div>
                                    <div className="radial-progress text-blue-500 text-xs font-bold" style={{ "--value": (cliente.cuotas_pagadas / cliente.cuotas_implementacion) * 100 } as any}>
                                        {Math.round((cliente.cuotas_pagadas / cliente.cuotas_implementacion) * 100)}%
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button className={`flex-1 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                                    <CreditCard className="w-4 h-4" />
                                    Registrar Pago
                                </button>
                                <button className={`flex-1 font-medium py-3 rounded-lg transition-colors border ${isDark ? 'bg-zinc-800 text-white hover:bg-zinc-700 border-white/5' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'}`}>
                                    Mantención
                                </button>
                            </div>

                            <div className={`h-px my-4 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`} />

                            {/* Modules */}
                            <CredentialsManager cliente={cliente} />
                            <ClientChat cliente={cliente} />

                            <div className="h-20" /> {/* Bottom Spacer */}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
