-- Academy Schema

create table public.academy_progress (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) not null,
    module_id text not null, -- e.g. 'growth-os-101'
    status text check (status in ('locked', 'in_progress', 'completed')) default 'locked',
    quiz_score int default 0,
    last_accessed_at timestamptz default now(),
    unique(user_id, module_id)
);

-- RLS
alter table public.academy_progress enable row level security;

create policy "Users can view own progress" 
    on public.academy_progress for select 
    using (auth.uid() = user_id);

create policy "Users can update own progress" 
    on public.academy_progress for update 
    using (auth.uid() = user_id);
    
create policy "Users can insert own progress" 
    on public.academy_progress for insert 
    with check (auth.uid() = user_id);
