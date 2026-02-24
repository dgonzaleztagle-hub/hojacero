import { NextResponse } from "next/server";
import { getAcargooAdminClient } from "@/lib/aplicaciones/acargoo/db";

type RawService = {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    base_price: number | string | null;
    price_per_km: number | string | null;
    multiplier: number | string | null;
    is_active: boolean | null;
};

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const includeInactive = url.searchParams.get("include_inactive") === "true";
        const supabase = getAcargooAdminClient();
        let query = supabase
            .from("acargoo_services")
            .select("id, name, description, icon, base_price, price_per_km, multiplier, is_active")
            .order("name", { ascending: true });
        if (!includeInactive) {
            query = query.eq("is_active", true);
        }
        const { data, error } = await query;

        if (error) {
            const isSchemaError = error.message?.includes("schema cache");
            return NextResponse.json(
                {
                    ok: false,
                    error: isSchemaError
                        ? "Tabla acargoo_services no disponible en el schema expuesto por Supabase API."
                        : "No fue posible cargar los servicios.",
                },
                { status: isSchemaError ? 400 : 500 }
            );
        }

        const services = (data || []).map((service: RawService) => ({
            id: service.id,
            name: service.name,
            description: service.description || "",
            icon: service.icon || "Package",
            pricing: {
                basePrice: Number(service.base_price || 0),
                pricePerKm: Number(service.price_per_km || 0),
                multiplier: Number(service.multiplier || 1),
            },
            isActive: service.is_active ?? true,
        }));

        return NextResponse.json({ ok: true, services });
    } catch (error) {
        console.error("acargoo services GET failed:", error);
        return NextResponse.json(
            { ok: false, error: "No fue posible cargar los servicios." },
            { status: 500 }
        );
    }
}

type CreateServicePayload = {
    name?: string;
    description?: string;
    icon?: string;
    basePrice?: number;
    pricePerKm?: number;
    multiplier?: number;
    isActive?: boolean;
};

export async function POST(request: Request) {
    try {
        const payload = (await request.json()) as CreateServicePayload;
        const name = payload.name?.trim();
        if (!name) {
            return NextResponse.json({ ok: false, error: "Nombre de servicio requerido." }, { status: 400 });
        }

        const supabase = getAcargooAdminClient();
        const { data, error } = await supabase
            .from("acargoo_services")
            .insert({
                name,
                description: payload.description?.trim() || null,
                icon: payload.icon?.trim() || "Package",
                base_price: Number(payload.basePrice || 0),
                price_per_km: Number(payload.pricePerKm || 0),
                multiplier: Number(payload.multiplier || 1),
                is_active: payload.isActive ?? true,
            })
            .select("id, name, description, icon, base_price, price_per_km, multiplier, is_active")
            .single();

        if (error || !data) {
            return NextResponse.json(
                { ok: false, error: "No fue posible crear el servicio." },
                { status: 500 }
            );
        }

        return NextResponse.json({ ok: true, service: data });
    } catch (error) {
        console.error("acargoo services POST failed:", error);
        return NextResponse.json(
            { ok: false, error: "No fue posible crear el servicio." },
            { status: 500 }
        );
    }
}
