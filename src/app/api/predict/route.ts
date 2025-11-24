import { NextRequest, NextResponse } from 'next/server';
import { getBreedNameFromLabel } from '../../../lib/breed-utils';
import { closureCache } from '../../../lib/closure-cache';

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
    const cacheResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/valkey/get-record`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shortId: fileHash })
    });

    if (cacheResponse.ok) {
      const cacheData = await cacheResponse.json();
      if (cacheData.record && typeof cacheData.record === 'number') {
        const breedName = getBreedNameFromLabel(cacheData.record);
        const prediction = { 
          label_number: cacheData.record,
          breed_name: breedName,
          cached: 'valkey' 
        };
        
        // Get breed info and cache in closure
        const breedInfoResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/breed-info`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ breedName })
        });
        
        const breedInfo = breedInfoResponse.ok ? (await breedInfoResponse.json()).breedInfo : '';
        closureCache.set(fileHash, prediction, breedInfo);
        
        return NextResponse.json({ ...prediction, breed_info: breedInfo });
      }
    }

    // Call FastAPI backend
    const bucketName = process.env.TEBI_BUCKET_NAME;
    const imageUrl = `https://s3.tebi.io/${bucketName}/${fileHash}`;

    const backendResponse = await fetch('http://localhost:8000/predict', {
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
    const breedInfoResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/breed-info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ breedName })
    });
    
    const breedInfo = breedInfoResponse.ok ? (await breedInfoResponse.json()).breedInfo : '';

    // Cache in both Valkey and closure
    await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/valkey/set-record`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shortId: fileHash, data: labelNumber })
    });

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

  } catch {
    return NextResponse.json(
      { error: 'Prediction failed' },
      { status: 500 }
    );
  }
}
