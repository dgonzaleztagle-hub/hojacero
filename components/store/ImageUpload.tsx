"use client";

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadProductImage, compressImage } from '@/lib/store/image-upload';
import Image from 'next/image';

interface ImageUploadProps {
    onUploadComplete: (url: string) => void;
    currentImage?: string;
    onRemove?: () => void;
}

export default function ImageUpload({ onUploadComplete, currentImage, onRemove }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        setIsUploading(true);

        try {
            // Crear preview local
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Comprimir imagen antes de subir
            const compressedFile = await compressImage(file, 1200, 0.85);

            // Subir a Supabase
            const result = await uploadProductImage(compressedFile);

            if (result.success && result.url) {
                onUploadComplete(result.url);
            } else {
                setError(result.error || 'Error al subir imagen');
                setPreview(null);
            }
        } catch (err) {
            setError('Error inesperado al procesar imagen');
            setPreview(null);
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onRemove?.();
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
                Imagen del Producto
            </label>

            {preview ? (
                <div className="relative aspect-square w-full max-w-xs rounded-xl overflow-hidden border-2 border-gray-200 group">
                    <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            onClick={handleRemove}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                            type="button"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                            <p className="text-sm font-medium text-gray-600">Subiendo imagen...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-gray-100 rounded-full">
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-700">Click para subir imagen</p>
                                <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP o GIF (máx. 5MB)</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
            />

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
            )}
        </div>
    );
}
