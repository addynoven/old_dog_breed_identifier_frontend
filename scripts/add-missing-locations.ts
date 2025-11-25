import fs from 'fs';
import path from 'path';

const breedDataPath = path.join(process.cwd(), 'public', 'breed-data.json');
const locationPath = path.join(process.cwd(), 'public', 'location.json');

const breedData = JSON.parse(fs.readFileSync(breedDataPath, 'utf-8'));
const locationData = JSON.parse(fs.readFileSync(locationPath, 'utf-8'));

// Coordinate mapping for origins found in missing breeds
const originCoords: Record<string, { lat: number, lng: number, country: string }> = {
  "Tibet/China": { lat: 31.6927, lng: 88.0924, country: "China" },
  "Switzerland": { lat: 46.8182, lng: 8.2275, country: "Switzerland" },
  "France": { lat: 46.2276, lng: 2.2137, country: "France" },
  "Germany": { lat: 51.1657, lng: 10.4515, country: "Germany" },
  "Canadian Arctic": { lat: 70.4692, lng: -86.1234, country: "Canada" },
  "Alaska": { lat: 64.2008, lng: -149.4937, country: "United States" },
  "Central Africa": { lat: 6.6111, lng: 20.9394, country: "Central African Republic" },
  "Siberia": { lat: 61.5240, lng: 105.3188, country: "Russia" },
  "China": { lat: 35.8617, lng: 104.1954, country: "China" },
  "Newfoundland, Canada": { lat: 53.1355, lng: -57.6604, country: "Canada" },
  "Pyrenees Mountains": { lat: 42.6724, lng: 0.5568, country: "France" }, // Or Spain
  "Pomerania (Germany/Poland)": { lat: 53.4285, lng: 14.5528, country: "Germany" },
  "Netherlands": { lat: 52.1326, lng: 5.2913, country: "Netherlands" },
  "Belgium": { lat: 50.5039, lng: 4.4699, country: "Belgium" },
  "South and Southeast Asia": { lat: 20.5937, lng: 78.9629, country: "India" }, // Generic
  "Wales, United Kingdom": { lat: 52.1307, lng: -3.7837, country: "United Kingdom" },
  "Wales": { lat: 52.1307, lng: -3.7837, country: "United Kingdom" },
  "Mexico": { lat: 23.6345, lng: -102.5528, country: "Mexico" },
  "Australia": { lat: -25.2744, lng: 133.7751, country: "Australia" }
};

let addedCount = 0;

Object.entries(breedData).forEach(([key, value]: [string, any]) => {
  // Parse breed name from key (e.g., "n02085620-Chihuahua")
  let name = key.split('-').slice(1).join('-');
  
  // Normalize to Title Case
  name = name.replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  if (!locationData[name]) {
      const origin = value.origin;
      const coords = originCoords[origin];
      
      if (coords) {
          locationData[name] = {
              origin: coords.country,
              lat: coords.lat,
              lng: coords.lng
          };
          console.log(`Added ${name} (${origin}) -> ${coords.country}`);
          addedCount++;
      } else {
          console.log(`Skipping ${name}: No coordinates for origin "${origin}"`);
      }
  }
});

if (addedCount > 0) {
    fs.writeFileSync(locationPath, JSON.stringify(locationData, null, 2));
    console.log(`\nSuccessfully added ${addedCount} breeds to location.json`);
} else {
    console.log('\nNo new breeds added.');
}
