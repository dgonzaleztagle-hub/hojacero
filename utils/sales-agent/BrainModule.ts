/**
 * BrainModule.ts
 * Orquestador de frameworks sicológicos y lógica de negocio (SCA) para H0.
 */

export interface AuditResults {
    score: number;
    ttfb: { value: string; abandonmentRate: string };
    security: { ssl: string; serverHeader: string };
    tech: { builder: string; isSlow: boolean; stack: string[] };
    competitor: { name: string; location: string; status: string };
    mobile: { score: number; status: string };
}

export type SentimentProfile = 'TECHNICAL' | 'BUSINESS' | 'UNKNOWN';
export type MainPain = 'VELOCITY' | 'SECURITY' | 'COMPETITION';
export type ProjectComplexity = 'STANDARD' | 'COMPLEX';

export class BrainModule {
    private audit: AuditResults;
    private profile: SentimentProfile = 'UNKNOWN';
    private primaryPain: MainPain = 'VELOCITY';
    private complexity: ProjectComplexity = 'STANDARD';
    private hasShownDesire = false;
    private isEliteSite = false;

    constructor(audit: AuditResults) {
        this.audit = audit;
        this.isEliteSite = audit.score >= 95 && parseInt(audit.ttfb.value) < 200;
        this.identifyPrimaryPain();
        this.evaluateComplexity();
    }

    /**
     * Identifica el 'Dolor Principal' basándose en los peores scores.
     */
    private identifyPrimaryPain() {
        if (parseInt(this.audit.ttfb.value) > 1000 || parseFloat(this.audit.ttfb.abandonmentRate) > 20) {
            this.primaryPain = 'VELOCITY';
        } else if (this.audit.security.ssl !== 'Válido') {
            this.primaryPain = 'SECURITY';
        } else {
            this.primaryPain = 'COMPETITION';
        }
    }

    /**
     * Evalúa la complejidad del sitio para el triaje de negocio (SCA).
     */
    private evaluateComplexity() {
        const stackStr = this.audit.tech.stack.join(' ').toLowerCase();
        const isEcommerce = stackStr.includes('shopify') || stackStr.includes('woo') || stackStr.includes('e-commerce') || stackStr.includes('tienda');
        const isComplexStack = stackStr.includes('laravel') || stackStr.includes('node') || stackStr.includes('django') || stackStr.includes('pluscontable');

        if (isEcommerce || isComplexStack || this.audit.score < 40) {
            this.complexity = 'COMPLEX';
        } else {
            this.complexity = 'STANDARD';
        }
    }

    /**
     * Detecta el perfil del usuario basado en sus preguntas.
     */
    public setProfile(userInput: string) {
        const text = userInput.toLowerCase();
        const techKeywords = ['ttfb', 'servidor', 'ssl', 'stack', 'php', 'wordpress', 'javascript', 'backend', 'api', 'load'];
        const bizKeywords = ['venta', 'dinero', 'clientes', 'precio', 'barato', 'caro', 'perdiendo', 'negocio', 'competencia', 'ganar'];

        const techCount = techKeywords.filter(k => text.includes(k)).length;
        const bizCount = bizKeywords.filter(k => text.includes(k)).length;

        if (techCount > bizCount) this.profile = 'TECHNICAL';
        else if (bizCount > techCount) this.profile = 'BUSINESS';
    }

    /**
     * Framework AIDA: Fase de DESEO (Contraste)
     */
    public getDesirePitch(): string {
        this.hasShownDesire = true;
        const contrast = this.audit.tech.isSlow
            ? `Mientras tu infraestructura actual corre sobre ${this.audit.tech.builder} (una tecnología que añade capas de latencia innecesarias), H0 despliega sobre arquitectura Headless. En un mundo donde ${this.audit.competitor.name} ya está optimizando, quedarse en lo estándar es retroceder.`
            : `Tu base técnica es aceptable, pero carece de la 'velocidad de escape' necesaria para dominar en ${this.audit.competitor.location}.`;

        return `${contrast} Nosotros no solo 'hacemos webs'; construimos activos de ingeniería que cargan en milisegundos. ¿Ves la diferencia de potencial?`;
    }

