-- 🕵️‍♂️ SCRIPT DE AUDITORÍA Y DIAGNÓSTICO
-- Ejecuta esto en el SQL Editor para ver qué está pasando realmente en la base de datos.
-- Te mostrará: tablas existentes, seguridad activa, y datos de muestra.

-- 1. Listar todas las tablas en el esquema público y si tienen RLS activado
SELECT 
    tablename as tabla, 
    rowsecurity as rls_activo 
FROM pg_tables 
WHERE schemaname = 'public';

-- 2. Ver cuántos LEADS hay en total (sin importar permisos)
-- (Nota: count(*) a veces ignora RLS en ciertos contextos de superadmin, lo cual es bueno para verificar existencia)
SELECT count(*) as total_leads_reales FROM public.leads;

-- 3. Ver las columnas reales de la tabla LEADS
-- Para confirmar que 'estado', 'next_action_date', etc. existen y se llaman así.
SELECT 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'leads';

-- 4. INTENTO DE LECTURA (Simulando consulta del Dashboard)
-- Muestra el 'estado' y 'title' de los primeros 5 leads.
-- Si esto devuelve filas vacías o error, sabemos que los datos están "sucios" o corruptos.
SELECT id, title, estado, next_action_date 
FROM public.leads 
LIMIT 5;

-- 5. Verificar Usuarios y Perfiles
SELECT count(*) as total_users FROM auth.users;
SELECT count(*) as total_profiles FROM public.profiles;
