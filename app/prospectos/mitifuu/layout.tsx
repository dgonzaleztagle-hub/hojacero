import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google'; // Usamos Playfair para un toque "Casona" sutil dentro del minimalismo
import '../../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
    title: 'Mitifuu | Casona & Sabor',
    description: 'Giro desde la cordillera al valle. Comida de autor en Buin.',
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${inter.variable} ${playfair.variable} min-h-screen bg-[#ffffff] text-[#2b2b2b]`}>
            {children}
        </div>
    );
}
