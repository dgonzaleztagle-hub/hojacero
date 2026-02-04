/**
 * 🧪 Kimi Forensic Logic (HojaCero Radar v2.0)
 * 
 * Este archivo contiene la inteligencia "mala leche" de Kimi traducida a TypeScript.
 * Su objetivo es transformar datos técnicos en argumentos de venta financieros.
 */

export type ForensicArchetype = 'TIEMPO' | 'CONFIANZA' | 'ESPACIO' | 'SOCIAL' | 'ELITE' | 'DESCONOCIDO';

export interface LossScoreResult {
    monthlyLoss: number;
    currency: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    reason: string;
}

export interface SocialNecropsy {
    platform: 'instagram' | 'facebook' | 'tiktok' | 'linkedin';
    status: 'ALIVE' | 'ZOMBIE' | 'DEAD';
    lastActivity?: string;
    followerCount?: number;
}

/**
 * Calcula la pérdida financiera estimada basada en el "Dolor Digital".
 * Fórmula: Tráfico Mensual Est. x % Abandono (por arquetipo) x Severidad x (Ticket Promedio / 1000)
 */
export function calculateLossScore(
    techStack: string[],
    hasSSL: boolean,
    archetype: ForensicArchetype,
    businessType: string = 'general'
): LossScoreResult {
    // Valores base por defecto (Chile CLP)
    let trafficEst = 1000; // Tráfico base para el cálculo
    let ticketPromedio = 25000; // CLP promedio por venta
    let abandonmentRate = 0.15; // 15% base

    // 1. Penalización por Arquetipo
    switch (archetype) {
        case 'TIEMPO': abandonmentRate += 0.25; break; // La gente no espera
        case 'CONFIANZA': abandonmentRate += 0.20; break; // Da miedo comprar
        case 'SOCIAL': abandonmentRate += 0.10; break; // Falta prueba social
        case 'ESPACIO': abandonmentRate += 0.15; break; // Mala info de contacto
    }

    // 2. Penalización por Tech Stack (Obsolescencia)
    if (techStack.includes('Wix')) abandonmentRate += 0.10;
    if (techStack.includes('WordPress')) abandonmentRate += 0.05;
    if (!hasSSL) abandonmentRate += 0.30; // Factor crítico de abandono

    // 3. Severidad
    let severity: LossScoreResult['severity'] = 'low';
    if (abandonmentRate > 0.5) severity = 'critical';
    else if (abandonmentRate > 0.35) severity = 'high';
    else if (abandonmentRate > 0.2) severity = 'medium';

    const monthlyLoss = Math.round(trafficEst * abandonmentRate * (ticketPromedio / 10)); // Ajuste de fórmula para realismo

    return {
        monthlyLoss,
        currency: 'CLP',
        severity,
        reason: `Abandono estimado del ${(abandonmentRate * 100).toFixed(0)}% debido a ${archetype} y deficiencias técnicas.`
    };
}

/**
 * Detecta el Arquetipo de Dolor predominante.
 */
export function detectArchetype(scraped: any, techResults?: any): ForensicArchetype {
    // 1. Prioridad: Confianza (Si falla lo básico)
    if (!scraped.hasSSL || scraped.techStack.includes('Wix') || !scraped.hasContactPage) return 'CONFIANZA';

    // 2. Prioridad: Espacio (Si no hay formas de contacto directas)
    if (!scraped.whatsapp && !scraped.emails?.length) return 'ESPACIO';

    // 3. Prioridad: Social (Si no hay rastro de comunidad)
    if (!scraped.instagram && !scraped.facebook) return 'SOCIAL';

    // 4. Prioridad: Tiempo (Si el sitio es pesado o viejo)
    if (scraped.techStack.includes('WordPress') || (techResults?.pageSpeed?.mobileScore && techResults.pageSpeed.mobileScore < 40)) return 'TIEMPO';

    // 5. Elite (Si todo está bien, buscamos la excelencia visual)
    return 'ELITE';
}

/**
 * Verifica si un link de red social es un "Cadáver Digital".
 */
export function getSocialStatus(url: string, htmlLower: string): SocialNecropsy['status'] {
    if (!url) return 'DEAD';

    // Patrones de zombies (plantillas sin configurar)
    const zombiePatterns = [
        'wix.com',
        'facebook.com/yourpage',
        'instagram.com/username',
        'example.com'
    ];

    if (zombiePatterns.some(p => url.toLowerCase().includes(p))) return 'ZOMBIE';

    return 'ALIVE';
}

/**
 * Infiere posibles emails corporativos basados en patrones comunes.
 */
export function inferEmails(domain: string, names: string[]): string[] {
    const patterns = [
        (n: string) => `${n.toLowerCase()}@${domain}`,
        (n: string) => `${n.toLowerCase().split(' ')[0]}@${domain}`,
        (n: string) => `${n.toLowerCase().split(' ')[0]}.${n.toLowerCase().split(' ')[1]}@${domain}`,
        (n: string) => `hola@${domain}`,
        (n: string) => `contacto@${domain}`,
        (n: string) => `ventas@${domain}`
    ];

    const inferred: string[] = [];
    names.forEach(name => {
        patterns.slice(0, 3).forEach(p => inferred.push(p(name)));
    });
    patterns.slice(3).forEach(p => inferred.push(p('')));

    return [...new Set(inferred)];
}

/**
 * Calcula el "Antídoto" estratégico basado en el arquetipo.
 * Este es el puente hacia el Factory.
 */
export function getStrategicAntidote(archetype: ForensicArchetype): { components: string[], focus: string } {
    switch (archetype) {
        case 'TIEMPO':
            return {
                components: ['VelocityScroll', 'AnimatedCounter', 'FastBookingPanel'],
                focus: 'Velocidad de respuesta e inmediatez.'
            };
        case 'CONFIANZA':
            return {
                components: ['BentoGrid', '3DCard', 'TrustTestimonials'],
                focus: 'Autoridad, certificaciones y prueba social.'
            };
        case 'SOCIAL':
            return {
                components: ['SocialReanimationWall', 'InstagramGridPremium'],
                focus: 'Modernidad y pulso de marca activo.'
            };
        default:
            return {
                components: ['AnimatedGradient', 'KineticText'],
                focus: 'Estética premium general.'
            };
    }
}
