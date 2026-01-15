import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: '360 Sports | High Performance Evolution',
    description: 'Propuesta de Rediseño Premium para 360 Sports',
};

export default function LeadLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${inter.className} bg-black text-white selection:bg-[#ccff00] selection:text-black antialiased`}>
            {children}
        </div>
    );
}
