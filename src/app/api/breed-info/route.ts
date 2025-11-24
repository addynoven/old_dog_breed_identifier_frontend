import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { breedName } = await request.json();
    
    if (!breedName) {
      return NextResponse.json({ error: 'Breed name is required' }, { status: 400 });
    }

    const prompt = `Provide a short, engaging summary (about 50-70 words) for the ${breedName} dog breed. Focus on its temperament, size, and one interesting fact.`;

    const payload = {
      contents: [{ 
        parts: [{ text: prompt }] 
      }]
    };

    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
      method: 'POST',
      headers: { 
        'x-goog-api-key': apiKey!,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to get breed info' }, { status: 500 });
    }

    const result = await response.json();
    
    if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
      return NextResponse.json({ breedInfo: result.candidates[0].content.parts[0].text });
    } else {
      return NextResponse.json({ error: 'Invalid response from Gemini' }, { status: 500 });
    }

  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
