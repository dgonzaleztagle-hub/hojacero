-- ============================================================================
-- ACARGOO+ DATABASE SCHEMA
-- ============================================================================
-- Versión: 1.0
-- Fecha: 15 de Febrero 2026
-- Proyecto: Supabase (independiente de HojaCero)
-- Prerequisito: Proyecto Supabase creado por el cliente
-- ============================================================================

-- ============================================================================
-- TABLA 1: acargoo_services (Catálogo de Servicios)
-- ============================================================================
CREATE TABLE acargoo_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50), -- Nombre del ícono (ej: 'Truck', 'Package', 'Tv')
    base_price DECIMAL(10, 2) NOT NULL DEFAULT 0, -- Precio base en CLP
    price_per_km DECIMAL(10, 2) DEFAULT 0, -- Precio adicional por km
    multiplier DECIMAL(3, 2) DEFAULT 1.0, -- Multiplicador de precio (1.0 = normal, 1.5 = premium)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed inicial de servicios
INSERT INTO acargoo_services (name, description, icon, base_price, price_per_km, multiplier) VALUES
('TV y Electrodomésticos', 'Transporte seguro de televisores, refrigeradores y electrodomésticos grandes', 'Tv', 25000, 800, 1.2),
('Mudanza Pequeña', 'Mudanza de departamentos pequeños o habitaciones individuales', 'Package', 35000, 1000, 1.5),
('Carga General', 'Transporte de mercadería, cajas y carga no especializada', 'Truck', 20000, 600, 1.0),
('Express', 'Servicio urgente con prioridad y entrega el mismo día', 'Zap', 40000, 1200, 2.0);

-- ============================================================================
-- TABLA 2: acargoo_vehicles (Vehículos de la Flota)
-- ============================================================================
CREATE TABLE acargoo_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plate VARCHAR(20) UNIQUE NOT NULL, -- Patente (ej: GZ-HJ-34)
    brand VARCHAR(50), -- Marca (ej: Chevrolet)
    model VARCHAR(50), -- Modelo (ej: NPR 2024)
    vehicle_type VARCHAR(50), -- Tipo (ej: Camión, Camioneta, Furgón)
    capacity_m3 DECIMAL(5, 2), -- Capacidad en metros cúbicos
    capacity_kg DECIMAL(7, 2), -- Capacidad en kilogramos
    year INTEGER,
    is_active BOOLEAN DEFAULT true,
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ejemplo de vehículos (el cliente debe reemplazar con su flota real)
INSERT INTO acargoo_vehicles (plate, brand, model, vehicle_type, capacity_m3, capacity_kg, year) VALUES
('GZ-HJ-34', 'Chevrolet', 'NPR 2024', 'Camión', 15.0, 3500, 2024),
('LL-KK-90', 'Ford', 'F-150', 'Camioneta', 5.0, 1200, 2022),
('TR-RE-11', 'Mercedes-Benz', 'Sprinter', 'Furgón', 10.0, 2000, 2023);

