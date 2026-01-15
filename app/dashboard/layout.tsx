import Sidebar from '@/components/layout/sidebar/Sidebar';
import { DashboardProvider } from './DashboardContext';
import { ThemeWrapper, MainContent } from './ThemeComponents';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardProvider>
            <ThemeWrapper>
                <Sidebar />
                <MainContent>
                    {children}
                </MainContent>
            </ThemeWrapper>
        </DashboardProvider>
    );
}

