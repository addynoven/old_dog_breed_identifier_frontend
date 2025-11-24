import { createClient } from 'redis';

export interface FileRecord {
  fileName: string;
  s3Url: string;
  expiresAt: string; // ISO date string
  downloadCount: number;
  // Prediction cache fields
  labelNumber?: number;
  breedName?: string;
  breedInfo?: string;
  predictedAt?: string;
}

async function createValkeyClient() {
  const client = createClient({
    url: process.env.AIVEN_VALKEY_URI,
    socket: {
      connectTimeout: 60000, // 60 seconds
    },
  });
  
  await client.connect();
  return client;
}

export async function setFileRecord(shortId: string, data: FileRecord): Promise<void> {
  const client = await createValkeyClient();
  
  try {
    const key = `file:${shortId}`;
    const setPromise = client.set(key, JSON.stringify(data));
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Set operation timeout")), 5000)
    );
    
    await Promise.race([setPromise, timeoutPromise]);
    console.log(`📝 Stored file record: ${shortId}, expires: ${data.expiresAt}`);
  } finally {
    if (client.isOpen) {
      await client.quit();
    }
  }
}

export async function getFileRecord(shortId: string): Promise<FileRecord | null> {
  const client = await createValkeyClient();
  
  try {
    const key = `file:${shortId}`;
    const getPromise = client.get(key);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Get operation timeout")), 5000)
    );
    
    const data = await Promise.race([getPromise, timeoutPromise]);
    
    if (!data || typeof data !== 'string') {
      console.log(`❌ File record not found: ${shortId}`);
      return null;
    }
    
    const record: FileRecord = JSON.parse(data);
    const now = new Date();
    const expiresAt = new Date(record.expiresAt);
    
    if (now > expiresAt) {
      console.log(`⏰ File expired: ${shortId}, expired at: ${record.expiresAt}`);
      
      // Delete expired record
      const delPromise = client.del(key);
      const delTimeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Delete operation timeout")), 5000)
      );
      
      await Promise.race([delPromise, delTimeoutPromise]);
      console.log(`🗑️ Deleted expired record: ${shortId}`);
      
      return null;
    }
    
    console.log(`✅ File record found and valid: ${shortId}`);
    return record;
  } finally {
    if (client.isOpen) {
      await client.quit();
    }
  }
}

export async function updateFileRecord(shortId: string, data: FileRecord): Promise<void> {
  const client = await createValkeyClient();
  
  try {
    const key = `file:${shortId}`;
    const setPromise = client.set(key, JSON.stringify(data));
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Update operation timeout")), 5000)
    );
    
    await Promise.race([setPromise, timeoutPromise]);
    console.log(`📝 Updated file record: ${shortId}`);
  } finally {
    if (client.isOpen) {
      await client.quit();
    }
  }
}

export async function deleteFileRecord(shortId: string): Promise<void> {
  const client = await createValkeyClient();
  
  try {
    const key = `file:${shortId}`;
    const delPromise = client.del(key);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Delete operation timeout")), 5000)
    );
    
    await Promise.race([delPromise, timeoutPromise]);
    console.log(`🗑️ Deleted file record: ${shortId}`);
  } finally {
    if (client.isOpen) {
      await client.quit();
    }
  }
}
