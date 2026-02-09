import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ reportId: string }> }
) {
    let browser;

    try {
        const { reportId } = await params;

        // URL de la vista de impresión
        const printUrl = `${req.nextUrl.origin}/reporte/${reportId}/print`;

        console.log('Iniciando generación de PDF para:', printUrl);

        // Lanzar Puppeteer con configuración robusta
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();

        console.log('Navegando a:', printUrl);

        // Navegar a la página de impresión
        await page.goto(printUrl, {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        console.log('Generando PDF...');

        // Generar PDF
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                right: '15mm',
                bottom: '20mm',
                left: '15mm'
            }
        });

        await browser.close();

        console.log('PDF generado exitosamente');

        // Retornar PDF
        return new NextResponse(Buffer.from(pdf), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="reporte-territorial-${reportId}.pdf"`
            }
        });

    } catch (error: any) {
        console.error('Error generando PDF:', error);

        if (browser) {
            await browser.close().catch(console.error);
        }

        return NextResponse.json(
            {
                error: 'Error generando PDF',
                details: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}
