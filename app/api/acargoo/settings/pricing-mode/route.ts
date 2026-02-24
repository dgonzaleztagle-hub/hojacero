import { NextResponse } from "next/server";
import { getAcargooAdminClient } from "@/lib/aplicaciones/acargoo/db";

const PRICING_MODES = ["base_plus_km", "fixed_by_service", "manual_quote"] as const;
type PricingMode = (typeof PRICING_MODES)[number];

export async function GET() {
    try {
        const supabase = getAcargooAdminClient();
        const { data, error } = await supabase
            .from("acargoo_settings")
            .select("id, key, value, description")
            .eq("key", "pricing_mode")
            .maybeSingle();

        if (error) {
            return NextResponse.json({ ok: false, error: "No fue posible cargar modo de pricing." }, { status: 500 });
        }

        const mode = ((data?.value as { mode?: string } | null)?.mode || "base_plus_km") as PricingMode;
        return NextResponse.json({ ok: true, mode });
    } catch (error) {
        console.error("pricing-mode GET failed:", error);
        return NextResponse.json({ ok: false, error: "No fue posible cargar modo de pricing." }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const payload = (await request.json()) as { mode?: string };
        const mode = payload.mode as PricingMode | undefined;
        if (!mode || !PRICING_MODES.includes(mode)) {
            return NextResponse.json({ ok: false, error: "Modo de pricing inválido." }, { status: 400 });
        }

        const supabase = getAcargooAdminClient();
        const { error } = await supabase
            .from("acargoo_settings")
            .upsert(
                {
                    key: "pricing_mode",
                    value: { mode },
                    description: "base_plus_km | fixed_by_service | manual_quote",
                },
                { onConflict: "key" }
            );

        if (error) {
            return NextResponse.json({ ok: false, error: "No fue posible actualizar modo de pricing." }, { status: 500 });
        }

        return NextResponse.json({ ok: true, mode });
    } catch (error) {
        console.error("pricing-mode PATCH failed:", error);
        return NextResponse.json({ ok: false, error: "No fue posible actualizar modo de pricing." }, { status: 500 });
    }
}

