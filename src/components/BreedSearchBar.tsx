'use client';

import { useState, useEffect, useRef } from 'react';
import labels from '../../public/labels.json';

interface BreedSearchBarProps {
  onSelectBreed: (breed: string) => void;
  onImageSelect?: (file: File) => void;
  isLoading?: boolean;
}

// Parse breeds from labels.json
const breeds = Object.values(labels).map((label: string) => {
  const parts = label.split('-');
  if (parts.length < 2) return { name: label, id: label };
  const name = parts.slice(1).join('-').replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  return { name, id: label };
});

interface Breed {
  name: string;
  id: string;
}

import ImageSearchModal from './CameraModal';

// ... (existing imports)

export default function BreedSearchBar({ onSelectBreed, onImageSelect, isLoading }: BreedSearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Breed[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [showImageSearch, setShowImageSearch] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);

  // Typewriter effect for placeholder (uses local counters to avoid stale state deps)
  useEffect(() => {
    const examples = ['Golden Retriever', 'Poodle', 'German Shepherd', 'Husky', 'Beagle', 'or upload an image...'];
    let currentExampleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const type = () => {
      const currentExample = examples[currentExampleIndex];

      if (isDeleting) {
        currentCharIndex = Math.max(0, currentCharIndex - 1);
        setPlaceholder(currentExample.slice(0, currentCharIndex));

        if (currentCharIndex === 0) {
          isDeleting = false;
          currentExampleIndex = (currentExampleIndex + 1) % examples.length;
          timeoutId = setTimeout(type, 500);
          return;
        }
      } else {
        currentCharIndex = Math.min(currentExample.length, currentCharIndex + 1);
        setPlaceholder(currentExample.slice(0, currentCharIndex));

        if (currentCharIndex === currentExample.length) {
          isDeleting = true;
          timeoutId = setTimeout(type, 2000); // Pause before deleting
          return;
        }
      }

      timeoutId = setTimeout(type, isDeleting ? 50 : 100);
    };

    timeoutId = setTimeout(type, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  // Handle outside click to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Detect Chrome's webkitSpeechRecognition availability on the client
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const { userAgent } = window.navigator;
      // Edge includes "Edg" and "Chrome", so we must exclude it
      const isEdge = userAgent.includes('Edg');
      const isChrome = userAgent.includes('Chrome');
      
      setIsVoiceSupported(isChrome && !isEdge);
    } else {
      setIsVoiceSupported(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsTyping(true);

    if (value.length > 0) {
      const filtered = breeds.filter(breed => 
        breed.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelect = (breed: Breed) => {
    setQuery(breed.name);
    setShowSuggestions(false);
    onSelectBreed(breed.name);
    setIsTyping(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageSelect) {
      onImageSelect(file);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if ('webkitSpeechRecognition' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recognition = new (window as any).webkitSpeechRecognition();
      recognitionRef.current = recognition;
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
        setQuery(''); // Clear previous query when starting new voice search
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentTranscript = finalTranscript || interimTranscript;
        setQuery(currentTranscript);
        setIsTyping(true);
        
        // Update suggestions based on current transcript
        if (currentTranscript.length > 0) {
             const filtered = breeds.filter(breed => 
                breed.name.toLowerCase().includes(currentTranscript.toLowerCase())
              );
              setSuggestions(filtered);
              setShowSuggestions(true);
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'network') {
          setVoiceError('Network error: Voice search requires an internet connection.');
        } else if (event.error === 'not-allowed') {
          setVoiceError('Microphone access denied. Please allow access.');
        } else if (event.error === 'no-speech') {
          setVoiceError('No speech detected. Please try again.');
        } else {
          setVoiceError(`Voice search error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Voice input is not supported in this browser.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file && onImageSelect) {
      onImageSelect(file);
    }
  };

  return (
    <div className="w-full relative z-50">
      <div 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative flex items-center w-full h-16 md:h-20 rounded-full bg-white dark:bg-slate-800 shadow-2xl transition-all duration-300 border-2 ${isTyping || showSuggestions ? 'border-indigo-500 ring-4 ring-indigo-500/20 shadow-indigo-500/30' : 'border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-indigo-500/10'}`}
      >
        
        {/* Search Icon */}
        <div className="pl-6 md:pl-8 text-slate-400 dark:text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length > 0 && setShowSuggestions(true)}
          className="w-full h-full px-4 md:px-6 text-xl md:text-2xl text-slate-800 dark:text-slate-100 bg-transparent border-none outline-none placeholder-slate-400 dark:placeholder-slate-500 font-medium"
          placeholder={`Search for ${placeholder}`}
          disabled={isLoading}
        />

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />

        <div className="absolute right-3 flex items-center gap-2">
          {/* Image Search Button (Unified) */}
          <button
            onClick={() => setShowImageSearch(true)}
            className="h-12 w-12 md:h-14 md:w-14 flex items-center justify-center rounded-full text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300"
            title="Search by image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* Voice Icon (only in Chrome where webkitSpeechRecognition exists) */}
          {isVoiceSupported && (
            <button 
              onClick={toggleListening}
              className={`h-12 w-12 md:h-14 md:w-14 flex items-center justify-center rounded-full transition-all duration-300 ${
                isListening 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 scale-110 animate-pulse' 
                  : 'text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
              }`}
              title={isListening ? "Stop listening" : "Search by voice"}
            >
              {isListening ? (
                 <div className="w-4 h-4 bg-white rounded-sm"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div ref={suggestionsRef} className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700 max-h-80 overflow-y-auto z-[100]">
          {suggestions.map((breed, index) => (
            <div
              key={index}
              onClick={() => handleSelect(breed)}
              className="px-4 py-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer flex items-center gap-4 transition-colors text-slate-700 dark:text-slate-200 border-b border-slate-50 dark:border-slate-700/50 last:border-none"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={`/breeds/${breed.id}/1.jpg`} 
                  alt={breed.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=Dog';
                  }}
                />
              </div>
              <span className="font-medium text-lg">{breed.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Voice Error Message */}
      {voiceError && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 text-red-600 dark:text-red-300 rounded-xl text-sm text-center animate-fade-in">
          {voiceError}
        </div>
      )}

      <ImageSearchModal 
        isOpen={showImageSearch}
        onClose={() => setShowImageSearch(false)}
        onCapture={(file) => {
          if (onImageSelect) {
            onImageSelect(file);
          }
        }}
      />
    </div>
  );
}
