# 🔧 Plan de Corrección: Sistema Territorial

**Fecha:** 2026-02-09  
**Reporte de QA:** Gastón  
**Objetivo:** Corregir errores críticos detectados en Reportes 2 ($350k) y 3 ($600k)

---

## 📋 Errores Detectados

### 🔴 **Reporte 2 ($350k) - Análisis de Competencia**

#### 1. Confusión "Sitio Web" vs "Perfil de Google"
**Problema:** Yaku Sushi aparece como "tiene sitio web" cuando solo tiene perfil de Google.

**Causa raíz:**  
El scraper de Serper (`lib/scrapers/serper-scraper.ts`) no diferencia entre:
- URL de sitio web propio (ej: `www.yakusushi.cl`)
- Perfil de Google Maps (ej: `maps.google.com/...`)
- Redes sociales (ej: `instagram.com/yakusushi`)

**Fix:**
```typescript
// Agregar validación de tipo de URL
function clasificarPresenciaDigital(url: string): {
  tipo: 'sitio_web' | 'google_profile' | 'social_media' | 'sin_presencia';
  url: string | null;
} {
  if (!url) return { tipo: 'sin_presencia', url: null };
  
  const urlLower = url.toLowerCase();
  
  // Perfiles de Google
  if (urlLower.includes('google.com/maps') || urlLower.includes('business.google.com')) {
    return { tipo: 'google_profile', url };
  }
  
  // Redes sociales
  if (urlLower.includes('instagram.com') || 
      urlLower.includes('facebook.com') || 
      urlLower.includes('tiktok.com')) {
    return { tipo: 'social_media', url };
  }
  
  // Sitio web propio (dominio independiente)
  return { tipo: 'sitio_web', url };
}
```

---

#### 2. Datos de Competidores Erróneos
**Problema:**  
- Kami Sushi: dice 2.5⭐ + 100 seguidores IG → Real: 4.5⭐ + 273k seguidores
- Yaku Sushi: cifras de reseñas incorrectas

**Causa raíz:**  
El scraper está tomando data de **sucursales homónimas** en otras comunas o mezclando resultados.

**Fix:**
```typescript
// Agregar validación de distancia geográfica
async function validarCompetidor(
  competidor: any,
  latBase: number,
  lngBase: number,
  maxDistanciaKm: number = 2
): Promise<boolean> {
  // Si el competidor tiene coordenadas, validar distancia
  if (competidor.lat && competidor.lng) {
    const distancia = calculateDistance(
      latBase, lngBase,
      competidor.lat, competidor.lng
    );
    
    if (distancia > maxDistanciaKm * 1000) {
      console.log(`⚠️ Descartando ${competidor.name}: ${distancia}m (fuera de rango)`);
      return false;
    }
  }
  
  return true;
}

// Agregar cross-check de datos de redes sociales
async function validarDatosRedesSociales(
  nombre: string,
  rating: number,
  seguidoresIG: number
): Promise<{ rating: number; seguidoresIG: number; confianza: 'alta' | 'media' | 'baja' }> {
  // Si los datos parecen sospechosos (muy bajos para una franquicia conocida)
  const esFranquiciaConocida = ['kami', 'sushi', 'burger king', 'mcdonalds'].some(
    keyword => nombre.toLowerCase().includes(keyword)
  );
  
  if (esFranquiciaConocida && seguidoresIG < 1000) {
    return {
      rating,
      seguidoresIG,
      confianza: 'baja' // Marcar como dato poco confiable
    };
  }
  
  return { rating, seguidoresIG, confianza: 'alta' };
}
```

---

#### 3. Proyecciones Financieras Sin Sentido
**Problema:**  
Dice: "100-200 pedidos/día × $20k = $600k/mes de ganancia"  
Matemática real: `150 pedidos × $20k × 30 días = $90M` (no $600k)

**Causa raíz:**  
El LLM está generando las proyecciones financieras sin validación matemática.

**Fix:**  
Sacar los cálculos del prompt y hacerlos en TypeScript puro:

