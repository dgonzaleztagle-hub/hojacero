import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { ReportClient } from './ReportClient';

interface PageProps {
    params: { reportId: string };
}

export default async function ReportePage(props: PageProps) {
    // Await params in Next.js 15
    const params = await props.params;

    // Create Supabase client
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Fetch report from database
    const { data: report, error } = await supabase
        .from('territorial_reports')
        .select('*')
        .eq('id', params.reportId)
        .single();

    if (error || !report) {
        notFound();
    }

    return <ReportClient report={report} />;
}
