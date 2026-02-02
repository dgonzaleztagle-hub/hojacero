"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useFoodEngine, FoodEngineConfig, CartItem } from '@/hooks/food-engine/useFoodEngine';

interface FoodEngineContextType {
    cart: CartItem[];
    cartTotal: number;
    cartCount: number;
    isLocalOpen: boolean;
    isSubmitting: boolean;
    addToCart: (item: any) => void;
    updateQuantity: (name: string, delta: number) => void;
    removeFromCart: (name: string) => void;
    clearCart: () => void;
    submitOrder: (customerData: any) => Promise<any>;
    config: FoodEngineConfig;
}

const FoodEngineContext = createContext<FoodEngineContextType | undefined>(undefined);

export function FoodEngineProvider({
    children,
    config
}: {
    children: ReactNode;
    config: FoodEngineConfig;
}) {
    const engine = useFoodEngine(config);

    return (
        <FoodEngineContext.Provider value={{ ...engine, config }}>
            {children}
        </FoodEngineContext.Provider>
    );
}

export function useFood() {
    const context = useContext(FoodEngineContext);
    if (context === undefined) {
        throw new Error('useFood must be used within a FoodEngineProvider');
    }
    return context;
}
