import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    const outputPath = path.join(process.cwd(), 'public', 'breed-data.json');
    
    // Read existing data to merge (optional, but good for safety)
    let existingData = {};
    if (fs.existsSync(outputPath)) {
      try {
        existingData = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      } catch (e) {
        console.warn('Failed to read existing breed-data.json', e);
      }
    }

    // Merge new data
    const updatedData = { ...existingData, ...data };

    // Write to file
    fs.writeFileSync(outputPath, JSON.stringify(updatedData, null, 2));

    return NextResponse.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Failed to save breed data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
