import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { leadId, estado, nota, revisado_por } = body;

        console.log(`[API] STATUS UPDATE for ${leadId} -> ${estado}`);

        if (!leadId || !estado) {
            return NextResponse.json({ error: 'Missing leadId or estado' }, { status: 400 });
        }

        // 🛡️ SECURITY BYPASS: Use Service Role to ensure we can UPDATE leads regardless of RLS
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        let supabase;

        if (serviceRoleKey) {
            const { createClient: createAdminClient } = require('@supabase/supabase-js');
            supabase = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
                auth: { persistSession: false }
            });
            console.log('✅ Using Admin Client (Service Role)');
        } else {
            console.warn('⚠️ No Service Role Key found. Using standard client (Subject to RLS).');
            supabase = await createClient();
        }

        // Prepare Update Data
        const updateData: any = {
            estado,
            revisado_por: revisado_por || 'Sistema',
            revisado_at: new Date().toISOString()
        };

        // Logic for pipeline movement
        if (estado === 'ready_to_contact') {
            updateData.pipeline_stage = 'radar'; // Valid ENUM confirmed
            updateData.nota_revision = nota || null;
        } else if (estado === 'discarded') {
            updateData.pipeline_stage = null;
            updateData.nota_revision = nota || null;
        }

        // Execute Update
        const { data, error } = await supabase
            .from('leads')
            .update(updateData)
            .eq('id', leadId)
            .select();

        if (error) {
            console.error('❌ Supabase Update Error:', error);
            return NextResponse.json({ success: false, error: error.message, details: error }, { status: 500 });
        }

        // Verify Update
        if (!data || data.length === 0) {
            console.error('❌ No rows updated. ID might be wrong or deleted.');
            return NextResponse.json({ success: false, error: 'Lead no encontrado o no se pudo actualizar.' }, { status: 404 });
        }

        console.log('✅ Update Successful (API):', data[0].id);
        return NextResponse.json({ success: true, lead: data[0] });

    } catch (error: any) {
        console.error('🔥 CRITICAL API ERROR:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
