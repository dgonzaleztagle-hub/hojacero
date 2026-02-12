'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface AcargooMapProps {
    center?: [number, number];
    zoom?: number;
    markers?: { id: string; position: [number, number]; label: string }[];
}

export default function AcargooMap({
    center = [-33.4489, -70.6693], // Santiago, Chile
    zoom = 13,
    markers = []
}: AcargooMapProps) {

    // Definimos el icono dentro del componente para que solo se ejecute en el cliente
    const TruckIcon = L.divIcon({
        className: 'custom-truck-icon',
        html: `
            <div style="
                background-color: white; 
                border: 2px solid #ff9900; 
                border-radius: 12px; 
                width: 40px; 
                height: 40px; 
                display: flex; 
                align-items: center; 
                justify-content: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            ">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff9900" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });

    return (
        <div className="h-full w-full relative z-0">
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}
                className="z-0"
            >
                {/* Estilo de mapa limpio (CartoDB Positron) */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        position={marker.position}
                        icon={TruckIcon}
                    >
                        <Popup>
                            <div className="p-2 font-sans">
                                <p className="font-bold text-[#1e3a5f] uppercase text-[10px] tracking-widest mb-1">Unidad Online</p>
                                <p className="text-sm font-black italic">{marker.label}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
