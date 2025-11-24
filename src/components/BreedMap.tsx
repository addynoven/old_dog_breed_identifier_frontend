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
    <div className="w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/40 transition-all duration-300 hover:shadow-indigo-500/10 animate-fade-in">
      <div className="h-[500px] w-full relative z-0">
        <MapContainer 
          center={[location.lat, location.lng]} 
          zoom={4} 
          scrollWheelZoom={true}
          zoomControl={true}
          className="h-full w-full bg-slate-50"
        >
          {/* Simple light basemap */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          />
          
          <GeoJSON 
            key={location.origin} // Force re-render when origin changes
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
      </div>
      
      {/* Custom CSS for the tooltip label */}
      <style jsx global>{`
        .country-label {
          background: transparent;
          border: none;
          box-shadow: none;
          font-size: 16px;
          font-weight: bold;
          color: #312e81; /* Indigo-900 */
          text-shadow: 0 0 4px white;
        }
      `}</style>
    </div>
  );
}
