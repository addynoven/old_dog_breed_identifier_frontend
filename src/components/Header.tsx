'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import CollectionModal from './CollectionModal';
import { FaUserCircle, FaHistory, FaTrophy, FaGamepad, FaSignOutAlt } from 'react-icons/fa';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="absolute top-0 left-0 right-0 z-50 py-6 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle (Desktop) */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="hidden md:flex items-center justify-center w-10 h-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-xl border border-white/20 dark:border-slate-700/30 shadow-sm hover:bg-white/80 dark:hover:bg-slate-800 transition-all text-slate-700 dark:text-slate-300"
              title="Toggle History"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <Link href="/" className="flex items-center gap-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 dark:border-slate-700/30 shadow-sm hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all">
            <Image 
              src="/logo.png" 
              alt="DogID Logo" 
              width={32} 
              height={32} 
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              DogID<span className="text-indigo-600 dark:text-indigo-400">.ai</span>
            </h1>
          </Link>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 dark:border-slate-700/30 shadow-sm">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
          <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About</Link>
          <Link href="/breeds" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Breeds</Link>
          


          <div className="pl-6 border-l border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <ThemeToggle />
            {session?.user ? (
              <div className="relative pl-4 border-l border-slate-200 dark:border-slate-700">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  {session.user.image ? (
                    <Image 
                      src={session.user.image} 
                      alt={session.user.name || 'User'} 
                      width={32} 
                      height={32} 
                      className="rounded-full ring-2 ring-indigo-500/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <FaUserCircle />
                    </div>
                  )}
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-fade-in-down z-50">
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{session.user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{session.user.email}</p>
                    </div>
                    
                    <div className="py-1">
                      <button 
                        onClick={() => {
                          setIsCollectionOpen(true);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-sm text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <FaTrophy className="text-yellow-500" />
                        My Collection
                      </button>
                      
                      {onToggleSidebar && (
                        <button 
                          onClick={() => {
                            onToggleSidebar();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-sm text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                        >
                          <FaHistory className="text-blue-500" />
                          History
                        </button>
                      )}

                      <Link 
                        href="/games"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full px-4 py-2 text-sm text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <FaGamepad className="text-purple-500" />
                        Games
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 py-1">
                      <button 
                        onClick={() => signOut()}
                        className="w-full px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2"
                      >
                        <FaSignOutAlt />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => import('next-auth/react').then(({ signIn }) => signIn("github", { redirectTo: "/dashboard" }))}
                className="ml-4 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-full transition-colors shadow-sm shadow-indigo-500/20"
              >
                Sign In
              </button>
            )}
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
            


            {session?.user ? (
              <button 
                onClick={() => signOut()}
                className="text-slate-800 dark:text-slate-200 hover:text-red-500 transition-colors py-2 border-t border-slate-200 dark:border-slate-700"
              >
                Sign Out
              </button>
            ) : (
              <button 
                onClick={() => import('next-auth/react').then(({ signIn }) => signIn("github", { redirectTo: "/dashboard" }))}
                className="text-indigo-600 dark:text-indigo-400 font-medium py-2 border-t border-slate-200 dark:border-slate-700"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </div>
      <CollectionModal isOpen={isCollectionOpen} onClose={() => setIsCollectionOpen(false)} />
    </header>
  );
}
