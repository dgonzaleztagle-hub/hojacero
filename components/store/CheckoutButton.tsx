'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface CheckoutButtonProps {
    cart: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
    }>;
    total: number;
    onSuccess?: () => void;
}

export default function CheckoutButton({ cart, total, onSuccess }: CheckoutButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);

        try {
            // Llamar al API para crear el pago
            const response = await fetch('/api/store/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cart,
                    total,
                    clientData: {
                        name: 'Cliente', // Esto debería venir de un formulario
                        email: 'cliente@ejemplo.cl',
                        phone: '+56912345678'
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Error al crear pago');
            }

            const data = await response.json();

            // Redirigir al checkout de la pasarela
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                throw new Error('No se recibió URL de checkout');
            }

            onSuccess?.();
        } catch (error) {
            console.error('Error in checkout:', error);
            alert('Error al procesar pago. Intenta nuevamente.');
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            disabled={loading || cart.length === 0}
            className="w-full flex items-center justify-center gap-2 py-4 sm:py-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 text-white rounded-xl font-bold text-base sm:text-lg transition-all shadow-lg active:scale-95"
        >
            {loading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Procesando...
                </>
            ) : (
                <>
                    <Send className="w-5 h-5" />
                    Pagar con Tarjeta
                </>
            )}
        </button>
    );
}
