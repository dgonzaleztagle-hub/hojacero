-- Function to calculate Health Score based on Task Completion
create or replace function public.calculate_health_score()
returns trigger as $$
declare
    total_tasks int;
    completed_tasks int;
    new_score int;
begin
    -- Count tasks for the specific client
    select count(*), count(*) filter (where status = 'done')
    into total_tasks, completed_tasks
    from public.growth_tasks
    where client_id = NEW.client_id; -- Use NEW.client_id to identify the target client

    -- Avoid division by zero
    if total_tasks = 0 then
        new_score := 100; -- Default to 100 if no tasks? Or 0? Let's say 50 for neutral. Or 100 for "clean slate". Let's do 0 for "nothing done".
        -- Actually, if no tasks, maybe ignore. But let's set to 50.
        new_score := 50;
    else
        new_score := round((completed_tasks::decimal / total_tasks::decimal) * 100);
    end if;

    -- Update the client's health_score
    update public.growth_clients
    set health_score = new_score,
        updated_at = now()
    where id = NEW.client_id;

    return NEW;
end;
$$ language plpgsql security definer;

-- Trigger: Run on INSERT, UPDATE, DELETE of growth_tasks
drop trigger if exists on_task_change on public.growth_tasks;
create trigger on_task_change
after insert or update of status or delete
on public.growth_tasks
for each row
execute function public.calculate_health_score();
