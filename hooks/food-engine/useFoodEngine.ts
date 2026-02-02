"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export interface MenuItem {
    name: string;
    price: number;
    desc?: string;
    category: string;
}

export interface CartItem extends MenuItem {
    quantity: number;
}

export interface FoodEngineConfig {
    dbPrefix: string;
    whatsapp: string;
    clientName: string;
}

export function useFoodEngine(config: FoodEngineConfig) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLocalOpen, setIsLocalOpen] = useState(false);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const supabase = createClient();

    // Persistencia básica en LocalStorage
    useEffect(() => {
        const savedCart = localStorage.getItem(`${config.dbPrefix}cart`);
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Error parsing saved cart", e);
            }
        }
    }, [config.dbPrefix]);

    useEffect(() => {
        localStorage.setItem(`${config.dbPrefix}cart`, JSON.stringify(cart));
    }, [cart, config.dbPrefix]);

    // Check if local is open (active session)
    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase
                .from(`${config.dbPrefix}sessions`)
                .select('id')
                .eq('status', 'open')
                .maybeSingle();

            setIsLocalOpen(!!data);
            setActiveSessionId(data?.id || null);
        };

        checkSession();

        const channel = supabase.channel(`${config.dbPrefix}_session_sync`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: `${config.dbPrefix}sessions`
            }, () => checkSession())
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [config.dbPrefix, supabase]);

    const addToCart = (item: MenuItem) => {
        if (!isLocalOpen) return;
        setCart(prev => {
            const existing = prev.find(i => i.name === item.name);
            if (existing) {
                return prev.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1, category: item.category || 'general' }];
        });
    };

    const updateQuantity = (name: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.name === name) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const removeFromCart = (name: string) => {
        setCart(prev => prev.filter(item => item.name !== name));
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((sum: number, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((sum: number, item) => sum + item.quantity, 0);

    const submitOrder = async (customerData: {
        name: string;
        whatsapp: string;
        deliveryType: 'local' | 'llevar' | 'mesa';
        tableNumber?: string;
    }) => {
        if (isSubmitting || cart.length === 0) return null;
        setIsSubmitting(true);

        try {
            const orderCode = `${config.dbPrefix.slice(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

            const { data: order, error: orderError } = await supabase
                .from(`${config.dbPrefix}orders`)
                .insert({
                    client_name: customerData.name,
                    client_whatsapp: customerData.whatsapp,
                    delivery_type: customerData.deliveryType,
                    table_number: customerData.deliveryType === 'mesa' ? customerData.tableNumber : null,
                    total_amount: cartTotal,
                    order_code: orderCode,
                    status: 'pendiente',
                    session_id: activeSessionId
                })
                .select()
                .single();

            if (orderError) throw orderError;

            const orderItems = cart.map(item => ({
                order_id: order.id,
                product_name: item.name,
                quantity: item.quantity,
                unit_price: item.price
            }));

            const { error: itemsError } = await supabase
                .from(`${config.dbPrefix}order_items`)
                .insert(orderItems);

            if (itemsError) throw itemsError;

            return { orderCode, order };
        } catch (err) {
            console.error("Error submitting order:", err);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        cart,
        cartTotal,
        cartCount,
        isLocalOpen,
        isSubmitting,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        submitOrder
    };
}
