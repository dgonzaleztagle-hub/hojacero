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
    type = 'casa', operation = 'compra', ufValue = 37500,
    addressHint
  } = options;
  
  const viewportStr = getTocTocViewportString(bbox);
  const queryText = addressHint ? encodeURIComponent(addressHint) : "";
  const url = `https://www.toctoc.com/resultados/lista/${operation}/${type}/?texto=${queryText}&viewport=${viewportStr}`;
  
  console.log(`📡 [LISTA] Iniciando escaneo quirúrgico de ${type.toUpperCase()}`);
  
  const browser = await getBrowser();

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1000 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');

    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (['image', 'font', 'media'].includes(req.resourceType())) {
            req.abort();
        } else {
            req.continue();
        }
    });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    
    // Esperar a que carguen las tarjetas
    try {
        await page.waitForSelector('div[class*="Card_container"], a.lnk-info', { timeout: 15000 });
    } catch (e) {
        console.log("⚠️ No se encontraron selectores estándar, esperando 5s...");
        await new Promise(r => setTimeout(r, 5000));
    }

    // @ts-ignore
    const properties = await page.evaluate((pType: string, currentUF: number, cLat: number, cLng: number) => {
      const results: any[] = [];
      // TocToc usa distintas clases según si es proyecto nuevo o usado
      const cards = Array.from(document.querySelectorAll('div[class*="Card_container"], li[class*="item"], article'));
      const seenUrls = new Set();

      cards.forEach((card: any) => {
        const linkEl = card.querySelector('a[href*="/propiedades/"]') as HTMLAnchorElement;
        const url = linkEl?.href;
        if (!url || seenUrls.has(url)) return;
        seenUrls.add(url);

        // EXTRACCIÓN DE PRECIO
        let pUF = 0;
        const priceEl = card.querySelector('p[class*="txtPrecioA-ds"], .precio-uf, .price');
        const priceText = priceEl?.innerText || card.innerText;
        
        const ufMatch = priceText.match(/UF\s*([\d.]+)/i);
        const clpMatch = priceText.match(/\$\s*([\d.]+)/);

        if (ufMatch) {
            pUF = parseFloat(ufMatch[1].replace(/\./g, ''));
        } else if (clpMatch) {
            const val = parseFloat(clpMatch[1].replace(/\./g, ''));
            pUF = Math.round(val / currentUF);
        }

        if (pUF <= 0 || pUF > 1000000) return;

        // EXTRACCIÓN DE CARACTERÍSTICAS (Priorizar limpieza de texto)
        const innerText = card.innerText;
        const dormMatch = innerText.match(/(\d+)\s*(?:dorm|hab)/i);
        const bathMatch = innerText.match(/(\d+)\s*(?:baño|bath)/i);
        const m2Match = innerText.match(/(\d+(?:[.,]\d+)?)\s*m²/i);

        // Limpieza de Título (Evitar duplicación de comuna)
        let rawTitle = linkEl?.innerText?.trim() || card.querySelector('h3, h2, p[class*="address"]')?.innerText?.trim() || "Propiedad";
        
        // El 'tartamudeo' ocurre porque a veces el título ya trae la comuna
        // Intentamos limpiar ruidos comunes
        let cleanTitle = rawTitle.split('\n')[0].trim();
        cleanTitle = cleanTitle.replace(/Nuevo en venta/i, '').replace(/\|/g, '').trim();

        results.push({
          id: Math.random().toString(36).substring(7),
          title: cleanTitle,
          location: cleanTitle,
          price_uf: pUF,
          price_display: `UF ${pUF.toLocaleString('es-CL')}`,
          bedrooms: dormMatch ? parseInt(dormMatch[1]) : 0,
          bedrooms_display: dormMatch ? dormMatch[0] : "---",
          bathrooms: bathMatch ? parseInt(bathMatch[1]) : 0,
          bathrooms_display: bathMatch ? bathMatch[0] : "---",
          m2_total: m2Match ? parseFloat(m2Match[1].replace(',', '.')) : 0,
          m2_display: m2Match ? m2Match[0] : "--- m²",
          url,
          type: pType,
          source: 'market_intel',
          // Coordenadas con menor dispersión para que el radar se vea más agrupado
          lat: cLat + (Math.random() - 0.5) * 0.002, 
          lng: cLng + (Math.random() - 0.5) * 0.002
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
 * Selectores de referencia: goyanedelv/toctoc-scrapper (Selenium)
 *   - precio: //div[contains(@class, 'precio-b') or contains(@class, 'precio-ficha')]
 *   - header: //h1[contains(@class, 'tt-ficha')]
 *   - specs:  //ul[contains(@class, 'info_ficha')]
 */
export async function getTocTocPropertyDetail(url: string, currentUF: number = 37500): Promise<Partial<HousingProperty> | null> {
  console.log(`🔍 [FORENSE] Análisis profundo: ${url}`);
  
  const browser = await getBrowser();

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise(r => setTimeout(r, 3000));

    // Click "Leer más" si existe (antes de evaluate para que el DOM se actualice)
    try {
      // @ts-ignore - puppeteer vs puppeteer-core type conflict
      await page.evaluate(`
        (function() {
          var btn = document.querySelector('.btn-leermas');
          if (!btn) {
            var els = document.querySelectorAll('button, a, span');
            for (var i = 0; i < els.length; i++) {
              if (els[i].textContent && els[i].textContent.indexOf('Leer m') !== -1) {
                btn = els[i]; break;
              }
            }
          }
          if (btn) btn.click();
        })()
      `);
      await new Promise(r => setTimeout(r, 1500));
    } catch (_e) { /* no pasa nada */ }

    // Extracción principal — TODO en un string de función para evitar __name
    // @ts-ignore - puppeteer vs puppeteer-core type conflict
    const detail = await page.evaluate(`
      (function() {
        var text = document.body.innerText || "";
        
        // === DESCRIPCIÓN ===
        var description = "";
        var descSels = ['.txt-descripcion', '.descripcion', '#informacion-adicional', 
                       '.propiedad-descripcion', '.desc-propiedad'];
        for (var i = 0; i < descSels.length; i++) {
          var el = document.querySelector(descSels[i]);
          if (el && el.innerText && el.innerText.trim().length > 30) {
            description = el.innerText.trim();
            break;
          }
        }
        // Fallback 1: buscar header "Información adicional" y tomar nextSibling o parent text
        if (!description) {
          var headers = document.querySelectorAll('h2, h3, h4');
          for (var h = 0; h < headers.length; h++) {
            var hText = headers[h].innerText || '';
            if (hText.indexOf('nformaci') !== -1 && hText.indexOf('Contacto') === -1) {
              // Tomar el siguiente hermano del header (donde suele estar la desc)
              var next = headers[h].nextElementSibling;
              if (next && next.innerText && next.innerText.trim().length > 30) {
                description = next.innerText.trim();
              }
              // Si no hay hermano, tomar el texto del padre sin el header
              if (!description) {
                var parent = headers[h].parentElement;
                if (parent) {
                  description = parent.innerText.replace(hText, '').trim();
                }
              }
              break;
            }
          }
        }
        // Fallback 2: buscar en texto completo entre "Información adicional" y el siguiente header conocido
        if (!description) {
          var idx = text.indexOf('nformaci');
          if (idx > 0) {
            var chunk = text.substring(idx + 22, idx + 1500);
            var cutIdx = chunk.search(/Contacto|Compartir|Denunciar|\\n\\n\\n/);
            if (cutIdx > 30) {
              description = chunk.substring(0, cutIdx).trim();
            } else if (chunk.length > 30) {
              description = chunk.substring(0, 800).trim();
            }
          }
        }

        // === COORDENADAS ===
        var lat = 0, lng = 0;
        // A. Google Maps link
        var gmLink = document.querySelector('a[href*="google.com/maps"]');
        if (gmLink) {
          var href = gmLink.href || gmLink.getAttribute('href') || "";
          var cMatch = href.match(/q=(-?[0-9]+\\.[0-9]+),(-?[0-9]+\\.[0-9]+)/);
          if (!cMatch) cMatch = href.match(/@(-?[0-9]+\\.[0-9]+),(-?[0-9]+\\.[0-9]+)/);
          if (cMatch) {
            lat = parseFloat(cMatch[1]);
            lng = parseFloat(cMatch[2]);
          }
        }
        // B. Scripts internos
        if (lat === 0) {
          var scripts = document.querySelectorAll('script');
          for (var s = 0; s < scripts.length; s++) {
            var sc = scripts[s].textContent || "";
            var latR = sc.match(/"lat(?:itude)?"\\s*:\\s*(-?[0-9]+\\.[0-9]+)/);
            var lngR = sc.match(/"(?:lng|longitude)"\\s*:\\s*(-?[0-9]+\\.[0-9]+)/);
            if (latR && lngR) {
              lat = parseFloat(latR[1]);
              lng = parseFloat(lngR[1]);
              break;
            }
          }
        }

        // === ATRIBUTOS (usando texto plano — robusto) ===
        var dormM = text.match(/(\\d+)\\s*dorm/i) || text.match(/(\\d+)\\s*Dorm/);
        var bathM = text.match(/(\\d+)\\s*ba[ñn]o/i);
        var dorms = dormM ? parseInt(dormM[1]) : 0;
        var baths = bathM ? parseInt(bathM[1]) : 0;

        // m2: priorizar "útil" o "construida" sobre "total"
        var m2UM = text.match(/(\\d+(?:[.,]\\d+)?)\\s*m.\\s*[uú]til/i) ||
                   text.match(/[uú]til[^\\d]*(\\d+(?:[.,]\\d+)?)/i) ||
                   text.match(/(\\d+(?:[.,]\\d+)?)\\s*m.\\s*construid/i);
        var m2TM = text.match(/(\\d+(?:[.,]\\d+)?)\\s*m.\\s*total/i) ||
                   text.match(/[Tt]otal[^\\d]*(\\d+(?:[.,]\\d+)?)/i);
        var m2U = m2UM ? m2UM[1] : "";
        var m2T = m2TM ? m2TM[1] : "";

        // === CONTACTO ===
        var contactName = "";
        var contactPhone = "";
        var contactEmail = "";
        var contactCompany = "";
        var contactWhatsapp = "";
        
        // Bloque de contacto (el box lateral que vimos en la imagen)
        var contactBox = document.querySelector('.cf-contacto, .box-contacto, [class*="contacto"], [class*="contact"]');
        if (contactBox) {
          var cText = contactBox.innerText || "";
          // Teléfono
          var phoneM = cText.match(/\\+?56\\s*9?\\s*[\\d\\s]{8,12}/) || cText.match(/\\d{4}\\s*\\d{4}/);
          if (phoneM) contactPhone = phoneM[0].trim();
          // Email
          var emailM = cText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/);
          if (emailM) contactEmail = emailM[0];
          // Nombre empresa/corredor
          var nameEl = contactBox.querySelector('[class*="nombre"], [class*="name"], strong, b');
          if (nameEl) contactName = nameEl.innerText.trim();
        }
        
        // WhatsApp link
        var waLink = document.querySelector('a[href*="wa.me"], a[href*="whatsapp"]');
        if (waLink) {
          contactWhatsapp = waLink.href || waLink.getAttribute('href') || "";
        }
        
        // Inmobiliaria/Anunciante
        var anuncEl = document.querySelector('[class*="anunciante"], [class*="broker"], [class*="inmobiliaria"]');
        if (anuncEl) contactCompany = anuncEl.innerText.trim();

        return {
          description: description.substring(0, 1500),
          bedrooms: dorms,
          bedrooms_display: dorms ? dorms + " Dorm." : "---",
          bathrooms: baths,
          bathrooms_display: baths ? baths + " Baños" : "---",
          m2_total: parseFloat(String(m2U || m2T || "0").replace(",", ".")),
          m2_display: m2U ? m2U + " m² útiles" : (m2T ? m2T + " m² totales" : "--- m²"),
          m2_terreno: parseFloat(String(m2T || "0").replace(",", ".")),
          lat: lat,
          lng: lng,
          contact_name: contactName,
          contact_phone: contactPhone,
          contact_email: contactEmail,
          contact_company: contactCompany,
          contact_whatsapp: contactWhatsapp
        };
      })()
    `);

    return detail as Partial<HousingProperty>;
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
