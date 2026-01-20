"use client";

export default function Contacto() {
    return (
        <main className="pt-32 pb-24 bg-[#1A1A1A] text-[#FDF5E6]">
            <section className="px-6 md:px-24 mb-32 min-h-[80vh] flex items-center">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24">
                    <div>
                        <span className="text-xs uppercase tracking-[0.4em] text-[#D4AF37] mb-6 block">Contacto Directo</span>
                        <h1 className="text-6xl md:text-8xl font-serif leading-tight mb-8">Hablemos de <br />Arquitectura Líquida.</h1>

                        <div className="space-y-12 mt-16">
                            <div>
                                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] block mb-2">Ubicación</span>
                                <p className="text-xl font-light">Santa Bárbara, Región del Biobío, Chile.</p>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] block mb-2">Correo</span>
                                <p className="text-xl font-light">contacto@apimiel.cl</p>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] block mb-2">Redes Sociales</span>
                                <div className="flex space-x-6 mt-4">
                                    <a href="https://www.instagram.com/apimielchile/" className="text-sm uppercase tracking-widest hover:text-[#D4AF37] transition-colors">Instagram</a>
                                    <a href="https://web.facebook.com/apimielchile" className="text-sm uppercase tracking-widest hover:text-[#D4AF37] transition-colors">Facebook</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#2A2A2A] p-12 border border-[#D4AF37]/10 flex flex-col justify-center">
                        <h3 className="text-3xl font-serif mb-8 text-[#D4AF37]">Solicitar Cotización</h3>
                        <form className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest opacity-50">Nombre Completo</label>
                                <input type="text" className="w-full bg-transparent border-b border-[#FDF5E6]/20 py-2 focus:border-[#D4AF37] outline-none" placeholder="Juan Pérez" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest opacity-50">Email Corporativo</label>
                                <input type="email" className="w-full bg-transparent border-b border-[#FDF5E6]/20 py-2 focus:border-[#D4AF37] outline-none" placeholder="juan@empresa.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest opacity-50">Mensaje / Requerimiento</label>
                                <textarea className="w-full bg-transparent border-b border-[#FDF5E6]/20 py-2 focus:border-[#D4AF37] outline-none h-32 resize-none" placeholder="Interesado en exportación majoritaria..." />
                            </div>
                            <button className="w-full py-6 bg-[#D4AF37] text-[#1A1A1A] text-xs uppercase tracking-widest font-bold hover:scale-[0.98] transition-transform">
                                Enviar Consulta
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}
