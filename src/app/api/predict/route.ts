
import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl } from '../../../utils/api';
import { getBreedNameFromLabel } from '../../../lib/breed-utils';
import { closureCache } from '../../../lib/closure-cache';
import { getCache, setCache } from '../../../lib/valkey-operations';

// Helper to get the base URL for internal API calls
function getBaseUrl() {
  // In Vercel, use VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // In production with custom domain
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  // Local development
  return 'http://localhost:3000';
}

export async function POST(request: NextRequest) {
  try {
    const { fileHash } = await request.json();
    // Check closure cache first
    if (closureCache.has(fileHash)) {
      console.log('🎯 Closure cache HIT for:', fileHash);
      const cached = closureCache.get(fileHash)!;
      return NextResponse.json({ 
        ...cached.prediction,
        breed_info: cached.breedInfo,
        cached: 'closure'
      });
    }

    console.log('❌ Closure cache MISS, trying Redis/Valkey for:', fileHash);

    // Check Redis cache
    const cacheData = await getCache(`file:${fileHash}`);

    if (cacheData && typeof cacheData === 'number') {
      const breedName = getBreedNameFromLabel(cacheData);
      const prediction = { 
        label_number: cacheData,
        breed_name: breedName,
        cached: 'valkey' 
      };
      
      // Get breed info and cache in closure
      const breedInfoResponse = await fetch(`${getBaseUrl()}/api/breed-info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ breedName })
      });
      
      const breedInfo = breedInfoResponse.ok ? (await breedInfoResponse.json()).breedInfo : '';
      closureCache.set(fileHash, prediction, breedInfo);
      
      return NextResponse.json({ ...prediction, breed_info: breedInfo });
    }

    // Call FastAPI backend
    const bucketName = process.env.TEBI_BUCKET_NAME;
    const imageUrl = `https://s3.tebi.io/${bucketName}/${fileHash}`;

    const customBackendUrl = request.headers.get('x-backend-url');
    const backendUrl = `${customBackendUrl || getApiUrl()}/predict`;
    console.log('🔗 Calling backend URL:', backendUrl);
    console.log('📦 With image URL:', imageUrl);

    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl })
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      if (backendResponse.status === 400 && errorData.detail) {
        return NextResponse.json({ error: errorData.detail }, { status: 400 });
      }
      throw new Error(`Backend failed with status ${backendResponse.status}`);
    }

    const backendData = await backendResponse.json();
    const labelNumber = backendData.label_number;
    const breedName = getBreedNameFromLabel(labelNumber);

    // Get breed info
    const breedInfoResponse = await fetch(`${getBaseUrl()}/api/breed-info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ breedName })
    });
    
    const breedInfo = breedInfoResponse.ok ? (await breedInfoResponse.json()).breedInfo : '';

    // Cache in both Valkey and closure
    // Store just the label number to match what we expect in getCache
    await setCache(`file:${fileHash}`, labelNumber, 86400); // 24 hours TTL

    const prediction = { 
      label_number: labelNumber,
      breed_name: breedName,
      cached: false 
    };
    
    closureCache.set(fileHash, prediction, breedInfo);

    return NextResponse.json({ 
      ...prediction,
      breed_info: breedInfo
    });

  } catch (error) {
    console.error('❌ Prediction error:', error);
    return NextResponse.json(
      { error: 'Prediction failed' },
      { status: 500 }
    );
  }
}
