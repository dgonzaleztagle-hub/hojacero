-- Revisa los últimos 20 leads creados, sin importar su estado
SELECT 
    id, 
    nombre, 
    estado, 
    pipeline_stage, 
    revisado_por, 
    created_at, 
    fuente
FROM leads 
ORDER BY created_at DESC 
LIMIT 20;
