'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, Menu, X, Shield, BookOpen, Users, Search, AlertTriangle, FileCheck, Brain, MessageCircle, ChevronDown, CheckCircle2, ArrowRight } from 'lucide-react';

const LOGO = '/prospectos/caprex/logo.png';
const WA_LINK = 'https://wa.me/56926198159?text=Hola%2C%20quiero%20un%20diagn%C3%B3stico%20gratuito%20para%20mi%20empresa';
const NAV = ['Servicios', 'Nosotros', 'Proceso', 'Contacto'];

const SERVICES = [
    { icon: Shield, n: '01', title: 'Asesoría Externa DS44', sub: 'Cumplimiento normativo continuo', desc: 'Tu empresa cumple el DS44 con un prevencionista externo dedicado. Sin costos de planta. Sin brechas legales.' },
    { icon: Search, n: '02', title: 'Diagnóstico IPER', sub: 'Identificación de peligros en terreno', desc: 'Levantamos la matriz de riesgos real de tu operación. Cada peligro identificado, con plan de control concreto.' },
    { icon: BookOpen, n: '03', title: 'Planes de Prevención', sub: 'Programa anual a medida', desc: 'Diseño del programa preventivo anual adaptado a tu rubro. Documentación técnica, registros y acompañamiento.' },
    { icon: Users, n: '04', title: 'Capacitación', sub: 'Equipos y comités paritarios', desc: 'Cursos certificados presencial e híbrido. Trabajos en altura, riesgos eléctricos, 5S, primeros auxilios.' },
    { icon: AlertTriangle, n: '05', title: 'Protocolo Ley Karin', sub: 'Ley 21.643 — vigente agosto 2024', desc: 'Diseño e implementación del protocolo obligatorio. Canales de denuncia, capacitación RRHH y directivos.', hot: true },
    { icon: FileCheck, n: '06', title: 'Auditorías de Seguridad', sub: 'Documental y en terreno', desc: 'Verificación de cumplimiento normativo. Informe con hallazgos, brechas y recomendaciones priorizadas.' },
    { icon: Brain, n: '07', title: 'Riesgos Psicosociales', sub: 'CEAL-SM/SUSESO + plan de acción', desc: 'Diagnóstico, focus group e informe técnico. Cumplimiento Protocolo MINSAL y DS44.' },
];

