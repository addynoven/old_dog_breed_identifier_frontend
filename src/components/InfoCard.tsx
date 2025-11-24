interface InfoCardProps {
  prediction: string;
  breedInfo: string;
  isLoading: boolean;
  isInfoLoading: boolean;
}

export default function InfoCard({ prediction, breedInfo, isLoading, isInfoLoading }: InfoCardProps) {
  return (
    <div className="relative z-10 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full border border-white/40 transition-all duration-300 hover:shadow-indigo-500/10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-2">
          <span>📋</span> Breed Information
        </h2>
        <p className="text-slate-600">Detailed insights about your dog</p>
      </div>
      
      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-600">
          <div className="relative mb-6 w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-xl font-semibold text-slate-800">Analyzing your photo...</p>
          <p className="text-slate-500 mt-2">This uses advanced AI to identify the breed</p>
        </div>
      ) : !prediction ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center opacity-60">
          <div className="text-7xl mb-6 grayscale opacity-50">📸</div>
          <p className="text-slate-800 text-xl font-semibold mb-2">Ready to identify!</p>
          <p className="text-slate-500 max-w-xs mx-auto">Upload a photo or search for a breed to see detailed information here.</p>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in flex-1">
          <div className="text-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100/50 shadow-inner">
            <div className="text-5xl mb-4 animate-bounce-slow">🐕</div>
            <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">{prediction}</h3>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 border border-indigo-100 text-indigo-600 text-sm font-medium">
              <span>✨</span> AI Confidence: High
            </div>
          </div>
          
          {isInfoLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <span className="text-slate-600 font-medium">Fetching breed details...</span>
              </div>
            </div>
          ) : (
            <div className="bg-white/60 rounded-2xl p-6 border border-white/50 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg">
                <span>📝</span> About this breed
              </h4>
              <p className="text-slate-700 leading-relaxed text-lg font-light">{breedInfo}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
