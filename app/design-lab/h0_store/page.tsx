"use client";

import React, { useState } from 'react';
import {
    Plus,
    ShoppingBag,
    Box,
    ChevronRight,
    Sparkles,
    LayoutDashboard,
    RotateCcw,
    ExternalLink,
    Layers
} from 'lucide-react';
import { SetupStep } from '@/components/h0/store/admin/SetupStep';
import { CategoryStep } from '@/components/h0/store/admin/CategoryStep';
import { ProductStep } from '@/components/h0/store/admin/ProductStep';
import { H0StoreGrid } from '@/components/h0/store/StoreGrid';

// --- Tipos ---
interface Attribute {
    id: string;
    label: string;
    type: 'text' | 'select' | 'color' | 'number';
}

interface Category {
    id: string;
    name: string;
    attributes: Attribute[];
}

interface Product {
    id: string;
    name: string;
    categoryId: string;
    price: number;
    image: string;
    attributes: Record<string, string>;
}

export default function H0StoreWorkspace() {
    const [isInitialized, setIsInitialized] = useState(false);

    // Estado Central
    const [shopName, setShopName] = useState('Mi Tienda Premium');
    const [categoryCount, setCategoryCount] = useState(3);
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    const handleSetup = () => {
        const newCategories: Category[] = Array.from({ length: categoryCount }).map((_, i) => ({
            id: `cat-${i}`,
            name: i === 0 ? 'General' : `Sección ${i + 1}`,
            attributes: []
        }));
        setCategories(newCategories);
        setActiveCategoryId(newCategories[0].id);
        setIsInitialized(true);
    };

    const reset = () => {
        setIsInitialized(false);
        setProducts([]);
    };

    const activeCategory = categories.find(c => c.id === activeCategoryId);

    if (!isInitialized) {
        return (
            <div className="min-h-screen bg-[#0a0a0b]">
                <SetupStep
                    shopName={shopName} setShopName={setShopName}
                    categoryCount={categoryCount} setCategoryCount={setCategoryCount}
                    onNext={handleSetup}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f1115] text-[#e2e8f0] flex flex-col font-sans selection:bg-blue-500/30 overflow-hidden">
            {/* 1. Header Pro */}
            <header className="h-16 border-b border-white/5 flex justify-between items-center px-6 bg-[#161920] sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">H0</div>
                        <h1 className="text-sm font-semibold tracking-tight uppercase text-white/90">{shopName}</h1>
                    </div>
                    <div className="h-4 w-px bg-white/10" />
                    <nav className="flex items-center gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 px-3 py-1 rounded-full bg-blue-500/10">Modo Estudio</span>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={reset} className="flex items-center gap-2 px-3 py-1.5 text-xs text-white/40 hover:text-white transition-colors font-medium">
                        <RotateCcw className="w-3.5 h-3.5" /> Reconfigurar
                    </button>
                    <button className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs tracking-wide transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2">
                        Exportar Proyecto <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* 2. Sidebar Pro */}
                <aside className="w-72 border-r border-white/5 bg-[#12141c] flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-white/5">
                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Mapa de Secciones</label>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-1">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategoryId(cat.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${activeCategoryId === cat.id
                                        ? 'bg-blue-500/10 text-blue-100 ring-1 ring-blue-500/20'
                                        : 'text-white/40 hover:bg-white/5 hover:text-white/70'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Box className={`w-4 h-4 ${activeCategoryId === cat.id ? 'text-blue-400' : 'text-current opacity-20'}`} />
                                    <span className="text-[13px] font-semibold tracking-tight truncate max-w-[140px]">
                                        {cat.name}
                                    </span>
                                </div>
                                <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${activeCategoryId === cat.id ? 'opacity-100' : 'opacity-0'}`} />
                            </button>
                        ))}
                    </div>

                    <div className="p-4 bg-white/[0.02] border-t border-white/5">
                        <button className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-white/10 rounded-xl text-white/20 hover:text-white/40 hover:border-white/20 transition-all text-xs font-bold uppercase tracking-widest">
                            <Plus className="w-4 h-4" /> Añadir Sección
                        </button>
                    </div>
                </aside>

                {/* 3. Área de Construcción */}
                <main className="flex-1 overflow-y-auto bg-[#0a0c10] overflow-x-hidden">
                    {activeCategory && (
                        <div className="p-8 xl:p-12 space-y-12 max-w-[1600px] mx-auto">
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                                {/* DISEÑADOR DE ADN */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                                            <Layers className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold tracking-tight">Arquitectura de ADN</h2>
                                            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Sección: {activeCategory.name}</p>
                                        </div>
                                    </div>
                                    <CategoryStep
                                        categoryName={activeCategory.name}
                                        setCategoryName={(name) => {
                                            const newCats = [...categories];
                                            const idx = newCats.findIndex(c => c.id === activeCategoryId);
                                            newCats[idx].name = name;
                                            setCategories(newCats);
                                        }}
                                        attributes={activeCategory.attributes}
                                        setAttributes={(attrs) => {
                                            const newCats = [...categories];
                                            const idx = newCats.findIndex(c => c.id === activeCategoryId);
                                            newCats[idx].attributes = attrs;
                                            setCategories(newCats);
                                        }}
                                        onNext={() => { }}
                                        onBack={() => { }}
                                    />
                                </div>

                                {/* FORJA DE PRODUCTOS */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                            <ShoppingBag className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold tracking-tight">Inyección de Productos</h2>
                                            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Forjado de Items</p>
                                        </div>
                                    </div>
                                    <ProductStep
                                        categoryName={activeCategory.name}
                                        attributes={activeCategory.attributes}
                                        onBack={() => { }}
                                        onFinish={(p) => setProducts([p, ...products])}
                                    />
                                </div>
                            </div>

                            {/* 4. Vista Previa Live */}
                            <div className="pt-24 border-t border-white/5 space-y-8">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-bold tracking-tight">Live Store Canvas</h3>
                                        <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold">Capa de interacción en tiempo real</p>
                                    </div>
                                    <div className="flex items-center gap-3 p-1.5 bg-white/5 rounded-lg border border-white/10">
                                        <button className="px-3 py-1 rounded-md bg-white/10 text-[10px] uppercase font-bold text-white">Vista Completa</button>
                                        <button className="px-3 py-1 rounded-md text-[10px] uppercase font-bold text-white/30 hover:text-white/60">Esquema JSON</button>
                                    </div>
                                </div>

                                <div className="bg-[#12141c] border border-white/5 rounded-[2rem] p-12 shadow-2xl relative overflow-hidden">
                                    <H0StoreGrid products={products} title={shopName} />
                                    {products.length === 0 && (
                                        <div className="py-24 text-center">
                                            <LayoutDashboard className="w-12 h-12 text-white/5 mx-auto mb-4" />
                                            <p className="text-[11px] uppercase font-bold tracking-[0.5em] text-white/10">Esperando inyección de productos</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* 5. Status Bar Minimalista */}
            <footer className="h-8 border-t border-white/5 flex items-center px-6 bg-[#0a0c10] justify-between text-[10px] font-medium text-white/20">
                <div className="flex items-center gap-4">
                    <span>© 2026 HOJACERO STUDIO</span>
                    <div className="h-3 w-px bg-white/5" />
                    <span>MOTOR VIBE AGNOSTIC V2.3</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500" /> API: LISTA</span>
                    <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-emerald-500" /> SYNC: ACTIVA</span>
                </div>
            </footer>
        </div>
    );
}
