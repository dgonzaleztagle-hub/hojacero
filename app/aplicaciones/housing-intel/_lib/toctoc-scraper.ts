import puppeteer from 'puppeteer';
import puppeteerCore from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
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

// Helper para obtener el navegador correcto según el entorno
async function getBrowser() {
    const BROWSERLESS_URL = process.env.BROWSERLESS_URL;
    
    if (BROWSERLESS_URL) {
        console.log(`📡 [SCRAPER] Usando Navegador Remoto`);
        return await puppeteerCore.connect({ browserWSEndpoint: BROWSERLESS_URL });
    }
    
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
        console.log(`🚀 [SCRAPER] Iniciando Motor Serverless (Vercel Mode)`);
        return await puppeteerCore.launch({
            args: chromium.args,
            defaultViewport: { width: 1280, height: 800 },
            executablePath: await chromium.executablePath(),
            headless: true as any,
        });
    }

    console.log(`💻 [SCRAPER] Iniciando Motor Local`);
    return await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
}

/**
 * FASE 1: Scraper de Lista (Rápido y Ligero)
 * Captura las tarjetas de la vista general.
 */
export async function getTocTocPropertiesList(options: TocTocOptions): Promise<HousingProperty[]> {
  const { 
    centerLat, centerLng, bbox, 
    type = 'casa', operation = 'compra', ufValue = 37500 
  } = options;
  
  const viewportStr = getTocTocViewportString(bbox);
  const url = `https://www.toctoc.com/resultados/lista/${operation}/${type}/?viewport=${viewportStr}`;
  
  console.log(`📡 [LISTA] Iniciando escaneo rápido de ${type.toUpperCase()}`);
  
  const browser = await getBrowser();

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 4000)); // Espera para carga de tarjetas

    // @ts-ignore - Evitar choque de tipos entre puppeteer y puppeteer-core
    const properties = await page.evaluate((pType: string, currentUF: number, cLat: number, cLng: number) => {
      const results: any[] = [];
      const cards = Array.from(document.querySelectorAll('a.lnk-info'));
      const seenUrls = new Set();

      cards.forEach((link: any) => {
        const url = link.href;
        if (seenUrls.has(url)) return;
        seenUrls.add(url);

        const parent = link.closest('li, div[class*="item"], article');
        if (!parent) return;

        // PRECIO QUIRÚRGICO (Evitar billones)
        let pUF = 0;
        const priceText = parent.innerText || '';
        
        // Buscamos UF primero de forma estricta
        const ufMatch = priceText.match(/UF\s*([\d.]+)/i);
        const clpMatch = priceText.match(/\$\s*([\d.]+)/);

        if (ufMatch) {
            pUF = parseFloat(ufMatch[1].replace(/\./g, ''));
        } else if (clpMatch) {
            const val = parseFloat(clpMatch[1].replace(/\./g, ''));
            pUF = Math.round(val / currentUF);
        }

        if (pUF <= 0 || pUF > 500000) return; // Filtro de seguridad (no billones)

        // Características básicas de la tarjeta
        const featuresText = parent.innerText;
        const dormMatch = featuresText.match(/(\d+)\s*(?:dorm|hab)/i);
        const bathMatch = featuresText.match(/(\d+)\s*(?:baño|bath)/i);
        const m2Match = featuresText.match(/(\d+(?:\.\d+)?)\s*m²/);

        // Limpieza de título/ubicación quirúrgica
        let cleanTitle = link.innerText.trim();
        
        // Atacamos el caso específico de datos pegados (ej: "m2148" o "dorm3")
        // Agregamos espacios antes de números que vienen después de letras clave
        cleanTitle = cleanTitle
            .replace(/([a-zA-Z])(\d+)/g, '$1 $2') 
            .replace(/(\d+)([a-zA-Z])/g, '$1 $2');

        // Eliminamos ruidos de footer de tarjeta (tipologías, precios repetidos, etc)
        // Buscamos patrones como "Nuevo en venta", "UF", "m2", "Dorm"
        const patternsToCut = [/Nuevo en venta/i, /Casa\s*\|/i, /Depto\s*\|/i, /UF\s*\d+/i, /m2\s+/i];
        for (const p of patternsToCut) {
            const idx = cleanTitle.search(p);
            if (idx > 10) {
                cleanTitle = cleanTitle.substring(0, idx).trim();
            }
        }
        
        // Limpiamos comas o barras sobrantes al final
        cleanTitle = cleanTitle.replace(/[\|,]+$/, '').trim();

        results.push({
          id: Math.random().toString(36).substring(7),
          title: cleanTitle || `${pType} en sector`,
          location: cleanTitle || 'Sector referencial',
          price_uf: pUF,
          price_display: `UF ${pUF.toLocaleString('es-CL')}`,
          bedrooms: dormMatch ? parseInt(dormMatch[1]) : 0,
          bedrooms_display: dormMatch ? dormMatch[0] : "",
          bathrooms: bathMatch ? parseInt(bathMatch[1]) : 0,
          bathrooms_display: bathMatch ? bathMatch[0] : "",
          m2_total: m2Match ? parseFloat(m2Match[1].replace(',', '.')) : 0,
          m2_display: m2Match ? m2Match[0] : "",
          url,
          type: pType,
          source: 'toctoc',
          lat: cLat + (Math.random() - 0.5) * 0.005, // Coordenada referencial para lista
          lng: cLng + (Math.random() - 0.5) * 0.005
        });
      });
      return results;
    }, type, ufValue, centerLat, centerLng);

    return properties;
  } catch (error) {
    console.error('❌ Error Scraper Lista:', error);
    return [];
  } finally {
    await browser.close();
  }
}

