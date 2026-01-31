---
description: Inyecta automatización masiva (Estilo ICEBUIN) para procesamiento de assets, data y contenido
---

# 🤖 Worker - Automate (The ICEBUIN Spark)

// turbo-all

## 🎯 OBJETIVO
Automatizar tareas repetitivas de mantenimiento, carga de datos o procesamiento de assets para escalar el proyecto sin esfuerzo manual.

## 🔍 FASE 1: AUDITORÍA DE MANUALIDAD
1. Escanea el directorio del proyecto actual.
2. Identifica:
   - Imágenes pesadas o mal nombradas.
   - Listados de productos/servicios que necesiten descripciones ricas.
   - Datos estáticos que podrían venir de un JSON/Excel.
   - Secciones SEO que falten en múltiples páginas.

## 🛠️ FASE 2: GENERACIÓN DE HERRAMIENTAS
Aplica la lógica ICEBUIN creando scripts en `/scripts` o ejecutando comandos directos:

### A. Procesamiento de Imágenes (Python/Node)
- Conversión masiva a WebP.
- Renombrado SEO-Friendly.
- Generación de ALTs automáticos usando IA.

### B. Inyección de Contenido Masivo
- Generar scripts que tomen un `data.json` y actualicen componentes dinámicos.
- Usar la IA para expandir 1 frase en 50 descripciones técnicas de productos.

### C. Mantenimiento Estructural
- Scripts para verificar links rotos.
- Automatización de Meta-tags por carpeta.

## 🚀 FASE 3: EJECUCIÓN & VALIDACIÓN
1. Corre el script diseñado.
2. Verifica los cambios en caliente (hot reload).
3. Documenta el nuevo "Superpoder" del proyecto en el README.

---
**FILOSOFÍA**: Si tienes que hacer algo más de 3 veces, escribe un script. 🧪🔬📐🦾
