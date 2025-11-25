'use client';
import Link from 'next/link';
import { useState } from 'react';

import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 py-6 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 dark:border-slate-700/30 shadow-sm hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all">
          <span className="text-2xl">🐕</span>
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            DogID<span className="text-indigo-600 dark:text-indigo-400">.ai</span>
          </h1>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 dark:border-slate-700/30 shadow-sm">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
          <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About</Link>
          <Link href="/breeds" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Breeds</Link>
          <div className="pl-6 border-l border-slate-200 dark:border-slate-700">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-full border border-white/20 dark:border-slate-700/30 shadow-sm text-slate-800 dark:text-slate-200"
          >
            <span className="text-xl">{isMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="absolute top-full left-4 right-4 mt-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 dark:border-slate-700/40 p-4 flex flex-col gap-4 text-center md:hidden animate-fade-in-down z-50">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-2">Home</Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-2">About</Link>
            <Link href="/breeds" onClick={() => setIsMenuOpen(false)} className="text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-2">Breeds</Link>
          </div>
        )}
      </div>
    </header>
  );
}
