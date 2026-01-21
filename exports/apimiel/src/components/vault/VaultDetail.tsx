'use client';

import { Cliente } from './types';
import { X, ExternalLink, Activity, DollarSign, CreditCard } from 'lucide-react';
import { getEstado } from './utils';
import CredentialsManager from './CredentialsManager';
import ClientChat from './ClientChat';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface VaultDetailProps {
    cliente: Cliente | null;
    onClose: () => void;
}

export default function VaultDetail({ cliente, onClose }: VaultDetailProps) {
    // Only mount AnimatePresence content when cliente exists
    // The parent controls 'cliente' being null or an object

    // Calculate status only if client exists
    const estado = cliente ? getEstado(cliente.ultimo_pago, cliente.dia_cobro) : null;

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
                            fixed inset-y-0 right-0 z-50 w-full md:w-[450px] bg-neutral-900 border-l border-white/10 shadow-2xl flex flex-col
                            md:static md:transform-none md:h-[calc(100vh-100px)] md:z-0 md:rounded-2xl md:bg-neutral-900/50 md:backdrop-blur-xl md:border md:shadow-none
                        `}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-neutral-900/80 backdrop-blur-md sticky top-0 z-10">
                            <div>
                                <h2 className="text-xl font-bold text-white truncate max-w-[250px]">{cliente.client_name}</h2>
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
                                className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">

                            {/* KPI Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-zinc-800/30 p-3 rounded-xl border border-white/5">
                                    <span className="text-zinc-500 text-xs uppercase font-bold flex items-center gap-1 mb-1">
                                        <DollarSign className="w-3 h-3" /> Plan
                                    </span>
                                    <p className="text-white font-mono font-medium">{cliente.plan_type}</p>
                                    <p className="text-zinc-400 text-xs">${(cliente.monto_mensual || 0).toLocaleString()}/mo</p>
                                </div>
                                <div className="bg-zinc-800/30 p-3 rounded-xl border border-white/5">
                                    <span className="text-zinc-500 text-xs uppercase font-bold flex items-center gap-1 mb-1">
                                        <Activity className="w-3 h-3" /> Estado
                                    </span>
                                    <p className={cliente.is_active ? 'text-green-400' : 'text-red-400'}>
                                        {cliente.is_active ? 'Activo' : 'Suspendido'}
                                    </p>
                                    <p className="text-zinc-400 text-xs">Dia de cobro: {cliente.dia_cobro}</p>
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
                                <button className="flex-1 bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                    <CreditCard className="w-4 h-4" />
                                    Registrar Pago
                                </button>
                                <button className="flex-1 bg-zinc-800 text-white font-medium py-3 rounded-lg hover:bg-zinc-700 transition-colors border border-white/5">
                                    Mantención
                                </button>
                            </div>

                            <div className="h-px bg-white/5 my-4" />

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
