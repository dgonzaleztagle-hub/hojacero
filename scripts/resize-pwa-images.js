const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const GERMAIN_DIR = path.join(PUBLIC_DIR, 'prospectos', 'donde-germain');

async function resizeImages() {
    console.log('🎨 Redimensionando imágenes para PWA...\n');

    // Obtener info de todas las imágenes primero
    const images = [
        { path: path.join(PUBLIC_DIR, 'germain_icon_512.png'), name: 'Icon 512' },
        { path: path.join(PUBLIC_DIR, 'germain_icon_192.png'), name: 'Icon 192' },
        { path: path.join(GERMAIN_DIR, 'screenshot-wide.png'), name: 'Screenshot Wide' },
        { path: path.join(GERMAIN_DIR, 'screenshot-narrow.png'), name: 'Screenshot Narrow' },
    ];

    console.log('📊 Dimensiones actuales:');
    for (const img of images) {
        if (fs.existsSync(img.path)) {
            const metadata = await sharp(img.path).metadata();
            console.log(`   ${img.name}: ${metadata.width}x${metadata.height}`);
        } else {
            console.log(`   ${img.name}: NO EXISTE`);
        }
    }

    // Redimensionar iconos - usar buffer en memoria
    console.log('\n🔧 Redimensionando iconos...');

    const iconSource = path.join(PUBLIC_DIR, 'germain_icon_512.png');

    if (fs.existsSync(iconSource)) {
        const buffer = fs.readFileSync(iconSource);

        // 512x512
        const icon512 = await sharp(buffer)
            .resize(512, 512, { fit: 'cover' })
            .png()
            .toBuffer();
        fs.writeFileSync(path.join(PUBLIC_DIR, 'germain_icon_512.png'), icon512);
        console.log('   ✅ germain_icon_512.png (512x512)');

        // 192x192
        const icon192 = await sharp(buffer)
            .resize(192, 192, { fit: 'cover' })
            .png()
            .toBuffer();
        fs.writeFileSync(path.join(PUBLIC_DIR, 'germain_icon_192.png'), icon192);
        console.log('   ✅ germain_icon_192.png (192x192)');
    }

    // Redimensionar screenshots
    console.log('\n🔧 Redimensionando screenshots...');

    const wideSource = path.join(GERMAIN_DIR, 'screenshot-wide.png');
    const narrowSource = path.join(GERMAIN_DIR, 'screenshot-narrow.png');

    if (fs.existsSync(wideSource)) {
        const buffer = fs.readFileSync(wideSource);
        const wide = await sharp(buffer)
            .resize(1280, 720, { fit: 'cover' })
            .png()
            .toBuffer();
        fs.writeFileSync(wideSource, wide);
        console.log('   ✅ screenshot-wide.png (1280x720)');
    }

    if (fs.existsSync(narrowSource)) {
        const buffer = fs.readFileSync(narrowSource);
        const narrow = await sharp(buffer)
            .resize(720, 1280, { fit: 'cover' })
            .png()
            .toBuffer();
        fs.writeFileSync(narrowSource, narrow);
        console.log('   ✅ screenshot-narrow.png (720x1280)');
    }

    // Verificar dimensiones finales
    console.log('\n📊 Dimensiones finales:');
    for (const img of images) {
        if (fs.existsSync(img.path)) {
            const metadata = await sharp(img.path).metadata();
            console.log(`   ${img.name}: ${metadata.width}x${metadata.height}`);
        }
    }

    console.log('\n✅ ¡Listo! Todas las imágenes tienen las dimensiones exactas para PWA Builder.');
}

resizeImages().catch(console.error);
