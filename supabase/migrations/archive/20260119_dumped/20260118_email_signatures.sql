-- Tabla para almacenar firmas de correo
CREATE TABLE IF NOT EXISTS email_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,          -- Nombre identificador (ej: "Daniel Principal")
    content TEXT NOT NULL,        -- Contenido HTML de la firma
    is_default BOOLEAN DEFAULT FALSE, -- Si es la firma por defecto (opcional)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE email_signatures ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to signatures" ON email_signatures;
CREATE POLICY "Allow public read access to signatures" ON email_signatures FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert/update" ON email_signatures;
CREATE POLICY "Allow authenticated insert/update" ON email_signatures FOR ALL USING (true); -- Simplificado para desarrollo

-- Limpiar datos existentes para evitar duplicados y asegurar actualización de nombres
TRUNCATE TABLE email_signatures;

-- Seed: Firmas Iniciales (Daniel & Gastón)
INSERT INTO email_signatures (label, content, is_default) VALUES 
(
    'Daniel - Founder',
    '<p><br></p><div style="font-family: ''Inter'', ''Helvetica Neue'', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #1a1a1a;"><p style="margin-bottom: 4px;">Saludos,</p><p style="margin: 0; font-size: 16px;"><strong>Daniel González</strong></p><p style="margin: 0; color: #4f46e5; font-weight: 500;">Founder & Lead Architect</p><div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;"><p style="margin: 0; font-size: 13px;"><a href="https://hojacero.cl" style="color: #1a1a1a; text-decoration: none; font-weight: 600;">HOJACERO.CL</a><span style="color: #9ca3af; margin: 0 8px;">|</span><span style="color: #6b7280;">Architects of Digital Experiences</span></p></div></div>',
    TRUE
),
(
    'Gastón - Director Comercial',
    '<p><br></p><div style="font-family: ''Inter'', ''Helvetica Neue'', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #1a1a1a;"><p style="margin-bottom: 4px;">Atentamente,</p><p style="margin: 0; font-size: 16px;"><strong>Gastón Jofre</strong></p><p style="margin: 0; color: #4f46e5; font-weight: 500;">Director Comercial & Estrategia</p><div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;"><p style="margin: 0; font-size: 13px;"><a href="https://hojacero.cl" style="color: #1a1a1a; text-decoration: none; font-weight: 600;">HOJACERO.CL</a><span style="color: #9ca3af; margin: 0 8px;">|</span><span style="color: #6b7280;">Architects of Digital Experiences</span></p></div></div>',
    FALSE
);
