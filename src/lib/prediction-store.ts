import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PredictionData {
  label_number: number;
  breed_name: string;
  breed_info: string;
}

interface PredictionStore {
  predictions: Record<string, PredictionData>;
  getPrediction: (fileHash: string) => PredictionData | null;
  setPrediction: (fileHash: string, data: PredictionData) => void;
}

export const usePredictionStore = create<PredictionStore>()(
  persist(
    (set, get) => ({
      predictions: {},
      
      getPrediction: (fileHash: string) => {
        return get().predictions[fileHash] || null;
      },
      
      setPrediction: (fileHash: string, data: PredictionData) => {
        set((state) => ({
          predictions: {
            ...state.predictions,
            [fileHash]: data
          }
        }));
      }
    }),
    {
      name: 'prediction-cache'
    }
  )
);
