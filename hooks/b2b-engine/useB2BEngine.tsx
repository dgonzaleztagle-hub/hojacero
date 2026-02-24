'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';

export interface B2BVariant {
    id: string;
    label: string;
    priceModifier: number;
}

export interface B2BProduct {
    id: string;
    name: string;
    basePrice: number;
    category: string;
    description?: string;
    specs?: { label: string; value: string }[];
    variants?: {
        groupName: string;
        options: B2BVariant[];
    }[];
}

export interface B2BCartItem extends B2BProduct {
    cartItemId: string;
    quantity: number;
    selectedVariants: Record<string, B2BVariant>;
    finalUnitPrice: number;
}

interface B2BEngineContextType {
    cart: B2BCartItem[];
    cartTotal: number;
    cartCount: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    addToCart: (product: B2BProduct, selectedVariants?: Record<string, B2BVariant>, quantity?: number) => void;
    updateQuantity: (cartItemId: string, delta: number) => void;
    removeFromCart: (cartItemId: string) => void;
    clearCart: () => void;
    generateWhatsAppOrder: (phone: string, companyName: string) => void;
}

const B2BEngineContext = createContext<B2BEngineContextType | undefined>(undefined);

export const B2BEngineProvider = ({ children, storeId = 'cam_solutions_b2b' }: { children: React.ReactNode, storeId?: string }) => {
    const [cart, setCart] = useState<B2BCartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Persistencia en LocalStorage
    useEffect(() => {
        const savedCart = localStorage.getItem(`${storeId}_cart`);
        if (savedCart) {
            try { setCart(JSON.parse(savedCart)); } catch (e) { console.error(e); }
        }
        setIsLoaded(true);
    }, [storeId]);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(`${storeId}_cart`, JSON.stringify(cart));
        }
    }, [cart, storeId, isLoaded]);

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

    return (
        <B2BEngineContext.Provider value={{
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
        }}>
            {children}
        </B2BEngineContext.Provider>
    );
};

export const useB2BEngine = () => {
    const context = useContext(B2BEngineContext);
    if (!context) {
        throw new Error('useB2BEngine must be used within a B2BEngineProvider');
    }
    return context;
};
