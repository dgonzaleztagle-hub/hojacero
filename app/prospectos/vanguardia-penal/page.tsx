import React from 'react';
import { KineticText } from '@/components/premium/KineticText';
import { VelocityScroll } from '@/components/premium/VelocityScroll';
import { BentoGrid, BentoGridItem } from '@/components/premium/BentoGrid';
// Removed GridPattern import
import { GrainTexture } from '@/components/premium/GrainTexture';
import { AnimatedCounter } from '@/components/premium/AnimatedCounter';
import { MagneticCursor } from '@/components/premium/MagneticCursor';
import Link from 'next/link';

// V4.0 Creative Director: "The Disruptor" + "Neon Toxic" + "Legal Drama"

export default function VanguardiaPenalPage() {
    return (
        <main className="bg-black min-h-screen text-zinc-100 font-mono selection:bg-red-500 selection:text-black">
            {/* GLOBAL ATMOSPHERE */}
            <GrainTexture opacity={0.15} animated={true} />

            {/* SECTION 1: HERO (Cinematic Fullscreen) */}
            <section className="h-screen w-full relative flex flex-col justify-center items-center overflow-hidden border-b-4 border-red-600">
                <div className="absolute inset-0 z-0 opacity-20">
                    {/* Simple Grid Pattern Replacement */}
                    <svg className="w-full h-full text-red-900" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                <div className="z-10 text-center px-6 max-w-7xl">
                    <div className="mb-4 flex items-center justify-center gap-2 text-red-500 tracking-[0.5em] uppercase text-xs animate-pulse">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        System Failure Imminent
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    </div>

                    <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8]">
                        <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
                            When They
                        </span>
                        <KineticText
                            text="COME FOR YOU"
                            className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] block"
                            animation="scale"
                            duration={0.1}
                        />
                    </h1>

                    <p className="mt-8 text-lg md:text-xl max-w-2xl mx-auto text-zinc-400 font-light border-l-2 border-red-500 pl-6 text-left">
                        Criminal Defense for High-Stakes Scenarios. <br />
                        <span className="text-white font-bold">Silence is your only right. Use it.</span>
                    </p>

                    <div className="mt-12 flex flex-col md:flex-row gap-6 justify-center items-center">
                        <MagneticCursor>
                            <button className="bg-red-600 text-black px-12 py-5 font-black uppercase text-lg hover:bg-white transition-colors duration-200">
                                Emergency Line
                            </button>
                        </MagneticCursor>
                        <span className="text-zinc-500 text-sm">24/7 ENCRYPTED CHANNEL</span>
                    </div>
                </div>
            </section>

            {/* SECTION 2: VELOCITY AGGRESSION */}
            <section className="py-24 bg-zinc-950 border-b border-zinc-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-red-900/10 rotate-3 scale-110 pointer-events-none"></div>
                <VelocityScroll
                    text="FRAUD • RICO • CYBERCRIME • HOMICIDE • WHITE COLLAR • CONSPIRACY •"
                    default_velocity={3}
                    className="font-black text-8xl md:text-[12rem] text-zinc-800 opacity-50 uppercase leading-none"
                />
            </section>

            {/* SECTION 3: THE VERDICT (Bento Grid) */}
            <section className="py-32 px-6 max-w-7xl mx-auto">
                <div className="mb-16 border-b border-zinc-800 pb-8 flex justify-between items-end">
                    <h2 className="text-5xl md:text-7xl font-bold uppercase text-white">
                        The <span className="text-red-600">Record</span>
                    </h2>
                    <div className="text-right hidden md:block">
                        <p className="text-zinc-500">SUCCESS RATE</p>
                        <AnimatedCounter to={98} suffix="%" className="text-4xl text-white font-bold" />
                    </div>
                </div>

                <BentoGrid className="md:auto-rows-[25rem]">
                    {/* Item 1: CASE 042 */}
                    <BentoGridItem
                        title={<span className="text-red-500 font-mono">CASE #042</span>}
                        description={
                            <div className="mt-2">
                                <h3 className="text-3xl font-bold text-white mb-2">FEDERAL INDICTMENT</h3>
                                <p className="text-zinc-400">12 Counts of Wire Fraud. 45 Years facing.</p>
                                <div className="mt-8 border border-red-500/30 bg-red-900/10 p-4 inline-block">
                                    <span className="text-red-500 font-black text-2xl tracking-widest">DISMISSED</span>
                                </div>
                            </div>
                        }
                        className="md:col-span-2 bg-zinc-900 border-zinc-800 hover:border-red-600/50 transition-colors"
                    />

                    {/* Item 2: THE SHIELD */}
                    <BentoGridItem
                        title={<span className="text-zinc-500 font-mono">PHILOSOPHY</span>}
                        description={
                            <div className="h-full flex flex-col justify-end">
                                <p className="text-2xl font-light leading-tight text-white">
                                    "We don't negotiate with the system. We break it apart, piece by piece, until there is nothing left to convict."
                                </p>
                            </div>
                        }
                        className="md:col-span-1 bg-zinc-900/50 border-zinc-800"
                        header={<div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-20 hover:opacity-40 transition-opacity"></div>}
                    />

                    {/* Item 3: STATS */}
                    <BentoGridItem
                        className="md:col-span-1 bg-red-700 border-red-600 flex flex-col justify-center items-center text-center p-8"
                        description={
                            <div>
                                <AnimatedCounter to={450} suffix="+" className="text-6xl font-black text-black block mb-2" />
                                <span className="text-black font-bold tracking-widest uppercase">Cases Won</span>
                            </div>
                        }
                    />

                    {/* Item 4: URGENCY */}
                    <BentoGridItem
                        className="md:col-span-2 bg-zinc-900 border-zinc-800 relative overflow-hidden group"
                        description={
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <h3 className="text-4xl font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-600">
                                    They are building their case. <br />
                                    Are you building yours?
                                </h3>
                                <div className="flex justify-end mt-8">
                                    <span className="text-red-500 font-mono text-xl group-hover:translate-x-2 transition-transform">&rarr; SCHEDULE DEFENSE</span>
                                </div>
                            </div>
                        }
                    />

                </BentoGrid>
            </section>

            {/* SECTION 4: FOOTER AGGRESSIVE */}
            <footer className="bg-red-600 text-black py-20 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start">
                    <div>
                        <h2 className="text-8xl font-black tracking-tighter uppercase mb-6">
                            Vanguardia
                        </h2>
                        <p className="font-mono text-lg font-bold">
                            123 LEXINGTON AVE, NYC<br />
                            SECURE LINE: +1 (555) 000-666
                        </p>
                    </div>
                    <div className="mt-12 md:mt-0 text-right">
                        <Link href="#" className="block text-4xl font-bold uppercase hover:text-white transition-colors">Client Login</Link>
                        <Link href="#" className="block text-4xl font-bold uppercase hover:text-white transition-colors mt-2">Press Inquiries</Link>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-20 pt-8 border-t-2 border-black flex justify-between font-mono text-xs uppercase">
                    <span>© 2024 Vanguardia Penal Defense Group.</span>
                    <span>Attorney Advertising. Prior results do not guarantee outcome.</span>
                </div>
            </footer>
        </main>
    );
}
