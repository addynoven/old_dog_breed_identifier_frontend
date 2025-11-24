import { NextRequest, NextResponse } from 'next/server';
import { getFileRecord, deleteFileRecord } from '@/lib/valkey-operations';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'global',
  endpoint: 'https://s3.tebi.io',
  credentials: {
    accessKeyId: process.env.TEBI_ACCESS_KEY!,
    secretAccessKey: process.env.TEBI_SECRET_KEY!,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);

export async function POST(request: NextRequest) {
  try {
    const { shortId } = await request.json();
    
    if (!shortId) {
      return NextResponse.json(
        { error: 'Short ID is required' },
        { status: 400 }
      );
    }
    
    const fileRecord = await getFileRecord(shortId);
    
    if (fileRecord && typeof fileRecord === 'object' && 's3Url' in fileRecord) {
      const s3Key = fileRecord.s3Url.split('/').pop();
      
      if (s3Key) {
        await s3Client.send(new DeleteObjectCommand({
          Bucket: process.env.TEBI_BUCKET_NAME || '',
          Key: s3Key,
        }));
      }
    }
    
    await deleteFileRecord(shortId);
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
