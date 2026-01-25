---
description: Empaqueta un sitio de prospecto para entrega final al cliente
---

# 📦 HojaCero Factory EXPORT v3 - Smart Export

Este workflow empaqueta un sitio de prospecto para entrega final al cliente.
Usa análisis inteligente de dependencias para copiar SOLO lo necesario.

**IMPORTANTE:** Ejecutar SOLO después del pago.

// turbo-all

## Prerequisitos

Antes de ejecutar:
- [ ] Cliente ha PAGADO
- [ ] El demo está listo en `app/prospectos/[cliente]`
- [ ] Has probado que funciona en `localhost:3000/prospectos/[cliente]`

---

## Paso 1: Definir Cliente

Reemplaza `CLIENTE` con el nombre de la carpeta del prospecto:

```powershell
$CLIENT = "apimiel"
```

---

## Paso 2: Ejecutar Export Inteligente

El script v3 hace TODO automáticamente:
1. ✅ Analiza recursivamente las dependencias del sitio
2. ✅ Copia SOLO los archivos necesarios
3. ✅ Genera package.json con dependencias precisas
4. ✅ Copia assets detectados en el código
5. ✅ Genera configuración (tsconfig, tailwind, etc.)
6. ✅ Ejecuta npm install
7. ✅ Ejecuta build de prueba
8. ✅ Reporta errores si hay

```powershell
node scripts/export-helper-v3.js $CLIENT
```

**Si el build falla:**
- El script mostrará los errores específicos
- Corrige el problema en `/app/prospectos/[cliente]` (NO en exports)
- Vuelve a ejecutar el script

---

## Paso 3: Verificar (Opcional)

Si quieres probar el sitio localmente antes de subir:

```powershell
cd exports\$CLIENT
npm run dev
```

Abre http://localhost:3000 y verifica que todo funcione.

```powershell
cd ../..
```

---

## Paso 4: Subir al Repo del Cliente

Si el cliente ya tiene un repo standalone:

```powershell
cd exports\$CLIENT

# Inicializar git si es nuevo
git init
git remote add origin https://github.com/TU-ORG/[cliente]-standalone.git

# O si ya existe, solo hacer push
git add .
git commit -m "feat: actualización del sitio"
git push -u origin main
```

Vercel detectará el push y desplegará automáticamente.

---

## Troubleshooting

### "Build failed - Module not found"
- El script debería detectar dependencias automáticamente
- Si falta algo, agrégalo manualmente al package.json y reinstala

### "Cannot find module @/components/..."
- Verifica que el archivo exista en el proyecto original
- El script copia solo lo que encuentra

### Assets no aparecen
- Verifica que los assets estén en `/public/`
- El path en el código debe ser absoluto (ej: `/imagen.png`)

---

## Limpieza

Después de subir al repo del cliente, puedes borrar el export local:

```powershell
Remove-Item -Recurse -Force exports\$CLIENT
```

El export se regenera cuando lo necesites.
