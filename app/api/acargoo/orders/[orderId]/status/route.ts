import { NextResponse } from "next/server";
import { getAcargooAdminClient } from "@/lib/aplicaciones/acargoo/db";

const ALLOWED_STATUSES = [
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
] as const;

type AllowedStatus = (typeof ALLOWED_STATUSES)[number];

const ALLOWED_TRANSITIONS: Record<AllowedStatus, AllowedStatus[]> = {
    pending: ["assigned", "cancelled"],
    assigned: ["accepted", "cancelled"],
    accepted: ["arrived_pickup", "cancelled"],
    arrived_pickup: ["picked_up", "failed_delivery", "cancelled"],
    picked_up: ["in_transit", "failed_delivery"],
    in_transit: ["arrived_delivery", "failed_delivery"],
    arrived_delivery: ["completed", "failed_delivery"],
    completed: [],
    failed_delivery: [],
    cancelled: [],
};

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;
        const payload = (await request.json()) as { status?: string };
        const nextStatus = payload.status as AllowedStatus | undefined;

        if (!nextStatus || !ALLOWED_STATUSES.includes(nextStatus)) {
            return NextResponse.json(
                { ok: false, error: "Estado inválido." },
                { status: 400 }
            );
        }

        const supabase = getAcargooAdminClient();
        const now = new Date().toISOString();

        const { data: currentOrder, error: currentOrderError } = await supabase
            .from("acargoo_orders")
            .select("id, status")
            .eq("id", orderId)
            .single();

        if (currentOrderError || !currentOrder) {
            return NextResponse.json(
                { ok: false, error: "Orden no encontrada." },
                { status: 404 }
            );
        }

        const currentStatus = currentOrder.status as AllowedStatus;
        if (currentStatus === nextStatus) {
            return NextResponse.json({
                ok: true,
                order: {
                    id: currentOrder.id,
                    status: currentStatus,
                },
            });
        }

        if (currentStatus !== nextStatus && !ALLOWED_TRANSITIONS[currentStatus].includes(nextStatus)) {
            return NextResponse.json(
                { ok: false, error: `Transición inválida: ${currentStatus} -> ${nextStatus}.` },
                { status: 400 }
            );
        }

        const updatePayload: Record<string, unknown> = {
            status: nextStatus,
            updated_at: now,
        };

        if (nextStatus === "assigned") updatePayload.assigned_at = now;
        if (nextStatus === "accepted") updatePayload.accepted_at = now;
        if (nextStatus === "arrived_pickup") updatePayload.arrived_pickup_at = now;
        if (nextStatus === "picked_up") updatePayload.picked_up_at = now;
        if (nextStatus === "in_transit") updatePayload.started_at = now;
        if (nextStatus === "arrived_delivery") updatePayload.arrived_delivery_at = now;
        if (nextStatus === "completed") updatePayload.completed_at = now;
        if (nextStatus === "failed_delivery") updatePayload.failed_at = now;
        if (nextStatus === "cancelled") updatePayload.cancelled_at = now;

        const { data, error } = await supabase
            .from("acargoo_orders")
            .update(updatePayload)
            .eq("id", orderId)
            .select("id, tracking_code, status, updated_at")
            .single();

        if (error || !data) {
            return NextResponse.json(
                { ok: false, error: "No fue posible actualizar la orden." },
                { status: 500 }
            );
        }

        return NextResponse.json({ ok: true, order: data });
    } catch (error) {
        console.error("acargoo order status PATCH failed:", error);
        return NextResponse.json(
            { ok: false, error: "No fue posible actualizar la orden." },
            { status: 500 }
        );
    }
}
