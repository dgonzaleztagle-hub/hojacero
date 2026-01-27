import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { leadId, estado, nota, revisado_por } = body;

        if (!leadId || !estado) {
            return NextResponse.json({ error: 'Missing leadId or estado' }, { status: 400 });
        }

        // Use Service Role Key to bypass RLS (safest for internal tool actions)
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        let supabase;

        if (serviceRoleKey) {
            const { createClient: createAdminClient } = require('@supabase/supabase-js');
            supabase = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey);
        } else {
            console.warn("⚠️ SUPABASE_SERVICE_ROLE_KEY missing in Status Route. Using standard client.");
            supabase = await createClient();
        }

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

        const { data, error } = await supabase
            .from('leads')
            .update(updateData)
            .eq('id', leadId)
            .select();

        if (error) {
            throw new Error(error.message);
        }

        // Critical Check: Ensure we actually updated a row
        if (!data || data.length === 0) {
            throw new Error('No se pudo guardar: El Lead no existe en la BD (ID fantasma). Intenta escanear de nuevo.');
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Radar Status Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
