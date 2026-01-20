import { Playfair_Display, Inter } from 'next/font/google';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './globals.css';

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
});

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

export const metadata = {
    title: 'Apimiel | Arquitectura Líquida & Precisión Orgánica',
    description: 'Miel cruda de exportación desde los bosques endémicos de Santa Bárbara, Biobío.',
};

export default function ApimielLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${playfair.variable} ${inter.variable} font-sans bg-[#1A1A1A] text-[#FDF5E6] antialiased selection:bg-[#D4AF37] selection:text-[#1A1A1A]`}>
            <Navbar />
            <div className="relative z-10">
                {children}
            </div>
            <Footer />
        </div>
    );
}
