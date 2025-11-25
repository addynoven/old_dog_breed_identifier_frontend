import fs from 'fs';
import path from 'path';

const breedDataPath = path.join(process.cwd(), 'public', 'breed-data.json');
const locationPath = path.join(process.cwd(), 'public', 'location.json');

const breedData = JSON.parse(fs.readFileSync(breedDataPath, 'utf-8'));
const locationData = JSON.parse(fs.readFileSync(locationPath, 'utf-8'));

const missingBreeds: { name: string, origin: string }[] = [];

Object.entries(breedData).forEach(([key, value]: [string, any]) => {
  // Parse breed name from key (e.g., "n02085620-Chihuahua")
  let name = key.split('-').slice(1).join('-');
  
  // Normalize to Title Case (replace _ with space, capitalize words)
  // This matches the frontend logic
  name = name.replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  // Check if it exists in location.json
  if (!locationData[name]) {
      missingBreeds.push({
          name: name,
          origin: value.origin || 'Unknown'
      });
  }
});

console.log(`Found ${missingBreeds.length} breeds missing from location.json:`);
missingBreeds.forEach(b => {
    console.log(`- ${b.name} (Origin: ${b.origin})`);
});

// Also check for "Unknown" origins in location.json if any (though structure is usually just missing)
