'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import MultiSelect from '../../components/MultiSelect';
import labels from '../../../public/labels.json';
import locations from '../../../public/location.json';
import breedData from '../../../public/breed-data.json';

// Parse breeds from labels.json
interface Breed {
  name: string;
  id: string;
  country: string;
  size: string;
  coatType: string;
  activityLevel: string;
  rarity: string;
  goodWithKids: string;
  traits: string[];
}

const allBreeds: Breed[] = Object.values(labels).map((label: unknown) => {
  const labelStr = label as string;
  const parts = labelStr.split('-');
  if (parts.length < 2) return { 
    name: labelStr, 
    id: labelStr, 
    country: 'Unknown',
    size: 'Unknown',
    coatType: 'Unknown',
    activityLevel: 'Unknown',
    rarity: 'Unknown',
    goodWithKids: 'Unknown',
    traits: []
  };
  
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

  // Get additional data from breed-data.json
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (breedData as any)[labelStr];

  return { 
    name, 
    id: labelStr, 
    country,
    size: data?.size || 'Unknown',
    coatType: data?.coatType || 'Unknown',
    activityLevel: data?.activityLevel || 'Unknown',
    rarity: data?.rarity || 'Unknown',
    goodWithKids: data?.goodWithKids || 'Unknown',
    traits: data?.traits || []
  };
}).sort((a, b) => a.name.localeCompare(b.name));

// Get unique countries for filter
// Get unique values for filters
const countries = Array.from(new Set(allBreeds.map(b => b.country).filter(c => c !== 'Unknown'))).sort();
const sizes = ['Small', 'Medium', 'Large', 'Giant'];
const coatTypes = ['Short', 'Medium', 'Long', 'Double', 'Curly', 'Wire'];
const activityLevels = ['Low', 'Medium', 'High'];
const rarities = ['Common', 'Rare', 'Very Rare'];
const goodWithKidsOptions = ['Yes', 'No', 'Supervision Required'];
// Extract unique traits
const allTraits = Array.from(new Set(allBreeds.flatMap(b => b.traits))).sort();

export default function Breeds() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedCoats, setSelectedCoats] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [selectedKids, setSelectedKids] = useState<string[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);

  const filteredBreeds = useMemo(() => {
    return allBreeds.filter(breed => {
      const matchesSearch = breed.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(breed.country);
      const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(breed.size);
      const matchesCoat = selectedCoats.length === 0 || selectedCoats.includes(breed.coatType);
      const matchesActivity = selectedActivities.length === 0 || selectedActivities.includes(breed.activityLevel);
      const matchesRarity = selectedRarities.length === 0 || selectedRarities.includes(breed.rarity);
      const matchesKids = selectedKids.length === 0 || selectedKids.includes(breed.goodWithKids);
      // For traits, we use AND logic (must have all selected traits)
      const matchesTrait = selectedTraits.length === 0 || selectedTraits.every(t => breed.traits.includes(t));

      return matchesSearch && matchesCountry && matchesSize && matchesCoat && matchesActivity && matchesRarity && matchesKids && matchesTrait;
    });
  }, [searchTerm, selectedCountries, selectedSizes, selectedCoats, selectedActivities, selectedRarities, selectedKids, selectedTraits]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 pb-32 mt-20">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Dog Breeds</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-light">
            Discover over 120 breeds from around the world. Filter by country, traits, or search to find your favorite.
          </p>
        </div>

        {/* Filters */}
        {/* Filters */}
        <div className="max-w-7xl mx-auto mb-12 animate-fade-in-up animation-delay-200">
          {/* Search Bar */}
          <div className="relative mb-6">
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
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-800"
            />
          </div>

          {/* Filter Grid */}
          <div className="flex flex-wrap justify-center gap-4">
            <MultiSelect
              label="Countries"
              options={countries}
              value={selectedCountries}
              onChange={setSelectedCountries}
            />
            <MultiSelect
              label="Sizes"
              options={sizes}
              value={selectedSizes}
              onChange={setSelectedSizes}
            />
            <MultiSelect
              label="Coats"
              options={coatTypes}
              value={selectedCoats}
              onChange={setSelectedCoats}
            />
            <MultiSelect
              label="Activity"
              options={activityLevels}
              value={selectedActivities}
              onChange={setSelectedActivities}
            />
            <MultiSelect
              label="Rarity"
              options={rarities}
              value={selectedRarities}
              onChange={setSelectedRarities}
            />
            <MultiSelect
              label="Good with Kids"
              options={goodWithKidsOptions}
              value={selectedKids}
              onChange={setSelectedKids}
            />
            <MultiSelect
              label="Traits"
              options={allTraits}
              value={selectedTraits}
              onChange={setSelectedTraits}
            />
          </div>
        </div>

        {/* Grid */}
        {filteredBreeds.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-fade-in-up animation-delay-400">
            {filteredBreeds.map((breed) => (
              <Link 
                href={`/?breed=${encodeURIComponent(breed.name)}`}
                key={breed.id}
                className="group bg-white dark:bg-slate-800 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500/50 hover:-translate-y-1 flex flex-col"
              >
                <div className="aspect-square relative overflow-hidden bg-slate-100 dark:bg-slate-700">
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
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate" title={breed.name}>
                      {breed.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
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
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">No breeds found</h3>
            <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters</p>
            <button 
              onClick={() => {
                setSearchTerm(''); 
                setSelectedCountries([]);
                setSelectedSizes([]);
                setSelectedCoats([]);
                setSelectedActivities([]);
                setSelectedRarities([]);
                setSelectedKids([]);
                setSelectedTraits([]);
              }}
              className="mt-6 px-6 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
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
