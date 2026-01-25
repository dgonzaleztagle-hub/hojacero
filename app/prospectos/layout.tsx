import { DemoTracker } from '@/components/tracking/DemoTracker';

export default function ProspectosLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* Tracking invisible de visitas a demos */}
            <DemoTracker />
            {children}
        </>
    );
}
