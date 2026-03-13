'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface HousingMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    lat: number;
    lng: number;
    title: string;
    price: string;
  }>;
}

// Token de Mapbox (Debería venir de .env)
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function HousingMap({ center, zoom = 14, markers = [] }: HousingMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11', // Estilo dark premium
      center: [center.lng, center.lat],
      zoom: zoom,
      attributionControl: false
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, []);

  // Actualizar centro cuando cambie
  useEffect(() => {
    if (map.current) {
      map.current.flyTo({
        center: [center.lng, center.lat],
        essential: true,
        zoom: zoom
      });
    }
  }, [center, zoom]);

  // Actualizar marcadores
  useEffect(() => {
    if (!map.current) return;

    // Limpiar marcadores anteriores (idealmente llevar registro de ellos)
    const currentMarkers = document.querySelectorAll('.mapboxgl-marker');
    currentMarkers.forEach(m => m.remove());

    markers.forEach(property => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.innerHTML = `
        <div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);"></div>
      `;

      new mapboxgl.Marker(el)
        .setLngLat([property.lng, property.lat])
        .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<div style="color: black; font-family: sans-serif; padding: 5px;">
                      <h4 style="margin: 0; font-size: 12px;">${property.title}</h4>
                      <p style="margin: 5px 0 0; font-weight: bold; color: #3b82f6;">${property.price}</p>
                    </div>`))
        .addTo(map.current!);
    });
  }, [markers]);

  return (
    <div className="w-full h-full relative overflow-hidden rounded-3xl border border-zinc-700">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
}
