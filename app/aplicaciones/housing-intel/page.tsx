'use client';

import React, { useState } from 'react';
import { Search, MapPin, TrendingUp, Info, Home, Zap } from 'lucide-react';
import HousingMap from '@/components/housing-intel/HousingMap';

// Componentes de UI (Estilo HojaCero Premium)
const StatCard = ({ title, value, icon: Icon, description }: any) => (
  <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-blue-500/10 rounded-lg">
        <Icon className="w-5 h-5 text-blue-400" />
      </div>
    </div>
    <h3 className="text-zinc-400 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-white mt-1">{value}</p>
    {description && <p className="text-zinc-500 text-xs mt-2">{description}</p>}
  </div>
);

export default function HousingIntelligenceDashboard() {
  const [address, setAddress] = useState('');
  const [radius, setRadius] = useState(1000); // 1km por defecto para Buin/periferia
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isDeepScanning, setIsDeepScanning] = useState(false);
  const [detailCache, setDetailCache] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);

  const handlePropertyClick = async (property: any) => {
    // 1. Revisar caché primero
    if (detailCache[property.url]) {
        setSelectedProperty(detailCache[property.url]);
        return;
    }

    setSelectedProperty(property);
    setIsDeepScanning(true);

    try {
        const response = await fetch('/aplicaciones/housing-intel/api/detail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                url: property.url,
                lat: property.lat,
                lng: property.lng
            })
        });
        
        const result = await response.json();
        if (result.success && result.detail) {
            const enrichedProperty = {
                ...property,
                ...result.detail
            };
            setSelectedProperty(enrichedProperty);
            // 2. Guardar en caché
            setDetailCache(prev => ({
                ...prev,
                [property.url]: enrichedProperty
            }));
        }
    } catch (error) {
        console.error("Error en escaneo forense:", error);
    } finally {
        setIsDeepScanning(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch('/aplicaciones/housing-intel/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, radius_m: radius })
      });
      const result = await res.json();
      if (result.error) {
        setError(result.error);
      } else if (!result.market || result.market.length === 0) {
        setError(`Sin propiedades en un radio de ${radius >= 1000 ? radius/1000 + 'km' : radius + 'm'} para "${address}". Intenta ampliar el radio o revisa la dirección.`);
      } else {
        setData(result);
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Home className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Housing <span className="text-blue-500">Intelligence</span></h1>
        </div>
        <p className="text-zinc-400 max-w-2xl">
          Análisis predictivo de plusvalía y tasación residencial basada en inteligencia territorial comercial.
        </p>
      </div>

      {/* Main Search */}
      <div className="max-w-4xl mx-auto mb-16">
        <form onSubmit={(e) => handleSearch(e)} className="relative group flex flex-col md:block gap-3">
          <div className="relative w-full">
              <input
                type="text"
                placeholder="Ingrese dirección (Ej: Brasil 121, Santiago)..."
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl h-14 md:h-16 px-6 pl-12 md:pl-14 pr-4 md:pr-72 text-sm md:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors w-5 h-5 md:w-6 md:h-6" />
          </div>
          
          <div className="flex md:absolute right-2 top-1/2 md:-translate-y-1/2 items-center justify-between md:justify-end gap-2 w-full md:w-auto mt-3 md:mt-0">
            <select 
                value={radius} 
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="bg-zinc-800 border-none rounded-xl px-3 py-2.5 md:py-2 text-xs font-semibold text-zinc-300 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer flex-1 md:flex-none"
            >
                <option value={500}>R: 500m</option>
                <option value={1000}>R: 1km</option>
                <option value={2000}>R: 2km</option>
                <option value={5000}>R: 5km</option>
            </select>

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 relative overflow-hidden group flex-[2] md:flex-none"
            >
                {loading && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>}
                
                {loading ? (
                    <>
                        <Zap className="animate-pulse text-yellow-300 w-4 h-4 relative z-10" />
                        <span className="relative z-10 text-xs md:text-sm">Escaneando...</span>
                    </>
                ) : (
                    <>
                        <Search className="w-4 h-4" />
                        <span className="text-xs md:text-sm">Escaneo H0</span>
                    </>
                )}
            </button>
          </div>
        </form>
      </div>

      {data && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* COMPARATIVA FORENSE (Estilo Propiteq) */}
          <div className="lg:col-span-3 bg-gradient-to-r from-blue-900/20 to-zinc-900/50 border border-blue-500/30 rounded-3xl p-8 mb-4 backdrop-blur-md">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-2">
                    <h3 className="text-blue-400 text-xs font-black uppercase tracking-[0.2em]">Tasación Forense H0</h3>
                    <h2 className="text-4xl font-black text-white">
                        {data.analysis?.tasacion?.valor_sugerido_uf > 0 
                            ? `${data.analysis.tasacion.valor_sugerido_uf.toLocaleString()} ` 
                            : 'Pendiente '} 
                        <span className="text-blue-500">UF</span>
                    </h2>
                    <p className="text-zinc-500 text-sm">Valor estimado para esta propiedad basado en testigos y entorno.</p>
                </div>
                
                <div className="flex gap-4 items-center">
                    <div className="bg-zinc-800/80 p-4 rounded-2xl border border-zinc-700 min-w-[140px] text-center">
                        <p className="text-zinc-500 text-[9px] uppercase font-bold mb-1">Promedio Sector</p>
                        <p className="text-white font-bold">{data.stats?.avg_uf_m2 || 0} UF/m²</p>
                    </div>
                    <div className="w-8 h-[1px] bg-zinc-700 hidden md:block"></div>
                    <div className="bg-zinc-800/80 p-4 rounded-2xl border border-zinc-700 min-w-[140px] text-center">
                        <p className="text-zinc-500 text-[9px] uppercase font-bold mb-1">Rango Negoc.</p>
                        <p className="text-blue-400 font-bold">
                            {data.analysis?.tasacion?.rango_min_uf || 0} - {data.analysis?.tasacion?.rango_max_uf || 0}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="text-[10px] text-zinc-500 uppercase font-black mb-2">Atractivo</div>
                    <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase ${
                        data.analysis?.tasacion?.atractivo_negociacion === 'Alto' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                        data.analysis?.tasacion?.atractivo_negociacion === 'Medio' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 
                        data.analysis?.tasacion?.atractivo_negociacion === 'Bajo' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}>
                        {data.analysis?.tasacion?.atractivo_negociacion || 'Pendiente'}
                    </div>
                </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-zinc-800/50">
                <p className="text-zinc-400 text-xs italic leading-relaxed">
                    <span className="text-blue-400 font-bold not-italic">Nota Forense:</span> "{data.analysis?.tasacion?.justificacion_precio}"
                </p>
            </div>
          </div>

          {/* Main Metrics */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard title="UF/m² Promedio" value={`${data.stats?.avg_uf_m2 || 0} UF`} icon={TrendingUp} description={`Basado en ${data.stats?.sample_size || 0} testigos`} />
              <StatCard title="Disponibilidad Sector" value={`${data.market?.length || 0} Propiedades`} icon={Home} description="Ventas activas hoy" />
              <StatCard title="Nivel GSE" value={data.gse?.gse || 'C2'} icon={Info} description={data.gse?.descripcion || ''} />
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
                <span className="flex items-center gap-2">
                    <MapPin className="text-blue-500" /> Inteligencia de Entorno
                </span>
                <span className="flex items-center gap-2 text-[10px] bg-red-500/10 text-red-500 px-3 py-1 rounded-full border border-red-500/20 uppercase font-black tracking-widest animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div> Live Radar
                </span>
              </h2>
              
              {/* MAPA ESTÁTICO INFALIBLE (Estilo Territorial) */}
              <div className="w-full h-80 bg-zinc-800 rounded-3xl mb-6 overflow-hidden border border-zinc-700 relative group">
                {data.map_url ? (
                  <img 
                    src={data.map_url} 
                    alt="Mapa de Inteligencia de Entorno" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <HousingMap 
                    center={data.coordinates} 
                    zoom={15} 
                    markers={data.market.map((p: any) => ({
                      lat: p.lat,
                      lng: p.lng,
                      title: p.title,
                      price: p.price
                    }))}
                  />
                )}
                
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    H0 Satellite
                </div>
              </div>

              <p className="text-zinc-300 leading-relaxed mb-6">
                {data.analysis?.vibe_analysis}
              </p>
              <div className="flex flex-wrap gap-2">
                {(data.analysis?.plusvalia_indicators || []).map((tag: string, i: number) => (
                  <span key={i} className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Lista de Testigos / Detalle (EL CORAZÓN) */}
            <div className="bg-zinc-900/50 border border-blue-500/30 rounded-3xl p-8 overflow-hidden backdrop-blur-md relative min-h-[500px]">
                {!selectedProperty ? (
                  <>
                    <h2 className="text-2xl font-bold mb-2 relative z-10">Propiedades en el Sector</h2>
                    <p className="text-zinc-400 mb-8 text-sm relative z-10">Testigos encontrados en un radio de {radius}m.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                      {(data.market || []).length > 0 ? (
                          (data.market || []).map((p: any, i: number) => (
                          <div 
                              key={i} 
                              onClick={() => handlePropertyClick(p)}
                              className="flex flex-col p-5 bg-black/40 rounded-2xl border border-zinc-800/50 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group cursor-pointer"
                          >
                              <div className="flex justify-between items-start mb-4">
                                  <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                      <Home className="text-zinc-500 group-hover:text-blue-400" size={18} />
                                  </div>
                                  <div className="text-right">
                                      <p className="text-blue-400 font-bold">{p.price_uf ? p.price_uf.toLocaleString() : '---'} UF</p>
                                      <p className="text-zinc-600 text-[9px] uppercase font-bold tracking-tighter">${(p.price_uf * 37500).toLocaleString()}</p>
                                  </div>
                              </div>
                              <h4 className="font-semibold text-zinc-100 group-hover:text-white transition-colors text-sm line-clamp-1 mb-2">{p.title || 'Propiedad'}</h4>
                              <div className="flex items-center gap-3 text-zinc-500 text-[11px]">
                                  <span className="bg-zinc-800 px-2 py-0.5 rounded-md">{p.m2_total || 0} m²</span>
                                  <span>{p.bedrooms || 0}D {p.bathrooms || 0}B</span>
                                  <span className="text-zinc-600">H0 Intel</span>
                              </div>
                          </div>
                          ))
                      ) : (
                          <div className="col-span-full text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
                              <p className="text-zinc-500 italic">No se encontraron testigos directos en este radio.</p>
                          </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <button 
                        onClick={() => setSelectedProperty(null)}
                        className="text-blue-400 text-sm font-semibold mb-6 flex items-center gap-2 hover:text-blue-300 transition-colors"
                    >
                        ← Volver al listado
                    </button>
                    
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-1/2">
                            {/* VISTA SATELITAL H0 */}
                            <div className="aspect-video bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-700 shadow-2xl group relative">
                                {selectedProperty.static_map_url ? (
                                    <img 
                                        src={selectedProperty.static_map_url} 
                                        alt="Vista Satelital de la Propiedad" 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center">
                                        <MapPin className="text-blue-400 w-10 h-10 mb-3 opacity-50" />
                                        <p className="text-zinc-500 text-xs">Cargando vista satelital...</p>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    Vista Satelital H0
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 space-y-6">
                            {isDeepScanning ? (
                                <div className="space-y-6 animate-pulse">
                                    <div className="h-10 bg-zinc-800 rounded-lg w-3/4"></div>
                                    <div className="h-4 bg-zinc-800 rounded-lg w-1/2"></div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="h-16 bg-zinc-800 rounded-xl"></div>
                                        <div className="h-16 bg-zinc-800 rounded-xl"></div>
                                        <div className="h-16 bg-zinc-800 rounded-xl"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-zinc-800 rounded w-1/4"></div>
                                        <div className="h-20 bg-zinc-800 rounded-xl"></div>
                                    </div>
                                    <div className="p-4 border border-blue-500/30 bg-blue-500/5 rounded-2xl">
                                        <p className="text-blue-400 text-xs font-bold animate-bounce text-center">EJECUTANDO ANÁLISIS FORENSE...</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <h2 className="text-3xl font-black text-white mb-2">{selectedProperty.price_display || `${selectedProperty.price_uf.toLocaleString()} UF`}</h2>
                                        <p className="text-zinc-500 text-lg">${(selectedProperty.price_uf * 37500).toLocaleString()}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-zinc-800/50 p-4 rounded-xl text-center border border-zinc-700/50 text-ellipsis overflow-hidden">
                                            <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1">M² Total</p>
                                            <p className="text-white font-bold text-xs truncate">
                                                {selectedProperty.m2_display || selectedProperty.m2_total || selectedProperty.m2_built || '---'}
                                            </p>
                                        </div>
                                        <div className="bg-zinc-800/50 p-4 rounded-xl text-center border border-zinc-700/50">
                                            <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Dorm.</p>
                                            <p className="text-white font-bold text-xs">
                                                {selectedProperty.bedrooms_display || selectedProperty.bedrooms || '---'}
                                            </p>
                                        </div>
                                        <div className="bg-zinc-800/50 p-4 rounded-xl text-center border border-zinc-700/50">
                                            <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Baños</p>
                                            <p className="text-white font-bold text-xs">
                                                {selectedProperty.bathrooms_display || selectedProperty.bathrooms || '---'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <h4 className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Dirección/Título</h4>
                                            <p className="text-zinc-100">{selectedProperty.title}</p>
                                        </div>

                                        {selectedProperty.description && (
                                            <div className="space-y-2">
                                                <h4 className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Descripción del Activo</h4>
                                                <p className="text-zinc-300 text-xs leading-relaxed line-clamp-6">{selectedProperty.description}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Contacto del Anunciante */}
                                    {(selectedProperty.contact_phone || selectedProperty.contact_email || selectedProperty.contact_company) && (
                                        <div className="mt-6 p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl space-y-2">
                                            <h4 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-3">Contacto Anunciante</h4>
                                            {selectedProperty.contact_company && (
                                                <p className="text-zinc-200 text-sm font-semibold">{selectedProperty.contact_company}</p>
                                            )}
                                            {selectedProperty.contact_name && (
                                                <p className="text-zinc-400 text-xs">{selectedProperty.contact_name}</p>
                                            )}
                                            {selectedProperty.contact_phone && (
                                                <p className="text-blue-400 text-sm">📞 {selectedProperty.contact_phone}</p>
                                            )}
                                            {selectedProperty.contact_email && (
                                                <p className="text-zinc-400 text-xs">✉️ {selectedProperty.contact_email}</p>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex gap-3 mt-6">
                                        {selectedProperty.contact_whatsapp ? (
                                            <a 
                                                href={selectedProperty.contact_whatsapp} 
                                                target="_blank"
                                                className="flex-1 bg-green-600 hover:bg-green-500 text-white text-center py-3 rounded-2xl font-bold transition-all text-sm"
                                            >
                                                WhatsApp Directo
                                            </a>
                                        ) : null}
                                        <a 
                                            href={selectedProperty.url} 
                                            target="_blank"
                                            className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white text-center py-3 rounded-2xl font-bold transition-all text-sm"
                                        >
                                            Ver Detalle Completo
                                        </a>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Sidebar Intelligence */}
          <div className="space-y-8">
            <div className="p-8 rounded-3xl border bg-zinc-900/50 border-zinc-800 flex flex-col items-center">
                <h3 className="text-zinc-500 text-[10px] mb-4 uppercase tracking-[0.2em] font-bold">Resumen Score</h3>
                <div className="flex items-center gap-6 mb-8 w-full justify-around">
                    <div className="text-center">
                        <p className="text-4xl font-black text-white">{data.analysis?.housing_score || 0}</p>
                        <p className="text-[10px] text-zinc-500 uppercase">Habitabilidad</p>
                    </div>
                    <div className="w-[1px] h-10 bg-zinc-800"></div>
                    <div className="text-center">
                        <p className={`text-4xl font-black ${data.analysis?.investment_rating === 'A' ? 'text-green-400' : 'text-blue-400'}`}>
                            {data.analysis?.investment_rating || 'B'}
                        </p>
                        <p className="text-[10px] text-zinc-500 uppercase">Rating</p>
                    </div>
                </div>
                
                <div className="w-full bg-blue-600/5 border border-blue-500/10 rounded-2xl p-4 text-center">
                    <h4 className="text-[10px] font-bold text-blue-400 mb-2 uppercase">Análisis</h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed italic">
                        "{data.analysis?.market_justification}"
                    </p>
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold flex items-center gap-2 text-zinc-300 uppercase text-[10px] tracking-widest">Equipamiento Cercano</h3>
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded">
                    {data.environment?.anchors?.length || 0} TOTAL
                </span>
              </div>
              
              <div className="space-y-4">
                {(data.environment?.anchors || []).length > 0 ? (
                    (data.environment?.anchors || []).slice(0, 10).map((a: any, i: number) => (
                        <div key={i} className="group flex items-start gap-3 p-3 bg-zinc-800/20 border border-zinc-700/30 rounded-2xl hover:bg-zinc-800/40 transition-all">
                            <div className="p-2 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20">
                                <Zap className="w-3.5 h-3.5 text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-zinc-200 truncate">{a.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] text-zinc-500 uppercase font-black tracking-tighter bg-zinc-800 px-1.5 py-0.5 rounded">
                                        {a.category || 'Otros'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-xs text-zinc-600 italic text-center py-4">No se detectaron anclas comerciales relevantes.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
