"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowRight, CheckCircle2, CheckSquare } from "lucide-react";

type BranchType = "web" | "noweb" | "app" | null;

type ScreenContext = 
  | "welcome"
  | "q1"
  | "q2_web" | "q3_web"
  | "q2_noweb" | "q3_noweb"
  | "q2_app" | "q3_app"
  | "capture"      // La nueva vista Concierge (Formulario real)
  | "submitting"   // Cargando data a la API
  | "success";     // Pantalla final

export default function AuditoriaTecnicaFunnel() {
  const [currentScreen, setCurrentScreen] = useState<ScreenContext>("welcome");
  const [branch, setBranch] = useState<BranchType>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // Datos del contacto real
  const [leadData, setLeadData] = useState({
    nombre: "",
    email: "",
    whatsapp: "",
    presupuesto: ""
  });

  const [progress, setProgress] = useState(0);

  // Calcular progreso visual
  useEffect(() => {
    let newProgress = 0;
    if (currentScreen === "q1") newProgress = 25;
    if (currentScreen.includes("q2")) newProgress = 50;
    if (currentScreen.includes("q3")) newProgress = 75;
    if (["capture", "submitting", "success"].includes(currentScreen)) newProgress = 100;
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

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadData.email || !leadData.nombre || !leadData.whatsapp || !leadData.presupuesto) {
      alert("Por favor completa los campos principales para poder contactarte.");
      return;
    }

    setCurrentScreen("submitting");
    
    try {
      // Mandarlo a la API de Supabase / Resend que acabas de ver en el paso anterior.
      const res = await fetch("/api/auditoria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...leadData,
          rama: branch,
          respuestas: answers
        })
      });

      if (!res.ok) throw new Error("Fallo en el servidor");
      setCurrentScreen("success");
      
    } catch (err) {
      console.error(err);
      alert("Uh, tuvimos un problema guardando tu solicitud. Por favor intenta otra vez.");
      setCurrentScreen("capture");
    }
  };

  // Variantes de animación
  const screenVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  };

  // Opciones de Presupuesto dependiendo de la rama
  const getBudgetOptions = () => {
    if (branch === "app") {
      return [
        "Inversión inicial (Hasta $350.000)",
        "Proyecto Escala Media ($350.000 - $500.000)",
        "Desarrollo Corporativo (Sobre $1.000.000)",
        "Necesito que ustedes levanten el presupuesto"
      ];
    }
    return [
      "Inversión inicial básica (~$50.000)",
      "Presupuesto estándar (Desde $150.000)",
      "Proyecto Corporativo/A medida",
      "Necesito que ustedes levanten el presupuesto"
    ];
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] text-white overflow-hidden py-10">
      
      {/* Barra de Progreso */}
      <AnimatePresence>
        {progress > 0 && currentScreen !== "success" && (
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

      <div className="w-full max-w-md p-6 relative h-full flex flex-col justify-center overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          
          {/* PATALLA 1: GANCHO GENERAL */}
          {currentScreen === "welcome" && (
            <motion.div key="welcome" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center text-center space-y-8 my-auto">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
                <CheckSquare className="w-10 h-10 text-indigo-500" />
              </div>
              <h1 className="text-3xl font-bold leading-tight">
                Auditoría Técnica y Comercial <span className="metallic-text break-words">HojaCero</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Cuéntanos el estado de tu negocio y diseñaremos la arquitectura exacta que necesitas para escalar.
              </p>
              <button 
                onClick={() => setCurrentScreen("q1")}
                className="w-full py-4 mt-8 bg-white text-black font-semibold rounded-2xl flex items-center justify-center space-x-2 active:scale-95 transition-transform"
              >
                <span>Comenzar ahora</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* PREGUNTA 1: FILTRO MAESTRO */}
          {currentScreen === "q1" && (
            <motion.div key="q1" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col space-y-6 my-auto">
              <span className="text-indigo-400 font-semibold tracking-wide text-sm uppercase">Paso 1 de 3</span>
              <h2 className="text-2xl font-bold leading-tight">¿En qué etapa de digitalización se encuentra tu negocio?</h2>
              <div className="space-y-3 mt-4">
                <button onClick={() => handleSelectRoot("Tengo Web", "web")} className="w-full p-5 text-left border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-lg font-medium flex items-center">
                  <span className="text-2xl mr-3">🌐</span> Ya tengo una web (quiero mejorar)
                </button>
                <button onClick={() => handleSelectRoot("Sin Web", "noweb")} className="w-full p-5 text-left border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-lg font-medium flex items-center">
                  <span className="text-2xl mr-3">📱</span> No tengo web (vendo por redes/chat)
                </button>
                <button onClick={() => handleSelectRoot("App", "app")} className="w-full p-5 text-left border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-lg font-medium flex items-center">
                  <span className="text-2xl mr-3">💻</span> Necesito una App a medida (SaaS/Interno)
                </button>
              </div>
            </motion.div>
          )}

          {/* ======================= RAMA: CON WEB ======================= */}
          {currentScreen === "q2_web" && (
            <motion.div key="q2_web" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col space-y-6 my-auto">
              <span className="text-indigo-400 font-semibold tracking-wide text-sm uppercase">Paso 2 de 3</span>
              <h2 className="text-2xl font-bold leading-tight">¿Cuál es tu principal fuente de visitantes al mes?</h2>
              <div className="space-y-3 mt-4">
                {["Meta Ads (Instagram/Facebook)", "SEO (Google/Orgánico)", "Boca a boca o referidos", "No invierto en tráfico todavía"].map((opt) => (
                  <button key={opt} onClick={() => handleSelect("trafico", opt, "q3_web")} className="w-full p-5 text-left border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-lg font-medium">
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {currentScreen === "q3_web" && (
            <motion.div key="q3_web" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col space-y-6 my-auto">
              <span className="text-indigo-400 font-semibold tracking-wide text-sm uppercase">Paso 3 de 3</span>
              <h2 className="text-2xl font-bold leading-tight">¿Sientes que tu web convierte las visitas en clientes como debería?</h2>
              <div className="space-y-3 mt-4">
                {["No, entran pero no compran ni hablan", "A medias, funciona pero podría mejorar mucho", "Convierte bien, pero quiero rediseño premium", "La verdad ni siquiera mido las conversiones"].map((opt) => (
                  <button key={opt} onClick={() => handleSelect("conversion_web", opt, "capture")} className="w-full p-5 text-left border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-lg font-medium">
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ======================= RAMA: SIN WEB ======================= */}
          {currentScreen === "q2_noweb" && (
            <motion.div key="q2_noweb" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col space-y-6 my-auto">
              <span className="text-indigo-400 font-semibold tracking-wide text-sm uppercase">Paso 2 de 3</span>
              <h2 className="text-2xl font-bold leading-tight">¿Cuál es tu canal principal para conseguir clientes hoy?</h2>
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
            <motion.div key="q3_noweb" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col space-y-6 my-auto">
              <span className="text-indigo-400 font-semibold tracking-wide text-sm uppercase">Paso 3 de 3</span>
              <h2 className="text-2xl font-bold leading-tight">¿Qué es lo que principalmente vendes?</h2>
              <div className="space-y-3 mt-4">
                {["Servicios o Agenda de citas (Dentistas, Agencias)", "Productos Físicos (Retail, Tienda online)", "Gastronomía (Delivery / Restaurante)", "Quiero vender Cursos Comerciales (Infoproductos)"].map((opt) => (
                  <button key={opt} onClick={() => handleSelect("modelo", opt, "capture")} className="w-full p-5 text-left border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-lg font-medium">
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ======================= RAMA: APP / SOFTWARE ================= */}
          {currentScreen === "q2_app" && (
            <motion.div key="q2_app" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col space-y-6 my-auto">
              <span className="text-indigo-400 font-semibold tracking-wide text-sm uppercase">Paso 2 de 3</span>
              <h2 className="text-2xl font-bold leading-tight">¿Cuál es el propósito inicial de este Software?</h2>
              <div className="space-y-3 mt-4">
                {["Uso interno para automatizar procesos de mi empresa", "Modelo B2C para fidelizar a mis clientes", "Crear una App Comercial/Startup desde cero", "Aún lo estoy definiendo"].map((opt) => (
                  <button key={opt} onClick={() => handleSelect("motivo", opt, "q3_app")} className="w-full p-5 text-left border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-lg font-medium">
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {currentScreen === "q3_app" && (
            <motion.div key="q3_app" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col space-y-6 my-auto">
              <span className="text-indigo-400 font-semibold tracking-wide text-sm uppercase">Paso 3 de 3</span>
              <h2 className="text-2xl font-bold leading-tight">¿Qué nivel de claridad técnica tienes respecto al proyecto?</h2>
              <div className="space-y-3 mt-4">
                {["Tengo diseño y funciones exactas listas para programar", "Tengo la idea clara, pero no cómo se debe construir a nivel web", "Solo tengo un problema de negocio y necesito la arquitectura completa"].map((opt) => (
                  <button key={opt} onClick={() => handleSelect("requisitos", opt, "capture")} className="w-full p-5 text-left border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-lg font-medium">
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ======================= PANTALLA: EL FORMULARIO (CAPTURADOR CONCIERGE) ================= */}
          {currentScreen === "capture" && (
            <motion.div key="capture" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col space-y-6 pt-10 pb-20">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-3">¡Contexto Recolectado!</h2>
                <p className="text-gray-400 text-[15px] px-2 leading-relaxed">
                  Como en HojaCero nos tomamos las cosas en serio, un Arquitecto de nuestro equipo analizará tu caso particular minuciosamente y te contactaremos a la brevedad con la ruta exacta.
                </p>
              </div>
              
              <form onSubmit={submitLead} className="w-full space-y-4">
                <div className="text-left space-y-2">
                  <label className="text-sm text-gray-400 font-medium ml-2">¿Cómo te llamas? (Tú o tu empresa)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ej. Juan Pérez / Stark Industries"
                    value={leadData.nombre}
                    onChange={(e) => setLeadData(prev => ({...prev, nombre: e.target.value}))}
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-indigo-500 transition-colors text-base"
                  />
                </div>

                <div className="text-left space-y-2">
                  <label className="text-sm text-gray-400 font-medium ml-2">Tu Correo principal</label>
                  <input 
                    type="email" 
                    required
                    placeholder="correo@empresa.com"
                    value={leadData.email}
                    onChange={(e) => setLeadData(prev => ({...prev, email: e.target.value}))}
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-indigo-500 transition-colors text-base"
                  />
                </div>

                <div className="text-left space-y-2">
                  <label className="text-sm text-gray-400 font-medium ml-2">Tu WhatsApp (Te avisaremos por ahí)</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="+56 9 8765 4321"
                    value={leadData.whatsapp}
                    onChange={(e) => setLeadData(prev => ({...prev, whatsapp: e.target.value}))}
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-indigo-500 transition-colors text-base"
                  />
                </div>

                <div className="text-left space-y-2 pt-2">
                  <label className="text-sm text-gray-400 font-medium ml-2 text-indigo-300">¿Qué presupuesto tienes contemplado para tu digitalización?</label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {getBudgetOptions().map(opt => (
                      <label key={opt} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${leadData.presupuesto === opt ? 'bg-indigo-500/20 border-indigo-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                        <input 
                          type="radio" 
                          name="presupuesto" 
                          value={opt} 
                          checked={leadData.presupuesto === opt}
                          onChange={(e) => setLeadData(prev => ({...prev, presupuesto: e.target.value}))}
                          className="mr-3 w-4 h-4 accent-indigo-500"
                        />
                        <span className="text-sm text-gray-200">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={!leadData.presupuesto}
                  className="w-full py-5 mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] active:scale-95 disabled:opacity-50 disabled:grayscale transition-all text-lg flex justify-center items-center space-x-2"
                >
                  <span>Enviar datos a los Arquitectos</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          )}

          {/* PANTALLA: CARGANDO */}
          {currentScreen === "submitting" && (
            <motion.div key="submitting" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center justify-center space-y-6 h-full text-center">
               <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
               <h2 className="text-xl font-bold">Resguardando información...</h2>
            </motion.div>
          )}

          {/* PANTALLA FIN: ÉXITO */}
          {currentScreen === "success" && (
            <motion.div key="success" variants={screenVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center justify-center space-y-6 text-center my-auto">
              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold">¡Todo Listo!</h2>
              <p className="text-gray-300 text-lg leading-relaxed max-w-sm">
                Tus respuestas ya están en conocimiento de nuestro equipo. 
                <br/><br/>
                Te hablaremos a tu WhatsApp <strong>({leadData.whatsapp})</strong> dentro de las próximas 24 horas para darte tus opciones.
              </p>

              <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 mt-8">
                <p className="text-sm text-gray-400 mb-4">¿Estás apurado o con una urgencia de negocio?</p>
                <a 
                  href={`https://wa.me/56912345678?text=Hola,%20acabo%20de%20dejar%20mis%20datos%20en%20el%20Quiz%20(Soy%20${leadData.nombre || 'un prospecto'}).%20Quería%20acelerar%20mi%20diagnóstico.`}
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center"
                >
                  Háblanos por WhatsApp ahora
                </a>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
