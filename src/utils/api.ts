export function getApiUrl() {
  // Check for client-side local storage override
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('custom_api_url');
    if (customUrl) {
      return customUrl.endsWith('/') ? customUrl.slice(0, -1) : customUrl;
    }
  }

  // Fallback to environment variable
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }

  // If no URL is found, return empty string.
  // The caller is responsible for handling missing URLs (e.g., redirecting to config).
  return '';
  
  return '';
}

export async function checkApiHealth(url: string): Promise<boolean> {
  try {
    // We use 'no-cors' mode because we just want to know if it's online, 
    // and the backend might not have CORS set up for the health check specifically yet.
    // However, 'no-cors' returns an opaque response which is always "ok" even if 404.
    // But if the server is down (connection refused), it will throw.
    // For ngrok specifically, it returns a 200 OK HTML page when "offline" (the error page).
    // So we actually NEED to read the body or status to detect the ngrok error page.
    // If we can't read the body due to CORS, we might be in trouble.
    // Let's assume the backend allows CORS or we are proxying.
    // Actually, the user said "ngrok returns an error page". 
    // If we fetch it, we might get that HTML.
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(`${url}/`, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true' // Skip ngrok warning page if present
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    // If we get a 200 OK, we need to check if it's the ngrok error page
    // The ngrok error page usually has a specific title or content.
    // But if we have CORS issues, we can't read the body.
    // Let's assume for now that a successful fetch means it's "online" enough to try.
    // The user specifically mentioned the ERR_NGROK_3200 page.
    // If the response is HTML and contains "ERR_NGROK", it's bad.
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
        // If we expect a JSON API but get HTML, it's likely the ngrok error page or warning page
        // For this specific app, the root '/' might be 404 or JSON, but likely not a full HTML page unless it's the backend docs.
        // Let's try to read the text if possible.
        try {
            const text = await response.text();
            if (text.includes('ERR_NGROK') || text.includes('ngrok-free.app is offline')) {
                return false;
            }
        } catch (e) {
            // Ignore body read errors
        }
    }

    return true;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}
