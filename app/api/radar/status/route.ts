import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { leadId, estado, nota, revisado_por } = body;

        if (!leadId || !estado) {
            return NextResponse.json({ error: 'Missing leadId or estado' }, { status: 400 });
        }

        const supabase = await createClient();

        console.log(`📡 RADAR STATUS: Updating ${leadId} to ${estado}...`);

        // Prepare update object
        const updateData: any = {
            estado,
            revisado_por: revisado_por || 'Sistema',
            updated_at: new Date().toISOString()
        };

        // If moving to pipeline for first time, ensure pipeline_stage is set
        if (estado === 'ready_to_contact') {
            updateData.pipeline_stage = 'radar';
            updateData.nota_revision = nota || null;
        }
        // If discarding, remove from pipeline view logic if needed, but 'discarded' state usually handles it
        else if (estado === 'discarded') {
            updateData.pipeline_stage = null; // Optional: clear stage or set to 'discarded'
            updateData.nota_revision = nota || null;
        }

        const { error } = await supabase
            .from('leads')
            .update(updateData)
            .eq('id', leadId);

        if (error) {
            throw new Error(error.message);
        }

        // Log Activity Server-Side
        await supabase.from('lead_activity_log').insert({
            lead_id: leadId,
            usuario: revisado_por || 'Sistema',
            accion: estado === 'discarded' ? 'discarded' : 'qualified',
            estado_anterior: 'detected', // Simplified assumption or fetch real prev state if needed
            estado_nuevo: estado,
            nota: nota || null
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Radar Status Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
