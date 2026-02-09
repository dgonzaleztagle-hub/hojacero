/**
 * Portal Inmobiliario Scraper
 * 
 * Extrae datos de propiedades comerciales desde Portal Inmobiliario
 * para análisis de mercado en Plan 600k (Inversión).
 * 
 * Features:
 * - Scraping de venta y arriendo
 * - Cálculo de UF/m²
 * - Múltiples páginas
 * - Rate limiting anti-ban
 */

import puppeteer from 'puppeteer';

// ============================================
// INTERFACES
// ============================================

export interface PropertyData {
    titulo: string;
    precio: number;           // Precio en UF
    moneda: string;           // 'UF', 'CLP', etc
    metros: number;           // Metros cuadrados
    ubicacion: string;        // Dirección/Comuna
    link: string;             // URL de la propiedad
    tipo: string;             // 'Local en arriendo', 'Local en venta'
    fecha_scraping: Date;
}

export interface ComercialPropertyStats {
    venta: {
        precio_promedio_uf: number;
        precio_uf_m2: number;
        muestra: number;
        propiedades: PropertyData[];
    };
    arriendo: {
        precio_promedio_uf: number;
        precio_uf_m2: number;
        muestra: number;
        propiedades: PropertyData[];
    };
    fecha_analisis: Date;
}

// ============================================
// SELECTORES CSS (Basados en HTML real 2026)
// ============================================

