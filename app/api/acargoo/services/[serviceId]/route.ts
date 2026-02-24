import { NextResponse } from "next/server";
import { getAcargooAdminClient } from "@/lib/aplicaciones/acargoo/db";

type UpdateServicePayload = {
    name?: string;
    description?: string;
    icon?: string;
    basePrice?: number;
    pricePerKm?: number;
    multiplier?: number;
    isActive?: boolean;
};

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ serviceId: string }> }
) {
    try {
        const { serviceId } = await params;
        const payload = (await request.json()) as UpdateServicePayload;
        const updates: Record<string, unknown> = {};

        if (typeof payload.name === "string") updates.name = payload.name.trim();
        if (typeof payload.description === "string") updates.description = payload.description.trim();
        if (typeof payload.icon === "string") updates.icon = payload.icon.trim() || "Package";
        if (typeof payload.basePrice === "number") updates.base_price = payload.basePrice;
        if (typeof payload.pricePerKm === "number") updates.price_per_km = payload.pricePerKm;
        if (typeof payload.multiplier === "number") updates.multiplier = payload.multiplier;
        if (typeof payload.isActive === "boolean") updates.is_active = payload.isActive;

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ ok: false, error: "Sin campos para actualizar." }, { status: 400 });
        }

        const supabase = getAcargooAdminClient();
        const { data, error } = await supabase
            .from("acargoo_services")
            .update(updates)
            .eq("id", serviceId)
            .select("id, name, description, icon, base_price, price_per_km, multiplier, is_active")
            .single();

        if (error || !data) {
            return NextResponse.json(
                { ok: false, error: "No fue posible actualizar el servicio." },
                { status: 500 }
            );
        }

        return NextResponse.json({ ok: true, service: data });
    } catch (error) {
        console.error("acargoo service PATCH failed:", error);
        return NextResponse.json(
            { ok: false, error: "No fue posible actualizar el servicio." },
            { status: 500 }
        );
    }
}

