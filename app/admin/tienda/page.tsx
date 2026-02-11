"use client";

import React, { useState } from 'react';
import { Package, Plus, X, Save, Tag, DollarSign, FileText, Image as ImageIcon, TrendingUp, FolderOpen, Settings, Edit2, Trash2, Upload } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/store/ImageUpload';

// Mock data para el prototipo
const MOCK_CATEGORIES = [
    { id: '1', name: 'Anillos', slug: 'anillos' },
    { id: '2', name: 'Collares', slug: 'collares' },
    { id: '3', name: 'Aros', slug: 'aros' }
];

const MOCK_PRODUCTS = [
    {
        id: '1',
        name: 'Anillo Oro Clásico',
        category: 'Anillos',
        price: 150000,
        highlight1: { label: 'Material', value: 'Oro 18k' },
        highlight2: { label: 'Talla', value: '8' },
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400'
    },
    {
        id: '2',
        name: 'Collar Plata Elegante',
        category: 'Collares',
        price: 80000,
        highlight1: { label: 'Material', value: 'Plata 925' },
        highlight2: { label: 'Largo', value: '45cm' },
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400'
    }
];

export default function AdminTiendaPage() {
    const [products, setProducts] = useState(MOCK_PRODUCTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeView, setActiveView] = useState<'products' | 'categories' | 'settings'>('products');

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-900">Joyería Obsidian</h1>
                    <p className="text-xs text-gray-500 mt-1">Panel de Control</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <button
                        onClick={() => setActiveView('products')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeView === 'products'
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Package className="w-5 h-5" />
                        <span className="font-medium text-sm">Productos</span>
                        <span className="ml-auto text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                            {products.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveView('categories')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeView === 'categories'
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <FolderOpen className="w-5 h-5" />
                        <span className="font-medium text-sm">Categorías</span>
                        <span className="ml-auto text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                            {MOCK_CATEGORIES.length}
                        </span>
                    </button>

                    <button
                        onClick={() => window.location.href = '/admin/tienda/conversion'}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-50"
                    >
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-medium text-sm">Conversión</span>
                    </button>

                    <button
                        onClick={() => setActiveView('settings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeView === 'settings'
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium text-sm">Configuración</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <a
                        href="/tienda"
                        target="_blank"
                        className="block w-full text-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                        Ver Tienda →
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Productos</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Gestiona el catálogo de tu tienda
                            </p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                        >
                            <Plus className="w-5 h-5" />
                            Nuevo Producto
                        </button>
                    </div>

                    {/* Products Table */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Producto
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Categoría
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Destacados
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Precio
                                    </th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                                />
                                                <span className="font-medium text-gray-900">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-gray-500">
                                                    {product.highlight1.label}: <span className="font-medium text-gray-700">{product.highlight1.value}</span>
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {product.highlight2.label}: <span className="font-medium text-gray-700">{product.highlight2.value}</span>
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-gray-900">
                                                ${product.price.toLocaleString('es-CL')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Modal Nuevo Producto */}
            {isModalOpen && (
                <ProductModal onClose={() => setIsModalOpen(false)} categories={MOCK_CATEGORIES} />
            )}
        </div>
    );
}

// Modal Component
function ProductModal({ onClose, categories }: { onClose: () => void; categories: any[] }) {
    const [productImage, setProductImage] = useState<string>('');

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">Nuevo Producto</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-6">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nombre del Producto
                        </label>
                        <input
                            type="text"
                            placeholder="Ej: Anillo Oro Clásico"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Categoría y Precio */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Categoría
                            </label>
                            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                                <option>Seleccionar...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Precio (CLP)
                            </label>
                            <input
                                type="number"
                                placeholder="150000"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Campos Destacables */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Tag className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-900">Campos Destacables</span>
                            <span className="text-xs text-blue-600">(aparecen resaltados en la tienda)</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Ej: Material"
                                className="px-4 py-2 border border-blue-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <input
                                type="text"
                                placeholder="Ej: Oro 18k"
                                className="px-4 py-2 border border-blue-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Ej: Talla"
                                className="px-4 py-2 border border-blue-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <input
                                type="text"
                                placeholder="Ej: 8"
                                className="px-4 py-2 border border-blue-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Descripción
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Describe el producto con todos los detalles que quieras..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    {/* Imagen */}
                    <ImageUpload
                        currentImage={productImage}
                        onUploadComplete={(url) => setProductImage(url)}
                        onRemove={() => setProductImage('')}
                    />
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm">
                        Guardar Producto
                    </button>
                </div>
            </div>
        </div>
    );
}
