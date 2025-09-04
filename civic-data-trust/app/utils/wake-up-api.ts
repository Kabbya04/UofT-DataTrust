export async function wakeUpAPI(): Promise<boolean> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://civic-data-trust-backend.onrender.com/api/v1';
  const baseUrl = API_BASE_URL.replace('/api/v1', '');
  
  console.log('Attempting to wake up API at:', baseUrl);
  
  try {
    // First try to ping the docs endpoint to wake up the server
    const response = await fetch(`${baseUrl}/docs`, {
      method: 'GET',
      mode: 'no-cors', // This will at least trigger the request even if we can't read response
    });
    
    console.log('Wake-up request sent');
    return true;
  } catch (error) {
    console.error('Wake-up request failed:', error);
    return false;
  }
}

export async function testAPIEndpoint(endpoint: string = '/auth/signup'): Promise<void> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://civic-data-trust-backend.onrender.com/api/v1';
  
  try {
    // Test with OPTIONS request first (CORS preflight)
    const optionsResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    });
    
    console.log('OPTIONS response:', {
      status: optionsResponse.status,
      headers: Object.fromEntries(optionsResponse.headers.entries()),
    });
  } catch (error) {
    console.error('OPTIONS request failed:', error);
  }
}