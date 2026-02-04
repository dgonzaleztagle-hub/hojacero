/**
 * KIMI FORENSICS - Utilidades de análisis forense
 * Basado en la arquitectura diseñada por Kimi k2
 * 
 * FUNCIONALIDADES REALES (no carcasa):
 * 1. Secuestro Técnico - Detecta plataformas migrables (Wix, WP, etc.)
 * 2. Copyright Detection - Detecta año en footer para medir abandono
 * 3. Loss Score - Calcula pérdida monetaria estimada
 */

import { createClient } from '@/utils/supabase/server';

// ============================================
// TIPOS
// ============================================

export interface SecuestroTecnico {
    plataforma: string | null;
    esSecuestrable: boolean;
    anguloVenta: string;
    puntos: number;
}

export interface DeteccionCopyright {
    añoDetectado: number | null;
    añosAbandonado: number;
    esObsoleto: boolean;
}

export interface SaludSocial {
    platform: 'instagram' | 'facebook' | 'linkedin' | 'tiktok';
    status: 'ALIVE' | 'ZOMBIE' | 'DEAD' | 'NOT_FOUND';
    profileUrl: string | null;
    notes: string;
}

export interface LossScore {
    perdidaMensual: number;
    perdidaFormateada: string;
    factores: string[];
    severidad: 'baja' | 'media' | 'alta' | 'critica';
}

export interface KimiForensicResult {
    secuestro: SecuestroTecnico;
    copyright: DeteccionCopyright;
    saludSocial: SaludSocial[];
    lossScore: LossScore;
}

// ============================================
// 1. SECUESTRO TÉCNICO
// ============================================

const PLATAFORMAS_SECUESTRABLES: Record<string, {
    señales: RegExp[],
    anguloVenta: string,
    puntos: number
}> = {
    'Wix': {
        señales: [/wix\.com/i, /wixsite\.com/i, /wix-image/i, /_wix_/i],
        anguloVenta: 'Estás pagando mensualidad por un sitio lento. Con Next.js pagas una vez y vuelas.',
        puntos: 30
    },
    'WordPress': {
        señales: [/wp-content/i, /wp-includes/i, /wordpress/i, /wp-json/i],
        anguloVenta: 'WordPress con plugins es un colador de seguridad. Cada mes hay que actualizar o te hackean.',
        puntos: 25
    },
    'Squarespace': {
        señales: [/squarespace\.com/i, /sqsp\.net/i],
        anguloVenta: 'Squarespace limita tu crecimiento. Landing personalizada = más conversiones.',
        puntos: 20
    },
    'Shopify': {
        señales: [/cdn\.shopify\.com/i, /shopify/i],
        anguloVenta: 'Shopify cobra comisión por venta. ¿Ya calculaste cuánto pierdes al año?',
        puntos: 15
    },
    'Webflow': {
        señales: [/webflow\.io/i, /webflow\.com/i],
        anguloVenta: 'Webflow está bien, pero pagas hosting caro. Vercel es más rápido y económico.',
        puntos: 10
    },
    'Jimdo': {
        señales: [/jimdo\.com/i, /jimdofree/i],
        anguloVenta: 'Jimdo es amateur. Tu competencia ya se ve más profesional.',
        puntos: 35
    },
    'GoDaddy Website Builder': {
        señales: [/godaddy\.com\/websites/i, /secureserver\.net/i],
        anguloVenta: 'GoDaddy es para principiantes. Es hora de dar el salto a algo serio.',
        puntos: 35
    }
};

export function detectarSecuestroTecnico(html: string): SecuestroTecnico {
    for (const [plataforma, config] of Object.entries(PLATAFORMAS_SECUESTRABLES)) {
        for (const señal of config.señales) {
            if (señal.test(html)) {
                return {
                    plataforma,
                    esSecuestrable: true,
                    anguloVenta: config.anguloVenta,
                    puntos: config.puntos
                };
            }
        }
    }

    return {
        plataforma: null,
        esSecuestrable: false,
        anguloVenta: '',
        puntos: 0
    };
}

