import puppeteer from 'puppeteer';
import { HousingProperty, BoundingBox } from './types';
import { getTocTocViewportString } from './geo-utils';

export interface TocTocOptions {
    centerLat: number;
    centerLng: number;
    radiusInMeters: number;
    bbox: BoundingBox;
    type?: 'casa' | 'departamento';
    operation?: 'compra' | 'arriendo';
    addressHint?: string;
    ufValue?: number;
}

export async function getTocTocProperties(options: TocTocOptions): Promise<HousingProperty[]> {
  const { 
    centerLat, centerLng, radiusInMeters, bbox, 
    type = 'casa', operation = 'compra', addressHint = '', ufValue = 37500 
  } = options;
  
  const viewportStr = getTocTocViewportString(bbox);
  // Vamos a la vista de lista que es mucho más fácil de scrapear (DOM Puro)
  const url = `https://www.toctoc.com/resultados/lista/${operation}/${type}/?viewport=${viewportStr}`;
  
  console.log(`🚀 Iniciando ZERO-CASCARON Scraper (Extracción DOM): ${type.toUpperCase()}`);
  console.log(`📍 URL: ${url}`);

  console.log('📡 [SCRAPER TRACE] Lanzando Puppeteer...');
  const browser = await puppeteer.launch({
    headless: true, // Modo silencioso
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1920,1080'
    ]
  });
  console.log('📡 [SCRAPER TRACE] Navegador lanzado con éxito.');

  const page = await browser.newPage();
  console.log('📡 [SCRAPER TRACE] Nueva pestaña abierta.');
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');

  try {
    console.log(`📡 [SCRAPER TRACE] Navegando a: ${url}`);
    
    // Ir a la página y esperar a que los resultados se carguen (las tarjetas de propiedades)
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
    console.log('📡 [SCRAPER TRACE] Página cargada (domcontentloaded).');
    
    // Simular un poco de scroll para gatillar lazy loading si lo hubiera
    await page.evaluate(() => window.scrollBy(0, 1000));
    await new Promise(r => setTimeout(r, 2000));
    await page.evaluate(() => window.scrollBy(0, 2000));
    await new Promise(r => setTimeout(r, 2000));

    console.log(`🔌 Extrayendo tarjetas de resultados...`);

    const properties: any[] = await page.evaluate((pType: string, currentUF: number) => {
      const results: any[] = [];
      // Buscar todos los contenedores de propiedades (suele ser un li o div con clase específica)
      // Usaremos un selector genérico que busque enlaces de propiedades
      const cards = Array.from(document.querySelectorAll('li, div.resultado-item, div[data-id]'));
      
      const uniqueIds = new Set();

      cards.forEach(card => {
        // Buscar el link
        const linkEl = card.querySelector('a[href*="/propiedades/"]') as HTMLAnchorElement;
        if (!linkEl) return;
        
        const url = linkEl.href;
        if (uniqueIds.has(url)) return;
        
        // Buscar precio (Suele tener símbolo UF o $)
        const rawText = card.textContent || '';
        const priceClean = card.querySelector('.precio, [class*="price"]')?.textContent?.trim() || '';
        
        let pUF = 0;
        const isPesos = priceClean.includes('$') || rawText.includes('$');
        const isUF = priceClean.toUpperCase().includes('UF') || rawText.toUpperCase().includes('UF');

        const numericMatch = priceClean.match(/([\d,.]+)/) || rawText.match(/([\d,.]+)/);
        if (numericMatch) {
            let val = parseFloat(numericMatch[1].replace(/\./g, '').replace(',', '.'));
            
            if (isPesos && !isUF) {
                // Convertir CLP a UF (usando valor actual)
                pUF = Math.round(val / currentUF);
            } else {
                // Asumir UF o si no hay símbolo, por magnitud (si es > 100.000 es CLP)
                if (val > 100000) {
                    pUF = Math.round(val / currentUF);
                } else {
                    pUF = val;
                }
            }
        }
        
        if (pUF <= 0) return; // Propiedad sin precio, descartar

        // Buscar título o dirección (excluir si parece precio)
        const titleEl = card.querySelector('h2, h3, h4, .direccion, [class*="title"], [class*="address"]');
        let title = (titleEl?.textContent?.trim() || `${pType} en sector`).replace(/\s+/g, ' ');
        
        // Si el título es igual al precio, buscar otro elemento o usar default
        if (title.includes('UF') || title.includes('$') || title.length < 5) {
            const betterTitle = card.querySelector('.direccion, [class*="address"]')?.textContent?.trim();
            title = betterTitle || `${pType} en sector`;
        }

        // Buscar camas y baños
        const featuresText = card.textContent || '';
        const bedsMatch = featuresText.match(/(\d+)\s*(?:dormitorio|habitación|bed|dorm|D)/i);
        const bathsMatch = featuresText.match(/(\d+)\s*(?:baño|bath|B)/i);
        const m2Match = featuresText.match(/(\d+)\s*(?:m2|metros|m²)/i);

        const bedrooms = bedsMatch ? parseInt(bedsMatch[1]) : 0;
        const bathrooms = bathsMatch ? parseInt(bathsMatch[1]) : 0;
        const m2_total = m2Match ? parseInt(m2Match[1]) : 0;

        // Simulamos la lat/lng centrada porque desde la lista no siempre vienen
        // En producción el Frontend muestra la info en la tarjeta
        if (pUF > 0) {
            results.push({
                id: Math.random().toString(36).substring(7),
                title,
                address: title,
                price: `UF ${pUF.toLocaleString('es-CL')}`,
                price_uf: pUF,
                type: pType,
                url,
                lat: 0, // Fallback, se llenará más adelante si es necesario
                lng: 0,
                m2_total,
                bedrooms,
                bathrooms,
                source: 'TOCTOC (DOM Scanner)'
            });
            uniqueIds.add(url);
        }
      });
      return results;
    }, type, ufValue);

    console.log(`🎯 DOM SCANNER EXITOSO: ${properties.length} propiedades extraídas.`);
    
    // Asignar lat/lng heurística basada en el centro (ya que DOM list view no tiene coor)
    const finalProps = (properties as any[]).map((p: any) => ({
        ...p,
        lat: centerLat + (Math.random() - 0.5) * 0.005, // Dispersión aleatoria cerca del centro
        lng: centerLng + (Math.random() - 0.5) * 0.005
    }));

    return finalProps;

  } catch (error) {
    console.error('❌ Error en DOM Scanner:', error);
    return [];
  } finally {
    await browser.close();
  }
}

