"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingCart, X, Send, Tag, Package, Star, Eye, TrendingUp, Truck, Shield, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBadgeStyle, type BadgeStylePreset } from '@/lib/store/badge-styles';
import { createClient } from '@/utils/supabase/client';

// Mock data (en producción vendría de Supabase)
const MOCK_PRODUCTS = [
    {
        id: '1',
        name: 'Anillo Oro Clásico',
        category: 'Anillos',
        price: 150000,
        stock: 3, // Stock bajo
        highlight1: { label: 'Material', value: 'Oro 18k' },
        highlight2: { label: 'Talla', value: '8' },
        description: 'Elegante anillo de oro de 18 quilates con acabado pulido.',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
        rating_avg: 4.8,
        rating_count: 127,
        sales_count: 45 // Bestseller
    },
    {
        id: '2',
        name: 'Collar Plata Elegante',
        category: 'Collares',
        price: 80000,
        stock: 12,
        highlight1: { label: 'Material', value: 'Plata 925' },
        highlight2: { label: 'Largo', value: '45cm' },
        description: 'Collar de plata 925 con diseño minimalista.',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
        rating_avg: 4.5,
        rating_count: 89,
        sales_count: 8
    },
    {
        id: '3',
        name: 'Aros Diamante',
        category: 'Aros',
        price: 200000,
        stock: 2, // Stock muy bajo
        highlight1: { label: 'Material', value: 'Oro Blanco' },
        highlight2: { label: 'Quilates', value: '0.5ct' },
        description: 'Aros de oro blanco con diamantes naturales.',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
        rating_avg: 5.0,
        rating_count: 203,
        sales_count: 67 // Bestseller
    },
    {
        id: '4',
        name: 'Anillo Compromiso',
        category: 'Anillos',
        price: 350000,
        stock: 8,
        highlight1: { label: 'Material', value: 'Platino' },
        highlight2: { label: 'Diamante', value: '1ct' },
        description: 'Anillo de compromiso en platino con diamante central.',
        image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800',
        rating_avg: 4.9,
        rating_count: 156,
        sales_count: 34 // Bestseller
    },
    {
        id: '5',
        name: 'Pulsera Plata',
        category: 'Pulseras',
        price: 65000,
        stock: 15,
        highlight1: { label: 'Material', value: 'Plata 925' },
        highlight2: { label: 'Largo', value: '18cm' },
        description: 'Pulsera de eslabones en plata 925.',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
        rating_avg: 4.3,
        rating_count: 67,
        sales_count: 5
    },
    {
        id: '6',
        name: 'Collar Perlas',
        category: 'Collares',
        price: 120000,
        stock: 4,
        highlight1: { label: 'Material', value: 'Perlas Cultivadas' },
        highlight2: { label: 'Largo', value: '50cm' },
        description: 'Collar de perlas cultivadas con broche de plata.',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
        rating_avg: 4.7,
        rating_count: 92,
        sales_count: 12 // Bestseller
    }
];

const CATEGORIES = ['Todos', 'Anillos', 'Collares', 'Aros', 'Pulseras'];

// Mock conversion settings (en producción vendría de Supabase)
const CONVERSION_SETTINGS = {
    badge_style_preset: 'premium-light' as BadgeStylePreset, // Cambia esto para probar diferentes estilos
    show_low_stock: true,
    low_stock_threshold: 5,
    show_viewers_count: true,
    simulated_viewers_min: 2,
    simulated_viewers_max: 8,
    show_ratings: true,
    bestseller_threshold: 10,
    show_bestseller_badge: true,
    exit_popup_enabled: true,
    exit_discount_pct: 10,
    exit_code: 'PRIMERACOMPRA',
    exit_message: '¡Espera! No te vayas sin tu descuento',
    cart_cta_enabled: true,
    cart_cta_interval: 60,
    cart_cta_message: '¡No olvides tu pedido! 🛒',
    free_shipping_threshold: 50000,
    show_shipping_progress: true,
    trust_bar_enabled: true,
    return_days: 30,
    show_secure_payment: true
};

interface CartItem {
    product: typeof MOCK_PRODUCTS[0];
    quantity: number;
}

