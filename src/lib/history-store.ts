import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface HistoryItem {
  id: string;
  timestamp: number;
  breedName: string;
  confidence: number;
  image: string; // Base64 data URI
  stats: {
    accuracy: string;
    inferenceTime: string;
  };
}

interface HistoryState {
  history: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      history: [],
      
      addToHistory: (item) => {
        const newItem: HistoryItem = {
          ...item,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        };
        
        set((state) => ({
          history: [newItem, ...state.history] // Newest first
        }));
      },

      removeFromHistory: (id) => {
        set((state) => ({
          history: state.history.filter(item => item.id !== id)
        }));
      },

      clearHistory: () => {
        set({ history: [] });
      }
    }),
    {
      name: 'dog-breed-history-storage', // unique name
      storage: createJSONStorage(() => localStorage),
    }
  )
);