// ============================================
// 2. DETECCIÓN DE COPYRIGHT VIEJO
// ============================================

export function detectarCopyrightViejo(html: string): DeteccionCopyright {
    const añoActual = new Date().getFullYear();

    // Patrones comunes de copyright en footer
    const patrones = [
        /©\s*(\d{4})/gi,
        /copyright\s*(\d{4})/gi,
        /\(c\)\s*(\d{4})/gi,
        /derechos\s+reservados\s*(\d{4})/gi,
        /all\s+rights\s+reserved\s*(\d{4})/gi
    ];

    let añoMasReciente: number | null = null;

    for (const patron of patrones) {
        const matches = html.matchAll(patron);
        for (const match of matches) {
            const año = parseInt(match[1]);
            if (año >= 2000 && año <= añoActual) {
                if (!añoMasReciente || año > añoMasReciente) {
                    añoMasReciente = año;
                }
            }
        }
    }

    const añosAbandonado = añoMasReciente ? añoActual - añoMasReciente : 0;

    return {
        añoDetectado: añoMasReciente,
        añosAbandonado,
        esObsoleto: añosAbandonado >= 2 // 2+ años sin actualizar = obsoleto
    };
}

// ============================================
// 3. LOSS SCORE (Cálculo de Pérdida)
// ============================================

interface LossScoreInput {
    tieneWeb: boolean;
    webObsoleta: boolean;
    sinSSL: boolean;
    sinResponsive: boolean;
    redesAbandonadas: boolean;
    plataformaSecuestrable: string | null;
    rubro?: string;
}

// Estimaciones por rubro (ticket promedio mensual de cliente perdido)
const TICKET_POR_RUBRO: Record<string, number> = {
    'restaurante': 45000,
    'clinica': 120000,
    'abogado': 200000,
    'contador': 80000,
    'tienda': 35000,
    'default': 50000
};

export function calcularLossScore(input: LossScoreInput): LossScore {
    const factores: string[] = [];
    let multiplicador = 1;
    const ticketBase = TICKET_POR_RUBRO[input.rubro?.toLowerCase() || 'default'] || 50000;

    // Factor: No tiene web = pierde 100% de tráfico digital
    if (!input.tieneWeb) {
        factores.push('Sin presencia web = 100% de clientes digitales perdidos');
        multiplicador += 4;
    }

    // Factor: Web obsoleta = rebote alto
    if (input.webObsoleta) {
        factores.push('Sitio obsoleto = 60% de visitantes rebotan');
        multiplicador += 2;
    }

    // Factor: Sin SSL = Google penaliza y Chrome muestra "No seguro"
    if (input.sinSSL) {
        factores.push('Sin SSL = Google te penaliza y Chrome asusta clientes');
        multiplicador += 1.5;
    }

    // Factor: No responsive = 70% del tráfico es móvil
    if (input.sinResponsive) {
        factores.push('No responsive = 70% de usuarios en celular no pueden navegar');
        multiplicador += 2;
    }

    // Factor: Redes abandonadas = confianza baja
    if (input.redesAbandonadas) {
        factores.push('Redes abandonadas = clientes piensan que cerraste');
        multiplicador += 1;
    }

    // Factor: Plataforma secuestrable = oportunidad de diferenciarse
    if (input.plataformaSecuestrable) {
        factores.push(`${input.plataformaSecuestrable} = tu competencia te puede superar fácilmente`);
        multiplicador += 0.5;
    }

    // Cálculo: Asumimos 20 clientes potenciales perdidos al mes
    const clientesPerdidos = 20;
    const perdidaMensual = Math.round(ticketBase * clientesPerdidos * (multiplicador / 5));

    // Determinar severidad
    let severidad: 'baja' | 'media' | 'alta' | 'critica' = 'baja';
    if (perdidaMensual > 2000000) severidad = 'critica';
    else if (perdidaMensual > 1000000) severidad = 'alta';
    else if (perdidaMensual > 500000) severidad = 'media';

    return {
        perdidaMensual,
        perdidaFormateada: `$${perdidaMensual.toLocaleString('es-CL')}`,
        factores,
        severidad
    };
}

