export async function testAPIConnection() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://civic-data-trust-backend.onrender.com/api/v1';
  
  try {
    // Try to access the docs endpoint which should be available
    const response = await fetch(`${API_BASE_URL.replace('/api/v1', '')}/docs`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
    });
    
    console.log('API Test Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });
    
    if (response.ok) {
      const text = await response.text();
      console.log('API Response Body:', text);
      return true;
    } else {
      console.error('API not accessible:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('API Connection Error:', error);
    return false;
  }
}