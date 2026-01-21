-- Growth Module Schema Redesign
-- Task Library: Catálogo maestro de todas las tareas de marketing
-- Plan Templates: Definición de planes con tareas incluidas
-- Clients: Integración con Pipeline
-- Tasks: Instancias con datetime, recurrencia, evidencia

-- ============================================
-- 1. TASK LIBRARY (Catálogo de tareas)
-- ============================================
CREATE TABLE IF NOT EXISTS public.growth_task_library (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('setup', 'ads', 'seo', 'social', 'email', 'strategy', 'content', 'reporting', 'dev', 'crm')),
    description TEXT,
    default_recurrence JSONB DEFAULT '{"type": "once"}', -- { type: 'once'|'weekly'|'monthly', day: 1, hour: 10 }
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. PLAN TEMPLATES (Definición de planes)
-- ============================================
CREATE TABLE IF NOT EXISTS public.growth_plan_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE, -- Básico, Medio, Enterprise, Custom
    description TEXT,
    included_tasks UUID[] DEFAULT ARRAY[]::UUID[], -- Array de IDs de growth_task_library
    monthly_price NUMERIC(10,2),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. DROP OLD TABLES & RECREATE (careful migration)
-- ============================================
-- Backup existing data if needed, then recreate

-- First, check if growth_clients exists and alter it
DO $$ 
BEGIN
    -- Add new columns to growth_clients if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'growth_clients' AND column_name = 'pipeline_lead_id') THEN
        ALTER TABLE public.growth_clients ADD COLUMN pipeline_lead_id UUID REFERENCES public.leads(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'growth_clients' AND column_name = 'plan_id') THEN
        ALTER TABLE public.growth_clients ADD COLUMN plan_id UUID REFERENCES public.growth_plan_templates(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'growth_clients' AND column_name = 'task_overrides') THEN
        ALTER TABLE public.growth_clients ADD COLUMN task_overrides JSONB DEFAULT '{}'; -- { taskLibraryId: { enabled: true/false } }
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'growth_clients' AND column_name = 'custom_tasks') THEN
        ALTER TABLE public.growth_clients ADD COLUMN custom_tasks JSONB DEFAULT '[]'; -- Tareas agregadas manualmente
    END IF;
END $$;

-- ============================================
-- 4. UPDATE GROWTH_TASKS TABLE
-- ============================================
DO $$ 
BEGIN
    -- Add library reference
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'growth_tasks' AND column_name = 'library_task_id') THEN
        ALTER TABLE public.growth_tasks ADD COLUMN library_task_id UUID REFERENCES public.growth_task_library(id);
    END IF;
    
    -- Change due_date to due_datetime if needed (preserve data)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'growth_tasks' AND column_name = 'due_date' AND data_type = 'date') THEN
        ALTER TABLE public.growth_tasks ALTER COLUMN due_date TYPE TIMESTAMPTZ USING due_date::TIMESTAMPTZ;
    END IF;
    
    -- Rename due_date to due_datetime
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'growth_tasks' AND column_name = 'due_date') THEN
        ALTER TABLE public.growth_tasks RENAME COLUMN due_date TO due_datetime;
    END IF;
    
    -- Add recurrence config
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'growth_tasks' AND column_name = 'recurrence') THEN
        ALTER TABLE public.growth_tasks ADD COLUMN recurrence JSONB DEFAULT '{"type": "once"}';
    END IF;
    
    -- Add evidence fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'growth_tasks' AND column_name = 'evidence_url') THEN
        ALTER TABLE public.growth_tasks ADD COLUMN evidence_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'growth_tasks' AND column_name = 'evidence_notes') THEN
        ALTER TABLE public.growth_tasks ADD COLUMN evidence_notes TEXT;
    END IF;
    
    -- Add alert tracking
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'growth_tasks' AND column_name = 'alert_sent') THEN
        ALTER TABLE public.growth_tasks ADD COLUMN alert_sent BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add enabled toggle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'growth_tasks' AND column_name = 'is_enabled') THEN
        ALTER TABLE public.growth_tasks ADD COLUMN is_enabled BOOLEAN DEFAULT TRUE;
    END IF;
END $$;

-- ============================================
-- 5. RLS POLICIES
-- ============================================
ALTER TABLE public.growth_task_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_plan_templates ENABLE ROW LEVEL SECURITY;

-- For now, allow all authenticated users (admin only in practice)
CREATE POLICY "Authenticated users can manage task library" ON public.growth_task_library
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage plan templates" ON public.growth_plan_templates
    FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 6. SEED DEFAULT TASKS