/**
 * FASE 2: Scraper Forense (Profundo al Click)
 * Se activa tras el interés del usuario en una propiedad específica.
 */
export async function getTocTocPropertyDetail(url: string, currentUF: number = 37500): Promise<Partial<HousingProperty> | null> {
  console.log(`🔍 [FORENSE] Iniciando análisis profundo de: ${url}`);
  
  const browser = await getBrowser();

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await new Promise(r => setTimeout(r, 2000));

    // Intentar expandir descripción si existe el botón
    try {
        // @ts-ignore
        await page.evaluate(() => {
            const btn = document.querySelector('.btn-leermas') as HTMLButtonElement;
            if (btn) btn.click();
        });
        await new Promise(r => setTimeout(r, 800));
    } catch (e) {
        console.log("No hay botón de ver más o falló el click");
    }

    // @ts-ignore
    const detail = await page.evaluate((uf: number) => {
      const text = document.body.innerText;
      
      const getRawText = (label: string) => {
        // Buscamos el label y capturamos el texto que le sigue hasta un separador común (| o salto de línea)
        const r = new RegExp(`${label}:?\\s*([^\\n|]+)`, 'i');
        const m = text.match(r);
        return m ? m[1].trim() : "";
      };

      const parseIntSafe = (str: string) => {
        const m = str.match(/(\d+)/);
        return m ? parseInt(m[1]) : 0;
      };

      // Selectores robustos basados en Selenium Reference (XPATH)
      const getTocTocText = (xpath: string) => {
          const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          return result.singleNodeValue?.textContent?.trim() || "";
      };

      const seleniumPrice = getTocTocText("//div[contains(@class, 'precio-b') or contains(@class, 'precio-ficha')]");
      const seleniumHeader = getTocTocText("//h1[contains(@class, 'tt-ficha')]");
      const seleniumSpecs = getTocTocText("//ul[contains(@class, 'info_ficha')]");

      // Descripción con selectores más amplios y precisos tras click
      const descSelectors = [
          '.txt-descripcion',
          '.descripcion', 
          '[class*="description"]', 
          '#informacion-adicional',
          '.propiedad-descripcion',
          '[class*="text_expandible"]',
          '.desc-propiedad'
      ];
      let description = "";
      for (const sel of descSelectors) {
          const el = document.querySelector(sel);
          if (el && el.textContent?.trim()) {
              description = el.textContent.trim();
              if (description.length > 20) break;
          }
      }

      // Fallback: buscar el botón 'Leer más' y tomar el texto de su contenedor o el h3 "Información adicional"
      if (!description || description.length < 50) {
          const btnMore = document.querySelector('.btn-leermas');
          if (btnMore && btnMore.parentElement) {
              description = btnMore.parentElement.textContent?.replace('Leer más', '').replace('Leer menos', '').trim() || "";
          }
          
          if (!description) {
              const h3s = Array.from(document.querySelectorAll('h3, h2, span')) as HTMLElement[];
              const infoSection = h3s.find(h => h.innerText.includes('Información adicional') || h.innerText.includes('Descripción'));
              if (infoSection && infoSection.parentElement) {
                  description = infoSection.parentElement.innerText.replace(infoSection.innerText, '').trim();
              }
          }
      }

      // Rangos y textos reales
      const dormStr = getRawText('Dormitorios') || getRawText('Dorm');
      const bathStr = getRawText('Baños') || getRawText('Baño');
      const m2UtilStr = getRawText('Superficie útil') || getRawText('Superficie construida');
      const m2TotalStr = getRawText('Superficie total') || getRawText('Superficie terreno');

      // Coordenadas reales
      let lat = 0; let lng = 0;
      const scripts = Array.from(document.querySelectorAll('script'));
      for (const s of scripts) {
        const c = s.textContent || '';
        if (c.includes('latitude') && c.includes('longitude')) {
          const la = c.match(/"?latitude"?:\s*(-?\d+\.\d+)/);
          const lo = c.match(/"?longitude"?:\s*(-?\d+\.\d+)/);
          if (la) lat = parseFloat(la[1]);
          if (lo) lng = parseFloat(lo[1]);
          break;
        }
      }

      return {
        description: description,
        bedrooms: parseIntSafe(dormStr),
        bedrooms_display: dormStr,
        bathrooms: parseIntSafe(bathStr),
        bathrooms_display: bathStr,
        m2_total: parseIntSafe(m2UtilStr),
        m2_display: m2UtilStr,
        m2_terreno: parseIntSafe(m2TotalStr),
        m2_terreno_display: m2TotalStr,
        lat,
        lng
      };
    }, currentUF);

    return detail;
  } catch (error) {
    console.error('❌ Error Scraper Detalle:', error);
    return null;
  } finally {
    await browser.close();
  }
}

// Mantener compatibilidad con la firma anterior
export async function getTocTocProperties(options: TocTocOptions): Promise<HousingProperty[]> {
    return getTocTocPropertiesList(options);
}
