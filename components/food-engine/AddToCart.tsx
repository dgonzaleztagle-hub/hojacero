"use client";

import React from 'react';
import { useFood } from './FoodEngineProvider';

interface AddToCartProps {
    item: {
        name: string;
        price: number;
        desc?: string;
        category: string;
    };
    children: React.ReactNode;
    className?: string;
    disabledClassName?: string;
}

export default function AddToCart({
    item,
    children,
    className = "",
    disabledClassName = "opacity-50 cursor-not-allowed grayscale"
}: AddToCartProps) {
    const { addToCart, isLocalOpen } = useFood();

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isLocalOpen) {
            addToCart(item);
        }
    };

    return (
        <button
            onClick={handleAdd}
            disabled={!isLocalOpen}
            className={`${className} ${!isLocalOpen ? disabledClassName : ""}`}
        >
            {children}
        </button>
    );
}
