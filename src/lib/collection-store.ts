import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CollectionState {
  unlockedBreeds: string[]; // List of breed names
  addBreed: (breedName: string) => boolean;
  hasBreed: (breedName: string) => boolean;
  getStats: () => { total: number; unique: number };
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      unlockedBreeds: [],
      
      addBreed: (breedName) => {
        const { unlockedBreeds } = get();
        if (!unlockedBreeds.includes(breedName)) {
          set({ unlockedBreeds: [...unlockedBreeds, breedName] });
          return true; // New breed added
        }
        return false; // Already exists
      },

      hasBreed: (breedName) => {
        return get().unlockedBreeds.includes(breedName);
      },

      getStats: () => {
        return {
          total: 120, // Hardcoded total for now
          unique: get().unlockedBreeds.length
        };
      }
    }),
    {
      name: 'dog-breed-collection', // unique name for localStorage key
    }
  )
);
