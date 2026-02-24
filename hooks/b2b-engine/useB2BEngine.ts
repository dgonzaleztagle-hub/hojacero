'use client';

import { useState, useEffect } from 'react';

export interface B2BVariant {
    id: string;
    label: string; // e.g., "14mm - A2" or "98mm Open System"
    priceModifier: number; // How much it adds/subtracts from base price
}

export interface B2BProduct {
    id: string;
    name: string;
    basePrice: number;
    category: string;
    description?: string;
    specs?: { label: string; value: string }[];
    variants?: {
        groupName: string; // e.g., "Grosor", "Color"
        options: B2BVariant[];
    }[];
}

export interface B2BCartItem extends B2BProduct {
    cartItemId: string; // Unique ID for the cart instance (product + specific variants)
    quantity: number;
    selectedVariants: Record<string, B2BVariant>; // groupName -> selected variant
    finalUnitPrice: number;
}

export function useB2BEngine(storeId: string = 'cam_solutions_b2b') {
    const [cart, setCart] = useState<B2BCartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Persistencia en LocalStorage
    useEffect(() => {
        const savedCart = localStorage.getItem(`${storeId}_cart`);
        if (savedCart) {
            try { setCart(JSON.parse(savedCart)); } catch (e) { console.error(e); }
        }
    }, [storeId]);

    useEffect(() => {
        localStorage.setItem(`${storeId}_cart`, JSON.stringify(cart));
    }, [cart, storeId]);

    const addToCart = (product: B2BProduct, selectedVariants: Record<string, B2BVariant> = {}, quantity: number = 1) => {
        // Calculate final price based on base price + variant modifiers
        const variantsModifier = Object.values(selectedVariants).reduce((sum, v) => sum + (v.priceModifier || 0), 0);
        const finalUnitPrice = product.basePrice + variantsModifier;

        // Generate a unique ID based on the product and its selected variants (so same product with different colors don't stack)
        const variantHash = Object.values(selectedVariants).map(v => v.id).sort().join('-');
        const cartItemId = `${product.id}-${variantHash}`;

        setCart(prev => {
            const existing = prev.find(i => i.cartItemId === cartItemId);
            if (existing) {
                return prev.map(i => i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + quantity } : i);
            }
            return [...prev, { ...product, cartItemId, quantity, selectedVariants, finalUnitPrice }];
        });

        setIsCartOpen(true);
    };

    const updateQuantity = (cartItemId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.cartItemId === cartItemId) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const removeFromCart = (cartItemId: string) => {
        setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((sum, item) => sum + (item.finalUnitPrice * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // B2B specific: Submit to WhatsApp format
    const generateWhatsAppOrder = (phone: string, companyName: string) => {
        if (cart.length === 0) return;

        let txt = `*NUEVO PEDIDO B2B - CAM SOLUTIONS*%0A`;
        txt += `Laboratorio/Clínica: ${companyName}%0A`;
        txt += `------------------------%0A`;

        cart.forEach(item => {
            txt += `▪ ${item.quantity}x ${item.name}%0A`;

            // Add variant info like Color / Size
            Object.entries(item.selectedVariants).forEach(([group, variant]) => {
                txt += `  └ ${group}: ${variant.label}%0A`;
            });

            txt += `  💰 Unitario: $${item.finalUnitPrice.toLocaleString('es-CL')}%0A`;
        });

        txt += `------------------------%0A`;
        txt += `*TOTAL ESTIMADO: $${cartTotal.toLocaleString('es-CL')}*%0A%0A`;
        txt += `_Por favor confirmar stock y disponibilidad de despacho por Chilexpress._`;

        window.open(`https://wa.me/${phone}?text=${txt}`, '_blank');
        clearCart();
        setIsCartOpen(false);
    };

    return {
        cart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        generateWhatsAppOrder
    };
}
