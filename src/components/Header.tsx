'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 py-6 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 bg-white/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-sm hover:bg-white/40 transition-all">
          <span className="text-2xl">🐕</span>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">
            DogID<span className="text-indigo-600">.ai</span>
          </h1>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 bg-white/30 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 shadow-sm">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <Link href="/about" className="hover:text-indigo-600 transition-colors">About</Link>
          <Link href="/breeds" className="hover:text-indigo-600 transition-colors">Breeds</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 bg-white/30 backdrop-blur-md rounded-full border border-white/20 shadow-sm"
        >
          <span className="text-xl">{isMenuOpen ? '✕' : '☰'}</span>
        </button>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="absolute top-full left-4 right-4 mt-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-4 flex flex-col gap-4 text-center md:hidden animate-fade-in-down">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="hover:text-indigo-600 transition-colors py-2">Home</Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="hover:text-indigo-600 transition-colors py-2">About</Link>
            <Link href="/breeds" onClick={() => setIsMenuOpen(false)} className="hover:text-indigo-600 transition-colors py-2">Breeds</Link>
          </div>
        )}
      </div>
    </header>
  );
}
