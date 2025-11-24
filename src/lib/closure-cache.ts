// Closure-based cache for last 10 predictions
const createClosureCache = () => {
  const cache = new Map<string, { prediction: Record<string, unknown>; breedInfo: string; timestamp: number }>();
  const MAX_SIZE = 10;

  return {
    get: (hash: string) => cache.get(hash),
    
    set: (hash: string, prediction: Record<string, unknown>, breedInfo: string) => {
      // Remove oldest if at capacity
      if (cache.size >= MAX_SIZE) {
        const oldestKey = cache.keys().next().value;
        if (typeof oldestKey === 'string') {
          cache.delete(oldestKey);
        }
      }
      
      cache.set(hash, { 
        prediction, 
        breedInfo, 
        timestamp: Date.now() 
      });
    },

    has: (hash: string) => cache.has(hash),
    
    size: () => cache.size
  };
};

export const closureCache = createClosureCache();
