export function getApiUrl() {
  // Check for client-side session override
  if (typeof window !== 'undefined') {
    const customUrl = sessionStorage.getItem('custom_api_url');
    if (customUrl) {
      console.log('🔧 Using Custom API URL from session:', customUrl);
      return customUrl;
    }
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    console.error('❌ NEXT_PUBLIC_API_URL is not set!');
    throw new Error('NEXT_PUBLIC_API_URL environment variable is required');
  }
  
  console.log('🔗 Using API URL:', apiUrl);
  return apiUrl;
}
