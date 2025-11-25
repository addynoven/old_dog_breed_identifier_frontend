interface BreedInfoData {
  description: string;
  traits: string[];
  origin: string;
  height: string;
  weight: string;
  lifespan: string;
  coatType: string;
  activityLevel: string;
  rarity: string;
  goodWithKids: string;
}

interface InfoCardProps {
  prediction: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  breedInfo: any; // Can be string (old cache) or BreedInfoData (new)
  isLoading: boolean;
  isInfoLoading: boolean;
}

export default function InfoCard({ prediction, breedInfo, isLoading, isInfoLoading }: InfoCardProps) {
  // Helper to safely get data whether it's string or object
  const getData = (): BreedInfoData | null => {
    if (!breedInfo) return null;
    if (typeof breedInfo === 'string') {
      // Fallback for old cached data
      return {
        description: breedInfo,
        traits: [],
        origin: 'Unknown',
        height: '-',
        weight: '-',
        lifespan: '-',
        coatType: '-',
        activityLevel: '-',
        rarity: '-',
        goodWithKids: '-'
      };
    }
    return breedInfo as BreedInfoData;
  };

  const data = getData();

  return (
    <div className="relative z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full border border-white/40 dark:border-slate-700/40 transition-all duration-300 hover:shadow-indigo-500/10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center justify-center gap-2">
          <span>📋</span> Breed Information
        </h2>
        <p className="text-slate-600 dark:text-slate-400">Detailed insights about your dog</p>
      </div>
      
      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-600 dark:text-slate-400">
          <div className="relative mb-6 w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-indigo-900/30"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 dark:border-indigo-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-xl font-semibold text-slate-800 dark:text-slate-200">Analyzing your photo...</p>
          <p className="text-slate-500 dark:text-slate-400 mt-2">This uses advanced AI to identify the breed</p>
        </div>
      ) : !prediction ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center opacity-60">
          <div className="text-7xl mb-6 grayscale opacity-50">📸</div>
          <p className="text-slate-800 dark:text-slate-200 text-xl font-semibold mb-2">Ready to identify!</p>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">Upload a photo or search for a breed to see detailed information here.</p>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in flex-1">
          <div className="text-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl border border-indigo-100/50 dark:border-slate-700/50 shadow-inner">
            <div className="text-5xl mb-4 animate-bounce-slow">🐕</div>
            <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-2">{prediction}</h3>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 dark:bg-slate-700/60 border border-indigo-100 dark:border-slate-600 text-indigo-600 dark:text-indigo-300 text-sm font-medium">
              <span>✨</span> AI Confidence: High
            </div>
            
            {/* Traits Pills */}
            {data && data.traits.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {data.traits.map((trait, i) => (
                  <span key={i} className="px-3 py-1 bg-white/80 dark:bg-slate-700/80 border border-indigo-100 dark:border-slate-600 rounded-full text-sm font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm">
                    {trait}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {isInfoLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-3 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin"></div>
                <span className="text-slate-600 dark:text-slate-400 font-medium">Fetching breed details...</span>
              </div>
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* Description */}
              <div className="bg-white/60 dark:bg-slate-800/60 rounded-2xl p-6 border border-white/50 dark:border-slate-700/50 shadow-sm">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg font-light">{data.description}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatBox label="Origin" value={data.origin} />
                <StatBox label="Height" value={data.height} />
                <StatBox label="Weight" value={data.weight} />
                <StatBox label="Lifespan" value={data.lifespan} />
                <StatBox label="Coat" value={data.coatType} />
                <StatBox label="Activity" value={data.activityLevel} />
                <StatBox label="Rarity" value={data.rarity} />
                <StatBox label="Kids?" value={data.goodWithKids} />
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm leading-tight">{value}</p>
    </div>
  );
}
