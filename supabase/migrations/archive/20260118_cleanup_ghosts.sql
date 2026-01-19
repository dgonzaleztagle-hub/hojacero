-- 🧹 LIMPIEZA DE BASE DE DATOS
-- Borrar solo los leads que están en estado "detected" (los fantasmas del escáner antiguo).
-- Esto dejará solo los 6 que están en el Pipeline real (ready_to_contact, in_contact, etc).

DELETE FROM public.leads 
WHERE estado = 'detected';

-- Opcional: Si quieres borrar TODO y empezar de cero absoluto:
-- DELETE FROM public.leads;
