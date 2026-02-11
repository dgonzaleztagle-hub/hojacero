#!/usr/bin/env node

/**
 * H0 Store Engine - Automated Injection Script
 * 
 * Ejecuta el workflow /worker-store-pro de forma completamente automática.
 * 
 * Uso:
 *   node scripts/inject-store-engine.js
 * 
 * O desde el workflow:
 *   /worker-store-pro
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';

// Colores para terminal
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
};

const log = {
    info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
    success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
    step: (msg) => console.log(`\n${colors.cyan}${colors.bright}${msg}${colors.reset}\n`)
};

// Interfaz de readline para preguntas interactivas
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    log.error('Faltan variables de entorno de Supabase');
    log.info('Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Paso 1: Preguntas interactivas
 */
async function askQuestions() {
    log.step('🛒 H0 STORE ENGINE - INYECCIÓN AUTOMÁTICA');

    const storeName = await question('1. ¿Nombre de la tienda? (ej: Joyería Obsidian): ');
    const categoriesInput = await question('2. ¿Categorías iniciales? (separadas por coma): ');
    const whatsapp = await question('3. ¿WhatsApp para pedidos? (formato: +56912345678): ');
    const slug = await question('4. ¿Slug del cliente? (sin espacios, minúsculas): ');

    const categories = categoriesInput.split(',').map(c => c.trim()).filter(Boolean);

    // Validaciones
    if (!storeName || !categories.length || !whatsapp || !slug) {
        log.error('Todos los campos son obligatorios');
        process.exit(1);
    }

    if (!whatsapp.startsWith('+56')) {
        log.warning('El WhatsApp debe empezar con +56 (código de Chile)');
    }

    if (!/^[a-z0-9_]+$/.test(slug)) {
        log.error('El slug solo puede contener letras minúsculas, números y guiones bajos');
        process.exit(1);
    }

    return { storeName, categories, whatsapp, slug };
}

/**
 * Paso 2: Insertar categorías en Supabase
 */
async function insertCategories(categories) {
    log.step('📦 Creando categorías en Supabase...');

    const categoriesToInsert = categories.map((name, index) => ({
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        display_order: index + 1
    }));

    const { data, error } = await supabase
        .from('h0_store_categories')
        .insert(categoriesToInsert)
        .select();

    if (error) {
        log.error(`Error al crear categorías: ${error.message}`);
        throw error;
    }

    log.success(`${data.length} categorías creadas`);
    return data;
}

/**
 * Paso 3: Crear configuración de conversión
 */
async function createConversionSettings(storeName) {
    log.step('⚙️ Configurando técnicas de conversión...');

    // Heurística: detectar tipo de negocio por palabras clave
    const luxuryKeywords = ['joyería', 'joyeria', 'boutique', 'lujo', 'luxury', 'premium'];
    const isLuxury = luxuryKeywords.some(keyword =>
        storeName.toLowerCase().includes(keyword)
    );

    const preset = isLuxury ? 'premium-light' : 'direct-light';

    const { data, error } = await supabase
        .from('h0_store_conversion_settings')
        .insert({
            badge_style_preset: preset,
            show_bestseller: true,
            show_low_stock: true,
            show_viewers: true,
            exit_popup_enabled: false
        })
        .select()
        .single();

    if (error) {
        log.error(`Error al crear configuración: ${error.message}`);
        throw error;
    }

    log.success(`Preset aplicado: ${preset}`);
    return data;
}

/**
 * Paso 4: Copiar archivos del Store Engine
 */
async function copyStoreFiles(projectPath) {
    log.step('📁 Copiando archivos del Store Engine...');

    const baseDir = process.cwd();
    const filesToCopy = [
        // Admin panel
        { from: 'app/admin/tienda', to: path.join(projectPath, 'app/admin/tienda'), type: 'dir' },

        // Storefront
        { from: 'app/tienda/page.tsx', to: path.join(projectPath, 'app/tienda/page.tsx'), type: 'file' },

        // Componentes
        { from: 'components/store', to: path.join(projectPath, 'components/store'), type: 'dir' },

        // Utilidades
        { from: 'lib/store', to: path.join(projectPath, 'lib/store'), type: 'dir' }
    ];

    for (const file of filesToCopy) {
        const sourcePath = path.join(baseDir, file.from);
        const destPath = file.to;

        try {
            if (file.type === 'dir') {
                await fs.cp(sourcePath, destPath, { recursive: true });
                log.success(`Copiado: ${file.from}/`);
            } else {
                await fs.mkdir(path.dirname(destPath), { recursive: true });
                await fs.copyFile(sourcePath, destPath);
                log.success(`Copiado: ${file.from}`);
            }
        } catch (error) {
            log.warning(`No se pudo copiar ${file.from}: ${error.message}`);
        }
    }
}

