-- Growth OS v2 Schema Updates

-- 1. Add active_modules to growth_clients
-- Stores JSON like {"ads": true, "seo": false}
alter table public.growth_clients 
add column if not exists active_modules jsonb default '{}'::jsonb;

-- 2. Add priority to growth_tasks
-- High, Normal, Low
alter table public.growth_tasks 
add column if not exists priority text default 'normal';

-- 3. Add task settings (optional, for future Configurator logic)
-- alter table public.growth_plans add column ... (Maybe later)