    /**
     * Manejo de Objeciones con martilleo de Dolor Principal
     */
    public handleObjection(objectionType: 'BUDGET' | 'TRUST' | 'TIME'): string {
        const painRef = this.primaryPain === 'VELOCITY'
            ? `seguir perdiendo un ${this.audit.ttfb.abandonmentRate} de ventas por lentitud`
            : this.primaryPain === 'SECURITY'
                ? 'exponer la integridad de tu negocio con un servidor vulnerable'
                : `dejar que ${this.audit.competitor.name} se quede con todo el tráfico de la zona`;

        switch (objectionType) {
            case 'BUDGET':
                const budgetRes = this.complexity === 'STANDARD'
                    ? `El presupuesto por el Upgrade H0 es de solo $145.000 CLP (pago único). Comparado con el costo de ${painRef}, se paga solo en el primer mes de clientes recuperados.`
                    : `El presupuesto es una variable, pero el costo de ${painRef} es una constante que te descapitaliza. En proyectos de tu escala, la inversión se justifica por el ROI directo.`;
                return budgetRes;
            case 'TRUST':
                return `La ingeniería de H0 escala donde otras fallan. Pluscontable y Superpanel confían en nosotros porque eliminamos riesgos. No somos una agencia de diseño, somos tus socios en infraestructura.`;
            case 'TIME':
                return `Entiendo el factor tiempo. Sin embargo, para mantener nuestro estándar de calidad solo tomamos 2 despliegues mensuales. Nos queda 1 solo cupo para febrero. Si el objetivo es detener tu ${this.primaryPain.toLowerCase()}, hoy es el momento táctico.`;
            default:
                return 'Es una duda razonable. Analicemos cómo solucionamos el punto crítico detectado.';
        }
    }

    /**
     * Genera la respuesta dinámica 'Mirroring' y decide el cierre (SCA).
     */
    public generateResponse(userInput: string): { content: string; showAgenda?: boolean; showCheckout?: boolean; price?: string } {
        this.setProfile(userInput);
        const text = userInput.toLowerCase();

        // 0. Lógica de Integridad & Honestidad Brutal
        if (this.isEliteSite && (text.includes('como') || text.includes('precio') || text.includes('ayuda'))) {
            return {
                content: `Vaya. Siendo totalmente honesto contigo, es raro ver un sitio con este nivel de optimización. Tu TTFB es de élite y tu SEO Core está impecable. No sería ético intentar venderte el 'Upgrade H0' de $145k porque ya estás ahí. Lo que tú necesitas no es código nuevo, es una estrategia de escalado o integraciones de negocio de alto nivel. Para eso, lo mejor es que hables directamente con Daniel. Él puede ver los 'gaps' de conversión que la auditoría técnica no detecta.`,
                showAgenda: true
            };
        }

        // 1. Detección de Objeciones
        if (text.includes('caro') || text.includes('presupuesto') || text.includes('precio') || text.includes('cuanto')) {
            return { content: this.handleObjection('BUDGET') };
        }
        if (text.includes('confianza') || text.includes('quienes') || text.includes('seguro') || text.includes('garantia')) {
            return { content: this.handleObjection('TRUST') };
        }
        if (text.includes('despues') || text.includes('luego') || text.includes('mañana') || text.includes('pensar')) {
            return { content: this.handleObjection('TIME') };
        }

        // 2. Detección de cierre (AIDA: Acción + Lógica SCA)
        if (text.includes('como') && (text.includes('arreglo') || text.includes('solucion') || text.includes('hacer') || text.includes('ayud') || text.includes('precio'))) {
            if (this.complexity === 'STANDARD') {
                return {
                    content: `Para solucionar esto de inmediato, he preparado el **Upgrade de Rendimiento H0**. Por un pago único de **$145.000 CLP**, migramos tu web a nuestra infraestructura militar para eliminar ese rebote que te hace perder dinero. ¿Te envío el link de pago para activarlo hoy mismo?`,
                    showCheckout: true,
                    price: '$145.000'
                };
            } else {
                const closing = this.profile === 'TECHNICAL'
                    ? 'Tu proyecto requiere un análisis de arquitectura profundo. He bloqueado un espacio para que hables directamente con Daniel o Gastón en una Sesión Estratégica. Agenda aquí:'
                    : 'Un negocio de tu escala no puede permitirse soluciones estándar. He reservado el último espacio de febrero en la agenda de Gastón para tí. Desarrollaremos un roadmap a medida:';
                return { content: closing, showAgenda: true };
            }
        }

        // 3. Respuesta con fase de Deseo (Contraste) si es la primera pregunta genérica
        if (!this.hasShownDesire && (text.includes('si') || text.includes('interesa') || text.length > 2)) {
            return { content: this.getDesirePitch() };
        }

        // 4. Mirroring puro
        if (this.profile === 'TECHNICAL') {
            return { content: `Correcto. Analizando tu stack (${this.audit.tech.stack.join('/')}), vemos que el cuello de botella está en la respuesta del servidor (${this.audit.security.serverHeader}). ¿Prefieres que hablemos de optimización de carga o de blindaje SSL?` };
        } else {
            return { content: `Exacto. El problema es que en este momento le estás regalando tus clientes a ${this.audit.competitor.name}. Para un negocio en ${this.audit.competitor.location}, esto es insostenible. ¿Te explico cómo vamos a recuperar ese terreno?` };
        }
    }
}