/**
 * Paso 5: Crear archivo de configuración del cliente
 */
async function createClientConfig(projectPath, config) {
    log.step('⚙️ Creando configuración del cliente...');

    const configContent = `// H0 Store Engine - Configuración del Cliente
// Generado automáticamente por /worker-store-pro

export const STORE_CONFIG = {
  storeName: '${config.storeName}',
  whatsapp: '${config.whatsapp}',
  clientSlug: '${config.slug}',
  currency: 'CLP',
  currencySymbol: '$'
};
`;

    const configPath = path.join(projectPath, 'lib/store/config.ts');
    await fs.mkdir(path.dirname(configPath), { recursive: true });
    await fs.writeFile(configPath, configContent);

    log.success('Configuración creada en lib/store/config.ts');
}

/**
 * Paso 6: Verificar bucket de Storage
 */
async function verifyStorageBucket() {
    log.step('🗄️ Verificando bucket de Storage...');

    const { data, error } = await supabase.storage.getBucket('h0_store_images');

    if (error) {
        log.warning('Bucket h0_store_images no encontrado');
        log.info('Debes crearlo manualmente en Supabase Dashboard:');
        log.info('  1. Ir a Storage');
        log.info('  2. Click en "New bucket"');
        log.info('  3. Name: h0_store_images');
        log.info('  4. Public bucket: ✅ Activar');
        log.info('  5. Aplicar políticas RLS (ver supabase_storage_setup.md)');
        return false;
    }

    log.success('Bucket h0_store_images encontrado');
    return true;
}

/**
 * Paso 7: Mensaje de confirmación
 */
function showSuccessMessage(config, preset, bucketExists) {
    log.step('✅ H0 STORE ENGINE INYECTADO EXITOSAMENTE!');

    console.log(`
${colors.bright}📍 Rutas:${colors.reset}
  Panel Admin:    http://localhost:3000/admin/tienda
  Tienda Pública: http://localhost:3000/tienda

${colors.bright}🎨 Configuración:${colors.reset}
  Preset de conversión: ${preset}
  Categorías creadas: ${config.categories.join(', ')}
  WhatsApp: ${config.whatsapp}

${colors.bright}🚀 Próximos pasos:${colors.reset}
  1. Ir al panel admin y crear tu primer producto
  2. Subir imágenes de productos
  3. Configurar técnicas de conversión en /admin/tienda/conversion
  4. Probar el checkout en la tienda pública

${!bucketExists ? `${colors.yellow}⚠ IMPORTANTE: Debes crear el bucket h0_store_images en Supabase${colors.reset}\n` : ''}
${colors.bright}💡 Iteraciones rápidas:${colors.reset}
  - "Cambia el preset a direct-light" → Yo lo cambio
  - "Mueve la tienda al landing" → Yo muevo el storefront
  - "Ajusta los colores del carrito" → Yo edito el CSS
  `);
}

/**
 * Main execution
 */
async function main() {
    try {
        // Paso 1: Preguntas
        const config = await askQuestions();

        // Paso 2: Categorías
        await insertCategories(config.categories);

        // Paso 3: Configuración de conversión
        const conversionSettings = await createConversionSettings(config.storeName);

        // Paso 4: Copiar archivos (asumimos proyecto actual)
        const projectPath = process.cwd();
        await copyStoreFiles(projectPath);

        // Paso 5: Config del cliente
        await createClientConfig(projectPath, config);

        // Paso 6: Verificar bucket
        const bucketExists = await verifyStorageBucket();

        // Paso 7: Mensaje de éxito
        showSuccessMessage(config, conversionSettings.badge_style_preset, bucketExists);

    } catch (error) {
        log.error(`Error durante la inyección: ${error.message}`);
        console.error(error);
        process.exit(1);
    } finally {
        rl.close();
    }
}

// Ejecutar
main();