-- ============================================================================
-- TABLA 3: acargoo_drivers (Conductores y Administradores)
-- ============================================================================
CREATE TABLE acargoo_drivers (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    rut VARCHAR(12) UNIQUE, -- RUT chileno (ej: 12345678-9)
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    photo_url TEXT, -- URL de la foto de perfil (Supabase Storage)
    role VARCHAR(20) DEFAULT 'driver' CHECK (role IN ('admin', 'driver')),
    vehicle_id UUID REFERENCES acargoo_vehicles(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    rating DECIMAL(2, 1) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
    total_trips INTEGER DEFAULT 0,
    last_location JSONB, -- { lat: -33.4357, lng: -70.7811, timestamp: '2026-02-15T14:30:00Z' }
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLA 4: acargoo_clients (Clientes que reservan servicios)
-- ============================================================================
CREATE TABLE acargoo_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL, -- Nombre de la persona o empresa
    rut VARCHAR(12) UNIQUE, -- RUT (opcional para personas naturales)
    email VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    client_type VARCHAR(20) DEFAULT 'individual' CHECK (client_type IN ('individual', 'business')),
    address TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLA 5: acargoo_orders (Órdenes de Servicio)
-- ============================================================================
CREATE TABLE acargoo_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_code VARCHAR(20) UNIQUE NOT NULL, -- Código único (ej: AG-7281)
    
    -- Relaciones
    service_id UUID REFERENCES acargoo_services(id) ON DELETE RESTRICT,
    client_id UUID REFERENCES acargoo_clients(id) ON DELETE SET NULL,
    driver_id UUID REFERENCES acargoo_drivers(id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES acargoo_vehicles(id) ON DELETE SET NULL,
    
    -- Direcciones
    pickup_address TEXT NOT NULL,
    pickup_lat DECIMAL(10, 8),
    pickup_lng DECIMAL(11, 8),
    delivery_address TEXT NOT NULL,
    delivery_lat DECIMAL(10, 8),
    delivery_lng DECIMAL(11, 8),
    
    -- Datos del cliente (desnormalizado para histórico)
    client_name VARCHAR(100) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    client_email VARCHAR(100),
    
    -- Programación
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    
    -- Pricing
    distance_km DECIMAL(6, 2),
    estimated_duration_min INTEGER,
    base_price DECIMAL(10, 2),
    total_price DECIMAL(10, 2) NOT NULL,
    
    -- Estado del servicio
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending',      -- Creada, esperando asignación
        'assigned',     -- Asignada a chofer
        'in_transit',   -- Chofer en camino
        'completed',    -- Entregada
        'cancelled'     -- Cancelada
    )),
    
    -- Timestamps
    assigned_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    
    -- Metadata
    description TEXT, -- Descripción de la carga
    notes TEXT, -- Notas internas
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Función para generar tracking codes únicos (AG-XXXX)
CREATE OR REPLACE FUNCTION generate_tracking_code()
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    code_exists BOOLEAN;
BEGIN
    LOOP
        -- Generar código: AG- + 4 dígitos aleatorios
        new_code := 'AG-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        
        -- Verificar si ya existe
        SELECT EXISTS(SELECT 1 FROM acargoo_orders WHERE tracking_code = new_code) INTO code_exists;
        
        -- Si no existe, retornar
        IF NOT code_exists THEN
            RETURN new_code;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Trigger para auto-generar tracking_code
CREATE OR REPLACE FUNCTION set_tracking_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tracking_code IS NULL OR NEW.tracking_code = '' THEN
        NEW.tracking_code := generate_tracking_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_tracking_code
BEFORE INSERT ON acargoo_orders
FOR EACH ROW
EXECUTE FUNCTION set_tracking_code();

-- ============================================================================
-- TABLA 6: acargoo_tracking (Posiciones GPS en Tiempo Real)
-- ============================================================================
CREATE TABLE acargoo_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES acargoo_orders(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES acargoo_drivers(id) ON DELETE CASCADE,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    speed_kmh DECIMAL(5, 2), -- Velocidad en km/h (opcional)
    heading DECIMAL(5, 2), -- Dirección en grados (0-360, opcional)
    accuracy_m DECIMAL(6, 2), -- Precisión del GPS en metros
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para consultas rápidas por orden
CREATE INDEX idx_tracking_order_id ON acargoo_tracking(order_id);
CREATE INDEX idx_tracking_timestamp ON acargoo_tracking(timestamp DESC);

-- ============================================================================
-- TABLA 7: acargoo_pods (Proof of Delivery - Pruebas de Entrega)
-- ============================================================================
CREATE TABLE acargoo_pods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID UNIQUE REFERENCES acargoo_orders(id) ON DELETE CASCADE,
    
    -- Archivos
    signature_url TEXT, -- URL de la firma digital (Supabase Storage)
    photo_url TEXT, -- URL de la foto de entrega (opcional)
    certificate_pdf_url TEXT, -- URL del certificado PDF generado
    
    -- Metadata
    recipient_name VARCHAR(100), -- Nombre de quien recibió
    recipient_rut VARCHAR(12), -- RUT de quien recibió (opcional)
    notes TEXT, -- Observaciones del chofer
    
    -- Timestamps
    delivered_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLA 8: acargoo_incidents (Incidencias Reportadas)
-- ============================================================================
CREATE TABLE acargoo_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES acargoo_orders(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES acargoo_drivers(id) ON DELETE SET NULL,
    
    -- Tipo de incidencia
    incident_type VARCHAR(50) NOT NULL CHECK (incident_type IN (
        'client_not_present',  -- Cliente no está
        'damaged_cargo',       -- Carga dañada
        'accident',            -- Accidente
        'vehicle_breakdown',   -- Falla del vehículo
        'other'                -- Otro
    )),
    
    -- Detalles
    description TEXT NOT NULL,
    photo_url TEXT, -- Foto de evidencia (opcional)
    
    -- Estado
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'resolved')),
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES acargoo_drivers(id) ON DELETE SET NULL,
    resolution_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLA 9: acargoo_payments (Registro de Pagos)
-- ============================================================================
CREATE TABLE acargoo_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES acargoo_orders(id) ON DELETE CASCADE,
    
    -- Monto
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'CLP',
    
    -- Método de pago
    payment_method VARCHAR(50) CHECK (payment_method IN (
        'cash',           -- Efectivo
        'transfer',       -- Transferencia
        'credit_card',    -- Tarjeta de crédito
        'debit_card',     -- Tarjeta de débito
        'mercadopago',    -- Mercado Pago
        'flow',           -- Flow
        'transbank'       -- Transbank
    )),
    
    -- Estado
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending',   -- Pendiente
        'paid',      -- Pagado
        'failed',    -- Fallido
        'refunded'   -- Reembolsado
    )),
    
    -- Metadata de pasarela (si aplica)
    transaction_id VARCHAR(100), -- ID de la transacción externa
    payment_gateway_response JSONB, -- Respuesta completa de la pasarela
    
    -- Timestamps
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLA 10: acargoo_notifications (Log de Notificaciones Enviadas)
-- ============================================================================
CREATE TABLE acargoo_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES acargoo_orders(id) ON DELETE CASCADE,
    
    -- Destinatario
    recipient_type VARCHAR(20) CHECK (recipient_type IN ('client', 'driver', 'admin')),
    recipient_email VARCHAR(100),
    recipient_phone VARCHAR(20),
    
    -- Tipo de notificación
    notification_type VARCHAR(50) CHECK (notification_type IN (
        'order_created',
        'order_assigned',
        'driver_on_route',
        'driver_near',
        'order_completed',
        'driver_onboarded',
        'incident_reported'
    )),
    
    -- Canales
    sent_via_email BOOLEAN DEFAULT false,
    sent_via_whatsapp BOOLEAN DEFAULT false,
    sent_via_push BOOLEAN DEFAULT false,
    
    -- Estado
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    error_message TEXT,
    
    -- Metadata
    email_id VARCHAR(100), -- ID de Brevo (si aplica)
    whatsapp_id VARCHAR(100), -- ID de Evolution API (si aplica)
    
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE acargoo_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE acargoo_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE acargoo_drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE acargoo_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE acargoo_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE acargoo_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE acargoo_pods ENABLE ROW LEVEL SECURITY;
ALTER TABLE acargoo_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE acargoo_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE acargoo_notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLICIES: acargoo_services (Público para lectura)
-- ============================================================================
CREATE POLICY "Servicios visibles para todos"
ON acargoo_services FOR SELECT
USING (is_active = true);

