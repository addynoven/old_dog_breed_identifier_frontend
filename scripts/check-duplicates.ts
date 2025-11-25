import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'public', 'breed-data.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const data = JSON.parse(rawData);

const entries = Object.entries(data);
console.log(`Total entries: ${entries.length}`);

// Check for duplicate names (if any)
const nameMap = new Map();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const duplicates: any[] = [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
entries.forEach(([key, value]: [string, any]) => {
  // We don't have a 'name' field in the value, but we can infer it from the key or description
  // The key is like "n02085620-Chihuahua"
  const name = key.split('-').slice(1).join('-');
  
  if (nameMap.has(name)) {
    duplicates.push({ name, keys: [nameMap.get(name), key] });
  } else {
    nameMap.set(name, key);
  }
});

if (duplicates.length > 0) {
  console.log('Found duplicate breeds based on ID suffix:');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  duplicates.forEach((d: any) => {
    console.log(`- ${d.name}: ${d.keys.join(', ')}`);
  });
} else {
  console.log('No duplicate breed names found in keys.');
}

// Check if any descriptions are identical (potential copy-paste error)
const descMap = new Map();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const contentDuplicates: any[] = [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
entries.forEach(([key, value]: [string, any]) => {
  const desc = value.description;
  if (descMap.has(desc)) {
    contentDuplicates.push({ key, original: descMap.get(desc) });
  } else {
    descMap.set(desc, key);
  }
});

if (contentDuplicates.length > 0) {
  console.log('\nFound entries with identical descriptions (potential duplicate content):');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contentDuplicates.forEach((d: any) => {
    console.log(`- ${d.key} has same description as ${d.original}`);
  });
} else {
  console.log('\nNo identical descriptions found.');
}
