-- Migración: Sistema de Conversaciones del Agente de Ventas H0
-- Permite persistir las conversaciones y trackear conversiones

-- Tabla de sesiones de chat
CREATE TABLE IF NOT EXISTS sales_agent_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_key TEXT UNIQUE NOT NULL,
    visitor_id TEXT, -- Cookie o fingerprint del visitante
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'converted', 'abandoned', 'escalated')),
    conversion_type TEXT CHECK (conversion_type IN ('checkout', 'meeting', 'lead_captured')),
    messages_count INTEGER DEFAULT 0,
    first_message_at TIMESTAMPTZ,
    last_message_at TIMESTAMPTZ,
    diagnosed_url TEXT,
    diagnosis_score INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de mensajes
CREATE TABLE IF NOT EXISTS sales_agent_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sales_agent_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'tool')),
    content TEXT NOT NULL,
    tool_name TEXT, -- Si fue una llamada a herramienta
    tool_result JSONB, -- Resultado de la herramienta
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de eventos de conversión
CREATE TABLE IF NOT EXISTS sales_agent_conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sales_agent_sessions(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('url_submitted', 'diagnosis_complete', 'meeting_scheduled', 'checkout_clicked', 'checkout_completed', 'lead_saved')),
    event_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sales_agent_sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_created ON sales_agent_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_session ON sales_agent_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_conversions_session ON sales_agent_conversions(session_id);

-- RLS (Row Level Security) - Por ahora permitir todo desde el servidor
ALTER TABLE sales_agent_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_agent_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_agent_conversions ENABLE ROW LEVEL SECURITY;

-- Políticas permisivas para el servidor (service role)
CREATE POLICY "Allow all for service role" ON sales_agent_sessions FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON sales_agent_messages FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON sales_agent_conversions FOR ALL USING (true);
