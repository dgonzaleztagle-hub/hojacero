const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const ROOT_DIR = path.resolve(__dirname, '..');
const EXPORTS_DIR = path.join(ROOT_DIR, 'exports');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

// Helper: ANSI colors
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    cyan: "\x1b[36m"
};

function log(msg, color = colors.reset) {
    console.log(`${color}${msg}${colors.reset}`);
}

// Main execution
const clientName = process.argv[2];
if (!clientName) {
    log("Error: Please provide a client name.", colors.red);
    log("Usage: node scripts/export-helper.js [client-name]", colors.yellow);
    process.exit(1);
}

const targetDir = path.join(EXPORTS_DIR, clientName);
const srcDir = path.join(targetDir, 'src');

if (!fs.existsSync(targetDir)) {
    log(`Error: Export directory not found: ${targetDir}`, colors.red);
    process.exit(1);
}

log(`🚀 Starting Export Helper for: ${clientName}`, colors.cyan);

// --- 1. Dependency Scanning ---
log(`\n📦 Scanning for dependencies...`, colors.yellow);

const rootPackageJson = require(path.join(ROOT_DIR, 'package.json'));
const usedDeps = new Set(['next', 'react', 'react-dom', 'typescript', '@types/node', '@types/react', '@types/react-dom']); // Core deps
const devDeps = new Set(['tailwindcss', 'postcss', 'autoprefixer', 'clsx', 'tailwind-merge']); // Common dev deps

function scanFiles(dir) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            scanFiles(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js')) {
            const content = fs.readFileSync(filePath, 'utf8');

            // Regex for imports: import ... from "package"
            const importRegex = /from\s+['"]([^'.\/][^'"]*)['"]/g;
            let match;
            while ((match = importRegex.exec(content)) !== null) {
                const pkg = match[1].split('/')[0];
                if (!pkg.startsWith('.')) {
                    // Check if it's an alias or package
                    if (pkg.startsWith('@')) {
                        // internal alias, ignore or handle if it's a scoped package
                        const scopedPkg = match[1].split('/').slice(0, 2).join('/');
                        if (rootPackageJson.dependencies[scopedPkg] || rootPackageJson.devDependencies[scopedPkg]) {
                            usedDeps.add(scopedPkg);
                        }
                    } else {
                        // verify it exists in root package.json
                        if (rootPackageJson.dependencies[pkg] || rootPackageJson.devDependencies[pkg]) {
                            usedDeps.add(pkg);
                        }
                    }
                }
            }
        }
    });
}

scanFiles(srcDir);

const finalDeps = {};
const finalDevDeps = {};

usedDeps.forEach(dep => {
    if (rootPackageJson.dependencies[dep]) {
        finalDeps[dep] = rootPackageJson.dependencies[dep];
    } else if (rootPackageJson.devDependencies[dep]) {
        // moving dev deps to dependencies if detected in code is safer for standalone, 
        // but let's try to keep them separated if possible or just put everything in dependencies for safety?
        // Safe bet: everything used in code goes to dependencies.
        finalDeps[dep] = rootPackageJson.devDependencies[dep];
    }
});

devDeps.forEach(dep => {
    if (rootPackageJson.devDependencies[dep]) {
        finalDevDeps[dep] = rootPackageJson.devDependencies[dep];
    } else if (rootPackageJson.dependencies[dep]) {
        finalDeps[dep] = rootPackageJson.dependencies[dep];
    }
});

// Inject Peer Dependencies manually
if (usedDeps.has('@react-three/fiber') && !finalDeps['three']) {
    finalDeps['three'] = rootPackageJson.dependencies['three'] || "^0.160.0";
    log(`   Auto-injected peer dependency: three`, colors.cyan);
}
if (usedDeps.has('framer-motion') && !finalDeps['framer-motion']) {
    finalDeps['framer-motion'] = rootPackageJson.dependencies['framer-motion'];
}

log(`   Found ${Object.keys(finalDeps).length} dependencies.`, colors.green);

// --- 2. Asset Harvesting ---
log(`\n🎨 Harvesting assets...`, colors.yellow);

const assetsToCopy = new Set();
// Common assets
assetsToCopy.add('/favicon.ico');
assetsToCopy.add('/robots.txt');
assetsToCopy.add('/sitemap.xml'); // Assuming it was generated

function scanForAssets(dir) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            scanForAssets(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
            const content = fs.readFileSync(filePath, 'utf8');
            // Look for strings starting with / inside quotes, likely assets
            // Example: src="/apimiel.mp4" or url('/image.png')
            const assetRegex = /['"](\/[^'"\n]+)['"]/g;
            let match;
            while ((match = assetRegex.exec(content)) !== null) {
                const assetPath = match[1];
                // basic filtering to avoid code paths like /api/
                if (!assetPath.startsWith('/api') &&
                    path.extname(assetPath) // must have extension
                ) {
                    assetsToCopy.add(assetPath);
                }
            }
        }
    });
}

scanForAssets(srcDir);

const exportPublicDir = path.join(targetDir, 'public');
if (!fs.existsSync(exportPublicDir)) fs.mkdirSync(exportPublicDir, { recursive: true });

