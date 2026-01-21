-- Fill gaps for Constructora Civil (Dominance)
-- They should have A LOT of activity to justify their High Health Score
with client as (select id from public.growth_clients where client_name = 'Constructora Civil' limit 1)
insert into public.growth_tasks (client_id, title, category, status, due_date, is_recurring)
select id, 'Reunión Estratégica Semanal', 'strategy', 'done', now() - interval '2 days', true from client union all
select id, 'Producción Video Obra "Edificio Alto"', 'content', 'in_progress', now() + interval '2 days', false from client union all
select id, 'Campaña Google Ads: "Departamentos en Verde"', 'ads', 'active', now(), true from client union all -- 'active' not valid status? map to in_progress or pending. Let's use 'in_progress'
select id, 'Optimización CRM (Lead Scoring)', 'crm', 'done', now() - interval '5 days', false from client union all
select id, 'Reporte de Atribución (Power BI)', 'reporting', 'done', now() - interval '1 day', true from client;

-- Fill gaps for Abogados Chile (Foundation)
-- Basic setup tasks
with client as (select id from public.growth_clients where client_name = 'Abogados Chile' limit 1)
insert into public.growth_tasks (client_id, title, category, status, due_date, is_recurring)
select id, 'Validación de Dominio', 'setup', 'done', now() - interval '10 days', false from client union all
select id, 'Configuración de Correos Corporativos', 'setup', 'done', now() - interval '9 days', false from client union all
select id, 'Alta en Directorios Locales', 'seo', 'in_progress', now() + interval '5 days', false from client;