// ============================================
// 4. GUARDAR EN SOCIAL_NECROPSY
// ============================================

export async function guardarSaludSocial(
    leadId: string,
    redes: {
        facebook?: string | null;
        instagram?: string | null;
        linkedin?: string | null;
    }
): Promise<void> {
    const supabase = await createClient();

    const registros: Array<{
        lead_id: string;
        platform: string;
        status: string;
        profile_url: string | null;
        notes: string;
    }> = [];

    // Facebook
    if (redes.facebook) {
        registros.push({
            lead_id: leadId,
            platform: 'facebook',
            status: 'ALIVE', // Por ahora asumimos vivo si existe
            profile_url: redes.facebook,
            notes: 'Detectado via Serper discovery'
        });
    }

    // Instagram
    if (redes.instagram) {
        registros.push({
            lead_id: leadId,
            platform: 'instagram',
            status: 'ALIVE',
            profile_url: redes.instagram,
            notes: 'Detectado via Serper discovery'
        });
    }

    // LinkedIn
    if (redes.linkedin) {
        registros.push({
            lead_id: leadId,
            platform: 'linkedin',
            status: 'ALIVE',
            profile_url: redes.linkedin,
            notes: 'Detectado via búsqueda LinkedIn dedicada'
        });
    }

    if (registros.length > 0) {
        // Primero eliminamos registros anteriores para evitar duplicados
        await supabase
            .from('social_necropsy')
            .delete()
            .eq('lead_id', leadId);

        // Insertamos los nuevos
        const { error } = await supabase
            .from('social_necropsy')
            .insert(registros);

        if (error) {
            console.error('Error guardando social_necropsy:', error);
        } else {
            console.log(`✅ KIMI: Guardados ${registros.length} registros en social_necropsy`);
        }
    }
}

// ============================================
// 5. ANÁLISIS FORENSE COMPLETO
// ============================================

export async function analizarForense(
    html: string,
    leadId: string,
    redes: {
        facebook?: string | null;
        instagram?: string | null;
        linkedin?: string | null;
    },
    tieneSSL: boolean,
    tieneViewport: boolean,
    rubro?: string
): Promise<KimiForensicResult> {
    // 1. Detectar secuestro técnico
    const secuestro = detectarSecuestroTecnico(html);

    // 2. Detectar copyright viejo
    const copyright = detectarCopyrightViejo(html);

    // 3. Guardar salud social en DB
    await guardarSaludSocial(leadId, redes);

    // 4. Preparar salud social para response
    const saludSocial: SaludSocial[] = [];
    if (redes.facebook) {
        saludSocial.push({
            platform: 'facebook',
            status: 'ALIVE',
            profileUrl: redes.facebook,
            notes: 'Detectado'
        });
    }
    if (redes.instagram) {
        saludSocial.push({
            platform: 'instagram',
            status: 'ALIVE',
            profileUrl: redes.instagram,
            notes: 'Detectado'
        });
    }
    if (redes.linkedin) {
        saludSocial.push({
            platform: 'linkedin',
            status: 'ALIVE',
            profileUrl: redes.linkedin,
            notes: 'Detectado'
        });
    }

    // 5. Calcular Loss Score
    const lossScore = calcularLossScore({
        tieneWeb: html.length > 100,
        webObsoleta: copyright.esObsoleto,
        sinSSL: !tieneSSL,
        sinResponsive: !tieneViewport,
        redesAbandonadas: saludSocial.length === 0,
        plataformaSecuestrable: secuestro.plataforma,
        rubro
    });

    return {
        secuestro,
        copyright,
        saludSocial,
        lossScore
    };
}
