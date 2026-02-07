'use client';

import { motion } from 'framer-motion';
import { MapPin, Info, Layers, Crosshair, Map as MapIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { SectionContainer } from './shared/SectionContainer';
import { ScrollReveal } from './shared/ScrollReveal';

interface Competitor {
    lat: number;
    lng: number;
    name: string;
    cuisine?: string[];
    address?: string;
}

interface MapExplorationSectionProps {
    lat: number;
    lng: number;
    competitors: Competitor[];
    address: string;
}

const CATEGORY_COLORS: Record<string, string> = {
    'sushi': '#ff7f50',
    'burger': '#ffb700',
    'chinese': '#cc0000',
    'pizza': '#228b22',
    'korean': '#9400d3',
    'peruvian': '#00ced1',
    'chicken': '#ff4500',
    'cafe': '#8b4513',
    'default': '#3b82f6'
};

const getCategoryFromText = (text: string): string => {
    const t = text.toLowerCase();
    if (t.includes('sushi') || t.includes('japon')) return 'sushi';
    if (t.includes('burger') || t.includes('hamburguesa')) return 'burger';
    if (t.includes('chino') || t.includes('chinese') || t.includes('china')) return 'chinese';
    if (t.includes('pizza')) return 'pizza';
    if (t.includes('corea') || t.includes('korean') || t.includes('kimchi')) return 'korean';
    if (t.includes('peru') || t.includes('ceviche')) return 'peruvian';
    if (t.includes('pollo') || t.includes('chicken')) return 'chicken';
    if (t.includes('café') || t.includes('coffee') || t.includes('pasteleria')) return 'cafe';
    return 'default';
};

export function MapExplorationSection({ lat, lng, competitors = [], address }: MapExplorationSectionProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<any>(null);
    const [mapboxLoaded, setMapboxLoaded] = useState(false);

    // LOGICA COPIADA DEL HERO (Paso 2)
    useEffect(() => {
        const loadMapbox = async () => {
            try {
                if (!mapContainer.current || !lat || !lng || map.current) return;

                const mapboxgl = await import('mapbox-gl');
                mapboxgl.default.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

                map.current = new mapboxgl.default.Map({
                    container: mapContainer.current,
                    style: 'mapbox://styles/mapbox/dark-v11',
                    center: [lng, lat],
                    zoom: 15.5,
                    pitch: 60,
                    bearing: -20,
                    antialias: true,
                });

                map.current.on('load', () => {
                    if (!map.current) return;

                    map.current.addLayer({
                        id: '3d-buildings',
                        source: 'composite',
                        'source-layer': 'building',
                        filter: ['==', 'extrude', 'true'],
                        type: 'fill-extrusion',
                        minzoom: 14,
                        paint: {
                            'fill-extrusion-color': '#334155',
                            'fill-extrusion-height': ['get', 'height'],
                            'fill-extrusion-base': ['get', 'min_height'],
                            'fill-extrusion-opacity': 0.5
                        },
                    });

                    const el = document.createElement('div');
                    el.className = 'custom-marker';
                    el.style.width = '40px';
                    el.style.height = '40px';
                    el.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiNlZjQ0NDQiIGZpbGwtb3BhY2l0eT0iMC4zIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEyIiBmaWxsPSIjZWY0NDQ0Ii8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjYiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=)';
                    el.style.backgroundSize = 'contain';

                    new mapboxgl.default.Marker(el)
                        .setLngLat([lng, lat])
                        .addTo(map.current!);

                    setMapboxLoaded(true);
                });
            } catch (error) {
                console.error('Error loading Mapbox in Exploration:', error);
            }
        };

        loadMapbox();

        return () => {
            map.current?.remove();
            map.current = null;
        };
    }, [lat, lng]);

    useEffect(() => {
        const addMarkers = async () => {
            if (!map.current || !mapboxLoaded || competitors.length === 0) return;

            const mapboxgl = (await import('mapbox-gl')).default;

            competitors.forEach(comp => {
                if (!comp.lat || !comp.lng) return;

                const category = getCategoryFromText(comp.name + ' ' + (comp.cuisine || []).join(' '));
                const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.default;

                const compEl = document.createElement('div');
                compEl.style.width = '12px';
                compEl.style.height = '12px';
                compEl.style.borderRadius = '50%';
                compEl.style.backgroundColor = color;
                compEl.style.border = '2px solid white';
                compEl.style.boxShadow = `0 0 8px ${color}`;

                try {
                    new mapboxgl.Marker(compEl)
                        .setLngLat([comp.lng, comp.lat])
                        .setPopup(new mapboxgl.Popup({ offset: 15 }).setHTML(`
                            <div style="color: black; padding: 5px;">
                                <p style="font-weight: bold; margin: 0; font-size: 14px;">${comp.name}</p>
                                <p style="color: #666; font-size: 11px; margin: 2px 0;">${category.toUpperCase()}</p>
                                ${comp.address ? `<p style="font-size: 10px; margin: 0;">${comp.address}</p>` : ''}
                            </div>
                        `))
                        .addTo(map.current!);
                } catch (e) {
                    console.error('Error adding reactive marker:', e);
                }
            });
        };

        addMarkers();
    }, [mapboxLoaded, competitors]);

    const foundCategories = Array.from(new Set(competitors.map(c => getCategoryFromText(c.name + ' ' + (c.cuisine || []).join(' ')))));
    if (foundCategories.length === 0) foundCategories.push('default');

    // ESTRUCTURA DEL HERO (Paso 2 y 3)
    return (
        <SectionContainer id="mapa-interactivo" className="bg-slate-950 py-0 overflow-hidden">
            <div className="relative h-[800px] w-full flex flex-col md:flex-row border-t border-white/5">

                {/* Lado Izquierdo: Leyendas (Reemplaza el texto del Hero - Paso 3) */}
                <div className="w-full md:w-1/2 relative z-10 flex flex-col items-start justify-center px-8 md:px-16 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-r border-white/5">
                    <ScrollReveal>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                            <MapIcon className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Exploración Territorial</span>
                        </div>

                        <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">
                            Visualizador <span className="text-blue-400">3D Real-Time</span>
                        </h2>

                        <p className="text-base text-zinc-400 mb-10 leading-relaxed max-w-md">
                            Navega el territorio para entender la capilaridad de la competencia y los polos de atracción comercial en tiempo real.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mb-12">
                            <div className="col-span-full">
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Nomenclatura de Mercado</p>
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_12px_#ef4444]" />
                                    <span className="text-sm font-bold text-white">Tu Ubicación (Punto Cero)</span>
                                </div>
                            </div>

                            {foundCategories.map(cat => (
                                <div key={cat} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                                    <div className="w-3 h-3 rounded-full" style={{
                                        backgroundColor: CATEGORY_COLORS[cat] || CATEGORY_COLORS.default,
                                        boxShadow: `0 0 10px ${CATEGORY_COLORS[cat] || CATEGORY_COLORS.default}`
                                    }} />
                                    <span className="text-sm text-zinc-300 capitalize">
                                        {cat === 'default' ? 'Otros Comercios' : cat}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="p-5 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-4 max-w-md">
                            <Info className="w-6 h-6 text-blue-400 shrink-0" />
                            <p className="text-xs text-zinc-400 italic leading-relaxed">
                                Interactúa con los pines para descubrir nombres comerciales y distancias exactas de la competencia.
                            </p>
                        </div>
                    </ScrollReveal>
                </div>

                {/* Lado Derecho: Mapa (Copia del Hero) */}
                <div className="w-full md:w-1/2 relative bg-slate-900">
                    <div ref={mapContainer} className="absolute inset-0 h-full w-full" />

                    {/* Control Badges */}
                    <div className="absolute top-8 right-8 flex flex-col gap-3 z-10">
                        <div className="px-5 py-2.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-blue-400" />
                            <span className="text-[10px] font-bold text-white tracking-wider uppercase">Filtro 3D Activo</span>
                        </div>
                        <div className="px-5 py-2.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                            <Crosshair className="w-4 h-4 text-cyan-400" />
                            <span className="text-[10px] font-bold text-white tracking-wider uppercase">GPS Precision High</span>
                        </div>
                    </div>

                    <style jsx global>{`
                        .mapboxgl-popup-content {
                            background: white !important;
                            border-radius: 12px !important;
                            padding: 12px !important;
                            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4) !important;
                            border: none !important;
                        }
                        .mapboxgl-popup-tip {
                            border-top-color: white !important;
                        }
                    `}</style>
                </div>
            </div>
        </SectionContainer>
    );
}