const SELECTORS = {
    // Contenedor de cada propiedad
    propertyCard: '.poly-card.poly-card--grid-card',

    // Título
    title: '.poly-component__title',

    // Precio (número)
    price: '.andes-money-amount__fraction',

    // Moneda (UF, CLP, etc)
    currency: '.andes-money-amount__currency-symbol',

    // Metros cuadrados
    metros: '.poly-attributes_list__item',

    // Ubicación
    location: '.poly-component__location',

    // Link de la propiedad
    link: '.poly-component__title',

    // Tipo (arriendo/venta)
    tipo: '.poly-component__headline'
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Valida que el precio en UF esté en un rango realista
 * @param precioUF Precio en UF
 * @param tipo 'venta' | 'arriendo'
 * @returns true si el precio está en rango realista
 */
function validarRangoUF(precioUF: number, tipo: 'venta' | 'arriendo'): boolean {
    if (tipo === 'arriendo') {
        // Arriendos comerciales/residenciales típicos: UF 5 - UF 200
        // Lampa/zonas residenciales: ~UF 10-50
        if (precioUF < 5 || precioUF > 200) {
            console.warn(`⚠️ Precio arriendo fuera de rango: ${precioUF} UF (esperado: 5-200 UF)`);
            return false;
        }
    } else {
        // Ventas residenciales/comerciales pequeños: UF 1,000 - UF 20,000
        // Esto filtra terrenos industriales y galpones gigantes
        if (precioUF < 1000 || precioUF > 20000) {
            console.warn(`⚠️ Precio venta fuera de rango: ${precioUF} UF (esperado: 1,000-20,000 UF)`);
            return false;
        }
    }
    return true;
}

// ============================================
// FUNCIONES PRINCIPALES
// ============================================

/**
 * Scraper base de Portal Inmobiliario
 * @param comuna Comuna a buscar (ej: 'lampa-metropolitana')
 * @param tipo 'venta' | 'arriendo'
 * @param maxPages Máximo de páginas a scrapear (default: 3)
 */
export async function getPropertyPrices(
    comuna: string,
    tipo: 'venta' | 'arriendo',
    maxPages: number = 3
): Promise<PropertyData[]> {
    console.log(`🔍 SCRAPING Portal Inmobiliario: ${tipo} en ${comuna}`);

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled'
        ]
    });

    const page = await browser.newPage();

    // User agent para evitar detección
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    const allProperties: PropertyData[] = [];

    try {
        for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
            // URL con paginación
            const offset = pageNum === 1 ? '' : `_Desde_${(pageNum - 1) * 48 + 1}`;
            const url = `https://www.portalinmobiliario.com/${tipo}/comercial/${comuna}${offset}`;

            console.log(`  📄 Página ${pageNum}: ${url}`);

            await page.goto(url, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            // Esperar a que carguen las propiedades
            await page.waitForSelector(SELECTORS.propertyCard, { timeout: 10000 });

            // Extraer propiedades de la página
            const pageProperties = await page.evaluate((selectors) => {
                const cards = document.querySelectorAll(selectors.propertyCard);
                const properties: any[] = [];

                cards.forEach((card) => {
                    try {
                        // Título
                        const titleEl = card.querySelector(selectors.title);
                        const titulo = titleEl?.textContent?.trim() || '';

                        // Precio
                        const priceEl = card.querySelector(selectors.price);
                        const precioText = priceEl?.textContent?.replace(/[^0-9]/g, '') || '0';
                        const precio = parseInt(precioText);

                        // Moneda
                        const currencyEl = card.querySelector(selectors.currency);
                        const moneda = currencyEl?.textContent?.trim() || 'UF';

                        // Metros - buscar el elemento que contiene "m²"
                        const metrosItems = card.querySelectorAll(selectors.metros);
                        let metros = 0;
                        metrosItems.forEach((item) => {
                            const text = item.textContent || '';
                            if (text.includes('m²') || text.includes('m')) {
                                const match = text.match(/([\d.]+)\s*m/);
                                if (match) {
                                    metros = parseFloat(match[1].replace(/\./g, ''));
                                }
                            }
                        });

                        // Ubicación
                        const locationEl = card.querySelector(selectors.location);
                        const ubicacion = locationEl?.textContent?.trim() || '';

                        // Link
                        const linkEl = card.querySelector(selectors.link) as HTMLAnchorElement;
                        const link = linkEl?.href || '';

                        // Tipo
                        const tipoEl = card.querySelector(selectors.tipo);
                        const tipo = tipoEl?.textContent?.trim() || '';

                        // Solo agregar si tiene datos válidos y está en UF
                        if (precio > 0 && metros > 0 && titulo && moneda === 'UF') {
                            properties.push({
                                titulo,
                                precio,
                                moneda,
                                metros,
                                ubicacion,
                                link,
                                tipo,
                                fecha_scraping: new Date().toISOString()
                            });
                        }
                    } catch (err) {
                        console.error('Error extrayendo propiedad:', err);
                    }
                });

                return properties;
            }, SELECTORS);

            // Convertir fecha de string a Date y filtrar por rango UF válido
            const propertiesWithDate = pageProperties
                .map(p => ({
                    ...p,
                    fecha_scraping: new Date(p.fecha_scraping)
                }))
                .filter(p => validarRangoUF(p.precio, tipo));

            allProperties.push(...propertiesWithDate);

            console.log(`  ✅ Extraídas ${propertiesWithDate.length} propiedades`);

            // Delay entre páginas para evitar rate limiting
            if (pageNum < maxPages) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    } catch (error) {
        console.error('❌ Error en scraping:', error);
    } finally {
        await browser.close();
    }

    console.log(`✅ Total extraído: ${allProperties.length} propiedades`);
    return allProperties;
}

/**
 * Obtiene estadísticas de propiedades comerciales (venta + arriendo)
 * @param comuna Comuna a analizar
 */
