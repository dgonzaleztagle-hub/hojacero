import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import ReportPrintView from './ReportPrintView';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export default async function PrintPage({ params }: { params: Promise<{ reportId: string }> }) {
    const { reportId } = await params;
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const { data: report, error } = await supabase
        .from('territorial_reports')
        .select('*')
        .eq('id', reportId)
        .single();

    if (error || !report) {
        notFound();
    }

    return <ReportPrintView report={report} />;
}
