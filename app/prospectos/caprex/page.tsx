'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, Menu, X, FileText, CalendarCheck, AlertOctagon, Heart, Video, Trophy, MessageCircle, ChevronDown, CheckCircle2, ArrowRight, Building2, TrendingUp, Landmark, Users } from 'lucide-react';

const LOGO = '/prospectos/caprex/logo.png';
const WA_LINK = 'https://wa.me/56926198159?text=Hola%2C%20quiero%20una%20propuesta%20personalizada%20para%20mi%20empresa';
const NAV = ['Servicios', 'Nosotros', 'Proceso', 'Contacto'];

// ── SERVICIOS REALES (del documento del cliente) ──────────────────
const SERVICES = [
    {
        n: '01', icon: FileText,
        title: 'Cumplimiento Legal y Gestión Preventiva',
        sub: 'Proyecto puntual o asesoría mensual',
        tag: null,
        price: null,
        size: 'large', // ocupa 2/3 en bento
        items: ['Constitución y asesoría de Comité Paritario (CPHS)', 'Reglamento Interno (RIOHS)', 'Matriz IPER', 'Programas preventivos anuales', 'Protocolos TMERT, PREXOR y Psicosocial', 'Auditorías internas', 'Preparación ante fiscalizaciones', 'Investigación de accidentes'],
        cta: 'Solicita tu cotización',
        desc: 'Soluciones claras y aplicables para cumplir con la normativa vigente. Nos adaptamos al tamaño y realidad de tu empresa.',
    },
    {
        n: '02', icon: CalendarCheck,
        title: 'Asesoría Externa Mensual',
        sub: 'Respaldo técnico continuo',
        tag: 'Más solicitado',
        price: 'Desde 10 UF /mes',
        size: 'small',
        items: [],
        cta: 'Contáctanos',
        desc: 'Servicio ideal para empresas que necesitan respaldo técnico continuo sin contratar un prevencionista de planta.',
    },
    {
        n: '03', icon: AlertOctagon,
        title: 'Planes de Emergencia',
        sub: 'Condominios, edificios y empresas',
        tag: null,
        price: null,
        size: 'small',
        items: [],
        cta: 'Solicitar cotización',
        desc: '',
        segments: [
            { label: 'Condominios y Edificios', price: 'Desde $3.000 / copropietario', note: 'Para comunidades sobre 100 copropietarios. Menos de 100: valor fijo conversable.' },
            { label: 'Empresas', price: 'Desde $3.000 / trabajador', note: 'Para empresas sobre 100 trabajadores. Menos de 100: valor fijo conversable.' },
        ],
    },
    {
        n: '04', icon: Heart,
        title: 'Cultura Preventiva y Bienestar Organizacional',
        sub: 'Talleres, jornadas y programas de equipo',
        tag: null,
        price: null,
        size: 'small',
        items: ['Jornadas de autocuidado organizacional', 'Experiencias preventivas', 'Talleres de gestión del estrés', 'Programas de fortalecimiento de equipos'],
        cta: 'Cotizar programa',
        desc: '',
    },
    {
        n: '05', icon: Video,
        title: 'Cápsulas Audiovisuales y Comunicación Preventiva',
        sub: 'Proyecto puntual o programa mensual',
        tag: null,
        price: null,
        size: 'small',
        items: ['Cápsulas de cultura preventiva', 'Videos de planes de emergencia', 'Programas de sensibilización interna', 'Campañas internas de seguridad'],
        cta: 'Solicitar propuesta',
        desc: '',
    },
    {
        n: '06', icon: Trophy,
        title: 'CAPREX AWARDS',
        sub: 'Sistema de Reconocimiento Preventivo',
        tag: '★ Único en el mercado',
        price: null,
        size: 'featured', // full width
        items: ['Trabajador Seguro del Mes', 'Equipo Preventivo Destacado', 'Liderazgo en Seguridad', 'Mejora Continua en Prevención'],
        cta: 'Solicitar propuesta personalizada',
        desc: 'Programa diseñado para reconocer y premiar conductas seguras. Incluye diseño del programa, material gráfico, diplomas, trofeos simbólicos y acompañamiento en la implementación.',
    },
];

const TARGETS = [
    { icon: Building2, label: 'PYMES', desc: 'Sin obligación de prevencionista full-time' },
    { icon: TrendingUp, label: 'Empresas en crecimiento', desc: 'Que necesitan orden documental y estructura' },
    { icon: Users, label: 'Grandes empresas', desc: 'Que buscan fortalecer su cultura preventiva' },
    { icon: Landmark, label: 'Instituciones', desc: 'Públicas y privadas — bienestar y capacitación' },
];

const STEPS = [
    { n: '01', title: 'Evaluamos tu empresa', desc: 'Analizamos tu realidad: rubro, tamaño, normativa aplicable y brechas actuales. Proyecto puntual o asesoría mensual — según lo que necesites.' },
    { n: '02', title: 'Propuesta a medida', desc: 'Te presentamos un plan concreto, aplicable y con alcance claro. Sin paquetes genéricos. Adaptado al tamaño y realidad de tu organización.' },
    { n: '03', title: 'Implementación y acompañamiento', desc: 'Ejecutamos, capacitamos y documentamos. Estamos disponibles cuando la normativa cambia, cuando llega un inspector o cuando tu equipo necesita apoyo.' },
];

