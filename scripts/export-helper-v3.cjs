/**
 * 🚀 HojaCero Export Helper v3.0 - Smart Dependency Resolution
 * 
 * Este script analiza recursivamente las dependencias de un sitio de prospecto
 * y copia SOLO los archivos necesarios, generando un package.json preciso.
 * 
 * Uso: node scripts/export-helper-v3.js [cliente]
 * Ejemplo: node scripts/export-helper-v3.js apimiel
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════
const ROOT_DIR = path.resolve(__dirname, '..');
const EXPORTS_DIR = path.join(ROOT_DIR, 'exports');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

// Colores para consola
const c = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    cyan: "\x1b[36m",
    dim: "\x1b[2m",
    bold: "\x1b[1m"
};

function log(msg, color = c.reset) {
    console.log(`${color}${msg}${c.reset}`);
}

function logSection(title) {
    console.log(`\n${c.cyan}${'═'.repeat(50)}${c.reset}`);
    console.log(`${c.bold}${c.cyan}  ${title}${c.reset}`);
    console.log(`${c.cyan}${'═'.repeat(50)}${c.reset}\n`);
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════
const clientName = process.argv[2];
if (!clientName) {
    log("❌ Error: Debes proporcionar el nombre del cliente.", c.red);
    log("   Uso: node scripts/export-helper-v3.js [cliente]", c.yellow);
    log("   Ejemplo: node scripts/export-helper-v3.js apimiel", c.dim);
    process.exit(1);
}

const prospectDir = path.join(ROOT_DIR, 'app', 'prospectos', clientName);
const targetDir = path.join(EXPORTS_DIR, clientName);

if (!fs.existsSync(prospectDir)) {
    log(`❌ Error: No existe el prospecto: ${prospectDir}`, c.red);
    process.exit(1);
}

log(`\n🚀 ${c.bold}Export Helper v3.0${c.reset} - Cliente: ${c.cyan}${clientName}${c.reset}`);

// ═══════════════════════════════════════════════════════════════
// PHASE 1: Clean & Create Structure
// ═══════════════════════════════════════════════════════════════
logSection("FASE 1: Preparación");

// Limpiar export anterior
if (fs.existsSync(targetDir)) {
    log("🗑️  Limpiando export anterior...", c.yellow);
    fs.rmSync(targetDir, { recursive: true, force: true });
}

// Crear estructura
const directories = [
    'src/app',
    'src/components',
    'src/lib',
    'src/hooks',
    'src/utils',
    'public'
];

directories.forEach(dir => {
    fs.mkdirSync(path.join(targetDir, dir), { recursive: true });
});
log("✅ Estructura de directorios creada", c.green);

// ═══════════════════════════════════════════════════════════════
// PHASE 2: Smart Dependency Resolution
// ═══════════════════════════════════════════════════════════════
logSection("FASE 2: Análisis de Dependencias");

const filesToCopy = new Set();      // Archivos locales a copiar
const npmDeps = new Set();          // Dependencias npm detectadas
const assets = new Set();           // Assets (imágenes, videos, etc.)
const processed = new Set();        // Archivos ya procesados (evitar loops)
const missingFiles = new Set();     // Archivos no encontrados

// Dependencias base siempre necesarias
const baseDeps = [
    'next', 'react', 'react-dom', 'typescript',
    '@types/node', '@types/react', '@types/react-dom',
    'framer-motion', 'clsx', 'tailwind-merge', 'lucide-react', 'splitting'
];
baseDeps.forEach(d => npmDeps.add(d));

// Cargar package.json raíz para buscar versiones
const rootPackageJson = require(path.join(ROOT_DIR, 'package.json'));

/**
 * Resuelve una ruta de import a un archivo real
 */
