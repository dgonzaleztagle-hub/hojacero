-- ⚠️ PELIGRO: ESTE SCRIPT BORRA TODOS LOS DATOS DE CRM ⚠️
-- Útil para "empezar de cero" y eliminar datos basura heredados.

-- 1. Limpiar tablas Hijas primero (para evitar errores de Foreign Key)
TRUNCATE TABLE lead_notas CASCADE;
TRUNCATE TABLE email_enviados CASCADE;

-- 2. Limpiar tabla Padre (Leads)
TRUNCATE TABLE leads CASCADE;

-- 3. Limpiar tabla Búsquedas (Radar Logs)
TRUNCATE TABLE busquedas CASCADE;

-- Si quieres borrar también plantillas antiguas, descomenta la siguiente línea:
-- TRUNCATE TABLE email_plantillas CASCADE;

SELECT 'Base de datos limpia. Listo para empezar de cero.' as status;
