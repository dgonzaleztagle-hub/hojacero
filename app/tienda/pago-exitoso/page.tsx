'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { CheckCircle2, Loader2, XCircle, MessageCircle } from 'lucide-react';

interface OrderData {
    id: string;
    total_amount: number;
    client_data: {
        name: string;
        phone: string;
        address?: string;
    };
    items: Array<{
        product_name: string;
        quantity: number;
        price: number;
    }>;
}

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [orderData, setOrderData] = useState<OrderData | null>(null);

    useEffect(() => {
        if (!orderId) {
            setStatus('error');
            return;
        }

        let attempts = 0;
        const maxAttempts = 15; // 30 segundos (15 x 2s)

        const verifyPayment = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('h0_store_orders')
                .select(`
          id,
          total_amount,
          payment_status,
          client_data,
          items:h0_store_order_items(
            product_name,
            quantity,
            price
          )
        `)
                .eq('id', orderId)
                .single();

            if (error) {
                console.error('Error fetching order:', error);
                return false;
            }

            if (data?.payment_status === 'completed') {
                setOrderData(data as OrderData);
                setStatus('success');
                return true;
            }

            return false;
        };

        const poll = setInterval(async () => {
            attempts++;
            const verified = await verifyPayment();

            if (verified) {
                clearInterval(poll);
            } else if (attempts >= maxAttempts) {
                clearInterval(poll);
                setStatus('error');
            }
        }, 2000);

        // Primera verificación inmediata
        verifyPayment();

        return () => clearInterval(poll);
    }, [orderId]);

    const generateWhatsAppMessage = () => {
        if (!orderData) return '';

        const products = orderData.items
            .map(item => `• ${item.product_name} (x${item.quantity}) - $${item.price.toLocaleString()}`)
            .join('\n');

        return encodeURIComponent(
            `¡Hola! Acabo de pagar el pedido #${orderData.id.slice(0, 8)}\n\n` +
            `💰 Total: $${orderData.total_amount.toLocaleString()}\n\n` +
            `🛒 Productos:\n${products}\n\n` +
            `👤 Nombre: ${orderData.client_data.name}\n` +
            `📱 Teléfono: ${orderData.client_data.phone}\n` +
            (orderData.client_data.address ? `📍 Dirección: ${orderData.client_data.address}` : '')
        );
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-600 animate-spin" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Verificando pago...
                    </h1>
                    <p className="text-gray-600">
                        Esto puede tomar unos segundos
                    </p>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-red-50 to-pink-50">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <XCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        No pudimos verificar tu pago
                    </h1>
                    <p className="text-gray-600 mb-4">
                        Por favor contacta a soporte con el número de pedido:
                    </p>
                    <p className="text-lg font-mono font-bold text-gray-900 bg-gray-100 rounded-lg p-3">
                        {orderId?.slice(0, 8) || 'N/A'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                {/* Success Header */}
                <div className="text-center mb-6">
                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        ¡Pago Confirmado!
                    </h1>
                    <p className="text-gray-600">
                        Pedido #{orderData?.id.slice(0, 8)}
                    </p>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h2 className="font-semibold text-gray-900 mb-3">Resumen del pedido</h2>
                    <div className="space-y-2">
                        {orderData?.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    {item.product_name} (x{item.quantity})
                                </span>
                                <span className="font-medium text-gray-900">
                                    ${item.price.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-200 mt-3 pt-3">
                        <div className="flex justify-between">
                            <span className="font-semibold text-gray-900">Total</span>
                            <span className="font-bold text-lg text-gray-900">
                                ${orderData?.total_amount.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* WhatsApp Button */}
                <div className="space-y-4">
                    <p className="text-center text-gray-600 text-sm">
                        Confirma tu pedido por WhatsApp para coordinar la entrega
                    </p>
                    <a
                        href={`https://wa.me/${process.env.NEXT_PUBLIC_STORE_WHATSAPP}?text=${generateWhatsAppMessage()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Enviar Pedido por WhatsApp
                    </a>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-500 mt-6">
                    Recibirás un email de confirmación de la pasarela de pago
                </p>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}

