export interface CredentialField {
    id: string;
    label: string;
    value: string;
    isSecret: boolean;
}

export interface CredentialGroup {
    id: string;
    name: string;
    fields: CredentialField[];
}

export interface Cliente {
    id: string;
    client_name: string;
    site_url: string;
    plan_type: string;
    monto_mensual: number;
    monto_implementacion: number;
    cuotas_implementacion: number;
    cuotas_pagadas: number;
    dia_cobro: number;
    contract_start: string;
    contract_end: string;
    email_contacto: string;
    is_active: boolean;
    status?: string; // Killswitch status ('active' | 'suspended')
    ultimo_pago: string | null;
    total_pagado: number;
    alertas_count: number;
    credentials?: {
        user?: string;
        password?: string;
        host?: string;
        hosting_type?: string;
    } | CredentialGroup[]; // Union type for backward compat
    hosting_provider?: string;
    hosting_type?: string;
}

export interface ChatMessage {
    id: string;
    author: 'Yo' | 'Gaston' | 'Sistema';
    message: string;
    created_at: string;
}