export async function getComercialPropertyData(
    comuna: string
): Promise<ComercialPropertyStats> {
    console.log(`📊 Analizando mercado comercial en ${comuna}`);

    // Scrapear ventas y arriendos en paralelo
    const [ventaProps, arriendoProps] = await Promise.all([
        getPropertyPrices(comuna, 'venta', 2),
        getPropertyPrices(comuna, 'arriendo', 2)
    ]);

    return {
        venta: {
            precio_promedio_uf: calcularPromedioUF(ventaProps),
            precio_uf_m2: calcularUFporM2(ventaProps),
            muestra: ventaProps.length,
            propiedades: ventaProps
        },
        arriendo: {
            precio_promedio_uf: calcularPromedioUF(arriendoProps),
            precio_uf_m2: calcularUFporM2(arriendoProps),
            muestra: arriendoProps.length,
            propiedades: arriendoProps
        },
        fecha_analisis: new Date()
    };
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Calcula el precio promedio en UF con filtro de outliers
 * Implementa la solución de Gastón: elimina valores atípicos antes de promediar
 */
function calcularPromedioUF(propiedades: PropertyData[]): number {
    if (propiedades.length === 0) return 0;
    if (propiedades.length === 1) return Math.round(propiedades[0].precio);

    // 1. Calcular promedio inicial
    const precios = propiedades.map(p => p.precio);
    const promedioInicial = precios.reduce((a, b) => a + b, 0) / precios.length;

    // 2. Calcular desviación estándar
    const varianza = precios.reduce((sum, precio) => {
        return sum + Math.pow(precio - promedioInicial, 2);
    }, 0) / precios.length;
    const desviacionEstandar = Math.sqrt(varianza);

    // 3. Filtrar outliers: eliminar valores > 2 desviaciones estándar
    const preciosFiltrados = precios.filter(precio => {
        const distancia = Math.abs(precio - promedioInicial);
        const esOutlier = distancia > (2 * desviacionEstandar);

        if (esOutlier) {
            console.warn(`⚠️ Outlier detectado y eliminado: ${precio} UF (promedio: ${Math.round(promedioInicial)} UF, σ: ${Math.round(desviacionEstandar)} UF)`);
        }

        return !esOutlier;
    });

    // 4. Si eliminamos demasiados datos, usar todos
    if (preciosFiltrados.length < precios.length * 0.5) {
        console.warn('⚠️ Demasiados outliers detectados, usando todos los datos');
        return Math.round(promedioInicial);
    }

    // 5. Calcular promedio final sin outliers
    const promedioFinal = preciosFiltrados.reduce((a, b) => a + b, 0) / preciosFiltrados.length;

    console.log(`📊 Promedio UF: ${Math.round(promedioFinal)} UF (${preciosFiltrados.length}/${precios.length} propiedades válidas)`);

    return Math.round(promedioFinal);
}

/**
 * Calcula el precio promedio UF/m² con filtro de outliers
 */
function calcularUFporM2(propiedades: PropertyData[]): number {
    if (propiedades.length === 0) return 0;

    const validas = propiedades.filter(p => p.metros > 0 && p.precio > 0);
    if (validas.length === 0) return 0;
    if (validas.length === 1) return Math.round((validas[0].precio / validas[0].metros) * 100) / 100;

    // Calcular UF/m² para cada propiedad
    const ufPorM2 = validas.map(p => p.precio / p.metros);

    // Filtrar outliers usando mismo método
    const promedio = ufPorM2.reduce((a, b) => a + b, 0) / ufPorM2.length;
    const varianza = ufPorM2.reduce((sum, val) => sum + Math.pow(val - promedio, 2), 0) / ufPorM2.length;
    const desviacionEstandar = Math.sqrt(varianza);

    const filtrados = ufPorM2.filter(val => {
        const distancia = Math.abs(val - promedio);
        return distancia <= (2 * desviacionEstandar);
    });

    if (filtrados.length === 0) return Math.round(promedio * 100) / 100;

    const promedioFinal = filtrados.reduce((a, b) => a + b, 0) / filtrados.length;
    return Math.round(promedioFinal * 100) / 100; // 2 decimales
}

/**
 * Normaliza el nombre de la comuna para URL
 * Ej: "Lampa" -> "lampa-metropolitana"
 */
export function normalizarComuna(comuna: string): string {
    const normalizaciones: Record<string, string> = {
        'lampa': 'lampa-metropolitana',
        'las condes': 'las-condes-metropolitana',
        'vitacura': 'vitacura-metropolitana',
        'providencia': 'providencia-metropolitana',
        'santiago': 'santiago-metropolitana',
        // Agregar más según necesidad
    };

    const comunaLower = comuna.toLowerCase().trim();
    return normalizaciones[comunaLower] || `${comunaLower}-metropolitana`;
}
