import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST: Registrar dispositivo como del equipo
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { fingerprint, owner, device_name } = body;

        if (!fingerprint || !owner) {
            return NextResponse.json({ error: 'fingerprint y owner requeridos' }, { status: 400 });
        }

        // Upsert - si ya existe, actualizar nombre
        const { data, error } = await supabase
            .from('team_devices')
            .upsert({
                fingerprint,
                owner,
                device_name: device_name || `Dispositivo de ${owner}`
            }, { onConflict: 'fingerprint' })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Dispositivo registrado como del equipo',
            device: data
        });

    } catch (e) {
        console.error('Error registering team device:', e);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

// GET: Listar dispositivos del equipo
export async function GET() {
    const { data, error } = await supabase
        .from('team_devices')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
        success: true,
        devices: data
    });
}

// DELETE: Eliminar dispositivo
export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const fingerprint = searchParams.get('fingerprint');

    if (!fingerprint) {
        return NextResponse.json({ error: 'fingerprint requerido' }, { status: 400 });
    }

    const { error } = await supabase
        .from('team_devices')
        .delete()
        .eq('fingerprint', fingerprint);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
        success: true,
        message: 'Dispositivo eliminado'
    });
}