export default function TiendaPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [showCartCTA, setShowCartCTA] = useState(false);
    const [showExitPopup, setShowExitPopup] = useState(false);
    const [showAddedFeedback, setShowAddedFeedback] = useState(false);

    // Obtener estilos del preset
    const badgeStyle = getBadgeStyle(CONVERSION_SETTINGS.badge_style_preset);

    // Animación CTA del carrito
    useEffect(() => {
        if (cart.length > 0 && CONVERSION_SETTINGS.cart_cta_enabled) {
            const interval = setInterval(() => {
                setShowCartCTA(true);
                setTimeout(() => setShowCartCTA(false), 5000);
            }, CONVERSION_SETTINGS.cart_cta_interval * 1000);

            return () => clearInterval(interval);
        }
    }, [cart.length]);

    // Exit-intent popup
    useEffect(() => {
        if (!CONVERSION_SETTINGS.exit_popup_enabled || cart.length === 0) return;

        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !showExitPopup) {
                setShowExitPopup(true);
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [cart.length, showExitPopup]);

    const addToCart = (product: typeof MOCK_PRODUCTS[0]) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
        setIsCartOpen(true);
        setShowAddedFeedback(true);
        setTimeout(() => setShowAddedFeedback(false), 2000);
    };

    const removeFromCart = (productId: string) => {
        setCart((prev) => prev.filter((item) => item.product.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity === 0) {
            removeFromCart(productId);
            return;
        }
        setCart((prev) =>
            prev.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const total = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const filteredProducts =
        selectedCategory === 'Todos'
            ? MOCK_PRODUCTS
            : MOCK_PRODUCTS.filter((p) => p.category === selectedCategory);

    const handleCheckout = async () => {
        try {
            // Crear orden en BD primero
            const supabase = createClient();

            const { data: order, error: orderError } = await supabase
                .from('h0_store_orders')
                .insert({
                    total_amount: total,
                    payment_status: 'pending',
                    payment_method: 'whatsapp',
                    client_data: { name: 'Cliente WhatsApp' }, // Se actualizará cuando el vendedor procese
                    delivery_status: 'pending'
                })
                .select()
                .single();

            if (orderError || !order) {
                console.error('Error creating order:', orderError);
                alert('Error al crear pedido. Intenta nuevamente.');
                return;
            }

            // Insertar items del pedido
            const orderItems = cart.map((item) => ({
                order_id: order.id,
                product_id: item.product.id,
                product_name: item.product.name,
                quantity: item.quantity,
                price: item.product.price
            }));

            await supabase
                .from('h0_store_order_items')
                .insert(orderItems);

            // Generar mensaje con número de pedido
            const orderNumber = order.id.slice(0, 8).toUpperCase();
            const message = `¡Hola! Quiero hacer un pedido:\n\n📋 *Pedido #${orderNumber}*\n\n🛒 *Carrito:*\n${cart
                .map(
                    (item) =>
                        `• ${item.product.name} (x${item.quantity}) - $${(
                            item.product.price * item.quantity
                        ).toLocaleString('es-CL')}\n  ${item.product.highlight1.label}: ${item.product.highlight1.value
                        } | ${item.product.highlight2.label}: ${item.product.highlight2.value}`
                )
                .join('\n\n')}\n\n💰 *Total:* $${total.toLocaleString('es-CL')}`;

            const whatsappUrl = `https://wa.me/56912345678?text=${encodeURIComponent(
                message
            )}`;
            window.open(whatsappUrl, '_blank');

            // Limpiar carrito después de enviar
            setCart([]);
            setIsCartOpen(false);
        } catch (error) {
            console.error('Error in checkout:', error);
            alert('Error al procesar pedido. Intenta nuevamente.');
        }
    };

    const getRandomViewers = () => {
        return Math.floor(
            Math.random() * (CONVERSION_SETTINGS.simulated_viewers_max - CONVERSION_SETTINGS.simulated_viewers_min + 1) +
            CONVERSION_SETTINGS.simulated_viewers_min
        );
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Trust Bar Sticky */}
            {CONVERSION_SETTINGS.trust_bar_enabled && (
                <div className={`${badgeStyle.trustBar.bg} ${badgeStyle.trustBar.text} py-2 sticky top-0 z-50`}>
                    <div className="max-w-7xl mx-auto px-4 flex justify-center items-center gap-8 text-xs">
                        <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4" />
                            <span>Envío gratis sobre ${CONVERSION_SETTINGS.free_shipping_threshold.toLocaleString('es-CL')}</span>
                        </div>
                        {CONVERSION_SETTINGS.show_secure_payment && (
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                <span>Pago 100% Seguro</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <RotateCcw className="w-4 h-4" />
                            <span>Devolución en {CONVERSION_SETTINGS.return_days} días</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="border-b border-gray-200 bg-white z-40 sticky top-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Joyería Obsidian</h1>
                            <p className="text-sm text-gray-500 mt-1">Elegancia atemporal</p>
                        </div>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <ShoppingCart className="w-6 h-6 text-gray-700" />
                            {cart.length > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
                                >
                                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                                </motion.span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Category Filters */}
            <div className="border-b border-gray-200 bg-gray-50 sticky top-[120px] z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-2 py-4 overflow-x-auto">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${selectedCategory === cat
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={addToCart}
                            settings={CONVERSION_SETTINGS}
                            viewersCount={getRandomViewers()}
                        />
                    ))}
                </div>
            </div>

            {/* Cart Sidebar */}
            {isCartOpen && (
                <CartSidebar
                    cart={cart}
                    total={total}
                    onClose={() => setIsCartOpen(false)}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                    onCheckout={handleCheckout}
                    showCTA={showCartCTA}
                    settings={CONVERSION_SETTINGS}
                />
            )}

            {/* Exit-Intent Popup */}
            <AnimatePresence>
                {showExitPopup && (
                    <ExitPopup
                        onClose={() => setShowExitPopup(false)}
                        settings={CONVERSION_SETTINGS}
                    />
                )}
            </AnimatePresence>

            {/* Added to Cart Feedback */}
            <AnimatePresence>
                {showAddedFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        ✅ Agregado al carrito
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Product Card Component
function ProductCard({
    product,
    onAddToCart,
    settings,
    viewersCount
}: {
    product: typeof MOCK_PRODUCTS[0];
    onAddToCart: (p: typeof MOCK_PRODUCTS[0]) => void;
    settings: typeof CONVERSION_SETTINGS;
    viewersCount: number;
}) {
    const [showStickyButton, setShowStickyButton] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const isLowStock = settings.show_low_stock && product.stock <= settings.low_stock_threshold;
    const isBestseller = settings.show_bestseller_badge && product.sales_count >= settings.bestseller_threshold;

    // Obtener estilos del preset
    const badgeStyle = getBadgeStyle(settings.badge_style_preset);

    // Detectar si estamos en el cliente
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Detectar scroll para mostrar sticky button en mobile
    useEffect(() => {
        if (!isMounted) return;

        const handleScroll = () => {
            const scrolled = window.scrollY > 100;
            setShowStickyButton(scrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMounted]);

    return (
        <>
            <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 relative"
            >
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {isBestseller && (
                        <span className={`inline-flex items-center gap-1 px-3 py-1.5 ${badgeStyle.bestseller.bg} ${badgeStyle.bestseller.text} rounded-full text-xs font-bold shadow-lg`}>
                            <TrendingUp className={`w-3.5 h-3.5 ${badgeStyle.bestseller.icon}`} />
                            {badgeStyle.bestseller.label}
                        </span>
                    )}
                    {isLowStock && (
                        <span className={`inline-flex items-center gap-1 px-3 py-1.5 ${badgeStyle.lowStock.bg} ${badgeStyle.lowStock.text} rounded-full text-xs font-bold shadow-lg ${badgeStyle.lowStock.animate ? 'animate-pulse' : ''}`}>
                            {badgeStyle.lowStock.labelPrefix} {product.stock}
                        </span>
                    )}
                </div>

                {/* Imagen con lazy loading */}
                <div className="aspect-square overflow-hidden bg-gray-100 relative">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                </div>

                <div className="p-4 sm:p-6">
                    {/* Rating */}
                    {settings.show_ratings && (
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < Math.floor(product.rating_avg)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-gray-500">({product.rating_count})</span>
                        </div>
                    )}

                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                    </h3>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                            <Tag className="w-3 h-3" />
                            {product.highlight1.value}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                            <Package className="w-3 h-3" />
                            {product.highlight2.value}
                        </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                    </p>

                    {/* Viewers Count */}
                    {settings.show_viewers_count && (
                        <div className={`flex items-center gap-1 text-xs ${badgeStyle.viewers.text} mb-3`}>
                            <Eye className={`w-3 h-3 ${badgeStyle.viewers.icon}`} />
                            <span>{viewersCount} personas viendo esto</span>
                        </div>
                    )}

                    {/* Desktop: Precio + Botón inline */}
                    <div className="hidden sm:flex justify-between items-center">
                        <span className="text-xl sm:text-2xl font-bold text-gray-900">
                            ${product.price.toLocaleString('es-CL')}
                        </span>
                        <button
                            onClick={() => onAddToCart(product)}
                            className="px-4 sm:px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm active:scale-95"
                        >
                            Agregar
                        </button>
                    </div>

                    {/* Mobile: Solo precio (botón sticky abajo) */}
                    <div className="sm:hidden">
                        <span className="text-2xl font-bold text-gray-900">
                            ${product.price.toLocaleString('es-CL')}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Sticky Add to Cart Button (Mobile Only) */}
            <AnimatePresence>
                {isMounted && showStickyButton && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-2xl z-40"
                    >
                        <button
                            onClick={() => onAddToCart(product)}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-bold text-base shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Agregar - ${product.price.toLocaleString('es-CL')}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// Cart Sidebar Component
function CartSidebar({
    cart,
    total,
    onClose,
    onUpdateQuantity,
    onRemove,
    onCheckout,
    showCTA,
    settings
}: {
    cart: CartItem[];
    total: number;
    onClose: () => void;
    onUpdateQuantity: (id: string, qty: number) => void;
    onRemove: (id: string) => void;
    onCheckout: () => void;
    showCTA: boolean;
    settings: typeof CONVERSION_SETTINGS;
}) {
    const shippingProgress = settings.show_shipping_progress
        ? Math.min((total / settings.free_shipping_threshold) * 100, 100)
        : 0;
    const remaining = settings.free_shipping_threshold - total;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
            <div className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white shadow-2xl z-50 flex flex-col">
                <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Tu Carrito</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                    </button>
                </div>

                {showCTA && cart.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 sm:p-4"
                    >
                        <p className="text-center text-sm sm:text-base font-bold animate-pulse">
                            {settings.cart_cta_message}
                        </p>
                    </motion.div>
                )}

                {settings.show_shipping_progress && cart.length > 0 && (
                    <div className="p-3 sm:p-4 bg-blue-50 border-b border-blue-100">
                        <div className="flex justify-between text-xs sm:text-sm mb-2">
                            <span className="font-medium text-blue-900">
                                {remaining > 0
                                    ? `Faltan $${remaining.toLocaleString('es-CL')} para envío gratis`
                                    : '¡Envío gratis! 🎉'}
                            </span>
                            <span className="text-blue-600 font-bold">{Math.round(shippingProgress)}%</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${shippingProgress}%` }}
                                className="bg-blue-600 h-2 rounded-full"
                            />
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {cart.length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-sm sm:text-base text-gray-500 font-medium">Tu carrito está vacío</p>
                        </div>
                    ) : (
                        <div className="space-y-3 sm:space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.product.id}
                                    className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl"
                                >
                                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                                        <Image
                                            src={item.product.image}
                                            alt={item.product.name}
                                            fill
                                            sizes="80px"
                                            className="object-cover rounded-lg"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 truncate">
                                            {item.product.name}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-gray-500 mb-2">
                                            ${item.product.price.toLocaleString('es-CL')}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    onUpdateQuantity(item.product.id, item.quantity - 1)
                                                }
                                                className="w-8 h-8 sm:w-9 sm:h-9 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 active:scale-95 transition-all font-bold text-base sm:text-lg"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 sm:w-10 text-center font-semibold text-sm sm:text-base">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    onUpdateQuantity(item.product.id, item.quantity + 1)
                                                }
                                                className="w-8 h-8 sm:w-9 sm:h-9 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 active:scale-95 transition-all font-bold text-base sm:text-lg"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() => onRemove(item.product.id)}
                                                className="ml-auto text-red-500 hover:text-red-700 active:scale-95 text-xs sm:text-sm font-medium"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="border-t border-gray-200 p-4 sm:p-6 space-y-3 sm:space-y-4 bg-white">
                        <div className="flex justify-between items-center">
                            <span className="text-base sm:text-lg font-semibold text-gray-700">Total:</span>
                            <span className="text-xl sm:text-2xl font-bold text-gray-900">
                                ${total.toLocaleString('es-CL')}
                            </span>
                        </div>
                        <button
                            onClick={onCheckout}
                            className="w-full flex items-center justify-center gap-2 py-4 sm:py-5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-xl font-bold text-base sm:text-lg transition-all shadow-lg active:scale-95"
                        >
                            <Send className="w-5 h-5" />
                            Hacer Pedido por WhatsApp
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

// Exit-Intent Popup
function ExitPopup({
    onClose,
    settings
}: {
    onClose: () => void;
    settings: typeof CONVERSION_SETTINGS;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Tag className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {settings.exit_message}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Usa el código <span className="font-mono font-bold text-blue-600">{settings.exit_code}</span> y obtén{' '}
                        <span className="font-bold text-green-600">{settings.exit_discount_pct}% de descuento</span> en tu primera compra
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            Seguir comprando
                        </button>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(settings.exit_code);
                                alert('Código copiado ✅');
                            }}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                        >
                            Copiar código
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
