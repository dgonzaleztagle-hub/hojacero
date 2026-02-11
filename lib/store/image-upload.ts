// Utilidades para upload de imágenes a Supabase Storage
import { createClient } from '@/utils/supabase/client';

const BUCKET_NAME = 'h0_store_images';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export interface UploadResult {
    success: boolean;
    url?: string;
    error?: string;
}

/**
 * Sube una imagen al bucket de Supabase Storage
 * @param file - Archivo a subir
 * @param folder - Carpeta dentro del bucket (opcional)
 * @returns URL pública de la imagen o error
 */
export async function uploadProductImage(
    file: File,
    folder: string = 'products'
): Promise<UploadResult> {
    try {
        // Validar tipo de archivo
        if (!ALLOWED_TYPES.includes(file.type)) {
            return {
                success: false,
                error: 'Tipo de archivo no permitido. Solo se aceptan imágenes (JPG, PNG, WebP, GIF).'
            };
        }

        // Validar tamaño
        if (file.size > MAX_FILE_SIZE) {
            return {
                success: false,
                error: 'Archivo muy grande. Máximo 5MB.'
            };
        }

        const supabase = createClient();

        // Generar nombre único
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const extension = file.name.split('.').pop();
        const fileName = `${folder}/${timestamp}_${randomString}.${extension}`;

        // Subir archivo
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Error uploading image:', error);
            return {
                success: false,
                error: `Error al subir imagen: ${error.message}`
            };
        }

        // Obtener URL pública
        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(data.path);

        return {
            success: true,
            url: publicUrl
        };
    } catch (err) {
        console.error('Unexpected error:', err);
        return {
            success: false,
            error: 'Error inesperado al subir imagen.'
        };
    }
}

/**
 * Elimina una imagen del bucket
 * @param url - URL pública de la imagen a eliminar
 */
export async function deleteProductImage(url: string): Promise<boolean> {
    try {
        const supabase = createClient();

        // Extraer path del URL
        const urlObj = new URL(url);
        const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)/);

        if (!pathMatch) {
            console.error('Invalid URL format');
            return false;
        }

        const filePath = pathMatch[1];

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([filePath]);

        if (error) {
            console.error('Error deleting image:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Unexpected error:', err);
        return false;
    }
}

/**
 * Comprime una imagen antes de subirla (opcional)
 * @param file - Archivo original
 * @param maxWidth - Ancho máximo
 * @param quality - Calidad de compresión (0-1)
 */
export async function compressImage(
    file: File,
    maxWidth: number = 1200,
    quality: number = 0.8
): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target?.result as string;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now()
                            });
                            resolve(compressedFile);
                        } else {
                            reject(new Error('Failed to compress image'));
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };

            img.onerror = () => reject(new Error('Failed to load image'));
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
    });
}