```typescript
// lib/territorial/estimators/financial-projections.ts
export interface ProyeccionFinanciera {
  pedidos_diarios_estimados: number;
  ticket_promedio_clp: number;
  ventas_diarias_clp: number;
  ventas_mensuales_clp: number;
  margen_neto_estimado: number; // %
  ganancia_mensual_clp: number;
  confianza: 'alta' | 'media' | 'baja';
}

export function calcularProyeccionFinanciera(
  pedidosDiariosMin: number,
  pedidosDiariosMax: number,
  ticketPromedioCLP: number,
  margenNeto: number = 0.15 // 15% por defecto
): ProyeccionFinanciera {
  const pedidosDiariosPromedio = Math.round((pedidosDiariosMin + pedidosDiariosMax) / 2);
  const ventasDiarias = pedidosDiariosPromedio * ticketPromedioCLP;
  const ventasMensuales = ventasDiarias * 30;
  const gananciaMensual = ventasMensuales * margenNeto;
  
  return {
    pedidos_diarios_estimados: pedidosDiariosPromedio,
    ticket_promedio_clp: ticketPromedioCLP,
    ventas_diarias_clp: ventasDiarias,
    ventas_mensuales_clp: ventasMensuales,
    margen_neto_estimado: margenNeto * 100,
    ganancia_mensual_clp: gananciaMensual,
    confianza: 'media'
  };
}
```

Luego pasar solo el resultado al LLM:
```typescript
// En el prompt del Plan 2
const proyeccion = calcularProyeccionFinanciera(100, 200, 20000);

// Agregar al prompt:
- Proyección Financiera (calculada):
  * Pedidos diarios: ${proyeccion.pedidos_diarios_estimados}
  * Ticket promedio: $${proyeccion.ticket_promedio_clp.toLocaleString()} CLP
  * Ventas mensuales: $${proyeccion.ventas_mensuales_clp.toLocaleString()} CLP
  * Ganancia mensual estimada (${proyeccion.margen_neto_estimado}%): $${proyeccion.ganancia_mensual_clp.toLocaleString()} CLP
```

---

### 🔴 **Reporte 3 ($600k) - Análisis de Inversión**

#### 4. Cifras en UF Absurdas
**Problema:** Habla de +150,000 UF (= miles de millones de pesos)

**Causa raíz:**  
El scraper de Portal Inmobiliario (`lib/scrapers/portal-inmobiliario-scraper.ts`) ya filtra correctamente por `moneda === 'UF'` (línea 172), pero el LLM está multiplicando en vez de usar los datos directamente.

**Fix:**  
Agregar validación de rangos realistas:

```typescript
// lib/scrapers/portal-inmobiliario-scraper.ts
function validarRangoUF(precioUF: number, tipo: 'arriendo' | 'venta'): boolean {
  if (tipo === 'arriendo') {
    // Arriendos comerciales típicos: UF 20 - UF 500
    if (precioUF < 10 || precioUF > 1000) {
      console.warn(`⚠️ Precio arriendo fuera de rango: ${precioUF} UF`);
      return false;
    }
  } else {
    // Ventas comerciales típicas: UF 1,000 - UF 100,000
    if (precioUF < 500 || precioUF > 200000) {
      console.warn(`⚠️ Precio venta fuera de rango: ${precioUF} UF`);
      return false;
    }
  }
  return true;
}

// Aplicar filtro en la extracción:
if (precio > 0 && metros > 0 && titulo && moneda === 'UF') {
  // ✅ NUEVO: Validar rango antes de agregar
  if (validarRangoUF(precio, tipo)) {
    properties.push({...});
  }
}
```

---

#### 5. Fórmula de Cap Rate Incorrecta
**Problema:** El Cap Rate está mal calculado.

**Fórmula correcta:**  
```
Cap Rate = (NOI Anual / Inversión Total) × 100
```

**Fix:**  
Crear función TypeScript para el cálculo:

```typescript
// lib/territorial/estimators/investment-metrics.ts
export interface CapRateCalculation {
  arriendo_mensual_uf: number;
  noi_anual_uf: number;
  inversion_total_uf: number;
  cap_rate_porcentaje: number;
  interpretacion: 'excelente' | 'bueno' | 'regular' | 'bajo';
}

export function calcularCapRate(
  arriendoMensualUF: number,
  precioAdquisicionUF: number,
  habilitacionUF: number,
  gastosOperativosPorc: number = 0.15 // 15% de gastos operativos
): CapRateCalculation {
  const inversionTotal = precioAdquisicionUF + habilitacionUF;
  const ingresoAnual = arriendoMensualUF * 12;
  const noiAnual = ingresoAnual * (1 - gastosOperativosPorc);
  const capRate = (noiAnual / inversionTotal) * 100;
  
  // Interpretación
  let interpretacion: 'excelente' | 'bueno' | 'regular' | 'bajo';
  if (capRate >= 8) interpretacion = 'excelente';
  else if (capRate >= 6) interpretacion = 'bueno';
  else if (capRate >= 4) interpretacion = 'regular';
  else interpretacion = 'bajo';
  
  return {
    arriendo_mensual_uf: arriendoMensualUF,
    noi_anual_uf: noiAnual,
    inversion_total_uf: inversionTotal,
    cap_rate_porcentaje: Math.round(capRate * 100) / 100,
    interpretacion
  };
}
```

