import Sidebar from '@/components/layout/sidebar/Sidebar';
import { DashboardProvider } from './DashboardContext';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardProvider>
            <div className="min-h-screen bg-neutral-950 text-white flex dashboard-container">
                <Sidebar />
                <main className="flex-1 ml-64 p-8 bg-neutral-950">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </DashboardProvider>
    );
}
