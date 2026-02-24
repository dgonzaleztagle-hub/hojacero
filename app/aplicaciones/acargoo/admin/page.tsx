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
    total_price: number;
    created_at: string;
    service?: { name?: string; icon?: string } | null;
};

type Service = {
    id: string;
    name: string;
    description: string;
    icon: string;
    base_price: number;
    price_per_km: number;
    multiplier: number;
    is_active: boolean;
};

type PricingMode = "base_plus_km" | "fixed_by_service" | "manual_quote";

const PRICING_MODE_LABELS: Record<PricingMode, string> = {
    base_plus_km: "Base + KM",
    fixed_by_service: "Fijo por servicio",
    manual_quote: "Cotización manual",
};

const STATUS_OPTIONS = [
    "pending",
    "assigned",
    "accepted",
    "arrived_pickup",
    "picked_up",
    "in_transit",
    "arrived_delivery",
    "completed",
    "failed_delivery",
    "cancelled",
];

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

export default function AcargooAdminPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [pricingMode, setPricingMode] = useState<PricingMode>("base_plus_km");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
    const [creatingService, setCreatingService] = useState(false);
    const [serviceForm, setServiceForm] = useState({
        name: "",
        description: "",
        icon: "Package",
        basePrice: 0,
        pricePerKm: 0,
        multiplier: 1,
    });

    const loadRuntime = async () => {
        try {
            setLoading(true);
            setError(null);
            const [ordersRes, servicesRes, modeRes] = await Promise.all([
                fetch("/api/acargoo/orders?limit=100", { cache: "no-store" }),
                fetch("/api/acargoo/services?include_inactive=true", { cache: "no-store" }),
                fetch("/api/acargoo/settings/pricing-mode", { cache: "no-store" }),
            ]);
            const [ordersPayload, servicesPayload, modePayload] = await Promise.all([
                ordersRes.json(),
                servicesRes.json(),
                modeRes.json(),
            ]);

            if (!ordersRes.ok || !ordersPayload?.ok) {
                throw new Error(ordersPayload?.error || "No fue posible cargar órdenes.");
            }
            if (!servicesRes.ok || !servicesPayload?.ok) {
                throw new Error(servicesPayload?.error || "No fue posible cargar servicios.");
            }
            if (!modeRes.ok || !modePayload?.ok) {
                throw new Error(modePayload?.error || "No fue posible cargar modo de pricing.");
            }

            setOrders(ordersPayload.orders || []);
            setServices((servicesPayload.services || []).map((service: any) => ({
                ...service,
                base_price: Number(service.pricing?.basePrice ?? service.base_price ?? 0),
                price_per_km: Number(service.pricing?.pricePerKm ?? service.price_per_km ?? 0),
                multiplier: Number(service.pricing?.multiplier ?? service.multiplier ?? 1),
                is_active: service.is_active ?? service.isActive ?? true,
            })));
            setPricingMode(modePayload.mode);
        } catch (fetchError: any) {
            setError(fetchError?.message || "No fue posible cargar órdenes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRuntime();
    }, []);

    const metrics = useMemo(() => {
        const total = orders.length;
        const active = orders.filter((o) => !["completed", "cancelled", "failed_delivery"].includes(o.status)).length;
        const completed = orders.filter((o) => o.status === "completed").length;
        const failed = orders.filter((o) => ["cancelled", "failed_delivery"].includes(o.status)).length;
        return { total, active, completed, failed };
    }, [orders]);

    const updateStatus = async (orderId: string, status: string) => {
        try {
            setUpdatingOrderId(orderId);
            const response = await fetch(`/api/acargoo/orders/${orderId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            const payload = await response.json();
            if (!response.ok || !payload?.ok) {
                throw new Error(payload?.error || "No fue posible actualizar la orden.");
            }
            setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)));
        } catch (updateError: any) {
            alert(updateError?.message || "No fue posible actualizar la orden.");
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const updatePricingMode = async (mode: PricingMode) => {
        try {
            const response = await fetch("/api/acargoo/settings/pricing-mode", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mode }),
            });
            const payload = await response.json();
            if (!response.ok || !payload?.ok) {
                throw new Error(payload?.error || "No fue posible actualizar el modo.");
            }
            setPricingMode(mode);
        } catch (updateError: any) {
            alert(updateError?.message || "No fue posible actualizar el modo.");
        }
    };

    const createService = async () => {
        if (!serviceForm.name.trim()) {
            alert("Nombre de servicio requerido.");
            return;
        }
        try {
            setCreatingService(true);
            const response = await fetch("/api/acargoo/services", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(serviceForm),
            });
            const payload = await response.json();
            if (!response.ok || !payload?.ok) {
                throw new Error(payload?.error || "No fue posible crear servicio.");
            }
            await loadRuntime();
            setServiceForm({
                name: "",
                description: "",
                icon: "Package",
                basePrice: 0,
                pricePerKm: 0,
                multiplier: 1,
            });
        } catch (createError: any) {
            alert(createError?.message || "No fue posible crear servicio.");
        } finally {
            setCreatingService(false);
        }
    };

    const toggleService = async (serviceId: string, active: boolean) => {
        try {
            const response = await fetch(`/api/acargoo/services/${serviceId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !active }),
            });
            const payload = await response.json();
            if (!response.ok || !payload?.ok) {
                throw new Error(payload?.error || "No fue posible actualizar servicio.");
            }
            setServices((prev) =>
                prev.map((service) => (service.id === serviceId ? { ...service, is_active: !active } : service))
            );
        } catch (updateError: any) {
            alert(updateError?.message || "No fue posible actualizar servicio.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-8 md:px-10">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex items-center justify-between">
                    <LogoAcargoo variant="light" size="md" />
                    <button
                        onClick={loadRuntime}
                        className="rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#254a77]"
                    >
                        Recargar
                    </button>
                </div>

                <h1 className="mb-1 text-2xl font-bold text-slate-900">Panel Admin Operativo</h1>
                <p className="mb-6 text-sm text-slate-600">
                    Vista real de órdenes en base de datos. Sin datos mock.
                </p>

                <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <MetricCard label="Órdenes Totales" value={metrics.total} />
                    <MetricCard label="Activas" value={metrics.active} />
                    <MetricCard label="Completadas" value={metrics.completed} />
                    <MetricCard label="Fallidas/Canceladas" value={metrics.failed} />
                </div>

                <div className="mb-6 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="mb-3 text-sm font-semibold text-slate-800">Modelo de negocio (pricing switch)</div>
                        <div className="flex flex-wrap gap-2">
                            {(Object.keys(PRICING_MODE_LABELS) as PricingMode[]).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => updatePricingMode(mode)}
                                    className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                                        pricingMode === mode
                                            ? "bg-[#1e3a5f] text-white"
                                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                    }`}
                                >
                                    {PRICING_MODE_LABELS[mode]}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="mb-3 text-sm font-semibold text-slate-800">Crear servicio</div>
                        <div className="grid gap-2 sm:grid-cols-2">
                            <input
                                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                                placeholder="Nombre"
                                value={serviceForm.name}
                                onChange={(e) => setServiceForm((p) => ({ ...p, name: e.target.value }))}
                            />
                            <input
                                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                                placeholder="Ícono (Tv, Package, Truck)"
                                value={serviceForm.icon}
                                onChange={(e) => setServiceForm((p) => ({ ...p, icon: e.target.value }))}
                            />
                            <input
                                className="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
                                placeholder="Descripción"
                                value={serviceForm.description}
                                onChange={(e) => setServiceForm((p) => ({ ...p, description: e.target.value }))}
                            />
                            <input
                                type="number"
                                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                                placeholder="Base"
                                value={serviceForm.basePrice}
                                onChange={(e) => setServiceForm((p) => ({ ...p, basePrice: Number(e.target.value || 0) }))}
                            />
                            <input
                                type="number"
                                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                                placeholder="Precio/KM"
                                value={serviceForm.pricePerKm}
                                onChange={(e) => setServiceForm((p) => ({ ...p, pricePerKm: Number(e.target.value || 0) }))}
                            />
                            <input
                                type="number"
                                step="0.1"
                                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                                placeholder="Multiplicador"
                                value={serviceForm.multiplier}
                                onChange={(e) => setServiceForm((p) => ({ ...p, multiplier: Number(e.target.value || 1) }))}
                            />
                            <button
                                onClick={createService}
                                disabled={creatingService}
                                className="rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
                            >
                                {creatingService ? "Creando..." : "Crear"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mb-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-600">
                            <tr>
                                <th className="px-4 py-3">Servicio</th>
                                <th className="px-4 py-3">Base</th>
                                <th className="px-4 py-3">KM</th>
                                <th className="px-4 py-3">Multiplicador</th>
                                <th className="px-4 py-3">Activo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service) => (
                                <tr key={service.id} className="border-t border-slate-100">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-slate-900">{service.name}</div>
                                        <div className="text-xs text-slate-500">{service.description}</div>
                                    </td>
                                    <td className="px-4 py-3 text-xs">${service.base_price}</td>
                                    <td className="px-4 py-3 text-xs">${service.price_per_km}</td>
                                    <td className="px-4 py-3 text-xs">{service.multiplier}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => toggleService(service.id, service.is_active)}
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                service.is_active
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-slate-200 text-slate-700"
                                            }`}
                                        >
                                            {service.is_active ? "Activo" : "Inactivo"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {loading && <div className="rounded-xl border border-slate-200 bg-white p-6">Cargando órdenes...</div>}
                {error && !loading && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
                )}

                {!loading && !error && (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-600">
                                <tr>
                                    <th className="px-4 py-3">Tracking</th>
                                    <th className="px-4 py-3">Servicio</th>
                                    <th className="px-4 py-3">Cliente</th>
                                    <th className="px-4 py-3">Ruta</th>
                                    <th className="px-4 py-3">Programación</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="border-t border-slate-100">
                                        <td className="px-4 py-3 font-semibold text-[#1e3a5f]">{order.tracking_code}</td>
                                        <td className="px-4 py-3">{order.service?.name || "-"}</td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-slate-900">{order.client_name}</div>
                                            <div className="text-xs text-slate-500">{order.client_phone}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="max-w-xs truncate text-xs text-slate-700">
                                                {order.pickup_address} {"->"} {order.delivery_address}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            {order.scheduled_date} {order.scheduled_time}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold">
                                                {STATUS_LABELS[order.status] || order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                                                value={order.status}
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                                disabled={updatingOrderId === order.id}
                                            >
                                                {STATUS_OPTIONS.map((status) => (
                                                    <option key={status} value={status}>
                                                        {STATUS_LABELS[status]}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                                            No hay órdenes registradas todavía.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function MetricCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
        </div>
    );
}
