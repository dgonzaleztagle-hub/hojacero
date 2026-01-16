import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET: Fetch all leads for the pipeline
export async function GET() {
    const supabase = await createClient();

    const { data: leads, error } = await supabase
        .from('leads')
        .select('id, nombre, categoria, pipeline_stage, pipeline_order, tags, created_at')
        .order('pipeline_order', { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Group by stage
    const pipelineData = {
        radar: leads.filter(l => l.pipeline_stage === 'radar' || !l.pipeline_stage),
        contactado: leads.filter(l => l.pipeline_stage === 'contactado'),
        reunion: leads.filter(l => l.pipeline_stage === 'reunion'),
        negociacion: leads.filter(l => l.pipeline_stage === 'negociacion'),
        produccion: leads.filter(l => l.pipeline_stage === 'produccion'),
        perdido: leads.filter(l => l.pipeline_stage === 'perdido'),
    };

    return NextResponse.json(pipelineData);
}

// Helper function to handle update
async function handleUpdate(request: Request) {
    const supabase = await createClient();
    const body = await request.json();
    const { id, pipeline_stage, pipeline_order } = body;

    if (!id) {
        return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    // Map pipeline_stage to legacy 'estado' for backward compatibility
    let newEstado: string | undefined;
    switch (pipeline_stage) {
        case 'radar': newEstado = 'ready_to_contact'; break;
        case 'contactado': newEstado = 'in_contact'; break;
        case 'reunion': newEstado = 'in_contact'; break;
        case 'negociacion': newEstado = 'proposal_sent'; break;
        case 'produccion': newEstado = 'won'; break;
        case 'perdido': newEstado = 'lost'; break;
    }

    const updatePayload: any = {
        pipeline_stage,
        pipeline_order
    };

    if (newEstado) {
        updatePayload.estado = newEstado;
    }

    const { data, error } = await supabase
        .from('leads')
        .update(updatePayload)
        .eq('id', id)
        .select();

    if (error) {
        console.error('Pipeline update error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
}

// PUT: Update card position (Stage & Order)
export async function PUT(request: Request) {
    return handleUpdate(request);
}

// POST: Also support POST for compatibility
export async function POST(request: Request) {
    return handleUpdate(request);
}
