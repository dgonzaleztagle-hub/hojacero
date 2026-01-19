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
-- Pipeline de Leads - Migración de campos y tabla de actividad
-- Fecha: 2026-01-14
-- Propósito: Agregar campos de auditoría a leads y crear tabla de activity log

-- 1. Agregar campos de auditoría a leads
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS nota_revision TEXT,
ADD COLUMN IF NOT EXISTS revisado_por TEXT,
ADD COLUMN IF NOT EXISTS revisado_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS whatsapp TEXT;

-- 2. Actualizar estados válidos (comentario de referencia)
-- Estados: 'detected', 'discarded', 'ready_to_contact', 'in_contact', 'proposal_sent', 'won', 'lost'

-- 3. Crear tabla de activity log para auditoría
CREATE TABLE IF NOT EXISTS lead_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  usuario TEXT NOT NULL,  -- 'Daniel' o 'Gaston'
  accion TEXT NOT NULL,   -- 'reviewed', 'discarded', 'moved_to_contact', 'contacted', etc.
  nota TEXT,              -- Nota opcional del usuario
  estado_anterior TEXT,   -- Estado antes del cambio
  estado_nuevo TEXT,      -- Estado después del cambio
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Habilitar RLS
ALTER TABLE lead_activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON lead_activity_log FOR ALL USING (true) WITH CHECK (true);

-- 5. Índices para performance
CREATE INDEX IF NOT EXISTS idx_lead_activity_log_lead_id ON lead_activity_log(lead_id);
CREATE INDEX IF NOT EXISTS idx_leads_estado ON leads(estado);
-- =================================================================================================
-- PIPELINE & CRM MIGRATION
-- =================================================================================================

-- 1. Create a custom type for Pipeline Stages to ensure data consistency
-- Order matters: radar -> contact -> negotiation -> production -> closed/lost
CREATE TYPE pipeline_stage_type AS ENUM (
    'radar',           -- Detectado / Por contactar
    'contactado',      -- Ya se envió mensaje/email
    'reunion',         -- Se agendó reunión o se envió propuesta
    'negociacion',     -- Discutiendo presupuesto/alcance
    'produccion',      -- ¡Venta Cerrada! (Handover a Dev)
    'perdido'          -- No interesado (por ahora)
);

-- 2. Update 'leads' table with CRM superpowers
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS pipeline_stage pipeline_stage_type DEFAULT 'radar',
ADD COLUMN IF NOT EXISTS pipeline_order INTEGER DEFAULT 0, -- For Drag & Drop positioning
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',         -- Array of strings: ['urgente', 'factory', 'corporate']
ADD COLUMN IF NOT EXISTS service_type TEXT DEFAULT 'full'; -- 'full', 'dev', 'marketing'

-- 3. Create an index to make the Kanban board load instantly
CREATE INDEX IF NOT EXISTS idx_leads_pipeline_stage ON leads(pipeline_stage);
CREATE INDEX IF NOT EXISTS idx_leads_pipeline_order ON leads(pipeline_order);

-- 4. Initial Migration of Data
-- Map existing statuses (from 'estado' column) to new pipeline stages
-- Values in 'estado': detected, ready_to_contact, in_contact, proposal_sent, won, lost, discarded

UPDATE leads SET pipeline_stage = 'radar' WHERE estado IN ('detected', 'ready_to_contact');
UPDATE leads SET pipeline_stage = 'contactado' WHERE estado = 'in_contact';
UPDATE leads SET pipeline_stage = 'negociacion' WHERE estado = 'proposal_sent';
UPDATE leads SET pipeline_stage = 'produccion' WHERE estado = 'won';
UPDATE leads SET pipeline_stage = 'perdido' WHERE estado IN ('discarded', 'lost');

-- 5. Helper Function to reorder cards (Critical for Frontend Drag & Drop)
-- This allows us to reorder a card and shift others automatically if needed, 
-- or we can handle it via frontend-first optimistic updates. 
-- For now, simple update is enough.

