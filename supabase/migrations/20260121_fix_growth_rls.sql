-- Enable RLS but allow public access for prototype purposes on local env
-- This fixes the "empty object" error when fetching data without auth context

-- Growth Clients
alter table public.growth_clients enable row level security;
drop policy if exists "Enable all access for authenticated users" on public.growth_clients;
create policy "Public Access" on public.growth_clients for all using (true) with check (true);

-- Growth Tasks
alter table public.growth_tasks enable row level security;
drop policy if exists "Enable all access for authenticated users" on public.growth_tasks;
create policy "Public Access" on public.growth_tasks for all using (true) with check (true);

-- Growth Logs
alter table public.growth_logs enable row level security;
drop policy if exists "Enable all access for authenticated users" on public.growth_logs;
create policy "Public Access" on public.growth_logs for all using (true) with check (true);
