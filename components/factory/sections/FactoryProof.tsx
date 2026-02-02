
'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface FactoryProofProps {
    content: {
        title: string;
        testimonials: Array<{
            name: string;
            text: string;
            stars: number;
        }>;
    };
    primaryColor?: string;
}

export default function FactoryProof({ content, primaryColor = '#00f0ff' }: FactoryProofProps) {
    return (
        <section className="py-24 px-6 bg-black">
            <div className="container mx-auto">
                <h2 className="text-3xl md:text-4xl font-black text-center text-white mb-16 uppercase tracking-tighter">
                    {content.title}
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {content.testimonials?.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-[24px] bg-white/5 border border-white/10 relative group hover:bg-white/[0.07] transition-all"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(t.stars)].map((_, j) => (
                                    <Star key={j} className="w-4 h-4 fill-current" style={{ color: primaryColor }} />
                                ))}
                            </div>

                            <p className="text-gray-300 italic mb-6 leading-relaxed text-sm">
                                "{t.text}"
                            </p>

                            <div className="pt-6 border-t border-white/5">
                                <span className="font-bold text-white text-sm uppercase tracking-wider">{t.name}</span>
                                <span className="block text-[10px] text-gray-500 font-bold uppercase mt-1">Cliente Verificado</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
