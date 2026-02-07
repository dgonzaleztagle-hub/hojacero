'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SectionContainerProps {
    children: ReactNode;
    id?: string;
    className?: string;
}

export function SectionContainer({ children, id, className = '' }: SectionContainerProps) {
    return (
        <section
            id={id}
            className={`
                min-h-screen
                flex items-center justify-center
                px-6 py-20
                ${className}
            `}
        >
            <div className="max-w-6xl w-full">
                {children}
            </div>
        </section>
    );
}
