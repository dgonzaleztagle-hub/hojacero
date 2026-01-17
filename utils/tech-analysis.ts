import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);
const resolveTxt = promisify(dns.resolveTxt);
const resolveA = promisify(dns.resolve4);
const resolveNs = promisify(dns.resolveNs);

export interface TechAnalysisResult {
    security: {
        https: boolean;
        hsts: boolean;
        xFrameOptions: string | null;
        contentSecurityPolicy: boolean;
    };
    infrastructure: {
        mxRecords: boolean;
        cloudflare: boolean;
        serverLocation: string | null; // Simplificado: IP
        host: string | null;
    };
    performance: {
        ttfb: number | null; // Time to First Byte (ms)
        status: number | null;
    };
    dns: {
        hasDmarc: boolean;
        hasSpf: boolean;
    };
}

export async function analyzeTechSpecs(url: string): Promise<TechAnalysisResult> {
    const result: TechAnalysisResult = {
        security: { https: false, hsts: false, xFrameOptions: null, contentSecurityPolicy: false },
        infrastructure: { mxRecords: false, cloudflare: false, serverLocation: null, host: null },
        performance: { ttfb: null, status: null },
        dns: { hasDmarc: false, hasSpf: false }
    };

    if (!url) return result;

    try {
        const hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;

        // 1. DNS Analysis (Parallel execution for speed)
        const dnsPromise = Promise.allSettled([
            resolveMx(hostname),
            resolveTxt(hostname),
            resolveNs(hostname),
            resolveA(hostname)
        ]);

        // 2. HTTP/Security Analysis
        const startTime = performance.now();
        const fetchPromise = fetch(`https://${hostname}`, {
            method: 'HEAD',
            redirect: 'follow',
            signal: AbortSignal.timeout(5000) // 5s timeout
        }).catch(() => null);

        const [dnsResults, response] = await Promise.all([dnsPromise, fetchPromise]);

        // Process DNS
        const [mxRes, txtRes, nsRes, aRes] = dnsResults;

        // MX Records (Email)
        if (mxRes.status === 'fulfilled' && mxRes.value.length > 0) {
            result.infrastructure.mxRecords = true;
        }

        // TXT Records (SPF/DMARC)
        if (txtRes.status === 'fulfilled') {
            const txts = txtRes.value.flat();
            result.dns.hasSpf = txts.some(t => t.toLowerCase().includes('v=spf1'));
            result.dns.hasDmarc = txts.some(t => t.toLowerCase().includes('v=dmarc1'));
        }

        // Host/NS
        if (nsRes.status === 'fulfilled') {
            const ns = nsRes.value.join(' ').toLowerCase();
            if (ns.includes('cloudflare')) result.infrastructure.cloudflare = true;
            if (ns.includes('aws') || ns.includes('amazon')) result.infrastructure.host = 'AWS';
            else if (ns.includes('goog')) result.infrastructure.host = 'Google Cloud';
            else if (ns.includes('azure')) result.infrastructure.host = 'Azure';
            else if (ns.includes('digitalocean')) result.infrastructure.host = 'DigitalOcean';
            else if (ns.includes('vercel')) result.infrastructure.host = 'Vercel';
            else if (ns.includes('netlify')) result.infrastructure.host = 'Netlify';
        }

        // Simple Geo/IP (just the IP for now)
        if (aRes.status === 'fulfilled' && aRes.value.length > 0) {
            result.infrastructure.serverLocation = aRes.value[0];
        }

        // Process HTTP Response
        if (response) {
            const endTime = performance.now();
            result.performance.ttfb = Math.round(endTime - startTime);
            result.performance.status = response.status;
            result.security.https = true; // We successfully connected via HTTPS

            // Headers Security
            const headers = response.headers;
            result.security.hsts = headers.has('strict-transport-security');
            result.security.xFrameOptions = headers.get('x-frame-options');
            result.security.contentSecurityPolicy = headers.has('content-security-policy');

            // Additional server detection via headers
            const serverHeader = headers.get('server');
            if (serverHeader && !result.infrastructure.host) {
                result.infrastructure.host = serverHeader;
            }
        }

    } catch (e) {
        console.error(`Tech Analysis failed for ${url}:`, e);
    }

    return result;
}
