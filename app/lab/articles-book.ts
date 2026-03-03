// ============================================================================
// LAB ARTICLES — Capítulos del libro "IA sin Humo" adaptados para SEO
// ============================================================================

import { Article } from './articles';

export const bookArticles: Article[] = [
    // ========================================================================
    // CAP 5-6: La Terminal
    // ========================================================================
    {
        slug: 'la-terminal-perdiendo-el-miedo-a-la-pantalla-negra',
        title: 'La Terminal: Perdiendo el Miedo a la Pantalla Negra',
        subtitle: 'Por qué la línea de comandos no es solo para hackers — y cómo cambió mi forma de trabajar',
        category: 'tecnico',
        date: '2025-09-15',
        readTime: '8 min',
        excerpt: 'La primera vez que vi una terminal pensé que era cosa de hackers. Hoy no puedo trabajar sin ella. Te cuento cómo perder el miedo a la pantalla negra fue uno de los saltos más importantes de mi carrera.',
        keywords: ['terminal para principiantes', 'línea de comandos', 'aprender a programar Chile', 'terminal vs interfaz gráfica'],
        content: `
<p>La primera vez que vi una terminal — esa pantalla negra con letras verdes que sale en las películas de hackers — sentí que estaba mirando algo que no era para mí. Era intimidante, críptica, y parecía diseñada para espantar a cualquiera que no tuviera un doctorado en informática.</p>

<p>Pero había un problema: la IA me estaba pidiendo que usara la terminal. Cada vez con más frecuencia, las instrucciones que me daba incluían comandos que tenía que escribir en esa pantalla negra. Y yo, que había llegado hasta ahí conversando con la máquina como si fuera un amigo, de repente me encontraba frente a un muro.</p>

<h2>El primer comando</h2>

<p>Mi primer comando fue un <code>cd</code> — "change directory", cambiar de carpeta. Suena ridículo, pero recuerdo la sensación de escribirlo, apretar Enter, y ver que la ruta cambiaba. No explotó nada. No se borró el disco duro. Simplemente cambié de carpeta. Como abrir una puerta.</p>

<p>Después vino <code>npm install</code>, <code>npm run dev</code>, <code>git status</code>. Cada comando era como aprender una palabra nueva en un idioma extranjero. Al principio las repetía sin entender completamente qué hacían. Pero con el tiempo, empecé a entender la lógica.</p>

<h2>La terminal como aliado</h2>

<p>Lo que nadie te dice es que la terminal es más eficiente que cualquier interfaz gráfica. Donde antes tenía que abrir tres aplicaciones, hacer cinco clics y esperar que cargara un menú, ahora escribo un comando de una línea y listo.</p>

<p><strong>La terminal no es difícil. Es diferente.</strong> Y esa diferencia asusta al principio, pero después se convierte en tu herramienta favorita.</p>

<p>Hoy, cada proyecto que construimos en <a href="https://hojacero.cl" rel="dofollow">HojaCero</a> nace desde la terminal. Desde <a href="https://acargoo.cl" rel="dofollow">Acargoo</a> hasta <a href="https://pluscontable.cl" rel="dofollow">PlusContable</a>, todo empieza con un <code>npx create-next-app</code> y termina con un <code>git push</code>. La pantalla negra dejó de ser un enemigo y se convirtió en el taller donde se construye todo.</p>

<h2>Consejo para emprendedores</h2>

<p>Si estás empezando y la terminal te da miedo, te digo lo mismo que me dije yo: no necesitas entenderla toda. Necesitas aprender 5 comandos básicos y el resto lo vas descubriendo en el camino. La IA te va guiando paso a paso si le preguntas con claridad.</p>

<p>El miedo a la pantalla negra es el último muro entre tú y la independencia tecnológica. Del otro lado hay un mundo donde no dependes de nadie para crear.</p>
        `,
    },

    // ========================================================================
    // CAP 7: Git
    // ========================================================================
    {
        slug: 'git-el-seguro-de-vida-del-codigo',
        title: 'Git: El Seguro de Vida del Código',
        subtitle: 'Cómo un sistema de control de versiones me salvó de perderlo todo',
        category: 'tecnico',
        date: '2025-09-01',
        readTime: '7 min',
        excerpt: 'Git es como el cinturón de seguridad del código: no lo aprecias hasta que lo necesitas. Te cuento el día que casi pierdo un proyecto entero y cómo Git me salvó.',
        keywords: ['qué es git', 'control de versiones', 'git para principiantes', 'github tutorial español'],
        content: `
<p>Hay una regla no escrita en el desarrollo de software: si no usas control de versiones, no es cuestión de SI vas a perder tu trabajo, sino CUÁNDO.</p>

<p>Yo aprendí esta lección de la forma difícil. Estaba trabajando en una actualización de <a href="https://pluscontable.cl" rel="dofollow">PlusContable</a>. Llevaba horas de cambios, todo iba bien, y decidí "mejorar" una función que ya funcionaba. Resultado: rompí todo. La aplicación dejó de funcionar y yo no tenía idea de qué había cambiado exactamente.</p>

<h2>¿Qué es Git en palabras simples?</h2>

<p>Git es como la función "deshacer" del Word, pero para todo tu proyecto. Cada vez que haces un cambio importante, le dices a Git: "Guarda este punto". Si después todo se rompe, puedes volver a ese punto exacto como si nada hubiera pasado.</p>

<p>Pero Git es más que eso. También te permite:</p>
<ul>
<li><strong>Experimentar sin miedo:</strong> Puedes crear una "rama" (como una copia paralela), probar cosas locas, y si funcionan las incorporas. Si no, las borras sin consecuencias.</li>
<li><strong>Colaborar sin pisarse:</strong> Si trabajas con alguien más, cada uno puede hacer cambios por separado y después juntarlos.</li>
<li><strong>Tener un historial completo:</strong> Puedes ver exactamente qué cambió, cuándo y por qué.</li>
</ul>

<h2>El día que Git me salvó</h2>

<p>Después del desastre con PlusContable, aprendí. Empecé a hacer commits (guardar puntos) después de cada cambio importante. Y llegó el día en que esa disciplina me salvó.</p>

<p>Estaba construyendo <a href="https://superpanel.lat" rel="dofollow">Superpanel</a> y una actualización rompió el sistema de pagos. En lugar de entrar en pánico, escribí <code>git log</code>, encontré el último commit donde todo funcionaba, y con un <code>git checkout</code> volví al punto seguro. Cinco minutos. Sin drama.</p>

<p><strong>Git no es un lujo de programador senior. Es el cinturón de seguridad que todo el que escribe código debería usar desde el primer día.</strong></p>

<p>En <a href="https://hojacero.cl" rel="dofollow">HojaCero</a>, cada proyecto tiene su repositorio en GitHub desde el minuto cero. No hay excepciones. Es la primera regla del taller.</p>
        `,
    },

    // ========================================================================
    // CAP 4+8: Cuando la IA falla
    // ========================================================================
    {
        slug: 'cuando-la-ia-falla-y-tu-pagas-la-cuenta',
        title: 'Cuando la IA Falla y Tú Pagas la Cuenta',
        subtitle: 'Las lecciones más caras que la inteligencia artificial me ha dado',
        category: 'opinion',
        date: '2025-10-20',
        readTime: '9 min',
        excerpt: 'La IA no es perfecta. Me ha costado dinero, tiempo y frustración. Pero cada fallo me enseñó algo que ningún tutorial te enseña: cuándo dejar de pedirle ayuda y encender tu propio cerebro.',
        keywords: ['errores inteligencia artificial', 'limitaciones IA', 'cuándo no usar IA', 'IA para negocios riesgos'],
        content: `
<p>La narrativa dominante sobre la inteligencia artificial es que es mágica: le pides algo y aparece. Y sí, a veces es así. Pero nadie te cuenta las veces que la IA te mete en un pozo del que cuesta salir.</p>

<p>Yo tengo un historial de fracasos con la IA que vale más que cualquier curso.</p>

<h2>Los 40 dólares que me enseñaron contexto</h2>

<p>Tenía un módulo de subida de archivos en <a href="https://pluscontable.cl" rel="dofollow">PlusContable</a> que funcionaba perfecto en iPhone y en Desktop, pero se rompía en Android. ¿Mi reacción? Pedirle a la IA que lo arreglara. Una y otra vez. Cuarenta dólares en tokens después, seguía sin funcionar.</p>

<p>El error no era del código. Era del entorno. La IA estaba probando solución tras solución sin saber que el problema era específico de Android. Cuando yo me detuve y le di el contexto correcto — "replica exactamente las variables del entorno donde SÍ funciona" — lo resolvió a la primera.</p>

<p><strong>Lección: la IA no tiene contexto a menos que tú se lo des.</strong> Si le pides que arregle algo sin decirle el panorama completo, va a disparar al aire y te va a cobrar por cada bala.</p>

<h2>El código que nadie entiende</h2>

<p>Otro error clásico: pedirle a la IA que "arregle" algo sin entender tú mismo qué está pasando. La IA te da una solución, funciona, y tú la pegas sin leerla. La próxima vez que algo se rompe, tienes un código que ni tú ni la IA entienden porque está hecho de parches sobre parches.</p>

<p>Me pasó con <a href="https://superpanel.lat" rel="dofollow">Superpanel</a>. Llegó un punto en que tuve que borrar el 30% del código y reconstruir desde cero porque el "código Frankenstein" se había vuelto inmanejable.</p>

<h2>Cuándo apagar la IA</h2>

<p>La señal más clara de que debes dejar de pedirle ayuda a la IA es cuando llevas más de 3 intentos sin progreso. En ese punto, la IA está tan perdida como tú. Es momento de:</p>

<ol>
<li>Detenerte y pensar lógicamente</li>
<li>Identificar qué SÍ funciona y qué NO</li>
<li>Darle a la IA un contexto completamente nuevo, como si empezaras de cero</li>
</ol>

<p>En <a href="https://hojacero.cl" rel="dofollow">HojaCero</a> aplicamos esta filosofía en cada proyecto. La IA es una herramienta, no un oráculo. Si la tratas como oráculo, te va a costar caro. Si la tratas como asistente, te va a multiplicar.</p>
        `,
    },

    // ========================================================================
    // CAP 10: Código Frankenstein
    // ========================================================================
    {
        slug: 'la-trampa-de-la-comodidad-codigo-frankenstein',
        title: 'La Trampa de la Comodidad: El Código Frankenstein',
        subtitle: 'Cuando la velocidad de la IA se convierte en tu peor enemigo',
        category: 'tecnico',
        date: '2025-11-01',
        readTime: '7 min',
        excerpt: 'La IA me entregaba soluciones en segundos y yo las pegaba sin revisar. Sin darme cuenta, estaba construyendo un monstruo. El día que el código Frankenstein se cobró venganza.',
        keywords: ['código limpio', 'deuda técnica', 'buenas prácticas programación', 'refactoring código'],
        content: `
<p>Hay una trampa en la que caen casi todos los que empiezan a usar IA para programar. Se llama la trampa de la comodidad.</p>

<p>Funciona así: la IA te da una solución rápida, funciona, la pegas. Te da otra, funciona, la pegas. Y otra. Y otra. En una tarde puedes "construir" un sistema entero. Te sientes un genio. Hasta que algo se rompe y descubres que tu código es un monstruo hecho de parches.</p>

<h2>El monstruo de Superpanel</h2>

<p>Me pasó construyendo <a href="https://superpanel.lat" rel="dofollow">Superpanel</a>. La velocidad de la IA me hacía sentir imparable. Pero cada solución rápida dejaba residuos: funciones que no se usaban, variables con nombres confusos, lógica duplicada en tres lugares diferentes.</p>

<p>El problema explotó cuando quise integrar pagos reales. El sistema se puso inestable. Un cambio en un lugar rompía algo en otro lugar sin razón aparente. Era imposible debuggear porque nadie — ni yo ni la IA — entendía la arquitectura completa.</p>

<p><strong>Tuve que detenerme, borrar casi el 30% de la lógica, y reconstruir con orden.</strong></p>

<h2>La regla del Director Técnico</h2>

<p>Aprendí una regla que hoy aplico en cada proyecto de <a href="https://hojacero.cl" rel="dofollow">HojaCero</a>: <strong>un Director Técnico no solo busca que el equipo gane, sino que juegue bien.</strong></p>

<p>Eso significa:</p>
<ul>
<li><strong>Revisar cada solución</strong> antes de integrarla, aunque la IA diga que funciona</li>
<li><strong>Nombrar las cosas con claridad</strong> — si una función se llama <code>handleStuff</code>, ya fallaste</li>
<li><strong>Borrar lo que no se usa</strong> — código muerto es código peligroso</li>
<li><strong>Refactorizar antes de agregar</strong> — si la base está desordenada, no le pongas más pisos</li>
</ul>

<p>La elegancia en el código no es un lujo. Es la garantía de que podrás seguir creciendo mañana sin que todo se derrumbe.</p>

<p>Por eso en HojaCero, cuando un cliente nos pide una aplicación compleja, lo primero que hacemos es diseñar la arquitectura limpia. Recién después construimos. Es más lento al inicio, pero infinitamente más rápido a la larga. Y eso nos permite ofrecer <a href="https://hojacero.cl/pricing" rel="dofollow">precios accesibles</a> sin sacrificar calidad.</p>
        `,
    },

    // ========================================================================
    // CAP 11: IA como Sparring
    // ========================================================================
    {
        slug: 'la-ia-como-critico-aprender-de-los-golpes',
        title: 'La IA como Crítico: Aprendiendo de los Golpes',
        subtitle: 'Cómo usar la inteligencia artificial para que destruya tu trabajo y crezcas más rápido',
        category: 'tecnico',
        date: '2025-11-10',
        readTime: '6 min',
        excerpt: 'El uso más potente que descubrí de la IA no fue pedirle que hiciera cosas, sino pedirle que destruyera lo que yo había hecho. Tener un crítico hostil 24/7 es un privilegio.',
        keywords: ['mejorar código con IA', 'code review inteligencia artificial', 'aprender programación con IA', 'crítica constructiva código'],
        content: `
<p>Uno de los usos más potentes que descubrí de la inteligencia artificial no fue pedirle que hiciera cosas por mí. Fue pedirle que <strong>destruyera</strong> lo que yo había hecho.</p>

<p>Empecé a usar modelos con una instrucción clara: "Actúa como un programador senior experto en seguridad y rendimiento. Revisa este código y dime todo lo que está mal. No seas amable."</p>

<h2>Los primeros golpes</h2>

<p>Al principio, los "golpes" dolían. La IA me señalaba errores de lógica que yo creía inexistentes. Me mostraba vulnerabilidades de seguridad que yo ni imaginaba. Me decía que mis nombres de variables eran confusos y que mi estructura era un desastre.</p>

<p>La reacción natural es ponerse a la defensiva: "Pero funciona, ¿no?". Sí, funciona. Pero funcionar no es suficiente cuando quieres construir software profesional que soporte usuarios reales, pagos reales y datos reales.</p>

<h2>El crecimiento después del dolor</h2>

<p>Después de la molestia inicial, vino el crecimiento real. Cada crítica de la IA era una lección comprimida. Lo que a un programador junior le tomaría meses aprender por ensayo y error, la IA me lo señalaba en segundos.</p>

<p>Empecé a aplicar un ciclo sistemático:</p>
<ol>
<li>Construir una función o módulo</li>
<li>Pedirle a la IA que lo critique sin piedad</li>
<li>Corregir todo lo que señala</li>
<li>Volver a pedir crítica</li>
<li>Repetir hasta que no tenga quejas graves</li>
</ol>

<p>Este ciclo es exactamente lo que hacemos en <a href="https://hojacero.cl" rel="dofollow">HojaCero</a> con cada módulo que construimos. No entregamos código que "funciona"; entregamos código que ha pasado por un filtro de calidad tan exigente como el de cualquier empresa grande.</p>

<p><strong>Tener un crítico hostil disponible las 24 horas no tiene precio.</strong> Si lo usas bien, tu curva de aprendizaje se comprime brutalmente. Si lo ignoras, sigues siendo el mismo programador mediocre que la IA ya te dijo que eras.</p>
        `,
    },
];
