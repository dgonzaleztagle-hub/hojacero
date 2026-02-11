import React from 'react';
import { ShoppingBag, Star, ArrowUpRight } from 'lucide-react';

interface StoreCardProps {
    product: {
        name: string;
        description: string;
        price: number;
        images: string[];
        is_featured?: boolean;
        attributes?: Record<string, any>;
    };
    vibe?: 'nebula' | 'minimal' | 'industrial';
}

export const H0StoreCard: React.FC<StoreCardProps> = ({ product, vibe = 'nebula' }) => {
    return (
        <div className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-4 transition-all duration-700 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_50px_rgba(139,92,246,0.15)]">
            {/* Background Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Product Image Container */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-900/50 flex items-center justify-center">
                <img
                    src={product.images[0] || '/placeholder-product.webp'}
                    alt={product.name}
                    className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
                />

                {/* Floating Badges */}
                {product.is_featured && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white text-black text-[10px] font-bold tracking-tighter uppercase rounded-full">
                        Featured
                    </div>
                )}

                {/* Quick Action Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <button className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <ShoppingBag className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Info Section */}
            <div className="mt-6 space-y-2 relative z-10">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-medium text-white/90 tracking-tight group-hover:text-white transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-lg font-bold text-white/80">
                        ${product.price.toLocaleString('es-CL')}
                    </p>
                </div>

                <p className="text-sm text-white/40 line-clamp-2 leading-relaxed">
                    {product.description}
                </p>

                {/* Dynamic Attributes Preview */}
                <div className="flex gap-2 pt-2">
                    {product.attributes && Object.entries(product.attributes).map(([key, value]) => (
                        <span key={key} className="text-[10px] uppercase tracking-widest text-white/30 border border-white/10 px-2 py-0.5 rounded-sm">
                            {key}: {value}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};
