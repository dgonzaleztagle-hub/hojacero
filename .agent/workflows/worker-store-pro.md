---
description: Inyecta el motor de e-commerce H0 Store Engine en un sitio de cliente
---

# 🛒 Worker: Store Pro

## Objetivo
Inyectar el **H0 Store Engine** completo en un proyecto de cliente de forma **100% automática**.

---

## Ejecución Automática

// turbo
```bash
cd scripts
npm install
node inject-store-engine.js
```

**El script hará:**
1. ✅ Preguntas interactivas (nombre, categorías, WhatsApp, slug)
2. ✅ Inserción de categorías en Supabase
3. ✅ Configuración de conversión (preset según tipo de negocio)
4. ✅ Copia de archivos (admin + storefront + componentes)
5. ✅ Creación de `lib/store/config.ts` personalizado
6. ✅ Verificación de bucket de Storage
7. ✅ Mensaje de confirmación con rutas y próximos pasos

---

## Preguntas Interactivas

El script te preguntará:

```
1. ¿Nombre de la tienda?
   Ejemplo: Joyería Obsidian

2. ¿Categorías iniciales? (separadas por coma)
   Ejemplo: Anillos, Collares, Aros

3. ¿WhatsApp para pedidos? (formato: +56912345678)
   Ejemplo: +56912345678

4. ¿Slug del cliente? (sin espacios, minúsculas, guiones bajos)
   Ejemplo: joyeria_obsidian
```

---

## Heurística de Preset

El script detecta automáticamente el tipo de negocio:

**Premium** (joyería, boutique, lujo):
- Palabras clave: joyería, boutique, lujo, luxury, premium
- Preset: `premium-light`
- Colores sutiles (oro/slate)

**Direct** (retail, ferretería, masivo):
- Resto de negocios
- Preset: `direct-light`
- Colores vibrantes (amarillo/rojo)

---

## Paso 2: Crear Tablas en Supabase

// turbo
Ejecutar el schema SQL con el prefijo del cliente:

```bash
# Aplicar schema base (si no existe)
supabase db push --file supabase/h0_store_engine_schema.sql
```

**IMPORTANTE:** Las tablas ya están creadas en el schema base. NO crear tablas con prefijo por ahora (eso será para multi-tenant futuro).

---

## Paso 3: Insertar Categorías Iniciales

Crear las categorías que el usuario especificó:

```sql
-- Ejemplo para "Anillos, Collares, Aros"
INSERT INTO h0_store_categories (name, slug, display_order)
VALUES 
  ('Anillos', 'anillos', 1),
  ('Collares', 'collares', 2),
  ('Aros', 'aros', 3);
```

---

## Paso 4: Crear Configuración Inicial

Insertar configuración de conversión con preset por defecto:

```sql
INSERT INTO h0_store_conversion_settings (
  badge_style_preset,
  show_bestseller,
  show_low_stock,
  show_viewers,
  exit_popup_enabled
) VALUES (
  'premium-light',  -- Preset por defecto (cambiar según tipo de negocio)
  true,
  true,
  true,
  false
);
```

**Heurística de preset:**
- Joyería, boutique, lujo → `premium-light`
- Retail, ferretería, masivo → `direct-light`

---

## Paso 5: Inyectar Archivos

### 5.1 Panel de Administración

Copiar archivos existentes a la ruta del proyecto:

```bash
# Desde el proyecto HojaCero base
cp -r app/admin/tienda/* [PROYECTO_CLIENTE]/app/admin/tienda/
```

**Archivos a copiar:**
- `app/admin/tienda/page.tsx` (Dashboard principal)
- `app/admin/tienda/conversion/page.tsx` (Panel de conversión)

### 5.2 Storefront Público

```bash
cp app/tienda/page.tsx [PROYECTO_CLIENTE]/app/tienda/page.tsx
```

### 5.3 Componentes Compartidos

```bash
cp -r components/store/* [PROYECTO_CLIENTE]/components/store/
```

