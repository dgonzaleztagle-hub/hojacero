---
description: Inyecta el motor Ads-Factory para creación de landings de pauta (Direct Response)
---

# 🏭 Workflow: Inyección de Ads-Factory (H0 Engine)

Este flujo dota al proyecto de una fábrica de landings especializada en conversión para Ads.

## Fase 1: Base de Datos (Persistencia)
// turbo
1. Ejecutar el siguiente SQL en el editor de Supabase:
```sql
CREATE TABLE IF NOT EXISTS public.h0_landings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    config JSONB NOT NULL DEFAULT '[]'::jsonb,
    primary_color VARCHAR(7) DEFAULT '#00f0ff',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.h0_landings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active landings" ON public.h0_landings FOR SELECT USING (is_active = true);
CREATE POLICY "Auth manage landings" ON public.h0_landings FOR ALL USING (auth.role() = 'authenticated');
```

## Fase 2: Inyección de Componentes
// turbo
2. Verificar la existencia de las carpetas:
   - `components/factory/sections`
   - `app/lp/[slug]`
   - `app/dashboard/ads-factory`

## Fase 3: Activación en Sidebar
// turbo
3. Agregar la opción "ADS FACTORY" al `Sidebar.tsx`:
   - Label: `ADS FACTORY`
   - Icon: `Megaphone` (Lucide)
   - Route: `/dashboard/ads-factory`
   - Badge: `NEW`

## Fase 4: QA de Conversión
// turbo
4. Generar una landing de prueba `/lp/test-vibe` para validar el renderer.
5. Ajustar tokens de diseño (colores y fuentes) según el manual de marca del cliente.

---
**Resultado Estelar:** El cliente ahora tiene una herramienta profesional para tirar campañas sin depender de código externo.