function resolveImportPath(importPath, fromFile) {
    const fromDir = path.dirname(fromFile);

    // Alias @/ -> mapea a raíz del proyecto
    if (importPath.startsWith('@/')) {
        const relativePath = importPath.replace('@/', '');

        // Posibles ubicaciones
        const attempts = [
            path.join(ROOT_DIR, relativePath),
            path.join(ROOT_DIR, relativePath + '.ts'),
            path.join(ROOT_DIR, relativePath + '.tsx'),
            path.join(ROOT_DIR, relativePath, 'index.ts'),
            path.join(ROOT_DIR, relativePath, 'index.tsx'),
        ];

        for (const attempt of attempts) {
            if (fs.existsSync(attempt)) {
                return fs.statSync(attempt).isDirectory()
                    ? path.join(attempt, 'index.tsx')
                    : attempt;
            }
        }
        return null;
    }

    // Import relativo (./algo o ../algo)
    if (importPath.startsWith('.')) {
        const attempts = [
            path.resolve(fromDir, importPath),
            path.resolve(fromDir, importPath + '.ts'),
            path.resolve(fromDir, importPath + '.tsx'),
            path.resolve(fromDir, importPath, 'index.ts'),
            path.resolve(fromDir, importPath, 'index.tsx'),
        ];

        for (const attempt of attempts) {
            if (fs.existsSync(attempt)) {
                return fs.statSync(attempt).isDirectory()
                    ? path.join(attempt, 'index.tsx')
                    : attempt;
            }
        }
        return null;
    }

    // Es un paquete npm, no un archivo local
    return 'npm:' + importPath;
}

/**
 * Analiza un archivo y extrae sus dependencias
 */
function analyzeFile(filePath) {
    if (processed.has(filePath)) return;
    if (!fs.existsSync(filePath)) {
        missingFiles.add(filePath);
        return;
    }

    processed.add(filePath);
    filesToCopy.add(filePath);

    const content = fs.readFileSync(filePath, 'utf8');

    // Buscar imports: import X from 'Y'
    const importRegex = /(?:import|export)\s+(?:[\w\s{},*]+\s+from\s+)?['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        const resolved = resolveImportPath(importPath, filePath);
        handleResolvedImport(resolved, importPath, filePath);
    }

    // Buscar imports dinámicos: await import('Y') o import('Y')
    const dynamicImportRegex = /import\(['"]([^'"]+)['"]\)/g;
    while ((match = dynamicImportRegex.exec(content)) !== null) {
        const importPath = match[1];
        const resolved = resolveImportPath(importPath, filePath);
        handleResolvedImport(resolved, importPath, filePath);
    }

    function handleResolvedImport(resolved, importPath, fromFile) {
        if (resolved === null) return;

        if (resolved.startsWith('npm:')) {
            const pkgName = resolved.replace('npm:', '').split('/')[0];
            const scopedCheck = resolved.replace('npm:', '');
            if (scopedCheck.startsWith('@')) {
                const scopedPkg = scopedCheck.split('/').slice(0, 2).join('/');
                npmDeps.add(scopedPkg);
            } else {
                npmDeps.add(pkgName);
            }
        } else {
            analyzeFile(resolved);
        }
    }

    // Buscar assets: src="/algo.jpg" o url('/algo.png')
    const assetRegex = /(?:src|href|url)\s*[=(:]\s*['"](\/?[^'"]+\.(png|jpg|jpeg|gif|svg|mp4|webm|webp|ico|pdf|woff|woff2|ttf|otf|json))['"\)]/gi;
    while ((match = assetRegex.exec(content)) !== null) {
        let assetPath = match[1];
        // Normalizar path
        if (!assetPath.startsWith('/')) {
            assetPath = '/' + assetPath;
        }
        if (!assetPath.startsWith('/api')) {
            assets.add(assetPath);
        }
    }
}

// Empezar análisis desde el prospecto
log("📂 Analizando archivos del prospecto...", c.yellow);

function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scanDirectory(fullPath);
        } else if (item.endsWith('.tsx') || item.endsWith('.ts') || item.endsWith('.css')) {
            analyzeFile(fullPath);
        }
    }
}

scanDirectory(prospectDir);

log(`   📄 Archivos a copiar: ${filesToCopy.size}`, c.green);
log(`   📦 Paquetes npm detectados: ${npmDeps.size}`, c.green);
log(`   🎨 Assets detectados: ${assets.size}`, c.green);

// ═══════════════════════════════════════════════════════════════
// PHASE 3: Copy Files with Structure
// ═══════════════════════════════════════════════════════════════
logSection("FASE 3: Copiando Archivos");

let copiedFiles = 0;

