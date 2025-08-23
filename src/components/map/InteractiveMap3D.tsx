
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface InteractiveMap3DProps {
  selectedCountry: string | null;
  onCountrySelect: (country: string | null) => void;
  category: string;
  period: string;
}

const InteractiveMap3D = ({ selectedCountry, onCountrySelect, category, period }: InteractiveMap3DProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const mapboxToken = 'pk.eyJ1IjoidGJnMTIiLCJhIjoiY21id3Q3a3J6MTUybjJscHQxYjAxMWF3MCJ9.9Ji2yCUoZJcIUrANJrfaVw';

  // Datos de países LATAM con coordenadas reales
  const countries = [
    { id: 'mexico', name: 'México', activity: 85, coordinates: [-102.5528, 23.6345], popup: true },
    { id: 'guatemala', name: 'Guatemala', activity: 45, coordinates: [-90.2308, 15.7835], popup: true },
    { id: 'colombia', name: 'Colombia', activity: 78, coordinates: [-74.2973, 4.5709], popup: true },
    { id: 'venezuela', name: 'Venezuela', activity: 92, coordinates: [-66.5897, 6.4238], popup: true },
    { id: 'brasil', name: 'Brasil', activity: 88, coordinates: [-51.9253, -14.2401], popup: true },
    { id: 'peru', name: 'Perú', activity: 72, coordinates: [-75.0152, -9.1900], popup: true },
    { id: 'bolivia', name: 'Bolivia', activity: 58, coordinates: [-63.5887, -16.2902], popup: true },
    { id: 'ecuador', name: 'Ecuador', activity: 65, coordinates: [-78.1834, -1.8312], popup: true },
    { id: 'chile', name: 'Chile', activity: 75, coordinates: [-71.5430, -35.6751], popup: true },
    { id: 'argentina', name: 'Argentina', activity: 82, coordinates: [-63.6167, -38.4161], popup: true },
    { id: 'uruguay', name: 'Uruguay', activity: 68, coordinates: [-55.7658, -32.5228], popup: true },
    { id: 'paraguay', name: 'Paraguay', activity: 52, coordinates: [-58.4438, -23.4425], popup: true },
  ];

  const getActivityColor = (activity: number) => {
    if (activity >= 80) return '#ef4444'; // red-500
    if (activity >= 60) return '#eab308'; // yellow-500
    return '#22c55e'; // green-500
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12', // Changed from satellite to outdoors view
      projection: 'globe' as any,
      zoom: 2.5,
      center: [-75, -15], // Centrado en LATAM
      pitch: 45,
      bearing: 0,
    });

    // Añadir controles de navegación en la esquina superior izquierda
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-left'
    );

    // Efectos atmosféricos
    map.current.on('style.load', () => {
      if (!map.current) return;

      map.current.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 200, 225)',
        'horizon-blend': 0.2,
        'space-color': 'rgb(11, 11, 25)',
        'star-intensity': 0.35,
      });

      // Añadir marcadores para cada país
      countries.forEach((country) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundColor = getActivityColor(country.activity);
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.borderRadius = '50%';
        el.style.border = '3px solid white';
        el.style.cursor = 'pointer';
        el.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        el.style.transition = 'all 0.3s ease';

        // Efectos hover
        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.3)';
          el.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4)';
        });

        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
          el.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        });

        // Crear popup
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
        }).setHTML(`
          <div class="p-3 min-w-[200px]">
            <h3 class="font-semibold text-lg mb-2">${country.name}</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Actividad:</span>
                <span class="font-medium" style="color: ${getActivityColor(country.activity)}">${country.activity}%</span>
              </div>
              <button 
                onclick="window.selectCountry('${country.id}')"
                class="w-full mt-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
              >
                Ver detalles
              </button>
            </div>
          </div>
        `);

        // Añadir marker con popup
        const marker = new mapboxgl.Marker(el)
          .setLngLat(country.coordinates as [number, number])
          .setPopup(popup)
          .addTo(map.current!);

        // Click handler
        el.addEventListener('click', () => {
          onCountrySelect(country.id === selectedCountry ? null : country.id);
          
          // Volar a la ubicación del país
          map.current?.flyTo({
            center: country.coordinates as [number, number],
            zoom: 5,
            pitch: 60,
            duration: 2000,
          });
        });
      });
    });

    // Funcionalidad global de selección de país
    (window as any).selectCountry = (countryId: string) => {
      onCountrySelect(countryId);
    };

    // Animación de rotación del globo
    let userInteracting = false;
    const spinEnabled = true;

    const spinGlobe = () => {
      if (!map.current || userInteracting) return;
      
      const zoom = map.current.getZoom();
      if (spinEnabled && zoom < 3) {
        const center = map.current.getCenter();
        center.lng -= 0.2;
        map.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    };

    // Event listeners
    map.current.on('mousedown', () => { userInteracting = true; });
    map.current.on('mouseup', () => { userInteracting = false; spinGlobe(); });
    map.current.on('moveend', spinGlobe);

    // Iniciar rotación
    spinGlobe();
  };

  useEffect(() => {
    if (!map.current) {
      initializeMap();
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Container del mapa */}
      <div 
        ref={mapContainer} 
        className="w-full h-[600px] bg-gradient-to-br from-blue-50 to-blue-100" 
      />
    </div>
  );
};

export default InteractiveMap3D;
