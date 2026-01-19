'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Tipos de Datos Mock
export type ClientData = {
    id: string;
    name: string;
    stats: {
        phase: string;
        health: 'NOMINAL' | 'ATENCIÓN' | 'CRÍTICO';
        nextDelivery: string;
        progress: number;
    };
    activity: Array<{ id: number; text: string; time: string; type: 'success' | 'warning' | 'info' }>;
    emails: Array<{ id: number; from: string; subject: string; body: string; time: string; unread: boolean; preview: string }>;
};

// Datos Mockeados para 3 Clientes
const MOCK_CLIENTS: ClientData[] = [
    {
        id: 'cafe-x',
        name: 'Cafetería X',
        stats: { phase: 'DISEÑO', health: 'NOMINAL', nextDelivery: 'Viernes, 14 — 10:00 AM', progress: 35 },
        activity: [
            { id: 1, text: 'Assets de logo subidos a la Bóveda', time: 'hace 2 horas', type: 'success' },
            { id: 2, text: 'Wireframe del Home pendiente de aprobación', time: 'hace 5 horas', type: 'warning' },
        ],
        emails: [
            { id: 1, from: 'Daniel (Dev)', subject: 'Avance: Home v2', preview: 'Adjunto layouts...', body: 'Hola,\n\nAvances del home listas para revisión.', time: '10:42 AM', unread: true },
            { id: 2, from: 'Gaston (Mkt)', subject: 'SEO Local', preview: 'Analisis de competencia...', body: 'El mercado de cafeterías en el sector está saturado, pero...', time: 'Ayer', unread: false },
        ]
    },
    {
        id: 'tech-startup',
        name: 'TechStartup.io',
        stats: { phase: 'DESARROLLO', health: 'ATENCIÓN', nextDelivery: 'Lunes, 17 — 15:00 PM', progress: 60 },
        activity: [
            { id: 1, text: 'Integración de Pagos Fallida', time: 'hace 30 min', type: 'warning' },
            { id: 2, text: 'Backend desplegado en Staging', time: 'hace 1 hora', type: 'success' },
        ],
        emails: [
            { id: 1, from: 'Stripe', subject: 'ALERTA: Webhook fallido', preview: 'Error 500 en endpoint...', body: 'Detectamos fallos en tu endpoint de pagos.', time: '12:00 PM', unread: true },
        ]
    },
    {
        id: 'legal-corp',
        name: 'Bufete Legal',
        stats: { phase: 'LANZAMIENTO', health: 'NOMINAL', nextDelivery: 'Hoy — 18:00 PM', progress: 95 },
        activity: [
            { id: 1, text: 'DNS Propagados', time: 'hace 10 min', type: 'success' },
            { id: 2, text: 'Certificado SSL Activo', time: 'hace 15 min', type: 'success' },
        ],
        emails: [
            { id: 1, from: 'Gaston (Mkt)', subject: 'Campaña Linkedin Lista', preview: 'Textos aprobados...', body: 'Lanzamos mañana a primera hora.', time: '09:00 AM', unread: false },
        ]
    }
];

type UserRole = 'ADMIN' | 'CLIENT';
type Theme = 'dark' | 'light';

type DashboardContextType = {
    currentClient: ClientData;
    switchClient: (id: string) => void;
    clients: ClientData[];
    userRole: UserRole;
    toggleUserRole: () => void;
    theme: Theme;
    toggleTheme: () => void;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const [currentClient, setCurrentClient] = useState(MOCK_CLIENTS[0]);
    const [userRole, setUserRole] = useState<UserRole>('ADMIN');
    const [theme, setTheme] = useState<Theme>('dark');

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('hojacero-theme') as Theme;
        if (savedTheme) setTheme(savedTheme);
    }, []);

    const switchClient = (id: string) => {
        const client = MOCK_CLIENTS.find(c => c.id === id);
        if (client) setCurrentClient(client);
    };

    const toggleUserRole = () => {
        setUserRole(prev => prev === 'ADMIN' ? 'CLIENT' : 'ADMIN');
    };

    const toggleTheme = () => {
        setTheme(prev => {
            const newTheme = prev === 'dark' ? 'light' : 'dark';
            localStorage.setItem('hojacero-theme', newTheme);
            return newTheme;
        });
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <DashboardContext.Provider value={{
            currentClient, switchClient, clients: MOCK_CLIENTS,
            userRole, toggleUserRole,
            theme, toggleTheme,
            isSidebarOpen, toggleSidebar, closeSidebar
        }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (!context) throw new Error('useDashboard must be used within DashboardProvider');
    return context;
}

