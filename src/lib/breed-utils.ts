import labels from '../../public/labels.json';

export function getBreedNameFromLabel(labelNumber: number): string | null {
  const labelKey = labelNumber.toString();
  const fullLabel = labels[labelKey as keyof typeof labels];
  
  if (!fullLabel) {
    return null;
  }
  
  // Split by "-" and take the part after the first "-"
  const parts = fullLabel.split('-');
  if (parts.length < 2) {
    return null;
  }
  
  // Join all parts after the first one and replace underscores with spaces
  const breedName = parts.slice(1).join('-').replace(/_/g, ' ');
  
  // Capitalize first letter of each word
  return breedName.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getBreedInfo(breedName: string): Promise<any> {
  try {
    // 0. Check local JSON file (Fastest)
    // Fetch the JSON file from the public directory
    try {
      const response = await fetch('/breed-data.json');
      if (response.ok) {
        const breedData = await response.json();
        const localEntry = Object.entries(breedData).find(([key]) => {
          const parts = key.split('-');
          if (parts.length < 2) return false;
          const nameFromKey = parts.slice(1).join('-').replace(/_/g, ' ');
          return nameFromKey.toLowerCase() === breedName.toLowerCase();
        });

        if (localEntry) {
          console.log('⚡ Using local breed data for:', breedName);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return localEntry[1] as any;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch local breed data, falling back to cache/API', e);
    }

    // First check if breed info is cached
    const cacheResponse = await fetch('/api/valkey/get-record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shortId: `breed:${breedName}` })
    });

    if (cacheResponse.ok) {
      const data = await cacheResponse.json();
      if (data.record && data.record.breedInfo) {
        console.log('📚 Using cached breed info for:', breedName);
        return data.record.breedInfo;
      }
    }

    // If not cached, fetch from Gemini
    console.log('🤖 Fetching breed info from Gemini for:', breedName);
    const breedInfo = await fetchBreedInfoFromGemini(breedName);
    
    // Cache the breed info
    await cacheBreedInfo(breedName, breedInfo);
    
    return breedInfo;
  } catch (err) {
    console.error('Error getting breed info:', err);
    return "Could not retrieve detailed information for this breed.";
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchBreedInfoFromGemini(breedName: string): Promise<any> {
  try {
    console.log('🤖 Calling backend API for breed info:', breedName);
    
    const response = await fetch('/api/breed-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ breedName })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend API Error:', response.status, errorData);
      throw new Error(`Backend API failed: ${errorData.error}`);
    }

    const result = await response.json();
    return result.breedInfo;
    
  } catch (err) {
    console.error("Error fetching breed info from backend:", err);
    throw err;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function cacheBreedInfo(breedName: string, breedInfo: any): Promise<void> {
  try {
    const record = {
      breedName,
      breedInfo,
      cachedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };

    await fetch('/api/valkey/set-record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shortId: `breed:${breedName}`, data: record })
    });

    console.log('💾 Cached breed info for:', breedName);
  } catch (err) {
    console.error('Error caching breed info:', err);
  }
}
