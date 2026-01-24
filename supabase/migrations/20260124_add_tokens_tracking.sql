-- Migración: Agregar tracking de tokens y metadata
-- Fecha: 2026-01-24

ALTER TABLE sales_agent_messages 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Ejemplo de uso:
-- metadata = {
--   "model": "gpt-4o-mini",
--   "usage": {
--     "prompt_tokens": 150,
--     "completion_tokens": 50,
--     "total_tokens": 200
--   },
--   "provider": "openai"
-- }
