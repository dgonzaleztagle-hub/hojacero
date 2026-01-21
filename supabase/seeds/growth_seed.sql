-- Seed Growth Clients
insert into public.growth_clients (client_name, website, plan_tier, health_score, status, next_audit_date)
values 
    ('DermoEstetica', 'dermoestetica.cl', 'velocity', 85, 'active', now() + interval '14 days'),
    ('Abogados Chile', 'abogadoschile.cl', 'foundation', 100, 'active', now() + interval '30 days'),
    ('Constructora Civil', 'constructora.cl', 'dominance', 92, 'active', now() + interval '7 days');

-- Seed Growth Tasks for DermoEstetica (Velocity Plan)
with client as (select id from public.growth_clients where client_name = 'DermoEstetica' limit 1)
insert into public.growth_tasks (client_id, title, category, status, due_date, is_recurring)
select 
    id, 
    'Optimizar Google Ads (Search Keywords)', 
    'ads', 
    'pending', 
    now() + interval '1 day',
    true
from client
union all
select 
    id, 
    'Crear Landing Page "Depilación Láser"', 
    'content', 
    'in_progress', 
    now() + interval '3 days',
    false
from client
union all
select 
    id, 
    'Reporte Mensual Enero', 
    'reporting', 
    'done', 
    now() - interval '2 days',
    true
from client;

-- Seed Growth Tasks for Abogados (Foundation Plan)
with client as (select id from public.growth_clients where client_name = 'Abogados Chile' limit 1)
insert into public.growth_tasks (client_id, title, category, status, due_date, is_recurring)
select 
    id, 
    'Verificar Google My Business', 
    'setup', 
    'done', 
    now() - interval '5 days',
    false
from client
union all
select 
    id, 
    'Instalar Meta Pixel', 
    'setup', 
    'done', 
    now() - interval '5 days',
    false
from client;