const STEPS = [
    { n: '01', title: 'Diagnóstico gratuito', desc: 'Sesión de 45 min con Carla para evaluar el estado real de tu empresa frente al DS44, Ley Karin y normativa vigente.' },
    { n: '02', title: 'Plan a medida', desc: 'Proponemos un plan específico para tu rubro, tamaño y riesgos. Sin paquetes genéricos, sin costos de planta.' },
    { n: '03', title: 'Acompañamiento continuo', desc: 'Implementamos, capacitamos y auditamos. Contigo cada vez que la normativa cambie o un inspector llegue.' },
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
    const countYrs = useCounter(7, statsVisible, 1000);

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
        .c-btn-ghost:hover { border-color:#2563EB;color:#2563EB; }
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
        .testi-card { background:rgba(255,255,255,0.03);border:1px solid #1E3A5F44;border-radius:1.25rem;padding:2rem;display:flex;flex-direction:column;gap:1.25rem;transition:all 0.3s; }
        .testi-card:hover { border-color:#2563EB44;background:rgba(37,99,235,0.05); }
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

          /* Padding secciones en mobile */
          .caprex-root section{padding-left:1.25rem!important;padding-right:1.25rem!important;padding-top:4rem!important;padding-bottom:4rem!important;}

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
                    <Image src={LOGO} alt="CAPREX" width={200} height={56} style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5)) drop-shadow(0 0 3px rgba(255,255,255,0.8))' }} priority />
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
                        Diagnóstico gratuito
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
                        <button className="c-btn c-btn-primary" onClick={() => { setMenuOpen(false); setContactOpen(true); }}>Agendar diagnóstico</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── HERO ── */}
            <section ref={heroRef} style={{ height: '100vh', display: 'flex', alignItems: 'center', padding: '5rem 2.5rem 3rem', position: 'relative', overflow: 'hidden' }}>
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
                                <span style={{ color: '#2563EB', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>DS44 · Ley Karin · Ley 16.744</span>
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
                                Consultoría boutique en prevención de riesgos laborales. Rigor técnico, trato directo — sin intermediarios ni call centers.
                            </motion.p>

                            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
                                style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <button className="c-btn c-btn-primary" onClick={() => setContactOpen(true)}>
                                    Diagnóstico gratuito <ChevronRight size={15} />
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

            {/* ── SERVICIOS (lista editorial) ── */}
            <section id="servicios" style={{ background: '#0F1A2E', padding: '7rem 2.5rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                        style={{ borderLeft: '4px solid #2563EB', paddingLeft: '1.5rem', marginBottom: '5rem' }}>
                        <span style={{ color: '#2563EB', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Lo que hacemos</span>
                        <h2 style={{ fontSize: 'clamp(3rem,7vw,6rem)', fontWeight: 900, lineHeight: 0.95, marginTop: '0.5rem', letterSpacing: '-0.05em' }}>
                            SERVICIOS<br /><span style={{ color: '#1E3A5F' }}>DE IMPACTO.</span>
                        </h2>
                    </motion.div>

                    {SERVICES.map((s, i) => (
                        <motion.div key={s.n} className="svc-row"
                            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.5}>
                            <div style={{ color: '#2563EB22', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', paddingTop: '0.25rem', fontFamily: "'Space Grotesk',sans-serif" }}>{s.n}</div>
                            <div style={{ paddingRight: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#E2EAF8', lineHeight: 1.1 }}>{s.title}</h3>
                                    {s.hot && <span className="hot-tag">Alta demanda</span>}
                                </div>
                                <div style={{ color: '#2563EB', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.sub}</div>
                            </div>
                            <p className="svc-desc" style={{ color: '#64748B', fontSize: '0.93rem', lineHeight: 1.7 }}>{s.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── CÓMO FUNCIONA ── */}
            <section id="proceso" style={{ background: '#0B1526', padding: '7rem 2.5rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                        style={{ marginBottom: '5rem', textAlign: 'center' }}>
                        <span style={{ color: '#2563EB', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>El proceso</span>
                        <h2 style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 900, lineHeight: 0.95, marginTop: '0.5rem', letterSpacing: '-0.05em' }}>
                            ¿CÓMO<br /><span style={{ color: 'transparent', WebkitTextStroke: '1.5px #2563EB' }}>FUNCIONA?</span>
                        </h2>
                    </motion.div>

                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                        style={{ marginTop: '3rem', marginBottom: '3rem', height: '1px', background: 'linear-gradient(90deg,transparent,#2563EB,transparent)' }} />

                    <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem', position: 'relative' }}>
                        {STEPS.map((step, i) => (
                            <motion.div key={step.n} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1E3A5F44', borderRadius: '1.5rem', padding: '2.5rem 2rem', position: 'relative', zIndex: 1 }}>
                                <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: '#0B1526', border: '2px solid #2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                    <span style={{ color: '#2563EB', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 900, fontSize: '0.85rem' }}>{step.n}</span>
                                </div>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.03em' }}>{step.title}</h3>
                                <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.7 }}>{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                        style={{ marginTop: '3rem', textAlign: 'center' }}>
                        <button className="c-btn c-btn-primary" onClick={() => setContactOpen(true)}>
                            Empezar con el diagnóstico <ArrowRight size={16} />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ── CARLA (dark editorial) ── */}
            <section id="nosotros" style={{ padding: '7rem 2.5rem', background: '#0F1A2E', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,#2563EB12 0%,transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div className="carla-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>

                        {/* Foto editorial */}
                        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ position: 'relative' }}>
                            <div className="carla-foto" style={{
                                width: '100%', aspectRatio: '3/4',
                                background: 'linear-gradient(160deg,#1A2D6B 0%,#0B1526 100%)',
                                borderRadius: '2rem', border: '1px solid #1E3A5F',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
                                padding: '3rem', overflow: 'hidden', position: 'relative',
                            }}>
                                <div style={{ position: 'absolute', top: '2rem', left: '50%', transform: 'translateX(-50%)', fontSize: '6rem', opacity: 0.08, fontFamily: "'Space Grotesk',sans-serif", fontWeight: 900, letterSpacing: '-0.05em', color: '#2563EB', whiteSpace: 'nowrap' }}>CARLA</div>
                                <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.35em', color: '#2563EB', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Prevencionista de Riesgos</div>
                                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '2.5rem', fontWeight: 900, color: '#E2EAF8', letterSpacing: '-0.04em' }}>Carla</div>
                                    <div style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '0.5rem' }}>Fundadora · CAPREX</div>
                                </div>
                                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#2563EB', borderRadius: '0.5rem', padding: '0.4rem 0.8rem' }}>
                                    <span style={{ color: '#fff', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em' }}>7+ AÑOS EXP.</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Copy */}
                        <div>
                            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
                                <span style={{ color: '#2563EB', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Por qué CAPREX</span>
                                <h2 style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 900, lineHeight: 1.05, marginTop: '0.75rem', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
                                    No eres un número de expediente.<br />
                                    <span style={{ color: '#2563EB' }}>Eres una empresa que proteger.</span>
                                </h2>
                                <p style={{ color: '#64748B', lineHeight: 1.8, marginBottom: '2rem' }}>
                                    Carla lleva más de 7 años implementando sistemas de prevención en empresas reales — no en auditorías masivas. Cada cliente tiene acceso directo, respuesta rápida y soluciones adaptadas al rubro.
                                </p>
                            </motion.div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                {['Trato directo con la prevencionista titular', 'Experiencia DS44, Ley Karin y riesgos psicosociales', 'Respuesta en menos de 24 horas garantizada', 'Sin contratos mínimos de planta'].map((f, i) => (
                                    <motion.div key={f} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 1}
                                        style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                        <CheckCircle2 size={16} color="#2563EB" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                                        <span style={{ color: '#94A3B8', fontSize: '0.95rem' }}>{f}</span>
                                    </motion.div>
                                ))}
                            </div>
                            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={5}
                                style={{ marginTop: '2.5rem' }}>
                                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="c-btn c-btn-primary">
                                    <MessageCircle size={16} /> Hablar con Carla
                                </a>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIOS ── */}
            <section style={{ background: '#0B1526', padding: '7rem 2.5rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                        style={{ marginBottom: '4rem' }}>
                        <span style={{ color: '#2563EB', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Clientes</span>
                        <h2 style={{ fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 900, lineHeight: 0.95, marginTop: '0.5rem', letterSpacing: '-0.05em' }}>
                            LO QUE DICEN<br /><span style={{ color: '#1E3A5F' }}>NUESTROS CLIENTES.</span>
                        </h2>
                    </motion.div>
                    <div className="testi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
                        {TESTIMONIALS.map((t, i) => (
                            <motion.div key={t.initials} className="testi-card" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
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
                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: '4rem', textAlign: 'center' }}>
                        <span style={{ color: '#2563EB', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Preguntas frecuentes</span>
                        <h2 style={{ fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 900, lineHeight: 0.95, marginTop: '0.5rem', letterSpacing: '-0.05em' }}>
                            TODO LO QUE<br /><span style={{ color: '#2563EB' }}>NECESITAS SABER.</span>
                        </h2>
                    </motion.div>
                    <div>
                        {FAQS.map((faq, i) => (
                            <motion.div key={i} className="faq-item" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.3}>
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
                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        <h2 style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 900, lineHeight: 0.92, letterSpacing: '-0.05em', color: '#fff' }}>
                            ¿TU EMPRESA<br />ESTÁ<br />PROTEGIDA?
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '1.5rem', lineHeight: 1.7 }}>
                            El primer diagnóstico es gratuito. Sin compromiso. Evaluamos tu empresa frente al DS44 y la Ley Karin en una sesión directa con Carla.
                        </p>
                    </motion.div>
                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
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
                                    QUIERO MI DIAGNÓSTICO GRATUITO →
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
                    <span style={{ color: '#64748B44', fontSize: '0.7rem' }}>Diseñado por HojaCero</span>
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
                                    <p style={{ color: '#2563EB', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Diagnóstico Gratuito</p>
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
