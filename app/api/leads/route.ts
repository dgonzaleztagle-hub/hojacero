import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// GET: Obtener estadísticas de leads
export async function GET() {
    const supabase = await createClient();

    const { data: leads, error } = await supabase
        .from('leads')
        .select('id, nombre, zona_busqueda, estado, puntaje_oportunidad, razon_ia, created_at')
        .eq('fuente', 'radar')
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
        total: leads?.length || 0,
        leads: leads || [],
        summary: {
            detected: leads?.filter(l => l.estado === 'detected').length || 0,
            discarded: leads?.filter(l => l.estado === 'discarded').length || 0,
            ready_to_contact: leads?.filter(l => l.estado === 'ready_to_contact').length || 0,
            in_contact: leads?.filter(l => l.estado === 'in_contact').length || 0,
            won: leads?.filter(l => l.estado === 'won').length || 0,
            lost: leads?.filter(l => l.estado === 'lost').length || 0,
        }
    });
}

// DELETE: Borrar TODOS los leads de radar (para reset de pruebas)
export async function DELETE() {
    const supabase = await createClient();

    const { error } = await supabase
        .from('leads')
        .delete()
        .eq('fuente', 'radar');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
        success: true,
        message: 'Todos los leads de radar han sido eliminados.'
    });
}
