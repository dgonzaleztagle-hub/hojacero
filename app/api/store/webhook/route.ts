import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const contentType = request.headers.get('content-type');
        const body = contentType?.includes('application/json')
            ? await request.json()
            : await request.text();

        const supabase = await createClient();

        // Detectar tipo de webhook según estructura
        const webhookData = typeof body === 'string' ? parseWebhookData(body) : body;

        if (!webhookData) {
            return NextResponse.json({ error: 'Invalid webhook data' }, { status: 400 });
        }

        const { gateway, orderId, paymentId, status } = webhookData;

        if (!orderId || !paymentId) {
            return NextResponse.json({ error: 'Missing order or payment ID' }, { status: 400 });
        }

        // Actualizar orden si el pago fue aprobado
        if (status === 'approved' || status === 'completed') {
            const { error } = await supabase
                .from('h0_store_orders')
                .update({
                    payment_status: 'completed',
                    payment_id: paymentId,
                    paid_at: new Date().toISOString()
                })
                .eq('id', orderId);

            if (error) {
                console.error('Error updating order:', error);
                return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
            }

            console.log(`✅ Payment confirmed for order ${orderId} via ${gateway}`);
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('Error in webhook:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

function parseWebhookData(body: string | any): {
    gateway: string;
    orderId: string | null;
    paymentId: string | null;
    status: string | null;
} | null {
    try {
        // Si es string, intentar parsear como JSON
        const data = typeof body === 'string' ? JSON.parse(body) : body;

        // MERCADO PAGO
        if (data.type === 'payment' || data.action === 'payment.created' || data.action === 'payment.updated') {
            return {
                gateway: 'mercadopago',
                orderId: data.data?.external_reference || data.data?.metadata?.order_id || null,
                paymentId: data.data?.id?.toString() || null,
                status: data.data?.status || null
            };
        }

        // FLOW
        if (data.commerceOrder || data.flowOrder) {
            return {
                gateway: 'flow',
                orderId: data.commerceOrder || data.optional || null,
                paymentId: data.flowOrder?.toString() || null,
                status: data.status === 2 ? 'approved' : 'pending'
            };
        }

        // TRANSBANK
        if (data.buy_order || data.token_ws) {
            return {
                gateway: 'transbank',
                orderId: data.buy_order || null,
                paymentId: data.authorization_code || data.token_ws || null,
                status: data.response_code === 0 ? 'approved' : 'rejected'
            };
        }

        return null;
    } catch (error) {
        console.error('Error parsing webhook data:', error);
        return null;
    }
}

// Validar firma de Mercado Pago (opcional pero recomendado)
function validateMercadoPagoSignature(
    body: string,
    signature: string,
    secret: string
): boolean {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(body);
    const calculatedSignature = hmac.digest('hex');
    return calculatedSignature === signature;
}

// Validar firma de Flow
function validateFlowSignature(
    params: Record<string, string>,
    signature: string,
    secret: string
): boolean {
    const sortedParams = Object.entries(params)
        .filter(([key]) => key !== 's')
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(sortedParams);
    const calculatedSignature = hmac.digest('hex');
    return calculatedSignature === signature;
}
