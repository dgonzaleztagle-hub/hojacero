'use client';

import { CheckCircle2, AlertTriangle, ExternalLink, CreditCard, Key } from 'lucide-react';

export default function ConfigurarPagosPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-3xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-t-4 border-blue-600">
                    <div className="flex items-center gap-3 mb-4">
                        <CreditCard className="w-10 h-10 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            Configurar Pagos con Tarjeta
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600">
                        3 pasos simples para recibir pagos en tu tienda online.
                    </p>
                </div>

                {/* Paso 1: Obtener Credenciales */}
                <Section
                    number="1"
                    title="Obtener tus Credenciales"
                    icon={<Key className="w-6 h-6" />}
                >
                    <p className="text-gray-700 mb-4">
                        Elige UNA pasarela para empezar. Recomendamos <strong>Mercado Pago</strong> (más fácil).
                    </p>

                    {/* Mercado Pago */}
                    <div className="mb-6 border-2 border-green-200 rounded-lg overflow-hidden bg-green-50">
                        <div className="p-4 bg-green-100 border-b border-green-200">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                Mercado Pago
                                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                                    Recomendado
                                </span>
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">1. Crear cuenta</h4>
                                <p className="text-gray-700">
                                    Ir a{' '}
                                    <a
                                        href="https://www.mercadopago.cl"
                                        target="_blank"
                                        className="text-blue-600 hover:underline inline-flex items-center gap-1"
                                    >
                                        mercadopago.cl <ExternalLink className="w-4 h-4" />
                                    </a>
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Crear cuenta → Verificar identidad → Activar cuenta
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">2. Obtener credenciales</h4>
                                <p className="text-gray-700 mb-2">Panel → Developers → Credenciales</p>
                                <div className="space-y-2">
                                    <div className="bg-white p-3 rounded border border-gray-200">
                                        <p className="font-mono text-sm">
                                            <strong>Public Key:</strong> APP_USR_xxxxxxxx
                                        </p>
                                    </div>
                                    <div className="bg-white p-3 rounded border border-gray-200">
                                        <p className="font-mono text-sm">
                                            <strong>Access Token:</strong> APP_USR_xxxxxxxx
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Flow */}
                    <details className="mb-4 border border-gray-200 rounded-lg">
                        <summary className="p-4 bg-gray-50 cursor-pointer font-semibold text-gray-900 hover:bg-gray-100">
                            Flow (Alternativa)
                        </summary>
                        <div className="p-6 space-y-4">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">1. Crear cuenta</h4>
                                <p className="text-gray-700">
                                    Ir a{' '}
                                    <a href="https://www.flow.cl" target="_blank" className="text-blue-600 hover:underline">
                                        flow.cl
                                    </a>
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">2. Obtener credenciales</h4>
                                <p className="text-gray-700">Panel → Integraciones → API</p>
                                <div className="mt-2 space-y-2">
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="font-mono text-sm">
                                            <strong>API Key:</strong> xxxxxxxx
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="font-mono text-sm">
                                            <strong>Secret Key:</strong> xxxxxxxx
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </details>

                    {/* Transbank */}
                    <details className="border border-gray-200 rounded-lg">
                        <summary className="p-4 bg-gray-50 cursor-pointer font-semibold text-gray-900 hover:bg-gray-100">
                            Transbank (Requiere afiliación)
                        </summary>
                        <div className="p-6 space-y-4">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">1. Afiliarse</h4>
                                <p className="text-gray-700">
                                    Ir a{' '}
                                    <a href="https://www.transbank.cl" target="_blank" className="text-blue-600 hover:underline">
                                        transbank.cl
                                    </a>
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Contactar comercial → Solicitar afiliación → Esperar aprobación
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">2. Recibir credenciales</h4>
                                <p className="text-gray-700">Transbank te enviará por email:</p>
                                <div className="mt-2 space-y-2">
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="font-mono text-sm">
                                            <strong>Código de Comercio:</strong> 597xxxxxxxxx
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="font-mono text-sm">
                                            <strong>API Key:</strong> xxxxxxxx
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </details>
                </Section>

                {/* Paso 2: Configurar en Panel */}
                <Section number="2" title="Pegar en tu Panel de Admin" icon={<CreditCard className="w-6 h-6" />}>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">1. Ir a tu panel de pagos</h4>
                            <p className="text-gray-700">
                                Visita:{' '}
                                <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">
                                    /admin/tienda/pagos
                                </code>
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">2. Seleccionar pasarela</h4>
                            <p className="text-gray-700">Elegir: Mercado Pago / Flow / Transbank</p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">3. Pegar credenciales</h4>
                            <p className="text-gray-700">Copiar y pegar las credenciales del paso 1</p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">4. Activar modo test</h4>
                            <p className="text-gray-700">
                                ✅ Activar "Modo de prueba" (para probar sin cobros reales)
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">5. Guardar</h4>
                            <p className="text-gray-700">Click en "Guardar Configuración"</p>
                        </div>
                    </div>

                    <Alert type="info">
                        <strong>Modo Test:</strong> Mientras esté activado, NO se cobrarán pagos reales. Úsalo para
                        probar.
                    </Alert>
                </Section>

                {/* Paso 3: Probar */}
                <Section number="3" title="Probar un Pago" icon={<CheckCircle2 className="w-6 h-6" />}>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">1. Ir a tu tienda</h4>
                            <p className="text-gray-700">
                                Visita:{' '}
                                <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">/tienda</code>
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">2. Agregar productos al carrito</h4>
                            <p className="text-gray-700">Click en "Agregar" en cualquier producto</p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">3. Hacer checkout</h4>
                            <p className="text-gray-700">Click en "Pagar con Tarjeta"</p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">4. Completar pago de prueba</h4>
                            <p className="text-gray-700">Usar tarjetas de prueba de la pasarela</p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">5. Verificar orden</h4>
                            <p className="text-gray-700">
                                La orden debería aparecer en{' '}
                                <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">
                                    /admin/tienda
                                </code>
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-lg p-6">
                        <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" />
                            ¿Todo funcionó?
                        </h4>
                        <p className="text-gray-700 mb-4">
                            Si el pago de prueba se completó correctamente, ya puedes activar el modo producción:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-gray-700">
                            <li>
                                Ir a <code className="bg-white px-2 py-1 rounded">/admin/tienda/pagos</code>
                            </li>
                            <li>Desactivar "Modo de prueba"</li>
                            <li>Usar credenciales de producción (si son diferentes)</li>
                            <li>Guardar</li>
                            <li>¡Listo para recibir pagos reales! 💰</li>
                        </ol>
                    </div>
                </Section>

                {/* Troubleshooting */}
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mt-8">
                    <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6" />
                        ¿Problemas?
                    </h3>

                    <div className="space-y-4">
                        <Problem
                            issue="No aparece el botón de pago"
                            solution="Verificar que configuraste al menos una pasarela en /admin/tienda/pagos"
                        />
                        <Problem
                            issue="Error al crear pago"
                            solution="Revisar que las credenciales sean correctas y estén en modo test"
                        />
                        <Problem
                            issue="Pago no se confirma"
                            solution="Esperar unos segundos. Si no funciona, revisar órdenes en /admin/tienda"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-gray-500 text-sm">
                    <p>¿Necesitas ayuda? Contacta a soporte técnico</p>
                    <p className="mt-2">Powered by HojaCero</p>
                </div>
            </div>
        </div>
    );
}

// Components
function Section({ number, title, icon, children }: any) {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    {number}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="text-blue-600">{icon}</div>
                        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    </div>
                    <div className="mt-4">{children}</div>
                </div>
            </div>
        </div>
    );
}

function Alert({ type, children }: { type: 'info' | 'warning'; children: React.ReactNode }) {
    const styles = {
        info: 'bg-blue-50 border-blue-500 text-blue-900',
        warning: 'bg-yellow-50 border-yellow-500 text-yellow-900'
    };

    return <div className={`border-l-4 rounded p-4 mt-4 ${styles[type]}`}>{children}</div>;
}

function Problem({ issue, solution }: { issue: string; solution: string }) {
    return (
        <div>
            <p className="font-semibold text-red-900">❌ {issue}</p>
            <p className="text-red-700 mt-1">✅ Solución: {solution}</p>
        </div>
    );
}