**Componentes:**
- `ImageUpload.tsx` (Upload de imágenes)
- Otros componentes según necesidad

### 5.4 Utilidades

```bash
cp -r lib/store/* [PROYECTO_CLIENTE]/lib/store/
```

**Archivos:**
- `badge-styles.ts` (Presets de conversión)
- `image-upload.ts` (Utilidades de Supabase Storage)

---

## Paso 6: Configurar Variables del Cliente

Crear archivo de configuración:

```typescript
// [PROYECTO_CLIENTE]/lib/store/config.ts

export const STORE_CONFIG = {
  storeName: '[NOMBRE_TIENDA]',
  whatsapp: '[WHATSAPP]',
  clientSlug: '[SLUG]',
  currency: 'CLP',
  currencySymbol: '$'
};
```

Reemplazar los placeholders con las respuestas del usuario.

---

## Paso 7: Verificar Bucket de Storage

Asegurarse de que el bucket `h0_store_images` existe en Supabase:

1. Ir a Storage en Supabase Dashboard
2. Verificar que existe el bucket `h0_store_images`
3. Si no existe, seguir instrucciones en `supabase_storage_setup.md`

---

## Paso 8: Actualizar Navigation (Opcional)

Agregar links al menú del sitio del cliente:

```tsx
// En el navbar del cliente
<Link href="/tienda">Tienda</Link>
<Link href="/admin/tienda">Admin</Link>  {/* Solo si está autenticado */}
```

---

## Paso 9: Mensaje de Confirmación

Mostrar al usuario:

```
✅ H0 Store Engine inyectado exitosamente!

📍 Panel Admin: http://localhost:3000/admin/tienda
📍 Tienda Pública: http://localhost:3000/tienda

🎨 Preset de conversión: [PRESET_USADO]
📦 Categorías creadas: [LISTA_CATEGORIAS]
📱 WhatsApp configurado: [WHATSAPP]

🚀 Próximos pasos:
1. Ir al panel admin y crear tu primer producto
2. Subir imágenes de productos
3. Configurar técnicas de conversión en /admin/tienda/conversion
4. Probar el checkout en la tienda pública

💡 Iteraciones rápidas:
- "Cambia el preset a direct-light" → Yo lo cambio
- "Mueve la tienda al landing" → Yo muevo el storefront
- "Ajusta los colores del carrito" → Yo edito el CSS
```

---

## Notas Técnicas

### Arquitectura Modular

Los componentes están diseñados para ser **plug-and-play**:

```
ProductGrid → Componente standalone, recibe productos
CartSidebar → Componente standalone, maneja estado del carrito
ImageUpload → Componente standalone, sube a Supabase
```

### Vibe Agnostic

El storefront lee automáticamente:
- Colores del `vibelock.json` (si existe)
- Fuentes del sitio padre
- Estilos globales

### Técnicas de Conversión

Configurables desde `/admin/tienda/conversion`:
- Badges de bestseller
- Indicadores de stock bajo
- Social proof (viewers)
- Exit-intent popup
- Trust bar

---

## Troubleshooting

### Error: "Bucket not found"
**Solución:** Crear bucket `h0_store_images` manualmente en Supabase

### Error: "Table already exists"
**Solución:** Las tablas ya existen, continuar con la inyección

### El storefront no hereda los colores del sitio
**Solución:** Verificar que existe `vibelock.json` o ajustar manualmente en `app/tienda/page.tsx`

---

## Checklist de Verificación

Antes de dar por terminada la inyección, verificar:

- [ ] Tablas creadas en Supabase
- [ ] Categorías insertadas
- [ ] Configuración de conversión creada
- [ ] Archivos copiados correctamente
- [ ] Config del cliente creado
- [ ] Bucket de Storage existe
- [ ] Panel admin accesible
- [ ] Storefront accesible
- [ ] Upload de imágenes funciona
- [ ] Checkout WhatsApp funciona
