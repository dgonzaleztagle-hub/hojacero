---
description: Empaqueta un sitio de prospecto para entrega final al cliente
---

# 📦 HojaCero Factory EXPORT - Entrega al Cliente

Este workflow empaqueta un sitio de prospecto para que sea 100% standalone.
Solo ejecutar DESPUÉS de que el cliente haya pagado.

**IMPORTANTE:** Este es el paso que "desbloquea" el sitio. Sin este paso, el demo depende de la infraestructura de H0 y no funciona fuera de ella.

// turbo-all

## Prerequisitos

Antes de ejecutar:
- [ ] Cliente ha PAGADO
- [ ] `style_lock.md` muestra SEO inyectado
- [ ] Confirmación de que el sitio está completo

---

## Fase 1: Verificar Estado del Proyecto

Lee `style_lock.md` y verifica:
```
- [x] Demo aprobado por cliente
- [x] Factory Final completado
- [x] SEO inyectado
- [ ] Exportado para entrega ← ESTE ES EL PASO ACTUAL
```

Si algún paso anterior no está completo, DETENER y avisar al usuario.

---

## Fase 2: Crear Directorio de Export

Crea la estructura de export:
```
d:\proyectos\hojacero\exports\[cliente]\
├── src/
│   ├── components/    (componentes copiados)
│   ├── app/           (páginas del sitio)
│   └── styles/        (estilos)
├── public/            (assets estáticos)
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

---

## Fase 3: Analizar Dependencias

Lee TODOS los archivos en `/prospectos/[cliente]/` y extrae:
1. **Imports internos** (`@/components/...`, `@/lib/...`)
2. **Dependencias npm** usadas (framer-motion, lucide-react, etc.)

Crea lista de todo lo que necesita ser copiado.

---

## Fase 4: Copiar Componentes Usados

Para cada import interno detectado:
1. Copia el archivo original a `exports/[cliente]/src/components/`
2. Actualiza los imports para usar rutas relativas (no `@/`)
3. Si ese componente tiene sus propios imports, copiarlos también (recursivo)

Ejemplo:
```
Original: import { BentoGrid } from '@/components/premium/BentoGrid'
Export:   import { BentoGrid } from '../components/BentoGrid'
```

---

## Fase 5: Copiar y Limpiar Páginas

1. Copia todo `/prospectos/[cliente]/` a `exports/[cliente]/src/app/`
2. Renombra la estructura para que sea el root del proyecto:
   - `app/prospectos/cliente/page.tsx` → `app/page.tsx`
   - `app/prospectos/cliente/servicios/` → `app/servicios/`
3. Actualiza TODOS los imports para usar las nuevas rutas
4. Elimina cualquier referencia a H0 (comentarios, watermarks de desarrollo)

---

## Fase 6: Copiar Assets Públicos

Copia todo de `/public/prospectos/[cliente]/` a `exports/[cliente]/public/`:
- Imágenes
- Logo
- sitemap.xml
- robots.txt

---

## Fase 7: Generar package.json Limpio

Crea un `package.json` minimalista:

```json
{
  "name": "[cliente]-website",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "export": "next build && next export"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    // Solo las dependencias que el proyecto realmente usa
  },
  "devDependencies": {
    "tailwindcss": "^3.0.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0"
  }
}
```

---

## Fase 8: Generar Configuraciones

### next.config.js
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
}
module.exports = nextConfig
```

### tailwind.config.js
Copia la configuración de H0 pero limpia referencias innecesarias.

### postcss.config.js
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## Fase 9: Generar README de Entrega

Crea `exports/[cliente]/README.md`:

```markdown
# [Nombre Cliente] - Sitio Web

Sitio web desarrollado por HojaCero.

## Instalación

\`\`\`bash
npm install
\`\`\`

## Desarrollo Local

\`\`\`bash
npm run dev
\`\`\`

Abre http://localhost:3000

## Build para Producción

\`\`\`bash
npm run build
\`\`\`

## Deploy

El sitio puede ser desplegado en:
- Vercel (recomendado): Conectar repo y deploy automático
- Netlify: Arrastrar carpeta `out/`
- Hosting tradicional: Subir contenido de `out/`

## Soporte

Para modificaciones o soporte, contactar a HojaCero.
```

---

## Fase 10: Verificar que Compila

Ejecuta en la carpeta de export:
```bash
cd exports/[cliente]
npm install
npm run build
```

Si hay errores, corregirlos antes de continuar.

---

## Fase 11: Empaquetar

Crea un ZIP del proyecto completo:
```bash
# Crear ZIP
Compress-Archive -Path "exports/[cliente]/*" -DestinationPath "exports/[cliente].zip"
```

---

## Fase 12: Actualizar style_lock.md y Reportar

Actualiza el status:
```markdown
## Estado
- [x] Demo aprobado por cliente
- [x] Factory Final completado
- [x] SEO inyectado
- [x] Exportado para entrega

## Entrega
- Fecha de export: [fecha]
- Archivo: exports/[cliente].zip
- Tamaño: [X] MB
```

### Reporte Final:

```
✅ EXPORT COMPLETADO

📦 Entregable: exports/[cliente].zip

📋 Contenido:
- Proyecto Next.js standalone
- X componentes internalizados
- X páginas
- Assets optimizados
- SEO configurado
- Listo para deploy

📝 Instrucciones de deploy incluidas en README.md

🔐 El demo en /prospectos/[cliente]/ sigue funcionando
   pero ahora el cliente tiene su copia independiente.
```

---

## Ejemplo de Uso

```
Usuario: /factory-export para Biocrom (cliente pagó)

AI:
1. FASE 1: Verifico style_lock.md - Todo OK
2. FASE 2: Creo directorio exports/biocrom/
3. FASE 3-4: Analizo y copio 8 componentes usados
4. FASE 5: Copio y restructuro 4 páginas
5. FASE 6: Copio assets (logo, imágenes, sitemap)
6. FASE 7-8: Genero package.json y configs
7. FASE 9: Genero README de entrega
8. FASE 10: Verifico que compila ✅
9. FASE 11: Creo biocrom.zip
10. FASE 12: Reporto entrega lista
```

---

## Notas de Seguridad

- **NUNCA** ejecutar este workflow sin confirmación de pago
- El ZIP contiene código fuente completo - es el "producto final"
- El demo en `/prospectos/` sigue funcionando para referencias futuras
- Considerar borrar la demo pública después de X tiempo si no se necesita