COMMENT ON COLUMN leads.pipeline_stage IS 'Current column in the Kanban board';
COMMENT ON COLUMN leads.pipeline_order IS 'Vertical position in the Kanban column';
-- Create demo_industries table
CREATE TABLE IF NOT EXISTS demo_industries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create demo_prompts table
CREATE TABLE IF NOT EXISTS demo_prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    industry_id UUID REFERENCES demo_industries(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('art_direction', 'copywriting', 'image_generation', 'analysis')),
    content TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE demo_industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_prompts ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow read for everyone for now, modify as needed)
CREATE POLICY "Allow public read industries" ON demo_industries FOR SELECT USING (true);
CREATE POLICY "Allow public read prompts" ON demo_prompts FOR SELECT USING (true);

-- Seed Industries
INSERT INTO demo_industries (name, slug, description) VALUES
('Salud & Estética', 'salud', 'Clínicas dentales, medicina estética, dermatología, cirugía plástica.'),
('Gastronomía Premium', 'gastronomia', 'Restaurantes de autor, alta cocina, bares de especialidad, dark kitchens high-end.'),
('Real Estate', 'real-estate', 'Inmobiliarias, venta de propiedades de lujo, arquitectura, interiorismo.'),
('Legal & Corporativo', 'legal', 'Bufetes de abogados, consultoras financieras, notarías, servicios B2B.'),
('Automotriz & Detailing', 'automotriz', 'Car detailing, venta de autos de lujo, talleres de performance.')
ON CONFLICT (slug) DO NOTHING;

-- Seed Prompts (Example for Gastronomy - we can add more later)
WITH industry AS (SELECT id FROM demo_industries WHERE slug = 'gastronomia')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT 
    id, 
    'art_direction', 
    'Estilo "Dark & Moody". Fondo negro mate o carbón. Tipografía serif elegante (Playfair Display) para títulos. Fotografía macro con iluminación dramática. Acentos dorados sutiles.', 
    'Vibe Moody Chef'
FROM industry;

WITH industry AS (SELECT id FROM demo_industries WHERE slug = 'real-estate')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT 
    id, 
    'art_direction', 
    'Estilo "Brutalismo Refinado". Mucho espacio blanco negativo. Tipografía Sans-Serif grotesca (Helvetica/Inter) gigante. Imágenes a sangre (full width).', 
    'Vibe Swiss Architect'
FROM industry;
-- =====================================================
-- MIGRACIÓN: Campos de Implementación y Cobro
-- Fecha: 2026-01-17
-- Propósito: Datos financieros adicionales para Vault
-- =====================================================

-- 1. Campos de implementación (pago inicial del sitio)
ALTER TABLE monitored_sites ADD COLUMN IF NOT EXISTS monto_implementacion INT DEFAULT 0;
ALTER TABLE monitored_sites ADD COLUMN IF NOT EXISTS cuotas_implementacion INT DEFAULT 1;
ALTER TABLE monitored_sites ADD COLUMN IF NOT EXISTS cuotas_pagadas INT DEFAULT 0;

-- 2. Día de cobro mensual
ALTER TABLE monitored_sites ADD COLUMN IF NOT EXISTS dia_cobro INT DEFAULT 15;

-- 3. Modificar tabla pagos para distinguir tipo
ALTER TABLE pagos ADD COLUMN IF NOT EXISTS tipo TEXT DEFAULT 'mantencion' 
  CHECK (tipo IN ('mantencion', 'implementacion'));

