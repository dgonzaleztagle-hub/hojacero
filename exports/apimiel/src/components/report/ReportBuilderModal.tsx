'use client';

import React, { useRef, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'sonner';
import { Loader2, CloudUpload, Printer, LayoutTemplate } from 'lucide-react';
import { ReportTemplate } from './ReportTemplate';

interface ReportBuilderModalProps {
    isOpen: boolean;
    onClose: () => void;
    lead: any;
    isDark: boolean;
    onSaveSuccess?: (url: string) => void;
}

export const ReportBuilderModal = ({ isOpen, onClose, lead, isDark, onSaveSuccess }: ReportBuilderModalProps) => {
    const componentRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();
    const [isUploading, setIsUploading] = useState(false);

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

    const handleCloudSave = async () => {
        if (!componentRef.current || !lead?.id) return;
        setIsUploading(true);
        const toastId = toast.loading('Generando PDF y subiendo a la nube...');

        try {
            // 1. Capture content with html-to-image (Avoids 'lab()' color errors)
            const element = componentRef.current;
            const width = element.offsetWidth;
            const height = element.offsetHeight;
            const pixelRatio = 2;

            const imgData = await toPng(element, {
                quality: 0.95,
                pixelRatio: pixelRatio,
                backgroundColor: '#ffffff',
            });

            // 2. Generate PDF
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [width * pixelRatio, height * pixelRatio]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, width * pixelRatio, height * pixelRatio);
            const pdfBlob = pdf.output('blob');

            // 3. Upload to Supabase
            const fileName = `strategy_${lead.db_id || lead.id}_${Date.now()}.pdf`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('client-assets')
                .upload(fileName, pdfBlob, {
                    contentType: 'application/pdf',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // 4. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('client-assets')
                .getPublicUrl(fileName);

            // 5. Update Lead Record
            const { error: dbError } = await supabase
                .from('leads')
                .update({ pdf_url: publicUrl })
                .eq('id', lead.id);

            if (dbError) throw dbError;

            toast.success('Reporte guardado en la nube y vinculado al Lead', { id: toastId });
            onSaveSuccess?.(publicUrl);
            onClose();

        } catch (error: any) {
            console.error('Error saving PDF:', error);
            toast.error('Error al guardar: ' + error.message, { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

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
                                Configura el reporte PDF antes de exportarlo o guardarlo.
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
                        {/* CLOUD SAVE BUTTON */}
                        <button
                            onClick={handleCloudSave}
                            disabled={isUploading}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center gap-2"
                        >
                            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CloudUpload className="w-5 h-5" />}
                            {isUploading ? 'Subiendo...' : 'Guardar en Nube'}
                        </button>

                        <button
                            onClick={handlePrint}
                            className={`w-full py-3 font-bold uppercase tracking-widest text-xs rounded-xl transition-all border flex items-center justify-center gap-2 ${isDark ? 'bg-zinc-800 border-white/5 text-zinc-300 hover:bg-zinc-700' : 'bg-white border-zinc-200 text-gray-700 hover:bg-gray-50'}`}
                        >
                            <Printer className="w-4 h-4" />
                            Descargar Local
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