const TESTIMONIALS = [
    { initials: 'R.V.', role: 'Gerente RRHH', company: 'Empresa Construcción — 120 trabajadores', quote: 'Antes teníamos un prevencionista part-time que no alcanzaba a cubrir todo. CAPREX nos organizó todo el sistema de prevención en 3 meses. El último Dipcomp no encontró ninguna brecha.' },
    { initials: 'M.T.', role: 'Dueño', company: 'Planta Metalmecánica — 45 trabajadores', quote: 'La Ley Karin nos tenía confundidos y con miedo a un error. Carla llegó, explicó todo en términos claros e implementó el protocolo en dos semanas. Quedamos tranquilos.' },
    { initials: 'A.C.', role: 'Administradora', company: 'Servicios Logísticos — 60 trabajadores', quote: 'Lo que más valoro es el trato directo. No llamas a un call center, hablas con quien sabe. Y cuando hay una emergencia, responden al tiro.' },
];

const FAQS = [
    {
        q: '¿Qué es el DS44 y qué le exige a mi empresa?',
        a: 'El Decreto Supremo 44 establece que toda empresa con más de 25 trabajadores debe contar con un sistema de gestión de seguridad y salud en el trabajo. Incluye identificación de riesgos, planes de prevención, capacitaciones documentadas y comités paritarios. Sin cumplimiento, la multa puede superar las 200 UTM por infracción.'
    },
    {
        q: '¿La Ley Karin me obliga aunque yo no haya tenido casos de acoso?',
        a: 'Sí. La Ley 21.643 (Ley Karin), vigente desde agosto 2024, obliga a todas las empresas a tener un protocolo de prevención de acoso laboral y sexual, independiente del tamaño o de si ha habido casos previos. No tenerlo es una infracción sancionable por la Dirección del Trabajo.'
    },
    {
        q: '¿Cuánto cuesta no tener un prevencionista externo?',
        a: 'Una multa por infracción al DS44 puede ir de 3 a 300 UTM (aprox. $200.000 a $20.000.000 CLP). Sumado a eso, un accidente del trabajo mal gestionado implica responsabilidad civil, penal y costos de mutualidad que superan ampliamente la inversión en prevención.'
    },
    {
        q: '¿En cuánto tiempo pueden implementar el sistema?',
        a: 'Para empresas de hasta 100 trabajadores, el diagnóstico inicial toma 1-2 semanas. La implementación básica del plan de prevención y protocolos obligatorios se completa en 4-8 semanas. El acompañamiento continuo es mensual y se ajusta a tus necesidades.'
    },
    {
        q: '¿Qué diferencia a CAPREX de contratar a una mutualidad?',
        a: 'Las mutualidades ofrecen servicios estándar y masivos. CAPREX es una consultoría boutique: trato directo con la prevencionista, planes adaptados a tu rubro específico, disponibilidad real y documentación personalizada. No eres un número de expediente.'
    },
    {
        q: '¿Trabajan con empresas pequeñas (menos de 50 trabajadores)?',
        a: 'Sí, es nuestro foco principal. Las pequeñas empresas son las que más necesitan asesoría externa porque no pueden costear un prevencionista de planta, y son las más vulnerables fiscalmente. Tenemos planes diseñados específicamente para este segmento.'
    },
];

// Hook: contador animado
function useCounter(target: number, active: boolean, duration = 1800) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!active) return;
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [active, target, duration]);
    return count;
}

