
import crypto from 'crypto';

/**
 * Encripta datos en SHA-256 (requisito de Meta CAPI para PII)
 */
const hashData = (data: string | undefined): string => {
    if (!data) return '';
    return crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
};

interface LeadMetaCAPI {
    email: string;
    phone?: string;
    presupuesto?: string | number;
    userAgent?: string;
    ipAddress?: string;
    firstName?: string;
}

/**
 * Motor de envío a Meta Conversions API (CAPI)
 * ⚠️ IMPORTANTE: test_event_code se usa solo para ver los eventos en el 'Events Manager' -> 'Test Events'
 */
export async function sendLeadToMetaCAPI(leadData: LeadMetaCAPI) {
    const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1138883614275038';
    const ACCESS_TOKEN = process.env.META_CAPI_TOKEN || '';
    
    // El Test Code permite ver el evento en tiempo real en el configurador de Meta
    const TEST_CODE = process.env.META_TEST_EVENT_CODE || ''; 

    const payload = {
        data: [
            {
                event_name: 'Lead',
                event_time: Math.floor(Date.now() / 1000),
                action_source: 'website',
                event_source_url: 'https://www.hojacero.cl/auditoria-tecnica',
                user_data: {
                    em: [hashData(leadData.email)],
                    ph: leadData.phone ? [hashData(leadData.phone)] : [],
                    fn: leadData.firstName ? [hashData(leadData.firstName)] : [],
                    client_user_agent: leadData.userAgent || '',
                    client_ip_address: leadData.ipAddress || '',
                },
                custom_data: {
                    currency: 'CLP',
                    // Intentamos sacar un valor numérico del presupuesto si es posible
                    value: typeof leadData.presupuesto === 'number' ? leadData.presupuesto : 0, 
                }
            }
        ],
        ...(TEST_CODE ? { test_event_code: TEST_CODE } : {})
    };

    try {
        const response = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        console.log('🚀 Meta CAPI Response:', result);
        return result;
    } catch (error) {
        console.error('❌ Error enviando a Meta CAPI:', error);
        return { error };
    }
}
