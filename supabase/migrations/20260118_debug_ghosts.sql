-- 👻 CAZAFANTASMAS DE LEADS
-- Vamos a ver quiénes son esos 16 leads que aparecen en el Dashboard.

SELECT 
    nombre, 
    estado, 
    created_at, 
    fuente, -- Si existe esta columna
    id
FROM public.leads
ORDER BY created_at DESC;

-- Si la columna 'fuente' no existe, corre este otro:
-- SELECT nombre, estado, created_at, id FROM public.leads ORDER BY created_at DESC;
