import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://civic-data-trust-backend.onrender.com/api/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('=== Signup Proxy Request ===');
    console.log('Request body:', { ...body, password: '[REDACTED]' });
    console.log('Backend URL:', `${API_BASE_URL}/auth/signup`);
    
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('Backend response status:', response.status, response.statusText);
    console.log('Backend response headers:', Object.fromEntries(response.headers.entries()));

    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
      console.log('Backend response data:', data);
    } else {
      const text = await response.text();
      console.log('Backend response text:', text);
      data = { message: text };
    }
    
    if (!response.ok) {
      console.log('Backend error response:', data);
      return NextResponse.json(
        { error: data.detail || data.message || 'Signup failed' },
        { status: response.status }
      );
    }

    // Extract the user data from the nested response
    const responseData = data.data || data;
    console.log('Extracted signup data:', responseData);
    
    return NextResponse.json(responseData, { status: response.status });
  } catch (error) {
    console.error('=== Signup Proxy Error ===');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Full error:', error);
    
    return NextResponse.json(
      { error: `Proxy error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}