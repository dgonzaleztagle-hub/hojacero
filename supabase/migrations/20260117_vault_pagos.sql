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
