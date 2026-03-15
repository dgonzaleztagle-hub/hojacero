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
 * Captura las tarjetas de la vista general usando a.lnk-info
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

    // Se cargan imágenes para no activar el anti-bot de Cloudflare
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    
    // Esperar a que carguen los links de propiedad
    try {
        await page.waitForSelector('a.lnk-info', { timeout: 15000 });
    } catch (e) {
        console.log("⚠️ No se encontró a.lnk-info, esperando 5s...");
        await new Promise(r => setTimeout(r, 5000));
    }

    // @ts-ignore
    const properties = await page.evaluate((pType: string, currentUF: number, cLat: number, cLng: number) => {
      const results: any[] = [];
      const links = document.querySelectorAll('a.lnk-info');
      const seenUrls = new Set();

      for (let i = 0; i < links.length; i++) {
        const linkEl = links[i] as HTMLAnchorElement;
        const url = linkEl.href;
        if (!url || url.indexOf('/propiedades/') === -1 || seenUrls.has(url)) continue;
        seenUrls.add(url);

        // PRECIO: está en el <a> anterior (el de la foto) o en el padre
        let pUF = 0;
        let priceText = "";
        const prevA = linkEl.previousElementSibling as HTMLAnchorElement;
        if (prevA && prevA.tagName === 'A') {
            const priceEl = prevA.querySelector('h4, .precio-uf, [class*="precio"]');
            priceText = priceEl ? priceEl.textContent || "" : prevA.textContent || "";
        } else {
            priceText = linkEl.parentElement?.textContent || "";
        }
        
        const ufMatch = priceText.match(/UF\s*([\d.]+)/i);
        const clpMatch = priceText.match(/\$\s*([\d.]+)/);

        if (ufMatch) {
            pUF = parseFloat(ufMatch[1].replace(/\./g, ''));
        } else if (clpMatch) {
            const val = parseFloat(clpMatch[1].replace(/\./g, ''));
            pUF = Math.round(val / currentUF);
        }

        if (pUF <= 0 || pUF > 1000000) continue;

        // CARACTERÍSTICAS: leer data-* del li padre (es la fuente más confiable de TocToc)
        const liParent = linkEl.closest('li');
        let dormVal = 0, bathVal = 0, m2Val = 0;
        
        if (liParent) {
          // Los atributos data-dormitorios1 y data-banos1 son el valor mínimo del rango
          const d1 = parseInt(liParent.getAttribute('data-dormitorios1') || '0');
          const d2 = parseInt(liParent.getAttribute('data-dormitorios2') || '0');
          const b1 = parseInt(liParent.getAttribute('data-banos1') || '0');
          const b2 = parseInt(liParent.getAttribute('data-banos2') || '0');
          const s1 = parseFloat(liParent.getAttribute('data-superficie1') || '0');
          const s2 = parseFloat(liParent.getAttribute('data-superficie2') || '0');
          dormVal = d1 || d2;
          bathVal = b1 || b2;
          m2Val = s1 || s2;
        }
        
        // Fallback: texto del link + el div siguiente
        if (!dormVal || !bathVal) {
          let innerText = linkEl.textContent || "";
          const nextDiv = linkEl.nextElementSibling;
          if (nextDiv) innerText += " " + (nextDiv.textContent || "");
          if (!dormVal) {
            const dormMatch = innerText.match(/(\d+)\s*(?:dorm|hab)/i);
            if (dormMatch) dormVal = parseInt(dormMatch[1]);
          }
          if (!bathVal) {
            const bathMatch = innerText.match(/(\d+)\s*(?:baño|bath)/i);
            if (bathMatch) bathVal = parseInt(bathMatch[1]);
          }
        }
        if (!m2Val) {
          let innerText = linkEl.textContent || "";
          const m2Match = innerText.match(/(\d+(?:[.,]\d+)?)\s*m²/i);
          if (m2Match) m2Val = parseFloat(m2Match[1].replace(',', '.'));
        }

        // TÍTULO
        const h3 = linkEl.querySelector('h3, h2');
        let rawTitle = h3 ? h3.textContent?.trim() || '' : linkEl.textContent?.trim() || "Propiedad";
        let cleanTitle = rawTitle.split('\n')[0].replace(/Nuevo en venta/i, '').replace(/\|/g, '').trim();

        results.push({
          id: Math.random().toString(36).substring(7),
          title: cleanTitle,
          location: cleanTitle,
          price_uf: pUF,
          price_display: `UF ${pUF.toLocaleString('es-CL')}`,
          bedrooms: dormVal,
          bedrooms_display: dormVal ? `${dormVal} Dorm.` : "---",
          bathrooms: bathVal,
          bathrooms_display: bathVal ? `${bathVal} Baños` : "---",
          m2_total: m2Val,
          m2_display: m2Val ? `${m2Val} m²` : "--- m²",
          url,
          type: pType,
          source: 'market_intel',
          lat: cLat + (Math.random() - 0.5) * 0.002, 
          lng: cLng + (Math.random() - 0.5) * 0.002
        });
      }
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
  console.log(`🔍 [FORENSE] Análisis profundo: ${url}`);
  
  const browser = await getBrowser();

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise(r => setTimeout(r, 3000));

    // Detectar si la propiedad ya no está disponible
    // @ts-ignore
    const isUnavailable = await page.evaluate(`
      (function() {
        var body = document.body.innerText || "";
        return body.indexOf('ya no se encuentra disponible') !== -1 ||
               body.indexOf('propiedad fue eliminada') !== -1 ||
               body.indexOf('no existe') !== -1 ||
               !document.querySelector('h1');
      })()
    `);
    if (isUnavailable) {
      console.log('⚠️ [FORENSE] Propiedad no disponible, saltando...');
      return null;
    }

    // Identidades ficticias rotativas para el formulario de invitado
    const GUESTS = [
      { nombre: 'Carlos',    apellido: 'Mendez',    email: 'c.mendez.prop@outlook.com', rut: '123456785', telefono: '912348765' },
      { nombre: 'Valentina', apellido: 'Rojas',     email: 'v.rojas.inmueble@gmail.com', rut: '156789003', telefono: '987651234' },
      { nombre: 'Andres',   apellido: 'Fuentes',   email: 'afuentes.depto@yahoo.com',   rut: '182345679', telefono: '934562109' },
    ];
    const guest = GUESTS[Math.floor(Math.random() * GUESTS.length)];

    // FLUJO INVITADO: Click "Ver datos de contacto"
    try {
      // @ts-ignore
      await page.evaluate(`
        (function() {
          var btns = document.querySelectorAll('button, a, div, span');
          for (var i = 0; i < btns.length; i++) {
            var t = (btns[i].textContent || '').trim();
            if (t.indexOf('Ver datos') !== -1) { btns[i].click(); return; }
          }
        })()
      `);
      await new Promise(r => setTimeout(r, 2500));

      // Click "Continuar como invitado"
      // @ts-ignore
      await page.evaluate(`
        (function() {
          var btns = document.querySelectorAll('button, a, p, span, div');
          for (var i = 0; i < btns.length; i++) {
            var t = (btns[i].textContent || '').trim();
            if (t === 'Continuar como invitado' || t.indexOf('como invitado') !== -1) {
              btns[i].click(); return;
            }
          }
        })()
      `);
      await new Promise(r => setTimeout(r, 2000));

      // Llenar campos del formulario (con los placeholders reales de TocToc)
      const fillField = async (placeholders: string[], value: string) => {
        for (const ph of placeholders) {
          try {
            // @ts-ignore
            const el = await (page as any).$(`input[placeholder="${ph}"]`);
            if (el) { await (el as any).type(value); return true; }
          } catch (_e) { /* seguir */ }
        }
        return false;
      };

      await fillField(['Nombre'], guest.nombre);
      await fillField(['Apellido'], guest.apellido);
      await fillField(['Email', 'Ingresa tu e-mail', 'E-mail'], guest.email);
      await fillField(['RUT', 'Ingresa tu RUT sin puntos y sin guión'], guest.rut);
      await fillField(['Teléfono', 'Ingresa tu teléfono', '+56'], guest.telefono);

      // Checkbox de términos
      // @ts-ignore
      await page.evaluate(`
        document.querySelectorAll('input[type="checkbox"]').forEach(function(c) {
          if (!c.checked) c.click();
        });
      `);
      await new Promise(r => setTimeout(r, 500));

      // Click "Continuar"
      // @ts-ignore
      await page.evaluate(`
        (function() {
          var btns = document.querySelectorAll('button');
          for (var i = 0; i < btns.length; i++) {
            if ((btns[i].textContent || '').trim() === 'Continuar') {
              btns[i].click(); return;
            }
          }
        })()
      `);
      await new Promise(r => setTimeout(r, 4000));
    } catch (_e) { /* Si falla el flujo invitado, continuar con lo que haya */ }

    // Click "Leer más" si existe
    try {
      // @ts-ignore
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

    // @ts-ignore
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
        if (!description) {
          var headers = document.querySelectorAll('h2, h3, h4');
          for (var h = 0; h < headers.length; h++) {
            var hText = headers[h].innerText || '';
            if (hText.indexOf('nformaci') !== -1 && hText.indexOf('Contacto') === -1) {
              var next = headers[h].nextElementSibling;
              if (next && next.innerText && next.innerText.trim().length > 30) {
                description = next.innerText.trim();
              }
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
        if (!description) {
          var idx = text.indexOf('nformaci');
          if (idx > 0) {
            var chunk = text.substring(idx + 22, idx + 1500);
            var cutIdx = chunk.search(/Contacto|Compartir|Denunciar/);
            if (cutIdx > 30) {
              description = chunk.substring(0, cutIdx).trim();
            } else if (chunk.length > 30) {
              description = chunk.substring(0, 800).trim();
            }
          }
        }

        // === COORDENADAS ===
        var lat = 0, lng = 0;
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

        // === DORMITORIOS y BAÑOS (navegando el DOM real) ===
        // TocToc escribe: <h4>Dormitorios:</h4><strong> 1 a 3 </strong> dentro de ul.f-programa
        // IMPORTANTE: el strong puede tener un rango "1 a 3" — tomamos solo el PRIMER número
        var dorms = 0, baths = 0;
        var fichaEl = document.querySelector('ul.info_ficha, ul.f-programa');
        if (fichaEl) {
          var fichaItems = fichaEl.querySelectorAll('li');
          for (var fi = 0; fi < fichaItems.length; fi++) {
            var fTitle = fichaItems[fi].querySelector('h4, .f-programa-text h4');
            var fValue = fichaItems[fi].querySelector('strong, .f-programa-text strong');
            if (!fTitle || !fValue) continue;
            var fTitleText = (fTitle.textContent || '').toLowerCase();
            var fValueText = (fValue.textContent || '').trim();
            // Extraer el PRIMER número del texto (respeta "1 a 3" tomando solo el 1)
            var firstNum = fValueText.match(/([0-9]+)/);
            var fValueNum = firstNum ? parseInt(firstNum[1]) : 0;
            if (fTitleText.indexOf('dorm') !== -1 || fTitleText.indexOf('hab') !== -1) {
              dorms = fValueNum;
            } else if (fTitleText.indexOf('ba') !== -1) {
              baths = fValueNum;
            }
          }
        }
        if (dorms === 0) {
          var dM = text.match(/Dormitorios[^0-9]*([0-9]+)/) || text.match(/([0-9]+)[^0-9]*[Dd]orm/);
          if (dM) dorms = parseInt(dM[1]);
        }
        if (baths === 0) {
          var bM = text.match(/Ba[nñ]os[^0-9]*([0-9]+)/) || text.match(/([0-9]+)[^0-9]*[Bb]a[nñ]o/);
          if (bM) baths = parseInt(bM[1]);
        }

        // === M2 ===
        var m2UM = text.match(/(\\d+(?:[.,]\\d+)?)\\s*m.\\s*[uú]til/i) ||
                   text.match(/[uú]til[^\\d]*(\\d+(?:[.,]\\d+)?)/i) ||
                   text.match(/(\\d+(?:[.,]\\d+)?)\\s*m.\\s*construid/i);
        var m2TM = text.match(/(\\d+(?:[.,]\\d+)?)\\s*m.\\s*total/i) ||
                   text.match(/[Tt]otal[^\\d]*(\\d+(?:[.,]\\d+)?)/i);
        var m2U = m2UM ? m2UM[1] : "";
        var m2T = m2TM ? m2TM[1] : "";

        // === CONTACTO — post flujo invitado, los datos reales ya están en el DOM ===
        var contactName = "", contactPhone = "", contactEmail = "", contactCompany = "", contactWhatsapp = "";
        var contactBox = document.querySelector('.cf-contacto');
        if (contactBox) {
          // Empresa
          var anuncItems = contactBox.querySelectorAll('ul.info-anunciante li');
          for (var ai = 0; ai < anuncItems.length; ai++) {
            var aiStrong = anuncItems[ai].querySelector('strong');
            if (aiStrong) {
              contactCompany = (aiStrong.textContent || '').trim();
            }
          }
          // Fallback empresa: texto con "Anunciante"
          if (!contactCompany) {
            var allText = contactBox.textContent || '';
            var anuncIdx = allText.indexOf('Anunciante');
            if (anuncIdx >= 0) {
              contactCompany = allText.substring(anuncIdx + 10, anuncIdx + 60).trim().split('\\n')[0].trim();
            }
          }

          // TELÉFONO REAL: buscar links tel: (aparecen después del login invitado)
          var telLinks = contactBox.querySelectorAll('a[href^="tel:"]');
          for (var ti = 0; ti < telLinks.length; ti++) {
            var tel = telLinks[ti].href.replace('tel:', '').trim();
            if (tel && !contactPhone) contactPhone = tel;
            else if (tel && contactPhone && !contactPhone.includes(tel)) contactPhone += ' / ' + tel;
          }
          // Fallback: texto del box
          if (!contactPhone) {
            var boxText = contactBox.textContent || '';
            var phoneM = boxText.match(/9[-\\s]?\\d{4}[-\\s]?\\d{4}/) || boxText.match(/\\+?[0-9][\\d\\s/-]{7,14}/);
            if (phoneM) contactPhone = phoneM[0].trim();
          }

          // EMAIL REAL: después del invitado ya no está ofuscado
          var emailLinks = contactBox.querySelectorAll('a[href^="mailto:"]');
          if (emailLinks.length > 0) {
            contactEmail = emailLinks[0].href.replace('mailto:', '').trim();
          }
          if (!contactEmail) {
            var boxText2 = contactBox.textContent || '';
            var emailM = boxText2.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/);
            // Filtrar emails ofuscados (conXXXXX@XXXX.com)
            if (emailM && emailM[0].indexOf('XXXX') === -1) contactEmail = emailM[0];
          }

          // WHATSAPP REAL: solo wa.me/56XXXXXXXXX (no el link de compartir)
          var waLinks = contactBox.querySelectorAll('a[href*="wa.me/"]');
          for (var wi = 0; wi < waLinks.length; wi++) {
            var waHref = waLinks[wi].href;
            // Filtrar: el link de compartir tiene "?text=https" — el real tiene solo el número
            if (waHref.indexOf('?text=https') === -1) {
              contactWhatsapp = waHref;
              break;
            }
          }
        }

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
