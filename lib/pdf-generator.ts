/**
 * GENERADOR DE PDF TERRITORIAL - Versión Optimizada (Denso y Sin Cortes)
 * Genera reportes profesionales en PDF replicando el diseño del reporte manual de Gastón
 * HojaCero Intelligence © 2026
 */

import jsPDF from 'jspdf';

const COLORS = {
    primary: '#10b981',
    danger: '#ef4444',
    text: '#18181b',
    muted: '#71717a',
};

export async function generateTerritorialPDF(report: any): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    let currentY = margin;

    // Helper para agregar texto con manejo automático de páginas
    const addText = (text: string, fontSize: number = 10, fontStyle: 'normal' | 'bold' | 'italic' = 'normal', indent: number = 0) => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', fontStyle);

        const lines = pdf.splitTextToSize(text, contentWidth - indent);
        const lineHeight = fontSize * 0.4; // Más compacto

        // Check si necesitamos nueva página
        if (currentY + (lines.length * lineHeight) > pageHeight - margin) {
            pdf.addPage();
            currentY = margin;
        }

        pdf.text(lines, margin + indent, currentY);
        currentY += (lines.length * lineHeight) + 3; // Espaciado reducido
    };

    const addSpace = (mm: number = 5) => {
        currentY += mm;
    };

    // ============================================
    // PORTADA
    // ============================================

    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('REPORTE DE INTELIGENCIA TERRITORIAL', pageWidth / 2, 40, { align: 'center' });

    currentY = 60;
    addText(`Ubicacion: ${report.address || 'N/A'}`, 12);
    addText(`Proyecto Evaluado: ${report.business_type || 'Gastronomia Asiatica'}`, 12);

    const fecha = new Date().toLocaleDateString('es-CL', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    addText(`Fecha: ${fecha}`, 12);

    currentY = 150;
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('HOJACERO INTELLIGENCE', pageWidth / 2, currentY, { align: 'center' });

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Datos que construyen negocios', pageWidth / 2, currentY + 8, { align: 'center' });

    // ============================================
    // MAPA
    // ============================================

    pdf.addPage();
    currentY = margin;

    addText('MAPA TERRITORIAL', 16, 'bold');
    addSpace(5);

    if (report.map_url) {
        try {
            const mapResponse = await fetch(report.map_url);
            const mapBlob = await mapResponse.blob();
            const mapDataUrl = await blobToDataURL(mapBlob);

            const mapWidth = contentWidth;
            const mapHeight = (mapWidth * 600) / 1000;

            pdf.addImage(mapDataUrl, 'PNG', margin, currentY, mapWidth, mapHeight);
            currentY += mapHeight + 5;

            pdf.setFontSize(9);
            pdf.setTextColor(COLORS.danger);
            pdf.text('Tu ubicacion', margin, currentY);
            pdf.setTextColor(COLORS.primary);
            pdf.text('Competidores', margin + 40, currentY);
            pdf.setTextColor(COLORS.text);
            currentY += 10;
        } catch (error) {
            addText('(Mapa no disponible)', 10);
        }
    }

    // ============================================
    // ECOSISTEMA
    // ============================================

    if (report.analysis?.ecosistema) {
        pdf.addPage();
        currentY = margin;

        const eco = report.analysis.ecosistema;

        addText('[PAGINA 1: EL ECOSISTEMA DEL BARRIO]', 14, 'bold');
        addText('[PIN] Contexto del Barrio', 12, 'bold');
        addSpace(3);

        addText(`Tipo de Zona: ${eco.tipo_zona || 'N/A'}`, 10, 'bold');
        addSpace(2);

        addText('Dinamica:', 10, 'bold');
        addText(eco.dinamica || 'N/A', 10, 'normal', 3);
        addSpace(3);

        if (eco.conectividad) {
            addText('Conectividad:', 10, 'bold');
            addText(eco.conectividad, 10, 'normal', 3);
        }
    }

    // ============================================
    // DEMOGRAFÍA
    // ============================================

    if (report.analysis?.demografia) {
        pdf.addPage();
        currentY = margin;

        const demo = report.analysis.demografia;

        addText('[PAGINA 2: TU CLIENTE OBJETIVO (DEMOGRAFIA)]', 14, 'bold');
        addText('[AUTO] Quien te va a comprar?', 12, 'bold');
        addSpace(3);

        addText('Perfil:', 10, 'bold');
        addText(demo.perfil_principal || 'N/A', 10, 'normal', 3);
        addSpace(3);

        if (demo.dato_clave) {
            addText('o Dato Clave:', 10, 'italic');
            addText(demo.dato_clave, 10, 'italic', 5);
            addSpace(3);
        }

        addText('Poder Adquisitivo:', 10, 'bold');
        addText(demo.poder_adquisitivo || 'N/A', 10, 'normal', 3);
        addSpace(3);

        addText(`Densidad: ${demo.densidad || 'N/A'}`, 10, 'bold');
    }

    // ============================================
    // FLUJOS
    // ============================================

    if (report.analysis?.flujos) {
        pdf.addPage();
        currentY = margin;

        const flujos = report.analysis.flujos;

        addText('[PAGINA 3: FLUJOS Y VISIBILIDAD]', 14, 'bold');
        addText('[WALK] Analisis de Trafico', 12, 'bold');
        addSpace(3);

        addText('Flujo Vehicular:', 10, 'bold');
        addText(flujos.flujo_vehicular || 'N/A', 10, 'normal', 3);
        addSpace(3);

        addText('Flujo Peatonal:', 10, 'bold');
        addText(flujos.flujo_peatonal || 'N/A', 10, 'normal', 3);
        addSpace(3);

        if (flujos.polos_atraccion) {
            addText('Polos de Atraccion (Anclas):', 10, 'bold');
            addText(flujos.polos_atraccion, 10, 'normal', 3);
        }
    }

    // ============================================
    // COMPETENCIA
    // ============================================

    if (report.analysis?.competencia) {
        pdf.addPage();
        currentY = margin;

        addText('[PAGINA 4: SCAN DE MERCADO (APPS & COMPETENCIA)]', 14, 'bold');
        addText('[FOOD] Analisis de Saturacion Gastronomica (Radio 3km)', 12, 'bold');
        addText('Metodologia: Rastreo de oferta activa en Google Maps', 9, 'italic');
        addSpace(5);

        const comp = report.analysis.competencia;

        // Renderizar todo el contenido de competencia
        Object.entries(comp).forEach(([key, value]) => {
            if (key === 'titulo') return;

            if (typeof value === 'string' && value.trim()) {
                addText(value, 10, 'normal');
                addSpace(4);
            }
        });
    }

    // ============================================
    // VEREDICTO
    // ============================================

    if (report.analysis?.veredicto) {
        pdf.addPage();
        currentY = margin;

        const ver = report.analysis.veredicto;

        addText('[PAGINA 5: VEREDICTO HOJACERO]', 14, 'bold');
        addText('[CHART] CONCLUSION', 12, 'bold');
        addSpace(3);

        addText(`[CHECK] VIABILIDAD: ${ver.viabilidad || 'N/A'}`, 11, 'bold');
        addSpace(5);

        addText(ver.resumen || 'N/A', 10, 'normal');
        addSpace(5);

        if (ver.estrategia_recomendada) {
            addText(`[ROCKET] La Estrategia Recomendada:`, 11, 'bold');
            addText(`"${ver.estrategia_recomendada}"`, 10, 'normal', 3);
            addSpace(5);
        }

        if (ver.recomendacion_final) {
            addText(ver.recomendacion_final, 10, 'normal');
        }
    }

    // ============================================
    // DIGITAL
    // ============================================

    if (report.analysis?.digital) {
        pdf.addPage();
        currentY = margin;

        const digital = report.analysis.digital;

        addText('[PAGINA 6: RECOMENDACION DIGITAL]', 14, 'bold');
        addText('[PHONE] Como llenar el local?', 12, 'bold');
        addSpace(3);

        addText(digital.contexto || 'N/A', 10, 'normal');
        addSpace(5);

        if (digital.tacticas) {
            addText('Tu Plan de Ataque Digital:', 10, 'bold');
            addSpace(2);
            addText(digital.tacticas, 10, 'normal', 3);
        }

        // CONTRAPORTADA en la misma página si hay espacio
        if (currentY < pageHeight - 100) {
            currentY = pageHeight - 90;
        } else {
            pdf.addPage();
            currentY = pageHeight - 90;
        }

        pdf.setDrawColor(COLORS.muted);
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 8;

        addText('[CONTRATAPA]', 12, 'bold');
        addText('Listo para cocinar el exito?', 11, 'bold');
        addText('Este reporte valido tu idea. Ahora construyamos tu marca.', 10, 'normal');
        addSpace(3);
        addText('Cotiza con nosotros creacion de logo, sitio web y tu imagen de marketing digital.', 10, 'normal');
        addSpace(5);
        addText('HOJACERO INTELLIGENCE', 12, 'bold');
        addText('Datos que construyen negocios.', 10, 'italic');
    }

    // Descargar
    const filename = `territorial-${(report.address || 'reporte').replace(/\s+/g, '-').toLowerCase()}.pdf`;
    pdf.save(filename);
}

function blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
