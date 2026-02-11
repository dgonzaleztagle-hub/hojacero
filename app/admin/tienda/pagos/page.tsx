'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CreditCard, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

type PaymentMethod = 'mercadopago' | 'flow' | 'transbank';

interface PaymentConfig {
    payment_method: PaymentMethod;
    credentials: Record<string, string>;
    test_mode: boolean;
}

const GATEWAY_INFO = {
    mercadopago: {
        name: 'Mercado Pago',
        fields: [
            { key: 'publicKey', label: 'Public Key', placeholder: 'APP_USR_xxxxx' },
            { key: 'accessToken', label: 'Access Token', placeholder: 'APP_USR_xxxxx', type: 'password' }
        ],
        docsUrl: 'https://www.mercadopago.cl/developers'
    },
    flow: {
        name: 'Flow',
        fields: [
            { key: 'apiKey', label: 'API Key', placeholder: 'xxxxx' },
            { key: 'secretKey', label: 'Secret Key', placeholder: 'xxxxx', type: 'password' }
        ],
        docsUrl: 'https://www.flow.cl/docs'
    },
    transbank: {
        name: 'Transbank',
        fields: [
            { key: 'commerceCode', label: 'Código de Comercio', placeholder: '597012345678' },
            { key: 'apiKey', label: 'API Key', placeholder: 'xxxxx', type: 'password' }
        ],
        docsUrl: 'https://www.transbankdevelopers.cl'
    }
};

export default function PaymentConfigPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('mercadopago');
    const [credentials, setCredentials] = useState<Record<string, string>>({});
    const [testMode, setTestMode] = useState(true);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('h0_store_payment_config')
            .select('*')
            .single();

        if (data) {
            setSelectedMethod(data.payment_method);
            setCredentials(data.credentials || {});
            setTestMode(data.test_mode);
        }

        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setSaveStatus('idle');

        const supabase = createClient();

        const configData = {
            payment_method: selectedMethod,
            test_mode: testMode,
            credentials
        };

        const { error } = await supabase
            .from('h0_store_payment_config')
            .upsert(configData);

        if (error) {
            console.error('Error saving config:', error);
            setSaveStatus('error');
        } else {
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }

        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    💳 Configuración de Pagos
                </h1>
                <p className="text-gray-600">
                    Configura tu pasarela de pago para recibir pagos con tarjeta
                </p>
            </div>

            {/* Current Method */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                    <strong>Método actual:</strong> {
                        selectedMethod === 'mercadopago' ? 'Mercado Pago' :
                            selectedMethod === 'flow' ? 'Flow' :
                                'Transbank'
                    }
                </p>
            </div>

            {/* Gateway Selection */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Selecciona tu pasarela de pago
                </h2>

                <div className="space-y-3">
                    {/* Mercado Pago */}
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        style={{ borderColor: selectedMethod === 'mercadopago' ? '#3b82f6' : '#e5e7eb' }}>
                        <input
                            type="radio"
                            name="payment_method"
                            value="mercadopago"
                            checked={selectedMethod === 'mercadopago'}
                            onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
                            className="mr-3"
                        />
                        <div className="flex-1">
                            <div className="font-medium text-gray-900">Mercado Pago</div>
                            <div className="text-sm text-gray-600">Chile y LATAM - Tarjetas de crédito/débito</div>
                        </div>
                    </label>

                    {/* Flow */}
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        style={{ borderColor: selectedMethod === 'flow' ? '#3b82f6' : '#e5e7eb' }}>
                        <input
                            type="radio"
                            name="payment_method"
                            value="flow"
                            checked={selectedMethod === 'flow'}
                            onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
                            className="mr-3"
                        />
                        <div className="flex-1">
                            <div className="font-medium text-gray-900">Flow</div>
                            <div className="text-sm text-gray-600">Chile - Integración con bancos locales</div>
                        </div>
                    </label>

                    {/* Transbank */}
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        style={{ borderColor: selectedMethod === 'transbank' ? '#3b82f6' : '#e5e7eb' }}>
                        <input
                            type="radio"
                            name="payment_method"
                            value="transbank"
                            checked={selectedMethod === 'transbank'}
                            onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
                            className="mr-3"
                        />
                        <div className="flex-1">
                            <div className="font-medium text-gray-900">Transbank</div>
                            <div className="text-sm text-gray-600">Chile - Webpay Plus estándar bancario</div>
                        </div>
                    </label>
                </div>
            </div>

            {/* Credentials Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Credenciales de {GATEWAY_INFO[selectedMethod].name}
                </h2>

                <div className="space-y-4">
                    {GATEWAY_INFO[selectedMethod].fields.map((field) => (
                        <div key={field.key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {field.label}
                            </label>
                            <input
                                type={field.type || 'text'}
                                placeholder={field.placeholder}
                                value={credentials[field.key] || ''}
                                onChange={(e) => setCredentials({ ...credentials, [field.key]: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900">
                        ℹ️ Obtén tus credenciales en:{' '}
                        <a href={GATEWAY_INFO[selectedMethod].docsUrl} target="_blank" rel="noopener noreferrer"
                            className="underline hover:text-blue-700">
                            {GATEWAY_INFO[selectedMethod].docsUrl}
                        </a>
                    </p>
                </div>

                {/* Test Mode Toggle */}
                <div className="mt-6">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={testMode}
                            onChange={(e) => setTestMode(e.target.checked)}
                            className="mr-2"
                        />
                        <span className="text-sm text-gray-700">
                            Modo de prueba (usar credenciales de test)
                        </span>
                    </label>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <CreditCard className="w-5 h-5" />
                            Guardar Configuración
                        </>
                    )}
                </button>

                {saveStatus === 'success' && (
                    <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-medium">Configuración guardada</span>
                    </div>
                )}

                {saveStatus === 'error' && (
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium">Error al guardar</span>
                    </div>
                )}
            </div>
        </div>
    );
}
