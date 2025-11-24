'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainContent from '../components/MainContent';
import labels from '../../public/labels.json';
import { calculateFileHash, requestUploadUrl, uploadToTebi } from '../lib/upload';
import { getBreedInfo } from '../lib/breed-utils';
import { usePredictionStore } from '../lib/prediction-store';
import { getApiUrl } from '../utils/api';

function HomeContent() {
  const [prediction, setPrediction] = useState('');
  const [breedInfo, setBreedInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInfoLoading, setIsInfoLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedBreedImage, setSelectedBreedImage] = useState<string | null>(null);

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
    <div className="min-h-screen flex flex-col">
      <Header />
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
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div></div>}>
      <HomeContent />
    </Suspense>
  );
}