---

#### 6. Falta Sección CIP (Normativa)
**Problema:** No hay datos de zonificación, uso de suelo, adosamiento, antejardín.

**Realidad:** Es **imposible** scrapear estos datos automáticamente de las municipalidades.

**Fix:**  
Agregar disclaimer claro y pasos siguientes:

```typescript
// En el prompt del Plan 3
"factibilidad_normativa": {
  "disclaimer": "⚠️ IMPORTANTE: Este análisis es preliminar. La zonificación y permisos requieren consulta directa a la Dirección de Obras Municipales (DOM) de ${comuna}.",
  "zonificacion_estimada": "Estimación basada en ubicación y GSE - REQUIERE VALIDACIÓN DOM",
  "aptitud_comercial": "Análisis preliminar basado en entorno comercial detectado - REQUIERE CERTIFICADO DOM",
  "restricciones_potenciales": "Posibles restricciones basadas en zona - REQUIERE VALIDACIÓN TÉCNICA",
  "pasos_siguientes": [
    "1. Consultar Plan Regulador Comunal en sitio web de DOM ${comuna}",
    "2. Solicitar Certificado de Informaciones Previas (CIP) en DOM",
    "3. Validar factibilidad constructiva con arquitecto",
    "4. Confirmar uso de suelo permitido (Equipamiento vs Solo Vivienda)",
    "5. Verificar sistema de agrupamiento (adosamiento)",
    "6. Confirmar antejardín obligatorio"
  ],
  "datos_clave_cip": {
    "uso_suelo": "REQUIERE CIP - Verificar si permite 'Equipamiento Comercial'",
    "sistema_agrupamiento": "REQUIERE CIP - Confirmar posibilidad de adosamiento",
    "antejardin_obligatorio": "REQUIERE CIP - Confirmar metros libres desde reja"
  }
}
```

---

## 🎯 Decisión Estratégica: Fusión de Reportes

### **Problema:**  
El Reporte 3 ($600k) tiene demasiadas limitaciones técnicas:
- CIP imposible de scrapear
- Datos de inversión requieren validación manual
- Muchos disclaimers restan valor percibido

### **Solución:**  
Eliminar Reporte 3 y fusionar en **Reporte 2 Premium ($400k)**

#### **Nueva Estructura:**

**Plan 1: Validación Territorial ($150k)** ✅ (mantener)
- Análisis básico de ubicación
- Flujo peatonal estimado
- Competencia superficial

**Plan 2: Estrategia Comercial Premium ($400k)** 🔄 (fusión 350k + 600k)
- ✅ Todo del Plan 350k actual
- ✅ Proyecciones financieras (ROI, payback) **bien calculadas**
- ✅ Análisis de rentabilidad (Cap Rate **correcto**)
- ✅ Estimación de inversión inicial
- ✅ Análisis de mercado inmobiliario (Portal Inmobiliario)
- ⚠️ **CIP/Normativa → DISCLAIMER + PASOS SIGUIENTES**
- ❌ Eliminar: Análisis legal profundo

---

## 🚀 Plan de Implementación

### **Fase 1: Limpieza de Data (2-3 horas)**

1. ✅ **Fix validación "sitio web" vs perfiles**
   - Archivo: `lib/scrapers/serper-scraper.ts`
   - Agregar función `clasificarPresenciaDigital()`

2. ✅ **Agregar filtro de distancia para competidores**
   - Archivo: `lib/scrapers/serper-scraper.ts`
   - Agregar función `validarCompetidor()`