let copiedAssets = 0;
assetsToCopy.forEach(assetPath => {
    // Remove leading slash for local path resolution
    const relativePath = assetPath.substring(1);
    const sourcePath = path.join(PUBLIC_DIR, relativePath);
    const destPath = path.join(exportPublicDir, relativePath);

    // Check if source exists
    if (fs.existsSync(sourcePath)) {
        if (!fs.existsSync(path.dirname(destPath))) {
            fs.mkdirSync(path.dirname(destPath), { recursive: true });
        }
        try {
            fs.copyFileSync(sourcePath, destPath);
            copiedAssets++;
        } catch (e) {
            log(`   Failed to copy: ${assetPath}`, colors.red);
        }
    } else {
        // Try looking in public/prospectos/[client] if not found in root public
        const specificPath = path.join(PUBLIC_DIR, 'prospectos', clientName, relativePath);
        if (fs.existsSync(specificPath)) {
            if (!fs.existsSync(path.dirname(destPath))) {
                fs.mkdirSync(path.dirname(destPath), { recursive: true });
            }
            try {
                fs.copyFileSync(specificPath, destPath);
                copiedAssets++;
            } catch (e) {
                log(`   Failed to copy: ${assetPath}`, colors.red);
            }
        } else {
            // It might be already in the export folder if user manually copied?
            // But log warning if not found
            if (!fs.existsSync(destPath)) {
                log(`   Warning: Asset not found: ${assetPath}`, colors.red);
            }
        }
    }
});
log(`   Copied ${copiedAssets} assets.`, colors.green);


// --- 3. Config Generation ---
log(`\n⚙️ Generating configuration files...`, colors.yellow);

// A. package.json
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
    devDependencies: {
        ...finalDevDeps,
        "tailwindcss": "^3.4.17",
        "postcss": "^8.4.32",
        "autoprefixer": "^10.4.16"
    }
};

fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(exportPackageJson, null, 2));
log(`   Created package.json`, colors.green);

// B. tsconfig.json (Crucial for alias support)
const tsConfig = {
    "compilerOptions": {
        "lib": ["dom", "dom.iterable", "esnext"],
        "allowJs": true,
        "skipLibCheck": true,
        "strict": true,
        "noEmit": true,
        "esModuleInterop": true,
        "module": "esnext",
        "moduleResolution": "bundler",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "jsx": "preserve",
        "incremental": true,
        "plugins": [
            {
                "name": "next"
            }
        ],
        "paths": {
            "@/*": ["./src/*"]
        }
    },
    "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    "exclude": ["node_modules"]
};

fs.writeFileSync(path.join(targetDir, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));
log(`   Created tsconfig.json with @/ alias`, colors.green);

// C. next.config.js
const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Default to static export for maximum portability? Or standalone? 
    // User requested standalone site. 'output: export' = static HTML. 
    // 'standalone' usually refers to 'output: standalone' for docker, or just a standard nextjs app.
    // Given description, usually it's standard build or static export. 
    // Let's stick to standard build for Vercel unless user wants static.
    // The previous workflow said "output: export", so let's keep that but comment it if they want dynamic features.
    // Actually, for Vercel, no config is needed usually.
    // But let's add minimal config.
    images: {
        unoptimized: true, // Needed for static export if used
    }
};

module.exports = nextConfig;
`;
fs.writeFileSync(path.join(targetDir, 'next.config.js'), nextConfig);
log(`   Created next.config.js`, colors.green);

// D. Tailwind support (minimal)
const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
         // Add project colors here if needed, or rely on CSS variables
      }
    },
  },
  plugins: [],
};
`;
fs.writeFileSync(path.join(targetDir, 'tailwind.config.js'), tailwindConfig);

const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
fs.writeFileSync(path.join(targetDir, 'postcss.config.js'), postcssConfig);
log(`   Created tailwind config`, colors.green);

// --- 5. Sanitization (Removing Agency-Only Components) ---
log(`\n🧹 Sanitizing agency components...`, colors.yellow);
const pathsToRemove = [
    'src/components/radar',
    'src/components/vault',
    'src/components/dashboard',
    'src/components/pipeline',
    'src/components/inbox',
    'src/components/report',
    'src/hooks/useRadar.ts',
    'src/components/layout/sidebar', // Often contains dashboard links
    'src/components/ui/VisionModal.tsx' // Agency specific
];

let removedCount = 0;
pathsToRemove.forEach(p => {
    const fullPath = path.join(targetDir, p);
    if (fs.existsSync(fullPath)) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        removedCount++;
        // log(`   Removed: ${p}`, colors.cyan);
    }
});
log(`   Removed ${removedCount} agency-specific files/directories.`, colors.green);


// --- 6. Final Instructions ---
log(`\n✅ Export configuration complete!`, colors.cyan);
log(`Next steps:`, colors.reset);
log(`1. cd exports\\${clientName}`, colors.reset);
log(`2. npm install`, colors.reset);
// --- 7. Export Stamp (Handshake Protocol) ---
const manifest = {
    client: clientName,
    exportedAt: new Date().toISOString(),
    assetsCount: copiedAssets,
    dependenciesCount: Object.keys(finalDeps).length,
    status: "success",
    version: "2.1.0" // Auto-patched version
};
fs.writeFileSync(path.join(targetDir, 'EXPORT_MANIFEST.json'), JSON.stringify(manifest, null, 2));
log(`   Created EXPORT_MANIFEST.json`, colors.green);

log(`3. npm run build`, colors.reset);
