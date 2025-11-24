export function getApiUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    console.error('❌ NEXT_PUBLIC_API_URL is not set!');
    throw new Error('NEXT_PUBLIC_API_URL environment variable is required');
  }
  
  console.log('🔗 Using API URL:', apiUrl);
  return apiUrl;
}
