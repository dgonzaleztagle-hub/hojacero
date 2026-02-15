"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Beaker,
  BookOpen,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Contact,
  Layers,
  Phone,
  ShoppingBag,
  Sparkles,
  Wrench,
} from "lucide-react";

const menu = [
  { label: "Inicio", href: "#inicio" },
  { label: "Quienes Somos", href: "#quienes" },
  { label: "Asesorias", href: "#asesorias" },
  { label: "Ventas", href: "#ventas" },
  { label: "Servicios", href: "#servicios" },
  { label: "Capacitacion", href: "#capacitacion" },
  { label: "Catalogo", href: "#catalogo" },
  { label: "Galeria", href: "#galeria" },
  { label: "Contacto", href: "#contacto" },
];

export default function Biocrom2MirrorPage() {
  return (
    <main className="min-h-screen bg-[#07182F] text-[#EAF0F8] selection:bg-[#D10A2A] selection:text-white overflow-x-hidden">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07182F]/85 backdrop-blur-md">
        <nav className="mx-auto max-w-7xl px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D10A2A]">Biocrom Demo Mirror</p>
            <a href="tel:+56950069920" className="hidden rounded-full bg-[#D10A2A] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white md:inline-flex">
              Llamar
            </a>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {menu.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="whitespace-nowrap rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-semibold tracking-[0.1em] hover:bg-white/12"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <section id="inicio" className="relative isolate border-b border-white/10">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-44 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[#D10A2A]/25 blur-3xl" />
          <div
            className="absolute inset-0 opacity-35"
            style={{
              backgroundImage:
                "linear-gradient(rgba(234,240,248,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(234,240,248,0.08) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
        </div>

        <div className="mx-auto grid max-w-7xl gap-8 px-6 pb-16 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:pt-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#EAF0F8]/95">
              <Sparkles className="h-3.5 w-3.5 text-[#D10A2A]" />
              Mirror + Premium Protocol
            </p>
            <h1 className="mt-5 text-[clamp(2.3rem,8.6vw,6.2rem)] font-extrabold leading-[0.9] tracking-[-0.04em]">
              Venta, soporte y servicio
              <span className="block text-[#D10A2A]">en cromatografia.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[clamp(1rem,2.2vw,1.24rem)] leading-relaxed text-[#EAF0F8]/84">
              Biocrom declara inicio de actividades en 2014 y foco en venta, capacitacion,
              soporte y servicio. Esta demo mantiene esa estructura y la eleva visualmente.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="tel:+56950069920" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#D10A2A] px-8 py-3 text-sm font-bold uppercase tracking-[0.11em]">
                Contacto directo <ArrowUpRight className="h-4 w-4" />
              </a>
              <a href="#servicios" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-8 py-3 text-sm font-semibold uppercase tracking-[0.11em]">
                Ver servicios
              </a>
            </div>
          </motion.div>

          <div className="rounded-[1.8rem] border border-white/20 bg-[#0A1F3B]/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#EAF0F8]/65">Senales reales detectadas</p>
            <ul className="mt-4 space-y-3 text-sm text-[#EAF0F8]/86">
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[#D10A2A]" /> Inicio reportado en 2014.</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[#D10A2A]" /> Lineas: ventas, servicios, asesorias, capacitacion.</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[#D10A2A]" /> Contacto y direccion publicados en sitio original.</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="quienes" className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
        <div className="grid gap-5 md:grid-cols-12">
          <article className="md:col-span-7 rounded-[1.8rem] border border-white/15 bg-gradient-to-br from-[#122d53] to-[#0A1F3B] p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[#D10A2A]">Quienes Somos</p>
            <h2 className="mt-3 text-[clamp(1.7rem,4.8vw,3.1rem)] font-bold tracking-[-0.03em]">Base historica + evolucion tecnica</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#EAF0F8]/84">
              Biocrom EIRL indica inicio en septiembre de 2014. En su presentacion declara
              crecimiento hacia Equipos de Laboratorio y area de Optica/Microscopia desde 2017.
            </p>
          </article>
          <article className="md:col-span-5 rounded-[1.8rem] border border-white/15 bg-gradient-to-br from-[#2B1738] to-[#0A1F3B] p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[#D10A2A]">Mision</p>
            <p className="mt-3 text-sm leading-relaxed text-[#EAF0F8]/84">
              Entregar soluciones integrales con relacion calidad/precio.
            </p>
          </article>
        </div>
      </section>

      <section id="asesorias" className="border-y border-white/10 bg-[#051328]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
          <p className="text-xs uppercase tracking-[0.18em] text-[#D10A2A]">Asesorias</p>
          <h2 className="mt-3 text-[clamp(1.7rem,4.6vw,3rem)] font-bold tracking-[-0.03em]">Metodologias analiticas y procesos</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[{t:"Desarrollo",i:ClipboardCheck},{t:"Validacion",i:Activity},{t:"Acompanamiento",i:Wrench}].map((x)=>{const I=x.i; return <div key={x.t} className="rounded-2xl border border-white/15 bg-white/5 p-5"><I className="h-5 w-5 text-[#D10A2A]" /><h3 className="mt-3 font-semibold">{x.t}</h3><p className="mt-2 text-sm text-[#EAF0F8]/82">Apoyo tecnico orientado a resultados reproducibles.</p></div>})}
          </div>
        </div>
      </section>

      <section id="ventas" className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
        <p className="text-xs uppercase tracking-[0.18em] text-[#D10A2A]">Ventas</p>
        <h2 className="mt-3 text-[clamp(1.7rem,4.6vw,3rem)] font-bold tracking-[-0.03em]">Linea comercial integrada al soporte</h2>
        <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-6 text-sm leading-relaxed text-[#EAF0F8]/84">
          La web publica mantiene una seccion dedicada a ventas dentro de su estructura principal,
          coherente con su enfoque en instrumental y continuidad operacional.
        </div>
      </section>

      <section id="servicios" className="border-y border-white/10 bg-[#06162D]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
          <p className="text-xs uppercase tracking-[0.18em] text-[#D10A2A]">Servicios</p>
          <h2 className="mt-3 text-[clamp(1.7rem,4.6vw,3rem)] font-bold tracking-[-0.03em]">Cobertura tecnica operativa</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              ["Soporte", Wrench],
              ["Diagnostico", Activity],
              ["Mantenimiento", Layers],
              ["Continuidad", Beaker],
            ].map(([label, Icon]) => {
              const I = Icon as React.ComponentType<{ className?: string }>;
              return (
                <div key={label as string} className="rounded-2xl border border-white/15 bg-white/5 p-5">
                  <I className="h-5 w-5 text-[#D10A2A]" />
                  <p className="mt-3 font-semibold">{label as string}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="capacitacion" className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
        <p className="text-xs uppercase tracking-[0.18em] text-[#D10A2A]">Capacitacion</p>
        <h2 className="mt-3 text-[clamp(1.7rem,4.6vw,3rem)] font-bold tracking-[-0.03em]">Cursos abiertos y cerrados</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {["Teorico-practicos", "Con o sin SENCE", "Enfocados en area"].map((item) => (
            <div key={item} className="rounded-2xl border border-white/15 bg-white/5 p-5 text-sm text-[#EAF0F8]/84">
              <BookOpen className="mb-2 h-5 w-5 text-[#D10A2A]" />
              {item}
            </div>
          ))}
        </div>
      </section>

      <section id="catalogo" className="border-y border-white/10 bg-[#051328]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
          <p className="text-xs uppercase tracking-[0.18em] text-[#D10A2A]">Catalogo de Productos</p>
          <h2 className="mt-3 text-[clamp(1.7rem,4.6vw,3rem)] font-bold tracking-[-0.03em]">Oferta de productos en ruta dedicada</h2>
          <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-6 text-sm leading-relaxed text-[#EAF0F8]/84">
            Se mantiene el bloque de catalogo dentro del recorrido para reflejar la arquitectura original
            y no perder lineas de negocio de la web fuente.
          </div>
        </div>
      </section>

      <section id="galeria" className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
        <p className="text-xs uppercase tracking-[0.18em] text-[#D10A2A]">Galeria de Fotos</p>
        <h2 className="mt-3 text-[clamp(1.7rem,4.6vw,3rem)] font-bold tracking-[-0.03em]">Evidencia visual de actividad</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {["Banners", "Fotos tecnicas", "Representaciones en Chile"].map((item) => (
            <div key={item} className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <Camera className="h-5 w-5 text-[#D10A2A]" />
              <p className="mt-2 text-sm text-[#EAF0F8]/84">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contacto" className="bg-[#D10A2A] text-white">
        <div className="mx-auto grid max-w-7xl gap-7 px-6 py-14 sm:py-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/80">Contacto</p>
            <h2 className="mt-3 text-[clamp(2rem,5.8vw,4.1rem)] font-extrabold leading-[0.92] tracking-[-0.04em]">
              Estructura real,
              <span className="block">presentacion premium.</span>
            </h2>
          </div>
          <div className="space-y-3 rounded-2xl bg-[#8E001B]/40 p-6">
            <a href="tel:+56950069920" className="flex min-h-12 items-center gap-3 rounded-xl bg-white/15 px-4 py-3 text-sm"><Phone className="h-4 w-4" /> +56 9 500 69 920</a>
            <div className="flex min-h-12 items-center gap-3 rounded-xl bg-white/15 px-4 py-3 text-sm"><Contact className="h-4 w-4" /> Sr. Patricio Puentes</div>
            <div className="flex min-h-12 items-center gap-3 rounded-xl bg-white/15 px-4 py-3 text-sm"><ShoppingBag className="h-4 w-4" /> Paris 789 Departamento 601, Santiago Centro</div>
          </div>
        </div>
      </section>
    </main>
  );
}
