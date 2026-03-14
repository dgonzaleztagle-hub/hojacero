import puppeteer from 'puppeteer';

/**
 * Fase 1: Recolector de Semillas (Links de Propiedades)
 * Navega a una página de resultados de TOCTOC y extrae todos los links individuales.
 */
export async function collectPropertyLinks(seedUrl: string): Promise<string[]> {
    console.log(`🌱 Iniciando recolección de semillas en: ${seedUrl}`);
    
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled',
            '--window-size=1920,1080'
        ]
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1920, height: 1080 });

        // Navegar con paciencia
        await page.goto(seedUrl, { waitUntil: 'networkidle2' });
        
        // Espera humana aleatoria
        await new Promise(r => setTimeout(r, 4000 + Math.random() * 2000));

        // Extraer todos los links que coinciden con el patrón de propiedad
        const links = await page.evaluate(() => {
            const anchors = Array.from(document.querySelectorAll('a[href*="/propiedades/"]'));
            return anchors
                .map(a => (a as HTMLAnchorElement).href)
                .filter(href => href.includes('/propiedades/') && !href.includes('/simular/'));
        });

        // Deduplicar
        const uniqueLinks = [...new Set(links)];
        console.log(`✅ Se recolectaron ${uniqueLinks.length} links únicos.`);
        
        return uniqueLinks;
    } catch (error) {
        console.error('❌ Error en recolección de semillas:', error);
        return [];
    } finally {
        await browser.close();
    }
}
