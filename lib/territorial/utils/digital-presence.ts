/**
 * Digital Presence Classifier
 * 
 * Clasifica la presencia digital de un negocio para evitar confundir
 * "sitio web propio" con "perfil de Google" o "redes sociales".
 */

export interface PresenciaDigital {
    tiene_sitio_web: boolean;
    tiene_perfil_google: boolean;
    tiene_instagram: boolean;
    tiene_facebook: boolean;
    tiene_tiktok: boolean;
    url_sitio_web?: string;
    url_perfil_google?: string;
    url_instagram?: string;
    url_facebook?: string;
    url_tiktok?: string;
}

/**
 * Clasifica una URL según su tipo
 * 
 * @param url URL a clasificar
 * @returns Tipo de presencia digital
 */
export function clasificarURL(url: string): {
    tipo: 'sitio_web' | 'google' | 'instagram' | 'facebook' | 'tiktok' | 'otra_red_social' | 'desconocido';
    url: string;
} {
    const urlLower = url.toLowerCase();

    // Google (Maps, Business, etc.)
    if (
        urlLower.includes('google.com/maps') ||
        urlLower.includes('google.cl/maps') ||
        urlLower.includes('goo.gl/maps') ||
        urlLower.includes('maps.app.goo.gl') ||
        urlLower.includes('business.google.com')
    ) {
        return { tipo: 'google', url };
    }

    // Instagram
    if (
        urlLower.includes('instagram.com') ||
        urlLower.includes('instagr.am')
    ) {
        return { tipo: 'instagram', url };
    }

    // Facebook
    if (
        urlLower.includes('facebook.com') ||
        urlLower.includes('fb.com') ||
        urlLower.includes('fb.me')
    ) {
        return { tipo: 'facebook', url };
    }

    // TikTok
    if (
        urlLower.includes('tiktok.com') ||
        urlLower.includes('vm.tiktok.com')
    ) {
        return { tipo: 'tiktok', url };
    }

    // Otras redes sociales
    if (
        urlLower.includes('twitter.com') ||
        urlLower.includes('x.com') ||
        urlLower.includes('linkedin.com') ||
        urlLower.includes('youtube.com') ||
        urlLower.includes('whatsapp.com') ||
        urlLower.includes('wa.me')
    ) {
        return { tipo: 'otra_red_social', url };
    }

    // Si no es ninguna de las anteriores, es un sitio web propio
    // (o al menos no es una red social conocida)
    if (
        urlLower.startsWith('http://') ||
        urlLower.startsWith('https://') ||
        urlLower.startsWith('www.')
    ) {
        return { tipo: 'sitio_web', url };
    }

    return { tipo: 'desconocido', url };
}

/**
 * Analiza la presencia digital de un negocio basándose en sus URLs
 * 
 * @param urls Array de URLs asociadas al negocio
 * @returns Objeto con presencia digital clasificada
 */
export function analizarPresenciaDigital(urls: string[]): PresenciaDigital {
    const presencia: PresenciaDigital = {
        tiene_sitio_web: false,
        tiene_perfil_google: false,
        tiene_instagram: false,
        tiene_facebook: false,
        tiene_tiktok: false,
    };

    for (const url of urls) {
        if (!url) continue;

        const clasificacion = clasificarURL(url);

        switch (clasificacion.tipo) {
            case 'sitio_web':
                presencia.tiene_sitio_web = true;
                presencia.url_sitio_web = url;
                break;
            case 'google':
                presencia.tiene_perfil_google = true;
                presencia.url_perfil_google = url;
                break;
            case 'instagram':
                presencia.tiene_instagram = true;
                presencia.url_instagram = url;
                break;
            case 'facebook':
                presencia.tiene_facebook = true;
                presencia.url_facebook = url;
                break;
            case 'tiktok':
                presencia.tiene_tiktok = true;
                presencia.url_tiktok = url;
                break;
        }
    }

    return presencia;
}

/**
 * Genera un resumen legible de la presencia digital
 * 
 * @param presencia Presencia digital analizada
 * @returns String con resumen
 */
export function generarResumenPresencia(presencia: PresenciaDigital): string {
    const canales: string[] = [];

    if (presencia.tiene_sitio_web) canales.push('Sitio Web Propio');
    if (presencia.tiene_perfil_google) canales.push('Perfil Google');
    if (presencia.tiene_instagram) canales.push('Instagram');
    if (presencia.tiene_facebook) canales.push('Facebook');
    if (presencia.tiene_tiktok) canales.push('TikTok');

    if (canales.length === 0) {
        return 'Sin presencia digital detectada';
    }

    return canales.join(' + ');
}

/**
 * Calcula un score de presencia digital (0-100)
 * 
 * @param presencia Presencia digital analizada
 * @returns Score de 0 a 100
 */
export function calcularScorePresencia(presencia: PresenciaDigital): number {
    let score = 0;

    // Sitio web propio es lo más valioso (40 puntos)
    if (presencia.tiene_sitio_web) score += 40;

    // Perfil Google es importante para SEO local (20 puntos)
    if (presencia.tiene_perfil_google) score += 20;

    // Redes sociales (10 puntos cada una)
    if (presencia.tiene_instagram) score += 15; // Instagram es más importante
    if (presencia.tiene_facebook) score += 10;
    if (presencia.tiene_tiktok) score += 15; // TikTok está creciendo

    return Math.min(score, 100); // Cap a 100
}
