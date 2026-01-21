---
description: Empaqueta un sitio de prospecto para entrega final al cliente
---

# 📦 HojaCero Factory EXPORT v2 - Protocolo Blindado

Este workflow empaqueta un sitio para entrega final, asegurando que sea **100% standalone**.
Utiliza `scripts/export-helper.js` para automatizar la detección de dependencias y assets.

**IMPORTANTE:** Ejecutar SOLO después del pago.

// turbo-all

## Prerequisitos

Antes de ejecutar:
- [ ] Cliente ha PAGADO
- [ ] `style_lock.md` muestra SEO inyectado
- [ ] La carpeta `app/prospectos/[cliente]` existe

---

## Fase 1: Preparación del Terreno

1.  Definir variable del cliente (ej: `apimiel`):
    ```powershell
    $CLIENT = "apimiel"
    ```

2.  Limpiar exports anteriores (opcional):
    ```powershell
    Remove-Item -Recurse -Force "exports\$CLIENT" -ErrorAction SilentlyContinue
    ```

3.  Crear estructura base:
    ```powershell
    New-Item -ItemType Directory -Force -Path "exports\$CLIENT\src\app"
    New-Item -ItemType Directory -Force -Path "exports\$CLIENT\src\components"
    New-Item -ItemType Directory -Force -Path "exports\$CLIENT\src\lib"
    New-Item -ItemType Directory -Force -Path "exports\$CLIENT\src\hooks"
    New-Item -ItemType Directory -Force -Path "exports\$CLIENT\src\utils"
    New-Item -ItemType Directory -Force -Path "exports\$CLIENT\public"
    ```

---

## Fase 2: Migración del Código Fuente (The Great Copy)

En lugar de intentar "adivinar" qué archivos se usan, **copiamos todo el núcleo** para garantizar que nada falte. El script de build de Next.js hará el tree-shaking final.

1.  **Copiar Páginas del Prospecto**:
    ```powershell
    Copy-Item -Recurse "app\prospectos\$CLIENT\*" "exports\$CLIENT\src\app\"
    ```

2.  **Copiar Núcleo de Componentes y Utilidades**:
    *(Copiamos todo para soportar los alias @/ sin romper referencias)*
    ```powershell
    Copy-Item -Recurse "components\*" "exports\$CLIENT\src\components\"
    Copy-Item -Recurse "lib\*" "exports\$CLIENT\src\lib\"
    Copy-Item -Recurse "hooks\*" "exports\$CLIENT\src\hooks\"
    Copy-Item -Recurse "utils\*" "exports\$CLIENT\src\utils\"
    Copy-Item "next-env.d.ts" "exports\$CLIENT\"
    ```

3.  **Renombrar Página Principal**:
    Mover `page.tsx` de la carpeta del cliente a la raíz de la app exportada.
    *(Ajustar rutas según la estructura específica del prospecto)*
    ```powershell
    # Ejemplo: Si el home estaba en app/prospectos/apimiel/page.tsx
    # Al copiar, quedó en src/app/page.tsx (correcto)
    # Pero si había subcarpetas, verificar estructura.
    ```

---

## Fase 3: Automatización Inteligente (El Cerebro)

Ejecutar el script helper que:
1.  Escanea el código en `exports/$CLIENT` para encontrar `imports` y `assets`.
2.  Genera `package.json` con SOLO las dependencias usadas (y Tailwind v3 fijo).
3.  Copia imágenes/videos detectados de `public/` a `exports/$CLIENT/public/`.
4.  **Sanitización**: Elimina carpetas de agencias (`radar`, `vault`, `pipeline`) que no deben ir al cliente.
5.  Genera `tsconfig.json` con los paths (`@/*`) configurados.
6.  Genera `next.config.js` y `tailwind.config.js`.

```powershell
node scripts/export-helper.js $CLIENT
```

*Revisar la salida del script para ver si hubo errores de copia de assets.*

---

## Fase 4: Prueba de Humo (Smokescreen)

Verificar que el paciente está vivo antes de dar el alta.

```powershell
cd exports\$CLIENT
npm install
npm run build
```

**Si el build falla:**
1.  Leer el error.
2.  Si falta un archivo, copiarlo manualmente desde el proyecto raíz.
3.  Si falta una dependencia, agregarla a `package.json` y reinstalar.

---

## Fase 5: Empaquetado y Entrega

Si el build pasó en verde:

1.  Generar comprimido:
    ```powershell
    cd ..
    Compress-Archive -Path "$CLIENT\*" -DestinationPath "$CLIENT-delivery.zip" -Force
    ```

2.  **Reportar en `style_lock.md`**:
    - [x] Exportado para entrega (v2 Automated)
    - Archivo: `exports/$CLIENT-delivery.zip`

---

## Debugging

Si el cliente ve "pantalla negra":
- Verificar `next.config.js` (output: export vs default).
- Verificar que `package.json` tenga `framer-motion` si se usa animaciones.
- Verificar consola del navegador para errores 404 de JS/CSS.
