import React from 'react';
import { H0StoreCard } from './StoreCard';

interface StoreGridProps {
    products: any[];
    title?: string;
}

export const H0StoreGrid: React.FC<StoreGridProps> = ({ products, title = "New Arrivals" }) => {
    return (
        <section className="py-24 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                <div className="space-y-4">
                    <span className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase">
                        H0 Store Engine
                    </span>
                    <h2 className="text-5xl md:text-7xl font-light tracking-tighter text-white">
                        {title}
                    </h2>
                </div>
                <p className="text-white/40 max-w-sm text-right text-sm leading-relaxed">
                    Curated pieces selected with architectural precision. <br />
                    Injected with HojaCero Zen DNA.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, idx) => (
                    <div
                        key={product.id || idx}
                        className="reveal-stagger"
                        style={{ '--delay': `${idx * 0.1}s` } as React.CSSProperties}
                    >
                        <H0StoreCard product={product} />
                    </div>
                ))}
            </div>
        </section>
    );
};
