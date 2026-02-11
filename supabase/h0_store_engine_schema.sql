-- HOJACERO-- H0 Store Engine Schema
-- Módulo de tienda e-commerce modular para inyectar en proyectos de clientes

-- 0. Storage Bucket para imágenes de productos
-- NOTA: El bucket debe crearse manualmente desde el dashboard de Supabase
-- No se puede crear buckets directamente desde SQL

-- PASO 1: Crear bucket manualmente
-- 1. Ir a Storage en Supabase Dashboard
-- 2. Click en "New bucket"
-- 3. Name: h0_store_images
-- 4. Public bucket: ✅ ACTIVAR
-- 5. Click "Create bucket"

-- PASO 2: Aplicar políticas RLS (ejecutar este SQL después de crear el bucket)

-- Política 1: Lectura pública de imágenes
CREATE POLICY "Public read access for store images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'h0_store_images');

-- Política 2: Upload solo para usuarios autenticados
CREATE POLICY "Authenticated users can upload store images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'h0_store_images' 
  AND auth.role() = 'authenticated'
);

-- Política 3: Eliminar imágenes (usuarios autenticados)
CREATE POLICY "Authenticated users can delete store images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'h0_store_images' 
  AND auth.role() = 'authenticated'
);

-- 1. Categorías (pre-creadas desde el slash)
CREATE TABLE IF NOT EXISTS public.h0_store_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT, -- Lucide icon name
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Blueprint de Atributos: Define qué campos "especiales" tiene esta categoría
    -- Ejemplo: [{"label": "Talla", "type": "select", "options": ["XL", "L"]}, {"label": "Tela", "type": "text"}]
    attribute_blueprint JSONB DEFAULT '[]'::jsonb 
);

-- 2. Tabla Maestra de Productos
CREATE TABLE IF NOT EXISTS public.h0_store_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.h0_store_categories(id),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    base_price NUMERIC NOT NULL DEFAULT 0,
    description TEXT,
    images TEXT[] DEFAULT '{}', -- Array de URLs
    stock_total INTEGER DEFAULT 0,
    
    -- Atributos de Producto: Valores específicos según el blueprint de la categoría
    -- Ejemplo: {"talla": "XL", "tela": "Algodón"}
    attributes JSONB DEFAULT '{}'::jsonb,
    
    -- Metadatos de Marketing (Conversion Engineering)
    is_featured BOOLEAN DEFAULT false,
    discount_pct INTEGER DEFAULT 0,
    vibe_config JSONB DEFAULT '{}'::jsonb, -- Overrides visuales si se requiere
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Variantes (Control de Stock Fino)
-- Para productos que cambian precio o stock según la combinación
CREATE TABLE IF NOT EXISTS public.h0_store_product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.h0_store_products(id) ON DELETE CASCADE,
    sku TEXT UNIQUE,
    combination JSONB NOT NULL, -- Ej: {"talla": "XL", "color": "Rojo"}
    price_override NUMERIC, -- Si la XL cuesta más
    stock INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Órdenes y Conversión
CREATE TABLE IF NOT EXISTS public.h0_store_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_data JSONB NOT NULL, -- {name, email, whatsapp, address, city}
    items JSONB NOT NULL, -- Array de {product_id, variant_id, qty, price}
    total_amount NUMERIC NOT NULL,
    shipping_cost NUMERIC DEFAULT 0,
    
    payment_status TEXT DEFAULT 'pending', -- pending, paid, failed, refunded
    payment_provider TEXT, -- 'flow', 'mercado_pago'
    payment_id TEXT, -- ID externo de la pasarela
    
    shipping_status TEXT DEFAULT 'preparing', -- preparing, shipped, delivered
    tracking_number TEXT,
    
    source_url TEXT, -- De qué landing/vibe vino el cliente
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Configuración Global de la Tienda
CREATE TABLE IF NOT EXISTS public.h0_store_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_name TEXT NOT NULL,
    currency TEXT DEFAULT 'CLP',
    tax_pct NUMERIC DEFAULT 19, -- IVA Chile
    payment_methods JSONB DEFAULT '{"mercado_pago": false, "flow": false, "transferencia": true}'::jsonb,
    shipping_config JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Configuración de Conversión (Panel de Alta Conversión)
CREATE TABLE IF NOT EXISTS public.h0_store_conversion_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Estilo de Badges (Preset)
    badge_style_preset TEXT DEFAULT 'direct-light' CHECK (badge_style_preset IN ('premium-light', 'premium-dark', 'direct-light', 'direct-dark')),
    
    -- Urgencia y Escasez
    show_low_stock BOOLEAN DEFAULT true,
    low_stock_threshold INTEGER DEFAULT 5,
    show_viewers_count BOOLEAN DEFAULT true,
    simulated_viewers_min INTEGER DEFAULT 2,
    simulated_viewers_max INTEGER DEFAULT 8,
    
    -- Social Proof
    show_ratings BOOLEAN DEFAULT true,
    bestseller_threshold INTEGER DEFAULT 10,
    show_bestseller_badge BOOLEAN DEFAULT true,
    
    -- Exit Intent
    exit_popup_enabled BOOLEAN DEFAULT true,
    exit_discount_pct INTEGER DEFAULT 10,
    exit_code TEXT DEFAULT 'PRIMERACOMPRA',
    exit_message TEXT DEFAULT '¡Espera! No te vayas sin tu descuento',
    
    -- Carrito Inteligente
    cart_cta_enabled BOOLEAN DEFAULT true,
    cart_cta_interval INTEGER DEFAULT 60,
    cart_cta_message TEXT DEFAULT '¡No olvides tu pedido! 🛒',
    free_shipping_threshold INTEGER DEFAULT 50000,
    show_shipping_progress BOOLEAN DEFAULT true,
    
    -- Trust Signals
    trust_bar_enabled BOOLEAN DEFAULT true,
    return_days INTEGER DEFAULT 30,
    show_secure_payment BOOLEAN DEFAULT true,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insertar configuración por defecto
INSERT INTO public.h0_store_conversion_settings (id) 
VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;

-- Extender tabla de productos con métricas de conversión
ALTER TABLE public.h0_store_products 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS sales_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating_avg NUMERIC(2,1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;

-- RLS (Row Level Security) - Solo lectura pública, escritura admin
ALTER TABLE public.h0_store_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.h0_store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.h0_store_product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.h0_store_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.h0_store_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.h0_store_conversion_settings ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (Simulación para Daniel)
DROP POLICY IF EXISTS "Public Read" ON public.h0_store_products;
CREATE POLICY "Public Read" ON public.h0_store_products FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public Read" ON public.h0_store_categories;
CREATE POLICY "Public Read" ON public.h0_store_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read" ON public.h0_store_conversion_settings;
CREATE POLICY "Public Read" ON public.h0_store_conversion_settings FOR SELECT USING (true);