function getTargetPath(sourcePath) {
    // Determinar dónde va el archivo en el export
    const relative = path.relative(ROOT_DIR, sourcePath);

    // app/prospectos/cliente/* -> src/app/*
    if (relative.startsWith('app\\prospectos\\' + clientName) ||
        relative.startsWith('app/prospectos/' + clientName)) {
        const newPath = relative
            .replace(/^app[\\\/]prospectos[\\\/][^\\\/]+/, 'src/app')
            .replace(/\\/g, '/');
        return path.join(targetDir, newPath);
    }

    // components/* -> src/components/*
    if (relative.startsWith('components')) {
        return path.join(targetDir, 'src', relative.replace(/\\/g, '/'));
    }

    // lib/* -> src/lib/*
    if (relative.startsWith('lib')) {
        return path.join(targetDir, 'src', relative.replace(/\\/g, '/'));
    }

    // hooks/* -> src/hooks/*
    if (relative.startsWith('hooks')) {
        return path.join(targetDir, 'src', relative.replace(/\\/g, '/'));
    }

    // utils/* -> src/utils/*
    if (relative.startsWith('utils')) {
        return path.join(targetDir, 'src', relative.replace(/\\/g, '/'));
    }

    // Otros archivos van a src/
    return path.join(targetDir, 'src', relative.replace(/\\/g, '/'));
}

// Copiar archivos analizados
filesToCopy.forEach(sourcePath => {
    const targetPath = getTargetPath(sourcePath);
    const targetDirPath = path.dirname(targetPath);

    if (!fs.existsSync(targetDirPath)) {
        fs.mkdirSync(targetDirPath, { recursive: true });
    }

    try {
        fs.copyFileSync(sourcePath, targetPath);
        copiedFiles++;
    } catch (e) {
        log(`   ❌ Error copiando: ${sourcePath}`, c.red);
    }
});

log(`✅ Copiados ${copiedFiles} archivos de código`, c.green);

// Copiar globals.css si existe y no fue incluido
const globalsCss = path.join(ROOT_DIR, 'app', 'globals.css');
if (fs.existsSync(globalsCss)) {
    const targetGlobals = path.join(targetDir, 'src', 'app', 'globals.css');
    if (!fs.existsSync(targetGlobals)) {
        fs.copyFileSync(globalsCss, targetGlobals);
        log(`✅ Copiado globals.css`, c.green);
    }
}

// Crear layout.tsx raíz si no existe
const layoutPath = path.join(targetDir, 'src', 'app', 'layout.tsx');
if (!fs.existsSync(layoutPath)) {
    const defaultLayout = `import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '${clientName.charAt(0).toUpperCase() + clientName.slice(1)}',
  description: 'Sitio web profesional',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
`;
    fs.writeFileSync(layoutPath, defaultLayout);
    log(`✅ Creado layout.tsx por defecto`, c.green);
}

// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// PHASE 4: Copy Assets
// ═══════════════════════════════════════════════════════════════
logSection("FASE 4: Copiando Assets");

// 🛠️ MEJORA DANIEL: Copiado íntegro de la carpeta del cliente
const clientPublicDir = path.join(ROOT_DIR, 'public', 'prospectos', clientName);
if (fs.existsSync(clientPublicDir)) {
    log(`📂 Detectada carpeta pública del cliente: /public/prospectos/${clientName}`, c.yellow);
    const destDir = path.join(targetDir, 'public', 'prospectos', clientName);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    // Copiar todo el contenido de forma recursiva
    try {
        // Usamos fs.cpSync (Node 16.7+) para copiado recursivo nativo
        if (fs.cpSync) {
            fs.cpSync(clientPublicDir, destDir, { recursive: true });
        } else {
            // Fallback para versiones antiguas de Node
            execSync(`cp -r "${clientPublicDir}/"* "${destDir}/"`, { stdio: 'ignore' });
        }
        log(`✅ Carpeta de assets copiada íntegramente (Solución Final)`, c.green);
    } catch (e) {
        log(`⚠️ Advertencia: Error en copiado recursivo, intentando método alternativo...`, c.yellow);
    }
}

// Agregar assets base
assets.add('/favicon.ico');

