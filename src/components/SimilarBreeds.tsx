'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import labels from '../../public/labels.json';
import breedDataRaw from '../../public/breed-data.json';
import locationDataRaw from '../../public/location.json';

// Type definitions for the JSON data
interface BreedData {
  description: string;
  traits: string[];
  origin: string;
  height: string;
  weight: string;
  lifespan: string;
  size: string;
  coatType: string;
  activityLevel: string;
  rarity: string;
  goodWithKids: string;
}

interface LocationData {
  origin: string;
  lat: number;
  lng: number;
}

const breedData = breedDataRaw as Record<string, BreedData>;
const locationData = locationDataRaw as Record<string, LocationData>;

interface SimilarBreedsProps {
  currentBreed: string;
  onSelectBreed: (breed: string) => void;
}

interface BreedSuggestion {
  name: string;
  imagePath: string;
  id: string;
  score: number;
  matchReason: string;
}

export default function SimilarBreeds({ currentBreed, onSelectBreed }: SimilarBreedsProps) {
  const [similarBreeds, setSimilarBreeds] = useState<BreedSuggestion[]>([]);

  useEffect(() => {
    if (!currentBreed) return;

    // Helper to get ID from name (reverse lookup from labels)
    const getBreedId = (name: string) => {
      const entry = Object.entries(labels).find(([, label]) => {
        const parts = label.split('-');
        if (parts.length < 2) return false;
        const breedName = parts.slice(1).join('-').replace(/_/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        return breedName === name;
      });
      return entry ? entry[1] : null;
    };

    const currentId = getBreedId(currentBreed);
    if (!currentId) return;

    const currentInfo = breedData[currentId];
    const currentLocation = locationData[currentBreed]; // location.json uses breed names as keys

    if (!currentInfo) return;

    const allBreeds = Object.entries(labels).map(([, label]) => {
      const parts = label.split('-');
      const id = parts[0]; // e.g., n02099601
      // Reconstruct name from label
      const rawName = parts.slice(1).join('-');
      const name = rawName.replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      return { id, name, fullLabel: label };
    });

    // Calculate scores
    const scoredBreeds = allBreeds
      .filter(b => b.name !== currentBreed)
      .map(breed => {
        let score = 0;
        const reasons: string[] = [];
        const info = breedData[breed.fullLabel];
        const location = locationData[breed.name];

        if (!info) return { ...breed, score: -1, matchReason: '' };

        // 1. Name Similarity (Strongest signal)
        const currentKeywords = currentBreed.toLowerCase().split(' ').filter(w => w.length > 3);
        const breedKeywords = breed.name.toLowerCase().split(' ');
        if (currentKeywords.some(k => breedKeywords.includes(k))) {
          score += 10;
          reasons.push('Similar Name');
        }

        // 2. Origin Match
        if (currentLocation && location && currentLocation.origin === location.origin) {
          score += 5;
          reasons.push(`From ${location.origin}`);
        }

        // 3. Traits Overlap
        const sharedTraits = currentInfo.traits.filter(t => info.traits.includes(t));
        if (sharedTraits.length > 0) {
          score += sharedTraits.length * 2;
          reasons.push(`Shared traits: ${sharedTraits.slice(0, 2).join(', ')}`);
        }

        // 4. Size Match
        if (currentInfo.size === info.size) {
          score += 3;
          // Only add reason if not already crowded
          if (reasons.length < 2) reasons.push(`Same size (${info.size})`);
        }

        // 5. Coat Type Match
        if (currentInfo.coatType === info.coatType) {
          score += 2;
        }

        // 6. Good With Kids Match
        if (currentInfo.goodWithKids === info.goodWithKids) {
          score += 1;
        }

        return {
          ...breed,
          score,
          matchReason: reasons[0] || 'Similar characteristics'
        };
      });

    // Sort by score descending
    const topMatches = scoredBreeds
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(b => ({
        name: b.name,
        id: b.id,
        imagePath: `/breeds/${b.fullLabel}/1.jpg`,
        score: b.score,
        matchReason: b.matchReason
      }));

    setSimilarBreeds(topMatches);

  }, [currentBreed]);

  if (!currentBreed || similarBreeds.length === 0) return null;

  return (
    <div className="w-full mt-12 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
          Similar Breeds You Might Like
        </h3>
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {similarBreeds.map((breed) => (
          <button
            key={breed.name}
            onClick={() => onSelectBreed(breed.name)}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-left"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <Image
                src={breed.imagePath}
                alt={breed.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-xs font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  Match: {breed.matchReason}
                </div>
              </div>
              {/* Score Badge */}
              <div className="absolute top-2 right-2 bg-indigo-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {Math.min(99, Math.round(breed.score * 2))}% Match
              </div>
            </div>
            <div className="p-4">
              <span className="block text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                {breed.name}
              </span>
              <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                {breed.matchReason}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