-- ============================================
INSERT INTO public.growth_task_library (title, category, description, default_recurrence) VALUES
    -- Setup
    ('Configurar Google Analytics 4', 'setup', 'Instalar y verificar GA4 en el sitio web del cliente.', '{"type": "once"}'),
    ('Configurar Google Search Console', 'setup', 'Verificar propiedad y configurar GSC.', '{"type": "once"}'),
    ('Instalar Meta Pixel', 'setup', 'Agregar el píxel de Facebook/Meta al sitio.', '{"type": "once"}'),
    ('Verificar Google My Business', 'setup', 'Reclamar y optimizar ficha de GMB.', '{"type": "once"}'),
    
    -- SEO
    ('Auditoría SEO Técnica', 'seo', 'Revisar velocidad, indexación, errores 404, schema markup.', '{"type": "monthly", "day": 1, "hour": 10}'),
    ('Optimizar Títulos y Metas (Home)', 'seo', 'Revisar y mejorar title tags y meta descriptions.', '{"type": "once"}'),
    ('Verificar Indexación en Google', 'seo', 'Confirmar que páginas clave están indexadas.', '{"type": "monthly", "day": 15, "hour": 10}'),
    ('Análisis de Backlinks', 'seo', 'Revisar perfil de enlaces entrantes.', '{"type": "monthly", "day": 20, "hour": 10}'),
    
    -- Ads
    ('Auditoría de Campañas Activas', 'ads', 'Revisar rendimiento de Google/Meta Ads.', '{"type": "weekly", "day": 1, "hour": 9}'),
    ('Crear 4 Variantes de Anuncios (A/B)', 'ads', 'Diseñar creativos para testing.', '{"type": "monthly", "day": 5, "hour": 10}'),
    ('Optimizar Palabras Clave', 'ads', 'Revisar y ajustar keywords negativas y positivas.', '{"type": "weekly", "day": 3, "hour": 10}'),
    ('Revisar Conversiones y Tracking', 'ads', 'Verificar que las conversiones se están registrando correctamente.', '{"type": "monthly", "day": 1, "hour": 11}'),
    
    -- Social
    ('Planificar Calendario de Contenido', 'social', 'Crear calendario mensual de publicaciones.', '{"type": "monthly", "day": 25, "hour": 10}'),
    ('Publicar 8 Posts Mensuales', 'social', 'Ejecutar el calendario de contenido.', '{"type": "monthly", "day": 1, "hour": 10}'),
    ('Análisis de Engagement', 'social', 'Revisar métricas de interacción.', '{"type": "monthly", "day": 28, "hour": 10}'),
    
    -- Email
    ('Configurar Secuencia de Bienvenida', 'email', 'Crear flujo automático para nuevos suscriptores.', '{"type": "once"}'),
    ('Newsletter Mensual', 'email', 'Enviar newsletter con novedades.', '{"type": "monthly", "day": 15, "hour": 11}'),
    ('Limpieza de Lista', 'email', 'Eliminar suscriptores inactivos.', '{"type": "monthly", "day": 1, "hour": 9}'),
    
    -- Strategy
    ('Reunión de Estrategia', 'strategy', 'Call con cliente para revisar objetivos y resultados.', '{"type": "monthly", "day": 1, "hour": 15}'),
    ('Análisis de Competencia', 'strategy', 'Revisar qué están haciendo los competidores.', '{"type": "monthly", "day": 10, "hour": 10}'),
    
    -- Reporting
    ('Reporte Mensual de Rendimiento', 'reporting', 'Generar y enviar reporte con KPIs.', '{"type": "monthly", "day": 28, "hour": 16}'),
    ('Dashboard de Métricas', 'reporting', 'Actualizar dashboard con datos frescos.', '{"type": "weekly", "day": 1, "hour": 8}'),
    
    -- Content
    ('Producción de 4 Videos Cortos', 'content', 'Crear reels/shorts para redes sociales.', '{"type": "monthly", "day": 10, "hour": 10}'),
    ('Redacción Artículo SEO "Power Page"', 'content', 'Escribir artículo largo optimizado para SEO.', '{"type": "monthly", "day": 15, "hour": 10}'),
    
    -- Dev
    ('Optimización de Velocidad Web', 'dev', 'Mejorar Core Web Vitals.', '{"type": "once"}'),
    ('Configurar Server-Side Tracking (CAPI)', 'dev', 'Implementar tracking avanzado.', '{"type": "once"}')
ON CONFLICT DO NOTHING;

-- ============================================
-- 7. SEED DEFAULT PLANS (empty, to be configured via UI)
-- ============================================
INSERT INTO public.growth_plan_templates (name, description, sort_order) VALUES
    ('Básico', 'Plan de entrada. Incluye setup inicial y monitoreo básico.', 1),
    ('Medio', 'Plan intermedio. Incluye gestión activa de campañas y contenido.', 2),
    ('Enterprise', 'Plan completo. Incluye estrategia, producción de contenido y reuniones.', 3),
    ('Custom', 'Plan personalizado basado en Enterprise con adiciones específicas.', 4)
ON CONFLICT (name) DO NOTHING;
