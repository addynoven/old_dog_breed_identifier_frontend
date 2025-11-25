'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import locations from '../../public/location.json';

interface BreedMapProps {
  breedName: string;
}

interface LocationData {
  origin: string;
  lat: number;
  lng: number;
}

// Component to handle map view updates
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MapUpdater({ center, feature }: { center: [number, number], feature: any }) {
  const map = useMap();
  
  useEffect(() => {
    if (feature) {
      // Create a temporary GeoJSON layer to get bounds
      const layer = L.geoJSON(feature);
      const bounds = layer.getBounds();
      
      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 6, // Don't zoom in too close for small countries
          duration: 1.5
        });
      } else {
        // Fallback if bounds are invalid
        map.flyTo(center, 4, { duration: 1.5 });
      }
    } else {
      map.flyTo(center, 4, { duration: 1.5 });
    }
  }, [center, feature, map]);
  
  return null;
}

export default function BreedMap({ breedName }: BreedMapProps) {
  const [location, setLocation] = useState<LocationData | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [targetFeature, setTargetFeature] = useState<any>(null);

  useEffect(() => {
    // Fetch World GeoJSON
    fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
      .then(res => res.json())
      .then(data => setGeoJsonData(data))
      .catch(err => console.error('Error loading GeoJSON:', err));
  }, []);

  useEffect(() => {
    if (!breedName) return;

    // Normalize breed name logic (same as before)
    let searchName = breedName;
    if (breedName.includes('-')) {
        const parts = breedName.split('-');
        if (parts.length >= 2) {
             searchName = parts.slice(1).join('-').replace(/_/g, ' ');
             searchName = searchName.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let loc = (locations as any)[searchName];
    if (!loc) {
        const keys = Object.keys(locations);
        const match = keys.find(k => k.toLowerCase() === searchName.toLowerCase());
        if (match) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            loc = (locations as any)[match];
        }
    }

    if (loc) {
      setLocation(loc);
    } else {
        setLocation(null);
    }
  }, [breedName]);

  // Helper to normalize country names for matching
  const normalizeCountry = (name: string) => {
    const n = name.toLowerCase();
    if (n === 'united states' || n === 'usa') return 'united states of america';
    if (n === 'united kingdom' || n === 'uk' || n === 'scotland' || n === 'wales' || n === 'england') return 'united kingdom';
    return n;
  };

  useEffect(() => {
    if (location && geoJsonData) {
      const targetCountry = normalizeCountry(location.origin);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const feature = geoJsonData.features.find((f: any) => 
        normalizeCountry(f.properties.name) === targetCountry
      );
      setTargetFeature(feature);
    }
  }, [location, geoJsonData]);

  if (!location || !geoJsonData) return null;

  const targetCountry = normalizeCountry(location.origin);

  // Filter GeoJSON to only the target country (optional, or just style it)
  // We will style the target country differently
  const countryStyle = {
    fillColor: '#4f46e5', // Indigo-600
    weight: 2,
    opacity: 1,
    color: '#4338ca', // Indigo-700
    dashArray: '3',
    fillOpacity: 0.6
  };

  const defaultStyle = {
    fillColor: '#e2e8f0', // Slate-200
    weight: 1,
    opacity: 1,
    color: '#cbd5e1', // Slate-300
    fillOpacity: 0.3
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEachFeature = (feature: any, layer: any) => {
    const featureName = normalizeCountry(feature.properties.name);
    
    if (featureName === targetCountry) {
       layer.bindTooltip(location.origin, {
         permanent: true, 
         direction: 'center',
         className: 'country-label'
       });
    }
  };

  return (
    <div className="group w-full bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/50 transition-all duration-500 hover:shadow-indigo-500/20 hover:border-indigo-200/50 flex flex-col">
      {/* Premium Header Section */}
      <div className="relative p-8 border-b border-slate-100/50 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30">
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
          <span className="text-8xl">🌍</span>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-100/50 rounded-xl text-2xl animate-bounce-slow">
              📍
            </div>
            <h3 className="text-sm font-bold text-indigo-900/60 uppercase tracking-widest">
              Geographic Origin
            </h3>
          </div>
          
          {location ? (
            <div className="flex flex-col">
              <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 tracking-tight">
                {location.origin}
              </p>
              <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Native Region
              </p>
            </div>
          ) : (
            <p className="text-2xl font-bold text-slate-300">
              Unknown Origin
            </p>
          )}
        </div>
      </div>

      <div className="h-[450px] w-full relative z-0 bg-slate-50/50">
        <MapContainer 
          center={[location.lat, location.lng]} 
          zoom={4} 
          scrollWheelZoom={true}
          zoomControl={false} // We'll add a custom one or rely on scroll
          className="h-full w-full outline-none"
        >
          {/* Elegant light basemap */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          <GeoJSON 
            key={location.origin} 
            data={geoJsonData}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            style={(feature: any) => {
              const featureName = normalizeCountry(feature.properties.name);
              return featureName === targetCountry ? countryStyle : defaultStyle;
            }}
            onEachFeature={onEachFeature}
          />

          <MapUpdater center={[location.lat, location.lng]} feature={targetFeature} />
        </MapContainer>
        
        {/* Decorative Overlay Gradient */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/80 to-transparent pointer-events-none z-[400]"></div>
      </div>
      
      {/* Refined Tooltip CSS */}
      <style jsx global>{`
        .country-label {
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 12px;
          padding: 8px 16px;
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.1), 
            0 2px 4px -1px rgba(0, 0, 0, 0.06),
            0 0 0 4px rgba(99, 102, 241, 0.05);
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 800;
          color: #312e81;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          backdrop-filter: blur(4px);
          transition: all 0.3s ease;
        }
        .country-label:before {
          border-top-color: rgba(255, 255, 255, 0.98);
        }
        .leaflet-tooltip-pane { z-index: 650; }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-25%); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
      `}</style>
    </div>
  );
}
