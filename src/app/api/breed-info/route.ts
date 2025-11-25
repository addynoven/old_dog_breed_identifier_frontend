import { NextRequest, NextResponse } from 'next/server';
import breedData from '../../../../public/breed-data.json';

export async function POST(request: NextRequest) {
  try {
    const { breedName } = await request.json();
    
    if (!breedName) {
      return NextResponse.json({ error: 'Breed name is required' }, { status: 400 });
    }

    // Find the breed in the local data
    // The keys in breed-data.json are like "n02085620-Chihuahua"
    // The breedName from the request is like "Chihuahua" or "German Shepherd"
    
    const entries = Object.entries(breedData);
    const match = entries.find(([key]) => {
      // Check if the key ends with the breed name (handling spaces/underscores if needed)
      // The keys usually have underscores for spaces, e.g. "German_Shepherd"
      const normalizedKey = key.toLowerCase().replace(/_/g, ' ');
      const normalizedQuery = breedName.toLowerCase();
      return normalizedKey.includes(normalizedQuery);
    });

    if (match) {
      const [, data] = match;
      return NextResponse.json({ breedInfo: data });
    } else {
      console.warn(`Breed not found in local data: ${breedName}`);
      // Fallback or return 404
      return NextResponse.json({ 
        breedInfo: {
          description: `Information for ${breedName} is currently unavailable.`,
          traits: [],
          origin: 'Unknown',
          height: 'Unknown',
          weight: 'Unknown',
          lifespan: 'Unknown',
          coatType: 'Unknown',
          activityLevel: 'Unknown',
          rarity: 'Unknown',
          goodWithKids: 'Unknown'
        } 
      });
    }

  } catch (error) {
    console.error('Error in breed-info API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
