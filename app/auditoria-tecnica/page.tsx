"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Activity, Smartphone, Search, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";

type ScreenContext = 
  | "welcome"
  | "q1"
  | "q2"
  | "q3"
  | "capture"
  | "analyzing"
  | "result";

export default function AuditoriaTecnicaFunnel() {
  const [currentScreen, setCurrentScreen] = useState<ScreenContext>("welcome");
  const [answers, setAnswers] = useState({
    trafico: "",
    conversion: "",
    plataforma: "",
    email: "",
  });
  const [progress, setProgress] = useState(0);

  // Progreso superior (solo on quiz)
  useEffect(() => {
    let newProgress = 0;
    if (currentScreen === "q1") newProgress = 25;
    if (currentScreen === "q2") newProgress = 50;
    if (currentScreen === "q3") newProgress = 75;
    if (currentScreen === "capture" || currentScreen === "analyzing" || currentScreen === "result") newProgress = 100;
    setProgress(newProgress);
  }, [currentScreen]);

  const handleSelect = (question: string, value: string, nextScreen: ScreenContext) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
    setCurrentScreen(nextScreen);
  };

  const handleCaptureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answers.email) return;
    setCurrentScreen("analyzing");
    
    // Simular tiempo de procesamiento
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

  return (
    // Contenedor principal fixed y full screen para "pisar" cualquier Navbar o Footer.
    // Simula una experiencia nativa móvil inmersiva.
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] text-white overflow-hidden">
      
      {/* Barra de Progreso (solo visible en las preguntas) */}
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
          
          {/* PATALLA 1: GANCHO */}
          {currentScreen === "welcome" && (
            <motion.div 
              key="welcome"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center text-center space-y-8"
            >
              <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-10 h-10 text-indigo-500" />
              </div>
              <h1 className="text-3xl font-bold leading-tight">
                ¿Tu web está perdiendo clientes <span className="metallic-text break-words">y no sabes por qué?</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Haz esta auditoría técnica de 45 segundos y descubre tu "Fuga de Conversión".
              </p>
              <button 
                onClick={() => setCurrentScreen("q1")}
                className="w-full py-4 mt-8 bg-white text-black font-semibold rounded-2xl flex items-center justify-center space-x-2 active:scale-95 transition-transform"
              >
                <span>Comenzar Análisis</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* PREGUNTA 1 */}
          {currentScreen === "q1" && (
            <motion.div key="q1" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col space-y-6">
              <span className="text-indigo-400 font-semibold tracking-wide text-sm uppercase">Pregunta 1 de 3</span>
              <h2 className="text-2xl font-bold">¿Cuál es tu principal fuente de tráfico mensual?</h2>
              <div className="space-y-3 mt-4">
                {[
                  "Meta Ads (Facebook/Instagram)",
                  "SEO Orgánico (Google)",
                  "Boca a boca o Referidos",
                  "No invierto en tráfico"
                ].map((opt) => (
                  <button 
                    key={opt}
                    onClick={() => handleSelect("trafico", opt, "q2")}
                    className="w-full p-5 text-left border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-lg font-medium"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* PREGUNTA 2 */}
          {currentScreen === "q2" && (
            <motion.div key="q2" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col space-y-6">
              <span className="text-indigo-400 font-semibold tracking-wide text-sm uppercase">Pregunta 2 de 3</span>
              <h2 className="text-2xl font-bold">¿Cuál es la tasa de conversión actual de tu web?</h2>
              <div className="space-y-3 mt-4">
                {[
                  "Menos del 1%",
                  "Entre 1% y 3%",
                  "Más del 3%",
                  "No tengo idea, no lo mido"
                ].map((opt) => (
                  <button 
                    key={opt}
                    onClick={() => handleSelect("conversion", opt, "q3")}
                    className="w-full p-5 text-left border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-lg font-medium"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* PREGUNTA 3 */}
          {currentScreen === "q3" && (
            <motion.div key="q3" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col space-y-6">
              <span className="text-indigo-400 font-semibold tracking-wide text-sm uppercase">Pregunta 3 de 3</span>
              <h2 className="text-2xl font-bold">¿En qué plataforma o tecnología está construido tu sitio?</h2>
              <div className="space-y-3 mt-4">
                {[
                  "WordPress o WooCommerce",
                  "Shopify",
                  "Wix / Squarespace",
                  "Código a medida (React, Next.js)"
                ].map((opt) => (
                  <button 
                    key={opt}
                    onClick={() => handleSelect("plataforma", opt, "capture")}
                    className="w-full p-5 text-left border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-lg font-medium"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* CAPTURA (GATILLO) */}
          {currentScreen === "capture" && (
            <motion.div key="capture" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col space-y-6 text-center mt-10">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold">¡Diagnóstico Listo!</h2>
              <p className="text-gray-400 text-lg px-4">
                Hemos identificado el cuello de botella en tu embudo de ventas. 
              </p>
              
              <form onSubmit={handleCaptureSubmit} className="w-full mt-8 space-y-4">
                <div className="text-left">
                  <label className="text-sm text-gray-400 font-medium ml-2">Ingresa tu correo corporativo</label>
                  <input 
                    type="email" 
                    required
                    placeholder="tucorreo@empresa.com"
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
                <p className="text-xs text-gray-500 mt-4">Tus datos están seguros. Cero spam.</p>
              </form>
            </motion.div>
          )}

          {/* PANTALLA DE CARGA (EFECTO ANÁLISIS) */}
          {currentScreen === "analyzing" && (
            <motion.div key="analyzing" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center justify-center space-y-6 h-full text-center">
              <div className="relative w-24 h-24 mb-4">
                {/* Spinner exterior */}
                <motion.div 
                  className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"
                />
                <motion.div 
                  className="absolute inset-0 border-4 border-t-indigo-500 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Search className="w-8 h-8 text-indigo-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold animate-pulse">Analizando estructura...</h2>
              
              {/* Textos que cambian simulando procesos */}
              <motion.div 
                className="text-gray-400 h-6 overflow-hidden"
              >
                <motion.div
                  animate={{ y: [0, -24, -48, -72] }}
                  transition={{ duration: 3, times: [0, 0.3, 0.6, 1], ease: "linear" }}
                >
                  <p className="h-6">Revisando stack tecnológico...</p>
                  <p className="h-6">Calculando fugas de UI/UX...</p>
                  <p className="h-6">Inspeccionando tiempo de latencia...</p>
                  <p className="h-6">Generando reporte de conversión...</p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* PANTALLA DE RESULTADOS (LA OFERTA) */}
          {currentScreen === "result" && (
            <motion.div key="result" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col space-y-6">
              
              {/* Header card de resultado */}
              <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-3xl p-6 text-center mt-8">
               <Activity className="w-10 h-10 text-red-500 mx-auto mb-4" />
               <h2 className="text-xl text-gray-300 mb-2">Problema Crítico Detectado:</h2>
               <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                 Falta de Retención Móvil y Fricción de UX
               </h3>
               <p className="text-red-400/80 text-sm">Nivel de Urgencia: Alto</p>
              </div>

              <div className="space-y-4 px-2 py-4">
                <p className="text-gray-300 leading-relaxed text-lg">
                  Basado en tu uso de {answers.trafico} y tus niveles actuales, estás perdiendo al menos un <strong>40% de tus ventas potenciales</strong> justo en el paso de contacto.
                </p>
                <p className="text-gray-400">
                  La infraestructura de tu sitio actual ralentiza la decisión de compra, provocando rebotes invisibles.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-4">
                <h4 className="text-white font-semibold mb-4 flex items-center">
                  <Smartphone className="w-5 h-5 mr-2 text-indigo-400" /> 
                  El Plan de Solución H0
                </h4>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start text-sm text-gray-300"><CheckCircle2 className="w-5 h-5 text-indigo-400 mr-2 shrink-0"/> Rediseño "Mobile-First" Extremo</li>
                  <li className="flex items-start text-sm text-gray-300"><CheckCircle2 className="w-5 h-5 text-indigo-400 mr-2 shrink-0"/> Eliminación de Fricción (Carga Sub-1 Segundo)</li>
                  <li className="flex items-start text-sm text-gray-300"><CheckCircle2 className="w-5 h-5 text-indigo-400 mr-2 shrink-0"/> Embudos de Conversión Nativos</li>
                </ul>

                <button className="w-full py-5 bg-white text-black font-semibold rounded-xl active:scale-95 transition-all text-lg flex items-center justify-center">
                  Agendar Llamada Estratégica
                </button>
                <p className="text-center text-xs text-gray-500 mt-4">Agenda abierta para esta semana. Sin costo.</p>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
