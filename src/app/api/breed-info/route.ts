import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { breedName } = await request.json();
    
    if (!breedName) {
      return NextResponse.json({ error: 'Breed name is required' }, { status: 400 });
    }

    const prompt = `Provide a detailed summary for the ${breedName} dog breed in strict JSON format. 
    The JSON object must have the following keys:
    - "description": A short, engaging summary (about 50 words).
    - "traits": An array of 3-5 single-word personality traits (e.g., "Loyal", "Smart").
    - "origin": The country or region of origin.
    - "height": Height range (e.g., "22-26 inches").
    - "weight": Weight range (e.g., "50-90 lbs").
    - "lifespan": Life expectancy (e.g., "10-12 years").
    - "coatType": Short description of coat (e.g., "Double coat, medium length").
    - "activityLevel": One of "Low", "Medium", "High".
    - "rarity": "Common", "Rare", or "Very Rare".
    - "goodWithKids": "Yes", "No", or "Supervision Required".

    Do not include any markdown formatting (like \`\`\`json), just the raw JSON object.`;

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
      const text = result.candidates[0].content.parts[0].text;
      // Clean up potential markdown code blocks if Gemini adds them despite instructions
      const jsonString = text.replace(/```json\n?|\n?```/g, '').trim();
      
      try {
        const breedInfo = JSON.parse(jsonString);
        return NextResponse.json({ breedInfo });
      } catch (e) {
        console.error('Failed to parse Gemini JSON:', e);
        // Fallback to text if parsing fails, wrapping it in a basic object structure
        return NextResponse.json({ 
          breedInfo: {
            description: text,
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
    } else {
      return NextResponse.json({ error: 'Invalid response from Gemini' }, { status: 500 });
    }

  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