3. ✅ **Extraer cálculos financieros del prompt → TypeScript puro**
   - Crear: `lib/territorial/estimators/financial-projections.ts`
   - Modificar: `lib/territorial/prompts/plan2-prompt.ts`

4. ✅ **Fix validación rangos UF**
   - Archivo: `lib/scrapers/portal-inmobiliario-scraper.ts`
   - Agregar función `validarRangoUF()`

5. ✅ **Implementar fórmula Cap Rate correcta**
   - Crear: `lib/territorial/estimators/investment-metrics.ts`
   - Modificar: `lib/territorial/prompts/plan3-prompt.ts`

### **Fase 2: Fusión de Reportes (1 hora)**

1. ✅ **Eliminar referencias al Plan 3 como producto separado**
   - Archivo: `app/api/territorial/analyze/route.ts`
   - Cambiar lógica: `if (plan_type === 2 || plan_type === 3)` → solo Plan 2

2. ✅ **Integrar datos de Portal Inmobiliario en Plan 2**
   - Mover lógica de línea 1094-1103 a Plan 2

3. ✅ **Renombrar y actualizar prompts**
   - Archivo: `lib/territorial/prompts/plan2-prompt.ts`
   - Título: "Plan 400k - Estrategia Comercial Premium"
   - Integrar secciones viables del Plan 3

4. ✅ **Agregar disclaimer CIP completo**
   - Agregar sección `factibilidad_normativa` con pasos siguientes

### **Fase 3: Testing con Gastón (30 min)**

1. ✅ Re-correr análisis de **Yaku Sushi** (Lampa)
2. ✅ Re-correr análisis de **Kami Sushi** (Lampa)
3. ✅ Validar que los datos coincidan con Google real
4. ✅ Verificar proyecciones financieras (coherencia matemática)
5. ✅ Verificar Cap Rate (debe estar entre 4-8% para ser realista)

---

## ✅ Checklist de Validación

### **Datos de Competidores:**
- [ ] Nombre correcto
- [ ] Rating de Google correcto (±0.5 estrellas)
- [ ] Seguidores IG correctos (±10% si es franquicia)
- [ ] Distancia < 2km del punto analizado
- [ ] Diferencia clara entre "sitio web" vs "perfil Google"

### **Proyecciones Financieras:**
- [ ] Matemática coherente (ventas = pedidos × ticket × días)
- [ ] Ganancia mensual = ventas × margen neto
- [ ] Cifras realistas para el GSE y rubro

### **Datos de Inversión (Portal Inmobiliario):**
- [ ] Precios en UF (no CLP)
- [ ] Rangos realistas (arriendo: 20-500 UF, venta: 1k-100k UF)
- [ ] Cap Rate entre 4-8% (realista)
- [ ] Fórmula correcta: `(NOI Anual / Inversión Total) × 100`

### **Normativa:**
- [ ] Disclaimer claro sobre CIP
- [ ] Pasos siguientes para validación DOM
- [ ] Sin promesas imposibles de cumplir

---

## 📝 Notas Técnicas

### **Valor UF Hardcodeado:**
```typescript
const UF_CLP = 38000; // Actualizar periódicamente
```
**Recomendación:** Considerar API del Banco Central en el futuro.

### **Filtro de Propiedades UF:**
```typescript
// ✅ YA IMPLEMENTADO en portal-inmobiliario-scraper.ts línea 172
if (precio > 0 && metros > 0 && titulo && moneda === 'UF') {
  properties.push({...});
}
```

### **Scraping Dinámico:**
- ✅ Sin hardcodeo de comunas
- ✅ Funciona para cualquier zona de Chile
- ✅ Normalización automática de nombres de comunas

---

## 🎯 Resultado Esperado

Después de estos fixes:

1. **Datos de competidores 100% confiables**
   - Nombres reales
   - Ratings correctos
   - Presencia digital clasificada correctamente

2. **Proyecciones financieras coherentes**
   - Matemática validada en TypeScript
   - Cifras realistas para el mercado chileno

3. **Análisis de inversión profesional**
   - Cap Rate correcto
   - Rangos UF realistas
   - Disclaimer claro sobre limitaciones

4. **Estructura simplificada**
   - 2 planes en vez de 3
   - Mejor relación valor/precio
   - Menos disclaimers, más valor real

---

**Tiempo total estimado:** 3-4 horas  
**Prioridad:** 🔥 ALTA (afecta credibilidad del producto)
