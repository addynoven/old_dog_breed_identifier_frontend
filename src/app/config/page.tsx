'use client';

import { useState, useEffect } from 'react';

export default function ConfigPage() {
  const [currentUrl, setCurrentUrl] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [message, setMessage] = useState('');

  const [hasCustomUrl, setHasCustomUrl] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load current state
    const stored = localStorage.getItem('custom_api_url');
    if (stored) {
      setCustomUrl(stored);
      setCurrentUrl(stored);
      setHasCustomUrl(true);
    } else if (process.env.NEXT_PUBLIC_API_URL) {
      setCurrentUrl(process.env.NEXT_PUBLIC_API_URL);
    }
  }, []);

  const handleSave = () => {
    if (!customUrl) {
      setMessage('Please enter a URL');
      return;
    }
    // Basic validation
    try {
      new URL(customUrl);
    } catch {
      setMessage('Invalid URL format');
      return;
    }

    // Remove trailing slash if present
    const sanitizedUrl = customUrl.endsWith('/') ? customUrl.slice(0, -1) : customUrl;

    localStorage.setItem('custom_api_url', sanitizedUrl);
    setCurrentUrl(sanitizedUrl);
    setHasCustomUrl(true);
    setMessage('✅ Custom URL saved! You can now use the app.');
    
    // Redirect to home after saving
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-400">🔧 API Configuration</h1>
        
        <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Current Active API URL:</p>
          <code className="text-green-400 break-all">{currentUrl || 'Not Configured'}</code>
          {process.env.NEXT_PUBLIC_API_URL && !hasCustomUrl && (
            <p className="text-xs text-gray-500 mt-2">(Using default from .env.local)</p>
          )}
        </div>

        <div className="mb-6 p-4 bg-blue-900/30 rounded-lg border border-blue-700/50">
          <h3 className="text-sm font-semibold text-blue-300 mb-2">How to get the URL?</h3>
          <p className="text-xs text-gray-300 mb-3">
            Run the backend in Google Colab, copy the generated URL (e.g., ngrok), and paste it below.
          </p>
          <a 
            href="https://colab.research.google.com/drive/1nPuuJX6MJeH-ZT3PXq8GmIjTQW_pGiPy?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition-colors"
          >
            <span>🚀 Open Google Colab</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Set Backend API URL (Required)
          </label>
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://your-ngrok-url.ngrok-free.app"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
          />
        </div>

        {message && (
          <div className={`mb-6 p-3 rounded text-sm ${message.includes('✅') ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'}`}>
            {message}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Save & Continue
          </button>
        </div>

        <div className="mt-8 text-xs text-gray-500 text-center">
          <p>This setting is stored in <code>localStorage</code>.</p>
          <p>It will persist even if you close the browser.</p>
        </div>
      </div>
    </div>
  );
}
