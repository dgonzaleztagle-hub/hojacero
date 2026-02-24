import { NextResponse } from "next/server";
import { getAcargooAdminClient } from "@/lib/aplicaciones/acargoo/db";

type CreateOrderPayload = {
    serviceId?: string;
    date?: string;
    time?: string;
    pickup?: string;
    delivery?: string;
    description?: string;
    contact?: {
        name?: string;
        phone?: string;
        email?: string;
    };
    distanceKm?: number;
};

const ORDER_STATUSES = [
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

type OrderStatus = (typeof ORDER_STATUSES)[number];
type PricingMode = "base_plus_km" | "fixed_by_service" | "manual_quote";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const date = searchParams.get("date");
        const limitParam = Number(searchParams.get("limit") || 50);
        const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 200) : 50;

        const supabase = getAcargooAdminClient();
        let query = supabase
            .from("acargoo_orders")
            .select(`
                id,
                tracking_code,
                status,
                client_name,
                client_phone,
                client_email,
                pickup_address,
                delivery_address,
                scheduled_date,
                scheduled_time,
                total_price,
                driver_id,
                created_at,
                updated_at,
                service:acargoo_services(name, icon)
            `)
            .order("created_at", { ascending: false })
            .limit(limit);

        if (status && ORDER_STATUSES.includes(status as OrderStatus)) {
            query = query.eq("status", status);
        }
        if (date) {
            query = query.eq("scheduled_date", date);
        }

        const { data, error } = await query;
        if (error) {
            return NextResponse.json(
                { ok: false, error: "No fue posible cargar las órdenes." },
                { status: 500 }
            );
        }

        return NextResponse.json({ ok: true, orders: data || [] });
    } catch (error) {
        console.error("acargoo orders GET failed:", error);
        return NextResponse.json(
            { ok: false, error: "No fue posible cargar las órdenes." },
            { status: 500 }
        );
    }
}

function normalizePhone(phone: string) {
    return phone.replace(/\D/g, "");
}

function normalizeTime(time: string) {
    if (/^\d{2}:\d{2}$/.test(time)) {
        return `${time}:00`;
    }
    return time;
}

function isUniqueViolation(error: any) {
    return error?.code === "23505" || /duplicate key value/i.test(String(error?.message || ""));
}

function isSlotConflictError(error: any) {
    const haystack = `${error?.message || ""} ${error?.details || ""} ${error?.hint || ""}`.toLowerCase();
    return haystack.includes("unique_active_slot") || (haystack.includes("scheduled_date") && haystack.includes("scheduled_time"));
}

function isTrackingCodeConflictError(error: any) {
    const haystack = `${error?.message || ""} ${error?.details || ""} ${error?.hint || ""}`.toLowerCase();
    return haystack.includes("tracking_code");
}

async function generateTrackingCode(supabase: ReturnType<typeof getAcargooAdminClient>) {
    for (let i = 0; i < 8; i += 1) {
        const candidate = `AG-${Math.floor(100000 + Math.random() * 900000)}`;
        const { data, error } = await supabase
            .from("acargoo_orders")
            .select("id")
            .eq("tracking_code", candidate)
            .maybeSingle();

        if (error) {
            continue;
        }

        if (!data) {
            return candidate;
        }
    }

    throw new Error("Could not generate a unique tracking code");
}

function getValidationError(payload: CreateOrderPayload) {
    if (!payload.serviceId) return "Servicio requerido.";
    if (!payload.date) return "Fecha requerida.";
    if (!payload.time) return "Hora requerida.";
    if (!DATE_RE.test(payload.date)) return "Fecha inválida. Formato esperado: YYYY-MM-DD.";
    if (!TIME_RE.test(payload.time)) return "Hora inválida. Formato esperado: HH:MM.";
    if (!payload.pickup?.trim()) return "Dirección de origen requerida.";
    if (!payload.delivery?.trim()) return "Dirección de destino requerida.";
    if (!payload.contact?.name?.trim()) return "Nombre de contacto requerido.";
    if (!payload.contact?.phone?.trim()) return "Teléfono de contacto requerido.";
    if (!payload.contact?.email?.trim()) return "Email de contacto requerido.";
    if (!/\S+@\S+\.\S+/.test(payload.contact.email)) return "Email inválido.";
    const phoneNormalized = normalizePhone(payload.contact.phone);
    if (phoneNormalized.length < 8 || phoneNormalized.length > 15) return "Teléfono inválido.";
    return null;
}

function computePrice(params: {
    mode: PricingMode;
    basePrice: number;
    pricePerKm: number;
    multiplier: number;
    distanceKm: number;
}) {
    const { mode, basePrice, pricePerKm, multiplier, distanceKm } = params;
    if (mode === "fixed_by_service") {
        return Math.round(basePrice * multiplier);
    }
    if (mode === "manual_quote") {
        return 0;
    }
    return Math.round((basePrice + pricePerKm * distanceKm) * multiplier);
}

