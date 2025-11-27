'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaTrophy, FaRedo, FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';
import labels from '../../../public/labels.json';
import confetti from 'canvas-confetti';

interface Breed {
  id: string;
  name: string;
}

export default function BreedQuizGame() {
  const [currentBreed, setCurrentBreed] = useState<Breed | null>(null);
  const [options, setOptions] = useState<Breed[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Parse all breeds from labels
  const allBreeds: Breed[] = Object.entries(labels).map(([, label]) => {
    const parts = label.split('-');
    const name = parts.slice(1).join('-').replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    return { id: label, name };
  });

  const startNewRound = useCallback(() => {
    setIsLoading(true);
    setIsRevealed(false);
    setSelectedOption(null);

    // Pick a random correct breed
    const correctIndex = Math.floor(Math.random() * allBreeds.length);
    const correct = allBreeds[correctIndex];
    setCurrentBreed(correct);

    // Pick 3 random wrong options
    const wrongOptions: Breed[] = [];
    while (wrongOptions.length < 3) {
      const idx = Math.floor(Math.random() * allBreeds.length);
      const breed = allBreeds[idx];
      if (breed.id !== correct.id && !wrongOptions.find(b => b.id === breed.id)) {
        wrongOptions.push(breed);
      }
    }

    // Shuffle options
    const allOptions = [...wrongOptions, correct].sort(() => Math.random() - 0.5);
    setOptions(allOptions);

    // Get random image (assuming 1-3 images per breed exist)
    // We need to parse the ID from the label key which is not directly available in the value
    // But we know the structure of labels.json values is "n02085620-Chihuahua"
    // The folder name IS this value.
    const randomImgNum = Math.floor(Math.random() * 3) + 1;
    setImageUrl(`/breeds/${correct.id}/${randomImgNum}.jpg`);
    
    // Simulate image load delay slightly for effect
    setTimeout(() => setIsLoading(false), 500);
  }, [allBreeds]);

  useEffect(() => {
    startNewRound();
    // Load high score from local storage
    const saved = localStorage.getItem('breedQuizHighScore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const handleGuess = (breedId: string) => {
    if (isRevealed || !currentBreed) return;

    setSelectedOption(breedId);
    setIsRevealed(true);

    if (breedId === currentBreed.id) {
      // Correct
      const newScore = score + 10 + (streak * 2);
      setScore(newScore);
      setStreak(s => s + 1);
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('breedQuizHighScore', newScore.toString());
      }
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      // Incorrect
      setStreak(0);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header Stats */}
      <div className="flex justify-between items-center mb-4 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-[10px] text-slate-500 uppercase font-bold">Score</p>
            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{score}</p>
          </div>
          <div className="text-center px-4 border-l border-slate-200 dark:border-slate-700">
            <p className="text-[10px] text-slate-500 uppercase font-bold">Streak</p>
            <p className="text-xl font-bold text-orange-500">🔥 {streak}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
          <FaTrophy className="text-yellow-500" />
          <span className="font-bold">High Score: {highScore}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Image Section */}
        <div className="relative h-[400px] w-full bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-inner border-4 border-white dark:border-slate-700">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              <Image
                src={imageUrl}
                alt="Guess the breed"
                fill
                className={`object-contain transition-all duration-700 ${isRevealed ? 'scale-100' : 'scale-105'}`}
              />
            </>
          )}
        </div>

        {/* Options Section */}
        <div className="flex flex-col justify-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 text-center md:text-left">
            {isRevealed 
              ? `It's a ${currentBreed?.name}!` 
              : "Who's that Dog Breed?"}
          </h2>

          <div className="grid gap-3">
            {options.map((option) => {
              let state = 'default';
              if (isRevealed) {
                if (option.id === currentBreed?.id) state = 'correct';
                else if (option.id === selectedOption) state = 'wrong';
                else state = 'dimmed';
              }

              return (
                <motion.button
                  key={option.id}
                  onClick={() => handleGuess(option.id)}
                  disabled={isRevealed}
                  whileHover={!isRevealed ? { scale: 1.02 } : {}}
                  whileTap={!isRevealed ? { scale: 0.98 } : {}}
                  className={`
                    p-4 rounded-xl text-left font-semibold transition-all border-2 flex justify-between items-center
                    ${state === 'default' ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400' : ''}
                    ${state === 'correct' ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400' : ''}
                    ${state === 'wrong' ? 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400' : ''}
                    ${state === 'dimmed' ? 'opacity-50 bg-slate-50 dark:bg-slate-900 border-transparent' : ''}
                  `}
                >
                  <span>{option.name}</span>
                  {state === 'correct' && <FaCheck />}
                  {state === 'wrong' && <FaTimes />}
                </motion.button>
              );
            })}
          </div>

          {isRevealed && (
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href={`/dashboard?breed=${encodeURIComponent(currentBreed?.name || '')}`}
                target="_blank"
                className="w-full py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
              >
                <FaInfoCircle />
                Learn more about {currentBreed?.name}
              </Link>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={startNewRound}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all"
              >
                <FaRedo />
                Play Again
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
