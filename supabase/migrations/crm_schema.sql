-- Create BUSQUEDAS table
create table if not exists busquedas (
  id uuid default gen_random_uuid() primary key,
  terminos_busqueda text,
  zona text,
  cantidad_resultados int,
  created_at timestamptz default now()
);
alter table busquedas enable row level security;
create policy "Allow all for anon" on busquedas for all using (true) with check (true);

-- Create LEADS table
create table if not exists leads (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  direccion text,
  telefono text,
  email text,
  sitio_web text,
  instagram text,
  facebook text,
  linkedin text,
  twitter text,
  horario_atencion text,
  categoria text, -- 'pluscontable', 'cloudelab', etc.
  fuente text, -- 'radar', 'manual', etc.
  zona_busqueda text,
  puntaje_oportunidad int,
  razon_ia text,
  servicios_sugeridos text[],
  estado_web text, -- 'sin_web', 'web_pobre', etc.
  estado_email text,
  estado text default 'nuevo', --Pipeline status
  prioridad text default 'media',
  fecha_ultimo_contacto timestamptz,
  fecha_proximo_seguimiento timestamptz,
  descartado boolean default false,
  busqueda_id uuid references busquedas(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table leads enable row level security;
create policy "Allow all for anon" on leads for all using (true) with check (true);

-- Notes table
create table if not exists lead_notas (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid references leads(id) on delete cascade not null,
  contenido text not null,
  created_at timestamptz default now()
);
alter table lead_notas enable row level security;
create policy "Allow all for anon" on lead_notas for all using (true) with check (true);

-- Email Templates
create table if not exists email_plantillas (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  asunto text not null,
  contenido text not null,
  categoria text default 'general',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table email_plantillas enable row level security;
create policy "Allow all for anon" on email_plantillas for all using (true) with check (true);

-- Sent Emails Log
create table if not exists email_enviados (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid references leads(id) on delete set null,
  plantilla_id uuid references email_plantillas(id) on delete set null,
  email_destino text not null,
  asunto text not null,
  estado text default 'enviado',
  created_at timestamptz default now()
);
alter table email_enviados enable row level security;
create policy "Allow all for anon" on email_enviados for all using (true) with check (true);
