import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";

const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
});

const dmSans = DM_Sans({
    variable: "--font-dm",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Family Smile Dental Clinic | Aesthetic & Health",
    description: "Clínica especializada en periodoncia y medicina estética facial.",
};

export default function FamilySmileLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={`${playfair.variable} ${dmSans.variable} font-sans bg-[#FAFAF9] text-zinc-900 min-h-screen selection:bg-[#2DD4BF]/30 !cursor-auto`}>
            {children}
        </div>
    );
}
