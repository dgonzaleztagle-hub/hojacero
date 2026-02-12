'use client';

import { useState } from 'react';
import { DollarSign, Megaphone, Share2, Image, Video, Calendar, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { useDashboard } from '../DashboardContext';

export default function TarifasMarketingPage() {
    const { theme } = useDashboard();
    const isDark = theme === 'dark';
    const [selectedService, setSelectedService] = useState<string | null>(null);

    const servicios = [
        {
            id: 'ecosistema-basico',
            categoria: 'Configuración de Ecosistema Digital',
            nombre: 'Integración de Redes Sociales',
            descripcion: 'Vinculación de todos los perfiles (LinkedIn, Facebook, Instagram, TikTok, X, YouTube y Pinterest) al perfil de empresa.',
            precio: 25000,
            icon: Share2,
            color: 'blue'
        },
        {
            id: 'ecosistema-full',
            categoria: 'Configuración de Ecosistema Digital',
            nombre: 'Integración y Publicación Multi-plataforma',
            descripcion: 'Creación y vinculación de todas las RRSS a perfil de empresa + creación de 1 foto o video con IA adaptado para todas las redes.',
            precio: 35000,
            icon: Share2,
            color: 'purple'
        },
        {
            id: 'social-ads',
            categoria: 'Publicidad Digital (Setup de Campañas)',
            nombre: 'Social Ads',
            descripcion: 'Creación y optimización de campaña en una red social específica (no incluye contenido).',
            precio: 10000,
            extra: 'Inversión de campaña',
            icon: Megaphone,
            color: 'red'
        },
        {
            id: 'campana-simple',
            categoria: 'Creación de campaña con contenido IA',
            nombre: 'Contenido para Campaña (Simple)',
            descripcion: '1 foto o video con IA para una red específica.',
            precio: 20000,
            extra: 'Inversión de campaña',
            icon: Image,
            color: 'cyan'
        },
        {
            id: 'campana-full',
            categoria: 'Creación de campaña con contenido IA',
            nombre: 'Contenido para Campaña (Full)',
            descripcion: '1 foto o video con IA para Meta y Google + Copywriting (texto atractivo) para cada una.',
            precio: 30000,
            extra: 'Inversión de campaña',
            icon: Video,
            color: 'indigo'
        },
        {
            id: 'publicacion-individual',
            categoria: 'Creación de campaña con contenido IA',
            nombre: 'Publicación Individual',
            descripcion: '1 foto o video con IA para la red social que el cliente elija.',
            precio: 15000,
            icon: Image,
            color: 'green'
        },
        {
            id: 'publicacion-multi',
            categoria: 'Creación de campaña con contenido IA',
            nombre: 'Publicación Multi-plataforma',
            descripcion: '1 foto o video con IA adaptado para todas las redes (LinkedIn, TikTok, Pinterest, YouTube, Facebook, Instagram y X). RRSS ya tienen que estar creadas.',
            precio: 25000,
            icon: Video,
            color: 'orange'
        },
        {
            id: 'admin-rrss',
            categoria: 'Administración de Redes Sociales',
            nombre: 'Administración de RRSS',
            descripcion: '2 publicaciones y 2 historias a la semana (lunes, miércoles, jueves y viernes). Creación de contenido con IA profesional y avanzado. Respuestas de Lunes a viernes de 9:00 a 18:00 hrs. Solo primera respuesta y derivación a WhatsApp Business.',
            precio: 150000,
            nota: 'Exime automáticamente el pago de mantención mensual cuando está conjunto con este plan.',
            icon: Calendar,
            color: 'pink'
        }
    ];

    const tareasPlanBasico = [
        'Auditoría de Contenido: Revisión y verificación manual de que la información del sitio web coincida al 100% con lo generado por la IA.',
        'Optimización SEO y Etiquetado: Verificación y actualización manual de etiquetas para asegurar el posicionamiento (SEO, GEO-SEO y AEO).',
        'Configuración de Google Business: Creación y optimización manual del Perfil de Empresa en Google (Google Maps/Search).',
        'Ecosistema de Analítica: Configuración e indexación manual de Google Tag Manager con Google Analytics y Google Search Console.'
    ];

    const terminos = [
        'Ejecución única: Los costos corresponden a la ejecución y montaje inicial. No incluyen monitoreo diario ni gestión mensual.',
        'Garantía de ajuste: Incluye una única revisión o ajuste técnico dentro de las 48 horas posteriores a la publicación.',
        'Presupuesto de inversión: El cliente es responsable de proveer el capital de inversión directamente en las plataformas de anuncios (Google/Meta/etc.).'
    ];

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; text: string; border: string; hover: string }> = {
            blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20', hover: 'hover:bg-blue-500/20' },
            purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20', hover: 'hover:bg-purple-500/20' },
            red: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20', hover: 'hover:bg-red-500/20' },
            cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', border: 'border-cyan-500/20', hover: 'hover:bg-cyan-500/20' },
            indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', border: 'border-indigo-500/20', hover: 'hover:bg-indigo-500/20' },
            green: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/20', hover: 'hover:bg-green-500/20' },
            orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/20', hover: 'hover:bg-orange-500/20' },
            pink: { bg: 'bg-pink-500/10', text: 'text-pink-500', border: 'border-pink-500/20', hover: 'hover:bg-pink-500/20' }
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className={`min-h-screen p-6 md:p-10 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${isDark ? 'bg-cyan-500/20' : 'bg-blue-100'}`}>
                            <DollarSign className={`w-6 h-6 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
                        </div>
                        <div>
                            <h1 className={`text-3xl md:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Tarifas de Marketing
                            </h1>
                            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                                Servicios adicionales y costos de implementación
                            </p>
                        </div>
                    </div>
                </div>

                {/* Plan Básico */}
                <div className={`p-6 md:p-8 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-start gap-4 mb-6">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
                            <CheckCircle2 className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                        </div>
                        <div className="flex-1">
                            <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Plan Básico - $150.000 CLP
                            </h2>
                            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                                Tareas técnicas incluidas en el plan básico (implementación y verificación manual):
                            </p>
                        </div>
                    </div>
                    <ul className="space-y-3">
                        {tareasPlanBasico.map((tarea, i) => (
                            <li key={i} className="flex gap-3">
                                <span className={`mt-1 ${isDark ? 'text-cyan-400' : 'text-blue-500'}`}>•</span>
                                <span className={`text-sm ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>{tarea}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Servicios Adicionales */}
                <div className="space-y-4">
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Servicios Adicionales
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {servicios.map((servicio) => {
                            const Icon = servicio.icon;
                            const colors = getColorClasses(servicio.color);
                            const isSelected = selectedService === servicio.id;

                            return (
                                <div
                                    key={servicio.id}
                                    onClick={() => setSelectedService(isSelected ? null : servicio.id)}
                                    className={`p-5 rounded-xl border cursor-pointer transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:shadow-lg'
                                        } ${isSelected ? colors.border + ' ' + colors.bg : ''}`}
                                >
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className={`p-2 rounded-lg ${colors.bg}`}>
                                            <Icon className={`w-5 h-5 ${colors.text}`} />
                                        </div>
                                        <div className="flex-1">
                                            <span className={`text-[9px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                                                {servicio.categoria}
                                            </span>
                                            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {servicio.nombre}
                                            </h3>
                                        </div>
                                    </div>
                                    <p className={`text-xs mb-4 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                                        {servicio.descripcion}
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <span className={`text-2xl font-black ${colors.text}`}>
                                            ${servicio.precio.toLocaleString('es-CL')}
                                        </span>
                                        <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>CLP</span>
                                    </div>
                                    {servicio.extra && (
                                        <p className={`text-[10px] mt-2 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                                            + {servicio.extra}
                                        </p>
                                    )}
                                    {servicio.nota && (
                                        <div className={`mt-3 p-2 rounded-lg text-[10px] ${isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-700'}`}>
                                            💡 {servicio.nota}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Términos y Condiciones */}
                <div className={`p-6 md:p-8 rounded-2xl border ${isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
                    <div className="flex items-start gap-4 mb-6">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-amber-500/20' : 'bg-amber-100'}`}>
                            <AlertCircle className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                        </div>
                        <div>
                            <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Términos y Condiciones del Servicio
                            </h2>
                        </div>
                    </div>
                    <ul className="space-y-3">
                        {terminos.map((termino, i) => (
                            <li key={i} className="flex gap-3">
                                <span className={`mt-1 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>•</span>
                                <span className={`text-sm ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>{termino}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Footer con botón de descarga */}
                <div className="flex justify-end">
                    <button className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${isDark ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        }`}>
                        <Download className="w-4 h-4" />
                        Descargar Tarifario PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