let copiedAssets = 0;
const missingAssets = [];

assets.forEach(assetPath => {
    const relativePath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;

    // Buscar en múltiples ubicaciones
    const searchPaths = [
        path.join(PUBLIC_DIR, relativePath),
        path.join(PUBLIC_DIR, 'prospectos', clientName, relativePath),
        path.join(ROOT_DIR, 'public', relativePath),
    ];

    let found = false;
    for (const sourcePath of searchPaths) {
        if (fs.existsSync(sourcePath)) {
            const destPath = path.join(targetDir, 'public', relativePath);
            const destDirPath = path.dirname(destPath);

            if (!fs.existsSync(destDirPath)) {
                fs.mkdirSync(destDirPath, { recursive: true });
            }

            fs.copyFileSync(sourcePath, destPath);
            copiedAssets++;
            found = true;
            break;
        }
    }

    if (!found && !assetPath.includes('api/')) {
        missingAssets.push(assetPath);
    }
});

log(`✅ Copiados ${copiedAssets} assets`, c.green);

if (missingAssets.length > 0) {
    log(`⚠️  Assets no encontrados:`, c.yellow);
    missingAssets.forEach(a => log(`   - ${a}`, c.dim));
}

// ═══════════════════════════════════════════════════════════════
// PHASE 5: Generate Configuration Files
// ═══════════════════════════════════════════════════════════════
logSection("FASE 5: Generando Configuración");

// Filtrar dependencias que existen en el package.json raíz
const finalDeps = {};
const finalDevDeps = {};

npmDeps.forEach(dep => {
    // Ignorar dependencias internas de Next/React
    if (dep === 'next' || dep === 'react' || dep === 'react-dom') {
        finalDeps[dep] = rootPackageJson.dependencies[dep] || 'latest';
        return;
    }

    if (dep.startsWith('next/') || dep === 'server-only') return;

    // Buscar en dependencies
    if (rootPackageJson.dependencies && rootPackageJson.dependencies[dep]) {
        finalDeps[dep] = rootPackageJson.dependencies[dep];
    }
    // Buscar en devDependencies
    else if (rootPackageJson.devDependencies && rootPackageJson.devDependencies[dep]) {
        finalDevDeps[dep] = rootPackageJson.devDependencies[dep];
    }
    // Si no está, advertir
    else if (!dep.startsWith('@types')) {
        log(`   ⚠️ Dependencia no encontrada en package.json: ${dep}`, c.yellow);
    }
});

// Agregar TypeScript y types
finalDevDeps['typescript'] = rootPackageJson.devDependencies?.typescript || '^5.0.0';
finalDevDeps['@types/node'] = rootPackageJson.devDependencies?.['@types/node'] || '^20.0.0';
finalDevDeps['@types/react'] = rootPackageJson.devDependencies?.['@types/react'] || '^18.0.0';
finalDevDeps['@types/react-dom'] = rootPackageJson.devDependencies?.['@types/react-dom'] || '^18.0.0';

// Tailwind v4
finalDevDeps['tailwindcss'] = '^4.0.0';
finalDevDeps['@tailwindcss/postcss'] = '^4.0.0';
finalDevDeps['postcss'] = '^8.4.32';
finalDevDeps['autoprefixer'] = '^10.4.16';

// Dependencias comunes que suelen faltar
if (npmDeps.has('clsx') || npmDeps.has('tailwind-merge')) {
    finalDeps['clsx'] = rootPackageJson.dependencies?.clsx || '^2.1.0';
    finalDeps['tailwind-merge'] = rootPackageJson.dependencies?.['tailwind-merge'] || '^2.2.0';
}

// Package.json
const exportPackageJson = {
    name: `${clientName}-website`,
    version: "1.0.0",
    private: true,
    scripts: {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "lint": "next lint"
    },
    dependencies: finalDeps,
    devDependencies: finalDevDeps
};

fs.writeFileSync(
    path.join(targetDir, 'package.json'),
    JSON.stringify(exportPackageJson, null, 2)
);
log(`✅ package.json creado (${Object.keys(finalDeps).length} deps, ${Object.keys(finalDevDeps).length} devDeps)`, c.green);

