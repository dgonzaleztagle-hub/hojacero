import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

// Cliente admin para operaciones del bot (sin cookies de usuario)
const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: Lista eventos (con filtros opcionales)
export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);

    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');
    const eventType = searchParams.get('type');

    let query = supabase.from('agenda_events').select('*, leads(nombre, sitio_web)').order('start_time', { ascending: true });

    if (startDate) {
        query = query.gte('start_time', startDate);
    }
    if (endDate) {
        query = query.lte('end_time', endDate);
    }
    if (eventType) {
        query = query.eq('event_type', eventType);
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, events: data });
}

// POST: Crear evento
export async function POST(req: NextRequest) {
    const body = await req.json();
    const { title, description, event_type, start_time, end_time, attendee_name, attendee_email, attendee_phone, lead_id, location, notes, source } = body;

    // Usar cliente admin si viene del bot (no tiene cookies de usuario)
    const supabase = source === 'chat_bot' ? supabaseAdmin : await createClient();

    if (!title || !start_time || !end_time) {
        return NextResponse.json({ success: false, error: 'Faltan campos requeridos (title, start_time, end_time)' }, { status: 400 });
    }

    const { data, error } = await supabase.from('agenda_events').insert({
        title,
        description,
        event_type: event_type || 'meeting',
        start_time,
        end_time,
        attendee_name,
        attendee_email,
        attendee_phone,
        lead_id,
        location,
        notes,
        source: source || 'manual',
        status: 'confirmed'
    }).select().single();

    if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, event: data });
}

// PATCH: Actualizar evento
export async function PATCH(req: NextRequest) {
    const supabase = await createClient();
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
        return NextResponse.json({ success: false, error: 'Se requiere ID del evento' }, { status: 400 });
    }

    const { data, error } = await supabase.from('agenda_events').update({
        ...updates,
        updated_at: new Date().toISOString()
    }).eq('id', id).select().single();

    if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, event: data });
}

// DELETE: Eliminar evento
export async function DELETE(req: NextRequest) {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ success: false, error: 'Se requiere ID del evento' }, { status: 400 });
    }

    const { error } = await supabase.from('agenda_events').delete().eq('id', id);

    if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Evento eliminado' });
}
