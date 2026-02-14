// Utils: Scraper Engine (Codex Refactor)
// Centralizes fetching logic, timeouts, and concurrency management.

export class ScraperEngine {
    private static userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

    /**
     * Fetches a single URL with strict timeout handling.
     */
    static async fetchHtml(url: string, timeoutMs: number = 3000): Promise<{ ok: boolean, html: string | null, finalUrl: string, error?: string }> {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const response = await fetch(url, {
                signal: controller.signal,
                headers: { 'User-Agent': this.userAgent }
            });
            clearTimeout(timeout);

            if (!response.ok) {
                return { ok: false, html: null, finalUrl: url, error: `HTTP ${response.status}` };
            }

            const html = await response.text();
            return { ok: true, html, finalUrl: response.url, error: undefined };

        } catch (error: any) {
            clearTimeout(timeout);
            return { ok: false, html: null, finalUrl: url, error: error.name === 'AbortError' ? 'Timeout' : error.message };
        }
    }

    /**
     * Tries multiple URL variations (http/https/www) in parallel.
     * Returns the first successful response (Promise.any pattern).
     */
    static async findReachableUrl(cleanDomain: string): Promise<{ ok: boolean, html: string, url: string } | null> {
        const variations = [
            `https://${cleanDomain}`,
            `https://www.${cleanDomain}`,
            `http://${cleanDomain}`,
            `http://www.${cleanDomain}`
        ];

        try {
            // "Race" for success: The first one to resolve OK wins.
            // Note: Promise.any waits for the first Fulbright, ignores rejections unless ALL reject.
            const result = await Promise.any(variations.map(async (url) => {
                const res = await this.fetchHtml(url, 4000); // Slightly longer timeout for initial discovery
                if (!res.ok) throw new Error(res.error || 'Failed');
                return { ok: true, html: res.html!, url: res.finalUrl || url };
            }));

            return result;
        } catch (e) {
            // All variations failed
            return null;
        }
    }

    /**
     * Executes a batch of URLs with a concurrency limit.
     * Equivalent to p-limit.
     */
    static async scrapeBatch(urls: string[], concurrency: number = 3): Promise<{ url: string, html: string | null }[]> {
        const results: { url: string, html: string | null }[] = [];
        for (let i = 0; i < urls.length; i += concurrency) {
            const chunk = urls.slice(i, i + concurrency);
            const promises = chunk.map(url => this.fetchHtml(url, 3000).then(res => ({ url, html: res.html })));
            const chunkResults = await Promise.all(promises);
            results.push(...chunkResults);
        }

        return results;
    }
}