// tsconfig.json
const tsConfig = {
    compilerOptions: {
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [{ name: "next" }],
        paths: { "@/*": ["./src/*"] }
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    exclude: ["node_modules"]
};
fs.writeFileSync(path.join(targetDir, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));
log(`✅ tsconfig.json creado`, c.green);

// next.config.js
const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
    }
};

module.exports = nextConfig;
`;
fs.writeFileSync(path.join(targetDir, 'next.config.js'), nextConfig);
log(`✅ next.config.js creado`, c.green);

// tailwind.config.js (Opcional en v4, pero útil para ciertos plugins)
const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: { extend: {} },
    plugins: [],
};
`;
fs.writeFileSync(path.join(targetDir, 'tailwind.config.js'), tailwindConfig);

// postcss.config.js (CRÍTICO para v4)
const postcssConfig = `module.exports = {
    plugins: {
        "@tailwindcss/postcss": {},
    },
};
`;
fs.writeFileSync(path.join(targetDir, 'postcss.config.js'), postcssConfig);
log(`✅ Configuración de Tailwind creada`, c.green);

// next-env.d.ts
const nextEnvDts = `/// <reference types="next" />
/// <reference types="next/image-types/global" />
`;
fs.writeFileSync(path.join(targetDir, 'next-env.d.ts'), nextEnvDts);

// .gitignore
const gitignore = `node_modules
.next
.env*.local
`;
fs.writeFileSync(path.join(targetDir, '.gitignore'), gitignore);
log(`✅ .gitignore creado`, c.green);

// EXPORT_MANIFEST.json
const manifest = {
    client: clientName,
    exportedAt: new Date().toISOString(),
    version: "3.0.0",
    stats: {
        filesCount: copiedFiles,
        assetsCount: copiedAssets,
        dependencies: Object.keys(finalDeps).length,
        devDependencies: Object.keys(finalDevDeps).length
    }
};
fs.writeFileSync(
    path.join(targetDir, 'EXPORT_MANIFEST.json'),
    JSON.stringify(manifest, null, 2)
);

// ═══════════════════════════════════════════════════════════════
// PHASE 6: Verification Build
// ═══════════════════════════════════════════════════════════════
logSection("FASE 6: Verificación");

log("📦 Instalando dependencias...", c.yellow);
try {
    execSync('npm install', {
        cwd: targetDir,
        stdio: 'pipe',
        timeout: 120000
    });
    log(`✅ npm install completado`, c.green);
} catch (e) {
    log(`❌ Error en npm install`, c.red);
    log(e.stderr?.toString() || e.message, c.dim);
    process.exit(1);
}

log("🔨 Ejecutando build de prueba...", c.yellow);
try {
    execSync('npm run build', {
        cwd: targetDir,
        stdio: 'pipe',
        timeout: 300000
    });
    log(`✅ BUILD EXITOSO! 🎉`, c.green);
} catch (e) {
    log(`\n❌ BUILD FALLIDO`, c.red);
    log(`\nErrores encontrados:`, c.yellow);
    const stderr = e.stderr?.toString() || e.stdout?.toString() || e.message;
    console.log(stderr);

    log(`\n💡 Posibles soluciones:`, c.cyan);
    log(`   1. Revisa los errores arriba`, c.reset);
    log(`   2. Agrega dependencias faltantes a package.json`, c.reset);
    log(`   3. Copia manualmente archivos que falten desde el proyecto raíz`, c.reset);
    process.exit(1);
}

// ═══════════════════════════════════════════════════════════════
// DONE
// ═══════════════════════════════════════════════════════════════
logSection("🎉 EXPORT COMPLETADO");

log(`📁 Ubicación: ${targetDir}`, c.cyan);
log(``, c.reset);
log(`📊 Resumen:`, c.bold);
log(`   • Archivos de código: ${copiedFiles}`, c.reset);
log(`   • Assets: ${copiedAssets}`, c.reset);
log(`   • Dependencias: ${Object.keys(finalDeps).length}`, c.reset);
log(`   • DevDependencies: ${Object.keys(finalDevDeps).length}`, c.reset);
log(``, c.reset);
log(`✅ El sitio está listo para subir a Vercel o al repo del cliente.`, c.green);
log(``, c.reset);
