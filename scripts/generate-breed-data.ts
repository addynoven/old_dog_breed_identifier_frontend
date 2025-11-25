import fs from 'fs';
import path from 'path';

// Load environment variables manually from .env.local
const envPath = path.join(process.cwd(), '.env.local');
let GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  const match = envConfig.match(/GEMINI_API_KEY=(.*)/);
  if (match && match[1]) {
    GEMINI_API_KEY = match[1].trim();
  }
}

const LABELS_PATH = path.join(process.cwd(), 'public', 'labels.json');
const OUTPUT_PATH = path.join(process.cwd(), 'public', 'breed-data.json');

if (!GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY not found in environment or .env.local');
  process.exit(1);
}

// Helper to parse breed name from label
function parseBreedName(label: string): string {
  const parts = label.split('-');
  if (parts.length < 2) return label;
  return parts.slice(1).join('-').replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

async function fetchBreedData(breedName: string) {
  const prompt = `Provide a detailed summary for the ${breedName} dog breed in strict JSON format. 
    The JSON object must have the following keys:
    - "description": A short, engaging summary (about 50 words).
    - "traits": An array of 3-5 single-word personality traits (e.g., "Loyal", "Smart").
    - "origin": The country or region of origin.
    - "height": Height range (e.g., "22-26 inches").
    - "weight": Weight range (e.g., "50-90 lbs").
    - "lifespan": Life expectancy (e.g., "10-12 years").
    - "size": One of "Small", "Medium", "Large", "Giant".
    - "coatType": One of "Short", "Medium", "Long", "Double", "Curly", "Wire".
    - "activityLevel": One of "Low", "Medium", "High".
    - "rarity": One of "Common", "Rare", "Very Rare".
    - "goodWithKids": One of "Yes", "No", "Supervision Required".

    IMPORTANT: For "size", "coatType", "activityLevel", "rarity", and "goodWithKids", you MUST use one of the exact values listed above. Do not use synonyms.

    Do not include any markdown formatting (like \`\`\`json), just the raw JSON object.`;

  const payload = {
    contents: [{ 
      parts: [{ text: prompt }] 
    }]
  };

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: { 
        'x-goog-api-key': GEMINI_API_KEY!,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) throw new Error('No content in response');

    const jsonString = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error(`Failed to fetch data for ${breedName}:`, error);
    return null;
  }
}

async function main() {
  console.log('Starting breed data generation...');

  // Read labels
  const labels = JSON.parse(fs.readFileSync(LABELS_PATH, 'utf-8'));
  const breeds = Object.values(labels).map((label: any) => ({
    id: label,
    name: parseBreedName(label)
  }));

  // Load existing data if any
  let existingData: Record<string, any> = {};
  if (fs.existsSync(OUTPUT_PATH)) {
    existingData = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf-8'));
  }

  console.log(`Found ${breeds.length} breeds. Processing...`);

  for (let i = 0; i < breeds.length; i++) {
    const breed = breeds[i];
    
    if (existingData[breed.id]) {
      console.log(`[${i + 1}/${breeds.length}] Skipping ${breed.name} (already exists)`);
      continue;
    }

    console.log(`[${i + 1}/${breeds.length}] Fetching data for ${breed.name}...`);
    
    const data = await fetchBreedData(breed.name);
    
    if (data) {
      existingData[breed.id] = data;
      // Save incrementally
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify(existingData, null, 2));
    }

    // Rate limiting delay (1 second)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('Data generation complete!');
}

main().catch(console.error);
