import { useState } from 'react';
import UploadCard from './UploadCard';
import InfoCard from './InfoCard';
import BreedSearchBar from './BreedSearchBar';
import dynamic from 'next/dynamic';

const BreedMap = dynamic(() => import('./BreedMap'), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-white/50 backdrop-blur-sm rounded-3xl animate-pulse mt-8 border border-white/20"></div>
});

interface MainContentProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  handlePredict: () => void;
  handleSearch: (breed: string) => void;
  prediction: string;
  breedInfo: string;
  isLoading: boolean;
  isInfoLoading: boolean;
  uploadProgress: number;
  error: string | null;
  selectedBreedImage?: string | null;
}

export default function MainContent({
  selectedFile,
  setSelectedFile,
  handlePredict,
  handleSearch,
  prediction,
  breedInfo,
  isLoading,
  isInfoLoading,
  uploadProgress,
  error,
  selectedBreedImage,
}: MainContentProps) {
  const [imagePreview, setImagePreview] = useState<string>('');

  // Sync imagePreview with selectedFile prop
  // When selectedFile becomes null (e.g. from search), clear the preview
  if (!selectedFile && imagePreview) {
     setImagePreview('');
  }

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const hasContent = prediction || selectedBreedImage || selectedFile;

  return (
    <main className="flex-1 relative overflow-hidden bg-slate-50">
      {/* Animated Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-12 pb-32 relative z-10">
        {/* Hero Section */}
        <div className={`relative z-50 transition-all duration-700 ease-in-out flex flex-col items-center justify-center ${hasContent ? 'min-h-[40vh] py-12' : 'min-h-[80vh]'}`}>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-white/40 text-slate-600 text-sm font-medium shadow-sm">
              ✨ AI-Powered Dog Breed Identifier
            </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 mb-6 tracking-tight leading-tight">
              Discover Your <br/>
              <span className="text-indigo-600">Dog&apos;s Breed</span>
            </h1>
            <p className="text-slate-600 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-light">
              Upload a photo or search to instantly identify breeds and learn about their origins.
            </p>
          </div>
          
          <div className="w-full max-w-2xl mx-auto transform hover:scale-[1.02] transition-transform duration-300 relative z-50">
            <BreedSearchBar 
              onSelectBreed={handleSearch} 
              onImageSelect={handleFileChange}
              isLoading={isLoading || isInfoLoading} 
            />
          </div>
        </div>
        
        {/* Content Grid - Only visible when there is content */}
        <div className={`transition-all duration-700 ease-in-out ${hasContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none h-0 overflow-hidden'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            {/* Left Column: Image & Upload (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              <UploadCard
                setSelectedFile={setSelectedFile}
                onFileChange={handleFileChange}
                imagePreview={imagePreview}
                handlePredict={handlePredict}
                isLoading={isLoading}
                uploadProgress={uploadProgress}
                error={error}
                selectedBreedImage={selectedBreedImage}
              />
            </div>

            {/* Right Column: Info (7 cols) */}
            <div className="lg:col-span-7">
              <InfoCard
                prediction={prediction}
                breedInfo={breedInfo}
                isLoading={isLoading}
                isInfoLoading={isInfoLoading}
              />
            </div>
          </div>

          {/* Full Width Map Section */}
          {(prediction || selectedBreedImage) && !isLoading && (
            <div className="w-full">
              <BreedMap breedName={prediction} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
