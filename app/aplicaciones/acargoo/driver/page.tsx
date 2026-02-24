"use client";

import { useEffect, useMemo, useState } from "react";
import LogoAcargoo from "@/components/aplicaciones/acargoo/LogoAcargoo";

type Order = {
    id: string;
    tracking_code: string;
    status: string;
    client_name: string;
    client_phone: string;
    pickup_address: string;
    delivery_address: string;
    scheduled_date: string;
    scheduled_time: string;
    service?: { name?: string } | null;
};

const STATUS_ACTIONS: Record<string, { next: string; label: string } | undefined> = {
    assigned: { next: "accepted", label: "Aceptar servicio" },
    accepted: { next: "arrived_pickup", label: "Marcar llegada a origen" },
    arrived_pickup: { next: "picked_up", label: "Confirmar retiro de carga" },
    picked_up: { next: "in_transit", label: "Iniciar tránsito" },
    in_transit: { next: "arrived_delivery", label: "Marcar llegada a destino" },
    arrived_delivery: { next: "completed", label: "Finalizar entrega" },
};

const STATUS_LABELS: Record<string, string> = {
    pending: "Pendiente",
    assigned: "Asignada",
    accepted: "Aceptada",
    arrived_pickup: "Llegó Origen",
    picked_up: "Retirada",
    in_transit: "En Tránsito",
    arrived_delivery: "Llegó Destino",
    completed: "Completada",
    failed_delivery: "Fallida",
    cancelled: "Cancelada",
};

export default function AcargooDriverPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState<string | null>(null);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch("/api/acargoo/orders?limit=100", { cache: "no-store" });
            const payload = await response.json();
            if (!response.ok || !payload?.ok) {
                throw new Error(payload?.error || "No fue posible cargar los servicios del conductor.");
            }
            setOrders(payload.orders || []);
        } catch (fetchError: any) {
            setError(fetchError?.message || "No fue posible cargar los servicios del conductor.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const queue = useMemo(
        () =>
            orders.filter((order) =>
                ["assigned", "accepted", "arrived_pickup", "picked_up", "in_transit", "arrived_delivery"].includes(
                    order.status
                )
            ),
        [orders]
    );

    const activeOrder = queue[0] || null;

    const applyAction = async (order: Order, nextStatus: string) => {
        try {
            setBusy(order.id);
            const response = await fetch(`/api/acargoo/orders/${order.id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: nextStatus }),
            });
            const payload = await response.json();
            if (!response.ok || !payload?.ok) {
                throw new Error(payload?.error || "No fue posible actualizar el estado.");
            }
            setOrders((prev) => prev.map((row) => (row.id === order.id ? { ...row, status: nextStatus } : row)));
        } catch (updateError: any) {
            alert(updateError?.message || "No fue posible actualizar el estado.");
        } finally {
            setBusy(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-8 md:px-10">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex items-center justify-between">
                    <LogoAcargoo variant="light" size="md" />
                    <button
                        onClick={loadOrders}
                        className="rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#254a77]"
                    >
                        Recargar
                    </button>
                </div>

                <h1 className="mb-1 text-2xl font-bold text-slate-900">Panel Driver Operativo</h1>
                <p className="mb-6 text-sm text-slate-600">Flujo real de órdenes y cambios de estado.</p>

                {loading && <div className="rounded-xl border border-slate-200 bg-white p-6">Cargando servicios...</div>}
                {error && !loading && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
                )}

                {!loading && !error && !activeOrder && (
                    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
                        No hay servicios activos para gestionar en este momento.
                    </div>
                )}

                {!loading && !error && activeOrder && (
                    <div className="space-y-4">
                        <div className="rounded-xl border border-slate-200 bg-white p-6">
                            <div className="mb-2 text-xs uppercase tracking-wide text-slate-500">Servicio activo</div>
                            <h2 className="text-xl font-bold text-[#1e3a5f]">{activeOrder.tracking_code}</h2>
                            <p className="mt-2 text-sm text-slate-700">{activeOrder.service?.name || "Servicio"}</p>
                            <p className="text-sm text-slate-700">{activeOrder.client_name} - {activeOrder.client_phone}</p>
                            <p className="mt-3 text-sm text-slate-600">
                                Origen: {activeOrder.pickup_address}
                                <br />
                                Destino: {activeOrder.delivery_address}
                            </p>
                            <p className="mt-3 text-sm">
                                Estado actual:{" "}
                                <span className="font-semibold">{STATUS_LABELS[activeOrder.status] || activeOrder.status}</span>
                            </p>

                            {STATUS_ACTIONS[activeOrder.status] && (
                                <button
                                    onClick={() =>
                                        applyAction(activeOrder, (STATUS_ACTIONS[activeOrder.status] as { next: string }).next)
                                    }
                                    disabled={busy === activeOrder.id}
                                    className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
                                >
                                    {busy === activeOrder.id
                                        ? "Actualizando..."
                                        : (STATUS_ACTIONS[activeOrder.status] as { label: string }).label}
                                </button>
                            )}
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-6">
                            <div className="mb-3 text-sm font-semibold text-slate-800">Cola de servicios</div>
                            <div className="space-y-2">
                                {queue.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm"
                                    >
                                        <span className="font-medium text-slate-800">{order.tracking_code}</span>
                                        <span className="text-slate-600">{STATUS_LABELS[order.status] || order.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
