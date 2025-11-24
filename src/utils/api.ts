export function getApiUrl() {
  // Check for client-side session override
  if (typeof window !== 'undefined') {
    const customUrl = sessionStorage.getItem('custom_api_url');
    if (customUrl) {
      console.log('🔧 Using Custom API URL from session:', customUrl);
      return customUrl.endsWith('/') ? customUrl.slice(0, -1) : customUrl;
    }
  }

  // If we are on the server, we might still need a way to get the URL if it's passed via headers
  // But for this specific utility which is mostly used on client or for default values,
  // we now strictly require the session configuration.
  
  // If no URL is found, redirect to config page instead of throwing error
  if (typeof window !== 'undefined') {
    // Avoid infinite redirect loop if already on config page
    if (!window.location.pathname.includes('/config')) {
      window.location.href = '/config';
    }
    // Return empty string to satisfy return type, though page will redirect
    return '';
  }
  
  // Server-side fallback (should rely on headers in route handlers)
  return '';
}
