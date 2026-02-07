-- Eliminar tablas obsoletas del sistema de Gemini
DROP TABLE IF EXISTS territorial_tasks CASCADE;
DROP TABLE IF EXISTS territorial_workers CASCADE;

-- Las tablas nuevas ya están creadas en 20260205_territorial_reports.sql
-- Este archivo solo limpia el código viejo
