// Integraciones con pasarelas de pago para Chile

export interface PaymentGatewayConfig {
    method: 'mercadopago' | 'flow' | 'transbank';
    credentials: Record<string, string>;
    testMode: boolean;
}

export interface CreatePaymentParams {
    orderId: string;
    amount: number;
    description: string;
    returnUrl: string;
    webhookUrl: string;
}

export interface PaymentResult {
    success: boolean;
    checkoutUrl?: string;
    paymentId?: string;
    error?: string;
}

// ==========================================
// MERCADO PAGO
// ==========================================

export async function createMercadoPagoPayment(
    config: PaymentGatewayConfig,
    params: CreatePaymentParams
): Promise<PaymentResult> {
    try {
        const accessToken = config.credentials.accessToken;

        if (!accessToken) {
            return { success: false, error: 'Missing Mercado Pago access token' };
        }

        // Crear preferencia de pago
        const preference = {
            items: [
                {
                    title: params.description,
                    quantity: 1,
                    unit_price: params.amount,
                    currency_id: 'CLP'
                }
            ],
            back_urls: {
                success: params.returnUrl,
                failure: params.returnUrl,
                pending: params.returnUrl
            },
            auto_return: 'approved',
            notification_url: params.webhookUrl,
            external_reference: params.orderId,
            metadata: {
                order_id: params.orderId
            }
        };

        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(preference)
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Mercado Pago error:', error);
            return { success: false, error: 'Error al crear pago en Mercado Pago' };
        }

        const data = await response.json();

        return {
            success: true,
            checkoutUrl: config.testMode ? data.sandbox_init_point : data.init_point,
            paymentId: data.id
        };
    } catch (error) {
        console.error('Error creating Mercado Pago payment:', error);
        return { success: false, error: 'Error inesperado con Mercado Pago' };
    }
}

// ==========================================
// FLOW
// ==========================================

export async function createFlowPayment(
    config: PaymentGatewayConfig,
    params: CreatePaymentParams
): Promise<PaymentResult> {
    try {
        const { apiKey, secretKey } = config.credentials;

        if (!apiKey || !secretKey) {
            return { success: false, error: 'Missing Flow credentials' };
        }

        // Flow requiere firma HMAC
        const flowParams = {
            apiKey,
            commerceOrder: params.orderId,
            subject: params.description,
            amount: params.amount.toString(),
            email: 'cliente@ejemplo.cl', // Esto debería venir del cliente
            urlConfirmation: params.webhookUrl,
            urlReturn: params.returnUrl
        };

        // Generar firma (simplificado - en producción usar librería crypto)
        const paramsString = Object.entries(flowParams)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join('&');

        const signature = await generateFlowSignature(paramsString, secretKey);

        const response = await fetch('https://www.flow.cl/api/payment/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                ...flowParams,
                s: signature
            })
        });

        if (!response.ok) {
            return { success: false, error: 'Error al crear pago en Flow' };
        }

        const data = await response.json();

        return {
            success: true,
            checkoutUrl: `https://www.flow.cl/app/web/pay.php?token=${data.token}`,
            paymentId: data.flowOrder
        };
    } catch (error) {
        console.error('Error creating Flow payment:', error);
        return { success: false, error: 'Error inesperado con Flow' };
    }
}

async function generateFlowSignature(params: string, secretKey: string): Promise<string> {
    // Implementación simplificada - en producción usar crypto.subtle
    const encoder = new TextEncoder();
    const data = encoder.encode(params + secretKey);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ==========================================
// TRANSBANK
// ==========================================

export async function createTransbankPayment(
    config: PaymentGatewayConfig,
    params: CreatePaymentParams
): Promise<PaymentResult> {
    try {
        const { commerceCode, apiKey } = config.credentials;

        if (!commerceCode || !apiKey) {
            return { success: false, error: 'Missing Transbank credentials' };
        }

        const baseUrl = config.testMode
            ? 'https://webpay3gint.transbank.cl'
            : 'https://webpay3g.transbank.cl';

        // Crear transacción Webpay Plus
        const transaction = {
            buy_order: params.orderId,
            session_id: params.orderId,
            amount: params.amount,
            return_url: params.returnUrl
        };

        const response = await fetch(`${baseUrl}/rswebpaytransaction/api/webpay/v1.2/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Tbk-Api-Key-Id': commerceCode,
                'Tbk-Api-Key-Secret': apiKey
            },
            body: JSON.stringify(transaction)
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Transbank error:', error);
            return { success: false, error: 'Error al crear pago en Transbank' };
        }

        const data = await response.json();

        return {
            success: true,
            checkoutUrl: `${data.url}?token_ws=${data.token}`,
            paymentId: data.token
        };
    } catch (error) {
        console.error('Error creating Transbank payment:', error);
        return { success: false, error: 'Error inesperado con Transbank' };
    }
}

// ==========================================
// FACTORY FUNCTION
// ==========================================

export async function createPayment(
    config: PaymentGatewayConfig,
    params: CreatePaymentParams
): Promise<PaymentResult> {
    switch (config.method) {
        case 'mercadopago':
            return createMercadoPagoPayment(config, params);
        case 'flow':
            return createFlowPayment(config, params);
        case 'transbank':
            return createTransbankPayment(config, params);
        default:
            return { success: false, error: 'Gateway no soportado' };
    }
}
