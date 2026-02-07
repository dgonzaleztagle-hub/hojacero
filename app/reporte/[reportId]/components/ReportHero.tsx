'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar, Building2, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';

interface ReportHeroProps {
    address: string;
    businessType: string;
    createdAt: string;
    mapUrl?: string;
    lat?: number;
    lng?: number;
    competitors?: any[];
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

export function ReportHero({ address, businessType, createdAt, mapUrl, lat, lng, competitors = [] }: ReportHeroProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<any>(null);
    const [mapboxLoaded, setMapboxLoaded] = useState(false);

    useEffect(() => {
        // Dynamic import to avoid SSR issues and module resolution problems
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

                // Add 3D buildings
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

                    // Add marker for business location
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
                console.error('Error loading Mapbox in Hero:', error);
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

            console.log('📍 Agregando markers reactivos:', competitors.length);
            const mapboxgl = (await import('mapbox-gl')).default;

            competitors.slice(0, 30).forEach(comp => {
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
                        .addTo(map.current!);
                } catch (e) {
                    console.error('Error adding reactive marker in Hero:', e);
                }
            });
        };

        addMarkers();
    }, [mapboxLoaded, competitors]);

    const formattedDate = new Date(createdAt).toLocaleDateString('es-CL', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    return (
        <section className="relative h-screen w-full overflow-hidden flex">
            {/* Left: Content */}
            <div className="w-1/2 relative z-10 flex flex-col items-start justify-center px-12 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
                {/* Animated title */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="max-w-2xl"
                >
                    <motion.h1
                        className="text-6xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                    >
                        REPORTE DE
                        <br />
                        INTELIGENCIA
                        <br />
                        TERRITORIAL
                    </motion.h1>

                    {/* Metadata cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col gap-4 mt-8"
                    >
                        <div className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                            <MapPin className="w-5 h-5 text-red-400" />
                            <span className="text-base text-white font-medium">{address}</span>
                        </div>

                        <div className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                            <Building2 className="w-5 h-5 text-blue-400" />
                            <span className="text-base text-white font-medium">{businessType}</span>
                        </div>

                        <div className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                            <Calendar className="w-5 h-5 text-green-400" />
                            <span className="text-base text-white font-medium">{formattedDate}</span>
                        </div>
                    </motion.div>

                    {/* Branding */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="mt-12"
                    >
                        <p className="text-3xl font-bold text-white">HOJACERO INTELLIGENCE</p>
                        <p className="text-lg text-cyan-300 italic mt-2">Datos que construyen negocios</p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Right: Interactive Map */}
            <div className="w-1/2 relative">
                <div ref={mapContainer} className="absolute inset-0 h-full w-full" />

                {/* Map overlay badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="absolute top-8 right-8 z-10 px-6 py-3 bg-black/60 backdrop-blur-md rounded-full border border-cyan-400/50"
                >
                    <p className="text-cyan-300 font-bold text-sm">VISTA 3D INTERACTIVA</p>
                </motion.div>
            </div>
        </section>
    );
}
