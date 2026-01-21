export interface GrowthClient {
    id: string;
    client_name: string;
    plan_tier: string;
    health_score: number;
    next_audit_date: string;
    active_modules: Record<string, boolean>; // e.g. { ads: true, seo: false }
}

export interface GrowthTask {
    id: string;
    client_id: string;
    plan_id: string | null;
    title: string;
    category: string;
    status: string;
    priority: string;
    due_datetime: string | null;
    recurrence: { type: string; day?: number; hour?: number } | null;
    evidence_url: string | null;
    evidence_notes: string | null;
    is_enabled: boolean;
    completed_at: string | null;
}
