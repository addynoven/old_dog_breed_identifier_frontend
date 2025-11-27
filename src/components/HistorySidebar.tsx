'use client';

import { useState, useEffect } from 'react';
import { useHistoryStore, HistoryItem } from '../lib/history-store';
import { FaHistory, FaTrash, FaCalendarAlt, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (breedName: string) => void;
}

export default function HistorySidebar({ isOpen, onClose, onSelect }: HistorySidebarProps) {
  const { history, removeFromHistory, clearHistory } = useHistoryStore();

  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  useEffect(() => {
    if (isConfirmingClear) {
      const timer = setTimeout(() => setIsConfirmingClear(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isConfirmingClear]);

  // Group history by date
  const groupedHistory = history.reduce((groups, item) => {
    const date = new Date(item.timestamp).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, HistoryItem[]>);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/20 dark:bg-black/50 backdrop-blur-sm md:hidden"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 bottom-0 md:top-24 left-0 z-40 w-80 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col border-r border-slate-200 dark:border-slate-800/50 shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <h2 className="font-semibold flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
                <FaHistory className="text-indigo-500 dark:text-indigo-400" />
                History
              </h2>
              <div className="flex items-center gap-1">
                {history.length > 0 && (
                  <button
                    onClick={() => {
                      if (isConfirmingClear) {
                        clearHistory();
                        setIsConfirmingClear(false);
                      } else {
                        setIsConfirmingClear(true);
                      }
                    }}
                    className={`p-1.5 rounded-md transition-all flex items-center gap-1 ${
                      isConfirmingClear 
                        ? 'bg-red-500 text-white hover:bg-red-600 px-3' 
                        : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400'
                    }`}
                    title="Clear All"
                  >
                    <FaTrash className="text-xs" />
                    {isConfirmingClear && <span className="text-xs font-bold">Confirm?</span>}
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md text-slate-500 dark:text-slate-400 md:hidden"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hide">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-4 px-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                    <FaHistory className="text-3xl opacity-30" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-600 dark:text-slate-300">No history yet</p>
                    <p className="text-xs mt-1">Your identified dogs will appear here.</p>
                  </div>
                </div>
              ) : (
                Object.entries(groupedHistory).map(([date, items]) => (
                  <div key={date}>
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">
                        {date}
                      </h3>
                      <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                    </div>
                    
                    <div className="space-y-4">
                      {items.map((item) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          key={item.id}
                          className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-indigo-500/30 dark:hover:border-indigo-500/30"
                        >
                          <button
                            onClick={() => {
                              onSelect(item.breedName);
                              if (window.innerWidth < 768) onClose();
                            }}
                            className="w-full text-left"
                          >
                            {/* Image Area */}
                            <div className="relative w-full h-40 bg-slate-100 dark:bg-slate-950">
                              <Image
                                src={item.image}
                                alt={item.breedName}
                                fill
                                className="object-contain transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                              
                              <div className="absolute bottom-3 left-3 right-3 text-white">
                                <h4 className="font-bold text-lg leading-tight shadow-black drop-shadow-md">
                                  {item.breedName}
                                </h4>
                              </div>
                            </div>

                            {/* Details Area */}
                            <div className="p-3 flex items-center justify-between bg-white dark:bg-slate-900">
                              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                <span>
                                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromHistory(item.id);
                            }}
                            className="absolute top-2 right-2 p-2 bg-black/40 hover:bg-red-500 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100"
                            title="Remove from history"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-600 text-center bg-slate-50 dark:bg-slate-950">
              Stored locally on device
            </div>
            
            <style jsx global>{`
              .scrollbar-hide::-webkit-scrollbar {
                  display: none;
              }
              .scrollbar-hide {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
              }
            `}</style>
          </motion.div>
            

        </>
      )}
    </AnimatePresence>
  );
}
