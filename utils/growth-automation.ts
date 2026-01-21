import { createClient } from '@/utils/supabase/client';
import { GROWTH_PLANS } from '@/components/growth/plans';

type PlanTier = 'foundation' | 'velocity' | 'dominance';

interface PlanTask {
    title: string;
    category: string;
    is_recurring: boolean;
    recurrence?: string;
}

export async function generatePlanTasks(clientId: string, tier: PlanTier) {
    const supabase = createClient();
    const plan = GROWTH_PLANS[tier as keyof typeof GROWTH_PLANS];

    if (!plan) throw new Error(`Invalid plan tier: ${tier}`);

    const tasksToInsert = (plan.tasks as PlanTask[]).map(task => ({
        client_id: clientId,
        title: task.title,
        category: task.category,
        is_recurring: task.is_recurring,
        recurrence_interval: task.recurrence || null,
        status: 'pending',
        due_date: new Date(Date.now() + 86400000 * 7).toISOString(), // Due in 7 days default
    }));

    const { error } = await supabase.from('growth_tasks').insert(tasksToInsert);

    if (error) throw error;

    // Update Client Plan
    await supabase.from('growth_clients').update({
        plan_tier: tier,
        updated_at: new Date().toISOString()
    }).eq('id', clientId);

    return tasksToInsert.length;
}
