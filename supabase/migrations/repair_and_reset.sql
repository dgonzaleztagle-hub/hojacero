-- 🛠️ REPARACIÓN Y LIMPIEZA TOTAL (Script Robusto)

-- 1. Intentar borrar datos (solo si las tablas existen)
-- Usamos bloques DO para manejar errores si la tabla no existe al truncar.
DO $$ 
BEGIN 
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'lead_notas') THEN 
        TRUNCATE TABLE lead_notas CASCADE; 
    END IF; 
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'email_enviados') THEN 
        TRUNCATE TABLE email_enviados CASCADE; 
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'leads') THEN 
        TRUNCATE TABLE leads CASCADE; 
    END IF;
END $$;


-- 2. Asegurar que TODAS las tablas existan (Idempotente)

-- Tabla LEADS (Si no existe, la crea)
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
  categoria text,
  fuente text,
  zona_busqueda text,
  puntaje_oportunidad int,
  razon_ia text,
  servicios_sugeridos text[],
  estado_web text,
  estado_email text,
  estado text default 'nuevo',
  prioridad text default 'media',
  fecha_ultimo_contacto timestamptz,
  fecha_proximo_seguimiento timestamptz,
  descartado boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabla NOTAS
create table if not exists lead_notas (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid references leads(id) on delete cascade not null,
  contenido text not null,
  created_at timestamptz default now()
);

-- Tabla EMAIL PLANTILLAS
create table if not exists email_plantillas (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  asunto text not null,
  contenido text not null,
  categoria text default 'general',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabla EMAIL ENVIADOS
create table if not exists email_enviados (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid references leads(id) on delete set null,
  plantilla_id uuid references email_plantillas(id) on delete set null,
  email_destino text not null,
  asunto text not null,
  estado text default 'enviado',
  created_at timestamptz default now()
);

-- 3. Habilitar Seguridad Básica (RLS pública para empezar)
alter table leads enable row level security;
create policy "Public Access Leads" on leads for all using (true);

alter table lead_notas enable row level security;
create policy "Public Access Notas" on lead_notas for all using (true);

alter table email_enviados enable row level security;
create policy "Public Access Emails" on email_enviados for all using (true);

alter table email_plantillas enable row level security;
create policy "Public Access Plantillas" on email_plantillas for all using (true);

SELECT '✅ Reparación Completada: Datos borrados y Tablas creadas.' as status;
