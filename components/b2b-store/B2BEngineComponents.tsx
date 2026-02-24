'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useB2BEngine, B2BProduct, B2BVariant } from '@/hooks/b2b-engine/useB2BEngine';

// --- MODAL DE PRODUCTO (CAPA DE ESPECIALIZACIÓN B2B) ---

interface B2BProductModalProps {
    product: B2BProduct;
    isOpen: boolean;
    onClose: () => void;
}

export const B2BProductModal = ({ product, isOpen, onClose }: B2BProductModalProps) => {
    const { addToCart } = useB2BEngine();

    // Estado local para variantes seleccionadas
    const [selectedVariants, setSelectedVariants] = useState<Record<string, B2BVariant>>(() => {
        const initial: Record<string, B2BVariant> = {};
        if (product.variants) {
            product.variants.forEach(group => {
                if (group.options.length > 0) {
                    initial[group.groupName] = group.options[0]; // Seleccionar la primera por defecto
                }
            });
        }
        return initial;
    });

    const [quantity, setQuantity] = useState(1);

    const handleVariantChange = (groupName: string, variant: B2BVariant) => {
        setSelectedVariants(prev => ({ ...prev, [groupName]: variant }));
    };

    const handleAddToCart = () => {
        addToCart(product, selectedVariants, quantity);
        onClose();
        // Reset state for next time
        setQuantity(1);
    };

    // Calcular precio final dinámico en el modal
    const variantsModifier = Object.values(selectedVariants).reduce((sum, v) => sum + (v.priceModifier || 0), 0);
    const finalPrice = product.basePrice + variantsModifier;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-[#0c1222]/90 backdrop-blur-md flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: 50, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 20, opacity: 0, scale: 0.95 }}
                        className="bg-[#0f172a] border border-cyan-500/20 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Cabecera del Modal */}
                        <div className="p-8 border-b border-white/5 relative bg-gradient-to-r from-[#0f172a] to-[#1e293b]">
                            <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white bg-white/5 p-2 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                            <span className="px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] uppercase font-bold tracking-widest block w-fit mb-4">
                                {product.category}
                            </span>
                            <h2 className="text-3xl font-black text-white tracking-tight uppercase mb-2">{product.name}</h2>
                            <p className="text-slate-400 font-sans text-sm">Configuración Técnica del Insumo</p>
                        </div>

                        {/* Cuerpo Desplazable */}
                        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">

                            {/* Especificaciones Técnicas (La "Ingeniería") */}
                            {product.specs && (
                                <div className="bg-[#0c1222] rounded-2xl p-6 border border-white/5">
                                    <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">Ficha Técnica</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {product.specs.map(spec => (
                                            <div key={spec.label}>
                                                <span className="text-slate-500 text-[10px] uppercase tracking-widest block">{spec.label}</span>
                                                <span className="text-white font-bold">{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Variantes B2B (Grosores, Colores) */}
                            {product.variants?.map(group => (
                                <div key={group.groupName}>
                                    <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">{group.groupName}</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {group.options.map(variant => {
                                            const isSelected = selectedVariants[group.groupName]?.id === variant.id;
                                            return (
                                                <button
                                                    key={variant.id}
                                                    onClick={() => handleVariantChange(group.groupName, variant)}
                                                    className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all flex items-center gap-2 ${isSelected
                                                            ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                                                            : 'bg-[#0f172a] border-white/10 text-slate-400 hover:border-white/30'
                                                        }`}
                                                >
                                                    {variant.label}
                                                    {variant.priceModifier > 0 && <span className="text-[10px] opacity-70">(+${variant.priceModifier.toLocaleString()})</span>}
                                                    {variant.priceModifier < 0 && <span className="text-[10px] opacity-70">(-${Math.abs(variant.priceModifier).toLocaleString()})</span>}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}

                            {/* Selector de Cantidad B2B */}
                            <div>
                                <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">Volumen (Unidades)</h4>
                                <div className="flex items-center gap-4 bg-[#0c1222] w-fit p-2 rounded-xl border border-white/5">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"><Minus size={16} /></button>
                                    <span className="w-12 text-center text-xl font-bold text-white">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="p-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-colors"><Plus size={16} /></button>
                                </div>
                            </div>

                        </div>

                        {/* Footer - Checkout Action */}
                        <div className="p-8 border-t border-white/5 bg-[#0c1222] flex items-center justify-between">
                            <div>
                                <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold block mb-1">Precio Unitario Calculado</span>
                                <span className="text-3xl font-black text-white">${finalPrice.toLocaleString('es-CL')}</span>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="bg-cyan-500 text-[#0f172a] px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm flex items-center gap-3 hover:bg-cyan-400 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                            >
                                <ShoppingCart size={18} /> Agregar
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


// --- CARRITO LATERAL B2B (EL CHECKOUT) ---

export const B2BSideCart = () => {
    const { cart, cartTotal, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, generateWhatsAppOrder } = useB2BEngine();
    const [companyName, setCompanyName] = useState("");

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-[#0c1222]/80 backdrop-blur-sm z-[90]"
                    />

                    {/* Panel Del Carrito */}
                    <motion.div
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 w-full md:w-[450px] bg-[#0f172a] border-l border-white/5 z-[100] shadow-2xl flex flex-col"
                    >
                        {/* Cabecera */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-l from-[#0c1222] to-transparent">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tighter uppercase">
                                <ShoppingCart className="text-cyan-500" /> Mi Pedido B2B
                            </h2>
                            <button onClick={() => setIsCartOpen(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Lista de Ítems */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {cart.length === 0 ? (
                                <div className="text-center text-slate-500 mt-20 flex flex-col items-center">
                                    <Box size={48} className="opacity-20 mb-4" />
                                    <p className="font-bold text-lg">No hay insumos en el pedido.</p>
                                    <p className="text-sm mt-2 opacity-70">Agrega productos desde el catálogo técnico.</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.cartItemId} className="bg-[#0c1222] rounded-2xl p-4 border border-white/5 relative group">
                                        <button
                                            onClick={() => removeFromCart(item.cartItemId)}
                                            className="absolute -top-3 -right-3 p-2 bg-red-500/10 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                                        >
                                            <Trash2 size={14} />
                                        </button>

                                        <div className="mb-3">
                                            <span className="text-[9px] uppercase tracking-widest text-cyan-500 font-bold">{item.category}</span>
                                            <h4 className="text-white font-bold leading-tight">{item.name}</h4>

                                            {/* Render Variants */}
                                            {Object.entries(item.selectedVariants).map(([group, variant]) => (
                                                <div key={group} className="text-xs text-slate-400 mt-1">
                                                    <span className="opacity-60">{group}:</span> {variant.label}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-3">
                                            <span className="font-black text-cyan-400 text-lg">${item.finalUnitPrice.toLocaleString('es-CL')}</span>
                                            <div className="flex items-center gap-3 bg-[#0f172a] rounded-lg p-1">
                                                <button onClick={() => updateQuantity(item.cartItemId, -1)} className="p-1 hover:bg-white/10 rounded text-slate-400"><Minus size={14} /></button>
                                                <span className="text-sm font-bold text-white w-6 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.cartItemId, 1)} className="p-1 hover:bg-white/10 rounded text-slate-400"><Plus size={14} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Checkout */}
                        {cart.length > 0 && (
                            <div className="p-6 bg-[#0c1222] border-t border-white/5">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Neto Estimado</span>
                                    <span className="text-3xl font-black text-white">${cartTotal.toLocaleString('es-CL')}</span>
                                </div>

                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="Nombre Clínica o Laboratorio"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                </div>

                                <button
                                    onClick={() => generateWhatsAppOrder("56912345678", companyName || "Laboratorio B2B")}
                                    className="w-full bg-cyan-500 text-[#0f172a] py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                                >
                                    Solicitar Cotización Formal
                                </button>
                                <p className="text-[10px] text-center text-slate-500 mt-4 uppercase tracking-widest font-bold">
                                    Sujeto a confirmación de stock y facturación por ejecutivo.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// Simple Box Icon fallback if not exported above
const Box = ({ size, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
)
