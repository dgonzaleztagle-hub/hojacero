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
