import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createPayment } from '@/lib/store/payment-gateways';

export async function POST(request: NextRequest) {
    try {
        const { cart, total, clientData } = await request.json();

        if (!cart || !total || !clientData) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const supabase = createClient();

        // Get payment config
        const { data: config } = await supabase
            .from('h0_store_payment_config')
            .select('*')
            .single();

        if (!config) {
            return NextResponse.json(
                { error: 'Payment not configured' },
                { status: 400 }
            );
        }

        // Create order in DB
        const { data: order, error: orderError } = await supabase
            .from('h0_store_orders')
            .insert({
                total_amount: total,
                payment_status: 'pending',
                payment_method: config.payment_method,
                client_data: clientData,
                delivery_status: 'pending'
            })
            .select()
            .single();

        if (orderError) {
            console.error('Error creating order:', orderError);
            return NextResponse.json(
                { error: 'Failed to create order' },
                { status: 500 }
            );
        }

        // Insert order items
        const orderItems = cart.map((item: any) => ({
            order_id: order.id,
            product_id: item.id,
            product_name: item.name,
            quantity: item.quantity,
            price: item.price
        }));

        await supabase
            .from('h0_store_order_items')
            .insert(orderItems);

        // Create payment with gateway
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const result = await createPayment(
            {
                method: config.payment_method,
                credentials: config.credentials,
                testMode: config.test_mode
            },
            {
                orderId: order.id,
                amount: total,
                description: `Pedido #${order.id.slice(0, 8)}`,
                returnUrl: `${baseUrl}/tienda/pago-exitoso?order_id=${order.id}`,
                webhookUrl: `${baseUrl}/api/store/webhook`
            }
        );

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Failed to create payment' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            orderId: order.id,
            checkoutUrl: result.checkoutUrl,
            paymentId: result.paymentId,
            method: config.payment_method
        });

    } catch (error) {
        console.error('Error in create-payment:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