CREATE POLICY "Solo admins pueden modificar servicios"
ON acargoo_services FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM acargoo_drivers
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- ============================================================================
-- POLICIES: acargoo_drivers
-- ============================================================================
CREATE POLICY "Choferes pueden ver su propio perfil"
ON acargoo_drivers FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Admins pueden ver todos los choferes"
ON acargoo_drivers FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM acargoo_drivers
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Solo admins pueden modificar choferes"
ON acargoo_drivers FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM acargoo_drivers
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- ============================================================================
-- POLICIES: acargoo_orders
-- ============================================================================
CREATE POLICY "Choferes ven sus propias órdenes"
ON acargoo_orders FOR SELECT
USING (driver_id = auth.uid());

CREATE POLICY "Admins ven todas las órdenes"
ON acargoo_orders FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM acargoo_drivers
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Solo admins pueden crear/modificar órdenes"
ON acargoo_orders FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM acargoo_drivers
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- ============================================================================
-- POLICIES: acargoo_tracking
-- ============================================================================
CREATE POLICY "Choferes pueden insertar su propio tracking"
ON acargoo_tracking FOR INSERT
WITH CHECK (driver_id = auth.uid());

CREATE POLICY "Admins pueden ver todo el tracking"
ON acargoo_tracking FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM acargoo_drivers
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- ============================================================================
-- POLICIES: acargoo_pods
-- ============================================================================
CREATE POLICY "Choferes pueden crear POD de sus órdenes"
ON acargoo_pods FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM acargoo_orders
        WHERE id = order_id AND driver_id = auth.uid()
    )
);

