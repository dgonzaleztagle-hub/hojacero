-- ACARGOO integrity guards
-- Adds unique active time-slot index and phone lookup index in both acargoo_dev/public when available.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'acargoo_dev'
      AND table_name = 'acargoo_orders'
  ) THEN
    EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS ux_acargoo_orders_unique_active_slot
      ON acargoo_dev.acargoo_orders (scheduled_date, scheduled_time)
      WHERE status NOT IN (''cancelled'',''failed_delivery'')';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'acargoo_dev'
      AND table_name = 'acargoo_clients'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_acargoo_clients_phone
      ON acargoo_dev.acargoo_clients (phone)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'acargoo_orders'
  ) THEN
    EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS ux_public_acargoo_orders_unique_active_slot
      ON public.acargoo_orders (scheduled_date, scheduled_time)
      WHERE status NOT IN (''cancelled'',''failed_delivery'')';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'acargoo_clients'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_public_acargoo_clients_phone
      ON public.acargoo_clients (phone)';
  END IF;
END $$;
