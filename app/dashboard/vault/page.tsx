'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { Search, Plus, AlertTriangle, ExternalLink, ChevronRight, Trash2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useSearchParams } from 'next/navigation';

// Tipos
interface Cliente {
    id: string;
    client_name: string;
    site_url: string;
    plan_type: string;
    monto_mensual: number;
    monto_implementacion: number;
    cuotas_implementacion: number;
    cuotas_pagadas: number;
    dia_cobro: number;
    contract_start: string;
    contract_end: string;
    email_contacto: string;
    is_active: boolean;
    ultimo_pago: string | null;
    total_pagado: number;
    alertas_count: number;
}

// Calcular estado del cliente
function getEstado(ultimoPago: string | null, diaCobro: number): { estado: string; color: string; prioridad: number; esCritico: boolean; diasVencido: number } {
    if (!ultimoPago) {
        return { estado: 'SIN PAGOS', color: 'text-red-400 bg-red-500/20', prioridad: 1, esCritico: true, diasVencido: 999 };
    }

    const hoy = new Date();
    const ultimoPagoDate = new Date(ultimoPago);
    const diasDesdePago = Math.floor((hoy.getTime() - ultimoPagoDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diasDesdePago > 60) return { estado: 'VENCIDO', color: 'text-red-400 bg-red-500/20', prioridad: 1, esCritico: true, diasVencido: diasDesdePago - 30 };
    if (diasDesdePago > 33) return { estado: 'CRÍTICO', color: 'text-red-400 bg-red-500/20', prioridad: 1, esCritico: true, diasVencido: diasDesdePago - 30 };
    if (diasDesdePago > 30) return { estado: 'ATRASADO', color: 'text-orange-400 bg-orange-500/20', prioridad: 2, esCritico: false, diasVencido: diasDesdePago - 30 };
    if (diasDesdePago >= 28) return { estado: 'VENCE HOY', color: 'text-yellow-400 bg-yellow-500/20', prioridad: 3, esCritico: false, diasVencido: 0 };
    if (diasDesdePago >= 21) return { estado: 'PRÓXIMO', color: 'text-gray-400 bg-gray-500/20', prioridad: 4, esCritico: false, diasVencido: diasDesdePago - 30 };
    return { estado: 'AL DÍA', color: 'text-green-400 bg-green-500/20', prioridad: 5, esCritico: false, diasVencido: diasDesdePago - 30 };
}

// Componente interno que usa useSearchParams (debe ir dentro de Suspense)
function VaultContent() {
    const supabase = createClient();
    const searchParams = useSearchParams();

    const [activeTab, setActiveTab] = useState<'activos' | 'criticos'>('activos');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);

    // Inicializar desde URL
    useEffect(() => {
        const tabParam = searchParams.get('tab');
        const searchParam = searchParams.get('search');

        if (tabParam === 'criticos') setActiveTab('criticos');
        if (searchParam) setSearchQuery(searchParam);
    }, [searchParams]);

    // Cargar clientes desde Supabase
    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        setLoading(true);

        const { data: sitesData, error } = await supabase
            .from('monitored_sites')
            .select(`
                id,
                client_name,
                site_url,
                plan_type,
                monto_mensual,
                monto_implementacion,
                cuotas_implementacion,
                cuotas_pagadas,
                dia_cobro,
                contract_start,
                contract_end,
                email_contacto,
                status,
                site_status (is_active)
            `)
            .eq('status', 'active')
            .order('client_name');

        if (error) {
            console.error('Error fetching clients:', error);
            setLoading(false);
            return;
        }

        console.log('Clientes encontrados:', sitesData?.length, sitesData);

        // Para cada cliente, obtener último pago, total pagado y alertas
        const clientesConDatos = await Promise.all(
            (sitesData || []).map(async (site) => {
                // Último pago
                const { data: pagoData } = await supabase
                    .from('pagos')
                    .select('fecha_pago')
                    .eq('site_id', site.id)
                    .eq('tipo', 'mantencion')
                    .order('fecha_pago', { ascending: false })
                    .limit(1);

                // Total pagado
                const { data: totalData } = await supabase
                    .from('pagos')
                    .select('monto')
                    .eq('site_id', site.id);

                // Alertas
                const { count: alertasCount } = await supabase
                    .from('alertas_enviadas')
                    .select('*', { count: 'exact', head: true })
                    .eq('site_id', site.id);

                return {
                    ...site,
                    is_active: site.site_status?.[0]?.is_active ?? true,
                    ultimo_pago: pagoData?.[0]?.fecha_pago || null,
                    total_pagado: totalData?.reduce((sum: number, p: { monto: number }) => sum + p.monto, 0) || 0,
                    alertas_count: alertasCount || 0,
                };
            })
        );

        setClientes(clientesConDatos);
        setLoading(false);
    };

    // Eliminar cliente
    const eliminarCliente = async (id: string) => {
        if (!confirm('¿Seguro que deseas eliminar este cliente? Esta acción no se puede deshacer.')) return;

        const { error } = await supabase
            .from('monitored_sites')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Error al eliminar: ' + error.message);
            return;
        }

        setSelectedCliente(null);
        fetchClientes();
    };

    // Toggle activación sitio
    const toggleActivacion = async (id: string, currentState: boolean) => {
        const { error } = await supabase
            .from('site_status')
            .update({
                is_active: !currentState,
                deactivated_at: !currentState ? null : new Date().toISOString(),
                reason: currentState ? 'solicitud_cliente' : null
            })
            .eq('id', id);

        if (error) {
            alert('Error: ' + error.message);
            return;
        }

        fetchClientes();
        if (selectedCliente) {
            setSelectedCliente({ ...selectedCliente, is_active: !currentState });
        }
    };

    // Filtrar y ordenar clientes
    const { clientesActivos, clientesCriticos } = useMemo(() => {
        const filtered = clientes.filter(c =>
            c.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.site_url.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const activos = filtered
            .filter(c => !getEstado(c.ultimo_pago, c.dia_cobro).esCritico)
            .sort((a, b) => getEstado(a.ultimo_pago, a.dia_cobro).prioridad - getEstado(b.ultimo_pago, b.dia_cobro).prioridad);

        const criticos = filtered
            .filter(c => getEstado(c.ultimo_pago, c.dia_cobro).esCritico)
            .sort((a, b) => getEstado(b.ultimo_pago, b.dia_cobro).diasVencido - getEstado(a.ultimo_pago, a.dia_cobro).diasVencido);

        return { clientesActivos: activos, clientesCriticos: criticos };
    }, [clientes, searchQuery]);

    const currentList = activeTab === 'activos' ? clientesActivos : clientesCriticos;

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center h-full">
                <div className="text-gray-500">Cargando clientes...</div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 h-full flex flex-col md:flex-row gap-6 relative">
            {/* Panel Principal - Lista */}
            <div className={`flex-1 flex flex-col h-full ${selectedCliente ? 'hidden md:flex' : 'flex'}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <h1 className="text-3xl font-bold">📦 Vault</h1>
                    <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors w-full md:w-auto">
                        <Plus className="w-4 h-4" />
                        Nuevo Cliente
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 md:pb-0">
                    <button
                        onClick={() => setActiveTab('activos')}
                        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'activos'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                    >
                        📋 Activos
                        <span className="bg-white/20 px-2 py-0.5 rounded text-sm">{clientesActivos.length}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('criticos')}
                        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'criticos'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                    >
                        🔴 Críticos
                        <span className={`px-2 py-0.5 rounded text-sm ${clientesCriticos.length > 0 ? 'bg-red-500 text-white' : 'bg-white/20'}`}>
                            {clientesCriticos.length}
                        </span>
                    </button>
                </div>

                {/* Búsqueda */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar cliente..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Lista de Clientes */}
                <div className="space-y-2 overflow-y-auto flex-1">
                    {currentList.map((cliente) => {
                        const estado = getEstado(cliente.ultimo_pago, cliente.dia_cobro);
                        return (
                            <div
                                key={cliente.id}
                                onClick={() => setSelectedCliente(cliente)}
                                className={`bg-gray-800 rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-750 border-l-4 ${selectedCliente?.id === cliente.id ? 'ring-2 ring-blue-500' : ''
                                    } ${estado.prioridad <= 2 ? 'border-l-red-500' :
                                        estado.prioridad === 3 ? 'border-l-yellow-500' :
                                            estado.prioridad === 4 ? 'border-l-gray-500' : 'border-l-green-500'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <span className={`px-2 py-1 rounded text-xs font-medium shrink-0 ${estado.color}`}>
                                            {estado.estado}
                                        </span>
                                        <div className="truncate">
                                            <h3 className="font-bold text-white truncate">{cliente.client_name}</h3>
                                            <p className="text-gray-400 text-sm truncate">
                                                {cliente.plan_type?.toUpperCase()} • ${((cliente.monto_mensual || 20000) / 1000)}k
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-2">
                                        <p className={`text-sm ${estado.prioridad <= 2 ? 'text-red-400' : 'text-gray-400'}`}>
                                            {estado.diasVencido > 0
                                                ? `-${estado.diasVencido}d`
                                                : estado.diasVencido === 0
                                                    ? 'Hoy'
                                                    : `${Math.abs(estado.diasVencido)}d`
                                            }
                                        </p>
                                        {cliente.alertas_count > 0 && (
                                            <div className="flex justify-end mt-1">
                                                <AlertTriangle className="w-3 h-3 text-orange-400" />
                                            </div>
                                        )}
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-500 hidden md:block ml-4" />
                                </div>
                            </div>
                        );
                    })}

                    {currentList.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            {activeTab === 'criticos'
                                ? '🎉 No hay clientes críticos'
                                : 'No se encontraron clientes'
                            }
                        </div>
                    )}
                </div>
            </div>

            {/* Panel Detalle */}
            {selectedCliente && (
                <div className="w-full md:w-[400px] bg-gray-900 rounded-xl border border-gray-800 p-6 overflow-y-auto h-full absolute inset-0 md:relative z-20 md:z-0 flex flex-col">
                    <div className="flex items-center justify-between mb-6 shrink-0">
                        <h2 className="text-xl font-bold truncate pr-4">{selectedCliente.client_name}</h2>
                        <button
                            onClick={() => setSelectedCliente(null)}
                            className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="overflow-y-auto flex-1 pr-2">
                        {/* Info General */}
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-gray-300">
                                <ExternalLink className="w-4 h-4" />
                                <a href={`https://${selectedCliente.site_url}`} target="_blank" className="text-blue-400 hover:underline truncate">
                                    {selectedCliente.site_url}
                                </a>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Plan</span>
                                    <p className="text-white font-medium">{selectedCliente.plan_type?.toUpperCase() || 'BASIC'}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Día de cobro</span>
                                    <p className="text-white font-medium">Día {selectedCliente.dia_cobro || 15}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Monto mensual</span>
                                    <p className="text-white font-medium">${(selectedCliente.monto_mensual || 20000).toLocaleString()}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Cliente desde</span>
                                    <p className="text-white font-medium">
                                        {selectedCliente.contract_start ? new Date(selectedCliente.contract_start).toLocaleDateString('es-CL') : '-'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Total pagado</span>
                                    <p className="text-green-400 font-medium">${selectedCliente.total_pagado.toLocaleString()}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Estado sitio</span>
                                    <p className={`font-medium ${selectedCliente.is_active ? 'text-green-400' : 'text-red-400'}`}>
                                        {selectedCliente.is_active ? '🟢 Activo' : '🔴 Bloqueado'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Implementación */}
                        {selectedCliente.monto_implementacion && selectedCliente.monto_implementacion > 0 && (
                            <div className="bg-gray-800 rounded-lg p-4 mb-4">
                                <h3 className="font-bold mb-3 text-sm text-gray-400">💼 IMPLEMENTACIÓN</h3>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xl font-bold text-white">${selectedCliente.monto_implementacion.toLocaleString()}</p>
                                        <p className="text-sm text-gray-400">
                                            {selectedCliente.cuotas_pagadas || 0}/{selectedCliente.cuotas_implementacion || 1} cuotas
                                        </p>
                                    </div>
                                    {(selectedCliente.cuotas_pagadas || 0) < (selectedCliente.cuotas_implementacion || 1) ? (
                                        <div className="text-right">
                                            <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-sm whitespace-nowrap">
                                                Saldo: ${(((selectedCliente.cuotas_implementacion || 1) - (selectedCliente.cuotas_pagadas || 0)) * (selectedCliente.monto_implementacion / (selectedCliente.cuotas_implementacion || 1))).toLocaleString()}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm">✓ Pagado</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Estado de Cuenta */}
                        <div className="bg-gray-800 rounded-lg p-4 mb-4">
                            <h3 className="font-bold mb-3">Estado de Cuenta</h3>
                            {(() => {
                                const estado = getEstado(selectedCliente.ultimo_pago, selectedCliente.dia_cobro);
                                return (
                                    <div className={`p-3 rounded ${estado.color}`}>
                                        <p className="font-bold">{estado.estado}</p>
                                        {estado.diasVencido > 0 && (
                                            <p className="text-sm">Vencido hace {estado.diasVencido} días</p>
                                        )}
                                    </div>
                                );
                            })()}
                            <button className="w-full mt-3 bg-green-600 hover:bg-green-700 py-3 rounded-lg transition-colors font-medium">
                                💰 Registrar Pago
                            </button>
                        </div>

                        {/* Acciones */}
                        <div className="space-y-3">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium">
                                🔧 Ejecutar Mantención
                            </button>
                            <button className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium">
                                📧 Enviar Recordatorio
                            </button>
                            <button
                                onClick={() => toggleActivacion(selectedCliente.id, selectedCliente.is_active)}
                                className={`w-full py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium ${selectedCliente.is_active
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-green-600 hover:bg-green-700'
                                    }`}
                            >
                                {selectedCliente.is_active ? '🔴 Desactivar Sitio' : '🟢 Reactivar Sitio'}
                            </button>
                        </div>

                        {/* Credenciales (placeholder) */}
                        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold">🔐 Credenciales</h3>
                                <button className="text-blue-400 text-sm hover:underline">+ Agregar</button>
                            </div>
                            <p className="text-gray-500 text-sm mt-2">Sin credenciales guardadas</p>
                        </div>

                        {/* Eliminar Cliente */}
                        <button
                            onClick={() => eliminarCliente(selectedCliente.id)}
                            className="w-full mt-8 bg-black/30 hover:bg-red-900/40 text-red-500 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 border border-red-900/30"
                        >
                            <Trash2 className="w-4 h-4" />
                            Eliminar Cliente
                        </button>

                        <div className="h-4"></div> {/* Spacer bottom */}
                    </div>
                </div>
            )}
        </div>
    );
}

// Export default wrapper


export default function VaultPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>}>
            <VaultContent />
        </Suspense>
    );
}
