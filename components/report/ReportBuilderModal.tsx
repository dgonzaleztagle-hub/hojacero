'use client';

import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { ReportTemplate } from './ReportTemplate';
import { Printer, X, Eye, EyeOff, LayoutTemplate, FileText } from 'lucide-react';

interface ReportBuilderModalProps {
    isOpen: boolean;
    onClose: () => void;
    lead: any;
    isDark: boolean;
}

export const ReportBuilderModal = ({ isOpen, onClose, lead, isDark }: ReportBuilderModalProps) => {
    const componentRef = useRef<HTMLDivElement>(null);
    const [customizations, setCustomizations] = useState({
        showCover: true,
        showTechSpecs: true,
        showActionPlan: true,
        showContentIdeas: true,
        tone: 'corporate' as 'corporate' | 'friendly' | 'urgent',
    });

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `H0_Strategy_${(lead?.title || 'Relatorio').replace(/\s+/g, '_')}`,
    });

    if (!isOpen) return null;

    const analysis = lead.source_data?.deep_analysis || {};

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className={`w-full max-w-7xl h-[90vh] rounded-3xl border flex overflow-hidden shadow-2xl ${isDark ? 'bg-zinc-950 border-white/10' : 'bg-white border-zinc-200'}`}>

                {/* --- LEFT: CONTROLS --- */}
                <div className={`w-80 flex-shrink-0 border-r p-6 flex flex-col justify-between ${isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="space-y-8">
                        <div>
                            <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                <LayoutTemplate className="w-5 h-5 text-cyan-400" />
                                Report Builder
                            </h2>
                            <p className={`text-xs mt-2 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                Configura el reporte PDF antes de exportarlo.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Secciones</h3>

                            {/* Toggle: Cover */}
                            <label className="flex items-center justify-between cursor-pointer group">
                                <span className={`text-sm ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>Portada de Impacto</span>
                                <button
                                    onClick={() => setCustomizations(c => ({ ...c, showCover: !c.showCover }))}
                                    className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${customizations.showCover ? 'bg-cyan-500' : 'bg-zinc-600'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${customizations.showCover ? 'translate-x-4' : ''}`} />
                                </button>
                            </label>

                            {/* Toggle: Tech Specs */}
                            <label className="flex items-center justify-between cursor-pointer group">
                                <span className={`text-sm ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>Datos Técnicos</span>
                                <button
                                    onClick={() => setCustomizations(c => ({ ...c, showTechSpecs: !c.showTechSpecs }))}
                                    className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${customizations.showTechSpecs ? 'bg-cyan-500' : 'bg-zinc-600'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${customizations.showTechSpecs ? 'translate-x-4' : ''}`} />
                                </button>
                            </label>

                            {/* Toggle: Action Plan */}
                            <label className="flex items-center justify-between cursor-pointer group">
                                <span className={`text-sm ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>Plan de Acción</span>
                                <button
                                    onClick={() => setCustomizations(c => ({ ...c, showActionPlan: !c.showActionPlan }))}
                                    className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${customizations.showActionPlan ? 'bg-cyan-500' : 'bg-zinc-600'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${customizations.showActionPlan ? 'translate-x-4' : ''}`} />
                                </button>
                            </label>

                            {/* Toggle: Creative Content */}
                            <label className="flex items-center justify-between cursor-pointer group">
                                <span className={`text-sm ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>Ideas Creativas</span>
                                <button
                                    onClick={() => setCustomizations(c => ({ ...c, showContentIdeas: !c.showContentIdeas }))}
                                    className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${customizations.showContentIdeas ? 'bg-cyan-500' : 'bg-zinc-600'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${customizations.showContentIdeas ? 'translate-x-4' : ''}`} />
                                </button>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handlePrint}
                            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center gap-2"
                        >
                            <Printer className="w-5 h-5" />
                            Generar PDF
                        </button>
                        <button
                            onClick={onClose}
                            className={`w-full py-3 font-medium text-sm rounded-xl transition-colors ${isDark ? 'text-zinc-400 hover:bg-white/5' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>

                {/* --- RIGHT: PREVIEW --- */}
                <div className={`flex-1 overflow-y-auto p-12 custom-scrollbar flex justify-center ${isDark ? 'bg-zinc-950' : 'bg-gray-100'}`}>
                    <div className="transform scale-[0.6] origin-top shadow-2xl">
                        <ReportTemplate
                            ref={componentRef}
                            lead={lead}
                            analysis={analysis}
                            customizations={customizations}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