-- 4. Índice para reportes de métricas
CREATE INDEX IF NOT EXISTS idx_pagos_fecha ON pagos(fecha_pago);
CREATE INDEX IF NOT EXISTS idx_pagos_tipo ON pagos(tipo);
-- Tabla para el chat interno/bitácora (Polimórfica simplificada)
CREATE TABLE IF NOT EXISTS bitacora_clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES monitored_sites(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE, -- Soporte para Pipeline/Leads
    author TEXT NOT NULL CHECK (author IN ('Yo', 'Gaston', 'Sistema')),
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT chk_bitacora_reference CHECK (client_id IS NOT NULL OR lead_id IS NOT NULL)
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_bitacora_client_id ON bitacora_clientes(client_id);
CREATE INDEX IF NOT EXISTS idx_bitacora_lead_id ON bitacora_clientes(lead_id);
CREATE INDEX IF NOT EXISTS idx_bitacora_created_at ON bitacora_clientes(created_at DESC);

-- RLS (Permisiva por ahora para dashboard interno)
ALTER TABLE bitacora_clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access for authenticated users" ON bitacora_clientes
    FOR ALL USING (auth.role() = 'authenticated');

-- Trigger para actualizar updated_at del cliente cuando hay nuevo mensaje (opcional, para ordenar por actividad)
-- (Omitido por ahora para mantener simpleza)
-- =====================================================
-- MIGRACIÓN: Vault - Pagos y Alertas
-- Fecha: 2026-01-17
-- Propósito: Tablas para gestión de pagos y alertas
-- =====================================================

-- 1. MODIFICAR monitored_sites - Agregar campos faltantes
ALTER TABLE monitored_sites ADD COLUMN IF NOT EXISTS monto_mensual INT DEFAULT 20000;
ALTER TABLE monitored_sites ADD COLUMN IF NOT EXISTS email_contacto TEXT;
ALTER TABLE monitored_sites ADD COLUMN IF NOT EXISTS telefono_contacto TEXT;

-- 2. TABLA: pagos
-- Historial de pagos por cliente
CREATE TABLE IF NOT EXISTS pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES monitored_sites(id) ON DELETE CASCADE,
  
  -- Monto y período
  monto INT NOT NULL,
  periodo_mes INT NOT NULL CHECK (periodo_mes >= 1 AND periodo_mes <= 12),
  periodo_ano INT NOT NULL CHECK (periodo_ano >= 2020),
  fecha_pago DATE NOT NULL,
  
  -- Detalles
  metodo TEXT CHECK (metodo IN ('transferencia', 'efectivo', 'tarjeta', 'otro')),
  notas TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas
CREATE INDEX IF NOT EXISTS idx_pagos_site ON pagos(site_id);
CREATE INDEX IF NOT EXISTS idx_pagos_periodo ON pagos(periodo_ano, periodo_mes);

-- Políticas RLS
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas_enviadas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users full access" ON pagos;
DROP POLICY IF EXISTS "Authenticated users full access" ON alertas_enviadas;

DROP POLICY IF EXISTS "Public full access" ON pagos;
DROP POLICY IF EXISTS "Public full access" ON alertas_enviadas;

CREATE POLICY "Public full access" ON pagos
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public full access" ON alertas_enviadas
    FOR ALL USING (true) WITH CHECK (true);

-- 3. TABLA: alertas_enviadas
-- Log de emails de recordatorio enviados
CREATE TABLE IF NOT EXISTS alertas_enviadas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES monitored_sites(id) ON DELETE CASCADE,
  
  -- Tipo de alerta
  tipo TEXT NOT NULL CHECK (tipo IN ('vencimiento', 'dia_1', 'dia_7', 'dia_14', 'suspension')),
  
  -- Tracking
  enviado_at TIMESTAMPTZ DEFAULT NOW(),
  email_destino TEXT,
  resend_id TEXT, -- ID de Resend para tracking de apertura
  
  -- Estado
  abierto BOOLEAN DEFAULT FALSE,
  abierto_at TIMESTAMPTZ
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_alertas_site ON alertas_enviadas(site_id);
CREATE INDEX IF NOT EXISTS idx_alertas_tipo ON alertas_enviadas(tipo);



-- 4. VISTA: estado_clientes
-- Vista calculada con el estado de pago de cada cliente
CREATE OR REPLACE VIEW estado_clientes AS
SELECT 
  ms.id,
  ms.client_name,
  ms.site_url,
  ms.plan_type,
  ms.monto_mensual,
  ms.status,
  ms.contract_start,
  ms.contract_end,
  ms.email_contacto,
  ss.is_active,
  
  -- Último pago
  (SELECT MAX(fecha_pago) FROM pagos WHERE site_id = ms.id) as ultimo_pago,
  
  -- Total pagado
  (SELECT COALESCE(SUM(monto), 0) FROM pagos WHERE site_id = ms.id) as total_pagado,
  
  -- Meses pagados
  (SELECT COUNT(*) FROM pagos WHERE site_id = ms.id) as meses_pagados,
  
  -- Alertas enviadas
  (SELECT COUNT(*) FROM alertas_enviadas WHERE site_id = ms.id) as alertas_count,
  
  -- Días desde último pago
  COALESCE(
    EXTRACT(DAY FROM NOW() - (SELECT MAX(fecha_pago) FROM pagos WHERE site_id = ms.id))::INT,
    EXTRACT(DAY FROM NOW() - ms.contract_start)::INT
  ) as dias_desde_pago

FROM monitored_sites ms
LEFT JOIN site_status ss ON ms.id = ss.id
WHERE ms.status = 'active';
-- Asegurar que las columnas para credenciales existen
-- Es idempotente (si ya existen, no hace nada malo)

DO $$ 
BEGIN 
    -- 1. Agregar columna credentials si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monitored_sites' AND column_name = 'credentials') THEN
        ALTER TABLE monitored_sites ADD COLUMN credentials JSONB DEFAULT '{}'::jsonb;
    END IF;

    -- 2. Agregar columna hosting_provider si no existe (para separar del type)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monitored_sites' AND column_name = 'hosting_provider') THEN
        ALTER TABLE monitored_sites ADD COLUMN hosting_provider TEXT DEFAULT 'Vercel';
    END IF;

    -- 3. Asegurar que pagos tenga created_at para ordenamiento preciso
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pagos' AND column_name = 'created_at') THEN
        ALTER TABLE pagos ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;
-- =====================================================
-- MIGRACIÓN: Sistema de Retención "El Vigilante"
-- Fecha: 2026-01-17
-- Propósito: Tablas para gestión de clientes post-venta
-- =====================================================

-- 1. TABLA: monitored_sites
-- Sitios de clientes bajo mantención mensual
CREATE TABLE IF NOT EXISTS monitored_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Datos del cliente
  client_name TEXT NOT NULL,
  site_url TEXT NOT NULL,
  local_path TEXT, -- Ruta local: d:/clientes/[nombre]/
  
  -- Hosting
  hosting_type TEXT CHECK (hosting_type IN ('vercel', 'netlify', 'cpanel', 'ftp', 'other')),
  credentials JSONB, -- { "user": "...", "password": "...", "host": "..." }
  
  -- Programación de mantención
  maintenance_day INT CHECK (maintenance_day >= 1 AND maintenance_day <= 28), -- Día del mes
  plan_type TEXT DEFAULT 'basic' CHECK (plan_type IN ('basic', 'pro', 'enterprise')),
  
  -- Relación con lead original (opcional)
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  
  -- Estado
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  
  -- Fechas
  contract_start DATE,
  contract_end DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas comunes
CREATE INDEX IF NOT EXISTS idx_monitored_sites_status ON monitored_sites(status);
CREATE INDEX IF NOT EXISTS idx_monitored_sites_maintenance_day ON monitored_sites(maintenance_day);

-- 2. TABLA: site_status (Kill Switch)
-- Control de activación/desactivación de sitios
CREATE TABLE IF NOT EXISTS site_status (
  id UUID PRIMARY KEY REFERENCES monitored_sites(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  deactivated_at TIMESTAMPTZ,
  reason TEXT CHECK (reason IN ('moroso', 'solicitud_cliente', 'mantenimiento', 'otro')),
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA: maintenance_logs
-- Historial de mantenciones realizadas
CREATE TABLE IF NOT EXISTS maintenance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES monitored_sites(id) ON DELETE CASCADE,
  
  -- Trabajo realizado
  performed_at TIMESTAMPTZ DEFAULT NOW(),
  changes JSONB, -- { "images_optimized": 8, "links_fixed": 2, "deps_updated": true }
  
  -- Reporte
  report_url TEXT, -- URL del PDF en Storage
  report_sent BOOLEAN DEFAULT FALSE,
  report_sent_at TIMESTAMPTZ,
  
  -- Estado del deploy
  deployed BOOLEAN DEFAULT FALSE,
  deployed_at TIMESTAMPTZ,
  
  -- Notas
  notes TEXT
);

-- Índice para búsquedas por sitio
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_site ON maintenance_logs(site_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_date ON maintenance_logs(performed_at DESC);

-- 4. TRIGGER: Actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_monitored_sites_updated_at ON monitored_sites;
CREATE TRIGGER update_monitored_sites_updated_at
  BEFORE UPDATE ON monitored_sites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_status_updated_at ON site_status;
CREATE TRIGGER update_site_status_updated_at
  BEFORE UPDATE ON site_status
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. RLS (Row Level Security) - Básico por ahora
ALTER TABLE monitored_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;

-- Política: Solo usuarios autenticados pueden ver/modificar
-- Política: Acceso público (Desarrollo / Sin Login)
DROP POLICY IF EXISTS "Public full access" ON monitored_sites;
CREATE POLICY "Public full access" ON monitored_sites
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access" ON site_status;
CREATE POLICY "Public full access" ON site_status
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access" ON maintenance_logs;
CREATE POLICY "Public full access" ON maintenance_logs
  FOR ALL USING (true) WITH CHECK (true);


-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'member', -- 'admin', 'member'
  email TEXT,
  updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING ( true );

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING ( auth.uid() = id );

-- Trigger for new users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email, username)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    new.email,
    new.email -- Default username to email initially
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Grant access
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.profiles TO anon, authenticated, service_role;
-- Create bucket if not exists
insert into storage.buckets (id, name, public)
values ('client-assets', 'client-assets', true)
on conflict (id) do nothing;

-- Enable RLS
alter table storage.objects enable row level security;

-- Policy: Public Read (for Hunter AI / Email links)
drop policy if exists "Public Access client-assets" on storage.objects;
create policy "Public Access client-assets"
  on storage.objects for select
  using ( bucket_id = 'client-assets' );

-- Policy: Authenticated Upload (for Dashboard User)
drop policy if exists "Auth Upload client-assets" on storage.objects;
create policy "Auth Upload client-assets"
  on storage.objects for insert
  with check ( bucket_id = 'client-assets' and auth.role() = 'authenticated' );

-- Policy: Authenticated Update/Delete (optional, for overwriting)
drop policy if exists "Auth Manage client-assets" on storage.objects;
create policy "Auth Manage client-assets"
  on storage.objects for all
  using ( bucket_id = 'client-assets' and auth.role() = 'authenticated' );
-- Create table for storing incoming emails
CREATE TABLE IF NOT EXISTS email_inbox (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender TEXT NOT NULL,
    recipient TEXT NOT NULL,
    subject TEXT,
    body_text TEXT,
    body_html TEXT,
    raw_headers JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE email_inbox ENABLE ROW LEVEL SECURITY;

-- Allow Dashboard users (authenticated) to view and manage emails
CREATE POLICY "Users can view inbox" ON email_inbox
    FOR SELECT TO authenticated
    USING (true); -- Or filter by role if needed

CREATE POLICY "Users can update inbox" ON email_inbox
    FOR UPDATE TO authenticated
    USING (true);

-- Allow Service Role (Cloudflare Worker) to insert emails
-- (Service role bypasses RLS, so this is implicit, but good to note)
-- Tabla para almacenar firmas de correo
CREATE TABLE IF NOT EXISTS email_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,          -- Nombre identificador (ej: "Daniel Principal")
    content TEXT NOT NULL,        -- Contenido HTML de la firma
    is_default BOOLEAN DEFAULT FALSE, -- Si es la firma por defecto (opcional)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE email_signatures ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to signatures" ON email_signatures;
CREATE POLICY "Allow public read access to signatures" ON email_signatures FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert/update" ON email_signatures;
CREATE POLICY "Allow authenticated insert/update" ON email_signatures FOR ALL USING (true); -- Simplificado para desarrollo

-- Limpiar datos existentes para evitar duplicados y asegurar actualización de nombres
TRUNCATE TABLE email_signatures;

-- Seed: Firmas Iniciales (Daniel & Gastón)
INSERT INTO email_signatures (label, content, is_default) VALUES 
(
    'Daniel - Founder',
    '<p><br></p><div style="font-family: ''Inter'', ''Helvetica Neue'', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #1a1a1a;"><p style="margin-bottom: 4px;">Saludos,</p><p style="margin: 0; font-size: 16px;"><strong>Daniel González</strong></p><p style="margin: 0; color: #4f46e5; font-weight: 500;">Founder & Lead Architect</p><div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;"><p style="margin: 0; font-size: 13px;"><a href="https://hojacero.cl" style="color: #1a1a1a; text-decoration: none; font-weight: 600;">HOJACERO.CL</a><span style="color: #9ca3af; margin: 0 8px;">|</span><span style="color: #6b7280;">Architects of Digital Experiences</span></p></div></div>',
    TRUE
),
(
    'Gastón - Director Comercial',
    '<p><br></p><div style="font-family: ''Inter'', ''Helvetica Neue'', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #1a1a1a;"><p style="margin-bottom: 4px;">Atentamente,</p><p style="margin: 0; font-size: 16px;"><strong>Gastón Jofre</strong></p><p style="margin: 0; color: #4f46e5; font-weight: 500;">Director Comercial & Estrategia</p><div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;"><p style="margin: 0; font-size: 13px;"><a href="https://hojacero.cl" style="color: #1a1a1a; text-decoration: none; font-weight: 600;">HOJACERO.CL</a><span style="color: #9ca3af; margin: 0 8px;">|</span><span style="color: #6b7280;">Architects of Digital Experiences</span></p></div></div>',
    FALSE
);
-- Add Follow-up columns to leads
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS next_action_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS next_action_note TEXT,
ADD COLUMN IF NOT EXISTS urgency_level TEXT DEFAULT 'normal'; -- 'normal', 'high', 'critical'

-- Index for searching pending actions efficiently
CREATE INDEX IF NOT EXISTS idx_leads_next_action_date ON public.leads(next_action_date);

-- Add comment
COMMENT ON COLUMN public.leads.next_action_date IS 'Scheduled date for next sales action';
COMMENT ON COLUMN public.leads.next_action_note IS 'Instructions for the next action';
-- 1. Add last_activity_at to leads
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT now();

-- 2. Backfill from existing activity log (latest activity per lead)
UPDATE public.leads l
SET last_activity_at = sub.max_created_at
FROM (
    SELECT lead_id, MAX(created_at) as max_created_at
    FROM public.lead_activity_log
    GROUP BY lead_id
) sub
WHERE l.id = sub.lead_id;

-- 3. Create Trigger Function to auto-update leads.last_activity_at
CREATE OR REPLACE FUNCTION public.update_lead_last_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.leads
    SET last_activity_at = NEW.created_at
    WHERE id = NEW.lead_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create Trigger on lead_activity_log
DROP TRIGGER IF EXISTS trigger_update_lead_activity ON public.lead_activity_log;
CREATE TRIGGER trigger_update_lead_activity
AFTER INSERT ON public.lead_activity_log
FOR EACH ROW
EXECUTE FUNCTION public.update_lead_last_activity();

-- 5. Create Trigger for Chat (bitacora_clientes) as well
DROP TRIGGER IF EXISTS trigger_update_lead_activity_chat ON public.bitacora_clientes;
CREATE TRIGGER trigger_update_lead_activity_chat
AFTER INSERT ON public.bitacora_clientes
FOR EACH ROW
EXECUTE FUNCTION public.update_lead_last_activity();

-- 6. Index for fast "Rotting" queries
CREATE INDEX IF NOT EXISTS idx_leads_last_activity_at ON public.leads(last_activity_at);
-- Add demo_url column to leads table
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS demo_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN leads.demo_url IS 'Relative path to the prospect demo page (e.g. /prospectos/familysmile)';
alter table leads add column if not exists source_data jsonb default '{}'::jsonb;
alter table leads add column if not exists telefono text; -- just in case it was missing in some version
