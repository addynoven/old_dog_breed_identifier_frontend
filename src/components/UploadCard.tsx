'use client';

import ImageUpload from './ImageUpload';

interface UploadCardProps {
  setSelectedFile: (file: File | null) => void;
  onFileChange: (file: File) => void;
  imagePreview: string;
  handlePredict: () => void;
  isLoading: boolean;
  uploadProgress: number;
  error: string | null;
  selectedBreedImage?: string | null;
}

export default function UploadCard({ onFileChange, imagePreview, handlePredict, isLoading, uploadProgress, error, selectedBreedImage }: UploadCardProps) {
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  return (
    <div className="relative z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full border border-white/40 dark:border-slate-700/40 transition-all duration-300 hover:shadow-indigo-500/10">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Photo Source</h3>
        <p className="text-slate-600 dark:text-slate-400">Upload or select a breed to analyze</p>
      </div>
      
      

      <ImageUpload 
        onFileSelect={handleFileSelect} 
        imagePreview={imagePreview} 
        externalPreviewUrl={selectedBreedImage}
      />

      <button
        onClick={handlePredict}
        className={`w-full mt-8 mb-4 py-4 px-6 rounded-2xl font-bold text-lg text-white transition-all duration-300 transform shadow-lg ${
          !imagePreview && !selectedBreedImage || isLoading
            ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed shadow-none'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-[1.02] hover:shadow-indigo-500/30 active:scale-95'
        }`}
        disabled={(!imagePreview && !selectedBreedImage) || isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            {uploadProgress > 0 && uploadProgress < 100 ? 'Uploading...' : 'Analyzing...'}
          </div>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>🔍</span> Identify Breed
          </span>
        )}
      </button>
      
      {/* Upload Progress Bar */}
      {isLoading && uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1 font-medium">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      
      {error && (
        <div className={`mt-6 p-4 border rounded-2xl animate-fade-in flex items-start gap-3 ${
          error.includes('No dog detected') 
            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/50 text-blue-700 dark:text-blue-300' 
            : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/50 text-red-600 dark:text-red-300'
        }`}>
          <span className="text-xl">
            {error.includes('No dog detected') ? '🐕' : '⚠️'}
          </span>
          <div>
            <span className="font-medium pt-0.5 block">
              {error.includes('No dog detected') ? 'No Dog Detected' : 'Error'}
            </span>
            <span className={`text-sm ${error.includes('No dog detected') ? 'text-blue-600 dark:text-blue-400' : 'text-red-500 dark:text-red-400'}`}>
              {error.includes('No dog detected') 
                ? "We couldn't spot a dog in this picture. Please try uploading a clearer image of a dog."
                : error
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
