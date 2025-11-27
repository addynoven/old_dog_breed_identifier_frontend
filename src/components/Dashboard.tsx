'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import MainContent from './MainContent';
import labels from '../../public/labels.json';
import { calculateFileHash, requestUploadUrl, uploadToTebi } from '../lib/upload';
import { getBreedInfo } from '../lib/breed-utils';
import { usePredictionStore } from '../lib/prediction-store';
import { getApiUrl, checkApiHealth } from '../utils/api';

import HistorySidebar from './HistorySidebar';
import { useCollectionStore } from '../lib/collection-store';
import { useHistoryStore } from '../lib/history-store';
import EmergencyButton from './EmergencyButton';

function DashboardContent() {
  const [prediction, setPrediction] = useState('');
  const [breedInfo, setBreedInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInfoLoading, setIsInfoLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedBreedImage, setSelectedBreedImage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { getPrediction, setPrediction: setCachedPrediction } = usePredictionStore();
  const searchParams = useSearchParams();

  const handleSearch = async (breedName: string) => {
    setPrediction(breedName);
    setBreedInfo('');
    setError(null);
    setIsInfoLoading(true);
    setSelectedFile(null); // Clear any uploaded file so the search image takes precedence
    
    // Find breed ID from labels.json
    const breedEntry = Object.entries(labels).find(([, label]) => {
      const parts = label.split('-');
      if (parts.length < 2) return false;
      const name = parts.slice(1).join('-').replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      return name === breedName;
    });

    if (breedEntry) {
      const breedId = breedEntry[1];
      const randomNum = Math.floor(Math.random() * 3) + 1;
      setSelectedBreedImage(`/breeds/${breedId}/${randomNum}.jpg`);
    }
    
    try {
      const info = await getBreedInfo(breedName);
      setBreedInfo(info);
    } catch (err) {
      console.error('Error fetching breed info:', err);
      setError('Could not retrieve information for this breed.');
    } finally {
      setIsInfoLoading(false);
    }
  };

  // Handle deep linking from breeds page
  useEffect(() => {
    const breedParam = searchParams.get('breed');
    if (breedParam) {
      handleSearch(breedParam);
    }
  }, [searchParams]);

  const handlePredict = async () => {
    // 1. Check API Health before doing anything
    const apiUrl = getApiUrl();
    if (!apiUrl) {
      window.location.href = '/config';
      return;
    }

    // We only check health if we are about to upload/predict
    if (selectedFile) {
      const isOnline = await checkApiHealth(apiUrl);
      if (!isOnline) {
        window.location.href = '/config';
        return;
      }
    }

    if (!selectedFile) {
      // If we already have a prediction (e.g. from search), just ignore the click
      if (prediction) return;
      
      setError('Please select an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrediction('');
    setBreedInfo('');
    setUploadProgress(0);

    try {
      const fileHash = await calculateFileHash(selectedFile);
      
      // Check Zustand cache first
      console.log('🎯 Checking Zustand cache for:', fileHash);
      const cachedPrediction = getPrediction(fileHash);
      if (cachedPrediction) {
        console.log('🎯 Zustand cache HIT for:', fileHash);
        setPrediction(cachedPrediction.breed_name);
        setBreedInfo(cachedPrediction.breed_info);
        setIsLoading(false);

        // Add to History even if cached (to fix sync issue)
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          useHistoryStore.getState().addToHistory({
            breedName: cachedPrediction.breed_name,
            confidence: 0.99, // Cached result implies high confidence or previous result
            image: base64String,
            stats: {
              accuracy: 'Cached',
              inferenceTime: '0ms'
            }
          });
        };
        reader.readAsDataURL(selectedFile);
        return;
      }
      console.log('❌ Zustand cache MISS, proceeding to server for:', fileHash);

      const uploadData = await requestUploadUrl(
        fileHash,
        selectedFile.name,
        selectedFile.type
      );

      if (!uploadData.exists) {
        await uploadToTebi(
          uploadData.uploadUrl,
          selectedFile,
          fileHash,
          setUploadProgress
        );
      } else {
        setUploadProgress(100);
      }
      
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-backend-url': getApiUrl() // Pass the current effective URL (custom or env) to the server
        },
        body: JSON.stringify({ fileHash })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Prediction failed');
      }

      const result = await response.json();
      setPrediction(result.breed_name);
      
      let breedInfoText = '';
      if (result.breed_info) {
        breedInfoText = result.breed_info;
        setBreedInfo(breedInfoText);
      } else {
        setIsInfoLoading(true);
        breedInfoText = await getBreedInfo(result.breed_name);
        setBreedInfo(breedInfoText);
      }

      // Cache in Zustand
      console.log('💾 Caching prediction in Zustand for:', fileHash);
      setCachedPrediction(fileHash, {
        label_number: result.label_number,
        breed_name: result.breed_name,
        breed_info: breedInfoText
      });

      // Add to collection
      const { addBreed } = useCollectionStore.getState();
      const isNew = addBreed(result.breed_name);
      if (isNew) {
        console.log('🎉 New breed unlocked:', result.breed_name);
      }

      // Add to History (Smart History)
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        useHistoryStore.getState().addToHistory({
          breedName: result.breed_name,
          confidence: result.confidence,
          image: base64String,
          stats: {
            accuracy: `${(result.confidence * 100).toFixed(1)}%`,
            inferenceTime: result.inference_time
          }
        });
      };
      reader.readAsDataURL(selectedFile);
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setIsInfoLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <HistorySidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onSelect={(breed) => {
          handleSearch(breed);
          // On mobile, close sidebar
          if (window.innerWidth < 768) setIsSidebarOpen(false);
        }}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:pl-80' : ''}`}>
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <MainContent
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          handlePredict={handlePredict}
          handleSearch={handleSearch}
          prediction={prediction}
          breedInfo={breedInfo}
          isLoading={isLoading}
          isInfoLoading={isInfoLoading}
          uploadProgress={uploadProgress}
          error={error}
          selectedBreedImage={selectedBreedImage}
        />
        <Footer />
      </div>
      
      <EmergencyButton />

    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div></div>}>
      <DashboardContent />
    </Suspense>
  );
}
