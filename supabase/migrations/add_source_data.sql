alter table leads add column if not exists source_data jsonb default '{}'::jsonb;
alter table leads add column if not exists telefono text; -- just in case it was missing in some version
