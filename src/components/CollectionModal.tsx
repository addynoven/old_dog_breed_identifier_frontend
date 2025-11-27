'use client';

import { useCollectionStore } from '../lib/collection-store';
import { FaTrophy, FaDog, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import labels from '../../public/labels.json';
import { motion, AnimatePresence } from 'framer-motion';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CollectionModal({ isOpen, onClose }: CollectionModalProps) {
  const { unlockedBreeds, getStats } = useCollectionStore();
  const { unique, total } = getStats();

  // Helper to get image path
  const getBreedImage = (breedName: string) => {
    const entry = Object.entries(labels).find(([, label]) => {
      const parts = label.split('-');
      if (parts.length < 2) return false;
      const name = parts.slice(1).join('-').replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      return name === breedName;
    });
    
    if (entry) {
      return `/breeds/${entry[1]}/1.jpg`;
    }
    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-800"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FaTrophy className="text-yellow-500" />
                  My Collection
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  You&apos;ve discovered {unique} out of {total} dog breeds!
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-100 dark:bg-slate-950/50">
              {unlockedBreeds.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 min-h-[300px]">
                  <FaDog className="text-6xl opacity-20" />
                  <p className="text-lg">No breeds discovered yet.</p>
                  <p className="text-sm">Identify a dog to start your collection!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {unlockedBreeds.map((breed) => {
                    const imgPath = getBreedImage(breed);
                    return (
                      <motion.div 
                        key={breed}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group relative aspect-square rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700"
                      >
                        {imgPath ? (
                          <Image
                            src={imgPath}
                            alt={breed}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800">
                            <FaDog className="text-2xl opacity-20" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                          <span className="text-white text-xs font-bold truncate w-full text-center">
                            {breed}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center text-xs text-slate-500">
              Keep exploring to unlock all 120 breeds!
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