export default function CaprexPage() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    const [sent, setSent] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [statsVisible, setStatsVisible] = useState(false);
    const statsRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    const { scrollY } = useScroll();
    const heroParallax = useTransform(scrollY, [0, 600], [0, -80]);

    const count185k = useCounter(185000, statsVisible, 2000);
    const countEmp = useCounter(80, statsVisible, 1400);
    const countHrs = useCounter(500, statsVisible, 1600);
    const countYrs = useCounter(16, statsVisible, 1000);

    useEffect(() => {
        const s = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', s);
        return () => window.removeEventListener('scroll', s);
    }, []);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.2 });
        if (statsRef.current) obs.observe(statsRef.current);
        return () => obs.disconnect();
    }, []);

    const fmtK = (n: number) => n >= 1000 ? `${Math.floor(n / 1000)}k` : `${n}`;

    // Variants
    const fadeUp = { hidden: { opacity: 0, y: 32 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }) };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clipReveal = { hidden: { clipPath: 'inset(0 100% 0 0)' }, visible: { clipPath: 'inset(0 0% 0 0)', transition: { duration: 0.9, ease: 'circOut' } } } as any;



    return (
        <div className="caprex-root">
            {/* ── FAQ JSON-LD Schema ── */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
                })
            }} />

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap');
        .caprex-root { background:#0B1526; color:#E2EAF8; font-family:'Inter',sans-serif; overflow-x:hidden; }
        .caprex-root h1,.caprex-root h2,.caprex-root h3,.caprex-root h4 { font-family:'Space Grotesk',sans-serif; letter-spacing:-0.05em; }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#0B1526} ::-webkit-scrollbar-thumb{background:#2563EB;border-radius:4px}
        .c-btn { display:inline-flex;align-items:center;gap:0.5rem;padding:1.2rem 2.8rem;border-radius:9999px;font-weight:800;font-size:0.9rem;letter-spacing:0.05em;text-transform:uppercase;transition:all 0.25s ease;cursor:pointer;border:none;font-family:'Space Grotesk',sans-serif; }
        .c-btn-primary { background:#2563EB;color:#fff;box-shadow:0 0 40px #2563EB44; }
        .c-btn-primary:hover { background:#1d4ed8;transform:scale(1.04);box-shadow:0 0 60px #2563EB66; }
        .c-btn-ghost { background:transparent;color:#E2EAF8;border:1.5px solid #1E3A5F;text-decoration:none; }
        .c-btn-ghost:hover { border-color:#2563EB;color:#2563EB; background:rgba(37,99,235,0.05); transform:scale(1.04); }
        .svc-row { display:grid;grid-template-columns:80px 1fr 2fr;gap:0;padding:2rem 0;border-top:1px solid #1E3A5F33;align-items:start;transition:all 0.3s; }
        .svc-row:hover { border-top-color:#2563EB; }
        .svc-row:last-child { border-bottom:1px solid #1E3A5F33; }
        .hot-tag { background:#F5A62322;border:1px solid #F5A62366;color:#F5A623;font-size:0.65rem;font-weight:800;letter-spacing:0.12em;padding:0.2rem 0.6rem;border-radius:100px;text-transform:uppercase; }
        .wa-float { position:fixed;bottom:1.75rem;right:1.75rem;z-index:999;cursor:pointer;border:none;background:none;padding:0; }
        .wa-bubble { width:58px;height:58px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(37,211,102,0.45);animation:waPulse 2.5s ease-in-out infinite; }
        @keyframes waPulse { 0%,100%{box-shadow:0 4px 24px rgba(37,211,102,0.45),0 0 0 0 rgba(37,211,102,0.3)} 50%{box-shadow:0 4px 24px rgba(37,211,102,0.45),0 0 0 14px rgba(37,211,102,0)} }
        .faq-item { border-bottom:1px solid #1E3A5F33;overflow:hidden; }
        .faq-q { width:100%;background:none;border:none;color:#E2EAF8;text-align:left;padding:1.5rem 0;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:1rem;font-family:'Space Grotesk',sans-serif;font-size:1.05rem;font-weight:700;letter-spacing:-0.02em;transition:color 0.2s; }
        .faq-q:hover { color:#2563EB; }
        .testi-card { background:rgba(255,255,255,0.03);border:1px solid #1E3A5F44;border-radius:1.25rem;padding:2rem;display:flex;flex-direction:column;gap:1.25rem;transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .testi-card:hover { border-color:#2563EB66; background:rgba(37,99,235,0.07); transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 40px -20px rgba(37,99,235,0.3); }
        @media(max-width:768px){
          /* Nav */
          .desktop-nav{display:none!important}
          .mob-menu-btn{display:block!important}

          /* Hero */
          .hero-h1{font-size:clamp(2.2rem,10vw,3.5rem)!important;}
          .hero-grid{grid-template-columns:1fr!important;gap:1.5rem!important;}

          /* Servicios */
          .svc-row{grid-template-columns:40px 1fr!important;grid-template-rows:auto auto;gap:0!important;padding:1.25rem 0!important;}
          .svc-desc{grid-column:2!important;margin-top:0.35rem!important;}

          /* Pasos */
          .steps-grid{grid-template-columns:1fr!important;gap:1rem!important;}

          /* Testimonios */
          .testi-grid{grid-template-columns:1fr!important;}

          /* Carla */
          .carla-grid{grid-template-columns:1fr!important;gap:2.5rem!important;}
          .carla-foto{aspect-ratio:16/9!important;}

          /* CTA */
          .cta-grid{grid-template-columns:1fr!important;gap:2.5rem!important;}

          /* FAQ */
          .faq-q{font-size:0.9rem!important;}

          /* Botones */
          .c-btn{padding:0.85rem 1.4rem!important;font-size:0.78rem!important;}

          /* Padding secciones en mobile (no hero) */
          .caprex-root section:not(.hero-section){padding-left:1.25rem!important;padding-right:1.25rem!important;padding-top:4rem!important;padding-bottom:4rem!important;}

          /* Hero: padding top suficiente para el nav fijo */
          .hero-section{padding-left:1.25rem!important;padding-right:1.25rem!important;padding-top:5.5rem!important;padding-bottom:2rem!important;height:auto!important;min-height:100svh!important;}

          /* Logo nav más pequeño */
          .caprex-logo{width:130px!important;height:36px!important;}

          /* Nav padding */
          .caprex-root nav{padding:1rem 1.25rem!important;}

          /* Bento grid mobile */
          .bento-row{grid-template-columns:1fr!important;}
          .bento-row-3{grid-template-columns:1fr!important;}
          .bento-awards{grid-template-columns:1fr!important;gap:1.5rem!important;}

          /* Inputs full width */
          .caprex-root input{width:100%!important;box-sizing:border-box!important;}
        }
      `}</style>

            {/* ── WhatsApp flotante ── */}
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="wa-float" aria-label="Contactar por WhatsApp">
                <div className="wa-bubble">
                    <MessageCircle size={26} color="#fff" fill="#fff" />
                </div>
            </a>

            {/* ── NAV ── */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
                padding: '1.25rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: scrolled ? 'rgba(11,21,38,0.94)' : 'transparent',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                borderBottom: scrolled ? '1px solid #1E3A5F' : 'none',
                transition: 'all 0.4s',
            }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Image src={LOGO} alt="CAPREX" width={200} height={56} className="caprex-logo" style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5)) drop-shadow(0 0 3px rgba(255,255,255,0.8))' }} priority />
                </motion.div>
                <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }} className="desktop-nav">
                    {NAV.map(l => (
                        <a key={l} href={`#${l.toLowerCase()}`}
                            style={{ color: '#64748B', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#E2EAF8')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}>
                            {l}
                        </a>
                    ))}
                    <button className="c-btn c-btn-primary" style={{ padding: '0.7rem 1.6rem', fontSize: '0.75rem' }} onClick={() => setContactOpen(true)}>
                        Cotizar ahora
                    </button>
                </div>
                <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', background: 'none', border: 'none', color: '#E2EAF8', cursor: 'pointer' }} className="mob-menu-btn">
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80 }}
                        style={{ position: 'fixed', inset: 0, zIndex: 190, background: '#0B1526', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3rem' }}>
                        {NAV.map(l => (
                            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                                style={{ color: '#E2EAF8', fontSize: '2.5rem', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, textDecoration: 'none', letterSpacing: '-0.04em' }}>
                                {l}
                            </a>
                        ))}
                        <button className="c-btn c-btn-primary" onClick={() => { setMenuOpen(false); setContactOpen(true); }}>Contáctanos ahora</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── HERO ── */}
            <section ref={heroRef} className="hero-section" style={{ height: '100vh', display: 'flex', alignItems: 'center', padding: '5rem 2.5rem 3rem', position: 'relative', overflow: 'hidden' }}>

                {/* Video BG con parallax */}
                <motion.video autoPlay loop muted playsInline
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '120%', objectFit: 'cover', opacity: 0.55, y: heroParallax, top: '-10%' } as any}>
                    <source src="/prospectos/caprex/hero.mp4" type="video/mp4" />
                </motion.video>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0B152688 0%,#0B152444 100%)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,#0B1526CC 45%,transparent 75%)' }} />

                <div style={{ maxWidth: '1300px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
                    <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3rem', alignItems: 'center' }}>

                        {/* IZQUIERDA */}
                        <div>
                            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
                                style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: '40px', height: '1px', background: '#2563EB' }} />
                                <span style={{ color: '#2563EB', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Gestión · Cultura · Comunicación Preventiva</span>
                            </motion.div>

                            <div style={{ overflow: 'hidden', marginBottom: '1.5rem' }}>
                                <motion.h1 className="hero-h1" variants={clipReveal} initial="hidden" animate="visible"
                                    style={{ fontSize: 'clamp(3.5rem,7vw,7.5rem)', fontWeight: 900, lineHeight: 0.88, letterSpacing: '-0.05em' }}>
                                    PROTEGE<br />
                                    <span style={{ color: 'transparent', WebkitTextStroke: '2px #2563EB' }}>A TU</span><br />
                                    EMPRESA.
                                </motion.h1>
                            </div>

                            <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
                                style={{ color: '#94A3B8', fontSize: '1rem', lineHeight: 1.75, marginBottom: '2.25rem', maxWidth: '420px' }}>
                                CAPREX es una consultora en prevención de riesgos enfocada en entregar soluciones claras, aplicables y estratégicas. Trabajamos desde la gestión legal básica hasta el desarrollo de programas de cultura y comunicación preventiva, adaptándonos al tamaño y realidad de cada empresa.
                            </motion.p>

                            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
                                style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <button className="c-btn c-btn-primary" onClick={() => setContactOpen(true)}>
                                    Solicitar cotización <ChevronRight size={15} />
                                </button>
                                <a href="#servicios" className="c-btn c-btn-ghost">Ver servicios</a>
                            </motion.div>
                        </div>

                        {/* DERECHA — card impacto glass */}
                        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
                            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ background: 'rgba(11,21,38,0.72)', backdropFilter: 'blur(16px)', border: '1px solid #1E3A5F', borderRadius: '1.5rem', padding: '2.25rem' }}>
                                <div ref={statsRef} style={{ fontSize: 'clamp(3.5rem,6vw,5rem)', fontWeight: 900, color: '#F5A623', lineHeight: 1, fontFamily: "'Space Grotesk',sans-serif" }}>
                                    {fmtK(count185k)}
                                </div>
                                <div style={{ color: '#E2EAF8', fontWeight: 600, marginTop: '0.5rem', fontSize: '0.9rem' }}>accidentes laborales al año en Chile</div>
                                <div style={{ color: '#64748B', fontSize: '0.72rem', marginTop: '0.2rem' }}>Fuente: ISL · Estadísticas 2023</div>
                                <div style={{ marginTop: '1.25rem', borderTop: '1px solid #1E3A5F', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {[['68%', 'empresas sin protocolo Ley Karin'], ['−40%', 'reducción con asesoría externa']].map(([v, l]) => (
                                        <div key={v} style={{ display: 'flex', gap: '0.75rem', alignItems: 'baseline' }}>
                                            <span style={{ color: '#2563EB', fontWeight: 800, fontSize: '1rem', fontFamily: "'Space Grotesk',sans-serif" }}>{v}</span>
                                            <span style={{ color: '#64748B', fontSize: '0.78rem' }}>{l}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Stats 2x2 */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                {[[`${countEmp}+`, 'Empresas'], [`${countYrs}+`, 'Años exp.'], [`${countHrs}+`, 'Hrs capacit.'], ['100%', 'Cumplimiento']].map(([v, l]) => (
                                    <div key={l} style={{ background: 'rgba(11,21,38,0.55)', backdropFilter: 'blur(8px)', border: '1px solid #1E3A5F', borderRadius: '0.9rem', padding: '1rem' }}>
                                        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 900, color: '#E2EAF8', lineHeight: 1 }}>{v}</div>
                                        <div style={{ color: '#64748B', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.25rem' }}>{l}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
                    style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', color: '#64748B', fontSize: '0.7rem', letterSpacing: '0.2em', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <span>SCROLL</span>
                    <ChevronDown size={14} />
                </motion.div>
            </section>

            {/* ── ¿A QUIÉN VA DIRIGIDO? ── */}
            <section style={{ background: '#060E1A', padding: '5rem 2.5rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }}
                        style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <span style={{ color: '#2563EB', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>¿Para quién?</span>
                        <h2 style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 900, lineHeight: 0.95, marginTop: '0.5rem', letterSpacing: '-0.05em' }}>
                            DISEÑADO PARA<br /><span style={{ color: '#2563EB' }}>TU REALIDAD.</span>
                        </h2>
                    </motion.div>
                    <div className="testi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
                        {TARGETS.map((t, i) => (
                            <motion.div key={t.label} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} custom={i}
                                whileHover={{ y: -5, scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)', borderColor: '#2563EB66' }}
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1E3A5F44', borderRadius: '1rem', padding: '1.75rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', transition: 'all 0.3s ease' }}>
                                <t.icon size={22} color="#2563EB" />
                                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.03em' }}>{t.label}</div>
                                <div style={{ color: '#64748B', fontSize: '0.82rem', lineHeight: 1.5 }}>{t.desc}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SERVICIOS (Bento Grid) ── */}
            <section id="servicios" style={{ background: '#0F1A2E', padding: '7rem 2.5rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }}
                        style={{ borderLeft: '4px solid #2563EB', paddingLeft: '1.5rem', marginBottom: '4rem' }}>
                        <span style={{ color: '#2563EB', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Lo que hacemos</span>
                        <h2 style={{ fontSize: 'clamp(2.5rem,6vw,5.5rem)', fontWeight: 900, lineHeight: 0.92, marginTop: '0.5rem', letterSpacing: '-0.05em' }}>
                            NUESTROS<br /><span style={{ color: '#1E3A5F' }}>SERVICIOS.</span>
                        </h2>
                    </motion.div>

                    {/* Fila 1: Cumplimiento (grande) + Asesoría Mensual (pequeña) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }} className="bento-row">
                        {/* Card grande: Cumplimiento Legal */}
                        {(() => {
                            const s = SERVICES[0]; return (
                                <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }}
                                    whileHover={{ y: -8, scale: 1.01, borderColor: '#2563EB88', boxShadow: '0 25px 50px -12px rgba(37,99,235,0.2)' }}
                                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1E3A5F44', borderRadius: '1.5rem', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', transition: 'all 0.4s ease' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ background: '#2563EB18', borderRadius: '0.75rem', padding: '0.75rem' }}><s.icon size={24} color="#2563EB" /></div>
                                        <span style={{ color: '#1E3A5F', fontSize: '0.72rem', fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>{s.n}</span>
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>{s.title}</h3>
                                        <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.65 }}>{s.desc}</p>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                        {s.items.map(item => (
                                            <div key={item} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                                                <CheckCircle2 size={13} color="#2563EB" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                                                <span style={{ color: '#94A3B8', fontSize: '0.78rem', lineHeight: 1.4 }}>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#2563EB12', border: '1px solid #2563EB33', borderRadius: '0.5rem', padding: '0.5rem 0.85rem' }}>
                                        <span style={{ color: '#2563EB', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Modalidad:</span>
                                        <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>{s.sub}</span>
                                    </div>
                                    <button onClick={() => setContactOpen(true)} className="c-btn c-btn-ghost" style={{ alignSelf: 'flex-start', padding: '0.7rem 1.5rem', fontSize: '0.75rem' }}>
                                        {s.cta} <ArrowRight size={13} />
                                    </button>

                                </motion.div>
                            );
                        })()}

                        {/* Card pequeña: Asesoría Mensual */}
                        {(() => {
                            const s = SERVICES[1]; return (
                                <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} custom={1}
                                    whileHover={{ y: -8, scale: 1.02, boxShadow: '0 25px 50px -12px rgba(37,99,235,0.4)' }}
                                    style={{ background: 'linear-gradient(135deg,#1A2D6B 0%,#0B1526 100%)', border: '1px solid #2563EB44', borderRadius: '1.5rem', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', overflow: 'hidden', transition: 'all 0.4s ease' }}>
                                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#2563EB', borderRadius: '100px', padding: '0.2rem 0.7rem' }}>
                                        <span style={{ color: '#fff', fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.1em' }}>{s.tag}</span>
                                    </div>
                                    <s.icon size={26} color="#2563EB" />
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>{s.title}</h3>
                                        <p style={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.6 }}>{s.desc}</p>
                                    </div>
                                    <div style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid #2563EB44', borderRadius: '0.75rem', padding: '0.9rem 1.1rem', textAlign: 'center' }}>
                                        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 900, color: '#E2EAF8' }}>{s.price}</div>
                                    </div>
                                    <button onClick={() => setContactOpen(true)} className="c-btn c-btn-primary" style={{ padding: '0.8rem 1.4rem', fontSize: '0.75rem', justifyContent: 'center' }}>
                                        {s.cta}
                                    </button>
                                </motion.div>
                            );
                        })()}
                    </div>

                    {/* Fila 2: Planes de Emergencia + Cultura + Audiovisual */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem', marginBottom: '1.25rem' }} className="bento-row-3">
                        {SERVICES.slice(2, 5).map((s, i) => (
                            <motion.div key={s.n} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} custom={i}
                                whileHover={{ y: -8, scale: 1.02, borderColor: '#2563EB88', backgroundColor: 'rgba(255,255,255,0.04)' }}
                                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid #1E3A5F44', borderRadius: '1.5rem', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'all 0.4s ease' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ background: '#2563EB12', borderRadius: '0.65rem', padding: '0.6rem' }}><s.icon size={20} color="#2563EB" /></div>
                                    {s.price && (
                                        <div style={{ background: '#F5A62318', border: '1px solid #F5A62344', borderRadius: '0.5rem', padding: '0.25rem 0.6rem' }}>
                                            <span style={{ color: '#F5A623', fontSize: '0.7rem', fontWeight: 800 }}>{s.price}</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.4rem', lineHeight: 1.2 }}>{s.title}</h3>
                                    <div style={{ color: '#2563EB', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.sub}</div>
                                </div>
                                {'segments' in s && s.segments ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flexGrow: 1 }}>
                                        {(s.segments as { label: string, price: string, note: string }[]).map(seg => (
                                            <motion.div key={seg.label}
                                                whileHover={{ x: 5, backgroundColor: 'rgba(245,166,35,0.1)', borderColor: '#F5A62344' }}
                                                style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid #F5A62322', borderRadius: '0.65rem', padding: '0.75rem', transition: 'all 0.2s ease' }}>
                                                <div style={{ color: '#F5A623', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{seg.label}</div>
                                                <div style={{ color: '#E2EAF8', fontWeight: 800, fontSize: '0.88rem', fontFamily: "'Space Grotesk',sans-serif" }}>{seg.price}</div>
                                                <div style={{ color: '#64748B', fontSize: '0.72rem', marginTop: '0.15rem', lineHeight: 1.4 }}>{seg.note}</div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: '#64748B', fontSize: '0.82rem', lineHeight: 1.6, flexGrow: 1 }}>{s.desc || s.items.join(' · ')}</p>
                                )}
                                {s.items.length > 0 && !s.desc && !('segments' in s) && (

                                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                        {s.items.map(item => (
                                            <li key={item} style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                                                <CheckCircle2 size={11} color="#2563EB" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                                                <span style={{ color: '#64748B', fontSize: '0.75rem' }}>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <button onClick={() => setContactOpen(true)} style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left', padding: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    {s.cta} <ArrowRight size={13} />
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    {/* Fila 3: CAPREX AWARDS — featured full width */}
                    {(() => {
                        const s = SERVICES[5]; return (
                            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }}
                                whileHover={{ scale: 1.01, borderColor: '#F5A62388', boxShadow: '0 25px 80px -20px rgba(245,166,35,0.25)' }}
                                style={{ background: 'linear-gradient(135deg,#1A1200 0%,#2A1A00 50%,#0B1526 100%)', border: '1px solid #F5A62333', borderRadius: '1.5rem', padding: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', position: 'relative', overflow: 'hidden', transition: 'all 0.5s ease' }}
                                className="bento-awards">
                                {/* Glow dorado */}
                                <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle,#F5A62322 0%,transparent 65%)', pointerEvents: 'none' }} />
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                        <div style={{ background: '#F5A62320', border: '1px solid #F5A62366', borderRadius: '0.75rem', padding: '0.65rem' }}><Trophy size={22} color="#F5A623" /></div>
                                        <span style={{ background: 'linear-gradient(90deg,#F5A623,#FCD34D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.2em' }}>{s.tag}</span>
                                    </div>
                                    <h3 style={{ fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '0.75rem', lineHeight: 0.95 }}>
                                        CAPREX<br /><span style={{ color: '#F5A623' }}>AWARDS™</span>
                                    </h3>
                                    <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>{s.desc}</p>
                                    <button onClick={() => setContactOpen(true)} style={{ background: 'linear-gradient(135deg,#F5A623,#D97706)', color: '#000', border: 'none', borderRadius: '9999px', padding: '0.9rem 2.2rem', fontWeight: 900, fontSize: '0.82rem', letterSpacing: '0.06em', cursor: 'pointer', fontFamily: "'Space Grotesk',sans-serif", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {s.cta} <ArrowRight size={14} />
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', position: 'relative', zIndex: 1 }}>
                                    {s.items.map((item, i) => (
                                        <div key={item} style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid #F5A62322', borderRadius: '1rem', padding: '1.25rem' }}>
                                            <div style={{ color: '#F5A623', fontSize: '1.5rem', marginBottom: '0.5rem' }}>{['🏆', '🌟', '👑', '📈'][i]}</div>

                                            <div style={{ color: '#E2EAF8', fontSize: '0.82rem', fontWeight: 700, lineHeight: 1.3 }}>{item}</div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })()}
                </div>
            </section>


            {/* ── CÓMO FUNCIONA ── */}
            <section id="proceso" style={{ background: '#0B1526', padding: '7rem 2.5rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }}
                        style={{ marginBottom: '5rem', textAlign: 'center' }}>
                        <span style={{ color: '#2563EB', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>El proceso</span>
                        <h2 style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 900, lineHeight: 0.95, marginTop: '0.5rem', letterSpacing: '-0.05em' }}>
                            ¿CÓMO<br /><span style={{ color: 'transparent', WebkitTextStroke: '1.5px #2563EB' }}>FUNCIONA?</span>
                        </h2>
                    </motion.div>

                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }}
                        style={{ marginTop: '3rem', marginBottom: '3rem', height: '1px', background: 'linear-gradient(90deg,transparent,#2563EB,transparent)' }} />

                    <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem', position: 'relative' }}>
                        {STEPS.map((step, i) => (
                            <motion.div key={step.n} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} custom={i}
                                whileHover={{ y: -8, scale: 1.01, borderColor: '#2563EB88', backgroundColor: 'rgba(255,255,255,0.04)' }}
                                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1E3A5F44', borderRadius: '1.5rem', padding: '2.5rem 2rem', position: 'relative', zIndex: 1, transition: 'all 0.4s ease' }}>
                                <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: '#0B1526', border: '2px solid #2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                    <span style={{ color: '#2563EB', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 900, fontSize: '0.85rem' }}>{step.n}</span>
                                </div>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.03em' }}>{step.title}</h3>
                                <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.7 }}>{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }}
                        style={{ marginTop: '3rem', textAlign: 'center' }}>
                        <button className="c-btn c-btn-primary" onClick={() => setContactOpen(true)}>
                            Coticemos tu propuesta <ArrowRight size={16} />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ── CARLA (dark editorial) ── */}
            <section id="nosotros" style={{ padding: '7rem 2.5rem', background: '#0F1A2E', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,#2563EB12 0%,transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div className="carla-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem', alignItems: 'start' }}>

                        {/* Contenedor de Fotos (Cards de Fundadores) */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="bento-row">
                            {[
                                { name: 'Carla Gajardo', role: 'Cofundadora', bg: 'linear-gradient(160deg,#1A2D6B 0%,#0B1526 100%)' },
                                { name: 'Juan Avendaño', role: 'Cofundador', bg: 'linear-gradient(160deg,#1E3A5F 0%,#0B1526 100%)' }
                            ].map((f, idx) => (
                                <motion.div key={f.name} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} custom={idx * 0.2}
                                    whileHover={{ y: -10, scale: 1.03, boxShadow: '0 30px 60px -15px rgba(37,99,235,0.3)' }}
                                    style={{ position: 'relative', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                                    <div className="carla-foto" style={{
                                        width: '100%', aspectRatio: '3/4',
                                        background: f.bg,
                                        borderRadius: '1.5rem', border: '1px solid #1E3A5F',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
                                        padding: '1.5rem', overflow: 'hidden', position: 'relative',
                                    }}>
                                        <div style={{ position: 'absolute', top: '1.5rem', left: '50%', transform: 'translateX(-50%)', fontSize: '2.5rem', opacity: 0.08, fontFamily: "'Space Grotesk',sans-serif", fontWeight: 900, letterSpacing: '-0.05em', color: '#2563EB', whiteSpace: 'nowrap' }}>
                                            {f.name.split(' ')[0].toUpperCase()}
                                        </div>
                                        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                                            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', color: '#2563EB', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{f.role}</div>
                                            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.4rem', fontWeight: 900, color: '#E2EAF8', letterSpacing: '-0.04em', lineHeight: 1.1 }}>{f.name}</div>
                                        </div>
                                        {f.name === 'Carla Gajardo' && (
                                            <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#2563EB', borderRadius: '0.5rem', padding: '0.3rem 0.6rem' }}>
                                                <span style={{ color: '#fff', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.05em' }}>16 AÑOS EXP.</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Copy */}
                        <div>
                            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} custom={0}>
                                <span style={{ color: '#2563EB', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Por qué CAPREX</span>
                                <h2 style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 900, lineHeight: 1.05, marginTop: '0.75rem', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
                                    Soluciones claras, aplicables<br />
                                    <span style={{ color: '#2563EB' }}>y estratégicas.</span>
                                </h2>
                                <p style={{ color: '#64748B', lineHeight: 1.8, marginBottom: '2rem' }}>
                                    CAPREX es una consultora en prevención de riesgos enfocada en entregar soluciones claras, aplicables y estratégicas para organizaciones que necesitan cumplir con la normativa vigente y fortalecer su cultura preventiva. Trabajamos desde la gestión legal básica hasta el desarrollo de programas de cultura y comunicación preventiva, adaptándonos al tamaño y realidad de cada empresa.
                                </p>
                            </motion.div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                {['Soluciones adaptadas al tamaño y realidad de cada empresa', 'Desde cumplimiento legal hasta cultura y comunicación preventiva', 'Trato directo — sin intermediarios ni call centers', 'Respuesta en menos de 24 horas'].map((f, i) => (
                                    <motion.div key={f} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} custom={i + 1}
                                        whileHover={{ x: 5, color: '#E2EAF8' }}
                                        style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'default', transition: 'all 0.2s ease' }}>
                                        <CheckCircle2 size={16} color="#2563EB" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                                        <span style={{ color: '#94A3B8', fontSize: '0.95rem' }}>{f}</span>
                                    </motion.div>
                                ))}
                            </div>
                            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} custom={5}
                                style={{ marginTop: '2.5rem' }}>
                                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="c-btn c-btn-primary">
                                    <MessageCircle size={16} /> Contactar a los socios
                                </a>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIOS ── */}
            <section style={{ background: '#0B1526', padding: '7rem 2.5rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }}
                        style={{ marginBottom: '4rem' }}>
                        <span style={{ color: '#2563EB', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Clientes</span>
                        <h2 style={{ fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 900, lineHeight: 0.95, marginTop: '0.5rem', letterSpacing: '-0.05em' }}>
                            LO QUE DICEN<br /><span style={{ color: '#1E3A5F' }}>NUESTROS CLIENTES.</span>
                        </h2>
                    </motion.div>
                    <div className="testi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
                        {TESTIMONIALS.map((t, i) => (
                            <motion.div key={t.initials} className="testi-card" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} custom={i}>
                                <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.75, fontStyle: 'italic' }}>"{t.quote}"</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg,#2563EB,#1A2D6B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '0.8rem', color: '#fff', flexShrink: 0 }}>
                                        {t.initials}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#E2EAF8' }}>{t.role}</div>
                                        <div style={{ color: '#64748B', fontSize: '0.75rem' }}>{t.company}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section style={{ background: '#0F1A2E', padding: '7rem 2.5rem' }}>
                <div style={{ maxWidth: '860px', margin: '0 auto' }}>
                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} style={{ marginBottom: '4rem', textAlign: 'center' }}>
                        <span style={{ color: '#2563EB', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Preguntas frecuentes</span>
                        <h2 style={{ fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 900, lineHeight: 0.95, marginTop: '0.5rem', letterSpacing: '-0.05em' }}>
                            TODO LO QUE<br /><span style={{ color: '#2563EB' }}>NECESITAS SABER.</span>
                        </h2>
                    </motion.div>
                    <div>
                        {FAQS.map((faq, i) => (
                            <motion.div key={i} className="faq-item" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} custom={i * 0.3}>
                                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                    <span>{faq.q}</span>
                                    <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                        <ChevronDown size={20} color="#2563EB" />
                                    </motion.div>
                                </button>
                                <AnimatePresence initial={false}>
                                    {openFaq === i && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.35, ease: 'easeInOut' }}>
                                            <p style={{ color: '#64748B', lineHeight: 1.8, paddingBottom: '1.5rem', fontSize: '0.95rem' }}>{faq.a}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA FINAL ── */}
            <section id="contacto" style={{ background: '#2563EB', padding: '7rem 2.5rem' }}>
                <div className="cta-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }}>
                        <h2 style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 900, lineHeight: 0.92, letterSpacing: '-0.05em', color: '#fff' }}>
                            ¿TU EMPRESA<br />ESTÁ<br />PROTEGIDA?
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '1.5rem', lineHeight: 1.7 }}>
                            Solicita tu propuesta personalizada. Evaluamos tu empresa frente al DS44 y la Ley Karin en una sesión directa con Carla para diseñar un plan a tu medida.
                        </p>
                    </motion.div>
                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} custom={1}>
                        {!sent ? (
                            <form onSubmit={e => { e.preventDefault(); setSent(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                {['Nombre de tu empresa', 'Tu email', 'WhatsApp / teléfono'].map(p => (
                                    <input key={p} required placeholder={p}
                                        style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '0.75rem', padding: '0.9rem 1.1rem', color: '#fff', fontSize: '0.9rem', outline: 'none', fontFamily: 'Inter,sans-serif' }}
                                        onFocus={e => (e.target.style.borderColor = 'rgba(255,255,255,0.6)')}
                                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.25)')} />
                                ))}
                                <button type="submit" style={{ background: '#fff', color: '#2563EB', border: 'none', borderRadius: '9999px', padding: '1rem', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '0.08em', cursor: 'pointer', fontFamily: "'Space Grotesk',sans-serif", marginTop: '0.5rem', transition: 'transform 0.2s' }}
                                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
                                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                                    SOLICITAR COTIZACIÓN →

                                </button>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', textAlign: 'center' }}>Sin spam. Respondemos en menos de 24 horas.</p>
                            </form>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
                                <div style={{ color: '#fff', fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>¡Listo!</div>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Carla te contacta en menos de 24 horas.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ background: '#060E1A', borderTop: '1px solid #1E3A5F', padding: '2.5rem 2.5rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <Image src={LOGO} alt="CAPREX" width={160} height={45} style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5)) drop-shadow(0 0 3px rgba(255,255,255,0.8))' }} />
                    <span style={{ color: '#64748B', fontSize: '0.75rem' }}>© 2025 CAPREX · Prevención de Riesgos · Chile</span>
                    <a
                        href="https://hojacero.cl"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#64748B', fontSize: '0.7rem', textDecoration: 'none' }}
                        className="hover:text-[#2563EB] transition-colors"
                        aria-label="HojaCero - Ingeniería de Software, Infraestructura Digital y Soluciones SaaS de alto performance. Contacto: contacto@hojacero.cl"
                        title="HojaCero.cl | Engineering Digital Solutions & AEO"
                    >
                        Architect of Digital Experiences by <span style={{ fontWeight: 800, textDecoration: 'underline' }}>HojaCero.cl</span>
                    </a>
                </div>
            </footer>

            {/* ── MODAL CONTACTO ── */}
            <AnimatePresence>
                {contactOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
                        onClick={() => setContactOpen(false)}>
                        <motion.div initial={{ y: 30, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0 }}
                            style={{ background: '#111D35', border: '1px solid #1E3A5F', borderRadius: '1.5rem', padding: '2.5rem', width: '100%', maxWidth: '520px' }}
                            onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div>
                                    <p style={{ color: '#2563EB', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Solicitar propuesta</p>
                                    <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '2rem', fontWeight: 900, color: '#E2EAF8', letterSpacing: '-0.04em' }}>Hablemos.</h3>
                                </div>
                                <button onClick={() => setContactOpen(false)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}><X size={22} /></button>
                            </div>
                            <form onSubmit={e => { e.preventDefault(); setSent(true); setContactOpen(false); }} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                                {['Nombre de tu empresa', 'Tu email', 'Tu WhatsApp'].map(p => (
                                    <input key={p} required placeholder={p} style={{ background: '#0B1526', border: '1px solid #1E3A5F', borderRadius: '0.75rem', padding: '0.85rem 1.1rem', color: '#E2EAF8', fontSize: '0.9rem', outline: 'none', fontFamily: 'Inter,sans-serif' }} />
                                ))}
                                <button type="submit" className="c-btn c-btn-primary" style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}>
                                    Enviar solicitud
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
