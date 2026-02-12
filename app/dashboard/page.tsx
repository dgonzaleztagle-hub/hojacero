
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const supabase = await createClient();

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // 2. Fetch Data (Optimized Parallel Fetch)
    const [
        { data: leads },
        { data: sites },
        { data: wonLeads },
        { data: pagos }
    ] = await Promise.all([
        supabase.from('leads').select('id, estado, pipeline_stage, next_action_date, next_action_note, nombre, created_at, last_activity_at'),
        supabase.from('monitored_sites').select('id, status, monto_mensual, site_status(is_active)'),
        supabase.from('leads').select('deal_type, deal_amount, partner_split').eq('estado', 'won'),
        supabase.from('pagos').select('monto, fecha_pago, tipo')
    ]);

    // --- CALCULATIONS: OPERATIONS ---
    const getStage = (l: any) => {
        if (l.pipeline_stage) return l.pipeline_stage.toLowerCase();
        if (l.estado === 'ready_to_contact') return 'radar';
        if (l.estado === 'in_contact') return 'contactado';
        if (l.estado === 'proposal_sent') return 'negociacion';
        if (l.estado === 'won') return 'produccion';
        return 'unknown';
    };

    const leadsInProcess = (leads || []).filter(l => {
        const s = getStage(l);
        return s === 'contactado' || s === 'reunion' || s === 'negociacion';
    }).length;

    const leadsWon = (leads || []).filter(l => getStage(l) === 'produccion').length;

    // Action Items
    const today = new Date();
    const bufferDate = new Date(today);
    bufferDate.setDate(today.getDate() + 1);
    const bufferIso = bufferDate.toISOString().split('T')[0];

    const actionItems = (leads || []).filter(l => {
        const hasAgenda = l.next_action_date && l.next_action_date.split('T')[0] <= bufferIso;
        const stage = getStage(l);
        const isStale = (stage === 'contactado' || stage === 'in_contact') &&
            (new Date().getTime() - new Date(l.last_activity_at || l.created_at).getTime() > 3 * 24 * 60 * 60 * 1000);
        return hasAgenda || isStale;
    }).sort((a, b) => {
        const dateA = a.next_action_date ? new Date(a.next_action_date).getTime() : 0;
        const dateB = b.next_action_date ? new Date(b.next_action_date).getTime() : 0;
        return dateA - dateB;
    });

    // --- CALCULATIONS: FINANCIALS ---
    const mrr = (sites || []).reduce((sum, s) => {
        const isActive = s.status === 'active' && s.site_status?.[0]?.is_active !== false;
        return sum + (isActive ? (s.monto_mensual || 0) : 0);
    }, 0);

    const yearTotal = (pagos || []).reduce((sum, p) => {
        const isThisYear = new Date(p.fecha_pago).getFullYear() === new Date().getFullYear();
        return sum + (isThisYear ? (p.monto || 0) : 0);
    }, 0);

    // Partner Splits
    let danielTotal = 0;
    let gastonTotal = 0;
    wonLeads?.forEach(lead => {
        const amount = lead.deal_amount || 0;
        const split = lead.partner_split === 'daniel_major' ? 0.65 : (lead.partner_split === 'gaston_major' ? 0.35 : 0.65);
        danielTotal += amount * split;
        gastonTotal += amount * (1 - split);
    });

    return (
        <DashboardClient
            user={user}
            leadsInProcess={leadsInProcess}
            leadsWon={leadsWon}
            mrr={mrr}
            yearTotal={yearTotal}
            actionItems={actionItems}
            danielTotal={danielTotal}
            gastonTotal={gastonTotal}
        />
    );
}
