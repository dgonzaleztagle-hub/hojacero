# HojaCero - Schema de Base de Datos

## Proyecto Supabase
- **Project ID**: vcxfdihsyehomqfdzzjf
- **URL**: https://vcxfdihsyehomqfdzzjf.supabase.co

---

## Tablas Principales

### `leads`
Leads capturados por el Radar y gestionados en el Pipeline.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| nombre | TEXT | Nombre del negocio |
| direccion | TEXT | Dirección física |
| telefono | TEXT | Teléfono principal |
| email | TEXT | Email encontrado |
| whatsapp | TEXT | WhatsApp detectado |
| sitio_web | TEXT | URL del sitio |
| instagram | TEXT | Handle de Instagram |
| facebook | TEXT | Página de Facebook |
| categoria | TEXT | Rubro del negocio |
| fuente | TEXT | 'radar', 'manual' |
| zona_busqueda | TEXT | Zona de búsqueda |
| puntaje_oportunidad | INT | Score IA (0-100) |
| razon_ia | TEXT | Análisis IA resumido |
| source_data | JSONB | Datos enriquecidos del scraper |
| **estado** | TEXT | (Legacy) Use pipeline_stage instead |
| pipeline_stage | TEXT | radar, contactado, reunion, negociacion, produccion, perdido |
| pipeline_order | INT | Orden vertical en el tablero Kanban |
| tags | TEXT[] | Etiquetas: ['urgente', 'factory', 'corporate'] |
| service_type | TEXT | 'full', 'dev', 'marketing' |
| nota_revision | TEXT | Nota del revisor |
| revisado_por | TEXT | Quién revisó |
| revisado_at | TIMESTAMP | Cuándo se revisó |
| created_at | TIMESTAMP | Fecha de creación |

---

### `lead_activity_log`
Log de auditoría de todas las acciones sobre leads.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| lead_id | UUID | FK a leads |
| usuario | TEXT | 'Daniel' o 'Gaston' |
| accion | TEXT | Tipo de acción |
| nota | TEXT | Nota opcional |
| estado_anterior | TEXT | Estado antes |
| estado_nuevo | TEXT | Estado después |
| created_at | TIMESTAMP | Timestamp |

**Acciones posibles:**
- `reviewed` - Lead revisado
- `discarded` - Lead descartado
- `qualified` - Marcado para contactar
- `contacted` - Primer contacto realizado
- `proposal_sent` - Propuesta enviada
- `closed_won` - Cerrado ganado
- `closed_lost` - Cerrado perdido

---

### `lead_notas`
Notas libres sobre leads.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| lead_id | UUID | FK a leads |
| contenido | TEXT | Texto de la nota |
| created_at | TIMESTAMP | Timestamp |

---

### `email_plantillas`
Templates de email para contacto.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| nombre | TEXT | Nombre del template |
| asunto | TEXT | Subject line |
| contenido | TEXT | Body del email |
| categoria | TEXT | Categoría |

---

### `email_enviados`
Log de emails enviados.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| lead_id | UUID | FK a leads |
| plantilla_id | UUID | FK a plantillas |
| email_destino | TEXT | Email del destinatario |
| asunto | TEXT | Subject enviado |
| estado | TEXT | Estado del envío |

---

## Tablas Sistema de Retención "El Vigilante"

### `monitored_sites`
Clientes con mantención mensual activa.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| client_name | TEXT | Nombre del cliente |
| site_url | TEXT | URL del sitio |
| local_path | TEXT | Ruta local: d:/clientes/[nombre]/ |
| hosting_type | TEXT | 'vercel', 'netlify', 'cpanel', 'ftp', 'other' |
| credentials | JSONB | Credenciales de hosting (encriptadas) |
| maintenance_day | INT | Día del mes (1-28) |
| plan_type | TEXT | 'basic', 'pro', 'enterprise' |
| lead_id | UUID | FK opcional a leads |
| status | TEXT | 'active', 'paused', 'cancelled' |
| contract_start | DATE | Inicio del contrato |
| contract_end | DATE | Fin del contrato |
| created_at | TIMESTAMPTZ | Fecha creación |
| updated_at | TIMESTAMPTZ | Última actualización |

---

### `site_status`
Kill switch para control de acceso a sitios.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK (mismo que monitored_sites) |
| is_active | BOOLEAN | TRUE = sitio OK, FALSE = bloqueado |
| deactivated_at | TIMESTAMPTZ | Cuándo se desactivó |
| reason | TEXT | 'moroso', 'solicitud_cliente', 'mantenimiento', 'otro' |
| notes | TEXT | Notas adicionales |
| updated_at | TIMESTAMPTZ | Última actualización |

**Nota:** Esta tabla es accesible públicamente (anon) para que el script del kill switch pueda consultarla.

---

### `maintenance_logs`
Historial de mantenciones realizadas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| site_id | UUID | FK a monitored_sites |
| performed_at | TIMESTAMPTZ | Cuándo se realizó |
| changes | JSONB | { images_optimized, links_fixed, deps_updated } |
| report_url | TEXT | URL del PDF en Storage |
| report_sent | BOOLEAN | Si se envió el reporte |
| report_sent_at | TIMESTAMPTZ | Cuándo se envió |
| deployed | BOOLEAN | Si se subió al hosting |
| deployed_at | TIMESTAMPTZ | Cuándo se desplegó |
| notes | TEXT | Notas del trabajo |

---

## Archivos de Migración

| Archivo | Propósito |
|---------|-----------|
| `crm_schema.sql` | Schema base original |
| `add_source_data.sql` | Campo JSONB para datos scraper |
| `pipeline_leads.sql` | Campos auditoría + activity log |
| `20260115_pipeline_schema.sql` | **Pipeline V1:** Stages, Order, Tags, ServiceType |
| `20260117_retention_system.sql` | **Retención:** monitored_sites, site_status, maintenance_logs |
