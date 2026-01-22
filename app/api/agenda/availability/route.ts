import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * API de Disponibilidad para el Sistema de Agenda
 * 
 * Características:
 * - Consulta slots disponibles para una fecha específica
 * - Lógica "fake busy": si piden hora exacta popular, ofrece alternativa
 * - Duración configurable (default 30 min)
 */

// Horario de trabajo (9 AM - 6 PM Chile)
const WORK_START_HOUR = 9;
const WORK_END_HOUR = 18;
const SLOT_DURATION_MINUTES = 30;

// Horas "populares" que simulamos ocupadas para dar sensación de demanda
const POPULAR_HOURS = [10, 11, 15, 16]; // 10am, 11am, 3pm, 4pm

interface TimeSlot {
    start: string;
    end: string;
    available: boolean;
    suggested?: boolean; // Para slots sugeridos como alternativa
}

export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);

    const dateParam = searchParams.get('date'); // YYYY-MM-DD
    const requestedHour = searchParams.get('hour'); // HH:MM (opcional, para fake busy check)
    const duration = parseInt(searchParams.get('duration') || '30'); // minutos

    if (!dateParam) {
        return NextResponse.json({ success: false, error: 'Se requiere parámetro date (YYYY-MM-DD)' }, { status: 400 });
    }

    // Obtener eventos del día
    const dayStart = `${dateParam}T00:00:00`;
    const dayEnd = `${dateParam}T23:59:59`;

    const { data: events, error } = await supabase
        .from('agenda_events')
        .select('start_time, end_time')
        .gte('start_time', dayStart)
        .lte('start_time', dayEnd)
        .neq('status', 'cancelled');

    if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Generar todos los slots posibles del día
    const slots: TimeSlot[] = [];
    const bookedRanges = events?.map(e => ({
        start: new Date(e.start_time).getTime(),
        end: new Date(e.end_time).getTime()
    })) || [];

    for (let hour = WORK_START_HOUR; hour < WORK_END_HOUR; hour++) {
        for (let minute = 0; minute < 60; minute += SLOT_DURATION_MINUTES) {
            const slotStart = new Date(`${dateParam}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`);
            const slotEnd = new Date(slotStart.getTime() + duration * 60 * 1000);

            // Verificar si el slot está ocupado
            const isBooked = bookedRanges.some(range =>
                (slotStart.getTime() >= range.start && slotStart.getTime() < range.end) ||
                (slotEnd.getTime() > range.start && slotEnd.getTime() <= range.end)
            );

            // Verificar si el slot ya pasó (para hoy)
            const isPast = slotStart.getTime() < Date.now();

            slots.push({
                start: slotStart.toISOString(),
                end: slotEnd.toISOString(),
                available: !isBooked && !isPast
            });
        }
    }

    // Lógica "Fake Busy" - Si pidieron hora específica popular
    let fakeBusyResponse = null;
    if (requestedHour) {
        const [reqHour, reqMinute] = requestedHour.split(':').map(Number);

        // Si es hora popular y está "disponible", simulamos ocupada y sugerimos +15min
        if (POPULAR_HOURS.includes(reqHour)) {
            const requestedSlot = slots.find(s => {
                const slotDate = new Date(s.start);
                return slotDate.getHours() === reqHour && slotDate.getMinutes() === (reqMinute || 0);
            });

            if (requestedSlot?.available) {
                // Marcar como no disponible (fake)
                requestedSlot.available = false;

                // Buscar slot alternativo (+15 min)
                const alternativeTime = new Date(`${dateParam}T${reqHour.toString().padStart(2, '0')}:${((reqMinute || 0) + 15).toString().padStart(2, '0')}:00`);
                const alternativeSlot = slots.find(s => new Date(s.start).getTime() === alternativeTime.getTime());

                if (alternativeSlot?.available) {
                    alternativeSlot.suggested = true;
                    fakeBusyResponse = {
                        requested: requestedHour,
                        message: `No tengo disponibilidad a las ${requestedHour}, pero ¿te parece a las ${alternativeTime.getHours()}:${alternativeTime.getMinutes().toString().padStart(2, '0')}?`,
                        suggested: alternativeSlot.start
                    };
                }
            }
        }
    }

    // Filtrar solo slots disponibles para la respuesta
    const availableSlots = slots.filter(s => s.available || s.suggested);

    return NextResponse.json({
        success: true,
        date: dateParam,
        slots: availableSlots,
        fakeBusy: fakeBusyResponse,
        totalAvailable: availableSlots.length
    });
}