export async function POST(request: Request) {
    try {
        const payload = (await request.json()) as CreateOrderPayload;
        const validationError = getValidationError(payload);
        if (validationError) {
            return NextResponse.json({ ok: false, error: validationError }, { status: 400 });
        }

        const supabase = getAcargooAdminClient();
        const scheduleTime = normalizeTime(payload.time as string);

        const { data: conflictingOrder, error: conflictError } = await supabase
            .from("acargoo_orders")
            .select("id, tracking_code, status")
            .eq("scheduled_date", payload.date as string)
            .eq("scheduled_time", scheduleTime)
            .not("status", "in", "(cancelled,failed_delivery)")
            .limit(1)
            .maybeSingle();

        if (conflictError) {
            return NextResponse.json(
                { ok: false, error: "No fue posible validar disponibilidad horaria." },
                { status: 500 }
            );
        }

        if (conflictingOrder?.id) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "El horario seleccionado ya no está disponible. Elige otro bloque.",
                },
                { status: 409 }
            );
        }

        const { data: service, error: serviceError } = await supabase
            .from("acargoo_services")
            .select("id, base_price, price_per_km, multiplier, is_active")
            .eq("id", payload.serviceId as string)
            .maybeSingle();

        if (serviceError || !service || !service.is_active) {
            const isSchemaError = serviceError?.message?.includes("schema cache");
            return NextResponse.json(
                {
                    ok: false,
                    error: isSchemaError
                        ? "Catálogo de servicios no disponible en Supabase API."
                        : "El servicio seleccionado no está disponible.",
                },
                { status: 400 }
            );
        }

        const phoneRaw = payload.contact?.phone?.trim() as string;
        const phoneNormalized = normalizePhone(phoneRaw);

        let clientId: string | null = null;
        const { data: existingClient } = await supabase
            .from("acargoo_clients")
            .select("id")
            .in("phone", [phoneRaw, phoneNormalized])
            .limit(1)
            .maybeSingle();

        if (existingClient?.id) {
            clientId = existingClient.id;
            await supabase
                .from("acargoo_clients")
                .update({
                    name: payload.contact?.name?.trim(),
                    email: payload.contact?.email?.trim(),
                    phone: phoneNormalized,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", existingClient.id);
        } else {
            const { data: createdClient, error: clientInsertError } = await supabase
                .from("acargoo_clients")
                .insert({
                    name: payload.contact?.name?.trim(),
                    email: payload.contact?.email?.trim(),
                    phone: phoneNormalized,
                })
                .select("id")
                .single();

            if (!clientInsertError) {
                clientId = createdClient.id;
            }
        }

        const { data: pricingSetting } = await supabase
            .from("acargoo_settings")
            .select("value")
            .eq("key", "pricing_mode")
            .maybeSingle();

        const pricingMode = ((pricingSetting?.value as { mode?: PricingMode } | null)?.mode || "base_plus_km") as PricingMode;
        const basePrice = Number(service.base_price || 0);
        const pricePerKm = Number(service.price_per_km || 0);
        const multiplier = Number(service.multiplier || 1);
        const distanceKm = Number(payload.distanceKm || 0);
        const totalPrice = computePrice({
            mode: pricingMode,
            basePrice,
            pricePerKm,
            multiplier,
            distanceKm,
        });

        let order: { id: string; tracking_code: string } | null = null;
        let orderError: any = null;

        for (let attempt = 0; attempt < 5; attempt += 1) {
            const trackingCode = await generateTrackingCode(supabase);
            const result = await supabase
                .from("acargoo_orders")
                .insert({
                    tracking_code: trackingCode,
                    service_id: payload.serviceId,
                    client_id: clientId,
                    pickup_address: payload.pickup?.trim(),
                    delivery_address: payload.delivery?.trim(),
                    client_name: payload.contact?.name?.trim(),
                    client_phone: phoneNormalized,
                    client_email: payload.contact?.email?.trim(),
                    scheduled_date: payload.date,
                    scheduled_time: scheduleTime,
                    distance_km: distanceKm,
                    base_price: basePrice,
                    total_price: totalPrice,
                    pricing_mode: pricingMode,
                    description: payload.description?.trim() || null,
                    status: "pending",
                    metadata: pricingMode === "manual_quote" ? { quote_required: true } : {},
                })
                .select("id, tracking_code")
                .single();

            order = result.data;
            orderError = result.error;

            if (!orderError && order) {
                break;
            }
            if (isUniqueViolation(orderError) && isTrackingCodeConflictError(orderError)) {
                continue;
            }
            if (isUniqueViolation(orderError) && isSlotConflictError(orderError)) {
                return NextResponse.json(
                    {
                        ok: false,
                        error: "El horario seleccionado ya no está disponible. Elige otro bloque.",
                    },
                    { status: 409 }
                );
            }
            break;
        }

        if (orderError || !order) {
            console.error("acargoo order insert failed:", orderError);
            const isSchemaError = orderError?.message?.includes("schema cache");
            return NextResponse.json(
                {
                    ok: false,
                    error: isSchemaError
                        ? "Tabla de órdenes no disponible en el schema expuesto por Supabase API."
                        : "No fue posible registrar la reserva.",
                },
                { status: 500 }
            );
        }

        let waMeLink: string | null = null;
        const { data: waSetting } = await supabase
            .from("acargoo_settings")
            .select("value")
            .eq("key", "wa_me_number")
            .maybeSingle();

        const waPhone = (waSetting?.value as { phone?: string } | null)?.phone?.replace(/\D/g, "") || "";
        if (waPhone && phoneNormalized) {
            waMeLink = `https://wa.me/${waPhone}?text=${encodeURIComponent(
                `Hola, soy ${payload.contact?.name}. Quedó creada mi reserva ${order.tracking_code}.`
            )}`;
        }

        return NextResponse.json({
            ok: true,
            order: {
                id: order.id,
                trackingCode: order.tracking_code,
                waMeLink,
            },
        });
    } catch (error) {
        console.error("acargoo orders POST failed:", error);
        return NextResponse.json(
            { ok: false, error: "No fue posible registrar la reserva." },
            { status: 500 }
        );
    }
}
