-- 🧹 BORRADO PROFUNDO (Deep Clean)
-- Mantiene SOLO los leads que están en el Pipeline activo.
-- Borra todo lo demás (detected, discarded, nulos, basura de pruebas).

DELETE FROM public.leads
WHERE estado NOT IN (
    'ready_to_contact', -- Por Contactar (ej. biocrom, Crazy Power)
    'in_contact',       -- En Proceso (ej. Monte Madero, Family Smile)
    'proposal_sent',    -- Propuesta (ej. 300 Sport)
    'won',              -- Ganado (ej. 360 SPORTS)
    'lost'              -- Perdido (si hubiera)
);

-- Nota: Si tus tablas (notas, bitácora) están bien configuradas con ON DELETE CASCADE,
-- esto limpiará automáticamente toda la información relacionada a los leads borrados.
-- Si recibes un error de "foreign key constraint", avísame y te paso la versión extendida.
