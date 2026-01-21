'use client';

import { useState } from 'react';

type SectionKey = 'flujo' | 'workflows' | 'workers' | 'sintaxis' | 'tablas' | 'killswitch' | 'carpetas';

interface BaseItem {
    name: string;
    desc: string;
    details?: string;
}

interface WorkflowItem extends BaseItem {
    when: string;
    syntax: string;
}

interface FlujoItem extends BaseItem {
    step: string;
    workflow?: string;
}

interface SintaxisItem extends BaseItem {
    example: string;
}

type SectionItem = WorkflowItem | FlujoItem | SintaxisItem | BaseItem;

export default function AyudaPage() {
    const [activeSection, setActiveSection] = useState<SectionKey>('flujo');
    const [expandedCard, setExpandedCard] = useState<number | null>(null);

    const sections: Record<SectionKey, { title: string; content?: string; items?: SectionItem[] }> = {
        flujo: {
            title: '🔄 Flujo de Venta',
            items: [
                {
                    name: '1. Captación', step: 'RADAR', desc: 'Buscar leads en Google Maps, análisis IA, Pipeline Kanban',
                    details: 'Usa el módulo RADAR del dashboard para buscar negocios por zona y categoría. La IA analiza cada sitio y te da un score de oportunidad. Los leads se agregan automáticamente al Pipeline Kanban.'
                },
                {
                    name: '2. Demo', step: 'DESARROLLO', desc: 'Generar landing premium y mostrar al prospecto', workflow: '/factory-demo',
                    details: 'Ejecutas /factory-demo con la URL del sitio actual del prospecto. El Factory genera una landing page premium en minutos. Se guarda en /prospectos/[nombre]/ y le muestras al cliente cómo se vería su nuevo sitio.'
                },
                {
                    name: '3. Aprobación', step: 'COMERCIAL', desc: 'Cliente dice SÍ, cobrar anticipo',
                    details: 'El cliente ve el demo y si le gusta, cierra el trato. Cobras el anticipo (50% típicamente). Mueves el lead a la columna "Producción" en el Pipeline.'
                },
                {
                    name: '4. Desarrollo', step: 'DESARROLLO', desc: 'Generar sitio completo con QA Awwwards', workflow: '/factory-final + /factory-qa',
                    details: '/factory-final genera todas las páginas (inicio, servicios, contacto, etc.). Luego /factory-qa actúa como "Juez Awwwards" y audita: ¿Se ve de alto costo? ¿Tiene efecto WOW? ¿Mobile perfecto? Si no aprueba, te dice qué arreglar.'
                },
                {
                    name: '5. Producción', step: 'DEPLOY', desc: 'SEO técnico, registrar cliente, inyectar kill switch', workflow: '/factory-seo',
                    details: '/factory-seo inyecta meta tags, JSON-LD, sitemap. ADEMÁS registra al cliente en monitored_sites (Supabase) e inyecta el script de kill switch. Si no pagan, puedes bloquear el sitio con un click.'
                },
                {
                    name: '6. Deploy', step: 'DEPLOY', desc: 'Subir al hosting del cliente, activar dominio',
                    details: 'Copias el sitio a d:/clientes/[nombre]/site/. Subes al hosting (Vercel, Netlify, cPanel, FTP según el caso). Configuras el dominio. El sitio está VIVO.'
                },
                {
                    name: '7. Mantención', step: 'RECURRENTE', desc: 'Lista pendientes, optimiza, envía reporte', workflow: '/worker-mensual + /worker-maintain',
                    details: 'Cada mes: /worker-mensual te lista quién toca hoy. /worker-maintain optimiza imágenes, actualiza deps, verifica SEO. Generas PDF de reporte y se lo envías al cliente. Eso justifica los $20.000/mes.'
                }
            ]
        },
        workflows: {
            title: '🔧 Factory (Prospectos)',
            items: [
                {
                    name: '/factory-demo', desc: 'Genera landing premium', when: 'Prospecto nuevo', syntax: 'para [URL]',
                    details: 'Lee la URL, scrapea contenido, detecta industria, aplica Gold Master Protocol. Genera una landing page de nivel Awwwards en ~20 minutos. Incluye animaciones, tipografía premium, componentes WOW.'
                },
                {
                    name: '/factory-final', desc: 'Genera sitio multi-página', when: 'Cliente aprobó demo', syntax: 'para [Nombre]',
                    details: 'Expande el demo a sitio completo: Home, Servicios, Nosotros, Contacto, etc. Mantiene la misma estética. Genera todas las páginas necesarias según el tipo de negocio.'
                },
                {
                    name: '/factory-seo', desc: 'SEO + kill switch + registra cliente', when: 'Cliente PAGÓ', syntax: 'para [Nombre]',
                    details: 'Inyecta meta tags, Open Graph, JSON-LD (LocalBusiness/Restaurant/etc). REGISTRA en Supabase monitored_sites. Inyecta script de kill switch. Crea carpeta d:/clientes/[nombre]/. Solo ejecutar cuando PAGARON.'
                },
                {
                    name: '/factory-qa', desc: 'Auditoría Awwwards', when: 'Antes de mostrar', syntax: 'para [Nombre]',
                    details: 'Actúa como juez de Awwwards: ¿Hay tensión visual? ¿Efecto WOW? ¿Mobile perfecto? ¿Componentes premium bien usados? Veredicto: APROBADO / REVISAR / RECHAZADO. Si rechaza, te dice qué arreglar.'
                },
                {
                    name: '/factory-export', desc: 'Empaqueta para entrega', when: 'Listo para deploy', syntax: 'para [Nombre]',
                    details: 'Prepara el sitio para producción: build, optimización, genera ZIP o prepara para subir. Verifica que todo esté listo para deploy.'
                }
            ]
        },
        workers: {
            title: '🔄 Workers (Mantención)',
            items: [
                {
                    name: '/worker-mensual', desc: 'Lista sitios pendientes hoy/semana', when: 'Al inicio del día', syntax: '(sin parámetros)',
                    details: 'Consulta Supabase y lista: 1) Sitios que toca mantener HOY (según maintenance_day), 2) Sitios ATRASADOS (día ya pasó), 3) Próximos 7 días. Te muestra nombre, URL, última mantención, plan.'
                },
                {
                    name: '/worker-maintain', desc: 'Optimiza imágenes, SEO, deps', when: 'Mantención de un sitio', syntax: '[Nombre Cliente]',
                    details: 'Abre d:/clientes/[nombre]/site/. Crea backup. Optimiza imágenes (sharp), verifica links rotos, actualiza dependencias (npm update), audita SEO. Te muestra diff de cambios. Tú apruebas y subes al hosting.'
                }
            ]
        },
        sintaxis: {
            title: '📝 Sintaxis Rápida',
            items: [
                {
                    name: '/factory-demo', desc: 'Usar URL del sitio actual', example: '/factory-demo para www.restaurant.cl',
                    details: 'La URL debe ser el sitio ACTUAL del prospecto (el que quieres reemplazar). El Factory lo scrapea para extraer contenido.'
                },
                {
                    name: '/factory-final', desc: 'Usar nombre del prospecto', example: '/factory-final para "Restaurante La Mesa"',
                    details: 'El nombre debe coincidir con la carpeta en /prospectos/. Usa comillas si tiene espacios.'
                },
                {
                    name: '/factory-seo', desc: 'Usar nombre del cliente', example: '/factory-seo para Biocrom',
                    details: 'SOLO ejecutar cuando el cliente YA PAGÓ. Este paso lo registra en el sistema de retención.'
                },
                { name: '/factory-qa', desc: 'Usar nombre del proyecto', example: '/factory-qa para AbogadosSilva' },
                {
                    name: '/worker-mensual', desc: 'Sin parámetros', example: '/worker-mensual',
                    details: 'No necesita nombre. Lista TODOS los clientes activos y te dice cuáles toca hoy.'
                },
                {
                    name: '/worker-maintain', desc: 'Usar nombre del cliente', example: '/worker-maintain "Clínica Dental"',
                    details: 'El nombre debe coincidir con client_name en monitored_sites de Supabase.'
                }
            ]
        },
        tablas: {
            title: '🗄️ Base de Datos',
            items: [
                {
                    name: 'leads', desc: 'Prospectos capturados por el Radar',
                    details: 'Campos: nombre, URL, teléfono, email, puntaje_oportunidad, pipeline_stage, source_data (JSON con todo el scraping).'
                },
                {
                    name: 'lead_activity_log', desc: 'Historial de todas las acciones sobre leads',
                    details: 'Cada vez que mueves un lead, agregas nota, o cambias estado, queda logueado aquí.'
                },
                {
                    name: 'monitored_sites', desc: 'Clientes con mantención mensual activa',
                    details: 'Campos: client_name, site_url, local_path, hosting_type, credentials, maintenance_day, plan_type, status.'
                },
                {
                    name: 'site_status', desc: 'Kill switch (is_active true/false)',
                    details: 'Tabla simple: id (mismo que monitored_sites), is_active, reason. El script del sitio consulta esta tabla.'
                },
                {
                    name: 'maintenance_logs', desc: 'Historial de mantenciones realizadas',
                    details: 'Cada vez que ejecutas /worker-maintain y lo marcas completado, queda registrado con fecha, cambios, y si se desplegó.'
                }
            ]
        },
        killswitch: {
            title: '🔴 Kill Switch',
            items: [
                {
                    name: '¿Qué es?', desc: 'Script inyectado en sitios que verifica si pueden mostrar contenido',
                    details: 'Es un pequeño JavaScript que se ejecuta al cargar el sitio. Consulta Supabase y si is_active=false, reemplaza TODO el contenido por "Sitio en Mantenimiento".'
                },
                {
                    name: 'Funcionamiento', desc: 'Sitio consulta site_status en Supabase al cargar',
                    details: 'El script hace fetch a site_status con el UUID del sitio. La tabla es pública (anon) solo para SELECT. Nadie puede modificarla sin estar autenticado.'
                },
                {
                    name: 'Si is_active = false', desc: 'Muestra "Sitio en Mantenimiento"',
                    details: 'El script reemplaza document.body.innerHTML con un mensaje de mantenimiento. El cliente no puede ver nada del sitio.'
                },
                {
                    name: 'Control Dashboard', desc: 'Desde Dashboard puedes activar/desactivar con un click',
                    details: 'En la vista de clientes (pendiente de construir), habrá un toggle para activar/desactivar cada sitio.'
                },
                {
                    name: 'Mes 1 sin pago', desc: 'Email automático de aviso al cliente',
                    details: '(Pendiente de automatizar) El sistema detecta que no hay pago y envía email de recordatorio.'
                },
                {
                    name: 'Mes 2 sin pago', desc: 'is_active = FALSE → Sitio bloqueado',
                    details: 'Si no pagan al segundo mes, se desactiva el sitio. El cliente ve "Mantenimiento" hasta que regularice.'
                },
                {
                    name: 'Cliente paga', desc: 'Click "Reactivar" → Sitio funciona de nuevo',
                    details: 'Tú verificas el pago, click en Reactivar, is_active=true, el sitio vuelve a funcionar inmediatamente.'
                }
            ]
        },
        carpetas: {
            title: '📁 Estructura Local',
            items: [
                {
                    name: 'Prospectos', desc: 'd:/proyectos/hojacero/prospectos/[cliente]/',
                    details: 'Aquí vive el código mientras el prospecto NO es cliente todavía. El Factory genera todo aquí.'
                },
                {
                    name: '→ discovery_notes.md', desc: 'Datos del negocio extraídos',
                    details: 'Nombre, descripción, servicios, precios, horarios, todo lo que el scraper encontró.'
                },
                {
                    name: '→ style_lock.md', desc: 'Estado y decisiones de diseño',
                    details: 'Paleta de colores, fuentes elegidas, componentes usados, estado del proyecto (demo/final/aprobado).'
                },
                {
                    name: 'Clientes', desc: 'd:/clientes/[cliente]/',
                    details: 'Una vez que el cliente PAGÓ y ejecutaste /factory-seo, el sitio se copia aquí para producción.'
                },
                {
                    name: '→ site/', desc: 'Copia del sitio desplegado',
                    details: 'El código exacto que está en el hosting. Si necesitas hacer cambios, los haces aquí y resubes.'
                },
                {
                    name: '→ reports/', desc: 'PDFs de reportes mensuales',
                    details: 'Cada mes generas un reporte de mantención y lo guardas aquí antes de enviarlo.'
                },
                {
                    name: '→ backups/', desc: 'Backups antes de cambios',
                    details: 'Antes de cada mantención, /worker-maintain crea una copia con fecha. Si algo se rompe, puedes restaurar.'
                },
                {
                    name: '→ metadata.json', desc: 'ID, nombre, fechas',
                    details: '{ site_id: "uuid", client_name: "...", created_at: "...", last_maintenance: "..." }'
                }
            ]
        }
    };

    const section = sections[activeSection];

    const getBadgeStyle = (item: SectionItem) => {
        if ('step' in item) {
            const colors: Record<string, string> = {
                'RADAR': 'bg-green-900/50 text-green-300',
                'DESARROLLO': 'bg-blue-900/50 text-blue-300',
                'COMERCIAL': 'bg-yellow-900/50 text-yellow-300',
                'DEPLOY': 'bg-purple-900/50 text-purple-300',
                'RECURRENTE': 'bg-cyan-900/50 text-cyan-300'
            };
            return colors[item.step] || 'bg-gray-700 text-gray-300';
        }
        return 'bg-blue-900/50 text-blue-300';
    };

    const toggleCard = (index: number) => {
        setExpandedCard(expandedCard === index ? null : index);
    };

    return (
        <div className="p-4 md:p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">📚 Centro de Ayuda</h1>
            <p className="text-gray-400 mb-6">Todo sobre HojaCero Factory - Click en cada card para más detalles</p>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {(Object.keys(sections) as SectionKey[]).map((key) => (
                    <button
                        key={key}
                        onClick={() => { setActiveSection(key); setExpandedCard(null); }}
                        className={`px-4 py-2 rounded-lg transition-all text-sm ${activeSection === key
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                    >
                        {sections[key].title}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-bold mb-4">{section.title}</h2>

                {section.items && (
                    <div className="space-y-3">
                        {section.items.map((item, i) => (
                            <div
                                key={i}
                                className={`bg-gray-800 rounded-lg p-4 cursor-pointer transition-all ${expandedCard === i ? 'ring-2 ring-blue-500' : 'hover:bg-gray-750'
                                    }`}
                                onClick={() => item.details && toggleCard(i)}
                            >
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                    <code className={`px-2 py-1 rounded text-sm font-mono ${getBadgeStyle(item)}`}>
                                        {item.name}
                                    </code>

                                    {'step' in item && (
                                        <span className={`px-2 py-0.5 rounded text-xs ${getBadgeStyle(item)}`}>
                                            {item.step}
                                        </span>
                                    )}

                                    {'syntax' in item && (
                                        <span className="text-gray-500 text-sm">{item.syntax}</span>
                                    )}

                                    {item.details && (
                                        <span className="text-gray-500 text-xs ml-auto">
                                            {expandedCard === i ? '▼' : '▶'} click para detalles
                                        </span>
                                    )}
                                </div>

                                <p className="text-gray-300">{item.desc}</p>

                                {'workflow' in item && item.workflow && (
                                    <p className="text-blue-400 text-sm mt-1 font-mono">→ {item.workflow}</p>
                                )}

                                {'when' in item && (
                                    <p className="text-gray-500 text-sm mt-1">📍 {item.when}</p>
                                )}

                                {'example' in item && (
                                    <code className="block mt-2 bg-black/30 p-2 rounded text-green-400 text-sm font-mono">
                                        {item.example}
                                    </code>
                                )}

                                {/* Detalles expandibles */}
                                {expandedCard === i && item.details && (
                                    <div className="mt-4 pt-4 border-t border-gray-700">
                                        <p className="text-gray-300 text-sm leading-relaxed">{item.details}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Reference */}
            <div className="mt-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-4 border border-blue-800/50">
                <h3 className="font-bold mb-3">⚡ Referencia Rápida</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                        <span className="text-gray-400 block">Nuevo lead</span>
                        <code className="text-blue-300">Radar</code>
                    </div>
                    <div>
                        <span className="text-gray-400 block">Demo</span>
                        <code className="text-blue-300">/factory-demo</code>
                    </div>
                    <div>
                        <span className="text-gray-400 block">Sitio completo</span>
                        <code className="text-blue-300">/factory-final</code>
                    </div>
                    <div>
                        <span className="text-gray-400 block">Producción</span>
                        <code className="text-blue-300">/factory-seo</code>
                    </div>
                    <div>
                        <span className="text-gray-400 block">Mantención</span>
                        <code className="text-blue-300">/worker-mensual</code>
                    </div>
                </div>
            </div>
        </div>
    );
}
