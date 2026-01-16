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

## Archivos de Migración

| Archivo | Propósito |
|---------|-----------|
| `crm_schema.sql` | Schema base original |
| `add_source_data.sql` | Campo JSONB para datos scraper |
| `pipeline_leads.sql` | Campos auditoría + activity log |
| `20260115_pipeline_schema.sql` | **Pipeline V1:** Stages, Order, Tags, ServiceType |
