export type Lesson = {
    id: string;
    title: string;
    content: string; // Markdown-like or HTML
};

export type Question = {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number; // Index
    explanation: string;
};

export type Module = {
    id: string;
    title: string;
    description: string;
    lessons: Lesson[];
    quiz: Question[];
    passingScore: number; // e.g. 80%
};

export const ACADEMY_CONTENT: Record<string, Module> = {
    'module-01': {
        id: 'module-01',
        title: 'Módulo 1: La Cartera Growth',
        description: 'Domina la visualización de clientes y la salud del ecosistema.',
        lessons: [
            {
                id: '1.1',
                title: 'Navegación y Búsqueda',
                content: `
                    <h3 class="text-xl font-bold text-white mb-4">Tu centro de control móvil</h3>
                    <p class="mb-4">El Roster de Clientes es tu primera parada. Aquí puedes:</p>
                    <ul class="list-disc pl-6 space-y-2 mb-6 text-zinc-300">
                        <li><strong>Buscar por nombre o dominio:</strong> Usa la barra superior para encontrar clientes rápidamente.</li>
                        <li><strong>Acceso Directo:</strong> Haz click en el dominio para abrir la web del cliente.</li>
                        <li><strong>Filtros:</strong> Clasifica clientes por el tipo de plan (Medium, Enterprise o Custom).</li>
                    </ul>
                `
            },
            {
                id: '1.2',
                title: 'Interpretando el Health Score',
                content: `
                    <h3 class="text-xl font-bold text-white mb-4">¿Cuál es la salud real?</h3>
                    <p class="mb-4">El Health Score (0-100) mide qué tan al día estamos con el cliente:</p>
                    <ul class="list-disc pl-6 space-y-2 mb-6 text-zinc-300">
                        <li><span class="text-green-500 font-bold">80-100:</span> Todo en orden. Cliente feliz.</li>
                        <li><span class="text-amber-500 font-bold">50-79:</span> Cuidado. Hay tareas HIGH pendientes.</li>
                        <li><span class="text-red-500 font-bold">0-49:</span> Peligro. Riesgo inminente de que el cliente se vaya.</li>
                    </ul>
                `
            }
        ],
        quiz: [
            {
                id: 'q1',
                text: '¿Qué indica un Health Score en color rojo?',
                options: ['Que el cliente no ha pagado', 'Que hay un riesgo alto de pérdida del cliente por falta de actividad/cumplimiento', 'Que la web está caída'],
                correctAnswer: 1,
                explanation: 'La salud mide operativos, si está en rojo es porque no estamos cumpliendo el plan.'
            }
        ],
        passingScore: 100
    },
    'module-02': {
        id: 'module-02',
        title: 'Módulo 2: Gestión de Tareas',
        description: 'Protocolo de prioridades y evidencias de trabajo.',
        lessons: [
            {
                id: '2.1',
                title: 'El Modal de Comando',
                content: `
                    <h3 class="text-xl font-bold text-white mb-4">Editar con precisión</h3>
                    <p class="mb-4">Al abrir una tarea, puedes ajustar:</p>
                    <ul class="list-disc pl-6 space-y-2 mb-6 text-zinc-300">
                        <li><strong>Prioridad:</strong> High (Hoy), Medium (Próximo), Low (Ideas).</li>
                        <li><strong>Categoría:</strong> SEO, Ads, Social, etc.</li>
                        <li><strong>Fechas:</strong> Muy importante para las alertas de vencimiento.</li>
                    </ul>
                `
            },
            {
                id: '2.2',
                title: 'Prueba de Trabajo (Evidencias)',
                content: `
                    <h3 class="text-xl font-bold text-white mb-4">Sube evidencia profesional</h3>
                    <p class="mb-4">Nunca completes una tarea sin prueba. Tienes dos formas:</p>
                    <ul class="list-disc pl-6 space-y-2 mb-6 text-zinc-300">
                        <li><strong>Archivos:</strong> Arrastra capturas, PDF de reportes o diseños directamente.</li>
                        <li><strong>Links:</strong> Una URL de la campaña, el dashboard de Analytics o el post publicado.</li>
                    </ul>
                `
            }
        ],
        quiz: [
            {
                id: 'q1',
                text: '¿Cuál es la forma correcta de marcar una tarea como "Hecha"?',
                options: ['Solo hacer click en check', 'Subir evidencia (archivo o link) y luego marcar como hecha', 'Mandar un audio por WhatsApp'],
                correctAnswer: 1,
                explanation: 'Sin evidencia, el cliente no tiene prueba real del valor entregado.'
            }
        ],
        passingScore: 100
    },
    'module-03': {
        id: 'module-03',
        title: 'Módulo 3: El Growth Engine',
        description: 'Cómo funciona la recurrencia y automatización del plan.',
        lessons: [
            {
                id: '3.1',
                title: 'Motor de Recurrencia',
                content: `
                    <h3 class="text-xl font-bold text-white mb-4">Tareas que no mueren</h3>
                    <p class="mb-4">Configura tareas como <strong>Semanales</strong> o <strong>Mensuales</strong>.</p>
                    <p class="mb-4">Cuando marcas una tarea recurrente como completada, el motor crea **automáticamente** una nueva para la siguiente fecha (ej: +7 días o +30 días).</p>
                    <p class="text-purple-400">Esto nos permite tener un plan de crecimiento infinito sin intervención manual.</p>
                `
            }
        ],
        quiz: [
            {
                id: 'q1',
                text: '¿Qué pasa al completar una tarea marcada como "Mensual"?',
                options: ['Desaparece para siempre', 'Se auto-genera una nueva tarea para el próximo mes', 'Se marca como error'],
                correctAnswer: 1,
                explanation: 'El sistema garantiza la continuidad del plan de crecimiento.'
            }
        ],
        passingScore: 100
    },
    'module-04': {
        id: 'module-04',
        title: 'Módulo 4: Alertas y Control',
        description: 'Badges de urgencia y Kill Switches operacionales.',
        lessons: [
            {
                id: '4.1',
                title: 'Urgent Alert System',
                content: `
                    <h3 class="text-xl font-bold text-white mb-4">Atención al color</h3>
                    <ul class="list-disc pl-6 space-y-2 mb-6 text-zinc-300">
                        <li><span class="text-red-500 font-bold border border-red-500 px-1 rounded">VENCIDO</span>: Has fallado un deadline. Acción requerida urgente.</li>
                        <li><span class="text-amber-500 font-bold animate-pulse">45m / 1h</span>: El sistema te avisa que una tarea vence pronto.</li>
                    </ul>
                `
            },
            {
                id: '4.2',
                title: 'Kill Switches',
                content: `
                    <h3 class="text-xl font-bold text-white mb-4">Apagado de Módulos</h3>
                    <p class="mb-4">Si un cliente pausa su servicio de Ads, puedes "apagar" ese interruptor. Esto:</p>
                    <ul class="list-disc pl-6 space-y-1 mb-4 text-zinc-300">
                        <li>Oculta las tareas de ese módulo.</li>
                        <li>Pausa las alertas de ese módulo.</li>
                        <li>Limpia tu dashboard para enfocarte en lo que sí está activo.</li>
                    </ul>
                `
            }
        ],
        quiz: [
            {
                id: 'q1',
                text: '¿Para qué sirve apagar un interruptor (Kill Switch) de un módulo?',
                options: ['Para borrar al cliente', 'Para limpiar el dashboard de tareas de un servicio que no está activo', 'Para hackear la web'],
                correctAnswer: 1,
                explanation: 'Mantiene el foco en lo que realmente estamos cobrando y ejecutando.'
            }
        ],
        passingScore: 100
    },
    'module-05': {
        id: 'module-05',
        title: 'Módulo 5: Radar - Cazando Leads',
        description: 'Cómo extraer prospectos de alto valor con Inteligencia Artificial.',
        lessons: [
            {
                id: '5.1',
                title: 'El Escaneo Perfecto',
                content: `
                    <h3 class="text-xl font-bold text-white mb-4">Rubro + Zona</h3>
                    <p class="mb-4">El Radar busca en Google Maps y redes sociales. Para mejores resultados:</p>
                    <ul class="list-disc pl-6 space-y-2 mb-6 text-zinc-300">
                        <li>Usa términos amplios (ej: "Clínicas Dentales" en vez de solo "dentista").</li>
                        <li>Acota por ciudad o comuna para ganar relevancia.</li>
                    </ul>
                `
            }
        ],
        quiz: [
            {
                id: 'q1',
                text: '¿Cuál es el mejor input para el Radar?',
                options: ['Nombres propios', 'Rubro/Nicho + Localidad', 'Sitios web específicos'],
                correctAnswer: 1,
                explanation: 'El Radar está diseñado para descubrir mercados completos en zonas geográficas.'
            }
        ],
        passingScore: 100
    },
    'module-06': {
        id: 'module-06',
        title: 'Módulo 6: Pipeline y Cierre',
        description: 'Gestión de la negociación y embudo de ventas.',
        lessons: [
            {
                id: '6.1',
                title: 'El Tablero Kanban',
                content: `
                    <h3 class="text-xl font-bold text-white mb-4">Mueve el dinero</h3>
                    <p class="mb-4">El Pipeline tiene etapas clásicas:</p>
                    <ol class="list-decimal pl-6 space-y-2 mb-6 text-zinc-300">
                        <li><strong>Radar:</strong> Recién extraídos.</li>
                        <li><strong>Contactado:</strong> Primer contacto enviado.</li>
                        <li><strong>Reunión:</strong> Interés real.</li>
                        <li><strong>Negociación:</strong> Enviando propuesta.</li>
                        <li><strong>Producción:</strong> ¡Cierre! Pasan a ser clientes de Growth.</li>
                    </ol>
                `
            }
        ],
        quiz: [
            {
                id: 'q1',
                text: '¿A qué etapa pasa un cliente cuando firma y empieza a pagar?',
                options: ['Radar', 'Negociación', 'Producción', 'Archive'],
                correctAnswer: 2,
                explanation: 'Producción es donde empieza el trabajo operativo de Growth.'
            }
        ],
        passingScore: 100
    },
    'module-07': {
        id: 'module-07',
        title: 'Módulo 7: Vault y Factory',
        description: 'Almacenamiento seguro y entrega de activos técnicos.',
        lessons: [
            {
                id: '7.1',
                title: 'Bóveda de Seguridad',
                content: `
                    <h3 class="text-xl font-bold text-white mb-4">Passwords y Accesos</h3>
                    <p class="mb-4">El Vault es donde guardamos:</p>
                    <ul class="list-disc pl-6 space-y-2 mb-6 text-zinc-300">
                        <li>Accesos a Hosting / WordPress.</li>
                        <li>Credenciales de Meta/Google.</li>
                        <li>Brand Kits y Logotipos originales.</li>
                    </ul>
                    <p class="text-amber-500 font-bold">Importante: Nunca pidas claves por WhatsApp. Siempre pídeles que las carguen en su Vault privado.</p>
                `
            }
        ],
        quiz: [
            {
                id: 'q1',
                text: '¿Donde debemos centralizar las contraseñas de los clientes?',
                options: ['En Excel', 'En el Vault de HojaCero', 'En un cuaderno'],
                correctAnswer: 1,
                explanation: 'La seguridad es el pilar de la confianza con el cliente.'
            }
        ],
        passingScore: 100
    },
    'module-08': {
        id: 'module-08',
        title: 'Módulo 8: Dashboards de Cierre',
        description: 'Cómo presentar resultados y retener clientes de por vida.',
        lessons: [
            {
                id: '8.1',
                title: 'Métricas de Valor',
                content: `
                    <h3 class="text-xl font-bold text-white mb-4">Hablar el idioma del cliente</h3>
                    <p class="mb-4">Al cliente no le interesan los "clics", le interesan las <strong>Conversiones</strong>.</p>
                    <p class="mb-4">Usa el Dashboard de MÉTRICAS para mostrar:</p>
                    <ul class="list-disc pl-6 space-y-2 mb-6 text-zinc-300">
                        <li>Costo por Lead (CPL).</li>
                        <li>Retorno de Inversión (ROAS).</li>
                        <li>Crecimiento de tráfico SEO.</li>
                    </ul>
                `
            }
        ],
        quiz: [
            {
                id: 'q1',
                text: '¿Cuál es la métrica más importante para un dueño de negocio?',
                options: ['Likes en Facebook', 'Conversiones y ROI', 'Visitas totales'],
                correctAnswer: 1,
                explanation: 'El dinero manda. El ROI es la única métrica que garantiza la renovación del contrato.'
            }
        ],
        passingScore: 100
    }
};
