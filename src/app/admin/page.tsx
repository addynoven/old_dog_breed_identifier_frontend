'use client';

import { useState, useEffect } from 'react';
import labels from '../../../public/labels.json';
import breedData from '../../../public/breed-data.json';

// Helper to parse breed name from label
function parseBreedName(label: string): string {
  const parts = label.split('-');
  if (parts.length < 2) return label;
  return parts.slice(1).join('-').replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

interface BreedStatus {
  id: string;
  name: string;
  hasData: boolean;
  isGenerating: boolean;
  error?: string;
}

export default function AdminPage() {
  const [breeds, setBreeds] = useState<BreedStatus[]>([]);
  const [generatedCount, setGeneratedCount] = useState(0);

  useEffect(() => {
    // Initialize breed list
    const initialBreeds = Object.values(labels).map((label: string) => ({
      id: label,
      name: parseBreedName(label),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      hasData: !!(breedData as any)[label],
      isGenerating: false
    }));
    setBreeds(initialBreeds);
    setGeneratedCount(initialBreeds.filter(b => b.hasData).length);
  }, []);

  const generateData = async (breedId: string, breedName: string) => {
    setBreeds(prev => prev.map(b => b.id === breedId ? { ...b, isGenerating: true, error: undefined } : b));

    try {
      const response = await fetch('/api/breed-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ breedName })
      });

      if (!response.ok) throw new Error('API Failed');

      const result = await response.json();
      
      if (result.breedInfo) {
        // Save to local state and persist to file
        await saveToFile(breedId, result.breedInfo);
        
        setBreeds(prev => prev.map(b => b.id === breedId ? { ...b, isGenerating: false, hasData: true } : b));
        setGeneratedCount(prev => prev + 1);
      } else {
        throw new Error('No data returned');
      }
    } catch (err) {
      setBreeds(prev => prev.map(b => b.id === breedId ? { ...b, isGenerating: false, error: 'Failed' } : b));
      console.error(err);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saveToFile = async (breedId: string, data: any) => {
    try {
      await fetch('/api/admin/save-breed-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [breedId]: data })
      });
    } catch (e) {
      console.error('Failed to save to file', e);
    }
  };

  const generateAllMissing = async () => {
    const missing = breeds.filter(b => !b.hasData);
    for (const breed of missing) {
      await generateData(breed.id, breed.name);
      // Small delay to be nice to the API
      await new Promise(r => setTimeout(r, 1000));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Breed Data Admin</h1>
          <div className="flex gap-4 items-center">
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              {generatedCount} / {breeds.length} Generated
            </span>
            <button 
              onClick={generateAllMissing}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Generate All Missing
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 bg-slate-100 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300">
            <div className="col-span-6">Breed Name</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-3 text-right">Action</div>
          </div>
          
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {breeds.map(breed => (
              <div key={breed.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <div className="col-span-6 font-medium text-slate-800 dark:text-slate-200">
                  {breed.name}
                  <span className="block text-xs text-slate-400 dark:text-slate-500 font-normal">{breed.id}</span>
                </div>
                <div className="col-span-3">
                  {breed.isGenerating ? (
                    <span className="text-blue-600 dark:text-blue-400 flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </span>
                  ) : breed.hasData ? (
                    <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                      ✓ Has Data
                    </span>
                  ) : breed.error ? (
                    <span className="text-red-500 dark:text-red-400">❌ {breed.error}</span>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500">Missing</span>
                  )}
                </div>
                <div className="col-span-3 text-right">
                  {!breed.hasData && (
                    <button
                      onClick={() => generateData(breed.id, breed.name)}
                      disabled={breed.isGenerating}
                      className="text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-3 py-1 rounded hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors"
                    >
                      Generate
                    </button>
                  )}
                  {breed.hasData && (
                     <button
                      onClick={() => generateData(breed.id, breed.name)}
                      disabled={breed.isGenerating}
                      className="text-xs text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 underline"
                    >
                      Regenerate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
