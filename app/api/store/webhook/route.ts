import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

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

function parseWebhookData(body: string | Record<string, unknown>): {
    gateway: string;
    orderId: string | null;
    paymentId: string | null;
    status: string | null;
} | null {
    try {
        // Si es string, intentar parsear como JSON
        const data = (typeof body === 'string' ? JSON.parse(body) : body) as Record<string, unknown>;
        const payload = (data.data || {}) as Record<string, unknown>;
        const metadata = (payload.metadata || {}) as Record<string, unknown>;
        const action = typeof data.action === 'string' ? data.action : '';
        const webhookType = typeof data.type === 'string' ? data.type : '';

        // MERCADO PAGO
        if (webhookType === 'payment' || action === 'payment.created' || action === 'payment.updated') {
            return {
                gateway: 'mercadopago',
                orderId: (payload.external_reference as string) || (metadata.order_id as string) || null,
                paymentId: payload.id ? String(payload.id) : null,
                status: (payload.status as string) || null
            };
        }

        // FLOW
        if (data.commerceOrder || data.flowOrder) {
            return {
                gateway: 'flow',
                orderId: (data.commerceOrder as string) || (data.optional as string) || null,
                paymentId: data.flowOrder ? String(data.flowOrder) : null,
                status: data.status === 2 ? 'approved' : 'pending'
            };
        }

        // TRANSBANK
        if (data.buy_order || data.token_ws) {
            return {
                gateway: 'transbank',
                orderId: (data.buy_order as string) || null,
                paymentId: (data.authorization_code as string) || (data.token_ws as string) || null,
                status: data.response_code === 0 ? 'approved' : 'rejected'
            };
        }

        return null;
    } catch (error) {
        console.error('Error parsing webhook data:', error);
        return null;
    }
}

