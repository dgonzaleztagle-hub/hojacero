-- =====================================================
-- SEED: Datos de Ejemplo para Vault
-- Fecha: 2026-01-17
-- Propósito: Clientes de prueba para desarrollo
-- =====================================================

-- 1. Limpiar datos previos de estos clientes de prueba (para evitar duplicados y errores)
DELETE FROM pagos WHERE site_id IN (SELECT id FROM monitored_sites WHERE client_name IN ('Restaurante La Mesa', 'Abogados Silva', 'Clínica Dental', 'Ferretería Central', 'Panadería Don Juan'));
DELETE FROM alertas_enviadas WHERE site_id IN (SELECT id FROM monitored_sites WHERE client_name IN ('Restaurante La Mesa', 'Abogados Silva', 'Clínica Dental', 'Ferretería Central', 'Panadería Don Juan'));
DELETE FROM site_status WHERE id IN (SELECT id FROM monitored_sites WHERE client_name IN ('Restaurante La Mesa', 'Abogados Silva', 'Clínica Dental', 'Ferretería Central', 'Panadería Don Juan'));
DELETE FROM monitored_sites WHERE client_name IN ('Restaurante La Mesa', 'Abogados Silva', 'Clínica Dental', 'Ferretería Central', 'Panadería Don Juan');

-- 2. Insertar clientes de ejemplo en monitored_sites
INSERT INTO monitored_sites (
    client_name, 
    site_url, 
    local_path,
    hosting_type,
    maintenance_day, 
    plan_type, 
    status,
    contract_start,
    contract_end,
    monto_mensual,
    monto_implementacion,
    cuotas_implementacion,
    cuotas_pagadas,
    dia_cobro,
    email_contacto,
    telefono_contacto
) VALUES
-- Cliente 1: Restaurante La Mesa (VENCIDO - para pruebas de críticos)
(
    'Restaurante La Mesa',
    'lamesa.cl',
    'd:/clientes/restaurante-la-mesa/',
    'vercel',
    15,
    'basic',
    'active',
    '2025-10-15',
    '2026-10-15',
    20000,
    500000,
    3,
    2,
    15,
    'contacto@lamesa.cl',
    '+56912345678'
),
-- Cliente 2: Abogados Silva (AL DÍA - pro)
(
    'Abogados Silva',
    'abogadossilva.cl',
    'd:/clientes/abogados-silva/',
    'vercel',
    10,
    'pro',
    'active',
    '2025-09-10',
    '2026-09-10',
    50000,
    800000,
    1,
    1,
    10,
    'secretaria@abogadossilva.cl',
    '+56987654321'
),
-- Cliente 3: Clínica Dental (PRÓXIMO A VENCER)
(
    'Clínica Dental',
    'clinicadental.cl',
    'd:/clientes/clinica-dental/',
    'netlify',
    28,
    'basic',
    'active',
    '2025-06-28',
    '2026-06-28',
    20000,
    450000,
    2,
    2,
    28,
    'admin@clinicadental.cl',
    '+56911111111'
),
-- Cliente 4: Ferretería Central (VENCIDO CRÍTICO)
(
    'Ferretería Central',
    'ferreteriacentral.cl',
    'd:/clientes/ferreteria-central/',
    'cpanel',
    15,
    'basic',
    'active',
    '2025-11-15',
    '2026-11-15',
    20000,
    350000,
    3,
    1,
    15,
    'ventas@ferreteriacentral.cl',
    '+56922222222'
),
-- Cliente 5: Panadería Don Juan (AL DÍA - recién pagó)
(
    'Panadería Don Juan',
    'panaderiadonjuan.cl',
    'd:/clientes/panaderia-don-juan/',
    'vercel',
    15,
    'basic',
    'active',
    '2025-03-15',
    '2026-03-15',
    20000,
    400000,
    1,
    1,
    15,
    'panaderia@donjuan.cl',
    '+56933333333'
);

-- 2. Los site_status se crean automáticamente por el trigger
-- pero actualizamos algunos para pruebas

-- Desactivar Ferretería Central (simulando moroso)
UPDATE site_status 
SET is_active = false, 
    deactivated_at = NOW(), 
    reason = 'moroso',
    notes = 'No paga desde noviembre 2025'
