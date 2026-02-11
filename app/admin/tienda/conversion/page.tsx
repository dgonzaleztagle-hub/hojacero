"use client";

import React, { useState } from 'react';
import { TrendingUp, Zap, Shield, ShoppingCart, Users, Tag, Save, Palette } from 'lucide-react';

export default function ConversionSettingsPage() {
    const [settings, setSettings] = useState({
        // Estilo de Badges
        badge_style_preset: 'direct-light' as 'premium-light' | 'premium-dark' | 'direct-light' | 'direct-dark',

        // Urgencia y Escasez
        show_low_stock: true,
        low_stock_threshold: 5,
        show_viewers_count: true,
        simulated_viewers_min: 2,
        simulated_viewers_max: 8,

        // Social Proof
        show_ratings: true,
        bestseller_threshold: 10,
        show_bestseller_badge: true,

        // Exit Intent
        exit_popup_enabled: true,
        exit_discount_pct: 10,
        exit_code: 'PRIMERACOMPRA',
        exit_message: '¡Espera! No te vayas sin tu descuento',

        // Carrito
        cart_cta_enabled: true,
        cart_cta_interval: 60,
        cart_cta_message: '¡No olvides tu pedido! 🛒',
        free_shipping_threshold: 50000,
        show_shipping_progress: true,

        // Trust
        trust_bar_enabled: true,
        return_days: 30,
        show_secure_payment: true
    });

    const handleSave = () => {
        // TODO: Guardar en Supabase
        alert('Configuración guardada ✅');
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <TrendingUp className="w-7 h-7 text-blue-600" />
                            Panel de Alta Conversión
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Configura técnicas probadas para aumentar tus ventas
                        </p>
                    </div>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                    >
                        <Save className="w-5 h-5" />
                        Guardar Cambios
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-8 space-y-6">
                {/* Style Preset Selector */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500 rounded-lg">
                                <Palette className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Estilo de Badges</h2>
                                <p className="text-xs text-gray-600">Elige el tono que mejor represente tu marca</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Premium Light */}
                            <button
                                onClick={() => setSettings({ ...settings, badge_style_preset: 'premium-light' })}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${settings.badge_style_preset === 'premium-light'
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-gray-900">Premium Light</h3>
                                    {settings.badge_style_preset === 'premium-light' && (
                                        <span className="text-xs bg-indigo-500 text-white px-2 py-1 rounded-full">Activo</span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-600 mb-3">Joyería, Boutique, Lujo</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-100 to-yellow-50 text-amber-900 rounded-full text-xs font-bold">
                                        ✨ Más Elegido
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                                        Disponibilidad Limitada
                                    </span>
                                </div>
                            </button>

                            {/* Premium Dark */}
                            <button
                                onClick={() => setSettings({ ...settings, badge_style_preset: 'premium-dark' })}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${settings.badge_style_preset === 'premium-dark'
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-gray-900">Premium Dark</h3>
                                    {settings.badge_style_preset === 'premium-dark' && (
                                        <span className="text-xs bg-indigo-500 text-white px-2 py-1 rounded-full">Activo</span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-600 mb-3">Lujo nocturno, Tech Premium</p>
                                <div className="bg-gray-900 p-3 rounded-lg flex flex-wrap gap-2">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-900/20 to-yellow-900/10 text-amber-200 rounded-full text-xs font-bold">
                                        ✨ Más Elegido
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800/50 text-slate-300 rounded-full text-xs font-medium">
                                        Disponibilidad Limitada
                                    </span>
                                </div>
                            </button>

                            {/* Direct Light */}
                            <button
                                onClick={() => setSettings({ ...settings, badge_style_preset: 'direct-light' })}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${settings.badge_style_preset === 'direct-light'
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-gray-900">Direct Light</h3>
                                    {settings.badge_style_preset === 'direct-light' && (
                                        <span className="text-xs bg-indigo-500 text-white px-2 py-1 rounded-full">Activo</span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-600 mb-3">Retail, E-commerce, Ferretería</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-bold">
                                        🏆 Bestseller
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold animate-pulse">
                                        ⚠️ Solo quedan 3
                                    </span>
                                </div>
                            </button>

                            {/* Direct Dark */}
                            <button
                                onClick={() => setSettings({ ...settings, badge_style_preset: 'direct-dark' })}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${settings.badge_style_preset === 'direct-dark'
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-gray-900">Direct Dark</h3>
                                    {settings.badge_style_preset === 'direct-dark' && (
                                        <span className="text-xs bg-indigo-500 text-white px-2 py-1 rounded-full">Activo</span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-600 mb-3">E-commerce nocturno, Gaming, Tech</p>
                                <div className="bg-gray-900 p-3 rounded-lg flex flex-wrap gap-2">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-400 text-gray-900 rounded-full text-xs font-bold">
                                        🏆 Bestseller
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-full text-xs font-bold animate-pulse">
                                        ⚠️ Solo quedan 3
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Urgencia y Escasez */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500 rounded-lg">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Urgencia y Escasez</h2>
                                <p className="text-xs text-gray-600">Genera FOMO para acelerar decisiones de compra</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.show_low_stock}
                                        onChange={(e) => setSettings({ ...settings, show_low_stock: e.target.checked })}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div>
                                        <span className="font-semibold text-gray-900">Mostrar "Solo quedan X"</span>
                                        <p className="text-sm text-gray-500">Alerta cuando el stock es bajo</p>
                                    </div>
                                </label>
                            </div>
                            {settings.show_low_stock && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Stock menor a:</span>
                                    <input
                                        type="number"
                                        value={settings.low_stock_threshold}
                                        onChange={(e) => setSettings({ ...settings, low_stock_threshold: parseInt(e.target.value) })}
                                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                    <span className="text-sm text-gray-600">unidades</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.show_viewers_count}
                                        onChange={(e) => setSettings({ ...settings, show_viewers_count: e.target.checked })}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div>
                                        <span className="font-semibold text-gray-900">Mostrar "X personas viendo esto"</span>
                                        <p className="text-sm text-gray-500">Número simulado para generar urgencia</p>
                                    </div>
                                </label>
                            </div>
                            {settings.show_viewers_count && (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={settings.simulated_viewers_min}
                                        onChange={(e) => setSettings({ ...settings, simulated_viewers_min: parseInt(e.target.value) })}
                                        className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                    <span className="text-sm text-gray-600">a</span>
                                    <input
                                        type="number"
                                        value={settings.simulated_viewers_max}
                                        onChange={(e) => setSettings({ ...settings, simulated_viewers_max: parseInt(e.target.value) })}
                                        className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Social Proof */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500 rounded-lg">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Social Proof</h2>
                                <p className="text-xs text-gray-600">Genera confianza mostrando popularidad</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.show_ratings}
                                onChange={(e) => setSettings({ ...settings, show_ratings: e.target.checked })}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <div>
                                <span className="font-semibold text-gray-900">Mostrar ratings en cards de producto</span>
                                <p className="text-sm text-gray-500">Estrellas y cantidad de reviews</p>
                            </div>
                        </label>

                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.show_bestseller_badge}
                                        onChange={(e) => setSettings({ ...settings, show_bestseller_badge: e.target.checked })}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div>
                                        <span className="font-semibold text-gray-900">Badge "Bestseller"</span>
                                        <p className="text-sm text-gray-500">En productos más vendidos</p>
                                    </div>
                                </label>
                            </div>
                            {settings.show_bestseller_badge && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Más de:</span>
                                    <input
                                        type="number"
                                        value={settings.bestseller_threshold}
                                        onChange={(e) => setSettings({ ...settings, bestseller_threshold: parseInt(e.target.value) })}
                                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                    <span className="text-sm text-gray-600">ventas</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Exit Intent */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500 rounded-lg">
                                <Tag className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Exit-Intent (Recuperación)</h2>
                                <p className="text-xs text-gray-600">Popup al intentar salir del sitio</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.exit_popup_enabled}
                                onChange={(e) => setSettings({ ...settings, exit_popup_enabled: e.target.checked })}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <div>
                                <span className="font-semibold text-gray-900">Activar popup de salida</span>
                                <p className="text-sm text-gray-500">Se muestra cuando el usuario intenta cerrar la pestaña</p>
                            </div>
                        </label>

                        {settings.exit_popup_enabled && (
                            <div className="pl-8 space-y-4 border-l-2 border-green-200">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mensaje</label>
                                    <input
                                        type="text"
                                        value={settings.exit_message}
                                        onChange={(e) => setSettings({ ...settings, exit_message: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Descuento (%)</label>
                                        <input
                                            type="number"
                                            value={settings.exit_discount_pct}
                                            onChange={(e) => setSettings({ ...settings, exit_discount_pct: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Código</label>
                                        <input
                                            type="text"
                                            value={settings.exit_code}
                                            onChange={(e) => setSettings({ ...settings, exit_code: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Carrito Inteligente */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500 rounded-lg">
                                <ShoppingCart className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Carrito Inteligente</h2>
                                <p className="text-xs text-gray-600">Recordatorios y progreso de envío gratis</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.cart_cta_enabled}
                                        onChange={(e) => setSettings({ ...settings, cart_cta_enabled: e.target.checked })}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div>
                                        <span className="font-semibold text-gray-900">Animación CTA de recordatorio</span>
                                        <p className="text-sm text-gray-500">Mensaje periódico si hay items en el carrito</p>
                                    </div>
                                </label>
                            </div>
                            {settings.cart_cta_enabled && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Cada:</span>
                                    <input
                                        type="number"
                                        value={settings.cart_cta_interval}
                                        onChange={(e) => setSettings({ ...settings, cart_cta_interval: parseInt(e.target.value) })}
                                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                    <span className="text-sm text-gray-600">segundos</span>
                                </div>
                            )}
                        </div>

                        {settings.cart_cta_enabled && (
                            <div className="pl-8">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Mensaje</label>
                                <input
                                    type="text"
                                    value={settings.cart_cta_message}
                                    onChange={(e) => setSettings({ ...settings, cart_cta_message: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        )}

                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.show_shipping_progress}
                                        onChange={(e) => setSettings({ ...settings, show_shipping_progress: e.target.checked })}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div>
                                        <span className="font-semibold text-gray-900">Barra de progreso "Envío Gratis"</span>
                                        <p className="text-sm text-gray-500">Motiva a agregar más productos</p>
                                    </div>
                                </label>
                            </div>
                            {settings.show_shipping_progress && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Sobre:</span>
                                    <span className="text-sm font-mono">$</span>
                                    <input
                                        type="number"
                                        value={settings.free_shipping_threshold}
                                        onChange={(e) => setSettings({ ...settings, free_shipping_threshold: parseInt(e.target.value) })}
                                        className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Trust Signals */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-700 rounded-lg">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Trust Signals</h2>
                                <p className="text-xs text-gray-600">Genera confianza y seguridad</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.trust_bar_enabled}
                                onChange={(e) => setSettings({ ...settings, trust_bar_enabled: e.target.checked })}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <div>
                                <span className="font-semibold text-gray-900">Barra de confianza sticky</span>
                                <p className="text-sm text-gray-500">Visible en todo momento en el storefront</p>
                            </div>
                        </label>

                        {settings.trust_bar_enabled && (
                            <div className="pl-8 space-y-4 border-l-2 border-gray-200">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Devolución en:</span>
                                    <input
                                        type="number"
                                        value={settings.return_days}
                                        onChange={(e) => setSettings({ ...settings, return_days: parseInt(e.target.value) })}
                                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                    <span className="text-sm text-gray-600">días</span>
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.show_secure_payment}
                                        onChange={(e) => setSettings({ ...settings, show_secure_payment: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 rounded"
                                    />
                                    <span className="text-sm text-gray-700">Mostrar "Pago 100% Seguro"</span>
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
