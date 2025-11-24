'use client';

import { useState, useEffect } from 'react';
import { getApiUrl } from '@/utils/api';

export default function ConfigPage() {
  const [currentUrl, setCurrentUrl] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load current state
    const stored = sessionStorage.getItem('custom_api_url');
    if (stored) {
      setCustomUrl(stored);
    }
    setCurrentUrl(getApiUrl());
  }, []);

  const handleSave = () => {
    if (!customUrl) {
      setMessage('Please enter a URL');
      return;
    }
    // Basic validation
    try {
      new URL(customUrl);
    } catch (e) {
      setMessage('Invalid URL format');
      return;
    }

    sessionStorage.setItem('custom_api_url', customUrl);
    setCurrentUrl(customUrl);
    setMessage('✅ Custom URL saved! It will persist until you close the tab.');
    
    // Force a reload or just let the user know
    // We don't necessarily need to reload if getApiUrl checks sessionStorage every time
  };

  const handleClear = () => {
    sessionStorage.removeItem('custom_api_url');
    setCustomUrl('');
    // We can't easily get the original env var here without reloading or importing it directly
    // But getApiUrl will return the env var if storage is empty
    // Let's just reload the page to be clean or re-fetch getApiUrl
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-400">🔧 API Configuration</h1>
        
        <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Current Active API URL:</p>
          <code className="text-green-400 break-all">{currentUrl}</code>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Set Custom API URL (Session Only)
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
            Save
          </button>
          <button
            onClick={handleClear}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Reset to Default
          </button>
        </div>

        <div className="mt-8 text-xs text-gray-500 text-center">
          <p>This setting is stored in <code>sessionStorage</code>.</p>
          <p>It will be cleared when you close the browser tab.</p>
        </div>
      </div>
    </div>
  );
}
