"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Activity, Smartphone, Search, AlertTriangle, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";

type BranchType = "web" | "noweb" | "app" | null;

type ScreenContext = 
  | "welcome"
  | "q1"
  | "q2_web" | "q3_web"
  | "q2_noweb" | "q3_noweb"
  | "q2_app" | "q3_app"
  | "capture"
  | "analyzing"
  | "result";

export default function AuditoriaTecnicaFunnel() {
  const [currentScreen, setCurrentScreen] = useState<ScreenContext>("welcome");
  const [branch, setBranch] = useState<BranchType>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({
    email: "",
  });
  const [progress, setProgress] = useState(0);

  // Calcular progreso visual
  useEffect(() => {
    let newProgress = 0;
    if (currentScreen === "q1") newProgress = 25;
    if (currentScreen.includes("q2")) newProgress = 50;
    if (currentScreen.includes("q3")) newProgress = 75;
    if (["capture", "analyzing", "result"].includes(currentScreen)) newProgress = 100;
    setProgress(newProgress);
  }, [currentScreen]);

  const handleSelectRoot = (value: string, selectedBranch: BranchType) => {
    setBranch(selectedBranch);
    setAnswers(prev => ({ ...prev, etapa: value }));
    if (selectedBranch === "web") setCurrentScreen("q2_web");
    if (selectedBranch === "noweb") setCurrentScreen("q2_noweb");
    if (selectedBranch === "app") setCurrentScreen("q2_app");
  };

  const handleSelect = (key: string, value: string, nextScreen: ScreenContext) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setCurrentScreen(nextScreen);
  };

  const handleCaptureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answers.email) return;
    setCurrentScreen("analyzing");
    
    // Simular tiempo de procesamiento técnico para mayor percepción de valor
    setTimeout(() => {
      setCurrentScreen("result");
    }, 3500);
  };

  // Variantes de animación
  const screenVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  };

  // Generar contenido de resultados dinámico (Branching Logic)
  const getResultContent = () => {
    if (branch === "web") {
      return {
        title: "Fricción Móvil y Latencia de UX",
        level: "Alto",
        p1: `Basado en tu uso actual de tráfico (${answers.trafico || "canales digitales"}), estás perdiendo al menos un 40% de tus conversiones en el paso final.`,
        p2: "La infraestructura tecnológica ralentiza la decisión de compra, provocando rebotes invisibles antes de que logren contactarte o pagar.",
        items: ["Embudos 'Mobile-First' de Alta Conversión", "Supresión de Latencia (Carga Sub-1 Segundo)", "Ingeniería de Autoridad Visual (Cierre más fácil)"]
      };
    }
    if (branch === "noweb") {
      return {
        title: "Fuga de Autoridad y Dependencia de Redes",
        level: "Crítico",
        p1: `Depender exclusivamente de ${answers.canal || "redes sociales"} significa que le estás regalando tus mejores clientes a la competencia que sí está bien posicionada.`,
        p2: "Estás perdiendo entre un 50% y 70% del tráfico VIP. Quienes tienen presupuesto alto, investigan primero y necesitan ver un cuartel digital premium que les dé confianza.",
        items: ["Creación de Cuartel Digital Escalable", "Módulo Automático para dejar de responder a mano", "Proyección de Autoridad (Que parezcas corporación)"]
      };
    }
    return {
      title: "Riesgo Estructural: Arquitectura Incierta",
      level: "Severo",
      p1: `Para tu proyecto, el mayor riesgo de desastre financiero no es de código, sino de planificación. El 80% de softwares fallan por saltarse la arquitectura técnica.`,
      p2: "Empezar a programar sin un 'Blueprint' o Mapa Técnico claro multiplica tus costos por 3 y termina en una plataforma inestable que tus clientes no usarán.",
      items: ["Levantamiento de Arquitectura H0", "Plano Técnico Exclusivo y Escalable", "Definición Crítica: PWA vs Nativo"]
    };
  };

  const resultContent = getResultContent();

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] text-white overflow-hidden">
      
      {/* Barra de Progreso */}
      <AnimatePresence>
        {progress > 0 && currentScreen !== "result" && currentScreen !== "analyzing" && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 w-full h-1 bg-white/10"
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-md p-6 relative h-[100dvh] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {/* PATALLA 1: GANCHO GENERAL */}
          {currentScreen === "welcome" && (
            <motion.div key="welcome" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center text-center space-y-8">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-10 h-10 text-indigo-500" />
              </div>
              <h1 className="text-3xl font-bold leading-tight">
                Descubre cómo está perdiendo dinero tu negocio <span className="metallic-text break-words">en el mundo digital</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Haz esta auditoría estratégica de 45 segundos y descubre tu "Fuga de Crecimiento".
              </p>
              <button 
                onClick={() => setCurrentScreen("q1")}
                className="w-full py-4 mt-8 bg-white text-black font-semibold rounded-2xl flex items-center justify-center space-x-2 active:scale-95 transition-transform"
              >
                <span>Diagnosticar mi negocio</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* PREGUNTA 1: FILTRO MAESTRO (EL ENRUTADOR) */}
          {currentScreen === "q1" && (
            <motion.div key="q1" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col space-y-6">
              <span className="text-indigo-400 font-semibold tracking-wide text-sm uppercase">Pregunta 1 de 3</span>
              <h2 className="text-2xl font-bold">¿En qué etapa de digitalización se encuentra tu negocio hoy?</h2>
              <div className="space-y-3 mt-4">
                <button onClick={() => handleSelectRoot("Tengo Web", "web")} className="w-full p-5 text-left border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-lg font-medium">
                  🌐 Ya tengo una web (quiero escalar / optimizar)
                </button>
                <button onClick={() => handleSelectRoot("Sin Web", "noweb")} className="w-full p-5 text-left border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-lg font-medium">
                  📱 Aún no tengo web (vendo solo por redes / chat)
                </button>
                <button onClick={() => handleSelectRoot("App", "app")} className="w-full p-5 text-left border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-lg font-medium">
                  💻 Necesito desarrollar una App o Software a medida
                </button>
              </div>
            </motion.div>
          )}

          {/* ======================= RAMA: CON WEB ======================= */}
          {currentScreen === "q2_web" && (
            <motion.div key="q2_web" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col space-y-6">
              <span className="text-indigo-400 font-semibold tracking-wide text-sm uppercase">Pregunta 2 de 3</span>
              <h2 className="text-2xl font-bold">¿Cuál es tu principal fuente de visitantes al mes?</h2>
              <div className="space-y-3 mt-4">
                {["Meta Ads (Instagram/Facebook)", "SEO (Motores de Búsqueda)", "Publicidad Tradicional o Boca a boca", "No invierto en tráfico todavía"].map((opt) => (
                  <button key={opt} onClick={() => handleSelect("trafico", opt, "q3_web")} className="w-full p-5 text-left border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-lg font-medium">
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {currentScreen === "q3_web" && (
            <motion.div key="q3_web" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col space-y-6">
              <span className="text-indigo-400 font-semibold tracking-wide text-sm uppercase">Pregunta 3 de 3</span>
              <h2 className="text-2xl font-bold">¿Qué tanto vendes en proporción a las visitas de tu web?</h2>
              <div className="space-y-3 mt-4">
                {["Muy poco, menos del 1%", "Desempeño normal, entre 1% y 3%", "Muy bien, más del 3%", "La verdad es que no tengo idea"].map((opt) => (
                  <button key={opt} onClick={() => handleSelect("conversion_web", opt, "capture")} className="w-full p-5 text-left border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-lg font-medium">
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ======================= RAMA: SIN WEB ======================= */}
          {currentScreen === "q2_noweb" && (
            <motion.div key="q2_noweb" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col space-y-6">
              <span className="text-indigo-400 font-semibold tracking-wide text-sm uppercase">Pregunta 2 de 3</span>
              <h2 className="text-2xl font-bold">¿Cuál es tu canal principal para conseguir clientes?</h2>
              <div className="space-y-3 mt-4">
                {["Mensajes Directos de Instagram", "Grupos de WhatsApp / Recomendaciones", "Tráfico a un Local Físico", "Marketplaces (MercadoLibre, PedidosYa)"].map((opt) => (
                  <button key={opt} onClick={() => handleSelect("canal", opt, "q3_noweb")} className="w-full p-5 text-left border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-lg font-medium">
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {currentScreen === "q3_noweb" && (
            <motion.div key="q3_noweb" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col space-y-6">
              <span className="text-indigo-400 font-semibold tracking-wide text-sm uppercase">Pregunta 3 de 3</span>
              <h2 className="text-2xl font-bold">¿Qué es lo que principalmente vendes?</h2>
              <div className="space-y-3 mt-4">
                {["Servicios o Agenda Comercial", "Productos Físicos (Retail / Envíos)", "Gastronomía (Delivery / Restaurante)", "Quiero vender Cursos Comerciales (Infoproductos)"].map((opt) => (
                  <button key={opt} onClick={() => handleSelect("modelo", opt, "capture")} className="w-full p-5 text-left border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-lg font-medium">
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ======================= RAMA: APP / SOFTWARE ================= */}
          {currentScreen === "q2_app" && (
            <motion.div key="q2_app" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col space-y-6">
              <span className="text-indigo-400 font-semibold tracking-wide text-sm uppercase">Pregunta 2 de 3</span>
              <h2 className="text-2xl font-bold">¿Cuál es el propósito inicial de este Software?</h2>
              <div className="space-y-3 mt-4">
                {["Uso interno para automatizar y administrar mi negocio", "Modelo SaaS o B2C para fidelizar a mis clientes", "Crear una Startup base tecnológica desde cero", "Aún lo estoy definiendo"].map((opt) => (
                  <button key={opt} onClick={() => handleSelect("motivo", opt, "q3_app")} className="w-full p-5 text-left border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-lg font-medium">
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {currentScreen === "q3_app" && (
            <motion.div key="q3_app" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col space-y-6">
              <span className="text-indigo-400 font-semibold tracking-wide text-sm uppercase">Pregunta 3 de 3</span>
              <h2 className="text-2xl font-bold">¿Qué nivel de claridad tienes hoy respecto a la tecnología requerida?</h2>
              <div className="space-y-3 mt-4">
                {["Tengo diseño UX exacto y requiero que lo codifiquen", "Tengo claro qué quiero que haga, pero no cómo se debe construir", "Solo tengo un problema de negocio y necesito la arquitectura completa"].map((opt) => (
                  <button key={opt} onClick={() => handleSelect("requisitos", opt, "capture")} className="w-full p-5 text-left border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-lg font-medium">
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ======================= PANTALLAS COMPARTIDAS ================= */}

          {/* CAPTURA: GATILLO (SOlO EMAIL) */}
          {currentScreen === "capture" && (
            <motion.div key="capture" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col space-y-6 text-center mt-10">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold">¡Diagnóstico Listo!</h2>
              <p className="text-gray-400 text-lg px-4">
                Hemos identificado un patrón crónico sobre el estado que nos comentas.
              </p>
              
              <form onSubmit={handleCaptureSubmit} className="w-full mt-8 space-y-4">
                <div className="text-left">
                  <label className="text-sm text-gray-400 font-medium ml-2">Ingresa tu correo corporativo o de uso principal</label>
                  <input 
                    type="email" 
                    required
                    placeholder="correo@empresa.com"
                    value={answers.email}
                    onChange={(e) => setAnswers(prev => ({...prev, email: e.target.value}))}
                    className="w-full mt-2 p-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-indigo-500 transition-colors text-lg"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] active:scale-95 transition-all text-lg flex justify-center items-center space-x-2"
                >
                  <span>Ver mi Resultado Exacto</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <p className="text-xs text-gray-500 mt-4">Este informe es exclusivo y confidencial.</p>
              </form>
            </motion.div>
          )}

          {/* PANTALLA DE CARGA (SIMULADOR DE ANÁLISIS) */}
          {currentScreen === "analyzing" && (
            <motion.div key="analyzing" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center justify-center space-y-6 h-full text-center">
              <div className="relative w-24 h-24 mb-4">
                <motion.div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
                <motion.div 
                  className="absolute inset-0 border-4 border-t-indigo-500 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Search className="w-8 h-8 text-indigo-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold animate-pulse">Cruzando parámetros con base de datos tecnológica...</h2>
              
              {/* Textos simulados en base a la rama */}
              <motion.div className="text-gray-400 h-6 overflow-hidden">
                <motion.div
                  animate={{ y: [0, -24, -48, -72] }}
                  transition={{ duration: 3.5, times: [0, 0.3, 0.6, 1], ease: "linear" }}
                >
                  <p className="h-6 whitespace-nowrap">Analizando arquitectura del patrón indicado...</p>
                  <p className="h-6 whitespace-nowrap">Evaluando riesgos de escalabilidad y abandono...</p>
                  <p className="h-6 whitespace-nowrap">Consultando soluciones modulares óptimas...</p>
                  <p className="h-6 whitespace-nowrap">Generando radiografía técnica y prioridades...</p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* PANTALLA DE RESULTADOS (LA OFERTA ASIMÉTRICA) */}
          {currentScreen === "result" && (
            <motion.div key="result" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col space-y-6 overflow-y-auto pb-8 no-scrollbar">
              
              <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-3xl p-6 text-center mt-4 shrink-0">
               <Activity className="w-10 h-10 text-red-500 mx-auto mb-4" />
               <h2 className="text-xl text-gray-300 mb-2">Diagnóstico Técnico Inmediato:</h2>
               <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                 {resultContent.title}
               </h3>
               <p className="text-red-400/80 text-sm">Nivel de Riesgo Operativo: {resultContent.level}</p>
              </div>

              <div className="space-y-4 px-2 shrink-0">
                <p className="text-gray-300 leading-relaxed text-lg">
                  {resultContent.p1}
                </p>
                <p className="text-gray-400">
                  {resultContent.p2}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-4 shrink-0">
                <h4 className="text-white font-semibold mb-4 flex items-center">
                  <ShieldAlert className="w-5 h-5 mr-2 text-indigo-400" /> 
                  La Solución y Arquitectura Recomendada
                </h4>
                <p className="text-sm text-gray-400 mb-4">Requerimos sellar esta falla mediante una intervención directa en un plan a la medida enfocado en:</p>
                <ul className="space-y-3 mb-6">
                  {resultContent.items.map((item, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-indigo-400 mr-2 shrink-0"/> {item}
                    </li>
                  ))}
                </ul>

                <a 
                  href="https://wa.me/56912345678?text=Hola,%20acabo%20de%20realizar%20la%20auditoría%20estratégica%20y%20quiero%20agendar%20una%20llamada%20de%20diagnóstico%20técnico%20con%20HojaCero." 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full py-5 bg-white text-black font-semibold rounded-xl hover:scale-[1.02] active:scale-95 transition-all text-lg flex items-center justify-center text-center"
                >
                  Agendar Llamada Vía WhatsApp
                </a>
                <p className="text-center text-xs text-gray-500 mt-4">Un arquitecto y un estratega revisarán tu escenario exacto. Sin costo hoy.</p>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
