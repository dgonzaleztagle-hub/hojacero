import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { reportId: string } }
) {
    try {
        const supabase = await createClient();

        // Fetch report from database
        const { data: report, error } = await supabase
            .from('territorial_reports')
            .select('*')
            .eq('id', params.reportId)
            .single();

        if (error || !report) {
            return NextResponse.json(
                { error: 'Reporte no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(report);
    } catch (error) {
        console.error('Error fetching report:', error);
        return NextResponse.json(
            { error: 'Error al cargar el reporte' },
            { status: 500 }
        );
    }
}
