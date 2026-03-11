const rawText = `--mk3-ed9a1967a6494f41ba2516c14f6ce45d Content-Type: text/plain; charset=UTF-8 Content-Transfer-Encoding: quoted-printable () ************** Reset your password ************** We've received a request to reset the password for the Supabase account associated with contacto@hojacero.cl. No changes have been made to your account yet. To reset your password, click on the button below. Reset your password: https://auth.supabase.io/auth/v1/verify?token=08eb3348738781c233e0209d0d8c2a4cd6e09d269cf6593ecd949d49&type=signup&redirect_to=https%3A%2F%2Fsupabase.com%2Fdashboard%2Fsign-in If you didn't request for a password reset, you can safely ignore this email. Â© 2023 . All rights reserved. --mk3-ed9a1967a6494f41ba2516c14f6ce45d Content-Type: text/html; charset=UTF-8 Content-Transfer-Encoding: quoted-printable Confirm your email address to start building with Supabase You can start building with Supabase right away once you confirm your email. Click the button below to confirm. Confirm Email Address If you didn't request for this, you can safely ignore this email. Supabase`;

const getCleanBody = (rawText) => {
    if (!rawText) return "";

    try {
        const stripUnwanted = (html) => {
            let cleaned = html
                .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<\/p>/gi, '\n\n')
                .replace(/<[^>]+>/g, ' ') 
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/\s+/g, ' ')
                .trim();
            return cleaned;
        };

        const decodeQuotedPrintable = (text) => {
            try {
                let cleanStr = text.replace(/=\r\n/g, '').replace(/=\n/g, '').replace(/=\s/g, '');
                cleanStr = cleanStr.replace(/=([0-9A-F]{2})/ig, '%$1');
                return decodeURIComponent(cleanStr);
            } catch {
                let fallbackStr = text.replace(/=\r\n/g, '').replace(/=\n/g, '').replace(/=\s/g, '');
                return fallbackStr.replace(/=([0-9A-F]{2})/ig, (m, hex) => String.fromCharCode(parseInt(hex, 16)));
            }
        };

        const decodeBase64 = (text, charset) => {
            try {
                const b64 = text.replace(/\s/g, '');
                if (charset.toLowerCase().includes('utf-8')) {
                    const decodedArray = atob(b64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('');
                    return decodeURIComponent(decodedArray);
                }
                return decodeURIComponent(escape(atob(b64)));
            } catch {
                return text; // Fallback to raw
            }
        };

        // Detect boundary (either explicitly via header or heuristically)
        let boundaryStr = "";
        const boundaryMatch = rawText.match(/boundary="?([^"\r\n\s;]+)"?/i);
        if (boundaryMatch) {
            boundaryStr = boundaryMatch[1];
        } else if (rawText.trim().startsWith('--')) {
            const firstLineMatch = rawText.trim().match(/^--([a-zA-Z0-9_.-]+)/);
            if (firstLineMatch) boundaryStr = firstLineMatch[1];
        }

        if (boundaryStr) {
            // Split sequence robustly ignoring standard line breaks
            const parts = rawText.split(new RegExp(`--${boundaryStr.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}`, 'i'));
            let bestText = "";
            let bestHtml = "";

            for (let part of parts) {
                if (part.includes('--') && part.trim() === '--') continue;

                const lowerPart = part.toLowerCase();
                const isHtml = lowerPart.includes('content-type: text/html');
                const isText = lowerPart.includes('content-type: text/plain');
                if (!isHtml && !isText) continue;

                let charset = "utf-8";
                if (lowerPart.includes('charset="iso-8859-1"') || lowerPart.includes('charset=iso-8859-1')) charset = "iso-8859-1";

                let content = part;
                
                // Separate headers from body (if proper double newlines exist)
                const doubleNewline = part.indexOf('\r\n\r\n') !== -1 ? part.indexOf('\r\n\r\n') : part.indexOf('\n\n');
                if (doubleNewline !== -1 && doubleNewline < 500) {
                    content = part.substring(doubleNewline).trim();
                } else {
                    // Flat text parsed by Regex heuristics
                    content = content.replace(/Content-Type:\s*[^\s;]+(?:;\s*charset=[^\s]+)?[ \t]*/ig, '');
                    content = content.replace(/Content-Transfer-Encoding:\s*[a-zA-Z0-9-]+\s*(?:\(\))?[ \t]*/ig, '');
                    content = content.replace(/charset=[a-zA-Z0-9-]+\s*/ig, '');
                    content = content.trim();
                }

                if (lowerPart.includes('content-transfer-encoding: base64') || lowerPart.includes('base64')) {
                    content = decodeBase64(content, charset);
                } else if (lowerPart.includes('content-transfer-encoding: quoted-printable') || lowerPart.includes('quoted-printable')) {
                    content = decodeQuotedPrintable(content);
                }

                if (isHtml) {
                    bestHtml = stripUnwanted(content);
                } else if (isText) {
                    bestText = content;
                }
            }

            if (bestText || bestHtml) {
                return bestText || bestHtml;
            }
        }

        // Fallback for non-multipart emails or completely malformed ones
        let fallbackDesc = rawText;
        
        // If legitimate double newlines exist, extract body directly
        const doubleNewlineFallback = fallbackDesc.indexOf('\r\n\r\n') !== -1 ? fallbackDesc.indexOf('\r\n\r\n') : fallbackDesc.indexOf('\n\n');
        if (doubleNewlineFallback !== -1 && doubleNewlineFallback < 1500) {
            fallbackDesc = fallbackDesc.substring(doubleNewlineFallback).trim();
        } else {
            // Otherwise aggresively remove common headers that polluted text
            fallbackDesc = fallbackDesc.replace(/^(?:DKIM-Signature|Received|Authentication-Results|Date|From|To|Subject|Message-Id|MIME-Version|Content-Type|Content-Transfer-Encoding|X-[a-zA-Z0-9-]+)[^:]+?:.*?(?=DKIM-Signature|Received|Date|From|To|Subject|Message-Id|MIME-Version|Content-Type|Content-Transfer-Encoding|X-[a-zA-Z0-9-]+|$)/ig, '');
            fallbackDesc = fallbackDesc.replace(/Content-Type:\s*[^\s;]+(?:;\s*charset=[^\s]+)*[ \t]*/ig, '');
            fallbackDesc = fallbackDesc.replace(/Content-Transfer-Encoding:\s*[a-zA-Z0-9-]+\s*(?:\(\))?[ \t]*/ig, '');
        }

        const lowerRaw = fallbackDesc.toLowerCase();
        let charset = "utf-8";
        if (lowerRaw.includes('charset="iso-8859-1"') || lowerRaw.includes('charset=iso-8859-1')) charset = "iso-8859-1";
        
        if (lowerRaw.includes('base64')) {
            fallbackDesc = decodeBase64(fallbackDesc, charset);
        } else if (lowerRaw.includes('quoted-printable')) {
            fallbackDesc = decodeQuotedPrintable(fallbackDesc);
        }

        fallbackDesc = fallbackDesc.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
        fallbackDesc = fallbackDesc.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        fallbackDesc = fallbackDesc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        
        // Clean weird CSS artifacts like .email-footer { width: 100% ...}
        fallbackDesc = fallbackDesc.replace(/@[a-z-]+\s+[^{]+\{[\s\S]*?\}/gi, '');
        fallbackDesc = fallbackDesc.replace(/\.[a-z0-9_-]+\s*\{[\s\S]*?\}/gi, '');

        return fallbackDesc;

    } catch (e) {
        return `[Error decodificando el correo]\n\n${rawText.substring(0, 500)}...`;
    }
};

console.log("TEXTO DECODIFICADO:");
const text = getCleanBody(rawText);
console.log(text);
if (!text || text.trim() === '') console.log("=> ERROR: El string quedó vacío.");
