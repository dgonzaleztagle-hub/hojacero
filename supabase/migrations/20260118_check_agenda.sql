-- 📅 VERIFICACIÓN DE AGENDA
-- Vamos a ver si hay algo agendado para HOY o ANTES.
-- Si esto devuelve 0 filas, el Dashboard está correcto mostrando "Bandeja limpia".

SELECT id, nombre, next_action_date, next_action_note 
FROM public.leads 
WHERE next_action_date IS NOT NULL
ORDER BY next_action_date DESC;
