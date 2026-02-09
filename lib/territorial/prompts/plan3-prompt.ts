/**
 * Prompt Generator for Plan 3 (Plan 600k - Inversión)
 * 
 * Genera el prompt para dossier de inversión inmobiliaria con Groq LLM.
 * Enfoque: Análisis financiero de inversión para compra de activo.
 */

export interface Plan3PromptData {
  address: string;
  comuna: string;
  gse: { gse: string; ingreso: string; descripcion: string } | null;
  metro: { station: string; line: string; distance: number } | null;
  competitors: any[];
  anchors: any[];
  business_type: string;
  oceanoAzul?: string;
  oceanoRojo?: string;
  saturation?: any;
  plan1_analysis?: any;
  plan2_analysis?: any;
  portal_inmobiliario?: {
    venta: {
      precio_promedio_uf: number;
      precio_uf_m2: number;
      muestra: number;
    };
    arriendo: {
      precio_promedio_uf: number;
      precio_uf_m2: number;
      muestra: number;
    };
  } | null;
}

export function generatePlan3Prompt(data: Plan3PromptData): string {
  return `Eres un analista de inversiones inmobiliarias de HojaCero Chile. Genera un DOSSIER DE INVERSIÓN que sintetice y eleve los análisis previos del Plan 1 y Plan 2 hacia una evaluación de inversión profesional.

## FORMATO DE DOSSIER PROFESIONAL (SIGUE ESTE ESTILO):
- Usa un lenguaje de inversión y análisis financiero
- Mantiene la coherencia con los hallazgos de Plan 1 y Plan 2
- Incluye proyecciones financieras detalladas
- Usa el mismo estilo profesional y directo de Gastón

## RELACIÓN CON PLANES ANTERIORES:
- El Plan 3 debe sintetizar y elevar los hallazgos de Plan 1 y Plan 2
- Debe mantener coherencia con los análisis previos pero con enfoque de inversión
- Debe conectar los hallazgos operacionales con la viabilidad de inversión

## DATOS:
- Dirección: ${data.address}
- Comuna: ${data.comuna}
- GSE: ${data.gse?.gse}
- Ingreso: ${data.gse?.ingreso}
- Metro: ${data.metro ? `${data.metro.station} (${data.metro.distance}m)` : 'No'}
- Competidores: ${data.competitors?.length || 0}
- Anclas: ${data.anchors?.length || 0}
${data.portal_inmobiliario ? `
- DATOS DE MERCADO INMOBILIARIO (Portal Inmobiliario):
  * VENTA: Promedio ${data.portal_inmobiliario.venta.precio_promedio_uf} UF | ${data.portal_inmobiliario.venta.precio_uf_m2} UF/m² (${data.portal_inmobiliario.venta.muestra} propiedades)
  * ARRIENDO: Promedio ${data.portal_inmobiliario.arriendo.precio_promedio_uf} UF/mes | ${data.portal_inmobiliario.arriendo.precio_uf_m2} UF/m² (${data.portal_inmobiliario.arriendo.muestra} propiedades)
` : ''}
- Análisis previos: ${JSON.stringify({
    oceanoAzul: data.oceanoAzul,
    oceanoRojo: data.oceanoRojo,
    saturation: data.saturation,
    plan1_analysis: data.saturation,
    plan2_analysis: data.anchors
  })}

CRITICAL SATURATION ADVISORY:
- No ignores la saturación previa. Si el rubro propuesto está en Océano Rojo, el "veredicto_inversion" debería ser HOLD o SELL a menos que la tesis de inversión sea disruptiva (ej: inversión en propiedad para arriendo a un rubro distinto).

## GENERA EXACTAMENTE ESTE JSON SIGUIENDO EL ESTILO DE DOSSIER PROFESIONAL:

{
  "resumen_ejecutivo": {
    "veredicto_inversion": "[STRONG BUY/BUY/HOLD/SELL]",
    "tesis": "[Tesis de inversión en 3-4 líneas que conecte con análisis previos]",
    "indicadores_clave": {
      "inversion_estimada_uf": [número],
      "cap_rate_proyectado": [número %],
      "plusvalia_3_años": "[%]"
    }
  },
  "macro_entorno": {
    "efecto_fortaleza": "[Análisis del efecto fortaleza/polo comercial basado en anclas identificadas]",
    "masa_critica": "[Análisis de masa crítica de consumidores con datos cuantitativos]",
    "gse_predominante": "${data.gse?.gse}",
    "comportamiento_consumidor": "[Tendencias de consumo de la zona conectadas con análisis previos]"
  },
  "inteligencia_mercado": {
    "tenant_mix_evitar": [
      {"rubro": "[Rubro]", "razon": "[Por qué evitar basado en análisis de competencia]"}
    ],
    "tenant_mix_recomendado": [
      {"prioridad": 1, "rubro": "[Rubro]", "data": "[Justificación con datos de análisis previos]", "estrategia": "[Cómo abordar basado en hallazgos]"},
      {"prioridad": 2, "rubro": "[Rubro]", "data": "[Justificación]", "estrategia": "[Estrategia basada en análisis previos]"}
    ]
  },
  "modelo_financiero": {
    "precio_adquisicion_uf": [${data.portal_inmobiliario ? `USA EL DATO REAL: ${data.portal_inmobiliario.venta.precio_promedio_uf} UF como referencia` : 'número estimado'}],
    "habilitacion_uf": [estima 15-20% del precio de adquisición para habilitación comercial],
    "inversion_total_uf": [suma de precio_adquisicion_uf + habilitacion_uf],
    "arriendo_mensual_uf": [${data.portal_inmobiliario ? `USA EL DATO REAL: ${data.portal_inmobiliario.arriendo.precio_promedio_uf} UF/mes como referencia` : 'número estimado'}],
    "noi_uf": [arriendo_mensual_uf * 12 * 0.85 (asume 15% gastos operativos)],
    "cap_rate": [calcula: (noi_uf / inversion_total_uf) * 100]
  },
  "stress_test": {
    "pesimista": {"cap_rate": [número], "vacancia": [%]},
    "base": {"cap_rate": [número], "vacancia": [%]},
    "optimista": {"cap_rate": [número], "vacancia": [%]}
  },
  "estrategia_salida": {
    "horizonte_años": [3-5],
    "valor_venta_estimado_uf": [número],
    "utilidad_capital_uf": [número]
  },
  "hoja_ruta": [
    "Paso 1: [Acción inmediata conectada con hallazgos previos]",
    "Paso 2: [Siguiente paso basado en análisis previos]",
    "Paso 3: [Consolidación alineada con estrategia previa]"
  ]
}`;
}
