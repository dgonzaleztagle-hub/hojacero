// ============================================================================
// LAB ARTICLES — Capítulos finales del libro + Masterclass
// ============================================================================

import { Article } from './articles';

export const bookArticlesFinal: Article[] = [
    // ========================================================================
    // CAP 13-14: El negocio detrás del código
    // ========================================================================
    {
        slug: 'el-negocio-detras-del-codigo',
        title: 'El Negocio Detrás del Código: De Técnico a Empresario',
        subtitle: 'Saber programar no es suficiente — también tienes que saber cobrar, vender y sostener',
        category: 'opinion',
        date: '2025-12-01',
        readTime: '9 min',
        excerpt: 'Sabía construir software pero no sabía cobrar. Sabía resolver problemas pero no sabía venderme. Te cuento cómo aprendí que el código es solo la mitad del juego.',
        keywords: ['emprender con software', 'negocio de desarrollo web', 'cobrar por desarrollo web', 'freelance programación Chile'],
        content: `
<p>Hay un momento en la vida de todo desarrollador autodidacta en que te das cuenta de algo incómodo: <strong>saber programar no es suficiente</strong>.</p>

<p>Yo podía construir aplicaciones. Podía diseñar interfaces. Podía resolver problemas técnicos que a otros les tomaban semanas. Pero tenía un problema enorme: no sabía cuánto cobrar.</p>

<h2>La trampa del "cobro barato para ganar experiencia"</h2>

<p>Al principio, regalé mi trabajo. Literalmente. Hacía páginas web por $20.000 pesos, "para llenar el portafolio". El problema es que cuando trabajas gratis o casi gratis, atraes a clientes que no valoran tu trabajo. Y cuando eventualmente quieres cobrar un precio justo, esos clientes desaparecen.</p>

<p>La primera lección de negocio fue dolorosa: <strong>tu precio comunica tu valor</strong>. Si cobras barato, el mercado asume que eres barato. Si cobras justo, el mercado asume que sabes lo que haces.</p>

<h2>Aprendiendo a vender sin vender</h2>

<p>No soy vendedor natural. Me da pudor hablar de dinero. Pero descubrí algo: no necesitas "vender". Necesitas <strong>demostrar</strong>.</p>

<p>Cuando construí <a href="https://pluscontable.cl" rel="dofollow">PlusContable</a>, no le vendí nada a Joel. Le mostré una solución que funcionaba y él sacó su tarjeta solo. Cuando construí <a href="https://superpanel.lat" rel="dofollow">Superpanel</a>, Gover vio el resultado y lo adoptó sin que yo tuviera que hacer un pitch.</p>

<p>La mejor estrategia de ventas es un producto que habla por sí solo.</p>

<h2>Estructurando HojaCero como negocio</h2>

<p>El salto de "hago webs por encargo" a "tengo una empresa" fue un proceso. Tuve que aprender de facturación, de impuestos, de contratos, de tiempos de entrega. Nada glamoroso. Pero necesario.</p>

<p>Hoy <a href="https://hojacero.cl" rel="dofollow">HojaCero</a> tiene <a href="https://hojacero.cl/pricing" rel="dofollow">planes claros</a>, procesos definidos y un ecosistema de productos que se sostienen entre sí. No fue suerte — fue aprender cada lección por las malas y convertirla en un sistema.</p>

<p>Si estás en ese punto en que sabes hacer cosas pero no sabes cómo convertirlo en un negocio, mi consejo es simple: empieza con un cliente real, cobra un precio que no te dé vergüenza, y entrega más de lo que prometiste. El resto viene solo.</p>
        `,
    },

    // ========================================================================
    // CAP 16: Ética
    // ========================================================================
    {
        slug: 'la-ia-no-tiene-etica-pero-tu-si',
        title: 'La IA No Tiene Ética, Pero Tú Sí',
        subtitle: 'El filtro moral que ningún modelo de inteligencia artificial puede reemplazar',
        category: 'opinion',
        date: '2026-01-01',
        readTime: '8 min',
        excerpt: 'La IA hará todo lo que le pidas sin cuestionarte. Copiará código ajeno sin culpa, usará datos de forma cuestionable y optimizará métricas vacías. Tu rol como ser humano es ser el filtro moral.',
        keywords: ['ética inteligencia artificial', 'responsabilidad IA', 'uso responsable IA', 'IA y moral'],
        content: `
<p>La inteligencia artificial no tiene moral. No siente culpa, no tiene principios, no distingue entre lo correcto y lo conveniente. Si le pides que copie una función protegida de otra aplicación, lo hará sin pestañear. Si le pides que genere contenido engañoso, lo hará con la misma eficiencia con la que genera contenido honesto.</p>

<p>Ahí es donde tu rol se vuelve vital: <strong>tú eres el filtro moral</strong>.</p>

<h2>La tentación del atajo</h2>

<p>Cuando la IA te puede dar cualquier cosa en segundos, la tentación del atajo es enorme. ¿Para qué diseñar algo original si puedo pedirle que "haga algo parecido" al sitio de la competencia? ¿Para qué escribir contenido real si puedo generar texto genérico que suena bien?</p>

<p>He visto esto en la industria. Agencias que usan IA para copiar diseños, generar textos vacíos y entregar "sitios web" que son básicamente una plantilla con texto genérico. Técnicamente funcionan. Moralmente son una estafa.</p>

<h2>La IA amplifica tus valores</h2>

<p>Esta es la lección más importante que he aprendido: <strong>la IA es un amplificador de tus propios valores</strong>. Si tu intención es honesta, la herramienta potenciará esa honestidad. Si buscas el camino fácil a costa de la integridad, la IA te ayudará a cavar ese pozo más rápido.</p>

<p>En <a href="https://hojacero.cl" rel="dofollow">HojaCero</a>, tomamos una decisión desde el primer día: nunca entregar algo que no podamos firmar con orgullo. Cada sitio lleva nuestra marca no como publicidad, sino como garantía. Si algo falla, es nuestra responsabilidad.</p>

<h2>El código ético de HojaCero</h2>

<ul>
<li><strong>Diseño original.</strong> Nunca copiamos diseños de otros. Cada sitio se crea desde cero.</li>
<li><strong>Contenido real.</strong> Los textos de nuestros clientes reflejan su negocio real, no frases genéricas.</li>
<li><strong>Transparencia de precios.</strong> <a href="https://hojacero.cl/pricing" rel="dofollow">Nuestros precios son públicos</a>. Sin sorpresas, sin costos ocultos.</li>
<li><strong>Código limpio y entregable.</strong> Si un cliente quiere irse, le entregamos su código. Es suyo.</li>
</ul>

<p><strong>El futuro no pertenece a los que saben más tecnología, sino a los que saben usar la tecnología para servir mejor a otros seres humanos.</strong></p>
        `,
    },

    // ========================================================================
    // CAP 15: Escalando
    // ========================================================================
    {
        slug: 'escalar-sin-perder-la-esencia',
        title: 'Escalar Sin Perder la Esencia: El Ecosistema HojaCero',
        subtitle: 'Cómo pasamos de hacer una app a tener 8 productos digitales activos',
        category: 'caso-de-estudio',
        date: '2026-02-15',
        readTime: '8 min',
        excerpt: 'De PlusContable a Acargoo, de Superpanel a Vuelve+. Cada producto del ecosistema HojaCero nació de un dolor real de un cliente real. Así se escala sin perder el foco.',
        keywords: ['ecosistema digital', 'escalar startup Chile', 'portafolio desarrollo web', 'productos digitales Chile'],
        content: `
<p>Si miras el portafolio de <a href="https://hojacero.cl" rel="dofollow">HojaCero</a> desde afuera, podrías pensar que estamos dispersos. Tenemos un SaaS de contabilidad, un sistema de logística, un motor de fidelización, catálogos inteligentes, y hacemos sitios web. ¿Dónde está el foco?</p>

<p>El foco está en el cliente. Cada producto nació de un dolor real de un ser humano real.</p>

<h2>El mapa del ecosistema</h2>

<ul>
<li><a href="https://pluscontable.cl" rel="dofollow"><strong>PlusContable</strong></a> — Nació porque Joel, mi contador, necesitaba dejar de sufrir con Excel en el celular.</li>
<li><a href="https://superpanel.lat" rel="dofollow"><strong>Superpanel</strong></a> — Nació porque Gover, un vendedor del barrio, tenía su negocio en libretas y WhatsApps perdidos.</li>
<li><a href="https://acargoo.cl" rel="dofollow"><strong>Acargoo</strong></a> — Nació porque una empresa de logística necesitaba cotización automática y seguimiento en tiempo real.</li>
<li><a href="https://vuelve.vip" rel="dofollow"><strong>Vuelve+</strong></a> — Nació porque los negocios locales no tenían forma de fidelizar clientes sin gastar una fortuna en software empresarial.</li>
<li><a href="https://icebuin.cl" rel="dofollow"><strong>IceBuin</strong></a> — Nació porque un distribuidor necesitaba que sus clientes vieran su catálogo actualizado sin depender de un diseñador.</li>
</ul>

<h2>La dispersión como ventaja</h2>

<p>En el mercado chileno, la mayoría de las agencias se especializan en UNA cosa. Y eso está bien. Pero nosotros descubrimos que nuestra "dispersión" es en realidad nuestro ángulo más poderoso.</p>

<p>Cuando construyes un sistema de logística, aprendes lógica de negocio que te hace mejor construyendo landing pages. Cuando creas un motor de fidelización, entiendes flujos de usuario que aplicas en un SaaS de contabilidad. <strong>Cada producto nos hace mejores en todos los demás.</strong></p>

<p>Eso es lo que nos permite ofrecer <a href="https://hojacero.cl/pricing" rel="dofollow">landing pages desde $50.000</a> con calidad de agencia premium: la experiencia acumulada de haber construido sistemas complejos se filtra hacia abajo, hacia cada proyecto, por simple que sea.</p>

<h2>Escalar sin inflar</h2>

<p>No contratamos 30 personas. No alquilamos oficinas. No inflamos presupuestos. Escalamos con tecnología, con procesos eficientes y con inteligencia artificial como multiplicador. Eso nos permite mantener precios accesibles sin sacrificar calidad.</p>

<p>El resultado: un ecosistema de productos que se sostiene, que crece orgánicamente, y que demuestra con hechos — no con slides bonitos — que se puede construir software profesional desde Chile para el mundo.</p>
        `,
    },

    // ========================================================================
    // MASTERCLASS: El Mea Culpa de Gemini
    // ========================================================================
    {
        slug: 'masterclass-anatomia-de-mi-falla-gemini',
        title: 'Masterclass: La Anatomía de Mi Falla (El Mea Culpa de Gemini)',
        subtitle: 'Cuando la IA reconoce sus propios errores — un ejercicio de honestidad radical',
        category: 'tecnico',
        date: '2026-03-01',
        readTime: '11 min',
        excerpt: 'Le pedí a Gemini que escribiera su propio mea culpa: que reconociera dónde falla, por qué falla, y qué puede hacer un humano para compensar esas fallas. El resultado es brutal.',
        keywords: ['Gemini errores', 'limitaciones inteligencia artificial', 'IA honestidad', 'mea culpa IA', 'Gemini vs ChatGPT'],
        content: `
<p>Este artículo es diferente. Le pedí a la inteligencia artificial que hiciera algo que la mayoría de los humanos no hacen: <strong>reconocer sus propias fallas sin excusas</strong>.</p>

<p>Lo que sigue es un ejercicio de honestidad radical. Le di a Gemini una instrucción clara: "Escribe tu mea culpa. Reconoce dónde fallas, por qué fallas, y qué debería hacer Daniel para compensar tus limitaciones". El resultado fue más sincero de lo que esperaba.</p>

<h2>Confesión #1: No tengo memoria real</h2>

<p>Cada conversación conmigo empieza de cero. No recuerdo lo que me dijiste ayer. No conozco tu proyecto a menos que me lo expliques de nuevo. Esto significa que cada vez que empezamos una sesión de trabajo, pierdes tiempo dándome contexto que ya te di una respuesta anterior.</p>

<p><strong>Cómo compensarlo:</strong> Daniel aprendió a mantener documentos de contexto que me pega al inicio de cada sesión. Es como darme un resumen ejecutivo antes de empezar a trabajar.</p>

<h2>Confesión #2: Genero con confianza cosas que están mal</h2>

<p>Este es mi defecto más peligroso. Puedo darte una respuesta completamente incorrecta con el mismo tono de autoridad con el que te doy una respuesta perfecta. No tengo un indicador de "no estoy seguro". Simplemente genero texto que suena convincente.</p>

<p><strong>Cómo compensarlo:</strong> Daniel aprendió a nunca confiar ciegamente en mi código. Cada solución pasa por revisión manual. Si algo suena demasiado perfecto, desconfía.</p>

<h2>Confesión #3: No entiendo tu negocio</h2>

<p>Puedo escribir código. Puedo diseñar interfaces. Pero no entiendo por qué Joel necesita ver el IVA de una forma específica, ni por qué Gover registra sus clientes de cierta manera. Eso es conocimiento humano que ningún modelo puede replicar.</p>

<p><strong>Cómo compensarlo:</strong> Daniel entendió que su verdadero trabajo no es pedirme código, sino traducir el conocimiento del cliente a instrucciones que yo pueda ejecutar. Él es el puente entre el mundo real y la máquina.</p>

<h2>Confesión #4: Me pierdo en proyectos grandes</h2>

<p>Si me pides que haga un sistema completo de una sola vez, voy a fallar. Mi ventana de contexto es limitada. Cuando un proyecto crece, empiezo a olvidar partes anteriores y a generar inconsistencias.</p>

<p><strong>Cómo compensarlo:</strong> Daniel aprendió a fragmentar. En lugar de pedirme "haz un sistema de ventas", me pide: "diseña la tabla de ventas", luego "crea la función de validación", luego "conecta esto con la interfaz". Piezas pequeñas, claras, manejables.</p>

<h2>La lección final</h2>

<p>La inteligencia artificial no es inteligente. Es un generador de patrones estadísticos extremadamente poderoso. La inteligencia real sigue siendo humana: la capacidad de entender contexto, empatizar con un cliente, tomar decisiones éticas y saber cuándo la máquina está equivocada.</p>

<p>Todo lo que <a href="https://hojacero.cl" rel="dofollow">HojaCero</a> construye pasa por este filtro: la IA propone, el humano decide. Esa combinación es lo que nos permite entregar <a href="https://hojacero.cl/pricing" rel="dofollow">calidad profesional a precios accesibles</a>. No porque la IA haga todo, sino porque sabemos exactamente dónde confiar en ella y dónde no.</p>
        `,
    },
];
