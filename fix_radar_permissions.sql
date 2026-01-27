-- 1. Habilitar RLS (por seguridad, aunque ya debería estar)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas antiguas que podrían estar bloqueando
DROP POLICY IF EXISTS "Radar Insert Policy" ON leads;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON leads;
DROP POLICY IF EXISTS "Enable read access for all users" ON leads;

-- 3. Permitir LECTURA a todos (para que el Radar vea sus propios duplicados)
CREATE POLICY "Public Read Access"
ON leads FOR SELECT
USING (true);

-- 4. Permitir INSERTAR leads 'detected' a cualquiera (Corrige el fallo del Radar)
-- Esto permite que la API (incluso sin Admin Key) pueda guardar el hallazgo.
CREATE POLICY "Radar Insert Access"
ON leads FOR INSERT
WITH CHECK (
  estado = 'detected' 
  OR fuente = 'radar'
);

-- 5. Permitir ACTUALIZAR leads (para moverlos de estado)
CREATE POLICY "Update Access"
ON leads FOR UPDATE
USING (true)
WITH CHECK (true);

-- Verificación final
SELECT * FROM pg_policies WHERE tablename = 'leads';
