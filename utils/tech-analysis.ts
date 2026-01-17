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
    pageSpeed: {
        mobileScore: number | null;
        desktopScore: number | null;
        coreWebVitals: {
            lcp: string | null; // Largest Contentful Paint
            cls: string | null; // Cumulative Layout Shift
            fid: string | null; // First Input Delay (deprecated -> INP)
        } | null;
        isMobileFriendly: boolean | null;
    };
}

// Helper para consultar PageSpeed API (sin key para evitar blockers, rate limited es ok)
async function getPsiMetrics(url: string, strategy: 'mobile' | 'desktop') {
    try {
        const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}`;
        const res = await fetch(apiUrl);
        if (!res.ok) return null;
        const data = await res.json();

        return {
            score: data.lighthouseResult?.categories?.performance?.score * 100 || 0,
            audits: data.lighthouseResult?.audits || {}
        };
    } catch (error) {
        console.error(`PageSpeed check failed for ${strategy}:`, error);
        return null;
    }
}

export async function analyzeTechSpecs(url: string): Promise<TechAnalysisResult> {
    const result: TechAnalysisResult = {
        security: { https: false, hsts: false, xFrameOptions: null, contentSecurityPolicy: false },
        infrastructure: { mxRecords: false, cloudflare: false, serverLocation: null, host: null },
        performance: { ttfb: null, status: null },
        dns: { hasDmarc: false, hasSpf: false },
        pageSpeed: { mobileScore: null, desktopScore: null, coreWebVitals: null, isMobileFriendly: null }
    };

    if (!url) return result;

    try {
        const hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
        const fullUrl = url.startsWith('http') ? url : `https://${url}`;

        // 1. DNS Analysis & PSI (Parallel execution)
        const [dnsResults, psiMobile, psiDesktop] = await Promise.all([
            Promise.allSettled([
                resolveMx(hostname),
                resolveTxt(hostname),
                resolveNs(hostname),
                resolveA(hostname)
            ]),
            getPsiMetrics(fullUrl, 'mobile'),
            getPsiMetrics(fullUrl, 'desktop')
        ]);

        // 2. HTTP/Security Analysis
        const startTime = performance.now();
        const fetchPromise = fetch(`https://${hostname}`, {
            method: 'HEAD',
            redirect: 'follow',
            signal: AbortSignal.timeout(5000)
        }).catch(() => null);

        const response = await fetchPromise;

        // Process DNS
        const [mxRes, txtRes, nsRes, aRes] = dnsResults;

        // MX Records
        if (mxRes.status === 'fulfilled' && mxRes.value.length > 0) result.infrastructure.mxRecords = true;

        // TXT Records
        if (txtRes.status === 'fulfilled') {
            const txts = txtRes.value.flat();
            result.dns.hasSpf = txts.some(t => t.toLowerCase().includes('v=spf1'));
            result.dns.hasDmarc = txts.some(t => t.toLowerCase().includes('v=dmarc1'));
        }

        // Host/NS
        if (nsRes.status === 'fulfilled') {
            const ns = nsRes.value.join(' ').toLowerCase();
            if (ns.includes('cloudflare')) result.infrastructure.cloudflare = true;
            else if (ns.includes('aws') || ns.includes('amazon')) result.infrastructure.host = 'AWS';
            else if (ns.includes('google')) result.infrastructure.host = 'Google Cloud';
            else if (ns.includes('azure')) result.infrastructure.host = 'Azure';
            else if (ns.includes('vercel')) result.infrastructure.host = 'Vercel';
            else if (ns.includes('netlify')) result.infrastructure.host = 'Netlify';
            else if (ns.includes('wix')) result.infrastructure.host = 'Wix';
            else if (ns.includes('shopify')) result.infrastructure.host = 'Shopify';
        }

        // Geo/IP
        if (aRes.status === 'fulfilled' && aRes.value.length > 0) result.infrastructure.serverLocation = aRes.value[0];

        // Process PSI Data
        if (psiMobile && psiDesktop) {
            result.pageSpeed.mobileScore = Math.round(psiMobile.score);
            result.pageSpeed.desktopScore = Math.round(psiDesktop.score);

            // Core Web Vitals from Mobile
            const audits = psiMobile.audits;
            result.pageSpeed.coreWebVitals = {
                lcp: audits['largest-contentful-paint']?.displayValue || null,
                cls: audits['cumulative-layout-shift']?.displayValue || null,
                fid: audits['max-potential-fid']?.displayValue || null
            };

            // Check viewport audit for mobile friendliness
            // Note: PSI doesn't have a direct 'is-mobile-friendly' audit anymore, but viewport is a proxy
            const hasViewport = audits['viewport']?.score === 1;
            const hasReadableText = audits['font-size']?.score === 1;
            result.pageSpeed.isMobileFriendly = hasViewport && hasReadableText;
        }

        // Process HTTP Response
        if (response) {
            const endTime = performance.now();
            result.performance.ttfb = Math.round(endTime - startTime);
            result.performance.status = response.status;
            result.security.https = true;

            const headers = response.headers;
            result.security.hsts = headers.has('strict-transport-security');
            result.security.xFrameOptions = headers.get('x-frame-options');
            result.security.contentSecurityPolicy = headers.has('content-security-policy');

            const serverHeader = headers.get('server');
            if (serverHeader && !result.infrastructure.host) result.infrastructure.host = serverHeader;
        }

    } catch (e) {
        console.error(`Tech Analysis failed for ${url}:`, e);
    }

    return result;
}
