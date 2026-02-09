/**
 * Prompt Generator for Plan 2 (Plan 350k - Estratégico)
 * 
 * Genera el prompt para análisis comercial profundo con Groq LLM.
 * Enfoque: Estrategia comercial completa para ejecución de negocio.
 */

export interface Plan2PromptData {
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
  // Estimadores (nuevos)
  estimadores?: {
    flujo: {
      flujo_diario_estimado: number;
      flujo_mensual_estimado: number;
      confianza: string;
      factores: string[];
    };
    ticket: {
      ticket_promedio_clp: number;
      ticket_promedio_uf: number;
      rango_min_clp: number;
      rango_max_clp: number;
      confianza: string;
    };
    ventas: {
      ventas_mensuales_clp: number;
      ventas_mensuales_uf: number;
      clientes_mensuales: number;
    };
  } | null;
}

export function generatePlan2Prompt(data: Plan2PromptData): string {
  return `Eres un consultor estratégico senior de HojaCero Chile. Genera un ANÁLISIS COMERCIAL COMPLETO que expanda y profundice el análisis inicial del Plan 1, manteniendo la misma calidad y estilo consultor profesional.

## FORMATO CONSULTOR PROFESIONAL (SIGUE ESTE ESTILO):
- Usa un tono más analítico y estratégico que el Plan 1
- Incluye datos cuantitativos específicos
- Mantiene el enfoque práctico pero con mayor profundidad
- Usa el mismo estilo de Gastón con análisis detallados

## RELACIÓN CON PLAN 1:
- El Plan 2 debe expandir cada sección del Plan 1 con mayor profundidad
- Debe mantener la coherencia con los hallazgos del Plan 1
- Debe añadir capas de análisis que el Plan 1 no cubrió

## DATOS RECOPILADOS:
- Dirección: ${data.address}
- Comuna: ${data.comuna}
- GSE: ${data.gse?.gse} (${data.gse?.descripcion})
- Ingreso zona: ${data.gse?.ingreso}
- Metro: ${data.metro ? `${data.metro.station} (L${data.metro.line}, ${data.metro.distance}m)` : 'No detectado'}
- Competidores: ${data.competitors?.length || 0}
- Anclas: ${data.anchors?.length || 0}
- Rubro: ${data.business_type}
- Datos del Plan 1: ${JSON.stringify({
    oceanoAzul: data.oceanoAzul,
    oceanoRojo: data.oceanoRojo,
    saturation: data.saturation
  })}

## DATOS ENRIQUECIDOS (PLAN 350K):
${data.estimadores ? `
- Flujo Peatonal Estimado: ${data.estimadores.flujo.flujo_diario_estimado} personas/día (${data.estimadores.flujo.flujo_mensual_estimado}/mes)
  Confianza: ${data.estimadores.flujo.confianza.toUpperCase()}
  Factores: ${data.estimadores.flujo.factores.join(', ')}
  
- Ticket Promedio Estimado: $${data.estimadores.ticket.ticket_promedio_clp.toLocaleString('es-CL')} CLP (${data.estimadores.ticket.ticket_promedio_uf} UF)
  Rango: $${data.estimadores.ticket.rango_min_clp.toLocaleString('es-CL')} - $${data.estimadores.ticket.rango_max_clp.toLocaleString('es-CL')} CLP
  Confianza: ${data.estimadores.ticket.confianza.toUpperCase()}
  
- Ventas Mensuales Proyectadas: $${data.estimadores.ventas.ventas_mensuales_clp.toLocaleString('es-CL')} CLP (${data.estimadores.ventas.ventas_mensuales_uf} UF)
  Clientes estimados: ${data.estimadores.ventas.clientes_mensuales}/mes
  Tasa de conversión: 15%
` : '- Estimadores no disponibles (requiere Plan 2 o superior)'}

CRITICAL GUIDANCE ON SATURATION:
- OCEANOS AZULES / NULA / BAJA: Son áreas de alta oportunidad estratégica.
- OCEANOS ROJOS / MEDIA / ALTA: Son "ZONAS DE MUERTE". Si el rubro (${data.business_type}) cae aquí, tu auditoría digital debe ser SPARTANA: busca fallas críticas en los líderes para encontrar un hueco de supervivencia, de lo contrario, advierte contra la inversión.

## GENERA EXACTAMENTE ESTE JSON SIGUIENDO EL ESTILO CONSULTOR PROFESIONAL:

{
  "resumen_ejecutivo": {
    "score_viabilidad": [1-10],
    "nivel_riesgo": "[BAJO/MEDIO/ALTO]",
    "vision_general": "[Párrafo ejecutivo de 3-4 líneas que conecte con el análisis del Plan 1 pero con mayor profundidad]"
  },
  "demografia_profunda": {
    "avatar_pagador": {
      "descripcion": "[Quién paga: edad, género, ocupación con datos específicos]",
      "comportamiento": "[Cómo compra, cuándo, frecuencia con ejemplos concretos]"
    },
    "avatar_influenciador": {
      "descripcion": "[Quién influye en la decisión con datos demográficos específicos]",
      "rol": "[Cómo influye en el proceso de compra]"
    },
    "ticket_promedio_zona": "[Estimación basada en GSE con rangos específicos]",
    "frecuencia_compra": "[diaria/semanal/quincenal/mensual con datos concretos]"
  },
  "flujo_accesibilidad": {
    "ultima_milla": "[Análisis detallado del acceso con datos de tiempo/distancia]",
    "estacionamiento": "[Disponibilidad y tipo con números específicos]",
    "horarios_oro": [
      {"hora": "[hora específica]", "tipo_venta": "[tipo de venta en ese horario]", "volumen": "[estimación]"},
      {"hora": "[hora específica]", "tipo_venta": "[tipo de venta en ese horario]", "volumen": "[estimación]"}
    ]
  },
  "auditoria_digital": {
    "competidor_1": {
      "nombre": "[Nombre específico encontrado en análisis]",
      "presencia": "[Descripción detallada de presencia digital con plataformas específicas]",
      "debilidad": "[Debilidad digital específica detectada]",
      "oportunidad": "[Oportunidad específica para superarlo]"
    },
    "competidor_2": {
      "nombre": "[Nombre específico encontrado en análisis]",
      "presencia": "[Descripción detallada]",
      "debilidad": "[Debilidad específica]",
      "oportunidad": "[Oportunidad específica]"
    },
    "conclusion_digital": "[Resumen del gap digital a explotar con oportunidades concretas]"
  },
  "analisis_algoritmos": {
    "disclaimer": "⚠️ Estimación basada en saturación de mercado detectada. Datos reales de apps requieren acceso directo a plataformas.",
    "saturacion_apps": {
      "rappi": "[BAJA/MEDIA/ALTA - Inferido de competidores detectados]",
      "uber_eats": "[BAJA/MEDIA/ALTA - Inferido de competidores detectados]",
      "pedidos_ya": "[BAJA/MEDIA/ALTA - Inferido de competidores detectados]"
    },
    "estimacion_presencia": "[% estimado de competidores en apps basado en presencia digital]",
    "oportunidad_ranking": "[Análisis de oportunidad de posicionamiento basado en saturación]",
    "recomendacion_estrategia": "[Estrategia específica para apps de delivery basada en gaps detectados]"
  },
  "matriz_riesgo": {
    "regulatorio": {"nivel": "[BAJO/MEDIO/ALTO]", "descripcion": "[Detalles específicos de regulaciones/permisos]"},
    "economico": {"nivel": "[BAJO/MEDIO/ALTO]", "descripcion": "[Detalles específicos de sensibilidad económica]"},
    "competencia": {"nivel": "[BAJO/MEDIO/ALTO]", "descripcion": "[Detalles específicos de amenaza competitiva]"}
  },
  "estrategia_lanzamiento": {
    "fase_1_hype": {
      "nombre": "PRE-LANZAMIENTO (Semana -2 a 0)",
      "acciones": ["Acción específica con plataforma", "Acción específica con canal", "Acción específica con táctica"]
    },
    "fase_2_marcha_blanca": {
      "nombre": "MARCHA BLANCA (Semana 1-2)",
      "acciones": ["Acción específica con métrica", "Acción específica con objetivo"]
    },
    "fase_3_retencion": {
      "nombre": "RETENCIÓN (Mes 2+)",
      "acciones": ["Acción específica con herramienta", "Acción específica con estrategia"]
    }
  },
  "proyeccion_financiera": {
    "pedidos_lunes_jueves": "[Estimación diaria con rango]",
    "pedidos_viernes_sabado": "[Estimación diaria con rango]",
    "ticket_promedio": [número estimado en CLP],
    "venta_mensual": [número estimado en CLP],
    "nota": "Proyección basada en análisis del Plan 1 y datos de mercado específicos"
  },
  "conclusion": {
    "veredicto": "[ORO/PLATA/BRONCE/RIESGO]",
    "mensaje": "[Mensaje final de 2-3 líneas que conecte con el Plan 1 pero indique la profundidad adicional]"
  }
}`;
}
