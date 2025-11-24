'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import labels from '../../../public/labels.json';
import locations from '../../../public/location.json';

// Parse breeds from labels.json
const allBreeds = Object.values(labels).map((label: string) => {
  const parts = label.split('-');
  if (parts.length < 2) return { name: label, id: label, country: 'Unknown' };
  
  const name = parts.slice(1).join('-').replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
    
  // Get country from locations.json
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let country = (locations as any)[name]?.origin || 'Unknown';
  
  // Fallback search for country
  if (country === 'Unknown') {
     const keys = Object.keys(locations);
     const match = keys.find(k => k.toLowerCase() === name.toLowerCase());
     if (match) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        country = (locations as any)[match].origin;
     }
  }

  return { name, id: label, country };
}).sort((a, b) => a.name.localeCompare(b.name));

// Get unique countries for filter
const countries = Array.from(new Set(allBreeds.map(b => b.country))).sort();

export default function Breeds() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  const filteredBreeds = useMemo(() => {
    return allBreeds.filter(breed => {
      const matchesSearch = breed.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry = selectedCountry ? breed.country === selectedCountry : true;
      return matchesSearch && matchesCountry;
    });
  }, [searchTerm, selectedCountry]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 pb-32 mt-20">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Dog Breeds</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
            Discover over 120 breeds from around the world. Filter by country or search to find your favorite.
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-4xl mx-auto mb-12 space-y-4 md:space-y-0 md:flex gap-4 animate-fade-in-up animation-delay-200">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search breeds..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg text-slate-800 placeholder-slate-400 bg-white"
            />
          </div>
          <div className="relative md:w-1/3">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full pl-12 pr-8 py-4 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none bg-white text-lg cursor-pointer text-slate-800"
            >
              <option value="" className="text-slate-500">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country} className="text-slate-800">{country}</option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
        </div>

        {/* Grid */}
        {filteredBreeds.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-fade-in-up animation-delay-400">
            {filteredBreeds.map((breed) => (
              <Link 
                href={`/?breed=${encodeURIComponent(breed.name)}`}
                key={breed.id}
                className="group bg-white rounded-3xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden border border-slate-100 hover:border-indigo-200 hover:-translate-y-1 flex flex-col"
              >
                <div className="aspect-square relative overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={`/breeds/${breed.id}/1.jpg`}
                    alt={breed.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Dog';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="text-white font-medium text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300">View Details →</span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors truncate" title={breed.name}>
                      {breed.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 text-xs font-medium text-slate-500">
                      <span>📍</span>
                      <span className="truncate">{breed.country}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-6xl mb-4">🐕</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No breeds found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedCountry('');}}
              className="mt-6 px-6 py-2 bg-indigo-50 text-indigo-600 rounded-full font-medium hover:bg-indigo-100 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
