
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const supabase = await createClient();
    const body = await request.json();
    const { updates } = body;

    if (!updates || !Array.isArray(updates)) {
        return NextResponse.json({ error: 'Invalid updates format' }, { status: 400 });
    }

    // [SECURITY] Codex Fix: Validate user session explicitly
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Perform updates in parallel or sequence
        // Parallel is faster, but order doesn't matter since they are keyed by ID and have explicit order values
        const promises = updates.map(update => {
            const { id, pipeline_stage, pipeline_order } = update;

            // Map stage to state if necessary (legacy support)
            let newEstado: string | undefined;
            if (pipeline_stage) {
                switch (pipeline_stage) {
                    case 'radar': newEstado = 'ready_to_contact'; break;
                    case 'contactado': newEstado = 'in_contact'; break;
                    case 'reunion': newEstado = 'in_contact'; break; // Meeting is a sub-state of in_contact or keep as is? 
                    // actually pipeline_stage is the source of truth for the board, 'estado' is for legacy logic.
                    // Let's keep existing mapping logic from singleton route for consistency
                    case 'negociacion': newEstado = 'proposal_sent'; break;
                    case 'produccion': newEstado = 'won'; break;
                    case 'perdido': newEstado = 'lost'; break;
                }
            }

            const payload: Record<string, unknown> = { pipeline_order };
            if (pipeline_stage) payload.pipeline_stage = pipeline_stage;
            if (newEstado) payload.estado = newEstado;

            return supabase
                .from('leads')
                .update(payload)
                .eq('id', id);
        });

        await Promise.all(promises);

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Internal error';
        console.error('Batch pipeline update error:', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