CREATE POLICY "Admins pueden ver todos los PODs"
ON acargoo_pods FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM acargoo_drivers
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- ============================================================================
-- POLICIES: acargoo_incidents
-- ============================================================================
CREATE POLICY "Choferes pueden reportar incidencias de sus órdenes"
ON acargoo_incidents FOR INSERT
WITH CHECK (driver_id = auth.uid());

CREATE POLICY "Admins pueden ver y resolver incidencias"
ON acargoo_incidents FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM acargoo_drivers
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- ============================================================================
-- STORAGE BUCKETS (Ejecutar desde Supabase Dashboard → Storage)
-- ============================================================================
-- Crear los siguientes buckets:
-- 1. acargoo_driver_photos (público)
-- 2. acargoo_pod_photos (privado, solo admins y chofer de la orden)
-- 3. acargoo_pod_signatures (privado, solo admins y chofer de la orden)
-- 4. acargoo_pod_pdfs (público con URL firmada)

-- ============================================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================================
CREATE INDEX idx_orders_status ON acargoo_orders(status);
CREATE INDEX idx_orders_driver_id ON acargoo_orders(driver_id);
CREATE INDEX idx_orders_scheduled_date ON acargoo_orders(scheduled_date);
CREATE INDEX idx_orders_tracking_code ON acargoo_orders(tracking_code);

CREATE INDEX idx_tracking_driver_id ON acargoo_tracking(driver_id);

CREATE INDEX idx_notifications_order_id ON acargoo_notifications(order_id);
CREATE INDEX idx_notifications_status ON acargoo_notifications(status);

-- ============================================================================
-- FUNCIONES ÚTILES
-- ============================================================================

-- Función para obtener órdenes activas de un chofer
CREATE OR REPLACE FUNCTION get_driver_active_orders(driver_uuid UUID)
RETURNS TABLE (
    order_id UUID,
    tracking_code VARCHAR,
    pickup_address TEXT,
    delivery_address TEXT,
    status VARCHAR,
    scheduled_date DATE,
    scheduled_time TIME
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        id,
        tracking_code,
        pickup_address,
        delivery_address,
        status,
        scheduled_date,
        scheduled_time
    FROM acargoo_orders
    WHERE driver_id = driver_uuid
      AND status IN ('assigned', 'in_transit')
    ORDER BY scheduled_date, scheduled_time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para actualizar última ubicación del chofer
CREATE OR REPLACE FUNCTION update_driver_location(
    driver_uuid UUID,
    new_lat DECIMAL,
    new_lng DECIMAL
)
RETURNS VOID AS $$
BEGIN
    UPDATE acargoo_drivers
    SET 
        last_location = jsonb_build_object(
            'lat', new_lat,
            'lng', new_lng,
            'timestamp', NOW()
        ),
        updated_at = NOW()
    WHERE id = driver_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FIN DEL SCHEMA
-- ============================================================================

-- Verificación final
SELECT 
    'Schema creado exitosamente. Total de tablas: ' || COUNT(*)::TEXT
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE 'acargoo_%';