WHERE id = (SELECT id FROM monitored_sites WHERE client_name = 'Ferretería Central');

-- Desactivar Restaurante La Mesa
UPDATE site_status 
SET is_active = false, 
    deactivated_at = NOW(), 
    reason = 'moroso',
    notes = 'Atraso de 2 meses'
WHERE id = (SELECT id FROM monitored_sites WHERE client_name = 'Restaurante La Mesa');

-- 3. Insertar algunos pagos de ejemplo
-- Abogados Silva - Al día
INSERT INTO pagos (site_id, monto, periodo_mes, periodo_ano, fecha_pago, metodo, tipo)
SELECT id, 50000, 1, 2026, '2026-01-10', 'transferencia', 'mantencion'
FROM monitored_sites WHERE client_name = 'Abogados Silva';

INSERT INTO pagos (site_id, monto, periodo_mes, periodo_ano, fecha_pago, metodo, tipo)
SELECT id, 50000, 12, 2025, '2025-12-10', 'transferencia', 'mantencion'
FROM monitored_sites WHERE client_name = 'Abogados Silva';

INSERT INTO pagos (site_id, monto, periodo_mes, periodo_ano, fecha_pago, metodo, tipo)
SELECT id, 800000, 9, 2025, '2025-09-10', 'transferencia', 'implementacion'
FROM monitored_sites WHERE client_name = 'Abogados Silva';

-- Panadería Don Juan - Al día
INSERT INTO pagos (site_id, monto, periodo_mes, periodo_ano, fecha_pago, metodo, tipo)
SELECT id, 20000, 1, 2026, '2026-01-15', 'transferencia', 'mantencion'
FROM monitored_sites WHERE client_name = 'Panadería Don Juan';

INSERT INTO pagos (site_id, monto, periodo_mes, periodo_ano, fecha_pago, metodo, tipo)
SELECT id, 400000, 3, 2025, '2025-03-15', 'efectivo', 'implementacion'
FROM monitored_sites WHERE client_name = 'Panadería Don Juan';

-- Clínica Dental - Próximo a vencer (último pago hace 20 días)
INSERT INTO pagos (site_id, monto, periodo_mes, periodo_ano, fecha_pago, metodo, tipo)
SELECT id, 20000, 12, 2025, '2025-12-28', 'transferencia', 'mantencion'
FROM monitored_sites WHERE client_name = 'Clínica Dental';

-- 4. Insertar algunas alertas de ejemplo
INSERT INTO alertas_enviadas (site_id, tipo, email_destino)
SELECT id, 'dia_1', 'contacto@lamesa.cl'
FROM monitored_sites WHERE client_name = 'Restaurante La Mesa';

INSERT INTO alertas_enviadas (site_id, tipo, email_destino)
SELECT id, 'dia_7', 'contacto@lamesa.cl'
FROM monitored_sites WHERE client_name = 'Restaurante La Mesa';

INSERT INTO alertas_enviadas (site_id, tipo, email_destino)
SELECT id, 'dia_14', 'contacto@lamesa.cl'
FROM monitored_sites WHERE client_name = 'Restaurante La Mesa';

INSERT INTO alertas_enviadas (site_id, tipo, email_destino)
SELECT id, 'dia_1', 'ventas@ferreteriacentral.cl'
FROM monitored_sites WHERE client_name = 'Ferretería Central';

INSERT INTO alertas_enviadas (site_id, tipo, email_destino)
SELECT id, 'dia_7', 'ventas@ferreteriacentral.cl'
FROM monitored_sites WHERE client_name = 'Ferretería Central';

INSERT INTO alertas_enviadas (site_id, tipo, email_destino)
SELECT id, 'dia_14', 'ventas@ferreteriacentral.cl'
FROM monitored_sites WHERE client_name = 'Ferretería Central';

INSERT INTO alertas_enviadas (site_id, tipo, email_destino)
SELECT id, 'suspension', 'ventas@ferreteriacentral.cl'
FROM monitored_sites WHERE client_name = 'Ferretería Central';
