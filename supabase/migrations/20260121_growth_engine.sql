-- Create Growth Clients Table
create table if not exists public.growth_clients (
    id uuid default gen_random_uuid() primary key,
    lead_id uuid references public.leads(id) on delete set null,
    client_name text not null,
    website text,
    plan_tier text default 'foundation', -- foundation, velocity, dominance, custom
    status text default 'active', -- active, paused, churned
    health_score integer default 100,
    onboarding_date timestamptz default now(),
    next_audit_date timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create Growth Tasks Table
create table if not exists public.growth_tasks (
    id uuid default gen_random_uuid() primary key,
    client_id uuid references public.growth_clients(id) on delete cascade not null,
    task_key text, -- e.g., 'setup_ga4'
    title text not null,
    category text default 'general', -- setup, seo, ads, content, reporting
    status text default 'pending', -- pending, in_progress, done, blocked
    is_recurring boolean default false,
    recurrence_interval text, -- 'monthly', 'weekly'
    due_date timestamptz,
    completed_at timestamptz,
    evidence_link text,
    assigned_to text,
    created_at timestamptz default now()
);

-- Create Growth Logs Table
create table if not exists public.growth_logs (
    id uuid default gen_random_uuid() primary key,
    client_id uuid references public.growth_clients(id) on delete cascade,
    action text not null,
    details jsonb,
    created_at timestamptz default now()
);

-- RLS Policies
alter table public.growth_clients enable row level security;
alter table public.growth_tasks enable row level security;
alter table public.growth_logs enable row level security;

create policy "Enable all access for authenticated users" on public.growth_clients
    for all using (auth.role() = 'authenticated');

create policy "Enable all access for authenticated users" on public.growth_tasks
    for all using (auth.role() = 'authenticated');

create policy "Enable all access for authenticated users" on public.growth_logs
    for all using (auth.role() = 'authenticated');

-- Indexes
create index if not exists idx_growth_clients_status on public.growth_clients(status);
create index if not exists idx_growth_tasks_client_id on public.growth_tasks(client_id);
create index if not exists idx_growth_tasks_status on public.growth_tasks(status);
