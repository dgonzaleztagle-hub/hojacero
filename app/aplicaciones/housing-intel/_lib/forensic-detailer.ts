import puppeteer from 'puppeteer';
import { HousingProperty } from './types';

/**
 * Fase 2: Detallista Forense (Extracción de Datos de Propiedad)
 * Visita cada link individual y extrae la información detallada con sigilo.
 */
export async function extractPropertyDetails(url: string): Promise<Partial<HousingProperty> | null> {
    console.log(`🔍 Extrayendo detalle forense de: ${url}`);
    
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
        
        // Navegar con sigilo
        await page.goto(url, { waitUntil: 'networkidle2' });
        
        // Pausa humana de seguridad (mimicry)
        await new Promise(r => setTimeout(r, 4000 + Math.random() * 2000));

        const data = await page.evaluate(() => {
            const titleElement = document.querySelector('h1') || 
                                document.querySelector('h2.nom-proyecto') ||
                                document.querySelector('.title-ficha');
            const title = titleElement?.textContent?.trim() || '';
            
            const priceElement = document.querySelector('p.precio') ||
                                document.querySelector('.precio-b') || 
                                document.querySelector('.precio-ficha') || 
                                document.querySelector('h2.precio');
            const priceRaw = priceElement?.textContent?.trim() || '';
            
            const infoList = Array.from(document.querySelectorAll('ul.f-programa li, .info_ficha li, .caracteristicas li'));
            const infoText = infoList.map(li => li.textContent?.toLowerCase() || '').join(' | ');

            const extractNum = (pattern: string) => {
                const regex = new RegExp(pattern);
                const match = infoText.match(regex);
                return match ? parseInt(match[1]) : 0;
            };

            return {
                title,
                priceRaw,
                bedrooms: extractNum('(\\d+)\\s*dorm'),
                bathrooms: extractNum('(\\d+)\\s*bañ'),
                m2_total: extractNum('(\\d+)\\s*m²?')
            };
        });

        console.log(`✅ Datos extraídos de ${url}: ${data.title} - ${data.priceRaw}`);

        // Procesar precio a UF (limpieza simple)
        let priceUF = 0;
        if (data.priceRaw) {
            const match = data.priceRaw.match(/([\d.]+)/);
            if (match) {
                priceUF = parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
            }
        }

        return {
            title: data.title,
            price_uf: priceUF,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            m2_total: data.m2_total,
            url: url,
            source: 'market_intel',
            type: 'casa' // Default por ahora
        };

    } catch (error) {
        console.error(`❌ Error extrayendo detalle de ${url}:`, error);
        return null;
    } finally {
        await browser.close();
    }
}
