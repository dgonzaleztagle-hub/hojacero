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


